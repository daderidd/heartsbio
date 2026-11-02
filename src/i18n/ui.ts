/**
 * Shared interface strings (layout, navigation, footer, cookie banner).
 * Section-specific copy lives next to its markup in each component.
 *
 * Dutch style notes (keep consistent when editing):
 * - Address the reader formally with "u" (investor and B2B audience).
 * - Sentence case for headings and buttons; no English Title Case.
 * - Avoid em dashes; use commas, colons or full stops.
 * - Decimal comma and thousands point: 7,5% and 10.000; "€ 3.100".
 * - Agronomic terms: fosfor (element P), fosfaat (phosphate), kunstmest,
 *   bemesting, plantbeschikbaar, vastgelegd (locked), ontsluiten (unlock),
 *   opbrengst, veldproef, zaadcoating, telers.
 */
import type { Lang } from './index';

export const ui = {
  en: {
    'meta.description':
      "HeartsBio is a Dutch biotech R&D company developing enzyme-based solutions for sustainable agriculture — phosphate bioavailability, biopesticides, microbial soil health, and advanced seed coatings. Products by Supersol in Turkey.",
    'meta.keywords':
      'HeartsBio, heartsbio.nl, Supersol, biotechnology, agricultural biotech, enzyme technology, phosphorus recovery, phosphate bioavailability, nutrient bioavailability, biopesticides, biocontrol, microbial solutions, seed coating, sustainable farming, soil health, Fitazim, Purisol, Bio-Dop, SG-2, Netherlands, Europe, Turkey, biotech R&D',
    'meta.orgDescription':
      'Dutch biotech R&D company developing enzyme-based biological solutions for sustainable agriculture.',

    'nav.label': 'Main navigation',
    'nav.home': 'Home',
    'nav.solution': 'Solution',
    'nav.products': 'Products',
    'nav.phosphorus': 'Why Phosphorus',
    'nav.cta': 'Get in Touch',
    'nav.ctaLabel': 'Contact us',
    'nav.homeLabel': 'HeartsBio home',
    'nav.toggleMenu': 'Toggle menu',
    'nav.switchLabel': 'Language',

    'footer.tagline': 'Advancing biotechnology through innovative research and development.',
    'footer.quickLinks': 'Quick Links',
    'footer.team': 'Our Team',
    'footer.technology': 'Technology',
    'footer.products': 'Products',
    'footer.contact': 'Contact',
    'footer.country': 'The Netherlands',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Settings',

    'cookie.title': 'We value your privacy',
    'cookie.body':
      'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our',
    'cookie.policy': 'Privacy Policy',
    'cookie.acceptAll': 'Accept All',
    'cookie.acceptAllLabel': 'Accept all cookies',
    'cookie.rejectAll': 'Reject All',
    'cookie.rejectAllLabel': 'Reject non-essential cookies',
    'cookie.customize': 'Customize',
    'cookie.customizeLabel': 'Customize cookie preferences',
    'cookie.prefsTitle': 'Cookie Preferences',
    'cookie.prefsBody': 'Choose which cookies you want to allow. You can change these settings at any time.',
    'cookie.essentialTitle': 'Essential Cookies',
    'cookie.essentialBody': 'Required for the website to function properly. These cannot be disabled.',
    'cookie.alwaysActive': 'Always Active',
    'cookie.analyticsTitle': 'Analytics Cookies',
    'cookie.analyticsBody': 'Help us understand how visitors interact with our website to improve user experience.',
    'cookie.marketingTitle': 'Marketing Cookies',
    'cookie.marketingBody': 'Used to deliver personalized content and track campaign effectiveness.',
    'cookie.analyticsOn': 'Enable analytics cookies',
    'cookie.analyticsOff': 'Disable analytics cookies',
    'cookie.marketingOn': 'Enable marketing cookies',
    'cookie.marketingOff': 'Disable marketing cookies',
    'cookie.save': 'Save Preferences',
    'cookie.saveLabel': 'Save cookie preferences',
    'cookie.cancel': 'Cancel',
    'cookie.cancelLabel': 'Cancel and go back',
  },
  nl: {
    'meta.description':
      'HeartsBio is een Nederlands biotech-R&D-bedrijf dat enzymgebaseerde oplossingen ontwikkelt voor duurzame landbouw: betere beschikbaarheid van fosfaat, biologische gewasbescherming, een gezond bodemleven en geavanceerde zaadcoatings. Producten van Supersol in Turkije.',
    'meta.keywords':
      'HeartsBio, heartsbio.nl, Supersol, biotechnologie, agrarische biotechnologie, enzymtechnologie, fosfor, fosfaat, beschikbaarheid van fosfaat, biostimulant, biologische gewasbescherming, bodemleven, bodemgezondheid, zaadcoating, duurzame landbouw, Fitazim, Purisol, Bio-Dop, SG-2, Nederland, Europa, Turkije',
    'meta.orgDescription':
      'Nederlands biotech-R&D-bedrijf dat enzymgebaseerde biologische oplossingen ontwikkelt voor duurzame landbouw.',

    'nav.label': 'Hoofdnavigatie',
    'nav.home': 'Home',
    'nav.solution': 'Oplossing',
    'nav.products': 'Producten',
    'nav.phosphorus': 'Waarom fosfor',
    'nav.cta': 'Neem contact op',
    'nav.ctaLabel': 'Neem contact met ons op',
    'nav.homeLabel': 'HeartsBio, naar de homepage',
    'nav.toggleMenu': 'Menu openen of sluiten',
    'nav.switchLabel': 'Taal',

    'footer.tagline': 'Biotechnologie vooruit door innovatief onderzoek en ontwikkeling.',
    'footer.quickLinks': 'Snel naar',
    'footer.team': 'Ons team',
    'footer.technology': 'Technologie',
    'footer.products': 'Producten',
    'footer.contact': 'Contact',
    'footer.country': 'Nederland',
    'footer.rights': 'Alle rechten voorbehouden.',
    'footer.privacy': 'Privacyverklaring',
    'footer.terms': 'Gebruiksvoorwaarden',
    'footer.cookies': 'Cookie-instellingen',

    'cookie.title': 'Wij respecteren uw privacy',
    'cookie.body':
      'Wij gebruiken cookies om uw bezoek aan onze website te verbeteren, het websiteverkeer te analyseren en content af te stemmen op uw interesses. Door op "Alles accepteren" te klikken, gaat u akkoord met het gebruik van cookies. U kunt uw voorkeuren beheren of meer lezen in onze',
    'cookie.policy': 'privacyverklaring',
    'cookie.acceptAll': 'Alles accepteren',
    'cookie.acceptAllLabel': 'Alle cookies accepteren',
    'cookie.rejectAll': 'Alles weigeren',
    'cookie.rejectAllLabel': 'Niet-noodzakelijke cookies weigeren',
    'cookie.customize': 'Instellen',
    'cookie.customizeLabel': 'Cookievoorkeuren instellen',
    'cookie.prefsTitle': 'Cookievoorkeuren',
    'cookie.prefsBody': 'Kies welke cookies u wilt toestaan. U kunt deze instellingen altijd wijzigen.',
    'cookie.essentialTitle': 'Noodzakelijke cookies',
    'cookie.essentialBody': 'Nodig om de website goed te laten werken. Deze kunnen niet worden uitgeschakeld.',
    'cookie.alwaysActive': 'Altijd actief',
    'cookie.analyticsTitle': 'Analytische cookies',
    'cookie.analyticsBody': 'Helpen ons te begrijpen hoe bezoekers onze website gebruiken, zodat we die kunnen verbeteren.',
    'cookie.marketingTitle': 'Marketingcookies',
    'cookie.marketingBody': 'Worden gebruikt om content op uw interesses af te stemmen en de effectiviteit van campagnes te meten.',
    'cookie.analyticsOn': 'Analytische cookies inschakelen',
    'cookie.analyticsOff': 'Analytische cookies uitschakelen',
    'cookie.marketingOn': 'Marketingcookies inschakelen',
    'cookie.marketingOff': 'Marketingcookies uitschakelen',
    'cookie.save': 'Voorkeuren opslaan',
    'cookie.saveLabel': 'Cookievoorkeuren opslaan',
    'cookie.cancel': 'Annuleren',
    'cookie.cancelLabel': 'Annuleren en teruggaan',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui.en[key];
}
