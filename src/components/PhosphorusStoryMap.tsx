import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Source, Layer, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/* ─── GeoJSON country boundaries (vendored locally) ─── */
const COUNTRIES_GEOJSON_URL = '/data/ne-countries.geojson';

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
  layerOpacity?: number;
}

const chapters: Chapter[] = [
  {
    id: 'paradox',
    badge: 'THE PARADOX',
    title: 'Europe is sitting on a phosphorus fortune it cannot spend',
    body: 'Decades of fertilizer application have loaded agricultural soils across Europe with phosphorus. Yet a large share of applied P quickly becomes poorly available — bound to iron, aluminium, and calcium through sorption and precipitation.',
    stat: { value: 'Most applied P', label: 'becomes poorly available through soil fixation' },
    source: 'Hinsinger, Plant and Soil (2001); Holford, Aust. J. Soil Res. (1997)',
    mapState: { longitude: 10, latitude: 52, zoom: 3.8, pitch: 0, bearing: 0 },
    layerOpacity: 0.6,
  },
  {
    id: 'legacy',
    badge: 'LEGACY PHOSPHORUS',
    title: 'Decades of surplus, buried in plain sight',
    body: 'Since the 1960s, farmers have applied far more phosphorus than crops remove. The surplus accumulates as "legacy phosphorus" — residual P that is often poorly accessible to crops. Globally, an estimated 12,000 Tg has built up in cropland topsoils.',
    stat: { value: '12,000 Tg', label: 'of residual P accumulated in global cropland soils' },
    source: 'Sattari et al., PNAS (2012)',
    mapState: { longitude: 12, latitude: 50, zoom: 4.2, pitch: 20, bearing: -5 },
    layerHighlight: 'NLD,BEL,DEU,FRA,DNK,POL,GBR,IRL,LUX,AUT,CHE,CZE,SVK,HUN,ITA,ESP,PRT,ROU,BGR,HRV,SVN,SWE,FIN,NOR,EST,LVA,LTU,GRC',
    layerOpacity: 0.5,
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
    layerHighlight: 'SWE,FIN,EST,LVA,LTU,POL,DEU,DNK',
    layerOpacity: 0.5,
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
    layerOpacity: 0.4,
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
  const mapRef = useRef<MapRef>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load country boundaries GeoJSON
  useEffect(() => {
    fetch(COUNTRIES_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log('[PhosphorusStoryMap] Countries GeoJSON loaded:', data.features?.length, 'features');
        setCountriesGeoJSON(data);
      })
      .catch((err) => console.error('[PhosphorusStoryMap] Failed to load countries:', err));
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
          interactive={false}
          attributionControl={true}
        >
          {countriesGeoJSON && (
            <Source id="countries" type="geojson" data={countriesGeoJSON}>
              {/* Highlight fill */}
              <Layer
                id="country-highlight"
                type="fill"
                paint={{
                  'fill-color': '#7cc98a',
                  'fill-opacity': current.layerOpacity ?? 0.5,
                }}
                filter={buildHighlightFilter(current.layerHighlight)}
              />
              {/* Highlight border */}
              <Layer
                id="country-highlight-border"
                type="line"
                paint={{
                  'line-color': '#7cc98a',
                  'line-width': 1.5,
                  'line-opacity': 0.8,
                }}
                filter={buildHighlightFilter(current.layerHighlight)}
              />
            </Source>
          )}
        </Map>
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
    </div>
  );
}
