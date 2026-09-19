"""
Machine Learning Training Pipeline for HouseAI
Trains, evaluates, compares, and serializes multiple regression models.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor

NUMERICAL_FEATURES = [
    "area", "carpet_area", "bhk", "bedrooms", "bathrooms", "balconies",
    "floor", "total_floors", "property_age", "parking", "latitude", "longitude",
    "amenities_count", "has_parking", "has_lift", "has_security", "has_gym",
    "has_swimming_pool", "has_garden", "has_clubhouse", "has_power_backup",
    "has_cctv", "has_internet", "has_water_supply", "has_ac"
]

CATEGORICAL_FEATURES = [
    "city", "locality", "property_type", "furnished", "property_condition"
]

ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
TARGET = "price"

def load_and_clean_data(csv_path: str) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")
    
    df = pd.read_csv(csv_path)
    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # 1. Missing Value Check and Imputation
    null_counts = df.isnull().sum()
    if null_counts.any():
        print(f"Handling missing values:\n{null_counts[null_counts > 0]}")
        for col in NUMERICAL_FEATURES:
            if col in df.columns and df[col].isnull().any():
                df[col] = df[col].fillna(df[col].median())
        for col in CATEGORICAL_FEATURES:
            if col in df.columns and df[col].isnull().any():
                df[col] = df[col].fillna(df[col].mode()[0])
    
    # 2. Outlier Detection: IQR method on price_per_sqft
    df["price_per_sqft"] = df["price"] / df["area"]
    q1 = df["price_per_sqft"].quantile(0.01)
    q3 = df["price_per_sqft"].quantile(0.99)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    
    initial_len = len(df)
    df = df[(df["price_per_sqft"] >= lower_bound) & (df["price_per_sqft"] <= upper_bound)].copy()
    print(f"Outlier removal: Removed {initial_len - len(df)} extreme outlier records")
    
    return df

def build_preprocessor():
    num_transformer = Pipeline(steps=[
        ("scaler", StandardScaler())
    ])
    cat_transformer = Pipeline(steps=[
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_transformer, NUMERICAL_FEATURES),
            ("cat", cat_transformer, CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor

def evaluate_model(name: str, model, X_test, y_test, y_train, y_train_pred):
    y_pred = model.predict(X_test)
    
    # Calculate genuine metrics
    mae = float(mean_absolute_error(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_test, y_pred))
    mape = float(np.mean(np.abs((y_test - y_pred) / y_test)) * 100)
    train_r2 = float(r2_score(y_train, y_train_pred))
    
    return {
        "model_name": name,
        "mae": round(mae, 2),
        "mse": round(mse, 2),
        "rmse": round(rmse, 2),
        "r2_score": round(r2, 4),
        "train_r2_score": round(train_r2, 4),
        "mape_percent": round(mape, 2)
    }, y_pred

def train_all_models():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, "..", "dataset", "house_prices.csv")
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(base_dir, "dataset", "house_prices.csv")
        
    df = load_and_clean_data(dataset_path)
    
    X = df[ALL_FEATURES]
    y = df[TARGET]
    
    # Train/Test Split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"Train set: {len(X_train)} samples, Test set: {len(X_test)} samples")
    
    # Preprocessor
    preprocessor = build_preprocessor()
    X_train_transformed = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)
    
    # Get feature names after one-hot encoding
    cat_encoder = preprocessor.named_transformers_["cat"].named_steps["onehot"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    all_transformed_feature_names = NUMERICAL_FEATURES + cat_feature_names
    
    # Candidate Models
    models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree Regressor": DecisionTreeRegressor(max_depth=12, random_state=42),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=160, max_depth=16, random_state=42, n_jobs=-1),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=160, learning_rate=0.08, max_depth=6, random_state=42),
        "XGBoost Regressor": XGBRegressor(n_estimators=200, learning_rate=0.06, max_depth=6, random_state=42, n_jobs=-1)
    }
    
    comparison_results = []
    trained_models = {}
    
    print("\n--- Training and Evaluating Models ---")
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train_transformed, y_train)
        y_train_pred = model.predict(X_train_transformed)
        metrics, y_pred = evaluate_model(name, model, X_test_transformed, y_test, y_train, y_train_pred)
        comparison_results.append(metrics)
        trained_models[name] = model
        print(f"  -> R²: {metrics['r2_score']:.4f} | RMSE: ₹{metrics['rmse']:,.0f} | MAE: ₹{metrics['mae']:,.0f}")
        
    # Sort comparison results by R2 descending
    comparison_results.sort(key=lambda x: x["r2_score"], reverse=True)
    best_result = comparison_results[0]
    best_model_name = best_result["model_name"]
    best_model = trained_models[best_model_name]
    
    print(f"\n==========================================")
    print(f"BEST MODEL: {best_model_name}")
    print(f"R² Score: {best_result['r2_score']:.4f} | RMSE: ₹{best_result['rmse']:,.0f}")
    print(f"==========================================\n")
    
    # Extract unique categories for UI dropdowns
    metadata = {
        "best_model_name": best_model_name,
        "best_metrics": best_result,
        "features": {
            "numerical": NUMERICAL_FEATURES,
            "categorical": CATEGORICAL_FEATURES,
            "transformed_names": all_transformed_feature_names
        },
        "categories": {
            "cities": sorted(df["city"].unique().tolist()),
            "localities_by_city": {
                city: sorted(df[df["city"] == city]["locality"].unique().tolist())
                for city in df["city"].unique()
            },
            "property_types": sorted(df["property_type"].unique().tolist()),
            "furnished_options": sorted(df["furnished"].unique().tolist()),
            "property_conditions": sorted(df["property_condition"].unique().tolist())
        },
        "stats": {
            "total_records": int(len(df)),
            "train_size": int(len(X_train)),
            "test_size": int(len(X_test)),
            "avg_price": float(df["price"].mean()),
            "min_price": float(df["price"].min()),
            "max_price": float(df["price"].max()),
            "avg_price_per_sqft": float(df["price_per_sqft"].mean()),
            "validation_rmse": float(best_result["rmse"])
        }
    }
    
    # Save artifacts to backend/model
    model_dir = os.path.join(base_dir, "model")
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, "house_price_model.pkl")
    prep_path = os.path.join(model_dir, "preprocessor.pkl")
    comp_path = os.path.join(model_dir, "model_comparison.json")
    meta_path = os.path.join(model_dir, "model_metadata.json")
    
    joblib.dump(best_model, model_path)
    joblib.dump(preprocessor, prep_path)
    
    with open(comp_path, "w") as f:
        json.dump(comparison_results, f, indent=2)
        
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Saved best model to: {model_path}")
    print(f"Saved preprocessor to: {prep_path}")
    print(f"Saved model comparison to: {comp_path}")
    print(f"Saved metadata to: {meta_path}")

if __name__ == "__main__":
    train_all_models()
