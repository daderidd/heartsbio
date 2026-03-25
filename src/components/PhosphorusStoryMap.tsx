import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Source, Layer, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/* ─── GeoJSON data sources ─── */
const COUNTRIES_GEOJSON_URL = '/data/ne-countries.geojson';
const NUTS2_GEOJSON_URL = '/data/eu-phosphorus-nuts2.geojson';

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
interface Chapter {
  id: string;
  badge: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
  source?: string;
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
}

const chapters: Chapter[] = [
  {
    id: 'paradox',
    badge: 'THE PARADOX',
    title: 'Europe is sitting on a phosphorus fortune it cannot spend',
    body: 'Decades of fertilizer application have loaded agricultural soils across Europe with phosphorus. Yet a large share of applied P quickly becomes poorly available — bound to iron, aluminium, and calcium through sorption and precipitation.',
    stat: { value: '€3,650/ha', label: 'average locked P value in EU soils — inaccessible to crops' },
    source: 'Hinsinger, Plant and Soil (2001); Holford, Aust. J. Soil Res. (1997)',
    mapState: { longitude: 10, latitude: 52, zoom: 3.8, pitch: 0, bearing: 0 },
    layerOpacity: 0.6,
    nuts2Visible: true,
    nuts2Property: 'total_input_ha',
    nuts2ColorScale: [[0, '#1a1a2e'], [10, '#2d6a4f'], [20, '#52b788'], [40, '#95d5b2'], [60, '#fca311']],
  },
  {
    id: 'legacy',
    badge: 'LEGACY PHOSPHORUS',
    title: 'Decades of surplus, buried in plain sight',
    body: 'Since the 1960s, farmers have applied far more phosphorus than crops remove. The data reveals stark regional differences — from heavy surpluses in livestock-intensive regions to deficits elsewhere. Across the EU, an average surplus of 0.8 kg P/ha/yr continues to accumulate in soils.',
    stat: { value: '+0.8 kg P/ha/yr', label: 'average EU surplus — accumulating every year' },
    source: 'Sattari et al., PNAS (2012)',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: [[-25, '#023e8a'], [-10, '#0077b6'], [0, '#1a1a2e'], [5, '#e76f51'], [15, '#f4a261'], [30, '#e9c46a']],
  },
  {
    id: 'depletion',
    badge: 'CONCENTRATED RISK',
    title: 'A non-renewable resource in few hands',
    body: 'Phosphate rock is the only primary source of phosphorus fertilizer — and it is non-renewable. Over 70% of global reserves are concentrated in Morocco alone. Europe has near-zero domestic reserves and depends heavily on imports.',
    stat: { value: '70%+', label: 'of global phosphate reserves held by Morocco' },
    source: 'USGS Mineral Commodity Summaries (2024)',
    mapState: { longitude: -5, latitude: 32, zoom: 3, pitch: 0, bearing: 0 },
    layerHighlight: 'MAR,CHN,EGY,TUN',
    layerOpacity: 0.5,
  },
  {
    id: 'environment',
    badge: 'ECOLOGICAL COST',
    title: 'What escapes the soil poisons the water',
    body: 'Phosphorus runoff is a primary driver of eutrophication — algal blooms that suffocate lakes, rivers, and coastal waters. The Baltic Sea, the Sea of Marmara, and freshwater bodies across Europe face severe ecological damage from agricultural phosphorus loss.',
    stat: { value: 'Primary driver', label: 'of freshwater eutrophication worldwide' },
    source: 'Carpenter et al., PNAS (2008); Schindler et al., PNAS (2008)',
    mapState: { longitude: 18, latitude: 58, zoom: 4.2, pitch: 30, bearing: 10 },
    layerOpacity: 0.5,
    nuts2Visible: true,
    nuts2Property: 'balance_ha',
    nuts2ColorScale: [[-25, '#023e8a'], [-10, '#0077b6'], [0, '#1a1a2e'], [5, '#e76f51'], [15, '#f4a261'], [30, '#e9c46a']],
  },
  {
    id: 'regulation',
    badge: 'REGULATION',
    title: 'Policy pressure is accelerating',
    body: 'The EU Soil Monitoring Directive (2025) establishes soil health monitoring frameworks across member states. Phosphate rock has been on the EU Critical Raw Materials list since 2014. Resource-efficiency and soil-monitoring pressure are increasing — making smarter phosphorus use increasingly urgent.',
    stat: { value: '2025', label: 'EU Soil Monitoring Directive adopted' },
    source: 'European Council (September 2025); EU CRM Act (2024)',
    mapState: { longitude: 10, latitude: 50, zoom: 4.5, pitch: 0, bearing: 0 },
    layerHighlight: 'NLD,BEL,DEU,FRA,DNK,AUT,IRL,LUX,ITA,ESP,PRT,GRC,POL,CZE,SVK,HUN,ROU,BGR,HRV,SVN,SWE,FIN,EST,LVA,LTU,CYP,MLT',
    layerColor: '#003399',
    layerOpacity: 0.4,
  },
  {
    id: 'opportunity',
    badge: 'THE OPPORTUNITY',
    title: 'Unlock what is already there',
    body: 'HeartsBio\'s enzyme technology is designed to improve access to poorly available phosphorus fractions in soil — turning a trapped resource into usable nutrition. Fitazim works in the field. Bio-Dop works at the factory. Together, they target the phosphorus problem from both ends of the value chain.',
    stat: { value: '$70B+', label: 'annual global phosphate fertilizer market' },
    source: 'Straits Research (2024); World Bank Commodity Markets',
    mapState: { longitude: 5.5, latitude: 52.1, zoom: 7, pitch: 40, bearing: -10 },
    layerHighlight: 'NLD',
    layerColor: '#7cc98a',
    layerOpacity: 0.4,
    nuts2Property: 'locked_value_eur_ha',
    nuts2ColorScale: [[0, '#1a1a2e'], [2000, '#2d6a4f'], [3000, '#52b788'], [4000, '#95d5b2'], [5000, '#d4a373']],
  },
];

/* ─── Build highlight filter for GeoJSON source (uses ISO_A3_EH for completeness) ─── */
const buildHighlightFilter = (ids: string | undefined): any => {
  if (!ids) return ['==', 'ISO_A3_EH', '___none___'];
  const codes = ids.split(',');
  return ['in', ['get', 'ISO_A3_EH'], ['literal', codes]];
};

/* ─── Component ─── */
interface Props {
  mapboxToken: string;
}

export default function PhosphorusStoryMap({ mapboxToken }: Props) {
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
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);
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
        { threshold: 0.5, rootMargin: '-30% 0px -30% 0px' }
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
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          onMouseMove={onMapHover}
          onMouseLeave={() => setHoveredRegion(null)}
          interactiveLayerIds={current.nuts2Visible ? ['nuts2-fill'] : []}
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
          {nuts2GeoJSON && current.nuts2Visible && (
            <Source id="nuts2" type="geojson" data={nuts2GeoJSON}>
              <Layer
                id="nuts2-fill"
                type="fill"
                paint={{
                  'fill-color': current.nuts2ColorScale
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
                paint={{
                  'line-color': 'rgba(255,255,255,0.15)',
                  'line-width': 0.5,
                }}
              />
            </Source>
          )}
        </Map>
        {/* Hover tooltip for NUTS2 regions */}
        {hoveredRegion && current.nuts2Visible && (() => {
          const r = hoveredRegion;
          const balance = r.balance_ha ?? 0;
          const isSurplus = balance > 0;
          const totalInput = r.total_input_ha ?? 0;
          const countryCode = (r.id || '').slice(0, 2);
          const countryNames: Record<string, string> = {
            AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', CY: 'Cyprus', CZ: 'Czechia',
            DE: 'Germany', DK: 'Denmark', EE: 'Estonia', EL: 'Greece', ES: 'Spain',
            FI: 'Finland', FR: 'France', HR: 'Croatia', HU: 'Hungary', IE: 'Ireland',
            IT: 'Italy', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia', MT: 'Malta',
            NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania', SE: 'Sweden',
            SI: 'Slovenia', SK: 'Slovakia', UK: 'United Kingdom',
          };
          const country = countryNames[countryCode] || countryCode;

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
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Region {r.id}</div>
              </div>

              {/* Key insight — changes based on active chapter */}
              {current.nuts2Property === 'total_input_ha' ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#52b788' }}>
                    {totalInput.toFixed(1)} kg P/ha
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    phosphorus applied per year
                  </div>
                  {r.fert_ha != null && r.manure_ha != null && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                      <span>{r.fert_ha} fertilizer</span>
                      <span>{r.manure_ha} manure</span>
                    </div>
                  )}
                </div>
              ) : current.nuts2Property === 'balance_ha' ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isSurplus ? '#f4a261' : '#0077b6' }}>
                    {isSurplus ? '+' : ''}{balance.toFixed(1)} kg P/ha/yr
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    {isSurplus
                      ? 'surplus — more P added than crops remove'
                      : 'deficit — crops removing more P than added'}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d4a373' }}>
                    €{(r.locked_value_eur_ha ?? 0).toLocaleString()}/ha
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    locked phosphorus value (fertilizer-equivalent)
                  </div>
                </div>
              )}

              {/* Bottom context */}
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                ~94% of soil P is unavailable to crops
              </div>
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
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 700, color: '#7cc98a', fontFamily: 'Manrope, sans-serif' }}>
                    {ch.stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{ch.stat.label}</div>
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
              aria-label={`Go to: ${ch.badge}`}
            />
          ))}
        </div>
      )}

      {/* NUTS2 color legend */}
      {current.nuts2Visible && current.nuts2ColorScale && (
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
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '80px',
              height: '8px',
              borderRadius: '4px',
              background: `linear-gradient(to right, ${current.nuts2ColorScale.map(([, c]) => c).join(', ')})`,
            }} />
            <span>{current.nuts2Property === 'balance_ha' ? 'P deficit → surplus' : current.nuts2Property === 'total_input_ha' ? 'Low → High input' : 'Low → High value'}</span>
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
            Panagos et al. 2022
          </div>
        </div>
      )}
    </div>
  );
}
