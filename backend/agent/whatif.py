import copy
import numpy as np
from typing import Dict, Any, List
from backend.schemas.property import PredictionInput, WhatIfResponse
from backend.services.ml_service import MLService, format_inr

class WhatIfEngine:
    @staticmethod
    def simulate(original_prop: PredictionInput, modifications: Dict[str, Any]) -> WhatIfResponse:
        ml_service = MLService.get_instance()
        
        # Original prediction
        orig_res = ml_service.predict(original_prop)
        orig_price = orig_res.predicted_price
        
        # Clone and apply modifications
        modified_dict = original_prop.model_dump()
        for k, v in modifications.items():
            if k in modified_dict and v is not None:
                modified_dict[k] = v
                
        # If area was updated but carpet area was not explicitly provided, update carpet area proportionally
        if "area" in modifications and "carpet_area" not in modifications:
            modified_dict["carpet_area"] = round(modified_dict["area"] * 0.85, 1)
            
        modified_prop = PredictionInput(**modified_dict)
        mod_res = ml_service.predict(modified_prop)
        new_price = mod_res.predicted_price
        
        diff = new_price - orig_price
        pct_change = round(((new_price - orig_price) / orig_price) * 100, 2) if orig_price > 0 else 0.0
        
        diff_formatted = f"+{format_inr(diff)}" if diff >= 0 else f"-{format_inr(abs(diff))}"
        
        # Sensitivity Curve Analysis: generate a 5-point curve for the modified parameter if applicable
        sensitivity_curve = []
        if "area" in modifications:
            base_area = original_prop.area
            test_points = [base_area * factor for factor in [0.75, 0.90, 1.0, 1.15, 1.30]]
            for p in test_points:
                temp_dict = copy.deepcopy(modified_dict)
                temp_dict["area"] = round(p)
                temp_dict["carpet_area"] = round(p * 0.85)
                temp_p = PredictionInput(**temp_dict)
                p_res = ml_service.predict(temp_p)
                sensitivity_curve.append({
                    "parameter_value": f"{int(p)} sq.ft",
                    "estimated_price": p_res.predicted_price,
                    "price_formatted": p_res.price_formatted
                })
        elif "bhk" in modifications:
            for b in [1, 2, 3, 4, 5]:
                temp_dict = copy.deepcopy(modified_dict)
                temp_dict["bhk"] = b
                temp_dict["bedrooms"] = b
                temp_p = PredictionInput(**temp_dict)
                p_res = ml_service.predict(temp_p)
                sensitivity_curve.append({
                    "parameter_value": f"{b} BHK",
                    "estimated_price": p_res.predicted_price,
                    "price_formatted": p_res.price_formatted
                })
        elif "property_age" in modifications:
            for a in [0, 2, 5, 10, 15, 20]:
                temp_dict = copy.deepcopy(modified_dict)
                temp_dict["property_age"] = a
                temp_p = PredictionInput(**temp_dict)
                p_res = ml_service.predict(temp_p)
                sensitivity_curve.append({
                    "parameter_value": f"{a} yrs",
                    "estimated_price": p_res.predicted_price,
                    "price_formatted": p_res.price_formatted
                })
                
        # Generate analytical commentary
        analysis_points = []
        for field, val in modifications.items():
            orig_val = getattr(original_prop, field, None)
            if orig_val != val:
                analysis_points.append(f"Changing {field.replace('_', ' ')} from {orig_val} to {val}")
                
        analysis_str = f"{', '.join(analysis_points)} resulted in a net valuation shift of {diff_formatted} ({pct_change:+0.1f}%)."
        
        return WhatIfResponse(
            original_price=orig_price,
            original_price_formatted=orig_res.price_formatted,
            new_price=new_price,
            new_price_formatted=mod_res.price_formatted,
            price_diff=diff,
            price_diff_formatted=diff_formatted,
            percentage_change=pct_change,
            modified_fields=modifications,
            analysis=analysis_str,
            sensitivity_curve=sensitivity_curve if sensitivity_curve else None
        )
