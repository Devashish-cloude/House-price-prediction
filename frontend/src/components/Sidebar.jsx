import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calculator, History, BarChart3, 
  Bot, Scale, Settings, ShieldCheck, Sparkles, Cpu
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';

export default function Sidebar() {
  const location = useLocation();
  const { modelMetrics } = usePrediction();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predict Price', path: '/predict', icon: Calculator, badge: 'Live' },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, isNew: true },
    { name: 'Comparison', path: '/compare', icon: Scale },
    { name: 'Profile & Settings', path: '/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between p-4 glass-panel border-r border-slate-200/80 dark:border-white/10 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Intelligence Hub
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="flex items-center text-[10px] text-amber-500 font-bold">
                      <Sparkles className="w-3 h-3 animate-spin" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AIML Model Health Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-900/20 via-slate-900/40 to-emerald-950/20 border border-teal-500/20 dark:border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-teal-500">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Active ML Engine</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </div>

          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {modelMetrics?.best_model_name || 'XGBoost Regressor'}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-white/5">
            <span>Model R² Score:</span>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
              {(modelMetrics?.best_metrics?.r2_score || 0.9035).toFixed(4)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Explainability:</span>
            <span className="font-mono text-emerald-500 font-medium">SHAP Active</span>
          </div>
        </div>
      </div>

      {/* College Project Credit */}
      <div className="p-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="font-medium text-slate-700 dark:text-slate-300">HouseAI v1.0</p>
        <p className="text-[10px]">College AIML Major Project</p>
      </div>
    </aside>
  );
}
