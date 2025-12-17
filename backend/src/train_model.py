"""
train_model.py

Module training model ML dự báo năng suất cà phê Robusta Đắk Lắk.

Chức năng:
- Load dữ liệu features và yield
- Train/test split (time-series, không shuffle)
- Train model Random Forest và XGBoost
- Đánh giá MAE, RMSE, MAPE
- SHAP explainability
- Lưu model và artifacts
"""

import os
import json
import pickle
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler

# Suppress warnings
warnings.filterwarnings('ignore')

# Try to import optional packages
try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("⚠️ XGBoost not installed, will use only RandomForest")

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False
    print("⚠️ SHAP not installed, will skip explainability")


# ========================
# CẤU HÌNH ĐƯỜNG DẪN
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"

# Files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# Output files
MODEL_FILE = MODELS_DIR / "trained_model.pkl"
SCALER_FILE = MODELS_DIR / "scaler.pkl"
FEATURE_COLS_FILE = MODELS_DIR / "feature_columns.json"
SHAP_VALUES_FILE = MODELS_DIR / "shap_values.pkl"
SHAP_SUMMARY_FILE = MODELS_DIR / "shap_summary.png"
FEATURE_IMPORTANCE_FILE = MODELS_DIR / "feature_importance.png"

# Features to use for training (based on coffee biology)
FEATURE_COLUMNS = [
    "rain_Feb_Mar",       # Mưa kích hoa
    "soil_Apr_Jun",       # Độ ẩm đất quả non
    "temp_max_MayJun",    # Stress nhiệt
    "days_over_33",       # Số ngày nóng cực đoan
    "radiation_JunSep",   # Bức xạ tích lũy
    "rain_OctDec",        # Mưa giai đoạn chín
    "humidity_Apr_Jun",   # Độ ẩm không khí
    "SPI_MarJun",         # Chỉ số hạn
]


def load_data():
    """
    Load và merge features với yield data.
    
    Returns:
        DataFrame với features và yield
    """
    print("📂 Loading data...")
    
    # Load features
    features = pd.read_csv(FEATURES_FILE)
    print(f"   Features: {len(features)} năm ({features['year'].min()}-{features['year'].max()})")
    
    # Load yield
    yield_data = pd.read_csv(YIELD_FILE)
    print(f"   Yield: {len(yield_data)} năm ({yield_data['year'].min()}-{yield_data['year'].max()})")
    
    # Merge
    df = features.merge(yield_data[['year', 'yield_ton_ha']], on='year', how='inner')
    df = df.rename(columns={'yield_ton_ha': 'yield'})
    
    print(f"   ✅ Merged: {len(df)} năm với đầy đủ features và yield")
    
    return df


def prepare_train_test(df, test_years=2):
    """
    Chia train/test theo time-series (không shuffle).
    
    Args:
        df: DataFrame với features và yield
        test_years: Số năm cuối dùng để test
        
    Returns:
        X_train, X_test, y_train, y_test, years_train, years_test
    """
    print(f"\n📊 Preparing train/test split (last {test_years} years for test)...")
    
    # Sort theo năm
    df = df.sort_values('year').reset_index(drop=True)
    
    # Split
    train_df = df.iloc[:-test_years]
    test_df = df.iloc[-test_years:]
    
    # Features và target
    X_train = train_df[FEATURE_COLUMNS]
    X_test = test_df[FEATURE_COLUMNS]
    y_train = train_df['yield']
    y_test = test_df['yield']
    
    years_train = train_df['year'].values
    years_test = test_df['year'].values
    
    print(f"   Train: {len(X_train)} năm ({years_train[0]}-{years_train[-1]})")
    print(f"   Test: {len(X_test)} năm ({years_test[0]}-{years_test[-1]})")
    
    return X_train, X_test, y_train, y_test, years_train, years_test


def calculate_mape(y_true, y_pred):
    """Tính Mean Absolute Percentage Error."""
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


def evaluate_model(model, X_train, X_test, y_train, y_test, model_name, years_test):
    """
    Đánh giá model với MAE, RMSE, MAPE.
    
    Returns:
        dict với các metrics
    """
    # Predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Metrics on test set
    mae = mean_absolute_error(y_test, y_pred_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    mape = calculate_mape(y_test.values, y_pred_test)
    
    # Metrics on train set
    mae_train = mean_absolute_error(y_train, y_pred_train)
    
    print(f"\n📈 {model_name} Results:")
    print(f"   Train MAE: {mae_train:.4f} tấn/ha")
    print(f"   Test MAE:  {mae:.4f} tấn/ha")
    print(f"   Test RMSE: {rmse:.4f} tấn/ha")
    print(f"   Test MAPE: {mape:.2f}%")
    
    # Actual vs Predicted table
    print(f"\n   📋 Actual vs Predicted (Test Set):")
    print(f"   {'Year':<6} {'Actual':<10} {'Predicted':<10} {'Error':<10} {'Error%':<10}")
    print(f"   {'-'*46}")
    for i, year in enumerate(years_test):
        actual = y_test.values[i]
        pred = y_pred_test[i]
        error = pred - actual
        error_pct = (error / actual) * 100
        print(f"   {year:<6} {actual:<10.2f} {pred:<10.2f} {error:<+10.2f} {error_pct:<+10.1f}%")
    
    return {
        'model_name': model_name,
        'mae': mae,
        'rmse': rmse,
        'mape': mape,
        'mae_train': mae_train,
        'y_pred_test': y_pred_test
    }


def train_random_forest(X_train, y_train):
    """Train Random Forest model."""
    print("\n🌲 Training Random Forest...")
    
    model = RandomForestRegressor(
        n_estimators=500,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("   ✅ Training complete!")
    
    return model


def train_xgboost(X_train, y_train):
    """Train XGBoost model."""
    if not HAS_XGB:
        print("⚠️ XGBoost not available")
        return None
    
    print("\n🚀 Training XGBoost...")
    
    model = xgb.XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("   ✅ Training complete!")
    
    return model


def plot_feature_importance(model, feature_names, save_path):
    """Vẽ biểu đồ feature importance."""
    print("\n📊 Plotting feature importance...")
    
    # Get importance
    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
    else:
        print("   ⚠️ Model không có feature_importances_")
        return
    
    # Sort
    indices = np.argsort(importance)[::-1]
    
    # Plot
    plt.figure(figsize=(10, 6))
    plt.title('Feature Importance - Coffee Yield Prediction', fontsize=14)
    plt.bar(range(len(importance)), importance[indices], align='center', color='forestgreen')
    plt.xticks(range(len(importance)), [feature_names[i] for i in indices], rotation=45, ha='right')
    plt.xlabel('Features')
    plt.ylabel('Importance')
    plt.tight_layout()
    
    # Save
    save_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()
    
    print(f"   ✅ Saved: {save_path}")
    
    # Print top 5
    print("\n   🏆 Top 5 Features:")
    for i in range(min(5, len(importance))):
        idx = indices[i]
        print(f"      {i+1}. {feature_names[idx]}: {importance[idx]:.4f}")
    
    return [(feature_names[indices[i]], importance[indices[i]]) for i in range(len(importance))]


def compute_shap_values(model, X_train, feature_names, save_values_path, save_summary_path):
    """Tính SHAP values và vẽ summary plot."""
    if not HAS_SHAP:
        print("⚠️ SHAP not available, skipping...")
        return None
    
    print("\n🔍 Computing SHAP values...")
    
    # Create explainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_train)
    
    # Save SHAP values
    save_values_path.parent.mkdir(parents=True, exist_ok=True)
    with open(save_values_path, 'wb') as f:
        pickle.dump({
            'shap_values': shap_values,
            'feature_names': feature_names,
            'X_train': X_train.values
        }, f)
    print(f"   ✅ Saved SHAP values: {save_values_path}")
    
    # Summary plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_train, feature_names=feature_names, show=False)
    plt.title('SHAP Summary - Coffee Yield Prediction', fontsize=14)
    plt.tight_layout()
    plt.savefig(save_summary_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"   ✅ Saved SHAP summary: {save_summary_path}")
    
    return shap_values


def save_model(model, scaler, feature_columns):
    """Lưu model và các artifacts."""
    print("\n💾 Saving model and artifacts...")
    
    # Create directory
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save model
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model, f)
    print(f"   ✅ Model: {MODEL_FILE}")
    
    # Save scaler
    if scaler is not None:
        with open(SCALER_FILE, 'wb') as f:
            pickle.dump(scaler, f)
        print(f"   ✅ Scaler: {SCALER_FILE}")
    
    # Save feature columns
    with open(FEATURE_COLS_FILE, 'w') as f:
        json.dump(feature_columns, f, indent=2)
    print(f"   ✅ Feature columns: {FEATURE_COLS_FILE}")


def run_training():
    """Pipeline chính để train model."""
    print("=" * 60)
    print("🎯 TRAINING MODEL DỰ BÁO NĂNG SUẤT CÀ PHÊ ĐẮK LẮK")
    print("=" * 60)
    
    # 1. Load data
    df = load_data()
    
    # 2. Prepare train/test
    X_train, X_test, y_train, y_test, years_train, years_test = prepare_train_test(df, test_years=2)
    
    # 3. Scale features (optional but recommended)
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=FEATURE_COLUMNS,
        index=X_train.index
    )
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=FEATURE_COLUMNS,
        index=X_test.index
    )
    
    # 4. Train models
    results = []
    
    # Random Forest
    rf_model = train_random_forest(X_train, y_train)  # RF doesn't need scaling
    rf_result = evaluate_model(rf_model, X_train, X_test, y_train, y_test, "Random Forest", years_test)
    results.append(rf_result)
    
    # XGBoost
    if HAS_XGB:
        xgb_model = train_xgboost(X_train, y_train)  # XGB doesn't need scaling
        xgb_result = evaluate_model(xgb_model, X_train, X_test, y_train, y_test, "XGBoost", years_test)
        results.append(xgb_result)
    
    # 5. Select best model
    print("\n" + "=" * 60)
    print("🏆 MODEL COMPARISON")
    print("=" * 60)
    
    print(f"\n{'Model':<20} {'MAE':<10} {'RMSE':<10} {'MAPE':<10}")
    print("-" * 50)
    for r in results:
        print(f"{r['model_name']:<20} {r['mae']:<10.4f} {r['rmse']:<10.4f} {r['mape']:<10.2f}%")
    
    # Choose best by MAPE
    best_result = min(results, key=lambda x: x['mape'])
    best_model_name = best_result['model_name']
    
    print(f"\n✅ Best Model: {best_model_name} (MAPE = {best_result['mape']:.2f}%)")
    
    # Select the best model object
    if best_model_name == "Random Forest":
        best_model = rf_model
    else:
        best_model = xgb_model
    
    # 6. Feature importance
    top_features = plot_feature_importance(best_model, FEATURE_COLUMNS, FEATURE_IMPORTANCE_FILE)
    
    # 7. SHAP analysis
    if HAS_SHAP:
        compute_shap_values(best_model, X_train, FEATURE_COLUMNS, SHAP_VALUES_FILE, SHAP_SUMMARY_FILE)
    
    # 8. Save model
    save_model(best_model, scaler, FEATURE_COLUMNS)
    
    # 9. Summary
    print("\n" + "=" * 60)
    print("📋 TRAINING SUMMARY")
    print("=" * 60)
    print(f"\n🏆 Best Model: {best_model_name}")
    print(f"📊 Final Metrics:")
    print(f"   - MAE:  {best_result['mae']:.4f} tấn/ha")
    print(f"   - RMSE: {best_result['rmse']:.4f} tấn/ha")
    print(f"   - MAPE: {best_result['mape']:.2f}%")
    
    print(f"\n🔝 Top 5 Important Features:")
    if top_features:
        for i, (feat, imp) in enumerate(top_features[:5]):
            print(f"   {i+1}. {feat}: {imp:.4f}")
    
    print(f"\n📁 Saved Files:")
    print(f"   - {MODEL_FILE}")
    print(f"   - {FEATURE_COLS_FILE}")
    if HAS_SHAP:
        print(f"   - {SHAP_VALUES_FILE}")
        print(f"   - {SHAP_SUMMARY_FILE}")
    print(f"   - {FEATURE_IMPORTANCE_FILE}")
    
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE — MODEL READY FOR API DEPLOYMENT.")
    print("=" * 60)
    
    return best_model, scaler, best_result


def main():
    """Entry point."""
    model, scaler, result = run_training()
    return model, scaler, result


if __name__ == "__main__":
    main()
