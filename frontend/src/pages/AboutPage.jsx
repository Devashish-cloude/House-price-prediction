import React from 'react';
import { 
  BookOpen, Brain, Cpu, Database, Layers, 
  ShieldCheck, Award, FileCode, CheckCircle2, Sparkles, Terminal 
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';

export default function AboutPage() {
  const { modelMetrics } = usePrediction();
  const r2Score = modelMetrics?.best_metrics?.r2_score || 0.9035;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Title */}
      <div className="text-center space-y-3 pt-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Major College Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Intelligent House Price Prediction Agent
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          A comprehensive AI/ML full-stack system incorporating tree-based regression algorithms, SHAP explainable AI, interactive GIS mapping, and counterfactual scenario simulation.
        </p>
      </div>

      {/* Abstract & Problem Statement */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Abstract & Problem Statement</h2>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Real estate appraisal is traditionally subjective, non-linear, and opaque. Traditional valuation methods often rely on simple heuristics or static averages that fail to capture the complex interplay between geographic coordinates, hyper-local amenity density, floor elevation, structural depreciation, and architectural dimensions.
          </p>
          <p>
            <strong>HouseAI</strong> resolves this opacity by integrating a genuine machine-learning pipeline that benchmarks five regression models, automatically selecting the optimal ensemble (XGBoost Regressor with <strong>R² = {(r2Score).toFixed(4)}</strong>). Crucially, the system pairs live predictions with <strong>SHAP (SHapley Additive exPlanations)</strong> to quantitatively explain why a property was valued at a given figure, enabling users to explore What-If counterfactual variations in real time.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. System Architecture</h2>
        </div>
        
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 font-mono text-[11px] text-teal-300 overflow-x-auto">
          <pre className="leading-relaxed">
{`┌────────────────────────────────────────────────────────┐
│               REACT.JS / VITE FRONTEND                 │
│  • Tailwind CSS Glassmorphism  • React Leaflet Maps     │
│  • Recharts Visualizations     • PropertyAI Assistant  │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (Axios)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 FASTAPI BACKEND SERVER                 │
│  • Pydantic Input Validation  • CORS Middleware        │
│  • Routes: /predict, /explain, /what-if, /chat, /metrics│
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌────────────────────────┐
│       ML INFERENCE ENGINE    │ │   SHAP EXPLAINABILITY  │
│ • ColumnTransformer Pipeline │ │ • TreeExplainer Engine │
│ • StandardScaler & OneHotEnc │ │ • Positive / Negative  │
│ • XGBoost Regressor (pkl)    │ │   Attribution Vector   │
└──────────────────────────────┘ └────────────────────────┘`}
          </pre>
        </div>
      </div>

      {/* Technology Stack Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2">
            <h4 className="font-bold text-teal-600 dark:text-teal-400">Frontend Technology</h4>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• <strong>Framework:</strong> React.js 18 with Vite</li>
              <li>• <strong>Styling:</strong> Tailwind CSS & Vanilla CSS Design System</li>
              <li>• <strong>Routing:</strong> React Router DOM v6</li>
              <li>• <strong>Charting:</strong> Recharts (Bar, Scatter, Area, Line)</li>
              <li>• <strong>Mapping:</strong> Leaflet & React-Leaflet with OpenStreetMap</li>
              <li>• <strong>Icons:</strong> Lucide React</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2">
            <h4 className="font-bold text-teal-600 dark:text-teal-400">Backend & Machine Learning</h4>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• <strong>API Framework:</strong> Python FastAPI & Uvicorn</li>
              <li>• <strong>ML Libraries:</strong> Scikit-learn, XGBoost, NumPy, Pandas</li>
              <li>• <strong>Explainable AI:</strong> SHAP (TreeExplainer)</li>
              <li>• <strong>Serialization:</strong> Joblib (.pkl pipelines)</li>
              <li>• <strong>Validation:</strong> Pydantic v2 Models</li>
              <li>• <strong>Database:</strong> Supabase PostgreSQL with RLS</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Machine Learning Methodology & Model Benchmarking */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Machine Learning Pipeline & Benchmarking</h2>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            The model was trained on 3,500 real-estate records spanning 8 major Indian metro regions with 32 distinct numerical and categorical dimensions.
          </p>
          <p>
            <strong>Preprocessing:</strong> Numerical features (Area, BHK, Age, Floor, Coordinates) are scaled using <code>StandardScaler</code>, while categorical dimensions (City, Locality, Furnishing, Condition, Property Type) are transformed via <code>OneHotEncoder</code> with unknown handling.
          </p>
        </div>

        {/* Model Results Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-900 font-bold border-b border-slate-200 dark:border-white/10 uppercase tracking-wider text-[10px] text-slate-400">
              <tr>
                <th className="px-4 py-3 font-sans">Model</th>
                <th className="px-4 py-3">R² Score</th>
                <th className="px-4 py-3">RMSE (₹)</th>
                <th className="px-4 py-3">MAE (₹)</th>
                <th className="px-4 py-3">MAPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              <tr className="bg-teal-500/10 font-bold text-teal-600 dark:text-teal-400">
                <td className="px-4 py-3 font-sans">XGBoost Regressor (Selected)</td>
                <td className="px-4 py-3">{(r2Score).toFixed(4)}</td>
                <td className="px-4 py-3">₹4,353,144</td>
                <td className="px-4 py-3">₹2,018,811</td>
                <td className="px-4 py-3">11.2%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans">Gradient Boosting Regressor</td>
                <td className="px-4 py-3">0.9031</td>
                <td className="px-4 py-3">₹4,363,530</td>
                <td className="px-4 py-3">₹1,937,159</td>
                <td className="px-4 py-3">11.5%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans">Random Forest Regressor</td>
                <td className="px-4 py-3">0.8615</td>
                <td className="px-4 py-3">₹5,216,509</td>
                <td className="px-4 py-3">₹2,694,340</td>
                <td className="px-4 py-3">14.8%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans">Linear Regression</td>
                <td className="px-4 py-3">0.8607</td>
                <td className="px-4 py-3">₹5,231,779</td>
                <td className="px-4 py-3">₹2,685,458</td>
                <td className="px-4 py-3">15.2%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans">Decision Tree Regressor</td>
                <td className="px-4 py-3">0.7563</td>
                <td className="px-4 py-3">₹6,918,009</td>
                <td className="px-4 py-3">₹3,866,020</td>
                <td className="px-4 py-3">21.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
