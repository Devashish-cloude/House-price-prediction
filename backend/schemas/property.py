from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    city: str = Field(..., description="City name (e.g. Nagpur, Mumbai, Pune, Bengaluru)")
    locality: str = Field(..., description="Locality or neighborhood name")
    property_type: str = Field("Apartment", description="Apartment, Independent House, Villa, Plot")
    area: float = Field(..., gt=50, le=20000, description="Super Built-up Area in sq.ft")
    carpet_area: Optional[float] = Field(None, gt=40, le=18000, description="Carpet Area in sq.ft")
    bhk: int = Field(2, ge=0, le=10, description="BHK count")
    bedrooms: Optional[int] = Field(None, ge=0, le=10)
    bathrooms: int = Field(2, ge=0, le=10)
    balconies: int = Field(1, ge=0, le=10)
    floor: int = Field(2, ge=0, le=100)
    total_floors: int = Field(10, ge=0, le=100)
    property_age: int = Field(3, ge=0, le=100, description="Age in years")
    parking: int = Field(1, ge=0, le=10)
    furnished: str = Field("Semi-Furnished", description="Unfurnished, Semi-Furnished, Fully Furnished")
    property_condition: str = Field("Good", description="New, Good, Average, Needs Renovation")
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    
    # Amenities toggles
    has_parking: bool = True
    has_lift: bool = True
    has_security: bool = True
    has_gym: bool = False
    has_swimming_pool: bool = False
    has_garden: bool = False
    has_clubhouse: bool = False
    has_power_backup: bool = True
    has_cctv: bool = True
    has_internet: bool = True
    has_water_supply: bool = True
    has_ac: bool = False

class FeatureContribution(BaseModel):
    feature: str
    display_name: str
    feature_value: Any
    shap_value: float
    impact: str # "positive", "negative", "neutral"
    description: str

class PredictionResponse(BaseModel):
    predicted_price: float
    price_formatted: str
    price_per_sqft: float
    lower_range: float
    upper_range: float
    lower_range_formatted: str
    upper_range_formatted: str
    model_r2: float
    model_name: str
    validation_rmse: float
    top_positive_features: List[FeatureContribution]
    top_negative_features: List[FeatureContribution]
    all_contributions: List[FeatureContribution]
    explanation: str
    property_summary: Dict[str, Any]

class ExplainRequest(BaseModel):
    property_data: PredictionInput

class ExplainResponse(BaseModel):
    base_value: float
    predicted_price: float
    contributions: List[FeatureContribution]
    summary_text: str

class WhatIfRequest(BaseModel):
    original_property: PredictionInput
    modifications: Dict[str, Any]

class WhatIfResponse(BaseModel):
    original_price: float
    original_price_formatted: str
    new_price: float
    new_price_formatted: str
    price_diff: float
    price_diff_formatted: str
    percentage_change: float
    modified_fields: Dict[str, Any]
    analysis: str
    sensitivity_curve: Optional[List[Dict[str, Any]]] = None

class ChatMessage(BaseModel):
    role: str # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    current_property: Optional[PredictionInput] = None
    last_prediction: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    suggested_questions: List[str]
    counterfactual_prediction: Optional[Dict[str, Any]] = None
    what_if_trigger: Optional[Dict[str, Any]] = None

class ModelComparisonItem(BaseModel):
    model_name: str
    mae: float
    mse: float
    rmse: float
    r2_score: float
    train_r2_score: float
    mape_percent: float

class ModelMetricsResponse(BaseModel):
    best_model_name: str
    best_metrics: ModelComparisonItem
    all_models: List[ModelComparisonItem]
    features_count: int
    stats: Dict[str, Any]
    feature_importance: List[Dict[str, Any]]
