import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.api.routes import router
from backend.services.ml_service import MLService

app = FastAPI(
    title="HouseAI API",
    description="Intelligent House Price Prediction Agent - Machine Learning, SHAP Explainability, and AI Property Assistant API",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server & production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting HouseAI FastAPI server...")
    # Initialize ML Service artifacts
    ml = MLService.get_instance()
    if ml.is_loaded:
        print(f"ML Model loaded: {ml.metadata.get('best_model_name')} (R²: {ml.metadata.get('best_metrics', {}).get('r2_score')})")
    else:
        print("Warning: Model artifacts not found. Initiating on-the-fly training...")
        from backend.ml.train import train_all_models
        train_all_models()
        ml.load_artifacts()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled exception on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)}
    )

app.include_router(router)

@app.get("/")
def root():
    return {
        "app": "HouseAI - Intelligent House Price Prediction Agent",
        "docs": "/docs",
        "health": "/api/health",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", os.environ.get("API_PORT", 8000)))
    host = os.environ.get("API_HOST", "0.0.0.0")
    print(f"Serving HouseAI API on http://{host}:{port}")
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
