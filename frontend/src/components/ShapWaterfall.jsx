import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { TrendingUp, TrendingDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ShapWaterfall({ contributions = [], baseValue = 16500000, predictedPrice = 7500000 }) {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        <HelpCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
        <p className="text-xs">No SHAP explainability data available for this prediction.</p>
      </div>
    );
  }

  // Prepare chart data (sort by absolute magnitude)
  const chartData = [...contributions]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, 8)
    .map((item) => ({
      name: item.display_name,
      value: item.shap_value,
      valueInLakhs: Number((item.shap_value / 100000).toFixed(2)),
      formatted: formatPrice(Math.abs(item.shap_value)),
      impact: item.impact,
      description: item.description,
      rawItem: item,
    }));

  return (
    <div className="space-y-6">
      
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Why did the AI predict this price? (SHAP Analysis)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Feature attributions showing positive value drivers and depreciation factors
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-medium">
          <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Positive Value (+Value)</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-500 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Negative Impact (-Value)</span>
          </span>
        </div>
      </div>

      {/* Recharts Bar Contribution Visualizer */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickFormatter={(val) => `₹${val}L`}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              width={90}
            />
            <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isPos = data.value >= 0;
                  return (
                    <div className="glass-card p-3 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 text-xs max-w-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{data.name}</p>
                      <p className={`font-mono font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPos ? '+' : '-'}{data.formatted} ({data.valueInLakhs} Lakhs)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{data.description}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="valueInLakhs" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? '#10b981' : '#f43f5e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Contribution Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {contributions.slice(0, 6).map((c, idx) => {
          const isPos = c.shap_value >= 0;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                isPos
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                  : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {c.display_name}
                </span>
                <span className={`inline-flex items-center space-x-0.5 text-xs font-mono font-bold ${
                  isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPos ? '+' : ''}{formatPrice(c.shap_value)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium truncate">{c.feature_value}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {c.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transparent Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Interpretability Notice:</strong> SHAP (SHapley Additive exPlanations) quantitatively decomposes the ML model's output relative to baseline training averages. Values represent statistical feature attributions rather than guaranteed financial appraisal covenants.
        </p>
      </div>

    </div>
  );
}
