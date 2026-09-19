# HouseAI — Intelligent House Price Prediction Agent
> **A Production-Quality Full-Stack AIML Real-Estate Valuation & Explainable AI Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-1.7+-EB5424.svg?style=flat&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![SHAP](https://img.shields.io/badge/Explainability-SHAP-FF6F00.svg?style=flat)](https://shap.readthedocs.io)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg?style=flat&logo=supabase&logoColor=white)](https://supabase.com)

---

## 1. Abstract
**HouseAI (Intelligent House Price Prediction Agent)** is a state-of-the-art, full-stack machine learning web application engineered to deliver precise, explainable, and interactive real-estate property valuations. By integrating ensemble regression algorithms (**XGBoost**, **Gradient Boosting**, and **Random Forest**) with **SHAP (SHapley Additive exPlanations)** and an interactive **AI Property Assistant**, HouseAI bridges the gap between raw statistical modeling and actionable decision-making for buyers, sellers, and appraisers.

---

## 2. Problem Statement
Traditional property valuation approaches rely heavily on static human appraisals, generic neighborhood averages, or simplistic linear models. These methods suffer from:
1. **Opaque Black-Box Models:** Inability to explain why a specific property received a certain valuation.
2. **Inability to Model Non-Linear Multi-Factor Dynamics:** Inadequate handling of how elevation, property age depreciation, furnishing grades, and hyper-local coordinate geography interact.
3. **Absence of Counterfactual Exploration:** Prospective homeowners cannot easily test *"What if I add 300 sq.ft or upgrade to a gated community?"* without initiating a costly re-appraisal.

---

## 3. Objectives
- Develop a genuine, reproducible machine learning training and evaluation pipeline comparing 5 industry-standard regression algorithms.
- Integrate quantitative explainability using **SHAP TreeExplainer** to calculate exact positive value drivers and depreciation penalties for every prediction.
- Build an interactive **What-If Property Simulator** that computes real-time counterfactual valuations and parameter sensitivity curves.
- Provide a conversational **PropertyAI Assistant** that contextually explains valuations, answers pricing questions, and suggests ROI-optimized property enhancements.
- Deliver a modern, glassmorphic React/Tailwind frontend featuring interactive Leaflet GIS maps, Recharts analytics, side-by-side scenario comparisons, and Supabase PostgreSQL persistence.

---

## 4. Key Features

| Category | Capabilities |
|---|---|
| **ML Engine** | Multi-model training (`Linear Regression`, `Decision Tree`, `Random Forest`, `Gradient Boosting`, `XGBoost`), automatic best model selection ($R^2 \approx 0.9035$), RMSE confidence intervals. |
| **Explainable AI (SHAP)** | Waterfall attributions, color-coded positive/negative impact bars, rupee-level feature breakdown, transparent interpretability notice. |
| **Location Intelligence** | Interactive Leaflet GIS map with drag-and-drop marker, coordinate synchronization, and support for 8 major Indian metro regions. |
| **AI Assistant** | Conversational PropertyAI Assistant with multi-turn context, natural language explanation, counterfactual query triggers, and renovation guidance. |
| **What-If Simulator** | Real-time sliders for Area, BHK, Age, Floor, Furnishing, and Amenities with live sensitivity curves. |
| **Comparison & History** | Side-by-side scenario matrix (2–4 properties), visual comparison charts, filterable prediction history table, and CSV export. |
| **Analytics Dashboard** | Scatter plots (Price vs Area), BHK distribution bars, city rate benchmarks, and global feature importance rankings. |
| **Authentication & Storage**| Supabase PostgreSQL with Row Level Security (RLS) and seamless local-storage fallback for instant academic demonstration. |

---

## 5. System Architecture

```mermaid
graph TD
    User([User / Browser]) <--> ReactFrontend[React + Vite + Tailwind CSS Frontend]
    ReactFrontend <-->|REST API (Axios)| FastAPIBackend[Python FastAPI Server]
    ReactFrontend <-->|Auth & Sync| SupabaseDB[(Supabase PostgreSQL / LocalStorage)]

    subgraph Backend AIML Engine
        FastAPIBackend --> MLService[ML Prediction Service]
        FastAPIBackend --> SHAPService[SHAP Explainability Engine]
        FastAPIBackend --> AssistantEngine[PropertyAI Assistant Engine]
        FastAPIBackend --> WhatIfEngine[What-If Simulation Engine]

        MLService --> ModelStore[(house_price_model.pkl & preprocessor.pkl)]
        SHAPService --> TreeExplainer[TreeExplainer Attributions]
    end

    subgraph ML Pipeline
        CSVDataset[(house_prices.csv Dataset)] --> TrainScript[backend/ml/train.py]
        TrainScript --> Preprocessing[StandardScaler + OneHotEncoder]
        Preprocessing --> Benchmarking[5-Model Benchmark Evaluation]
        Benchmarking --> ModelStore
    end
```

---

## 6. Technology Stack

### Frontend
- **Core:** React.js 18, Vite
- **Styling:** Tailwind CSS, PostCSS, Glassmorphism design system
- **Routing:** React Router DOM v6
- **Charts:** Recharts (Scatter, Area, Bar, Line)
- **GIS Mapping:** Leaflet, React-Leaflet
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Effects:** Canvas Confetti

### Backend & AIML
- **Web Framework:** Python FastAPI, Uvicorn
- **Data Processing:** Pandas, NumPy
- **Machine Learning:** Scikit-learn, XGBoost, Joblib
- **Explainability:** SHAP (SHapley Additive exPlanations)
- **Validation:** Pydantic v2
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS)

---

## 7. Machine Learning Methodology

### 7.1 Dataset Overview
The dataset contains **3,500 real-estate records** spanning 8 major Indian metro regions (**Nagpur, Mumbai, Pune, Bengaluru, Hyderabad, Delhi NCR, Chennai, Kolkata**) with 75+ localities and 32 features:
- **Numerical Features (25):** `area`, `carpet_area`, `bhk`, `bedrooms`, `bathrooms`, `balconies`, `floor`, `total_floors`, `property_age`, `parking`, `latitude`, `longitude`, `amenities_count`, and 12 binary amenity flags (`has_lift`, `has_gym`, `has_pool`, `has_security`, `has_power_backup`, `has_cctv`, etc.).
- **Categorical Features (5):** `city`, `locality`, `property_type`, `furnished`, `property_condition`.
- **Target Variable:** `price` (in INR).

### 7.2 Preprocessing & Feature Engineering
- **Missing Value Handling:** Median imputation for continuous dimensions; Mode imputation for categorical categories.
- **Outlier Detection:** Interquartile Range (IQR) filtering on $\text{Price per sq.ft} = \frac{\text{Price}}{\text{Area}}$ to eliminate synthetic anomalies.
- **Pipeline:** `ColumnTransformer` applying `StandardScaler()` to numerical features and `OneHotEncoder(handle_unknown='ignore')` to categorical variables.

### 7.3 Model Benchmarking Results (20% Holdout Test Set)

| Rank | Model | Validation $R^2$ Score | RMSE (INR) | MAE (INR) | MAPE (%) | Status |
|---|---|---|---|---|---|---|
| 🥇 **1** | **XGBoost Regressor** | **0.9035** | **₹43,53,144** | **₹20,18,811** | **11.2%** | **Selected Best Model** |
| 🥈 2 | Gradient Boosting Regressor | 0.9031 | ₹43,63,530 | ₹19,37,159 | 11.5% | Evaluated |
| 🥉 3 | Random Forest Regressor | 0.8615 | ₹52,16,509 | ₹26,94,340 | 14.8% | Evaluated |
| 4 | Linear Regression | 0.8607 | ₹52,31,779 | ₹26,85,458 | 15.2% | Evaluated |
| 5 | Decision Tree Regressor | 0.7563 | ₹69,18,009 | ₹38,66,020 | 21.4% | Evaluated |

---

## 8. Explainable AI with SHAP
For any property prediction $f(x)$, SHAP calculates the additive marginal contribution $\phi_i$ of each feature $i$ relative to the base expected value $E[f(x)]$:
$$f(x) = E[f(x)] + \sum_{i=1}^{M} \phi_i$$

### Global Feature Importance Hierarchy:
1. **Location & Locality Tier:** ~38.5%
2. **Super Built-up Area:** ~28.2%
3. **BHK Configuration:** ~12.4%
4. **Property Age (Depreciation):** ~6.8%
5. **Furnishing Status:** ~4.5%
6. **Amenities & Facilities:** ~3.8%
7. **Property Condition:** ~2.6%
8. **Floor Elevation:** ~1.9%
9. **Dedicated Parking:** ~1.3%

---

## 9. API Documentation

### Base URL: `http://localhost:8000`

#### 1. Predict Property Price
- **Endpoint:** `POST /api/predict`
- **Request Body:**
```json
{
  "city": "Nagpur",
  "locality": "Manish Nagar",
  "property_type": "Apartment",
  "area": 1250,
  "carpet_area": 1060,
  "bhk": 3,
  "bedrooms": 3,
  "bathrooms": 2,
  "balconies": 2,
  "floor": 5,
  "total_floors": 12,
  "property_age": 3,
  "parking": 1,
  "furnished": "Semi-Furnished",
  "property_condition": "Good",
  "latitude": 21.0911,
  "longitude": 79.0834,
  "has_parking": true,
  "has_lift": true,
  "has_security": true,
  "has_power_backup": true
}
```
- **Response:**
```json
{
  "predicted_price": 9153000,
  "price_formatted": "₹91.53 L",
  "price_per_sqft": 7322,
  "lower_range": 5450000,
  "upper_range": 12800000,
  "lower_range_formatted": "₹54.50 L",
  "upper_range_formatted": "₹1.28 Cr",
  "model_r2": 0.9035,
  "model_name": "XGBoost Regressor",
  "top_positive_features": [...],
  "top_negative_features": [...],
  "explanation": "BHK Layout (+₹16.25 L) and Super Built-up Area (+₹2.76 L) added positive value."
}
```

#### 2. What-If Counterfactual Simulation
- **Endpoint:** `POST /api/what-if`
- **Request Body:**
```json
{
  "original_property": { ... },
  "modifications": {
    "area": 1500,
    "furnished": "Fully Furnished"
  }
}
```

#### 3. AI Property Assistant Chat
- **Endpoint:** `POST /api/chat`
- **Request Body:**
```json
{
  "message": "What if my property was 1500 sq.ft?",
  "current_property": { ... },
  "conversation_history": []
}
```

#### 4. Model Evaluation Metrics
- **Endpoint:** `GET /api/model/metrics`

---

## 10. Database Schema (Supabase / PostgreSQL)

```sql
-- Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Predictions Table
CREATE TABLE public.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    property_type TEXT NOT NULL,
    area NUMERIC NOT NULL,
    bhk INTEGER NOT NULL,
    predicted_price NUMERIC NOT NULL,
    price_per_sqft NUMERIC NOT NULL,
    lower_range NUMERIC NOT NULL,
    upper_range NUMERIC NOT NULL,
    model_r2 NUMERIC,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Favorites Table
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, prediction_id)
);
```

---

## 11. Installation & How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "House price prediction"
```

### 2. Backend Setup
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# (Optional) Retrain ML Models
python backend/ml/train.py

# Start FastAPI Backend Server
uvicorn backend.main:app --reload --port 8000
```
Backend will be live at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend

# Install npm packages
npm install

# Start Vite Development Server
npm run dev
```
Frontend will be live at: `http://localhost:5173`.

---

## 12. Environment Variables (`.env.example`)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend URL
VITE_API_URL=http://localhost:8000

# Server Port
API_PORT=8000
API_HOST=0.0.0.0
```

---

## 13. Future Scope
- **Computer Vision Model Integration:** Real-time architectural quality scoring from uploaded property photographs (CNN / ResNet).
- **Time-Series Macroeconomic Forecasting:** ARIMA / Prophet integration for 5-year capital appreciation projections based on interest rate shifts.
- **Automated Floorplan Analysis:** CAD / Blueprint dimension parsing with computer vision.

---

## 14. Conclusion
HouseAI provides an end-to-end, academic-grade, and commercially viable AIML solution for intelligent property price prediction. By marrying **high-accuracy ensemble regression ($R^2 = 0.9035$)** with **transparent SHAP explainability**, an **interactive What-If simulator**, and an **AI Property Assistant**, the platform delivers both statistical rigor and a delightful user experience.
