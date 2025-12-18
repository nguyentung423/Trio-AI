"""
api.py

FastAPI REST API Server
Endpoints:
- GET /predict-year?year=2026 : Dự báo năng suất cho năm cụ thể
- GET /feature-importance : Lấy SHAP feature importance
- GET /yield-history : Lấy lịch sử năng suất các năm
- GET /health : Health check endpoint
- GET /weather-trend : Xu hướng thời tiết theo năm
- POST /predict-custom : Dự báo với features tùy chỉnh
"""

import os
import json
import pickle
from pathlib import Path
from typing import Optional, List
from contextlib import asynccontextmanager

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ========================
# CẤU HÌNH ĐƯỜNG DẪN
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"

# Model files
MODEL_FILE = MODELS_DIR / "trained_model.pkl"
SCALER_FILE = MODELS_DIR / "scaler.pkl"
FEATURE_COLS_FILE = MODELS_DIR / "feature_columns.json"
SHAP_VALUES_FILE = MODELS_DIR / "shap_values.pkl"

# Data files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"


# ========================
# LOAD MODEL VÀ DATA
# ========================
def load_model():
    """Load trained model."""
    if not MODEL_FILE.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_FILE}")
    with open(MODEL_FILE, 'rb') as f:
        return pickle.load(f)


def load_scaler():
    """Load fitted scaler."""
    if not SCALER_FILE.exists():
        return None
    with open(SCALER_FILE, 'rb') as f:
        return pickle.load(f)


def load_feature_columns():
    """Load feature column names."""
    if not FEATURE_COLS_FILE.exists():
        raise FileNotFoundError(f"Feature columns file not found: {FEATURE_COLS_FILE}")
    with open(FEATURE_COLS_FILE, 'r') as f:
        return json.load(f)


def load_shap_values():
    """Load SHAP values."""
    if not SHAP_VALUES_FILE.exists():
        return None
    with open(SHAP_VALUES_FILE, 'rb') as f:
        return pickle.load(f)


def load_features():
    """Load features data."""
    if not FEATURES_FILE.exists():
        raise FileNotFoundError(f"Features file not found: {FEATURES_FILE}")
    return pd.read_csv(FEATURES_FILE)


def load_yield():
    """Load yield data."""
    if not YIELD_FILE.exists():
        return None
    return pd.read_csv(YIELD_FILE)


# Global variables (loaded at startup)
model = None
scaler = None
feature_columns = None
shap_data = None
features_df = None
yield_df = None


def initialize():
    """Initialize model and data at startup."""
    global model, scaler, feature_columns, shap_data, features_df, yield_df
    
    try:
        model = load_model()
        print("✅ Model loaded")
    except Exception as e:
        print(f"⚠️ Could not load model: {e}")
    
    try:
        scaler = load_scaler()
        print("✅ Scaler loaded")
    except Exception as e:
        print(f"⚠️ Could not load scaler: {e}")
    
    try:
        feature_columns = load_feature_columns()
        print(f"✅ Feature columns loaded: {len(feature_columns)} features")
    except Exception as e:
        print(f"⚠️ Could not load feature columns: {e}")
    
    try:
        shap_data = load_shap_values()
        print("✅ SHAP values loaded")
    except Exception as e:
        print(f"⚠️ Could not load SHAP values: {e}")
    
    try:
        features_df = load_features()
        print(f"✅ Features loaded: {len(features_df)} years")
    except Exception as e:
        print(f"⚠️ Could not load features: {e}")
    
    try:
        yield_df = load_yield()
        if yield_df is not None:
            print(f"✅ Yield data loaded: {len(yield_df)} years")
    except Exception as e:
        print(f"⚠️ Could not load yield: {e}")


# ========================
# PYDANTIC MODELS
# ========================
class CustomPredictRequest(BaseModel):
    """Request body for custom prediction."""
    rain_Feb_Mar: float
    soil_Apr_Jun: float
    temp_max_MayJun: float
    days_over_33: float
    radiation_JunSep: float
    rain_OctDec: float
    humidity_Apr_Jun: float
    SPI_MarJun: float


class PredictionResponse(BaseModel):
    """Response for prediction."""
    year: int
    predicted_yield: float
    confidence_lower: float
    confidence_upper: float
    unit: str = "ton/ha"
    features_used: Optional[dict] = None


class FeatureImportanceResponse(BaseModel):
    """Response for feature importance."""
    features: List[str]
    importance_scores: List[float]
    shap_mean_abs: Optional[List[float]] = None


class YieldHistoryResponse(BaseModel):
    """Response for yield history."""
    years: List[int]
    actual_yields: List[Optional[float]]
    predicted_yields: List[float]


class WeatherTrendResponse(BaseModel):
    """Response for weather trend."""
    years: List[int]
    rain_Feb_Mar: List[float]
    temp_max_MayJun: List[float]
    days_over_33: List[float]
    SPI_MarJun: List[float]


class ScenarioPredictionResponse(BaseModel):
    """Response for scenario-based prediction."""
    crop: str
    province: str
    year: int
    scenario: str
    scenario_label: str
    predicted_yield_ton_ha: float
    confidence_lower: float
    confidence_upper: float
    unit: str = "ton/ha"
    confidence_note: str


# ========================
# LIFESPAN CONTEXT MANAGER
# ========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize model and data on startup, cleanup on shutdown."""
    print("\n🚀 Starting Coffee Yield Prediction API...")
    initialize()
    print("=" * 50)
    yield
    # Cleanup on shutdown (if needed)
    print("\n👋 Shutting down API...")


# ========================
# FASTAPI APP
# ========================
app = FastAPI(
    title="Coffee Yield Prediction API",
    description="API dự báo năng suất cà phê Robusta Đắk Lắk sử dụng Machine Learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware cho phép frontend gọi API
# Production: cho phép các domain cụ thể
# Thêm wildcard patterns cho Vercel preview deployments
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://trio-ai.vercel.app",
    "https://*.vercel.app",  # Vercel preview deployments
]

# Trong production, có thể cần allow tất cả origins
# Kiểm tra biến môi trường để quyết định
import os
if os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true":
    ALLOWED_ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tạm thời allow all để debug
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Coffee Yield Prediction API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "/predict-year": "Dự báo năng suất theo năm",
            "/predict-custom": "Dự báo với features tùy chỉnh",
            "/feature-importance": "Feature importance scores",
            "/yield-history": "Lịch sử năng suất",
            "/weather-trend": "Xu hướng thời tiết",
            "/health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with detailed status"""
    data_years = []
    min_year = None
    max_year = None
    
    if features_df is not None:
        data_years = [int(y) for y in features_df['year'].values]
        min_year = min(data_years) if data_years else None
        max_year = max(data_years) if data_years else None
    
    return {
        "status": "healthy" if model is not None else "degraded",
        "model_loaded": model is not None,
        "model_name": "trained_model.pkl" if model is not None else None,
        "features_loaded": features_df is not None,
        "feature_count": len(feature_columns) if feature_columns else 0,
        "data_years_range": f"{min_year}-{max_year}" if min_year and max_year else None,
        "total_years": len(data_years),
        "scaler_loaded": scaler is not None,
        "shap_loaded": shap_data is not None
    }


@app.get("/predict-year", response_model=PredictionResponse)
async def predict_year(
    year: int = Query(..., ge=1990, le=2025, description="Năm cần dự báo (1990-2025)")
):
    """
    Dự báo năng suất cà phê cho năm cụ thể
    
    Args:
        year: Năm cần dự báo (ví dụ: 2025)
    
    Returns:
        Dự báo năng suất (tấn/ha) và confidence interval
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if features_df is None:
        raise HTTPException(status_code=503, detail="Features data not loaded")
    
    # Lấy features của năm được chọn
    year_data = features_df[features_df['year'] == year]
    
    if len(year_data) == 0:
        raise HTTPException(
            status_code=404, 
            detail=f"No data available for year {year}. Available years: {list(features_df['year'].values)}"
        )
    
    # Prepare features
    X = year_data[feature_columns].values
    
    # Predict
    predicted = model.predict(X)[0]
    
    # Confidence interval (±10% cho simplicity, có thể tính từ residuals)
    ci_margin = predicted * 0.10
    
    # Lấy features đã dùng
    features_used = {col: float(year_data[col].values[0]) for col in feature_columns}
    
    return PredictionResponse(
        year=year,
        predicted_yield=round(predicted, 4),
        confidence_lower=round(predicted - ci_margin, 4),
        confidence_upper=round(predicted + ci_margin, 4),
        unit="ton/ha",
        features_used=features_used
    )


@app.post("/predict-custom", response_model=PredictionResponse)
async def predict_custom(request: CustomPredictRequest):
    """
    Dự báo với features tùy chỉnh
    
    Cho phép người dùng nhập các giá trị features để mô phỏng kịch bản
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Prepare features
    X = np.array([[
        request.rain_Feb_Mar,
        request.soil_Apr_Jun,
        request.temp_max_MayJun,
        request.days_over_33,
        request.radiation_JunSep,
        request.rain_OctDec,
        request.humidity_Apr_Jun,
        request.SPI_MarJun
    ]])
    
    # Predict
    predicted = model.predict(X)[0]
    
    # Confidence interval
    ci_margin = predicted * 0.10
    
    return PredictionResponse(
        year=0,  # Custom scenario, no specific year
        predicted_yield=round(predicted, 4),
        confidence_lower=round(predicted - ci_margin, 4),
        confidence_upper=round(predicted + ci_margin, 4),
        unit="ton/ha",
        features_used=request.dict()
    )


@app.get("/feature-importance", response_model=FeatureImportanceResponse)
async def get_feature_importance():
    """
    Lấy SHAP feature importance
    
    Returns:
        Danh sách features và importance scores
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if feature_columns is None:
        raise HTTPException(status_code=503, detail="Feature columns not loaded")
    
    # Feature importance từ model
    if hasattr(model, 'feature_importances_'):
        importance = [float(x) for x in model.feature_importances_]
    else:
        importance = [1.0 / len(feature_columns)] * len(feature_columns)
    
    # SHAP mean absolute values
    shap_mean_abs = None
    if shap_data is not None and 'shap_values' in shap_data:
        shap_values = shap_data['shap_values']
        shap_mean_abs = [float(x) for x in np.abs(shap_values).mean(axis=0)]
    
    return FeatureImportanceResponse(
        features=feature_columns,
        importance_scores=importance,
        shap_mean_abs=shap_mean_abs
    )


@app.get("/yield-history", response_model=YieldHistoryResponse)
async def get_yield_history():
    """
    Lấy lịch sử năng suất các năm
    
    Returns:
        Danh sách năm, năng suất thực tế và dự báo
    """
    if model is None or features_df is None:
        raise HTTPException(status_code=503, detail="Model or features not loaded")
    
    # Get all years with features
    years = [int(y) for y in features_df['year'].values]
    
    # Predict for all years
    X = features_df[feature_columns].values
    predicted_yields = [round(float(p), 4) for p in model.predict(X)]
    
    # Get actual yields (only for years with data)
    actual_yields = []
    if yield_df is not None:
        yield_dict = {int(k): float(v) for k, v in zip(yield_df['year'], yield_df['yield_ton_ha'])}
        actual_yields = [yield_dict.get(y, None) for y in years]
    else:
        actual_yields = [None] * len(years)
    
    return YieldHistoryResponse(
        years=years,
        actual_yields=actual_yields,
        predicted_yields=predicted_yields
    )


@app.get("/weather-trend", response_model=WeatherTrendResponse)
async def get_weather_trend():
    """
    Lấy xu hướng thời tiết theo năm
    
    Returns:
        Các chỉ số thời tiết quan trọng theo năm
    """
    if features_df is None:
        raise HTTPException(status_code=503, detail="Features data not loaded")
    
    return WeatherTrendResponse(
        years=[int(y) for y in features_df['year'].values],
        rain_Feb_Mar=[float(x) for x in features_df['rain_Feb_Mar'].values],
        temp_max_MayJun=[float(x) for x in features_df['temp_max_MayJun'].values],
        days_over_33=[float(x) for x in features_df['days_over_33'].values],
        SPI_MarJun=[float(x) for x in features_df['SPI_MarJun'].values]
    )


@app.get("/predict-scenario", response_model=ScenarioPredictionResponse)
async def predict_scenario(
    province: str = Query(default="Đắk Lắk", description="Tỉnh/thành phố"),
    year: int = Query(..., ge=2024, le=2030, description="Năm dự báo (2024-2030)"),
    scenario: str = Query(default="normal", description="Kịch bản thời tiết")
):
    """
    Dự báo năng suất cà phê theo kịch bản thời tiết
    
    Kịch bản hỗ trợ:
    - normal: Thời tiết bình thường (baseline)
    - favorable: Thời tiết thuận lợi (+5%)
    - el_nino: El Niño (hạn hán, -8%)
    - la_nina: La Niña (mưa nhiều, -5%)
    - severe_drought: Hạn hán nghiêm trọng (-15%)
    - major_storm: Bão lớn (-12%)
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if features_df is None:
        raise HTTPException(status_code=503, detail="Features data not loaded")
    
    # Scenario multipliers and labels
    scenario_config = {
        "normal": {"multiplier": 1.00, "label": "Thời tiết bình thường", "label_en": "Normal weather"},
        "favorable": {"multiplier": 1.05, "label": "Thời tiết thuận lợi", "label_en": "Favorable weather"},
        "el_nino": {"multiplier": 0.92, "label": "El Niño (hạn hán)", "label_en": "El Niño (drought)"},
        "la_nina": {"multiplier": 0.95, "label": "La Niña (mưa nhiều)", "label_en": "La Niña (excessive rain)"},
        "severe_drought": {"multiplier": 0.85, "label": "Hạn hán nghiêm trọng", "label_en": "Severe drought"},
        "major_storm": {"multiplier": 0.88, "label": "Bão lớn", "label_en": "Major storm"},
    }
    
    if scenario not in scenario_config:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid scenario. Available: {list(scenario_config.keys())}"
        )
    
    # Use the most recent year's features as baseline
    # For future years, use the last available year's data
    available_years = features_df['year'].values
    base_year = year if year in available_years else int(available_years[-1])
    year_data = features_df[features_df['year'] == base_year]
    
    if len(year_data) == 0:
        raise HTTPException(
            status_code=404, 
            detail=f"No data available for base year {base_year}"
        )
    
    # Prepare features and predict
    X = year_data[feature_columns].values
    base_prediction = model.predict(X)[0]
    
    # Apply scenario multiplier
    config = scenario_config[scenario]
    adjusted_prediction = base_prediction * config["multiplier"]
    
    # Confidence interval (wider for more extreme scenarios)
    base_ci = 0.08  # ±8% base confidence interval
    if scenario in ["severe_drought", "major_storm"]:
        ci_margin = adjusted_prediction * 0.12  # ±12% for extreme scenarios
    elif scenario in ["el_nino", "la_nina"]:
        ci_margin = adjusted_prediction * 0.10  # ±10% for moderate scenarios
    else:
        ci_margin = adjusted_prediction * base_ci
    
    # Confidence note
    if year > max(available_years):
        confidence_note = f"Dự báo dựa trên dữ liệu năm {base_year}, áp dụng kịch bản {scenario}"
    else:
        confidence_note = f"Dự báo dựa trên dữ liệu thực tế năm {year}, áp dụng kịch bản {scenario}"
    
    return ScenarioPredictionResponse(
        crop="Cà phê Robusta",
        province=province,
        year=year,
        scenario=scenario,
        scenario_label=config["label"],
        predicted_yield_ton_ha=round(adjusted_prediction, 2),
        confidence_lower=round(adjusted_prediction - ci_margin, 2),
        confidence_upper=round(adjusted_prediction + ci_margin, 2),
        unit="ton/ha",
        confidence_note=confidence_note
    )


@app.get("/years")
async def get_available_years():
    """
    Lấy danh sách các năm có sẵn trong dữ liệu
    """
    if features_df is None:
        raise HTTPException(status_code=503, detail="Features data not loaded")
    
    years = [int(y) for y in features_df['year'].values]
    
    # Check which years have actual yield data
    years_with_yield = []
    if yield_df is not None:
        years_with_yield = [int(y) for y in yield_df['year'].values]
    
    return {
        "available_years": years,
        "years_with_yield_data": years_with_yield,
        "min_year": min(years),
        "max_year": max(years)
    }


# ========================
# MAIN
# ========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
