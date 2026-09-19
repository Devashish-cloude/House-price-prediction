#!/bin/bash
set -e

echo "=================================================="
echo "🚀 HouseAI Deployment & Build Verification Script"
echo "=================================================="

# 1. Check Python
echo "📦 [1/4] Verifying Python Environment..."
if [ -f ".venv/bin/python" ]; then
    PYTHON_CMD=".venv/bin/python"
elif [ -f "venv/bin/python" ]; then
    PYTHON_CMD="venv/bin/python"
elif command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "❌ Python is not installed."
    exit 1
fi
$PYTHON_CMD --version

# 2. Check Node & npm
echo "📦 [2/4] Verifying Node & npm Environment..."
node --version
npm --version

# 3. Train / Verify ML Model Artifacts
echo "🧠 [3/4] Ensuring ML Model Artifacts are Compiled..."
$PYTHON_CMD -m backend.ml.train

# 4. Build Frontend Bundle
echo "🎨 [4/4] Compiling React Vite Production Bundle..."
cd frontend
npm run build
cd ..

echo "=================================================="
echo "✅ All Build & ML Artifact Checks Passed Successfully!"
echo "   Ready to deploy via Render, Vercel, or Docker."
echo "   See DEPLOYMENT.md for step-by-step instructions."
echo "=================================================="
