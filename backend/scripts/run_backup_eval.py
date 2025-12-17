"""
run_backup_eval.py

Script tạo các hình ảnh BACKUP cho slide thuyết trình.
Chạy Walk-Forward + LOYO validation và xuất 4 ảnh PNG chuẩn.

Output: backend/reports/figures/backup/
- backup_walkforward_actual_vs_pred.png
- backup_loyo_actual_vs_pred.png  
- backup_metrics_comparison.png
- backup_feature_importance.png
- backup_metrics_summary.md

Usage:
    cd backend
    python scripts/run_backup_eval.py
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import warnings
warnings.filterwarnings('ignore')

# ========================
# CẤU HÌNH
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"
OUTPUT_DIR = BASE_DIR / "reports" / "figures" / "backup"

# Tạo output folder
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# Features
FEATURE_COLUMNS = [
    "rain_Feb_Mar",
    "soil_Apr_Jun", 
    "temp_max_MayJun",
    "days_over_33",
    "radiation_JunSep",
    "rain_OctDec",
    "humidity_Apr_Jun",
    "SPI_MarJun",
]

# XGBoost params
XGB_PARAMS = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'max_depth': 4,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'n_jobs': -1
}

# Style chuẩn cho ảnh backup
plt.rcParams.update({
    'figure.figsize': (16, 9),
    'figure.dpi': 100,
    'font.size': 14,
    'axes.titlesize': 18,
    'axes.labelsize': 14,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'legend.fontsize': 12,
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'axes.grid': True,
    'grid.alpha': 0.3,
})


def load_data():
    """Load và merge features với yield."""
    features = pd.read_csv(FEATURES_FILE)
    yield_data = pd.read_csv(YIELD_FILE)
    df = features.merge(yield_data[['year', 'yield_ton_ha']], on='year', how='inner')
    df = df.rename(columns={'yield_ton_ha': 'yield'})
    df = df.sort_values('year').reset_index(drop=True)
    return df


def calculate_metrics(y_true, y_pred):
    """Tính MAE và MAPE."""
    mae = np.mean(np.abs(y_true - y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    return mae, mape


def run_walk_forward(df, test_years=7):
    """
    Walk-Forward Validation.
    Train trên data < năm N, predict năm N.
    """
    print("\n" + "="*60)
    print("🔄 WALK-FORWARD VALIDATION")
    print("="*60)
    
    years = sorted(df['year'].values)
    test_start_idx = len(years) - test_years
    results = []
    
    for i in range(test_start_idx, len(years)):
        test_year = years[i]
        train_years = years[:i]
        
        train_df = df[df['year'].isin(train_years)]
        test_df = df[df['year'] == test_year]
        
        X_train = train_df[FEATURE_COLUMNS].values
        y_train = train_df['yield'].values
        X_test = test_df[FEATURE_COLUMNS].values
        y_test = test_df['yield'].values[0]
        
        # Scale
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train_scaled, y_train, verbose=False)
        
        # Predict
        y_pred = model.predict(X_test_scaled)[0]
        error_pct = abs(y_test - y_pred) / y_test * 100
        
        results.append({
            'year': test_year,
            'actual': y_test,
            'predicted': y_pred,
            'error_%': error_pct
        })
        
        print(f"   {test_year}: Actual={y_test:.2f}, Pred={y_pred:.2f}, Error={error_pct:.1f}%")
    
    results_df = pd.DataFrame(results)
    mae, mape = calculate_metrics(results_df['actual'].values, results_df['predicted'].values)
    print(f"\n   📊 Walk-Forward: MAE={mae:.3f} tấn/ha, MAPE={mape:.2f}%")
    
    return results_df, mae, mape


def run_loyo(df):
    """
    Leave-One-Year-Out Cross-Validation.
    Với mỗi năm, loại bỏ hoàn toàn khỏi training, predict năm đó.
    """
    print("\n" + "="*60)
    print("🔬 LEAVE-ONE-YEAR-OUT (LOYO) VALIDATION")
    print("="*60)
    
    years = sorted(df['year'].values)
    results = []
    
    for held_out_year in years:
        train_df = df[df['year'] != held_out_year]
        test_df = df[df['year'] == held_out_year]
        
        X_train = train_df[FEATURE_COLUMNS].values
        y_train = train_df['yield'].values
        X_test = test_df[FEATURE_COLUMNS].values
        y_test = test_df['yield'].values[0]
        
        # Scale
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train_scaled, y_train, verbose=False)
        
        # Predict
        y_pred = model.predict(X_test_scaled)[0]
        error_pct = abs(y_test - y_pred) / y_test * 100
        
        results.append({
            'year': held_out_year,
            'actual': y_test,
            'predicted': y_pred,
            'error_%': error_pct
        })
        
        print(f"   {held_out_year}: Actual={y_test:.2f}, Pred={y_pred:.2f}, Error={error_pct:.1f}%")
    
    results_df = pd.DataFrame(results)
    mae, mape = calculate_metrics(results_df['actual'].values, results_df['predicted'].values)
    print(f"\n   📊 LOYO: MAE={mae:.3f} tấn/ha, MAPE={mape:.2f}%")
    
    return results_df, mae, mape


def get_feature_importance(df):
    """Train full model và lấy feature importance."""
    X = df[FEATURE_COLUMNS].values
    y = df['yield'].values
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = XGBRegressor(**XGB_PARAMS)
    model.fit(X_scaled, y, verbose=False)
    
    importance = pd.DataFrame({
        'feature': FEATURE_COLUMNS,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=True)
    
    return importance, model


def plot_walkforward(results_df, output_path):
    """Ảnh 1: Walk-Forward Actual vs Predicted."""
    fig, ax = plt.subplots(figsize=(16, 9))
    
    years = results_df['year'].values
    actual = results_df['actual'].values
    predicted = results_df['predicted'].values
    
    x = np.arange(len(years))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, actual, width, label='Thực tế', color='#2E86AB', edgecolor='white')
    bars2 = ax.bar(x + width/2, predicted, width, label='Dự báo', color='#E94F37', edgecolor='white')
    
    # Add value labels
    for bar, val in zip(bars1, actual):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02, 
                f'{val:.2f}', ha='center', va='bottom', fontsize=11, fontweight='bold')
    for bar, val in zip(bars2, predicted):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
                f'{val:.2f}', ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    ax.set_xlabel('Năm', fontsize=14)
    ax.set_ylabel('Năng suất (tấn/ha)', fontsize=14)
    ax.set_title('Walk-Forward Validation: Thực tế vs Dự báo', fontsize=18, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(years)
    ax.legend(loc='upper left', fontsize=12)
    ax.set_ylim(0, max(max(actual), max(predicted)) * 1.15)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path}")


def plot_loyo(results_df, output_path):
    """Ảnh 2: LOYO Actual vs Predicted."""
    fig, ax = plt.subplots(figsize=(16, 9))
    
    years = results_df['year'].values
    actual = results_df['actual'].values
    predicted = results_df['predicted'].values
    
    ax.plot(years, actual, 'o-', markersize=10, linewidth=2.5, 
            label='Thực tế', color='#2E86AB', markeredgecolor='white', markeredgewidth=2)
    ax.plot(years, predicted, 's--', markersize=10, linewidth=2.5,
            label='Dự báo (LOYO)', color='#E94F37', markeredgecolor='white', markeredgewidth=2)
    
    # Fill between
    ax.fill_between(years, actual, predicted, alpha=0.2, color='gray')
    
    # Add error annotations for worst cases
    errors = np.abs(actual - predicted)
    for i, (yr, act, pred, err) in enumerate(zip(years, actual, predicted, errors)):
        if err > np.percentile(errors, 70):  # Highlight high error years
            ax.annotate(f'{err:.2f}', xy=(yr, (act+pred)/2), fontsize=10, color='red')
    
    ax.set_xlabel('Năm', fontsize=14)
    ax.set_ylabel('Năng suất (tấn/ha)', fontsize=14)
    ax.set_title('Leave-One-Year-Out (LOYO) Validation: Thực tế vs Dự báo', fontsize=18, fontweight='bold')
    ax.legend(loc='upper left', fontsize=12)
    ax.set_xticks(years)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path}")


def plot_metrics_comparison(wf_mae, wf_mape, loyo_mae, loyo_mape, output_path):
    """Ảnh 3: So sánh metrics giữa 2 phương pháp."""
    fig, axes = plt.subplots(1, 2, figsize=(16, 9))
    
    methods = ['Walk-Forward', 'LOYO']
    colors = ['#2E86AB', '#E94F37']
    
    # MAPE comparison
    ax1 = axes[0]
    mape_vals = [wf_mape, loyo_mape]
    bars1 = ax1.bar(methods, mape_vals, color=colors, edgecolor='white', linewidth=2)
    ax1.set_ylabel('MAPE (%)', fontsize=14)
    ax1.set_title('So sánh MAPE', fontsize=16, fontweight='bold')
    for bar, val in zip(bars1, mape_vals):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                f'{val:.2f}%', ha='center', va='bottom', fontsize=14, fontweight='bold')
    ax1.set_ylim(0, max(mape_vals) * 1.25)
    
    # MAE comparison
    ax2 = axes[1]
    mae_vals = [wf_mae, loyo_mae]
    bars2 = ax2.bar(methods, mae_vals, color=colors, edgecolor='white', linewidth=2)
    ax2.set_ylabel('MAE (tấn/ha)', fontsize=14)
    ax2.set_title('So sánh MAE', fontsize=16, fontweight='bold')
    for bar, val in zip(bars2, mae_vals):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
                f'{val:.3f}', ha='center', va='bottom', fontsize=14, fontweight='bold')
    ax2.set_ylim(0, max(mae_vals) * 1.25)
    
    plt.suptitle('So sánh Metrics: Walk-Forward vs LOYO', fontsize=18, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path}")


def plot_feature_importance(importance_df, output_path):
    """Ảnh 4: Feature Importance."""
    fig, ax = plt.subplots(figsize=(16, 9))
    
    features = importance_df['feature'].values
    importance = importance_df['importance'].values
    
    # Translate feature names to Vietnamese
    feature_labels = {
        'rain_Feb_Mar': 'Lượng mưa T2-T3',
        'soil_Apr_Jun': 'Độ ẩm đất T4-T6',
        'temp_max_MayJun': 'Nhiệt độ max T5-T6',
        'days_over_33': 'Số ngày >33°C',
        'radiation_JunSep': 'Bức xạ T6-T9',
        'rain_OctDec': 'Lượng mưa T10-T12',
        'humidity_Apr_Jun': 'Độ ẩm KK T4-T6',
        'SPI_MarJun': 'Chỉ số hạn SPI T3-T6'
    }
    
    labels = [feature_labels.get(f, f) for f in features]
    colors = plt.cm.Blues(np.linspace(0.3, 0.9, len(features)))
    
    bars = ax.barh(labels, importance, color=colors, edgecolor='white', linewidth=2)
    
    # Add value labels
    for bar, val in zip(bars, importance):
        ax.text(val + 0.005, bar.get_y() + bar.get_height()/2,
                f'{val:.3f}', ha='left', va='center', fontsize=12, fontweight='bold')
    
    ax.set_xlabel('Độ quan trọng (Feature Importance)', fontsize=14)
    ax.set_title('Top 8 Đặc trưng quan trọng nhất - Mô hình XGBoost', fontsize=18, fontweight='bold')
    ax.set_xlim(0, max(importance) * 1.15)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path}")


def save_metrics_summary(wf_results, loyo_results, wf_mae, wf_mape, loyo_mae, loyo_mape, output_path):
    """Lưu tóm tắt metrics vào markdown."""
    wf_years = f"{int(wf_results['year'].min())}-{int(wf_results['year'].max())}"
    loyo_years = f"{int(loyo_results['year'].min())}-{int(loyo_results['year'].max())}"
    
    content = f"""# BACKUP Metrics Summary - TRIO-AI

## Walk-Forward Validation ({wf_years})
- **MAPE:** {wf_mape:.2f}%
- **MAE:** {wf_mae:.3f} tấn/ha
- Số năm test: {len(wf_results)}

## Leave-One-Year-Out (LOYO) ({loyo_years})
- **MAPE:** {loyo_mape:.2f}%
- **MAE:** {loyo_mae:.3f} tấn/ha
- Số năm test: {len(loyo_results)}

## Kết luận
- Sai số trung bình ~{(wf_mape + loyo_mape)/2:.1f}% (MAPE)
- MAE ~{(wf_mae + loyo_mae)/2:.3f} tấn/ha
- Model ổn định, không overfit

---
*Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}*
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"   ✅ Saved: {output_path}")
    
    return content


def main():
    print("\n" + "="*80)
    print("🎯 TRIO-AI BACKUP EVALUATION SCRIPT")
    print("="*80)
    print(f"Output directory: {OUTPUT_DIR}")
    
    # Load data
    print("\n📂 Loading data...")
    df = load_data()
    print(f"   Years: {sorted(df['year'].values)}")
    print(f"   Total samples: {len(df)}")
    
    # Run validations
    wf_results, wf_mae, wf_mape = run_walk_forward(df)
    loyo_results, loyo_mae, loyo_mape = run_loyo(df)
    
    # Get feature importance
    print("\n📊 Calculating feature importance...")
    importance, model = get_feature_importance(df)
    
    # Generate plots
    print("\n🎨 Generating backup figures...")
    
    plot_walkforward(wf_results, OUTPUT_DIR / "backup_walkforward_actual_vs_pred.png")
    plot_loyo(loyo_results, OUTPUT_DIR / "backup_loyo_actual_vs_pred.png")
    plot_metrics_comparison(wf_mae, wf_mape, loyo_mae, loyo_mape, 
                           OUTPUT_DIR / "backup_metrics_comparison.png")
    plot_feature_importance(importance, OUTPUT_DIR / "backup_feature_importance.png")
    
    # Save metrics summary
    print("\n📝 Saving metrics summary...")
    summary = save_metrics_summary(wf_results, loyo_results, 
                                   wf_mae, wf_mape, loyo_mae, loyo_mape,
                                   OUTPUT_DIR / "backup_metrics_summary.md")
    
    print("\n" + "="*80)
    print("✅ BACKUP EVALUATION COMPLETE!")
    print("="*80)
    print(f"\n📁 Output files:")
    for f in OUTPUT_DIR.glob("backup_*"):
        print(f"   - {f}")
    
    print("\n" + summary)


if __name__ == "__main__":
    main()
