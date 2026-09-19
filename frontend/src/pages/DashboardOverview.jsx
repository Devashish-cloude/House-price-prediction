import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Calculator, History, BarChart3, Bot, 
  TrendingUp, Building2, Sparkles, ArrowRight, ShieldCheck, 
  Layers, MapPin, Compass 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { usePrediction } from '../context/PredictionContext';
import { formatPrice } from '../utils/formatters';
import PropertyCard from '../components/PropertyCard';
import AnimatedCounter from '../components/AnimatedCounter';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { savedPredictions, modelMetrics, toggleCompare, compareList } = usePrediction();

  // Aggregate statistics
  const totalCount = savedPredictions.length;
  const prices = savedPredictions.map((p) => p.predicted_price);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const minPrice = prices.length ? Math.min(...prices) : 0;

  // Trend data for mini chart
  const trendData = [...savedPredictions]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((p, idx) => ({
      index: idx + 1,
      name: `${p.locality} (${p.bhk} BHK)`,
      price: p.predicted_price / 100000,
      priceFormatted: formatPrice(p.predicted_price),
      date: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    }));

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Analyst'}
            </h1>
            <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time real-estate valuation dashboard powered by {modelMetrics?.best_model_name || 'XGBoost ML Pipeline'}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/predict"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/20 flex items-center space-x-1.5 transition-all"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>New Prediction</span>
          </Link>
          <Link
            to="/assistant"
            className="px-4 py-2 rounded-xl glass-card text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center space-x-1.5 hover:border-teal-500/40 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Assistant</span>
          </Link>
        </div>
      </div>

      {/* 4 Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Predictions */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Predictions</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            <AnimatedCounter endValue={totalCount} duration={800} />
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Stored in Database</span>
          </p>
        </div>

        {/* Average Price */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Average Valuation</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            {formatPrice(avgPrice)}
          </p>
          <p className="text-[11px] text-slate-500">
            Across analyzed portfolios
          </p>
        </div>

        {/* Highest Prediction */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Highest Property</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            {formatPrice(maxPrice)}
          </p>
          <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
            Prime metro valuation
          </p>
        </div>

        {/* Lowest Prediction */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Lowest Property</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            {formatPrice(minPrice)}
          </p>
          <p className="text-[11px] text-amber-500 dark:text-amber-400 font-medium">
            Affordable entry point
          </p>
        </div>

      </div>

      {/* Valuation Progression Timeline Chart */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-teal-500" />
              <span>Valuation Progression Trends</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predicted valuations across recorded properties (in ₹ Lakhs)
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/20 font-bold">
            R²: {(modelMetrics?.best_metrics?.r2_score || 0.9035).toFixed(4)}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                formatter={(value) => [`₹${value} Lakhs`, 'Valuation']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="price" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#valGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Predictions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-teal-500" />
            <span>Recent Property Predictions</span>
          </h3>
          <Link
            to="/history"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
          >
            <span>View All ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPredictions.slice(0, 3).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectForCompare={() => toggleCompare(property)}
              isCompared={compareList.some((p) => p.id === property.id)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
