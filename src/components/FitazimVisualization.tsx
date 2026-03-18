import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot,
} from 'recharts';

/* ─── Data ─── */
const fullData = [
  { dose: 0, p60: 4.00, p120: 5.68, p240: 9.01, dm60: 4.29, dm120: 6.22, dm240: 7.15 },
  { dose: 2, p60: 4.60, p120: 7.32, p240: 11.39, dm60: 5.12, dm120: 7.24, dm240: 9.09 },
  { dose: 4, p60: 4.37, p120: 8.80, p240: 12.15, dm60: 5.14, dm120: 7.57, dm240: 9.06 },
  { dose: 6, p60: 5.74, p120: 9.70, p240: 16.16, dm60: 6.20, dm120: 8.37, dm240: 10.41 },
];

const emptyData = [
  { dose: 0, p60: null, p120: null, p240: null, dm60: null, dm120: null, dm240: null },
  { dose: 6, p60: null, p120: null, p240: null, dm60: null, dm120: null, dm240: null },
];

/* ─── Annotation type ─── */
interface Note {
  text: string;
  // If targetDose+targetValue set, arrow points to that data coordinate
  targetDose?: number;
  targetValue?: number;
  // Pixel offset from target (or from chart center if no target)
  textOffsetX: number;
  textOffsetY: number;
  maxW?: number;
}

/* ─── Step definitions ─── */
type Metric = 'p' | 'dm';

interface Step {
  data: any[];
  metric: Metric;
  showLines: boolean;
  highlight: boolean;
  showResults: boolean;
  annotations: Note[];
}

const steps: Step[] = [
  // 0 — Explain axes
  {
    data: emptyData, metric: 'p', showLines: false, highlight: false, showResults: false,
    annotations: [
      { text: '→ How much Fitazim was applied (none to highest dose)', textOffsetX: 0, textOffsetY: 260, maxW: 300 },
      { text: '↑ How much phosphorus plants absorbed', targetDose: 0, targetValue: 13, textOffsetX: 100, textOffsetY: -15, maxW: 170 },
    ],
  },
  // 1 — Baseline dots
  {
    data: [fullData[0]], metric: 'p', showLines: false, highlight: false, showResults: false,
    annotations: [{
      text: 'Three soils tested — without Fitazim, plants access only a fraction',
      targetDose: 0, targetValue: 9.01, textOffsetX: 120, textOffsetY: -50, maxW: 230,
    }],
  },
  // 2 — P Uptake lines
  {
    data: fullData, metric: 'p', showLines: true, highlight: false, showResults: false,
    annotations: [{
      text: 'As Fitazim dose increases, phosphorus absorption rises across all soil types',
      textOffsetX: 0, textOffsetY: 35, maxW: 320,
    }],
  },
  // 3 — Highlight 240 ppm at dose 6
  {
    data: fullData, metric: 'p', showLines: true, highlight: true, showResults: false,
    annotations: [{
      text: 'The richest soils show the strongest response — up to +79%',
      targetDose: 6, targetValue: 16.16, textOffsetX: -140, textOffsetY: -50, maxW: 200,
    }],
  },
  // 4 — Results
  {
    data: fullData, metric: 'p', showLines: true, highlight: true, showResults: true,
    annotations: [{
      text: 'A clear dose–performance relationship across all soil conditions',
      textOffsetX: 0, textOffsetY: 35, maxW: 320,
    }],
  },
  // 5 — Biomass (LAST)
  {
    data: fullData, metric: 'dm', showLines: true, highlight: false, showResults: true,
    annotations: [{
      text: 'More phosphorus means bigger, healthier crops',
      targetDose: 6, targetValue: 10.41, textOffsetX: -130, textOffsetY: -50, maxW: 200,
    }],
  },
];

/* ─── Hook: read chart plot area from DOM ─── */
function useChartArea(containerRef: React.RefObject<HTMLDivElement | null>, deps: any[]) {
  const [area, setArea] = useState<{
    x: number; y: number; width: number; height: number;
    xMin: number; xMax: number; yMin: number; yMax: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Wait for Recharts to render
    const timer = setTimeout(() => {
      const svg = el.querySelector('.recharts-wrapper svg');
      const cartesian = el.querySelector('.recharts-cartesian-grid');
      if (!svg || !cartesian) { setArea(null); return; }

      const svgRect = svg.getBoundingClientRect();
      const gridRect = cartesian.getBoundingClientRect();

      setArea({
        x: gridRect.left - svgRect.left,
        y: gridRect.top - svgRect.top,
        width: gridRect.width,
        height: gridRect.height,
        xMin: 0, xMax: 6,
        yMin: 0, yMax: 0, // set per step
      });
    }, 200);
    return () => clearTimeout(timer);
  }, deps);

  return area;
}

/* ─── Main ─── */
const FitazimVisualization = () => {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const total = steps.length;
  const cur = steps[step];

  const yMax = cur.metric === 'p' ? 20 : 12;
  const chartArea = useChartArea(chartContainerRef, [step, cur.metric]);

  // Convert data coordinates to pixel position relative to chart container
  const dataToPixel = useCallback((dose: number, value: number) => {
    if (!chartArea) return { x: 0, y: 0 };
    const x = chartArea.x + (dose / 6) * chartArea.width;
    const y = chartArea.y + (1 - value / yMax) * chartArea.height;
    return { x, y };
  }, [chartArea, yMax]);

  // Smooth transition
  const transitionTo = useCallback((target: number) => {
    if (target === step || target < 0 || target >= total) return;
    setTransitioning(true);
    setTimeout(() => {
      setPrevStep(step);
      setStep(target);
      setTimeout(() => setTransitioning(false), 50);
    }, 300);
  }, [step, total]);

  // Auto-play 3s
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setStep(s => {
        if (s >= total - 1) { setPaused(true); return s; }
        setPrevStep(s);
        return s + 1;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [paused, total]);

  const goTo = useCallback((i: number) => {
    setPaused(true);
    transitionTo(Math.max(0, Math.min(i, total - 1)));
  }, [total, transitionTo]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(step + 1);
      if (e.key === 'ArrowLeft') goTo(step - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goTo, step]);

  const k = (level: string) => (cur.metric === 'p' ? `p${level}` : `dm${level}`) as keyof typeof fullData[0];
  const yLabel = cur.metric === 'p' ? 'P Uptake (mg/plant)' : 'Dry Matter (g/plant)';
  const unit = cur.metric === 'p' ? 'mg/plant' : 'g/plant';

  const soilLabels: Record<string, string> = { '60': 'Low-P soil (60 ppm)', '120': 'Medium-P soil (120 ppm)', '240': 'High-P soil (240 ppm)' };
  const soilColors = { '60': '#93c5fd', '120': '#243f2e', '240': '#f59e0b' };
  const handFont = "'Virgil', 'Segoe Print', 'Comic Sans MS', cursive";

  // Compute annotation positions
  const getAnnotationPositions = () => {
    if (!chartArea) return [];
    const centerX = chartArea.x + chartArea.width / 2;

    return cur.annotations.map((ann) => {
      const hasTarget = ann.targetDose !== undefined && ann.targetValue !== undefined;
      let textX: number, textY: number, targetX = 0, targetY = 0;

      if (hasTarget) {
        const tp = dataToPixel(ann.targetDose!, ann.targetValue!);
        targetX = tp.x;
        targetY = tp.y;
        textX = targetX + ann.textOffsetX;
        textY = targetY + ann.textOffsetY;
      } else {
        textX = centerX + ann.textOffsetX;
        textY = chartArea.y + ann.textOffsetY;
      }

      return { ...ann, textX, textY, targetX, targetY, hasTarget };
    });
  };

  const positions = getAnnotationPositions();

  return (
    <div ref={ref} className="w-full bg-gradient-to-br from-cream to-green/5 p-6 md:p-8 rounded-3xl">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-4 text-center">
        <div className="inline-block bg-dark-green text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
          Field Trial Results
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-black mb-1">
          How Fitazim Unlocks Soil Phosphorus
        </h2>
        <p className="text-sm text-black/50">
          Independent corn growth trial &middot; 35 days &middot; alkaline soil
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6">
        {/* Metric indicator */}
        <div className="flex justify-center mb-3">
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-700 ${
            cur.metric === 'p'
              ? 'bg-dark-green/10 text-dark-green'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {cur.metric === 'p' ? 'Measuring: Phosphorus Uptake (mg/plant)' : 'Measuring: Plant Biomass — Dry Matter (g/plant)'}
          </div>
        </div>

        {/* Chart + overlay annotations */}
        <div ref={chartContainerRef} className="relative" style={{ minHeight: '420px' }}>
          <div
            className="transition-opacity duration-300"
            style={{ opacity: transitioning ? 0 : 1 }}
          >
            {/* Annotation overlay: arrows (SVG) + text (HTML) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Single SVG layer for all arrows */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                {positions.map((p, i) => p.hasTarget ? (
                  <g key={`arrow-${step}-${i}`} className="anim-note">
                    <line
                      x1={p.targetX > p.textX ? p.textX + (p.maxW || 220) / 2 : p.textX - (p.maxW || 220) / 2} y1={p.textY + 35}
                      x2={p.targetX} y2={p.targetY}
                      stroke="#1d261d" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4}
                    />
                    <circle cx={p.targetX} cy={p.targetY} r={4} fill="#1d261d" opacity={0.35} />
                  </g>
                ) : null)}
              </svg>
              {/* Text labels */}
              {positions.map((p, i) => (
                <div
                  key={`text-${step}-${i}`}
                  className="absolute anim-note"
                  style={{
                    left: p.textX - (p.maxW || 220) / 2,
                    top: p.textY,
                    width: p.maxW || 220,
                    fontFamily: handFont,
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.3',
                    color: 'rgba(29,38,29,0.8)',
                    textAlign: 'center',
                  }}
                >
                  {p.text}
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={420}>
              <LineChart data={cur.data} margin={{ top: 40, right: 30, bottom: 45, left: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="dose" type="number" domain={[0, 6]} ticks={[0, 2, 4, 6]}
                  stroke="#d1d5db" tick={{ fontSize: 12, fill: '#9ca3af' }}
                  label={{ value: 'Fitazim Dose (L/Ha)', position: 'insideBottom', offset: -18, style: { fontSize: 12, fill: '#9ca3af' } }}
                />
                <YAxis
                  domain={[0, yMax]} stroke="#d1d5db" tick={{ fontSize: 12, fill: '#9ca3af' }}
                  label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 5, style: { fontSize: 12, fill: '#9ca3af' } }}
                />

                {cur.showLines && (
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
                            <p className="font-semibold text-gray-600 mb-1">
                              Fitazim dose: {label === 0 ? 'None' : label === 2 ? 'Low' : label === 4 ? 'Medium' : 'High'}
                            </p>
                            {payload.map((e: any, idx: number) => (
                              <p key={idx} style={{ color: e.color }} className="flex justify-between gap-4">
                                <span>{e.name}</span>
                                <span className="font-semibold">{e.value.toFixed(1)} {unit}</span>
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                )}

                <Line type="monotone" dataKey={k('60')} name={soilLabels['60']} stroke={soilColors['60']}
                  strokeWidth={cur.showLines ? 2.5 : 0} connectNulls={false}
                  dot={{ r: cur.data.length === 1 ? 6 : cur.data === emptyData ? 0 : 4, fill: soilColors['60'], strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1200} animationEasing="ease-out"
                />
                <Line type="monotone" dataKey={k('120')} name={soilLabels['120']} stroke={soilColors['120']}
                  strokeWidth={cur.showLines ? 2.5 : 0} connectNulls={false}
                  dot={{ r: cur.data.length === 1 ? 6 : cur.data === emptyData ? 0 : 4, fill: soilColors['120'], strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1200} animationEasing="ease-out"
                />
                <Line type="monotone" dataKey={k('240')} name={soilLabels['240']} stroke={soilColors['240']}
                  strokeWidth={cur.showLines ? 3 : 0} connectNulls={false}
                  dot={{ r: cur.data.length === 1 ? 7 : cur.data === emptyData ? 0 : 5, fill: soilColors['240'], strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1200} animationEasing="ease-out"
                />

                {cur.highlight && cur.metric === 'p' && (
                  <>
                    <ReferenceDot x={6} y={16.16} r={14} fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.4} />
                    <ReferenceDot x={6} y={9.70} r={11} fill="#243f2e" fillOpacity={0.08} stroke="#243f2e" strokeWidth={1.5} strokeOpacity={0.3} />
                    <ReferenceDot x={6} y={5.74} r={9} fill="#93c5fd" fillOpacity={0.1} stroke="#93c5fd" strokeWidth={1.5} strokeOpacity={0.3} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          {step >= 1 && (
            <div className="flex justify-center gap-6 mt-2 mb-1 transition-opacity duration-500" style={{ opacity: transitioning ? 0 : 1 }}>
              {Object.entries(soilLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: soilColors[key as keyof typeof soilColors] }} />
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results cards */}
        <div className={`overflow-hidden transition-all duration-700 ease-out ${cur.showResults ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="pt-5 border-t border-gray-100">
            <p className="text-center text-xs text-black/30 mb-4 uppercase tracking-wider font-semibold">At highest Fitazim dose vs. no treatment</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-amber-200/50 bg-amber-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-xs font-semibold text-black/40">High-phosphorus soil</span>
                </div>
                <div className="text-3xl font-bold text-dark-green mb-1">+79%</div>
                <p className="text-xs text-black/50 leading-relaxed">more phosphorus absorbed by plants</p>
              </div>
              <div className="p-5 rounded-xl border border-dark-green/10 bg-dark-green/[0.03]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#243f2e]" />
                  <span className="text-xs font-semibold text-black/40">Medium-phosphorus soil</span>
                </div>
                <div className="text-3xl font-bold text-dark-green mb-1">+71%</div>
                <p className="text-xs text-black/50 leading-relaxed">more phosphorus absorbed by plants</p>
              </div>
              <div className="p-5 rounded-xl border border-amber-200/50 bg-amber-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-xs font-semibold text-black/40">High-phosphorus soil</span>
                </div>
                <div className="text-3xl font-bold text-dark-green mb-1">+46%</div>
                <p className="text-xs text-black/50 leading-relaxed">more crop biomass produced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button onClick={() => goTo(step - 1)} disabled={step === 0}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed" aria-label="Previous">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-500 ${i === step ? 'w-6 h-2 bg-dark-green' : i < step ? 'w-2 h-2 bg-dark-green/30' : 'w-2 h-2 bg-gray-200'}`}
                aria-label={`Step ${i + 1}`} />
            ))}
          </div>
          <button onClick={() => goTo(step + 1)} disabled={step === total - 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed" aria-label="Next">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Footnote */}
      <div className="max-w-5xl mx-auto mt-3 text-center text-[10px] text-black/25">
        Corn growth trial &middot; pH 7.8 alkaline soil &middot; DAP fertilizer &middot; 60/120/240 ppm P supply rates &middot; Doses: 0–6 L/Ha &middot; Mean values &plusmn; SE
      </div>

      <style>{`
        @font-face {
          font-family: 'Virgil';
          src: url('/fonts/Virgil.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @keyframes noteIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .anim-note { animation: noteIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>
  );
};

export default FitazimVisualization;
