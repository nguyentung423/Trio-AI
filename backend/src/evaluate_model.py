"""
evaluate_model.py

Module đánh giá model
Chức năng:
- Load model từ models/
- Tính các metrics: MAE, RMSE, R², MAPE
- Tạo biểu đồ actual vs predicted
- Residual analysis
- Export báo cáo đánh giá
"""

import pickle
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

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


def calculate_mape(y_true, y_pred):
    """Calculate Mean Absolute Percentage Error."""
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


def evaluate(model=None, df=None, feature_columns=None, test_years=2):
    """
    Evaluate model on test set.
    
    Args:
        model: Trained model (if None, will load from file)
        df: DataFrame with features and yield
        feature_columns: List of feature column names
        test_years: Number of years to use for testing
        
    Returns:
        dict with evaluation metrics
    """
    if model is None:
        model = load_model()
    
    if feature_columns is None:
        feature_columns = load_feature_columns()
    
    if df is None:
        df = load_data()
    
    # Sort and split
    df = df.sort_values('year').reset_index(drop=True)
    train_df = df.iloc[:-test_years]
    test_df = df.iloc[-test_years:]
    
    # Prepare data
    X_train = train_df[feature_columns]
    X_test = test_df[feature_columns]
    y_train = train_df['yield_ton_ha']
    y_test = test_df['yield_ton_ha']
    
    # Predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Metrics
    metrics = {
        'train': {
            'mae': mean_absolute_error(y_train, y_pred_train),
            'rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
            'r2': r2_score(y_train, y_pred_train),
            'mape': calculate_mape(y_train.values, y_pred_train)
        },
        'test': {
            'mae': mean_absolute_error(y_test, y_pred_test),
            'rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
            'r2': r2_score(y_test, y_pred_test),
            'mape': calculate_mape(y_test.values, y_pred_test)
        },
        'predictions': {
            'years': test_df['year'].tolist(),
            'actual': y_test.tolist(),
            'predicted': y_pred_test.tolist()
        }
    }
    
    return metrics


def plot_actual_vs_predicted(df=None, model=None, feature_columns=None, save_path=None):
    """Plot actual vs predicted yield."""
    if model is None:
        model = load_model()
    if feature_columns is None:
        feature_columns = load_feature_columns()
    if df is None:
        df = load_data()
    
    df = df.sort_values('year').reset_index(drop=True)
    X = df[feature_columns]
    y_actual = df['yield_ton_ha']
    y_pred = model.predict(X)
    
    plt.figure(figsize=(10, 6))
    plt.plot(df['year'], y_actual, 'o-', color='brown', label='Thực tế', linewidth=2)
    plt.plot(df['year'], y_pred, 's--', color='blue', label='Dự báo', linewidth=2)
    plt.xlabel('Năm')
    plt.ylabel('Năng suất (tấn/ha)')
    plt.title('Năng suất cà phê Đắk Lắk: Thực tế vs Dự báo')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150)
        print(f"Saved plot to {save_path}")
    
    plt.show()


def print_evaluation_report():
    """Print full evaluation report."""
    print("=" * 60)
    print("📊 MODEL EVALUATION REPORT")
    print("=" * 60)
    
    metrics = evaluate()
    
    print("\n📈 Training Set Metrics:")
    print(f"   MAE:  {metrics['train']['mae']:.4f} tấn/ha")
    print(f"   RMSE: {metrics['train']['rmse']:.4f} tấn/ha")
    print(f"   R²:   {metrics['train']['r2']:.4f}")
    print(f"   MAPE: {metrics['train']['mape']:.2f}%")
    
    print("\n📈 Test Set Metrics:")
    print(f"   MAE:  {metrics['test']['mae']:.4f} tấn/ha")
    print(f"   RMSE: {metrics['test']['rmse']:.4f} tấn/ha")
    print(f"   R²:   {metrics['test']['r2']:.4f}")
    print(f"   MAPE: {metrics['test']['mape']:.2f}%")
    
    print("\n📋 Test Set Predictions:")
    print(f"   {'Year':<6} {'Actual':<10} {'Predicted':<10} {'Error%':<10}")
    print(f"   {'-'*36}")
    for i, year in enumerate(metrics['predictions']['years']):
        actual = metrics['predictions']['actual'][i]
        pred = metrics['predictions']['predicted'][i]
        error_pct = ((pred - actual) / actual) * 100
        print(f"   {year:<6} {actual:<10.2f} {pred:<10.2f} {error_pct:<+10.1f}%")
    
    print("\n" + "=" * 60)
    
    return metrics


if __name__ == "__main__":
    print_evaluation_report()
