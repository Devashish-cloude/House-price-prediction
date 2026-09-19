import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, BookOpen, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 glass-panel mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏠</span>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                HouseAI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Intelligent House Price Prediction Agent built with XGBoost, SHAP Explainable AI, and modern full-stack web architecture for accurate real-estate valuations.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Genuine Machine Learning Pipeline</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Features
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/predict" className="hover:text-teal-500 transition-colors">ML Price Prediction</Link></li>
              <li><Link to="/assistant" className="hover:text-teal-500 transition-colors">AI Property Assistant</Link></li>
              <li><Link to="/analytics" className="hover:text-teal-500 transition-colors">Market Analytics</Link></li>
              <li><Link to="/compare" className="hover:text-teal-500 transition-colors">Property Comparison</Link></li>
              <li><Link to="/history" className="hover:text-teal-500 transition-colors">Prediction History</Link></li>
            </ul>
          </div>

          {/* Col 3: ML Methodology */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              AIML Technology
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>• XGBoost & Random Forest Regressors</li>
              <li>• SHAP TreeExplainer Attribution</li>
              <li>• Multi-Factor Counterfactual Simulator</li>
              <li>• Leaflet Geocoded Mapping</li>
              <li>• Fast Inference via FastAPI</li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Academic Submission
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Final Year College AIML Major Project. Built with full explainability, validation metrics, and dataset reproducibility.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Model Documentation →</span>
            </Link>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HouseAI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for College AIML & Full-Stack Demonstration</p>
        </div>
      </div>
    </footer>
  );
}
