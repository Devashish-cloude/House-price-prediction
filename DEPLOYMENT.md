# 🚀 Deployment Guide: Intelligent House Price Prediction Agent (HouseAI)

This guide provides step-by-step instructions for deploying both the **FastAPI Machine Learning Backend** and the **React Vite Frontend**, along with cloud database synchronization via **Supabase**.

---

## 📋 Table of Contents
1. [Option 1: Render (Recommended - 1-Click Full-Stack Blueprint)](#option-1-render-1-click-full-stack-blueprint)
2. [Option 2: Vercel (Frontend) + Render / Railway (Backend)](#option-2-vercel--render--railway)
3. [Option 3: Docker & Docker Compose (Self-Hosted / VPS)](#option-3-docker--docker-compose)
4. [Supabase Cloud Database Setup](#supabase-cloud-database-setup)
5. [Environment Variables Reference](#environment-variables-reference)

---

## Option 1: Render (1-Click Full-Stack Blueprint)

Render is the simplest free platform to host both the Python ML backend and the React Vite frontend together using the preconfigured [`render.yaml`](./render.yaml).

### Step 1: Push Project to GitHub
```bash
git init
git add .
git commit -m "Deploy Intelligent House Price Prediction Agent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/house-price-prediction.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read [`render.yaml`](./render.yaml) and configure two services:
   - **`houseai-backend`** (Python 3.11 Web Service running FastAPI)
   - **`houseai-frontend`** (Static Site hosting Vite React app)
5. Under Environment Variables, optionally add your **Supabase** credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Apply**. Render will automatically build, train the ML model, and deploy live URLs for both services!

---

## Option 2: Vercel + Render / Railway

### A. Deploy Backend to Render or Railway
1. In Render, select **New +** → **Web Service**.
2. Set Root Directory to repository root.
3. Build Command:
   ```bash
   pip install -r backend/requirements.txt && python -m backend.ml.train
   ```
4. Start Command:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```
5. Copy your live backend URL (e.g. `https://houseai-backend.onrender.com`).

### B. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your repository.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://houseai-backend.onrender.com` (your backend URL)
   - `VITE_SUPABASE_URL`: (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY`: (your Supabase anon key)
5. Click **Deploy**. Vercel will build and serve your app globally with edge caching.

---

## Option 3: Docker & Docker Compose (Any VPS / Cloud VM)

Deploy anywhere (AWS EC2, DigitalOcean Droplet, GCP Compute Engine, Azure, etc.) using Docker Compose:

### 1. Ensure Docker & Docker Compose are installed:
```bash
docker --version
docker compose version
```

### 2. Configure Environment:
```bash
cp .env.example .env
# Edit .env with your production Supabase keys (if used)
```

### 3. Build & Run Containers:
```bash
docker compose up --build -d
```

### 4. Verify Services:
- Frontend: `http://YOUR_SERVER_IP:3000`
- Backend API Docs: `http://YOUR_SERVER_IP:8000/docs`
- Backend Health: `http://YOUR_SERVER_IP:8000/api/health`

To view container logs:
```bash
docker compose logs -f
```

---

## Supabase Cloud Database Setup

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project (e.g., `house-price-prediction`).
3. In the Supabase Dashboard, go to **SQL Editor** → **New query**.
4. Open [`supabase/schema.sql`](./supabase/schema.sql), paste the entire SQL script, and click **Run**.
   - Creates `profiles`, `prediction_history`, and `market_analytics` tables.
   - Sets up Row Level Security (RLS) policies.
   - Inserts benchmark real-estate analytics data.
5. In **Project Settings** → **API**, copy:
   - **Project URL** -> `VITE_SUPABASE_URL` / `SUPABASE_URL`
   - **anon / public key** -> `VITE_SUPABASE_ANON_KEY`
   - **service_role key** -> `SUPABASE_SERVICE_ROLE_KEY`

---

## Environment Variables Reference

| Variable | Scope | Purpose | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Frontend | URL of deployed FastAPI backend | `https://houseai-backend.onrender.com` |
| `VITE_SUPABASE_URL` | Frontend | Supabase Project URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase Public Anonymous Key | `eyJhbGciOi...` |
| `API_PORT` / `PORT` | Backend | Port for Uvicorn server | `8000` |
| `API_HOST` | Backend | Host bind address | `0.0.0.0` |
| `SUPABASE_URL` | Backend | Supabase Backend Database URL | `https://xyzcompany.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Supabase Admin Service Key | `eyJhbGciOi...` |

---

## 🎯 Verification Checklist

After deployment, verify that all systems are operational:

- [ ] **Health Endpoint**: `GET /api/health` returns `{"status":"online","model_loaded":true}`.
- [ ] **Interactive API Docs**: `GET /docs` displays Swagger UI with all 7 endpoints.
- [ ] **Frontend Prediction**: Navigate to `/predict`, submit a property appraisal, and receive price estimate with confidence intervals.
- [ ] **Explainability**: View SHAP feature attribution waterfall and top positive/negative price factors.
- [ ] **Interactive Assistant**: Ask `/assistant` property valuation or negotiation questions.
