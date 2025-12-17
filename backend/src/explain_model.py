"""
explain_model.py

Module SHAP Explainability
Chức năng:
- Load trained model
- Tính SHAP values cho từng feature
- Tạo summary plot, bar plot, waterfall plot
- Lưu SHAP values vào models/shap_values.pkl
- Export feature importance ranking
"""

import pickle
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False
    print("⚠️ SHAP not installed. Run: pip install shap")

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
MODEL_FILE = MODELS_DIR / "trained_model.pkl"
FEATURE_COLS_FILE = MODELS_DIR / "feature_columns.json"
SHAP_VALUES_FILE = MODELS_DIR / "shap_values.pkl"

# Feature translations
FEATURE_LABELS = {
    "rain_Feb_Mar": "Mưa T2-T3 (kích hoa)",
    "soil_Apr_Jun": "Độ ẩm đất T4-T6",
    "temp_max_MayJun": "Nhiệt max T5-T6",
    "days_over_33": "Ngày >33°C",
    "radiation_JunSep": "Bức xạ T6-T9",
    "rain_OctDec": "Mưa T10-T12",
    "humidity_Apr_Jun": "Độ ẩm KK T4-T6",
    "SPI_MarJun": "Chỉ số hạn T3-T6",
}


def load_model():
    """Load trained model."""
    with open(MODEL_FILE, 'rb') as f:
        return pickle.load(f)


def load_feature_columns():
    """Load feature column names."""
    with open(FEATURE_COLS_FILE, 'r') as f:
        return json.load(f)


def load_data():
    """Load features and yield data."""
    features = pd.read_csv(FEATURES_FILE)
    yield_data = pd.read_csv(YIELD_FILE)
    df = features.merge(yield_data[['year', 'yield_ton_ha']], on='year', how='inner')
    return df


def load_shap_values():
    """Load pre-computed SHAP values."""
    if not SHAP_VALUES_FILE.exists():
        return None
    with open(SHAP_VALUES_FILE, 'rb') as f:
        return pickle.load(f)


def compute_shap_values(model=None, X=None, feature_columns=None, save=True):
    """
    Compute SHAP values for the model.
    
    Args:
        model: Trained model
        X: Feature data
        feature_columns: List of feature names
        save: Whether to save SHAP values to file
        
    Returns:
        SHAP values array
    """
    if not HAS_SHAP:
        raise ImportError("SHAP not installed")
    
    if model is None:
        model = load_model()
    
    if feature_columns is None:
        feature_columns = load_feature_columns()
    
    if X is None:
        df = load_data()
        df = df.sort_values('year').reset_index(drop=True)
        train_df = df.iloc[:-2]  # Exclude last 2 years (test set)
        X = train_df[feature_columns]
    
    print("🔍 Computing SHAP values...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    
    if save:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        with open(SHAP_VALUES_FILE, 'wb') as f:
            pickle.dump({
                'shap_values': shap_values,
                'feature_names': feature_columns,
                'X': X.values
            }, f)
        print(f"✅ Saved SHAP values to {SHAP_VALUES_FILE}")
    
    return shap_values


def plot_summary(shap_values=None, X=None, feature_columns=None, save_path=None):
    """Create SHAP summary plot."""
    if not HAS_SHAP:
        raise ImportError("SHAP not installed")
    
    if shap_values is None:
        data = load_shap_values()
        if data is None:
            print("No SHAP values found. Computing...")
            shap_values = compute_shap_values()
            data = load_shap_values()
        shap_values = data['shap_values']
        X = pd.DataFrame(data['X'], columns=data['feature_names'])
        feature_columns = data['feature_names']
    
    # Use Vietnamese labels
    labels = [FEATURE_LABELS.get(f, f) for f in feature_columns]
    
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X, feature_names=labels, show=False)
    plt.title('SHAP Summary - Tầm quan trọng của features', fontsize=14)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"✅ Saved plot to {save_path}")
    
    plt.show()


def plot_bar(shap_values=None, feature_columns=None, save_path=None):
    """Create SHAP bar plot (mean absolute importance)."""
    if not HAS_SHAP:
        raise ImportError("SHAP not installed")
    
    if shap_values is None:
        data = load_shap_values()
        if data is None:
            shap_values = compute_shap_values()
            data = load_shap_values()
        shap_values = data['shap_values']
        feature_columns = data['feature_names']
    
    # Calculate mean absolute SHAP values
    mean_abs_shap = np.abs(shap_values).mean(axis=0)
    
    # Sort by importance
    indices = np.argsort(mean_abs_shap)[::-1]
    sorted_features = [feature_columns[i] for i in indices]
    sorted_values = mean_abs_shap[indices]
    
    # Use Vietnamese labels
    labels = [FEATURE_LABELS.get(f, f) for f in sorted_features]
    
    plt.figure(figsize=(10, 6))
    bars = plt.barh(range(len(labels)), sorted_values[::-1], color='steelblue')
    plt.yticks(range(len(labels)), labels[::-1])
    plt.xlabel('Mean |SHAP value|')
    plt.title('Feature Importance (SHAP)', fontsize=14)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"✅ Saved plot to {save_path}")
    
    plt.show()


def get_feature_importance():
    """Get feature importance ranking."""
    data = load_shap_values()
    
    if data is None:
        compute_shap_values()
        data = load_shap_values()
    
    shap_values = data['shap_values']
    feature_columns = data['feature_names']
    
    # Mean absolute SHAP values
    mean_abs_shap = np.abs(shap_values).mean(axis=0)
    
    # Sort by importance
    indices = np.argsort(mean_abs_shap)[::-1]
    
    importance = []
    for i in indices:
        importance.append({
            'feature': feature_columns[i],
            'label': FEATURE_LABELS.get(feature_columns[i], feature_columns[i]),
            'shap_importance': float(mean_abs_shap[i])
        })
    
    return importance


def print_feature_importance():
    """Print feature importance ranking."""
    importance = get_feature_importance()
    
    print("\n" + "=" * 60)
    print("🔍 FEATURE IMPORTANCE (SHAP)")
    print("=" * 60)
    print(f"\n{'Rank':<6} {'Feature':<25} {'SHAP Importance':<15}")
    print("-" * 50)
    
    for i, item in enumerate(importance, 1):
        print(f"{i:<6} {item['label']:<25} {item['shap_importance']:.4f}")
    
    print("\n" + "=" * 60)
    
    return importance


if __name__ == "__main__":
    print_feature_importance()
    
    # Create plots
    print("\n📊 Creating SHAP plots...")
    plot_summary(save_path=MODELS_DIR / "shap_summary.png")
    plot_bar(save_path=MODELS_DIR / "shap_bar.png")
