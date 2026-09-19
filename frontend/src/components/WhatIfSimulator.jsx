import React, { useState, useEffect } from 'react';
import { 
  Sliders, RefreshCw, TrendingUp, TrendingDown, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, BarChart2 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import apiService from '../services/api';
import { formatPrice } from '../utils/formatters';

export default function WhatIfSimulator({ initialProperty, currentPrice = 7520000, onApplyModifications }) {
  const [property, setProperty] = useState(initialProperty);
  const [modifications, setModifications] = useState({
    area: initialProperty?.area || 1250,
    bhk: initialProperty?.bhk || 3,
    bathrooms: initialProperty?.bathrooms || 2,
    property_age: initialProperty?.property_age || 3,
    floor: initialProperty?.floor || 5,
    parking: initialProperty?.parking || 1,
    furnished: initialProperty?.furnished || 'Semi-Furnished',
    property_condition: initialProperty?.property_condition || 'Good',
    has_swimming_pool: initialProperty?.has_swimming_pool || false,
    has_gym: initialProperty?.has_gym || false,
    has_clubhouse: initialProperty?.has_clubhouse || false,
    has_power_backup: initialProperty?.has_power_backup || true,
    has_ac: initialProperty?.has_ac || false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'sensitivity'

  useEffect(() => {
    if (initialProperty) {
      setProperty(initialProperty);
    }
  }, [initialProperty]);

  // Run simulation whenever modifications change (debounced)
  useEffect(() => {
    if (!property) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const simRes = await apiService.simulateWhatIf(property, modifications);
        setResult(simRes);
      } catch (err) {
        console.warn('What-If simulation error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [property, modifications]);

  const handleSliderChange = (field, value) => {
    setModifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleAmenity = (field) => {
    setModifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleReset = () => {
    if (property) {
      setModifications({
        area: property.area,
        bhk: property.bhk,
        bathrooms: property.bathrooms,
        property_age: property.property_age,
        floor: property.floor,
        parking: property.parking,
        furnished: property.furnished,
        property_condition: property.property_condition,
        has_swimming_pool: property.has_swimming_pool,
        has_gym: property.has_gym,
        has_clubhouse: property.has_clubhouse,
        has_power_backup: property.has_power_backup,
        has_ac: property.has_ac,
      });
    }
  };

  const isPositive = (result?.price_diff || 0) >= 0;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-teal-500/20 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Sliders className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              What-If Property Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interactively adjust architectural specifications and inspect live machine-learning valuation shifts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Valuation Delta Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 border border-teal-500/20 text-white">
        
        {/* Current Estimate */}
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Current Baseline</p>
          <p className="text-2xl font-bold font-display mt-0.5">
            {result ? result.original_price_formatted : formatPrice(currentPrice)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Input specifications</p>
        </div>

        {/* New Estimate */}
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pl-4">
          <p className="text-[11px] uppercase tracking-wider text-teal-400 font-semibold flex items-center justify-center sm:justify-start space-x-1">
            <span>Simulated Estimate</span>
            {loading && <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />}
          </p>
          <p className="text-2xl font-bold font-display text-teal-300 mt-0.5">
            {result ? result.new_price_formatted : '...'}
          </p>
          <p className="text-[10px] text-teal-400/80 mt-0.5">Model output</p>
        </div>

        {/* Net Shift */}
        <div className="text-center sm:text-left sm:pl-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Net Difference</p>
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 mt-0.5">
            <span className={`text-2xl font-bold font-display ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result ? result.price_diff_formatted : '₹0'}
            </span>
          </div>
          <p className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'} mt-0.5`}>
            {result ? `${result.percentage_change >= 0 ? '+' : ''}${result.percentage_change}% impact` : ''}
          </p>
        </div>

      </div>

      {/* Simulator Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Slider 1: Built-up Area */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Built-up Area</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{modifications.area} sq.ft</span>
          </div>
          <input
            type="range"
            min="500"
            max="4500"
            step="50"
            value={modifications.area}
            onChange={(e) => handleSliderChange('area', Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>500 sq.ft</span>
            <span>4,500 sq.ft</span>
          </div>
        </div>

        {/* Slider 2: BHK Configuration */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>BHK Layout</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{modifications.bhk} BHK</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={modifications.bhk}
            onChange={(e) => handleSliderChange('bhk', Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1 BHK</span>
            <span>6 BHK</span>
          </div>
        </div>

        {/* Slider 3: Property Age */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Property Age</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{modifications.property_age} Years</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={modifications.property_age}
            onChange={(e) => handleSliderChange('property_age', Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 (New Construction)</span>
            <span>25 Years</span>
          </div>
        </div>

        {/* Slider 4: Floor Number */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Floor Level</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">Floor {modifications.floor}</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={modifications.floor}
            onChange={(e) => handleSliderChange('floor', Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 (Ground)</span>
            <span>30th Floor</span>
          </div>
        </div>

        {/* Dropdown 5: Furnishing Status */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Furnishing Level</label>
          <select
            value={modifications.furnished}
            onChange={(e) => handleSliderChange('furnished', e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
        </div>

        {/* Dropdown 6: Property Condition */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Condition Grade</label>
          <select
            value={modifications.property_condition}
            onChange={(e) => handleSliderChange('property_condition', e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="New">New / Mint</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Needs Renovation">Needs Renovation</option>
          </select>
        </div>

      </div>

      {/* Amenity Quick Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Amenity Upgrades</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'has_swimming_pool', label: '🏊 Swimming Pool' },
            { id: 'has_gym', label: '🏋️ Fitness Gym' },
            { id: 'has_clubhouse', label: '🏢 Clubhouse' },
            { id: 'has_power_backup', label: '⚡ 100% Power Backup' },
            { id: 'has_ac', label: '❄️ Central / Split AC' },
          ].map((am) => {
            const active = modifications[am.id];
            return (
              <button
                key={am.id}
                type="button"
                onClick={() => handleToggleAmenity(am.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {am.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensitivity Curve Chart if available */}
      {result?.sensitivity_curve && result.sensitivity_curve.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-teal-500" />
              <span>Sensitivity Curve for Modified Dimension</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Live ML Curve</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.sensitivity_curve} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="parameter_value" stroke="#94a3b8" fontSize={10} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(value), 'Estimated Valuation']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="estimated_price"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#14b8a6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Analysis Output text */}
      {result?.analysis && (
        <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-200 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
          <p>{result.analysis}</p>
        </div>
      )}

    </div>
  );
}
