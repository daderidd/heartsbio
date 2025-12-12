import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FitazimVisualization = () => {
  const [activeMetric, setActiveMetric] = useState('dryMatter');

  // Data from Table 1 - Dose response
  const doseResponseData = [
    {
      dose: '0',
      dryMatter60: 4.29,
      dryMatter120: 6.22,
      dryMatter240: 7.15,
      pUptake60: 4.00,
      pUptake120: 5.68,
      pUptake240: 9.01
    },
    {
      dose: '2',
      dryMatter60: 5.12,
      dryMatter120: 7.24,
      dryMatter240: 9.09,
      pUptake60: 4.60,
      pUptake120: 7.32,
      pUptake240: 11.39
    },
    {
      dose: '4',
      dryMatter60: 5.14,
      dryMatter120: 7.57,
      dryMatter240: 9.06,
      pUptake60: 4.37,
      pUptake120: 8.80,
      pUptake240: 12.15
    },
    {
      dose: '6',
      dryMatter60: 6.20,
      dryMatter120: 8.37,
      dryMatter240: 10.41,
      pUptake60: 5.74,
      pUptake120: 9.70,
      pUptake240: 16.16
    }
  ];

  // Calculate improvement percentages
  const calculateImprovement = () => {
    const control = doseResponseData[0];
    const treated = doseResponseData[3]; // 6 L/Ha dose

    if (activeMetric === 'dryMatter') {
      return [
        { level: '60 ppm P', improvement: ((treated.dryMatter60 - control.dryMatter60) / control.dryMatter60 * 100).toFixed(0) },
        { level: '120 ppm P', improvement: ((treated.dryMatter120 - control.dryMatter120) / control.dryMatter120 * 100).toFixed(0) },
        { level: '240 ppm P', improvement: ((treated.dryMatter240 - control.dryMatter240) / control.dryMatter240 * 100).toFixed(0) }
      ];
    } else {
      return [
        { level: '60 ppm P', improvement: ((treated.pUptake60 - control.pUptake60) / control.pUptake60 * 100).toFixed(0) },
        { level: '120 ppm P', improvement: ((treated.pUptake120 - control.pUptake120) / control.pUptake120 * 100).toFixed(0) },
        { level: '240 ppm P', improvement: ((treated.pUptake240 - control.pUptake240) / control.pUptake240 * 100).toFixed(0) }
      ];
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{`Fitazim: ${label} L/Ha`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)} {activeMetric === 'dryMatter' ? 'g/plant' : 'mg/plant'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const improvements = calculateImprovement();

  return (
    <div className="w-full bg-gradient-to-br from-cream to-green/5 p-8 rounded-3xl">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <div className="inline-block bg-dark-green text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Clinical Trial Results
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-3">
          Fitazim<span className="text-dark-green">®</span> Field Trial Data
        </h2>
        <p className="text-xl text-black/70 max-w-2xl mx-auto">
          Proven phosphorus unlocking in alkaline soil conditions
        </p>
        <p className="text-sm text-black/60 mt-2">
          Corn growth trial in high pH soil (7.8) over 35 days
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Metric Toggle */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveMetric('dryMatter')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeMetric === 'dryMatter'
                ? 'bg-dark-green text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Plant Biomass
          </button>
          <button
            onClick={() => setActiveMetric('pUptake')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeMetric === 'pUptake'
                ? 'bg-dark-green text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Phosphorus Uptake
          </button>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4 text-center">
            {activeMetric === 'dryMatter' ? 'Dry Matter Production' : 'Phosphorus Uptake'}
            {' '}Response to Fitazim Dose
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={doseResponseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="dose"
                label={{ value: 'Fitazim Dose (L/Ha)', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
              />
              <YAxis
                label={{
                  value: activeMetric === 'dryMatter' ? 'Dry Matter (g/plant)' : 'P Uptake (mg/plant)',
                  angle: -90,
                  position: 'insideLeft'
                }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey={activeMetric === 'dryMatter' ? 'dryMatter60' : 'pUptake60'}
                name="60 ppm P"
                stroke="#93c5fd"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey={activeMetric === 'dryMatter' ? 'dryMatter120' : 'pUptake120'}
                name="120 ppm P"
                stroke="#243f2e"
                strokeWidth={3}
                dot={{ r: 5, fill: '#1d261d' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey={activeMetric === 'dryMatter' ? 'dryMatter240' : 'pUptake240'}
                name="240 ppm P"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f59e0b' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Results - Improvement Cards */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-center text-black mb-6">
            Proven Results at 6 L/Ha
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {improvements.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-dark-green/5 to-green/10 rounded-xl p-6 border border-dark-green/20">
                <div className="text-sm font-semibold text-dark-green mb-2">
                  {item.level}
                </div>
                <div className="text-4xl font-bold text-dark-green mb-1">
                  +{item.improvement}%
                </div>
                <div className="text-sm text-black/60">
                  vs. untreated control
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-black">35</div>
              <div className="text-sm text-black/60">Days Trial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">pH 7.8</div>
              <div className="text-sm text-black/60">Alkaline Soil</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">4</div>
              <div className="text-sm text-black/60">Dose Levels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">3</div>
              <div className="text-sm text-black/60">P Supply Rates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-6xl mx-auto mt-6 text-center text-sm text-black/60">
        Data represents mean values ± standard error | Fertilizer: DAP (Diammonium Phosphate)
      </div>
    </div>
  );
};

export default FitazimVisualization;
