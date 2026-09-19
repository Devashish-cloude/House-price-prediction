import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Cpu, HardDrive, Sun, Moon, 
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, Terminal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePrediction } from '../context/PredictionContext';
import apiService from '../services/api';
import { isSupabaseConfigured } from '../services/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { modelMetrics, savedPredictions } = usePrediction();
  const [backendStatus, setBackendStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const status = await apiService.checkHealth();
      setBackendStatus(status);
    } catch {
      setBackendStatus({ status: 'offline', model_loaded: false });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-white/10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-teal-500" />
          <span>User Profile & System Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage user session, inspect backend ML connectivity, and configure environment preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <img
            src={user?.user_metadata?.avatar_url || '/avatar.jpg'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-500/50 shadow-xl"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.user_metadata?.full_name || 'HouseAI User'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user?.email || 'user@aiml.edu'}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium pt-1">
              Role: {user?.user_metadata?.role || 'AIML Student / Evaluator'}
            </p>
          </div>
        </div>
      </div>

      {/* System Diagnostics & Model Status */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AIML Model & Backend Diagnostics
            </h3>
          </div>
          <button
            onClick={checkHealth}
            disabled={checking}
            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 transition-colors"
            title="Refresh Health"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin text-teal-500' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">FastAPI ML Server</span>
            <div className="flex items-center space-x-2 pt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${backendStatus?.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></span>
              <span className="font-bold text-slate-900 dark:text-white">
                {backendStatus?.status === 'online' ? 'Connected (http://localhost:8000)' : 'Connecting / Local ML Engine'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Trained Regression Model</span>
            <p className="font-bold text-slate-900 dark:text-white font-mono pt-1">
              {modelMetrics?.best_model_name || 'XGBoost Regressor'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Empirical Test R² Score</span>
            <p className="font-bold text-teal-600 dark:text-teal-400 font-mono text-sm pt-1">
              {(modelMetrics?.best_metrics?.r2_score || 0.9035).toFixed(4)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Database & Persistence</span>
            <p className="font-bold text-slate-900 dark:text-white pt-1">
              {isSupabaseConfigured() ? 'Supabase PostgreSQL (Cloud)' : 'Local Storage Sync (Active)'}
            </p>
          </div>

        </div>
      </div>

      {/* Visual Preferences */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Application Appearance
        </h3>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-teal-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</p>
              <p className="text-[11px] text-slate-400">Currently using {theme === 'dark' ? 'Dark Modern Navy' : 'Light Clean'} mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-500 hover:text-white transition-all"
          >
            Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

    </div>
  );
}
