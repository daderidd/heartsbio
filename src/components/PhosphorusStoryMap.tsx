import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Source, Layer, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { locales, type Lang } from '../i18n';

/* ─── GeoJSON data sources ─── */
const COUNTRIES_GEOJSON_URL = '/data/ne-countries.geojson';
const NUTS2_GEOJSON_URL = '/data/eu-phosphorus-nuts2.geojson';
const STOCK_COUNTRY_URL = '/data/eu-p-stock-country.geojson';

/* ─── Bivariate color scheme (stock locked level × flux direction) ─── */
const BIVARIATE_COLORS: Record<string, string> = {
  'high-surplus': '#e76f51',  // highly locked + surplus = wasted capital (red-orange)
  'high-deficit': '#9b2226',  // highly locked + deficit = most critical (dark red)
  'low-surplus':  '#e9c46a',  // less locked + surplus = moderate concern (yellow)
  'low-deficit':  '#264653',  // less locked + deficit = declining reserves (dark teal)
  'unknown':      '#1a1a2e',  // no data
};

/* ─── Styles (inline to avoid Astro scoping issues with client:only) ─── */
const styles = {
  wrapper: {
    position: 'relative' as const,
    background: '#111',
  },
  mapFixed: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 0,
  },
  chaptersScroll: {
    position: 'relative' as const,
    zIndex: 1,
    pointerEvents: 'none' as const,
  },
  card: (active: boolean) => ({
    pointerEvents: 'auto' as const,
    maxWidth: '380px',
    marginBottom: '60vh',
    padding: '1.5rem',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '1rem',
    opacity: active ? 1 : 0.4,
    transform: active ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  }),
  progress: {
    position: 'fixed' as const,
    right: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    zIndex: 10,
  },
};

/* ─── Chapter definitions ─── */
interface ChapterText {
  badge: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
  source?: string;
  legendLabels?: [string, string]; // [left label, right label] for the legend bar
}

interface ChapterConfig {
  id: string;
  mapState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
  layerHighlight?: string; // country ISO codes to highlight, comma-separated
  layerColor?: string; // highlight color (default: #7cc98a)
  layerOpacity?: number;
  nuts2Property?: string; // which property to color by (e.g. 'balance_ha', 'total_input_ha', 'locked_value_eur_ha')
  nuts2ColorScale?: [number, string][]; // [value, color] stops for interpolation
  nuts2Visible?: boolean; // whether to show NUTS2 layer for this chapter
  nuts2Filter?: 'surplus' | 'deficit' | null; // filter to show only surplus or deficit regions
  nuts2Bivariate?: boolean; // use bivariate stock×flux coloring
  useCountryStock?: boolean; // show country-level P stock layer instead of NUTS2
}

type Chapter = ChapterConfig & ChapterText;

const BALANCE_SCALE: [number, string][] = [[-25, '#023e8a'], [-10, '#0077b6'], [0, '#1a1a2e'], [5, '#e76f51'], [15, '#f4a261'], [30, '#e9c46a']];

/* Map behaviour per chapter (language independent) */
const chapterConfigs: ChapterConfig[] = [
  {
    id: 'paradox',
    mapState: { longitude: 10, latitude: 52, zoom: 3.8, pitch: 0, bearing: 0 },
    layerOpacity: 0.6,
  },
  {
    id: 'stock',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 10, bearing: 0 },
    layerOpacity: 0.5,
    useCountryStock: true,
    nuts2ColorScale: [[10, '#2d6a4f'], [15, '#52b788'], [20, '#b7c68b'], [25, '#e9c46a'], [32, '#e76f51']],
  },
  {
    id: 'legacy',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: BALANCE_SCALE,
  },
  {
    id: 'legacy-surplus',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: BALANCE_SCALE,
    nuts2Filter: 'surplus',
  },
  {
    id: 'legacy-deficit',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: BALANCE_SCALE,
    nuts2Filter: 'deficit',
  },
  {
    id: 'bivariate',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Bivariate: true,
  },
  {
    id: 'depletion',
    mapState: { longitude: -5, latitude: 32, zoom: 3, pitch: 0, bearing: 0 },
    layerHighlight: 'MAR,CHN,EGY,TUN',
    layerOpacity: 0.5,
  },
  {
    id: 'environment',
    mapState: { longitude: 18, latitude: 58, zoom: 4.2, pitch: 30, bearing: 10 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: BALANCE_SCALE,
  },
  {
    id: 'cadmium',
    mapState: { longitude: 2, latitude: 47, zoom: 5, pitch: 0, bearing: 0 },
    layerHighlight: 'FRA',
    layerColor: '#9b2226',
    layerOpacity: 0.5,
  },
  {
    id: 'regulation',
    mapState: { longitude: 10, latitude: 50, zoom: 4.5, pitch: 0, bearing: 0 },
    layerHighlight: 'NLD,BEL,DEU,FRA,DNK,AUT,IRL,LUX,ITA,ESP,PRT,GRC,POL,CZE,SVK,HUN,ROU,BGR,HRV,SVN,SWE,FIN,EST,LVA,LTU,CYP,MLT',
    layerColor: '#003399',
    layerOpacity: 0.4,
  },
  {
    id: 'opportunity',
    mapState: { longitude: 5.5, latitude: 52.1, zoom: 7, pitch: 40, bearing: -10 },
    layerHighlight: 'NLD',
    layerColor: '#7cc98a',
    layerOpacity: 0.4,
    nuts2Property: 'locked_value_eur_ha',
    nuts2ColorScale: [[0, '#1a1a2e'], [2000, '#2d6a4f'], [3000, '#52b788'], [4000, '#95d5b2'], [5000, '#d4a373']],
  },
];

const NBSP = ' ';

/* Chapter copy per language. Dutch uses decimal commas and "€ 3.100" notation. */
const chapterText: Record<Lang, Record<string, ChapterText>> = {
  en: {
    paradox: {
      badge: 'THE PARADOX',
      title: 'Europe is sitting on a phosphorus fortune it cannot spend',
      body: 'Decades of fertilizer application have loaded agricultural soils across Europe with phosphorus. Yet up to 80% of soil phosphorus is locked, bound to iron, aluminium, and calcium. Inaccessible to crops. The fertilizer-equivalent value of this trapped resource averages ~€3,100 per hectare across the EU.',
      stat: { value: '~€3,100/ha', label: 'of phosphorus locked in EU soils, invisible and inaccessible' },
      source: 'Panagos et al., Sci. Total Environ. (2022); Hinsinger, Plant and Soil (2001)',
    },
    stock: {
      badge: 'THE STOCK',
      title: 'A fortune locked underground',
      body: 'European agricultural topsoils hold on average 1,412 kg of phosphorus per hectare. But how much of that is accessible? The ratio of total to available P varies dramatically: from 11× in the Netherlands to 32× in Slovenia. The higher the ratio, the more phosphorus is trapped.',
      stat: { value: '1,412 kg P/ha', label: 'average topsoil stock, most of it chemically locked' },
      source: 'Panagos et al., Sci. Total Environ. (2022)',
      legendLabels: ['More accessible', 'More locked'],
    },
    legacy: {
      badge: 'THE FLUX',
      title: 'The annual balance: surplus and deficit side by side',
      body: 'Now look at the annual flows. Orange regions accumulate excess P year after year. Blue regions are drawing down their reserves. But in both cases, most soil phosphorus remains locked.',
      stat: { value: '+0.8 kg P/ha/yr', label: 'average EU surplus, accumulating every year' },
      source: 'Panagos et al., Sci. Total Environ. (2022)',
      legendLabels: ['P deficit', 'P surplus'],
    },
    'legacy-surplus': {
      badge: 'SURPLUS REGIONS',
      title: 'Where phosphorus is wasted capital',
      body: 'In livestock-intensive regions like the Netherlands, Belgium, and Brittany, decades of manure and fertilizer have created massive P surpluses. This phosphorus is locked in the soil, unavailable to crops, yet representing billions in fertilizer-equivalent value.',
      legendLabels: ['P deficit', 'P surplus'],
    },
    'legacy-deficit': {
      badge: 'DEFICIT REGIONS',
      title: 'Where every input must work harder',
      body: 'These regions apply less phosphorus than crops remove each year, drawing down reserves built up over past decades. Crops still grow, but the soil bank balance is shrinking. Here, improving access to locked soil phosphorus is about keeping yields strong as reserves deplete.',
      legendLabels: ['P deficit', 'P surplus'],
    },
    bivariate: {
      badge: 'THE FULL PICTURE',
      title: 'Stock meets flux: four realities of phosphorus in Europe',
      body: 'Combining the locked P stock with the annual balance reveals four distinct situations, each requiring a different strategy, but all pointing to the same need: better access to soil phosphorus.',
    },
    depletion: {
      badge: 'CONCENTRATED RISK',
      title: 'A non-renewable resource in few hands',
      body: 'Phosphate rock is the only primary source of phosphorus fertilizer, and it is non-renewable. Over 70% of global reserves are concentrated in Morocco alone. Europe has near-zero domestic reserves and depends heavily on imports.',
      stat: { value: '70%+', label: 'of global phosphate reserves held by Morocco' },
      source: 'USGS Mineral Commodity Summaries (2024)',
    },
    environment: {
      badge: 'ECOLOGICAL COST',
      title: 'What escapes the soil poisons the water',
      body: 'Phosphorus runoff is a primary driver of eutrophication: algal blooms that suffocate lakes, rivers, and coastal waters. The Baltic Sea, the Sea of Marmara, and freshwater bodies across Europe face severe ecological damage from agricultural phosphorus loss.',
      stat: { value: 'Primary driver', label: 'of freshwater eutrophication worldwide' },
      source: 'Carpenter et al., PNAS (2008); Schindler et al., PNAS (2008)',
    },
    cadmium: {
      badge: 'HIDDEN COST',
      title: 'Every ton of phosphate fertilizer carries a toxic passenger',
      body: 'Phosphate rock, especially from certain source countries, contains cadmium, a carcinogenic heavy metal. Through fertilizer application, cadmium accumulates in agricultural soils, enters the food chain via cereals and vegetables, and ends up in our bodies. In France, phosphate fertilizers account for 55% of cadmium inputs to farmland.',
      stat: { value: '~50%', label: 'of the French population shows concerning cadmium levels' },
      source: 'ANSES, Rapport cadmium (March 2026); Le Monde, 25 March 2026',
    },
    regulation: {
      badge: 'REGULATION',
      title: 'Policy pressure is accelerating',
      body: 'The EU Soil Monitoring Directive (2025) establishes soil health monitoring frameworks across member states. Phosphate rock has been on the EU Critical Raw Materials list since 2014. Resource-efficiency and soil-monitoring pressure are increasing, making smarter phosphorus use increasingly urgent.',
      stat: { value: '2025', label: 'EU Soil Monitoring Directive adopted' },
      source: 'European Council (September 2025); EU CRM Act (2024)',
    },
    opportunity: {
      badge: 'THE OPPORTUNITY',
      title: 'Unlock what is already there',
      body: 'HeartsBio\'s enzyme technology is designed to improve access to poorly available phosphorus fractions in soil, turning a trapped resource into usable nutrition. Fitazim works in the field. Bio-Dop works at the factory. Together, they target the phosphorus problem from both ends of the value chain.',
      stat: { value: '$70B+', label: 'annual global phosphate fertilizer market' },
      source: 'Straits Research (2024); World Bank Commodity Markets',
    },
  },
  nl: {
    paradox: {
      badge: 'DE PARADOX',
      title: 'Europa zit op een fosforschat die het niet kan gebruiken',
      body: `Tientallen jaren bemesting hebben landbouwgronden in heel Europa verrijkt met fosfor. Toch zit tot 80% van de bodemfosfor vast, gebonden aan ijzer, aluminium en calcium. Onbereikbaar voor het gewas. Uitgedrukt in kunstmestwaarde is deze vastgelegde voorraad in de EU gemiddeld zo'n €${NBSP}3.100 per hectare waard.`,
      stat: { value: `~€${NBSP}3.100/ha`, label: 'aan fosfor vastgelegd in EU-bodems, onzichtbaar en onbereikbaar' },
      source: 'Panagos et al., Sci. Total Environ. (2022); Hinsinger, Plant and Soil (2001)',
    },
    stock: {
      badge: 'DE VOORRAAD',
      title: 'Een fortuin, opgesloten in de grond',
      body: 'De bovengrond van Europese landbouwgronden bevat gemiddeld 1.412 kg fosfor per hectare. Maar hoeveel daarvan is bereikbaar? De verhouding tussen totale en beschikbare P loopt sterk uiteen: van 11× in Nederland tot 32× in Slovenië. Hoe hoger die verhouding, hoe meer fosfor er vastzit.',
      stat: { value: '1.412 kg P/ha', label: 'gemiddelde voorraad in de bovengrond, grotendeels chemisch vastgelegd' },
      source: 'Panagos et al., Sci. Total Environ. (2022)',
      legendLabels: ['Beter beschikbaar', 'Meer vastgelegd'],
    },
    legacy: {
      badge: 'DE STROMEN',
      title: 'De jaarlijkse balans: overschot en tekort naast elkaar',
      body: "Kijk nu naar de jaarlijkse stromen. Oranje regio's stapelen jaar na jaar extra P op. Blauwe regio's teren in op hun voorraad. Maar in beide gevallen blijft het grootste deel van de bodemfosfor vastgelegd.",
      stat: { value: '+0,8 kg P/ha/jaar', label: 'gemiddeld overschot in de EU, dat zich elk jaar opstapelt' },
      source: 'Panagos et al., Sci. Total Environ. (2022)',
      legendLabels: ['P-tekort', 'P-overschot'],
    },
    'legacy-surplus': {
      badge: "OVERSCHOTREGIO'S",
      title: 'Waar fosfor dood kapitaal is',
      body: "In regio's met veel veehouderij, zoals Nederland, België en Bretagne, hebben tientallen jaren mest en kunstmest geleid tot enorme P-overschotten. Deze fosfor ligt vast in de bodem en is onbereikbaar voor het gewas, terwijl die in kunstmestwaarde miljarden vertegenwoordigt.",
      legendLabels: ['P-tekort', 'P-overschot'],
    },
    'legacy-deficit': {
      badge: "TEKORTREGIO'S",
      title: 'Waar elke kilo meststof harder moet werken',
      body: "Deze regio's geven minder fosfor dan de gewassen elk jaar afvoeren. Zo teren ze in op voorraden die in de afgelopen decennia zijn opgebouwd. Gewassen groeien nog wel, maar het saldo op de bodembank slinkt. Hier draait betere toegang tot vastgelegde bodemfosfor om het op peil houden van de opbrengst terwijl de voorraad afneemt.",
      legendLabels: ['P-tekort', 'P-overschot'],
    },
    bivariate: {
      badge: 'HET VOLLEDIGE BEELD',
      title: 'Voorraad en balans samen: vier fosforsituaties in Europa',
      body: 'Wie de vastgelegde P-voorraad combineert met de jaarlijkse balans, ziet vier verschillende situaties. Elke situatie vraagt om een eigen aanpak, maar ze wijzen allemaal op dezelfde behoefte: betere toegang tot bodemfosfor.',
    },
    depletion: {
      badge: 'GECONCENTREERD RISICO',
      title: 'Een eindige grondstof in weinig handen',
      body: 'Fosfaaterts is de enige primaire bron van fosfaatkunstmest, en het is niet hernieuwbaar. Ruim 70% van de wereldwijde reserves ligt in Marokko. Europa heeft vrijwel geen eigen reserves en is sterk afhankelijk van import.',
      stat: { value: '70%+', label: 'van de wereldwijde fosfaatreserves ligt in Marokko' },
      source: 'USGS Mineral Commodity Summaries (2024)',
    },
    environment: {
      badge: 'ECOLOGISCHE SCHADE',
      title: 'Wat uit de bodem ontsnapt, verstikt het water',
      body: 'Afspoeling van fosfor is een hoofdoorzaak van eutrofiëring: algenbloei die meren, rivieren en kustwateren van zuurstof berooft. De Oostzee, de Zee van Marmara en zoete wateren in heel Europa lijden ernstige ecologische schade door fosforverliezen uit de landbouw.',
      stat: { value: 'Hoofdoorzaak', label: 'van eutrofiëring van zoet water wereldwijd' },
      source: 'Carpenter et al., PNAS (2008); Schindler et al., PNAS (2008)',
    },
    cadmium: {
      badge: 'VERBORGEN KOSTEN',
      title: 'Elke ton fosfaatkunstmest heeft een giftige verstekeling aan boord',
      body: 'Fosfaaterts, vooral uit bepaalde herkomstlanden, bevat cadmium: een kankerverwekkend zwaar metaal. Via bemesting hoopt cadmium zich op in landbouwgrond, komt het via granen en groenten in de voedselketen terecht en belandt het uiteindelijk in ons lichaam. In Frankrijk is fosfaatkunstmest goed voor 55% van de cadmiumaanvoer naar landbouwgrond.',
      stat: { value: '~50%', label: 'van de Franse bevolking heeft zorgwekkende cadmiumwaarden' },
      source: 'ANSES, Rapport cadmium (maart 2026); Le Monde, 25 maart 2026',
    },
    regulation: {
      badge: 'REGELGEVING',
      title: 'De beleidsdruk neemt snel toe',
      body: 'De EU-richtlijn voor bodemmonitoring (2025) legt in alle lidstaten een kader vast voor het monitoren van de bodemgezondheid. Fosfaaterts staat sinds 2014 op de EU-lijst van kritieke grondstoffen. De druk om grondstoffen efficiënt te gebruiken en bodems te monitoren groeit, waardoor slimmer fosforgebruik steeds urgenter wordt.',
      stat: { value: '2025', label: 'EU-richtlijn voor bodemmonitoring aangenomen' },
      source: 'Europese Raad (september 2025); EU-verordening kritieke grondstoffen (2024)',
    },
    opportunity: {
      badge: 'DE KANS',
      title: 'Ontsluit wat er al is',
      body: 'De enzymtechnologie van HeartsBio is ontwikkeld om slecht beschikbare fosforfracties in de bodem beter toegankelijk te maken, zodat een vastgelegde voorraad bruikbare plantenvoeding wordt. Fitazim werkt in het veld. Bio-Dop werkt in de fabriek. Samen pakken ze het fosforprobleem aan vanaf beide kanten van de waardeketen.',
      stat: { value: `Ruim $${NBSP}70${NBSP}mld.`, label: 'jaarlijkse wereldmarkt voor fosfaatkunstmest' },
      source: 'Straits Research (2024); Wereldbank, Commodity Markets',
    },
  },
};

/* Interface strings for tooltips, legends and the methodology popup */
const uiText = {
  en: {
    region: 'Region',
    na: 'N/A',
    plantAvailable: 'plant-available',
    balanceUnit: 'kg P/ha/yr balance',
    perYear: 'kg P/ha/yr',
    bivariate: {
      'high-surplus': 'Surplus building up, barely accessible',
      'high-deficit': 'Depleting and hard to access',
      'low-surplus': 'Surplus building up, mostly from manure',
      'low-deficit': 'Depleting, but more P is accessible',
    } as Record<string, string>,
    available: (pct: number) => `${pct}% available`,
    lockedDetail: (pct: number, ratio: string) => `${pct}% locked — only 1 in ${ratio} kg of soil P is usable by crops`,
    appliedPerYear: 'phosphorus applied per year',
    fertilizer: 'fertilizer',
    manure: 'manure',
    surplus: 'surplus — more P added than crops remove',
    deficit: 'deficit — crops removing more P than added',
    lockedValue: 'locked phosphorus value (fertilizer-equivalent)',
    unavailableIn: (pct: number, country: string) => `~${pct}% of soil P is unavailable in ${country}`,
    unavailableEu: 'up to 80% of soil P is unavailable to crops (EU avg)',
    methodologyLabel: 'Show calculation methodology',
    perFarm: { value: '€310K', label: 'per 100 ha farm' },
    euWide: { value: '~€535B', label: 'across EU farmland' },
    methodTitle: 'How we calculated this',
    methodRows: [
      ['Mean topsoil P stock (0–20 cm)', '1,412 kg P/ha'],
      ['Plant-available fraction', '~20% (~280 kg/ha)'],
      ['Locked (unavailable) P', 'up to 80% (~1,130 kg/ha)'],
      ['DAP price benchmark', '~€2.75/kg P'],
      ['Fertilizer-equivalent value', '~€3,100/ha'],
      ['EU agricultural land', '~173M ha'],
      ['EU-wide locked P value', '~€535B'],
    ],
    noteLabel: 'Note:',
    note: 'This is a fertilizer-equivalent estimate. Not all locked P is economically recoverable. DAP prices fluctuate. Value represents what it would cost to replace this P with commercial fertilizer.',
    stockData: 'P stock data:',
    priceData: 'Price data: World Bank Commodity Price Data (Pink Sheet)',
    goTo: 'Go to',
    more: 'More',
    less: 'Less',
    locked: 'locked',
    deficitShort: 'Deficit',
    surplusShort: 'Surplus',
  },
  nl: {
    region: 'Regio',
    na: 'n.b.',
    plantAvailable: 'plantbeschikbaar',
    balanceUnit: 'P-balans in kg/ha/jaar',
    perYear: 'kg P/ha/jaar',
    bivariate: {
      'high-surplus': 'Overschot loopt op, nauwelijks bereikbaar',
      'high-deficit': 'Voorraad slinkt en is slecht bereikbaar',
      'low-surplus': 'Overschot loopt op, vooral door mest',
      'low-deficit': 'Voorraad slinkt, maar meer P is bereikbaar',
    } as Record<string, string>,
    available: (pct: number) => `${pct}% beschikbaar`,
    lockedDetail: (pct: number, ratio: string) => `${pct}% vastgelegd: slechts 1 op de ${ratio} kg bodem-P is bruikbaar voor het gewas`,
    appliedPerYear: 'fosforaanvoer per jaar',
    fertilizer: 'kunstmest',
    manure: 'mest',
    surplus: 'overschot: meer P aangevoerd dan het gewas afvoert',
    deficit: 'tekort: het gewas voert meer P af dan er wordt aangevoerd',
    lockedValue: 'waarde van vastgelegde fosfor (in kunstmestequivalent)',
    unavailableIn: (pct: number, country: string) => `~${pct}% van de bodem-P is niet beschikbaar in ${country}`,
    unavailableEu: 'tot 80% van de bodem-P is niet beschikbaar voor het gewas (EU-gemiddelde)',
    methodologyLabel: 'Toon de berekening',
    perFarm: { value: `€${NBSP}310.000`, label: 'per bedrijf van 100 ha' },
    euWide: { value: `~€${NBSP}535${NBSP}mld.`, label: 'voor alle landbouwgrond in de EU' },
    methodTitle: 'Zo hebben we dit berekend',
    methodRows: [
      ['Gemiddelde P-voorraad bovengrond (0–20 cm)', '1.412 kg P/ha'],
      ['Plantbeschikbaar deel', '~20% (~280 kg/ha)'],
      ['Vastgelegde (niet beschikbare) P', 'tot 80% (~1.130 kg/ha)'],
      ['Referentieprijs DAP', `~€${NBSP}2,75/kg P`],
      ['Waarde in kunstmestequivalent', `~€${NBSP}3.100/ha`],
      ['Landbouwgrond in de EU', `~173${NBSP}mln. ha`],
      ['Waarde vastgelegde P in de hele EU', `~€${NBSP}535${NBSP}mld.`],
    ],
    noteLabel: 'Let op:',
    note: 'Dit is een schatting in kunstmestequivalent. Niet alle vastgelegde P is economisch te benutten, en de prijs van DAP schommelt. De waarde geeft aan wat het zou kosten om deze P te vervangen door commerciële kunstmest.',
    stockData: 'Gegevens P-voorraad:',
    priceData: 'Prijsgegevens: World Bank Commodity Price Data (Pink Sheet)',
    goTo: 'Ga naar',
    more: 'Meer',
    less: 'Minder',
    locked: 'vastgelegd',
    deficitShort: 'Tekort',
    surplusShort: 'Overschot',
  },
};

/* Country names by code. NUTS uses EL for Greece and UK for the United Kingdom;
   this dataset also uses BL for Belgium and IR for Ireland. */
const countryNames: Record<Lang, Record<string, string>> = {
  en: {
    AT: 'Austria', BE: 'Belgium', BL: 'Belgium', BG: 'Bulgaria', CY: 'Cyprus', CZ: 'Czechia',
    DE: 'Germany', DK: 'Denmark', EE: 'Estonia', EL: 'Greece', ES: 'Spain',
    FI: 'Finland', FR: 'France', HR: 'Croatia', HU: 'Hungary', IE: 'Ireland', IR: 'Ireland',
    IT: 'Italy', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia', MT: 'Malta',
    NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania', SE: 'Sweden',
    SI: 'Slovenia', SK: 'Slovakia', UK: 'United Kingdom',
  },
  nl: {
    AT: 'Oostenrijk', BE: 'België', BL: 'België', BG: 'Bulgarije', CY: 'Cyprus', CZ: 'Tsjechië',
    DE: 'Duitsland', DK: 'Denemarken', EE: 'Estland', EL: 'Griekenland', ES: 'Spanje',
    FI: 'Finland', FR: 'Frankrijk', HR: 'Kroatië', HU: 'Hongarije', IE: 'Ierland', IR: 'Ierland',
    IT: 'Italië', LT: 'Litouwen', LU: 'Luxemburg', LV: 'Letland', MT: 'Malta',
    NL: 'Nederland', PL: 'Polen', PT: 'Portugal', RO: 'Roemenië', SE: 'Zweden',
    SI: 'Slovenië', SK: 'Slowakije', UK: 'Verenigd Koninkrijk',
  },
};

const chaptersByLang: Record<Lang, Chapter[]> = {
  en: chapterConfigs.map((c) => ({ ...c, ...chapterText.en[c.id] })),
  nl: chapterConfigs.map((c) => ({ ...c, ...chapterText.nl[c.id] })),
};

/* ─── Build highlight filter for GeoJSON source (uses ISO_A3_EH for completeness) ─── */
const buildHighlightFilter = (ids: string | undefined): any => {
  if (!ids) return ['==', 'ISO_A3_EH', '___none___'];
  const codes = ids.split(',');
  return ['in', ['get', 'ISO_A3_EH'], ['literal', codes]];
};

/* ─── Component ─── */
interface Props {
  mapboxToken: string;
  lang?: Lang;
}

export default function PhosphorusStoryMap({ mapboxToken, lang = 'en' }: Props) {
  const chapters = chaptersByLang[lang];
  const ui = uiText[lang];
  const locale = locales[lang];
  const fmt1 = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtMax1 = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 1 });

  // Guard: no token
  if (!mapboxToken) {
    return (
      <div style={{ background: '#111', padding: '6rem 1rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Map disabled</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            No <code>PUBLIC_MAPBOX_TOKEN</code> was provided.
          </p>
        </div>
      </div>
    );
  }

  const [activeChapter, setActiveChapter] = useState(0);
  const [countriesGeoJSON, setCountriesGeoJSON] = useState<any>(null);
  const [nuts2GeoJSON, setNuts2GeoJSON] = useState<any>(null);
  const [stockCountryGeoJSON, setStockCountryGeoJSON] = useState<any>(null);
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load GeoJSON data
  useEffect(() => {
    fetch(COUNTRIES_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log('[PhosphorusStoryMap] Countries GeoJSON loaded:', data.features?.length, 'features');
        setCountriesGeoJSON(data);
      })
      .catch((err) => console.error('[PhosphorusStoryMap] Failed to load countries:', err));
    fetch(NUTS2_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log('[PhosphorusStoryMap] NUTS2 GeoJSON loaded:', data.features?.length, 'features');
        setNuts2GeoJSON(data);
      })
      .catch((err) => console.error('[PhosphorusStoryMap] Failed to load NUTS2:', err));
    fetch(STOCK_COUNTRY_URL)
      .then((res) => res.json())
      .then((data) => setStockCountryGeoJSON(data))
      .catch((err) => console.error('[PhosphorusStoryMap] Failed to load NUTS2:', err));
  }, []);

  // Scroll observer — determine which chapter is in the center of the viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chapterRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveChapter(index);
            }
          });
        },
        { threshold: 0.15, rootMargin: '-10% 0px -40% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Fly to map state when chapter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const { mapState } = chapters[activeChapter];
    map.flyTo({
      center: [mapState.longitude, mapState.latitude],
      zoom: mapState.zoom,
      pitch: mapState.pitch ?? 0,
      bearing: mapState.bearing ?? 0,
      duration: 2000,
      essential: true,
    });
  }, [activeChapter]);

  const setChapterRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    chapterRefs.current[index] = el;
  }, []);

  const current = chapters[activeChapter];

  // Hover handler for NUTS2 regions
  const onMapHover = useCallback((event: any) => {
    const feature = event.features?.[0];
    if (feature?.properties) {
      setHoveredRegion({
        ...feature.properties,
        x: event.point.x,
        y: event.point.y,
      });
    } else {
      setHoveredRegion(null);
    }
  }, []);

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div ref={containerRef} style={styles.wrapper}>
      {/* Fixed map — stays in viewport while user scrolls through chapters */}
      <div style={styles.mapFixed}>
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          initialViewState={chapters[0].mapState}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          language={lang}
          scrollZoom={false}
          dragPan={!!(current.nuts2Visible || current.useCountryStock)}
          dragRotate={false}
          doubleClickZoom={!!current.nuts2Visible}
          touchZoomRotate={!!current.nuts2Visible}
          onMouseMove={onMapHover}
          onMouseLeave={() => setHoveredRegion(null)}
          interactiveLayerIds={current.nuts2Visible ? ['nuts2-fill'] : current.useCountryStock ? ['stock-country-fill'] : []}
          attributionControl={true}
        >
          {countriesGeoJSON && (
            <Source id="countries" type="geojson" data={countriesGeoJSON}>
              {/* Highlight fill */}
              <Layer
                id="country-highlight"
                type="fill"
                paint={{
                  'fill-color': current.layerColor ?? '#7cc98a',
                  'fill-opacity': current.layerOpacity ?? 0.5,
                }}
                filter={buildHighlightFilter(current.layerHighlight)}
              />
              {/* Highlight border */}
              <Layer
                id="country-highlight-border"
                type="line"
                paint={{
                  'line-color': current.layerColor ?? '#7cc98a',
                  'line-width': 1.5,
                  'line-opacity': 0.8,
                }}
                filter={buildHighlightFilter(current.layerHighlight)}
              />
            </Source>
          )}
          {/* Country-level P stock layer */}
          {stockCountryGeoJSON && current.useCountryStock && (
            <Source id="stock-country" type="geojson" data={stockCountryGeoJSON}>
              <Layer
                id="stock-country-fill"
                type="fill"
                paint={{
                  'fill-color': current.nuts2ColorScale
                    ? [
                        'interpolate',
                        ['linear'],
                        ['coalesce', ['get', 'lock_ratio'], 0],
                        ...current.nuts2ColorScale.flat(),
                      ]
                    : '#7cc98a',
                  'fill-opacity': 0.7,
                }}
              />
              <Layer
                id="stock-country-border"
                type="line"
                paint={{
                  'line-color': 'rgba(255,255,255,0.3)',
                  'line-width': 1,
                }}
              />
            </Source>
          )}
          {/* NUTS2-level layers */}
          {nuts2GeoJSON && current.nuts2Visible && (
            <Source id="nuts2" type="geojson" data={nuts2GeoJSON}>
              <Layer
                id="nuts2-fill"
                type="fill"
                filter={
                  current.nuts2Filter === 'surplus'
                    ? ['>', ['coalesce', ['get', 'balance_ha'], 0], 0]
                    : current.nuts2Filter === 'deficit'
                      ? ['<', ['coalesce', ['get', 'balance_ha'], 0], 0]
                      : ['has', 'id']
                }
                paint={{
                  'fill-color': current.nuts2Bivariate
                    ? [
                        'match',
                        ['get', 'bivariate'],
                        'high-surplus', BIVARIATE_COLORS['high-surplus'],
                        'high-deficit', BIVARIATE_COLORS['high-deficit'],
                        'low-surplus', BIVARIATE_COLORS['low-surplus'],
                        'low-deficit', BIVARIATE_COLORS['low-deficit'],
                        BIVARIATE_COLORS['unknown'],
                      ]
                    : current.nuts2ColorScale
                      ? [
                          'interpolate',
                          ['linear'],
                          ['coalesce', ['get', current.nuts2Property || 'balance_ha'], 0],
                          ...current.nuts2ColorScale.flat(),
                        ]
                      : '#7cc98a',
                  'fill-opacity': 0.7,
                }}
              />
              <Layer
                id="nuts2-border"
                type="line"
                filter={
                  current.nuts2Filter === 'surplus'
                    ? ['>', ['coalesce', ['get', 'balance_ha'], 0], 0]
                    : current.nuts2Filter === 'deficit'
                      ? ['<', ['coalesce', ['get', 'balance_ha'], 0], 0]
                      : ['has', 'id']
                }
                paint={{
                  'line-color': 'rgba(255,255,255,0.15)',
                  'line-width': 0.5,
                }}
              />
            </Source>
          )}
        </Map>
        {/* Hover tooltip for NUTS2 regions */}
        {hoveredRegion && (current.nuts2Visible || current.useCountryStock) && (() => {
          const r = hoveredRegion;
          const balance = r.balance_ha ?? 0;
          const isSurplus = balance > 0;
          const totalInput = r.total_input_ha ?? 0;
          const countryCode = (r.id || '').slice(0, 2);
          const country = countryNames[lang][countryCode] || r.name || countryCode;

          return (
            <div style={{
              position: 'absolute',
              left: Math.min(r.x + 15, (typeof window !== 'undefined' ? window.innerWidth - 260 : 500)),
              top: r.y - 10,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              color: '#fff',
              fontSize: '0.8rem',
              pointerEvents: 'none',
              zIndex: 20,
              maxWidth: '250px',
              lineHeight: 1.5,
            }}>
              {/* Region header */}
              <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{country}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{ui.region} {r.id}</div>
              </div>

              {/* Key insight — changes based on active chapter */}
              {current.nuts2Bivariate ? (() => {
                const availPct = r.lock_ratio ? Math.round(100 / r.lock_ratio) : null;
                const bal = r.balance_ha ?? 0;
                const interpretation = ui.bivariate[r.bivariate] ?? '';
                return (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: availPct != null && availPct <= 5 ? '#e76f51' : '#52b788' }}>
                          {availPct != null ? `${availPct}%` : ui.na}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{ui.plantAvailable}</div>
                      </div>
                      <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: bal > 0 ? '#f4a261' : '#0077b6' }}>
                          {bal > 0 ? '+' : ''}{fmt1(bal)}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{ui.balanceUnit}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, fontStyle: 'italic' }}>
                      {interpretation}
                    </div>
                  </div>
                );
              })() : (current.useCountryStock || current.nuts2Property === 'lock_ratio') ? (() => {
                const availPct = r.lock_ratio ? Math.round(100 / r.lock_ratio) : null;
                const lockedPct = availPct != null ? 100 - availPct : null;
                return (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: (availPct ?? 0) <= 5 ? '#e76f51' : '#52b788' }}>
                      {availPct != null ? ui.available(availPct) : ui.na}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                      {lockedPct != null ? ui.lockedDetail(lockedPct, fmtMax1(r.lock_ratio)) : ''}
                    </div>
                  </div>
                );
              })() : current.nuts2Property === 'total_input_ha' ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#52b788' }}>
                    {fmt1(totalInput)} kg P/ha
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    {ui.appliedPerYear}
                  </div>
                  {r.fert_ha != null && r.manure_ha != null && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                      <span>{fmtMax1(r.fert_ha)} {ui.fertilizer}</span>
                      <span>{fmtMax1(r.manure_ha)} {ui.manure}</span>
                    </div>
                  )}
                </div>
              ) : current.nuts2Property === 'balance_ha' ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isSurplus ? '#f4a261' : '#0077b6' }}>
                    {isSurplus ? '+' : ''}{fmt1(balance)} {ui.perYear}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    {isSurplus ? ui.surplus : ui.deficit}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d4a373' }}>
                    €{lang === 'nl' ? NBSP : ''}{(r.locked_value_eur_ha ?? 0).toLocaleString(locale)}/ha
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    {ui.lockedValue}
                  </div>
                </div>
              )}

              {/* Bottom context — only show when main content doesn't already cover availability */}
              {!current.useCountryStock && !current.nuts2Bivariate && (
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                  {r.lock_ratio
                    ? ui.unavailableIn(100 - Math.round(100 / r.lock_ratio), country)
                    : ui.unavailableEu}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Chapters — scrolls over the fixed map */}
      <div style={styles.chaptersScroll}>
        <div style={{
          padding: isMobile ? '0 1rem' : '0 0 0 4rem',
          maxWidth: isMobile ? '100%' : '440px',
        }}>
          {/* Top spacer — first card appears mid-screen */}
          <div style={{ height: '50vh' }} />

          {chapters.map((ch, i) => (
            <div
              key={ch.id}
              ref={setChapterRef(i)}
              style={styles.card(activeChapter === i)}
            >
              <div style={{ display: 'inline-block', marginBottom: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {ch.badge}
                </span>
              </div>

              <h3 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', fontFamily: 'Manrope, sans-serif', lineHeight: 1.2 }}>
                {ch.title}
              </h3>

              <p style={{ fontSize: isMobile ? '0.875rem' : '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {ch.body}
              </p>

              {ch.stat && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <div style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 700, color: '#7cc98a', fontFamily: 'Manrope, sans-serif' }}>
                      {ch.stat.value}
                    </div>
                    {ch.id === 'paradox' && (
                      <button
                        onClick={() => setShowMethodology(!showMethodology)}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontStyle: 'italic',
                          fontFamily: 'Georgia, serif',
                          flexShrink: 0,
                        }}
                        aria-label={ui.methodologyLabel}
                      >
                        i
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{ch.stat.label}</div>

                  {/* Multi-scale equivalents for the paradox slide */}
                  {ch.id === 'paradox' && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#7cc98a' }}>{ui.perFarm.value}</div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{ui.perFarm.label}</div>
                      </div>
                      <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#7cc98a' }}>{ui.euWide.value}</div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{ui.euWide.label}</div>
                      </div>
                    </div>
                  )}

                  {/* Methodology popup */}
                  {ch.id === 'paradox' && showMethodology && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                      <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{ui.methodTitle}</div>
                      <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
                        <tbody>
                          {ui.methodRows.map(([label, value], i) => {
                            const highlight = i === 4 || i === 6;
                            const divider = i === 3 ? { borderTop: '1px solid rgba(255,255,255,0.1)' } : {};
                            return (
                              <tr key={i}>
                                <td style={{ padding: '0.2rem 0', color: highlight ? '#7cc98a' : 'rgba(255,255,255,0.5)', fontWeight: highlight ? 600 : undefined, ...divider }}>{label}</td>
                                <td style={{ textAlign: 'right', fontWeight: highlight ? 700 : 600, color: highlight ? '#7cc98a' : undefined, whiteSpace: 'nowrap', paddingLeft: '0.5rem', ...divider }}>{value}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                        <strong>{ui.noteLabel}</strong> {ui.note}
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>
                        {ui.stockData} Panagos, P., Köninger, J., Ballabio, C., Liakos, L., Muntwyler, A., Borrelli, P. and Lugato, E., 2022. Improving the phosphorus budget of European agricultural soils. <em>Sci. Total Environ.</em>, 853: 158706. <a href="https://doi.org/10.1016/j.scitotenv.2022.158706" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(124,201,138,0.7)' }}>DOI: 10.1016/j.scitotenv.2022.158706</a>
                      </div>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>
                        {ui.priceData}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {ch.source && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{ch.source}</p>
              )}
            </div>
          ))}

          {/* Bottom spacer */}
          <div style={{ height: '50vh' }} />
        </div>
      </div>

      {/* Chapter progress dots (desktop) */}
      {!isMobile && (
        <div style={styles.progress}>
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => {
                chapterRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: activeChapter === i ? '#7cc98a' : 'rgba(255,255,255,0.3)',
                transform: activeChapter === i ? 'scale(1.5)' : 'scale(1)',
              }}
              aria-label={`${ui.goTo}: ${ch.badge}`}
            />
          ))}
        </div>
      )}

      {/* NUTS2 color legend */}
      {/* Legend — gradient bar or bivariate grid */}
      {(current.nuts2Visible || current.useCountryStock) && current.nuts2ColorScale && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          zIndex: 10,
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.6)',
        }}>
          <div style={{
            width: '100px',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(to right, ${current.nuts2ColorScale.map(([, c]) => c).join(', ')})`,
          }} />
          {current.legendLabels && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)' }}>
              <span>{current.legendLabels[0]}</span>
              <span>{current.legendLabels[1]}</span>
            </div>
          )}
          <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
            Panagos et al., <em>Sci. Total Environ.</em> 853: 158706 (2022)
          </div>
        </div>
      )}
      {/* Bivariate legend */}
      {current.nuts2Bivariate && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          zIndex: 10,
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {/* Grid layout: y-label | grid | nothing, nothing | x-labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', columnGap: '6px', rowGap: '3px', alignItems: 'center' }}>
            {/* Y-axis label */}
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)', textAlign: 'right', lineHeight: 1.2 }}>
              <div>{ui.more}</div>
              <div>{ui.locked}</div>
            </div>
            {/* Top row of 2×2 */}
            <div style={{ display: 'flex', gap: '2px', justifySelf: 'center' }}>
              <div style={{ background: BIVARIATE_COLORS['high-deficit'], width: '27px', height: '24px', borderRadius: '3px 0 0 0' }} />
              <div style={{ background: BIVARIATE_COLORS['high-surplus'], width: '27px', height: '24px', borderRadius: '0 3px 0 0' }} />
            </div>
            {/* Y-axis label bottom */}
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)', textAlign: 'right', lineHeight: 1.2 }}>
              <div>{ui.less}</div>
              <div>{ui.locked}</div>
            </div>
            {/* Bottom row of 2×2 */}
            <div style={{ display: 'flex', gap: '2px', justifySelf: 'center' }}>
              <div style={{ background: BIVARIATE_COLORS['low-deficit'], width: '27px', height: '24px', borderRadius: '0 0 0 3px' }} />
              <div style={{ background: BIVARIATE_COLORS['low-surplus'], width: '27px', height: '24px', borderRadius: '0 0 3px 0' }} />
            </div>
            {/* Empty cell under y-axis */}
            <div />
            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)' }}>
              <span>{ui.deficitShort}</span>
              <span>{ui.surplusShort}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
            Panagos et al., <em>Sci. Total Environ.</em> 853: 158706 (2022)
          </div>
        </div>
      )}
    </div>
  );
}
