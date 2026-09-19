import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, Plus, Trash2, Building2, MapPin, 
  Check, X, Sparkles, ArrowRight, BarChart2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import { formatPrice } from '../utils/formatters';

export default function ComparePage() {
  const { compareList, removeFromCompare, toggleCompare, clearCompare, savedPredictions } = usePrediction();
  const [selectedToAdd, setSelectedToAdd] = useState('');

  // Fallback if less than 2 properties selected
  const activeItems = compareList.length >= 2 
    ? compareList 
    : savedPredictions.slice(0, Math.max(2, compareList.length));

  const handleAddProperty = (e) => {
    const id = e.target.value;
    if (!id) return;
    const prop = savedPredictions.find((p) => p.id === id);
    if (prop) {
      toggleCompare(prop);
    }
    setSelectedToAdd('');
  };

  // Chart data comparing properties
  const comparisonChartData = activeItems.map((item) => ({
    name: `${item.locality.split(' ')[0]} (${item.bhk}BHK)`,
    priceInLakhs: Number((item.predicted_price / 100000).toFixed(2)),
    area: item.area,
    pricePerSqft: item.price_per_sqft || Math.round(item.predicted_price / item.area),
    fullName: `${item.locality}, ${item.city}`
  }));

  const comparisonAttributes = [
    { label: 'City & Region', key: 'city' },
    { label: 'Locality', key: 'locality' },
    { label: 'Property Type', key: 'property_type' },
    { label: 'BHK Configuration', key: 'bhk', format: (v) => `${v} BHK` },
    { label: 'Super Built-up Area', key: 'area', format: (v) => `${v} sq.ft` },
    { label: 'Carpet Area', key: 'carpet_area', format: (v) => v ? `${v} sq.ft` : 'N/A' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Floor Level', key: 'floor', format: (v, p) => `Floor ${v} of ${p.total_floors}` },
    { label: 'Property Age', key: 'property_age', format: (v) => `${v} Years` },
    { label: 'Furnishing State', key: 'furnished' },
    { label: 'Condition', key: 'property_condition' },
    { label: 'Reserved Parking', key: 'parking', format: (v) => `${v} Slots` },
    { label: 'Predicted Valuation', key: 'predicted_price', format: (v) => formatPrice(v), highlight: true },
    { label: 'Price per sq.ft', key: 'price_per_sqft', format: (v, p) => `₹${(v || Math.round(p.predicted_price / p.area)).toLocaleString('en-IN')}` },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Scale className="w-5 h-5 text-teal-500" />
            <span>Property Scenario Comparison</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Side-by-side comparative analysis across architectural attributes and ML valuations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {savedPredictions.length > activeItems.length && (
            <select
              value={selectedToAdd}
              onChange={handleAddProperty}
              className="glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="">+ Add Property to Compare</option>
              {savedPredictions
                .filter((p) => !activeItems.some((a) => a.id === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.locality} ({p.bhk} BHK) - {formatPrice(p.predicted_price)}
                  </option>
                ))}
            </select>
          )}

          {activeItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <Scale className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Properties Selected</h3>
          <p className="text-xs text-slate-400">
            Select properties from your Prediction History or click "Add Property to Compare" to evaluate side-by-side.
          </p>
          <Link
            to="/history"
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold inline-block"
          >
            Select from History
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Comparison Matrix Table */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">
                      Specification
                    </th>
                    {activeItems.map((prop, idx) => (
                      <th key={prop.id || idx} className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold block">
                              Scenario {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {prop.locality}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCompare ? removeFromCompare(prop.id) : toggleCompare(prop)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {comparisonAttributes.map((attr, rowIdx) => (
                    <tr
                      key={attr.key}
                      className={attr.highlight ? 'bg-teal-500/5 font-bold text-teal-600 dark:text-teal-400' : 'hover:bg-slate-50 dark:hover:bg-white/5'}
                    >
                      <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {attr.label}
                      </td>
                      {activeItems.map((prop, colIdx) => {
                        const val = prop[attr.key];
                        const displayVal = attr.format ? attr.format(val, prop) : (val !== undefined ? String(val) : 'N/A');
                        return (
                          <td
                            key={colIdx}
                            className={`px-6 py-3.5 ${attr.highlight ? 'text-base font-display font-extrabold text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'}`}
                          >
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Comparison Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Price Comparison Bar */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-teal-500" />
                <span>Valuation Comparison (₹ Lakhs)</span>
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `₹${v}L`} />
                    <Tooltip
                      formatter={(v) => [`₹${v} Lakhs`, 'Valuation']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Bar dataKey="priceInLakhs" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price per Sqft Comparison */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Price per Sq.ft Benchmark (₹/sq.ft)</span>
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, bottom: 10, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                    <Tooltip
                      formatter={(v) => [`₹${v.toLocaleString('en-IN')}/sq.ft`, 'Price / sq.ft']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Bar dataKey="pricePerSqft" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
