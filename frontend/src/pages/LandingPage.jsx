import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Sparkles, Brain, MapPin, Bot, History, 
  Sliders, ArrowRight, CheckCircle2, ShieldCheck, 
  BarChart3, Cpu, Zap, Award 
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { usePrediction } from '../context/PredictionContext';

export default function LandingPage() {
  const { modelMetrics } = usePrediction();
  const r2Score = modelMetrics?.best_metrics?.r2_score || 0.9035;

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Prediction',
      desc: 'Machine-learning-based property valuation powered by trained XGBoost & Random Forest ensembles.',
      badge: 'ML Engine'
    },
    {
      icon: Brain,
      title: 'Explainable AI (SHAP)',
      desc: 'Understand why the model predicted a particular price with exact quantitative feature attributions.',
      badge: 'SHAP'
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      desc: 'Analyze the effect of location, city tier, and neighborhood characteristics with interactive maps.',
      badge: 'GIS Map'
    },
    {
      icon: Bot,
      title: 'Smart AI Assistant',
      desc: 'Ask questions about your property, inspect value drivers, and receive tailored optimization suggestions.',
      badge: 'Conversational'
    },
    {
      icon: History,
      title: 'Prediction History',
      desc: 'Store, filter, and track previous valuations with Supabase database persistence.',
      badge: 'Database'
    },
    {
      icon: Sliders,
      title: 'What-If Analysis',
      desc: 'Change property parameters and dynamically observe how the estimated valuation responds.',
      badge: 'Simulator'
    },
  ];

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State-of-the-Art Machine Learning & Explainability</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Intelligent House Price{' '}
            <span className="bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Prediction Agent
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Predict the estimated value of your property using Machine Learning and Artificial Intelligence. Explain valuation drivers with SHAP and simulate counterfactual scenarios in real time.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/predict"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 hover:scale-[1.02] transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Predict House Price</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card text-slate-800 dark:text-slate-200 hover:text-teal-500 font-bold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

        </div>

        {/* Hero Demo Showcase Visual Card */}
        <div className="mt-14 max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-500/20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                Live Model Demonstration
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Bandra West, Mumbai
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                3 BHK Luxury Apartment • 1,650 sq.ft • 14th Floor • Sea View
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Predicted Valuation</span>
                <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-display">
                  ₹7.48 Cr
                </p>
                <p className="text-[11px] text-slate-500">Confidence Band: ₹7.05 Cr — ₹7.91 Cr</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                <span>SHAP Value Drivers</span>
                <span className="text-emerald-400 font-mono">R²: {(r2Score).toFixed(4)}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Prime Locality (Bandra West)</span>
                    <span className="text-emerald-400 font-mono font-bold">+₹2.85 Cr</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Super Built-up Area (1,650 sq.ft)</span>
                    <span className="text-emerald-400 font-mono font-bold">+₹1.20 Cr</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[65%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Age Depreciation (2 Years)</span>
                    <span className="text-rose-400 font-mono font-bold">-₹14.2 L</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full w-[15%]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-display">
              <AnimatedCounter endValue={r2Score * 100} duration={1200} formatter={(v) => `${v.toFixed(1)}%`} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Validation R² Score</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              <AnimatedCounter endValue={3500} duration={1200} formatter={(v) => `${Math.round(v).toLocaleString('en-IN')}+`} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Trained Real-Estate Records</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-display">
              8 Metros
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Tier 1 & Tier 2 Cities</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500 font-display">
              &lt; 20 ms
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">ML Inference Latency</p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            End-to-End AIML Capabilities
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Engineered with deep learning and tree regression algorithms for high accuracy, complete explainability, and counterfactual simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 space-y-4 hover:border-teal-500/40 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-white/5">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              How HouseAI Works
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              From raw property specifications to explainable machine learning predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Input Details', desc: 'Select location on interactive map, specify BHK, area, floor, and amenities.' },
              { step: '02', title: 'Preprocessing', desc: 'ColumnTransformer scales numerical metrics and one-hot encodes categorical dimensions.' },
              { step: '03', title: 'XGBoost Valuation', desc: 'Pre-trained ensemble executes inference with uncertainty confidence bands.' },
              { step: '04', title: 'SHAP Explainability', desc: 'Decomposes valuation into positive drivers, depreciation penalties, and counterfactuals.' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 space-y-2">
                <span className="text-2xl font-extrabold text-teal-500 font-mono">{st.step}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-teal-900/40 via-slate-900 to-emerald-950/40 border border-teal-500/30 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Valuate Your Property?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience real-time AI valuations, interact with the PropertyAI assistant, and simulate architectural modifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/predict"
              className="px-8 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all"
            >
              Start Free Valuation →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
