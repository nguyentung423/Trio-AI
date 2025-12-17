"""
generate_backup_charts_v2.py

Tạo 4 ảnh BACKUP mới với % error rõ ràng trên từng năm.

Output:
- loyo_actual_vs_pred_pct.png
- loyo_pct_error_by_year.png
- wf_actual_vs_pred_pct.png
- wf_pct_error_by_year.png
- metrics_summary.md

Usage:
    cd backend
    python scripts/generate_backup_charts_v2.py
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

# ========================
# CẤU HÌNH
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
OUTPUT_DIR = BASE_DIR / "reports" / "figures" / "backup"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# Features
FEATURE_COLUMNS = [
    "rain_Feb_Mar", "soil_Apr_Jun", "temp_max_MayJun", "days_over_33",
    "radiation_JunSep", "rain_OctDec", "humidity_Apr_Jun", "SPI_MarJun",
]

# XGBoost params
XGB_PARAMS = {
    'n_estimators': 500, 'learning_rate': 0.05, 'max_depth': 4,
    'subsample': 0.8, 'colsample_bytree': 0.8, 'random_state': 42, 'n_jobs': -1
}

# Style chuẩn
plt.rcParams.update({
    'figure.figsize': (16, 9),
    'figure.dpi': 100,
    'font.size': 14,
    'axes.titlesize': 20,
    'axes.labelsize': 16,
    'xtick.labelsize': 14,
    'ytick.labelsize': 14,
    'legend.fontsize': 14,
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


def run_walk_forward(df, test_years=7):
    """Walk-Forward Validation."""
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
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train_scaled, y_train, verbose=False)
        y_pred = model.predict(X_test_scaled)[0]
        
        pct_error = abs(y_test - y_pred) / y_test * 100
        results.append({'year': test_year, 'actual': y_test, 'predicted': y_pred, 'pct_error': pct_error})
    
    return pd.DataFrame(results)


def run_loyo(df):
    """Leave-One-Year-Out Validation."""
    years = sorted(df['year'].values)
    results = []
    
    for held_out_year in years:
        train_df = df[df['year'] != held_out_year]
        test_df = df[df['year'] == held_out_year]
        
        X_train = train_df[FEATURE_COLUMNS].values
        y_train = train_df['yield'].values
        X_test = test_df[FEATURE_COLUMNS].values
        y_test = test_df['yield'].values[0]
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train_scaled, y_train, verbose=False)
        y_pred = model.predict(X_test_scaled)[0]
        
        pct_error = abs(y_test - y_pred) / y_test * 100
        results.append({'year': held_out_year, 'actual': y_test, 'predicted': y_pred, 'pct_error': pct_error})
    
    return pd.DataFrame(results)


def plot_actual_vs_pred_with_pct(results_df, title, subtitle, mape, output_path):
    """
    Biểu đồ Thực tế vs Dự báo với % error trên từng năm.
    """
    fig, ax = plt.subplots(figsize=(16, 9))
    
    years = results_df['year'].values
    actual = results_df['actual'].values
    predicted = results_df['predicted'].values
    pct_errors = results_df['pct_error'].values
    
    # Plot lines
    ax.plot(years, actual, 'o-', markersize=12, linewidth=3, 
            label='Thực tế', color='#2E86AB', markeredgecolor='white', markeredgewidth=2)
    ax.plot(years, predicted, 's--', markersize=12, linewidth=3,
            label='Dự báo', color='#E94F37', markeredgecolor='white', markeredgewidth=2)
    
    # Add % error annotations (RED color, above predicted points)
    for i, (yr, pred, pct) in enumerate(zip(years, predicted, pct_errors)):
        warning = " ⚠" if pct > 10 else ""
        ax.annotate(f'{pct:.1f}%{warning}', 
                   xy=(yr, pred), 
                   xytext=(0, 15), 
                   textcoords='offset points',
                   ha='center', va='bottom',
                   fontsize=14, fontweight='bold', color='#E94F37',
                   bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='#E94F37', alpha=0.9))
    
    # MAPE box in top-right
    ax.text(0.98, 0.95, f'MAPE trung bình: {mape:.1f}%', 
            transform=ax.transAxes, fontsize=16, fontweight='bold',
            verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#FFE66D', edgecolor='black', linewidth=2))
    
    ax.set_xlabel('Năm', fontsize=16, fontweight='bold')
    ax.set_ylabel('Năng suất (tấn/ha)', fontsize=16, fontweight='bold')
    ax.set_title(title, fontsize=22, fontweight='bold', pad=20)
    
    # Subtitle
    ax.text(0.5, 1.02, subtitle, transform=ax.transAxes, fontsize=12, 
            ha='center', va='bottom', style='italic', color='gray')
    
    ax.legend(loc='upper left', fontsize=14)
    ax.set_xticks(years)
    ax.set_ylim(min(min(actual), min(predicted)) * 0.9, max(max(actual), max(predicted)) * 1.15)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path.name}")


def plot_pct_error_by_year(results_df, title, mape, output_path):
    """
    Bar chart sai số % theo năm với đường MAPE trung bình.
    """
    fig, ax = plt.subplots(figsize=(16, 9))
    
    years = results_df['year'].values
    pct_errors = results_df['pct_error'].values
    
    # Color bars based on error level
    colors = ['#E94F37' if e > 10 else '#2E86AB' for e in pct_errors]
    
    bars = ax.bar(years, pct_errors, color=colors, edgecolor='white', linewidth=2, width=0.7)
    
    # Add value labels on bars
    for bar, pct in zip(bars, pct_errors):
        warning = " ⚠" if pct > 10 else ""
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                f'{pct:.1f}%{warning}', ha='center', va='bottom', 
                fontsize=14, fontweight='bold', color='black')
    
    # MAPE horizontal line
    ax.axhline(y=mape, color='#FFB627', linewidth=3, linestyle='--', label=f'MAPE trung bình = {mape:.1f}%')
    
    # MAPE label
    ax.text(years[-1] + 0.5, mape, f'{mape:.1f}%', fontsize=14, fontweight='bold', 
            color='#FFB627', va='center')
    
    ax.set_xlabel('Năm', fontsize=16, fontweight='bold')
    ax.set_ylabel('Sai số (%)', fontsize=16, fontweight='bold')
    ax.set_title(title, fontsize=22, fontweight='bold', pad=20)
    ax.legend(loc='upper right', fontsize=14)
    ax.set_xticks(years)
    ax.set_ylim(0, max(pct_errors) * 1.25)
    
    # Add legend for colors
    ax.text(0.02, 0.95, '🔵 Sai số ≤ 10%\n🔴 Sai số > 10%', 
            transform=ax.transAxes, fontsize=12, va='top',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='white', edgecolor='gray'))
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"   ✅ Saved: {output_path.name}")


def save_metrics_summary(loyo_df, wf_df, output_path):
    """Tạo file metrics_summary.md."""
    
    loyo_mape = loyo_df['pct_error'].mean()
    loyo_mae = np.mean(np.abs(loyo_df['actual'] - loyo_df['predicted']))
    loyo_max_year = loyo_df.loc[loyo_df['pct_error'].idxmax(), 'year']
    loyo_max_error = loyo_df['pct_error'].max()
    
    wf_mape = wf_df['pct_error'].mean()
    wf_mae = np.mean(np.abs(wf_df['actual'] - wf_df['predicted']))
    wf_max_year = wf_df.loc[wf_df['pct_error'].idxmax(), 'year']
    wf_max_error = wf_df['pct_error'].max()
    
    content = f"""# BACKUP Metrics Summary - TRIO-AI

## LOYO Cross-Validation ({int(loyo_df['year'].min())}–{int(loyo_df['year'].max())})
- **MAPE:** {loyo_mape:.1f}%
- **MAE:** {loyo_mae:.2f} tấn/ha
- **Số năm test:** {len(loyo_df)}
- **Năm sai cao nhất:** {int(loyo_max_year)} ({loyo_max_error:.1f}%)

## Walk-Forward Backtest ({int(wf_df['year'].min())}–{int(wf_df['year'].max())})
- **MAPE:** {wf_mape:.1f}%
- **MAE:** {wf_mae:.2f} tấn/ha
- **Số năm test:** {len(wf_df)}
- **Năm sai cao nhất:** {int(wf_max_year)} ({wf_max_error:.1f}%)

## Tóm tắt (copy vào slide)
```
LOYO (2015–2024): MAPE = {loyo_mape:.1f}%, MAE = {loyo_mae:.2f} tấn/ha
Walk-forward (2018–2024): MAPE = {wf_mape:.1f}%, MAE = {wf_mae:.2f} tấn/ha
```

## Ghi chú
- Số màu đỏ trên biểu đồ = Sai số (%)
- ⚠ = Năm có sai số > 10%
- MAPE = Mean Absolute Percentage Error

---
*Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}*
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"   ✅ Saved: {output_path.name}")
    
    return content, loyo_mape, wf_mape, loyo_mae, wf_mae


def main():
    print("\n" + "="*70)
    print("🎯 GENERATE BACKUP CHARTS V2 - With % Error Labels")
    print("="*70)
    
    # Load data
    print("\n📂 Loading data...")
    df = load_data()
    print(f"   Years: {sorted(df['year'].values)}")
    
    # Run validations
    print("\n🔄 Running Walk-Forward...")
    wf_df = run_walk_forward(df)
    wf_mape = wf_df['pct_error'].mean()
    print(f"   MAPE = {wf_mape:.1f}%")
    
    print("\n🔬 Running LOYO...")
    loyo_df = run_loyo(df)
    loyo_mape = loyo_df['pct_error'].mean()
    print(f"   MAPE = {loyo_mape:.1f}%")
    
    # Generate 4 charts
    print("\n🎨 Generating backup charts...")
    
    # 1) LOYO: Actual vs Pred with % error
    plot_actual_vs_pred_with_pct(
        loyo_df,
        title="LOYO: Thực tế vs Dự báo (Sai số % theo năm)",
        subtitle="Số màu đỏ trên từng năm = sai số (%)",
        mape=loyo_mape,
        output_path=OUTPUT_DIR / "loyo_actual_vs_pred_pct.png"
    )
    
    # 2) LOYO: % Error by year
    plot_pct_error_by_year(
        loyo_df,
        title="LOYO: Sai số (%) theo năm",
        mape=loyo_mape,
        output_path=OUTPUT_DIR / "loyo_pct_error_by_year.png"
    )
    
    # 3) Walk-forward: Actual vs Pred with % error
    plot_actual_vs_pred_with_pct(
        wf_df,
        title="Walk-Forward: Thực tế vs Dự báo (Sai số % theo năm)",
        subtitle="Số màu đỏ trên từng năm = sai số (%)",
        mape=wf_mape,
        output_path=OUTPUT_DIR / "wf_actual_vs_pred_pct.png"
    )
    
    # 4) Walk-forward: % Error by year
    plot_pct_error_by_year(
        wf_df,
        title="Walk-Forward: Sai số (%) theo năm",
        mape=wf_mape,
        output_path=OUTPUT_DIR / "wf_pct_error_by_year.png"
    )
    
    # 5) Metrics summary
    print("\n📝 Saving metrics summary...")
    summary, _, _, _, _ = save_metrics_summary(loyo_df, wf_df, OUTPUT_DIR / "metrics_summary.md")
    
    print("\n" + "="*70)
    print("✅ DONE! All 4 charts generated.")
    print("="*70)
    print(summary)


if __name__ == "__main__":
    main()
