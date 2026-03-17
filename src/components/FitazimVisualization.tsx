import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const FitazimVisualization = () => {
  const [step, setStep] = useState(0);
  const [metric, setMetric] = useState<'pUptake' | 'dryMatter'>('pUptake');

  const fullData = [
    { dose: 0, p60: 4.00, p120: 5.68, p240: 9.01, dm60: 4.29, dm120: 6.22, dm240: 7.15 },
    { dose: 2, p60: 4.60, p120: 7.32, p240: 11.39, dm60: 5.12, dm120: 7.24, dm240: 9.09 },
    { dose: 4, p60: 4.37, p120: 8.80, p240: 12.15, dm60: 5.14, dm120: 7.57, dm240: 9.06 },
    { dose: 6, p60: 5.74, p120: 9.70, p240: 16.16, dm60: 6.20, dm120: 8.37, dm240: 10.41 },
  ];

  const k = (base: string) => (metric === 'pUptake' ? `p${base}` : `dm${base}`) as keyof typeof fullData[0];

  // Step-dependent data slicing
  const chartData = step === 0 ? [] : step === 1 ? [fullData[0]] : fullData;

  // Improvements at 6 L/Ha
  const improvements = [
    { level: '60 ppm P', pct: metric === 'pUptake' ? 44 : 45, color: '#93c5fd' },
    { level: '120 ppm P', pct: metric === 'pUptake' ? 71 : 35, color: '#243f2e' },
    { level: '240 ppm P', pct: metric === 'pUptake' ? 79 : 46, color: '#f59e0b' },
  ];

  const unit = metric === 'pUptake' ? 'mg/plant' : 'g/plant';
  const yLabel = metric === 'pUptake' ? 'P Uptake (mg/plant)' : 'Dry Matter (g/plant)';

  const steps = [
    {
      tag: 'The Challenge',
      title: 'Soil phosphorus is locked away',
      text: 'Up to 80% of phosphorus in agricultural soils is bound in forms that plants cannot access. This "legacy phosphorus" represents billions in wasted fertilizer investment.',
    },
    {
      tag: 'The Baseline',
      title: 'Three soils, three starting points',
      text: 'We tested soils with 60, 120, and 240 ppm phosphorus — without Fitazim, plants can only access a fraction of what\'s available, regardless of how much P is in the soil.',
    },
    {
      tag: 'The Response',
      title: 'Fitazim unlocks bound phosphorus',
      text: 'As Fitazim dose increases from 0 to 6 L/Ha, phosphorus uptake rises consistently across all soil types. The enzyme combinations break down phytate and release plant-available P.',
    },
    {
      tag: 'The Result',
      title: 'More legacy P = greater returns',
      text: 'The highest-P soil (240 ppm) shows the most dramatic response — up to 79% more phosphorus uptake. Fitazim turns your soil\'s locked reserves into productive assets.',
    },
  ];

  const current = steps[step];
  const totalSteps = steps.length;

  const next = useCallback(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), [totalSteps]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const lineOpacity = (minStep: number) => step >= minStep ? 1 : 0;

  return (
    <div className="w-full bg-gradient-to-br from-cream to-green/5 p-6 md:p-8 rounded-3xl">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <div className="inline-block bg-dark-green text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Field Trial Results
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-2">
          Fitazim<span className="text-dark-green">&reg;</span> Field Trial Data
        </h2>
        <p className="text-sm text-black/60">
          Corn growth trial &middot; pH 7.8 alkaline soil &middot; 35 days
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Narrative panel + Chart */}
        <div className="grid lg:grid-cols-5 min-h-[500px]">

          {/* Left: Story panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-dark-green to-green p-8 md:p-10 flex flex-col justify-between text-white">
            <div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step ? 'w-8 bg-white' : i < step ? 'w-4 bg-white/50' : 'w-4 bg-white/20'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
                <span className="ml-auto text-white/40 text-xs font-mono">
                  {step + 1}/{totalSteps}
                </span>
              </div>

              {/* Narrative content */}
              <div key={step} className="animate-narrative">
                <div className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
                  {current.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight">
                  {current.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm md:text-base">
                  {current.text}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={prev}
                disabled={step === 0}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Previous step"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={step === totalSteps - 1}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Next step"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {step < totalSteps - 1 && (
                <button
                  onClick={next}
                  className="ml-auto text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  Next
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right: Chart area */}
          <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">

            {/* Metric toggle */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setMetric('pUptake')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  metric === 'pUptake'
                    ? 'bg-dark-green text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Phosphorus Uptake
              </button>
              <button
                onClick={() => setMetric('dryMatter')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  metric === 'dryMatter'
                    ? 'bg-dark-green text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Plant Biomass
              </button>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[350px] relative">
              {/* Step 0: placeholder message */}
              {step === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-green/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-dark-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-black/40 text-sm font-medium">Click next to explore the data</p>
                  </div>
                </div>
              )}

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="dose"
                    label={{ value: 'Fitazim Dose (L/Ha)', position: 'insideBottom', offset: -15, style: { fontSize: 12, fill: '#9ca3af' } }}
                    stroke="#d1d5db"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    domain={[0, 6]}
                    type="number"
                    ticks={[0, 2, 4, 6]}
                  />
                  <YAxis
                    label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 5, style: { fontSize: 12, fill: '#9ca3af' } }}
                    stroke="#d1d5db"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    domain={[0, metric === 'pUptake' ? 20 : 12]}
                  />
                  {step >= 2 && (
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
                              <p className="font-semibold text-gray-700 mb-1">Dose: {label} L/Ha</p>
                              {payload.map((entry: any, i: number) => (
                                <p key={i} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value.toFixed(1)} {unit}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  )}

                  {/* 60 ppm line */}
                  <Line
                    type="monotone"
                    dataKey={k('60')}
                    name="60 ppm P"
                    stroke="#93c5fd"
                    strokeWidth={step >= 2 ? 3 : 0}
                    strokeOpacity={lineOpacity(2)}
                    dot={{ r: step >= 1 ? 5 : 0, fill: '#60a5fa', strokeWidth: 2, stroke: '#fff' }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />

                  {/* 120 ppm line */}
                  <Line
                    type="monotone"
                    dataKey={k('120')}
                    name="120 ppm P"
                    stroke="#243f2e"
                    strokeWidth={step >= 2 ? 3 : 0}
                    strokeOpacity={lineOpacity(2)}
                    dot={{ r: step >= 1 ? 5 : 0, fill: '#1d261d', strokeWidth: 2, stroke: '#fff' }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />

                  {/* 240 ppm line */}
                  <Line
                    type="monotone"
                    dataKey={k('240')}
                    name="240 ppm P"
                    stroke="#f59e0b"
                    strokeWidth={step >= 2 ? 3 : 0}
                    strokeOpacity={lineOpacity(2)}
                    dot={{ r: step >= 1 ? 6 : 0, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />

                  {/* Step 3: highlight endpoint values */}
                  {step >= 3 && (
                    <>
                      <ReferenceDot x={6} y={fullData[3][k('240')] as number} r={10} fill="#f59e0b" fillOpacity={0.2} stroke="#f59e0b" strokeWidth={2} />
                      <ReferenceDot x={6} y={fullData[3][k('120')] as number} r={8} fill="#243f2e" fillOpacity={0.2} stroke="#243f2e" strokeWidth={2} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>

              {/* Legend */}
              {step >= 1 && (
                <div className="flex justify-center gap-6 -mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-[#93c5fd]" /> 60 ppm P
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-[#243f2e]" /> 120 ppm P
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" /> 240 ppm P
                  </div>
                </div>
              )}
            </div>

            {/* Improvement cards — only at step 3 */}
            {step >= 3 && (
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 animate-narrative">
                {improvements.map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-gradient-to-br from-dark-green/5 to-green/10 border border-dark-green/10">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-black/50">{item.level}</span>
                    </div>
                    <div className="text-3xl font-bold text-dark-green">+{item.pct}%</div>
                    <div className="text-xs text-black/40 mt-1">vs. control</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-4 text-center text-xs text-black/40">
        Corn growth trial &middot; DAP fertilizer &middot; Mean values &plusmn; SE
      </div>

      <style>{`
        @keyframes narrativeFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-narrative {
          animation: narrativeFade 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FitazimVisualization;
