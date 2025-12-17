"""
loyo_validation.py

Leave-One-Year-Out (LOYO) Cross-Validation để kiểm tra overfitting.

LOYO = với mỗi năm, loại bỏ hoàn toàn khỏi training, train trên các năm còn lại,
rồi chỉ predict năm bị bỏ.

Output: backend/data/processed/loyo_results.csv
"""

import numpy as np
import pandas as pd
from pathlib import Path
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler

# ========================
# CẤU HÌNH
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"

# Files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"
OUTPUT_FILE = DATA_PROCESSED / "loyo_results.csv"

# Features (same as main training pipeline)
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

# XGBoost hyperparameters (same as main training pipeline)
XGB_PARAMS = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'max_depth': 4,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'n_jobs': -1
}


def load_data():
    """Load và merge features với yield data."""
    features = pd.read_csv(FEATURES_FILE)
    yield_data = pd.read_csv(YIELD_FILE)
    
    df = features.merge(yield_data[['year', 'yield_ton_ha']], on='year', how='inner')
    df = df.rename(columns={'yield_ton_ha': 'yield'})
    df = df.sort_values('year').reset_index(drop=True)
    
    return df


def run_loyo_validation():
    """
    Thực hiện Leave-One-Year-Out validation.
    
    Với mỗi năm y trong dataset:
    1. Loại bỏ hoàn toàn năm y khỏi training
    2. Train model trên tất cả các năm còn lại
    3. Predict duy nhất năm y
    4. Ghi lại kết quả
    """
    print("=" * 80)
    print("🔬 LEAVE-ONE-YEAR-OUT (LOYO) VALIDATION")
    print("=" * 80)
    
    # Load data
    print("\n📂 Loading data...")
    df = load_data()
    years = sorted(df['year'].values)
    print(f"   Years with yield data: {years}")
    print(f"   Total years: {len(years)}")
    
    # Results storage
    results = []
    
    print("\n🔄 Running LOYO validation...")
    print("-" * 80)
    
    for held_out_year in years:
        # Split: train on all years except held_out_year
        train_df = df[df['year'] != held_out_year].copy()
        test_df = df[df['year'] == held_out_year].copy()
        
        # Prepare features
        X_train = train_df[FEATURE_COLUMNS].values
        y_train = train_df['yield'].values
        X_test = test_df[FEATURE_COLUMNS].values
        y_test = test_df['yield'].values[0]
        
        # Preprocess: StandardScaler (fit only on training data)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train XGBoost
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train_scaled, y_train)
        
        # Predict
        y_pred = model.predict(X_test_scaled)[0]
        
        # Calculate errors
        abs_error = abs(y_pred - y_test)
        pct_error = (abs_error / y_test) * 100
        
        # Store result
        results.append({
            'year': int(held_out_year),
            'actual_yield': round(y_test, 4),
            'predicted_yield': round(y_pred, 4),
            'abs_error': round(abs_error, 4),
            'pct_error': round(pct_error, 2)
        })
        
        # Print progress
        train_years = [int(y) for y in train_df['year'].values]
        print(f"   Year {int(held_out_year)}: Train on {len(train_years)} years → "
              f"Actual={y_test:.2f}, Pred={y_pred:.2f}, Error={pct_error:.2f}%")
    
    print("-" * 80)
    
    # Create results DataFrame
    results_df = pd.DataFrame(results)
    
    # Save to CSV
    results_df.to_csv(OUTPUT_FILE, index=False)
    print(f"\n💾 Saved: {OUTPUT_FILE}")
    
    # Calculate summary metrics
    print("\n" + "=" * 80)
    print("📊 LOYO VALIDATION SUMMARY")
    print("=" * 80)
    
    mean_abs_error = results_df['abs_error'].mean()
    mean_pct_error = results_df['pct_error'].mean()
    max_pct_error = results_df['pct_error'].max()
    min_pct_error = results_df['pct_error'].min()
    std_pct_error = results_df['pct_error'].std()
    
    print(f"\n┌{'─'*40}┬{'─'*15}┐")
    print(f"│ {'Metric':<38} │ {'Value':>13} │")
    print(f"├{'─'*40}┼{'─'*15}┤")
    print(f"│ {'Mean Absolute Error (MAE)':<38} │ {mean_abs_error:>10.4f} t/ha │")
    print(f"│ {'Mean Percentage Error (MAPE)':<38} │ {mean_pct_error:>10.2f} %   │")
    print(f"│ {'Max Percentage Error':<38} │ {max_pct_error:>10.2f} %   │")
    print(f"│ {'Min Percentage Error':<38} │ {min_pct_error:>10.2f} %   │")
    print(f"│ {'Std Percentage Error':<38} │ {std_pct_error:>10.2f} %   │")
    print(f"└{'─'*40}┴{'─'*15}┘")
    
    # Detailed results table
    print(f"\n📋 DETAILED RESULTS:")
    print(f"\n┌{'─'*8}┬{'─'*14}┬{'─'*14}┬{'─'*12}┬{'─'*12}┐")
    print(f"│ {'Year':^6} │ {'Actual':^12} │ {'Predicted':^12} │ {'Abs Err':^10} │ {'Pct Err':^10} │")
    print(f"├{'─'*8}┼{'─'*14}┼{'─'*14}┼{'─'*12}┼{'─'*12}┤")
    for _, row in results_df.iterrows():
        flag = "⚠️" if row['pct_error'] > 15 else "  "
        print(f"│ {int(row['year']):^6} │ {row['actual_yield']:^12.2f} │ {row['predicted_yield']:^12.2f} │ "
              f"{row['abs_error']:^10.4f} │ {row['pct_error']:^8.2f}% {flag}│")
    print(f"└{'─'*8}┴{'─'*14}┴{'─'*14}┴{'─'*12}┴{'─'*12}┘")
    
    # Overfitting analysis
    print("\n" + "=" * 80)
    print("🔍 OVERFITTING ANALYSIS")
    print("=" * 80)
    
    years_over_25 = results_df[results_df['pct_error'] > 25]
    years_over_20 = results_df[results_df['pct_error'] > 20]
    years_over_15 = results_df[results_df['pct_error'] > 15]
    years_over_10 = results_df[results_df['pct_error'] > 10]
    years_under_10 = results_df[results_df['pct_error'] <= 10]
    
    print(f"\n   • Years with error > 25%: {len(years_over_25)} ({list(years_over_25['year'].values) if len(years_over_25) > 0 else 'None'})")
    print(f"   • Years with error > 20%: {len(years_over_20)} ({list(years_over_20['year'].values) if len(years_over_20) > 0 else 'None'})")
    print(f"   • Years with error > 15%: {len(years_over_15)} ({list(years_over_15['year'].values) if len(years_over_15) > 0 else 'None'})")
    print(f"   • Years with error > 10%: {len(years_over_10)} ({list(years_over_10['year'].values) if len(years_over_10) > 0 else 'None'})")
    print(f"   • Years with error ≤ 10%: {len(years_under_10)}/{len(results_df)}")
    
    # Best and worst years
    best_year = results_df.loc[results_df['pct_error'].idxmin()]
    worst_year = results_df.loc[results_df['pct_error'].idxmax()]
    
    print(f"\n   🏆 Best predicted year:  {int(best_year['year'])} (error: {best_year['pct_error']:.2f}%)")
    print(f"   ⚠️  Worst predicted year: {int(worst_year['year'])} (error: {worst_year['pct_error']:.2f}%)")
    
    # Overfitting verdict
    print("\n" + "=" * 80)
    print("📝 OVERFITTING VERDICT")
    print("=" * 80)
    
    if len(years_over_25) >= 2:
        verdict = "SIGNIFICANT"
        emoji = "❌"
        explanation = f"Model shows SIGNIFICANT overfitting: {len(years_over_25)} years with error > 25%"
    elif len(years_over_20) >= 1 or std_pct_error > 10:
        verdict = "MILD"
        emoji = "🟡"
        explanation = f"Model shows MILD overfitting: {len(years_over_20)} year(s) with error > 20%, std={std_pct_error:.2f}%"
    else:
        verdict = "NO"
        emoji = "✅"
        explanation = f"Model shows NO significant overfitting: all years < 20%, majority < 10%"
    
    print(f"\n   {emoji} {explanation}")
    print(f"\n   Based on LOYO validation, the model shows [{verdict}] overfitting.")
    
    print("\n" + "=" * 80)
    print("✅ LOYO VALIDATION COMPLETE")
    print("=" * 80)
    
    return results_df


if __name__ == "__main__":
    run_loyo_validation()
