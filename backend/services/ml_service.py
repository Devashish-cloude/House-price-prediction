import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List
from backend.schemas.property import (
    PredictionInput, PredictionResponse, FeatureContribution
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

MODEL_PATH = os.path.join(MODEL_DIR, "house_price_model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")
COMPARISON_PATH = os.path.join(MODEL_DIR, "model_comparison.json")

def format_inr(amount: float) -> str:
    """Formats numeric amount into Indian Currency notation (Lakhs / Crores)."""
    if amount is None or np.isnan(amount):
        return "₹0"
    amount = float(amount)
    if amount >= 10_000_000:
        cr = amount / 10_000_000
        return f"₹{cr:.2f} Cr"
    elif amount >= 100_000:
        lakhs = amount / 100_000
        return f"₹{lakhs:.2f} L"
    else:
        return f"₹{amount:,.0f}"

class MLService:
    _instance = None
    
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.metadata = {}
        self.model_comparison = []
        self.is_loaded = False
        self.load_artifacts()
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = MLService()
        return cls._instance
        
    def load_artifacts(self):
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
                self.model = joblib.load(MODEL_PATH)
                self.preprocessor = joblib.load(PREPROCESSOR_PATH)
                
                if os.path.exists(METADATA_PATH):
                    with open(METADATA_PATH, "r") as f:
                        self.metadata = json.load(f)
                        
                if os.path.exists(COMPARISON_PATH):
                    with open(COMPARISON_PATH, "r") as f:
                        self.model_comparison = json.load(f)
                        
                self.is_loaded = True
                print("MLService: Model artifacts successfully loaded into memory.")
            else:
                print("MLService: Model artifacts not found yet. Please run training pipeline.")
        except Exception as e:
            print(f"MLService: Error loading artifacts: {e}")
            self.is_loaded = False

    def input_to_dataframe(self, prop: PredictionInput) -> pd.DataFrame:
        """Converts PredictionInput to pandas DataFrame with exact feature columns."""
        amenities_count = sum([
            int(prop.has_parking), int(prop.has_lift), int(prop.has_security),
            int(prop.has_gym), int(prop.has_swimming_pool), int(prop.has_garden),
            int(prop.has_clubhouse), int(prop.has_power_backup), int(prop.has_cctv),
            int(prop.has_internet), int(prop.has_water_supply), int(prop.has_ac)
        ])
        
        carpet = prop.carpet_area if prop.carpet_area else round(prop.area * 0.85, 1)
        bedrooms = prop.bedrooms if prop.bedrooms is not None else prop.bhk
        
        # Coordinates fallback if missing
        lat = prop.latitude if prop.latitude else 21.1458
        lon = prop.longitude if prop.longitude else 79.0882
        
        row = {
            "city": prop.city,
            "locality": prop.locality,
            "property_type": prop.property_type,
            "area": prop.area,
            "carpet_area": carpet,
            "bhk": prop.bhk,
            "bedrooms": bedrooms,
            "bathrooms": prop.bathrooms,
            "balconies": prop.balconies,
            "floor": prop.floor,
            "total_floors": prop.total_floors,
            "property_age": prop.property_age,
            "parking": prop.parking,
            "furnished": prop.furnished,
            "property_condition": prop.property_condition,
            "latitude": lat,
            "longitude": lon,
            "amenities_count": amenities_count,
            "has_parking": int(prop.has_parking),
            "has_lift": int(prop.has_lift),
            "has_security": int(prop.has_security),
            "has_gym": int(prop.has_gym),
            "has_swimming_pool": int(prop.has_swimming_pool),
            "has_garden": int(prop.has_garden),
            "has_clubhouse": int(prop.has_clubhouse),
            "has_power_backup": int(prop.has_power_backup),
            "has_cctv": int(prop.has_cctv),
            "has_internet": int(prop.has_internet),
            "has_water_supply": int(prop.has_water_supply),
            "has_ac": int(prop.has_ac)
        }
        return pd.DataFrame([row])

    def predict(self, prop: PredictionInput) -> PredictionResponse:
        if not self.is_loaded:
            self.load_artifacts()
            if not self.is_loaded:
                raise RuntimeError("Machine Learning Model is not trained or loaded yet.")
                
        df = self.input_to_dataframe(prop)
        X_transformed = self.preprocessor.transform(df)
        raw_pred = float(self.model.predict(X_transformed)[0])
        raw_pred = max(100_000, raw_pred) # Minimum floor
        
        price_per_sqft = round(raw_pred / prop.area, 2)
        
        # Uncertainty bounds based on validation RMSE
        rmse = self.metadata.get("stats", {}).get("validation_rmse", 850_000)
        margin = max(rmse * 0.85, raw_pred * 0.06)
        lower_range = max(100_000, round(raw_pred - margin, -4))
        upper_range = round(raw_pred + margin, -4)
        
        # Explainability feature contributions
        from backend.services.shap_service import SHAPService
        shap_service = SHAPService.get_instance()
        contributions, base_val = shap_service.explain_prediction(df, X_transformed)
        
        positive_contributions = [c for c in contributions if c.shap_value > 5000]
        negative_contributions = [c for c in contributions if c.shap_value < -5000]
        
        # Sort by magnitude
        positive_contributions.sort(key=lambda x: x.shap_value, reverse=True)
        negative_contributions.sort(key=lambda x: x.shap_value)
        
        # Natural language summary
        explanation_parts = []
        if positive_contributions:
            top_pos = positive_contributions[0]
            explanation_parts.append(f"{top_pos.display_name} ({top_pos.description}) added significant value (+{format_inr(top_pos.shap_value)}).")
        if len(positive_contributions) > 1:
            second_pos = positive_contributions[1]
            explanation_parts.append(f"{second_pos.display_name} provided a positive uplift (+{format_inr(second_pos.shap_value)}).")
        if negative_contributions:
            top_neg = negative_contributions[0]
            explanation_parts.append(f"{top_neg.display_name} ({top_neg.description}) negatively impacted valuation by {format_inr(abs(top_neg.shap_value))}.")
            
        explanation_text = " ".join(explanation_parts) if explanation_parts else "Prediction is balanced around the regional baseline valuation."
        
        model_name = self.metadata.get("best_model_name", "XGBoost Regressor")
        model_r2 = self.metadata.get("best_metrics", {}).get("r2_score", 0.92)
        
        return PredictionResponse(
            predicted_price=round(raw_pred, -3),
            price_formatted=format_inr(raw_pred),
            price_per_sqft=price_per_sqft,
            lower_range=lower_range,
            upper_range=upper_range,
            lower_range_formatted=format_inr(lower_range),
            upper_range_formatted=format_inr(upper_range),
            model_r2=model_r2,
            model_name=model_name,
            validation_rmse=rmse,
            top_positive_features=positive_contributions[:4],
            top_negative_features=negative_contributions[:4],
            all_contributions=contributions,
            explanation=explanation_text,
            property_summary={
                "city": prop.city,
                "locality": prop.locality,
                "property_type": prop.property_type,
                "area": prop.area,
                "bhk": prop.bhk,
                "bathrooms": prop.bathrooms,
                "floor": f"{prop.floor}/{prop.total_floors}",
                "age": f"{prop.property_age} yrs",
                "condition": prop.property_condition,
                "furnishing": prop.furnished,
                "amenities_count": sum([
                    int(prop.has_parking), int(prop.has_lift), int(prop.has_security),
                    int(prop.has_gym), int(prop.has_swimming_pool), int(prop.has_garden),
                    int(prop.has_clubhouse), int(prop.has_power_backup), int(prop.has_cctv),
                    int(prop.has_internet), int(prop.has_water_supply), int(prop.has_ac)
                ])
            }
        )
