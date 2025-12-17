"""
retrain_upgraded.py

Retrain XGBoost model with upgraded features (NASA POWER, ENSO, SPEI)
Run walk-forward backtest and compare with original model.
Perform stress test for climate extremes.
"""

import numpy as np
import pandas as pd
import pickle
import json
from pathlib import Path
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# ========================
# CONFIG
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_PROCESSED = BASE_DIR / "data" / "processed"
DATA_RAW = BASE_DIR / "data" / "raw"
MODELS_DIR = BASE_DIR / "models"

# Files
FEATURES_ORIGINAL = DATA_PROCESSED / "features_yearly.csv"
FEATURES_UPGRADED = DATA_PROCESSED / "features_yearly_upgraded.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# ========================
# LOAD DATA
# ========================
def load_data():
    """Load upgraded features and yield data."""
    print("\n📂 Loading data...")
    
    features = pd.read_csv(FEATURES_UPGRADED)
    yields = pd.read_csv(YIELD_FILE)
    
    # Merge
    df = features.merge(yields[['year', 'yield_ton_ha']], on='year', how='inner')
    
    print(f"   ✅ Features: {features.shape[1]} columns, {len(features)} years")
    print(f"   ✅ Merged with yield: {len(df)} years with yield data")
    
    return df


# ========================
# WALK-FORWARD VALIDATION
# ========================
def walk_forward_validation(df, feature_cols, use_upgraded=True):
    """
    Walk-forward validation: train on years <= y, predict year y+1.
    """
    label = "UPGRADED" if use_upgraded else "ORIGINAL"
    print(f"\n🔄 Walk-Forward Backtest ({label})...")
    
    results = []
    years = sorted(df['year'].unique())
    
    # Start from 2018 (need min 3 years training)
    for test_year in range(2018, 2025):
        train = df[df['year'] < test_year]
        test = df[df['year'] == test_year]
        
        if len(train) < 3 or len(test) == 0:
            continue
        
        X_train = train[feature_cols]
        y_train = train['yield_ton_ha']
        X_test = test[feature_cols]
        y_test = test['yield_ton_ha'].values[0]
        
        # Scale
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train XGBoost
        model = XGBRegressor(
            n_estimators=500,
            learning_rate=0.05,
            max_depth=4,
            min_child_weight=2,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbosity=0
        )
        
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)[0]
        
        error = abs(y_pred - y_test)
        pct_error = (error / y_test) * 100
        
        results.append({
            'year': test_year,
            'actual': y_test,
            'predicted': y_pred,
            'error': error,
            'pct_error': pct_error,
            'train_size': len(train)
        })
    
    return pd.DataFrame(results)


def compare_models():
    """Compare original vs upgraded model performance."""
    print("\n" + "=" * 80)
    print("📊 MODEL COMPARISON: ORIGINAL vs UPGRADED FEATURES")
    print("=" * 80)
    
    # Load upgraded features
    df_upgraded = load_data()
    
    # Define feature columns
    # Original features (excluding new ones)
    original_features = [
        'rain_Feb_Mar', 'soil_Apr_Jun', 'temp_max_MayJun', 
        'days_over_33', 'radiation_JunSep', 'rain_OctDec',
        'humidity_Apr_Jun', 'SPI_MarJun'
    ]
    
    # Upgraded features (including new climate indices)
    upgraded_features = original_features + [
        'radiation_JunSep_NASA', 'ENSO_MarJun', 'SPEI_MarJun'
    ]
    
    # Check which features exist
    available_original = [f for f in original_features if f in df_upgraded.columns]
    available_upgraded = [f for f in upgraded_features if f in df_upgraded.columns]
    
    print(f"\n   Original features: {len(available_original)}")
    print(f"   Upgraded features: {len(available_upgraded)}")
    
    # Run walk-forward for both
    results_original = walk_forward_validation(df_upgraded, available_original, use_upgraded=False)
    results_upgraded = walk_forward_validation(df_upgraded, available_upgraded, use_upgraded=True)
    
    # Calculate metrics
    mape_original = results_original['pct_error'].mean()
    mape_upgraded = results_upgraded['pct_error'].mean()
    
    max_error_original = results_original['pct_error'].max()
    max_error_upgraded = results_upgraded['pct_error'].max()
    
    print("\n" + "=" * 80)
    print("📈 RESULTS COMPARISON")
    print("=" * 80)
    print(f"\n{'Metric':<25} {'Original':>15} {'Upgraded':>15} {'Improvement':>15}")
    print("-" * 70)
    print(f"{'MAPE (%)':<25} {mape_original:>15.2f} {mape_upgraded:>15.2f} {mape_original - mape_upgraded:>+15.2f}")
    print(f"{'Max Error (%)':<25} {max_error_original:>15.2f} {max_error_upgraded:>15.2f} {max_error_original - max_error_upgraded:>+15.2f}")
    
    # Year-by-year comparison
    print("\n" + "-" * 70)
    print("YEAR-BY-YEAR COMPARISON:")
    print("-" * 70)
    print(f"{'Year':<8} {'Actual':>10} {'Orig Pred':>12} {'Orig Err%':>10} {'Upg Pred':>12} {'Upg Err%':>10}")
    print("-" * 70)
    
    for i in range(len(results_original)):
        year = results_original.iloc[i]['year']
        actual = results_original.iloc[i]['actual']
        orig_pred = results_original.iloc[i]['predicted']
        orig_err = results_original.iloc[i]['pct_error']
        upg_pred = results_upgraded.iloc[i]['predicted']
        upg_err = results_upgraded.iloc[i]['pct_error']
        
        # Highlight improvement
        better = "✓" if upg_err < orig_err else ""
        print(f"{int(year):<8} {actual:>10.2f} {orig_pred:>12.2f} {orig_err:>9.2f}% {upg_pred:>12.2f} {upg_err:>9.2f}% {better}")
    
    print("-" * 70)
    
    # Save comparison results
    comparison_df = pd.merge(
        results_original[['year', 'actual', 'predicted', 'pct_error']].rename(
            columns={'predicted': 'pred_original', 'pct_error': 'error_original'}
        ),
        results_upgraded[['year', 'predicted', 'pct_error']].rename(
            columns={'predicted': 'pred_upgraded', 'pct_error': 'error_upgraded'}
        ),
        on='year'
    )
    comparison_df['improvement'] = comparison_df['error_original'] - comparison_df['error_upgraded']
    comparison_df.to_csv(DATA_PROCESSED / "upgrade_comparison.csv", index=False)
    print(f"\n✅ Saved comparison: {DATA_PROCESSED / 'upgrade_comparison.csv'}")
    
    # Create visualization
    plot_comparison(results_original, results_upgraded)
    
    return results_original, results_upgraded


def plot_comparison(results_original, results_upgraded):
    """Create comparison plots."""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Plot 1: Actual vs Predicted
    ax1 = axes[0]
    years = results_original['year']
    ax1.plot(years, results_original['actual'], 'ko-', label='Actual', linewidth=2, markersize=8)
    ax1.plot(years, results_original['predicted'], 'b^--', label='Original Features', linewidth=1.5, markersize=7)
    ax1.plot(years, results_upgraded['predicted'], 'gs--', label='Upgraded Features', linewidth=1.5, markersize=7)
    ax1.set_xlabel('Year', fontsize=12)
    ax1.set_ylabel('Yield (ton/ha)', fontsize=12)
    ax1.set_title('Actual vs Predicted: Original vs Upgraded', fontsize=14)
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Plot 2: Error comparison
    ax2 = axes[1]
    x = np.arange(len(years))
    width = 0.35
    ax2.bar(x - width/2, results_original['pct_error'], width, label='Original', color='blue', alpha=0.7)
    ax2.bar(x + width/2, results_upgraded['pct_error'], width, label='Upgraded', color='green', alpha=0.7)
    ax2.set_xlabel('Year', fontsize=12)
    ax2.set_ylabel('Error (%)', fontsize=12)
    ax2.set_title('Error Comparison by Year', fontsize=14)
    ax2.set_xticks(x)
    ax2.set_xticklabels([int(y) for y in years])
    ax2.legend()
    ax2.grid(True, alpha=0.3, axis='y')
    
    # Add MAPE annotations
    mape_orig = results_original['pct_error'].mean()
    mape_upg = results_upgraded['pct_error'].mean()
    ax2.axhline(mape_orig, color='blue', linestyle=':', alpha=0.7, label=f'MAPE Orig: {mape_orig:.2f}%')
    ax2.axhline(mape_upg, color='green', linestyle=':', alpha=0.7, label=f'MAPE Upg: {mape_upg:.2f}%')
    
    plt.tight_layout()
    plt.savefig(MODELS_DIR / "upgrade_comparison.png", dpi=150, bbox_inches='tight')
    print(f"✅ Saved plot: {MODELS_DIR / 'upgrade_comparison.png'}")
    plt.close()


# ========================
# STRESS TEST
# ========================
def stress_test():
    """
    Stress test: analyze model sensitivity to extreme climate conditions.
    """
    print("\n" + "=" * 80)
    print("🔥 STRESS TEST: CLIMATE EXTREME SENSITIVITY ANALYSIS")
    print("=" * 80)
    
    # Load data and train final model
    df = load_data()
    
    # Use upgraded features
    feature_cols = [
        'rain_Feb_Mar', 'soil_Apr_Jun', 'temp_max_MayJun', 
        'days_over_33', 'radiation_JunSep', 'rain_OctDec',
        'humidity_Apr_Jun', 'SPI_MarJun',
        'radiation_JunSep_NASA', 'ENSO_MarJun', 'SPEI_MarJun'
    ]
    
    available_features = [f for f in feature_cols if f in df.columns]
    
    X = df[available_features]
    y = df['yield_ton_ha']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,
        min_child_weight=2,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0
    )
    model.fit(X_scaled, y)
    
    # Baseline prediction (using 2023 as reference)
    baseline_year = df[df['year'] == 2023]
    if len(baseline_year) == 0:
        baseline_year = df.iloc[-1:]
    
    X_baseline = baseline_year[available_features]
    X_baseline_scaled = scaler.transform(X_baseline)
    baseline_pred = model.predict(X_baseline_scaled)[0]
    
    print(f"\n📊 Baseline Year: {int(baseline_year['year'].values[0])}")
    print(f"   Baseline Yield: {baseline_pred:.2f} ton/ha")
    
    # Stress scenarios
    scenarios = {
        'Hạn hán nghiêm trọng (Severe Drought)': {
            'rain_Feb_Mar': -50,  # -50%
            'soil_Apr_Jun': -0.1,  # absolute reduction
            'SPEI_MarJun': -1.5,  # drought index
            'SPI_MarJun': -1.5
        },
        'El Niño mạnh (Strong El Niño)': {
            'ENSO_MarJun': 2.0,  # strong warm phase
            'rain_Feb_Mar': -30,
            'temp_max_MayJun': 2.0  # +2°C
        },
        'La Niña mạnh (Strong La Niña)': {
            'ENSO_MarJun': -1.5,  # cold phase
            'rain_Feb_Mar': 50,  # +50%
            'rain_OctDec': 50
        },
        'Nắng nóng kéo dài (Heat Wave)': {
            'temp_max_MayJun': 3.0,  # +3°C
            'days_over_33': 20,  # +20 days
            'radiation_JunSep': 200  # +200 MJ/m²
        },
        'Mưa bất thường (Abnormal Rain Pattern)': {
            'rain_Feb_Mar': 100,  # +100%
            'rain_OctDec': -40,  # -40%
            'humidity_Apr_Jun': 10  # +10%
        },
        'Kịch bản tối ưu (Optimal Conditions)': {
            'rain_Feb_Mar': 20,  # +20%
            'soil_Apr_Jun': 0.05,
            'temp_max_MayJun': -1.0,  # -1°C cooler
            'days_over_33': -10,
            'SPEI_MarJun': 0.5
        }
    }
    
    print("\n" + "-" * 70)
    print("STRESS TEST RESULTS:")
    print("-" * 70)
    print(f"{'Scenario':<40} {'Yield':>12} {'Change':>12} {'Impact':>10}")
    print("-" * 70)
    
    stress_results = []
    
    for scenario_name, changes in scenarios.items():
        # Apply changes
        X_stress = X_baseline.copy()
        
        for feature, delta in changes.items():
            if feature in X_stress.columns:
                original_val = X_stress[feature].values[0]
                
                # Percentage change for rainfall
                if 'rain' in feature.lower() and abs(delta) < 100:
                    new_val = original_val * (1 + delta/100)
                else:
                    new_val = original_val + delta
                
                X_stress[feature] = new_val
        
        X_stress_scaled = scaler.transform(X_stress)
        stress_pred = model.predict(X_stress_scaled)[0]
        
        change = stress_pred - baseline_pred
        pct_change = (change / baseline_pred) * 100
        
        # Determine impact level
        if abs(pct_change) < 3:
            impact = "Low"
        elif abs(pct_change) < 7:
            impact = "Medium"
        else:
            impact = "HIGH"
        
        stress_results.append({
            'scenario': scenario_name,
            'yield': stress_pred,
            'change': change,
            'pct_change': pct_change,
            'impact': impact
        })
        
        print(f"{scenario_name:<40} {stress_pred:>10.2f} {change:>+10.2f} ({pct_change:>+6.2f}%)")
    
    print("-" * 70)
    
    # Save stress test results
    stress_df = pd.DataFrame(stress_results)
    stress_df.to_csv(DATA_PROCESSED / "stress_test_results.csv", index=False)
    print(f"\n✅ Saved: {DATA_PROCESSED / 'stress_test_results.csv'}")
    
    # Create stress test visualization
    plot_stress_test(stress_results, baseline_pred)
    
    return stress_results


def plot_stress_test(stress_results, baseline):
    """Create stress test visualization."""
    fig, ax = plt.subplots(figsize=(12, 6))
    
    scenarios = [r['scenario'].split('(')[0].strip() for r in stress_results]
    yields = [r['yield'] for r in stress_results]
    changes = [r['pct_change'] for r in stress_results]
    
    colors = ['red' if c < 0 else 'green' for c in changes]
    
    bars = ax.barh(scenarios, yields, color=colors, alpha=0.7)
    ax.axvline(baseline, color='black', linestyle='--', linewidth=2, label=f'Baseline: {baseline:.2f}')
    
    # Add value labels
    for bar, change in zip(bars, changes):
        width = bar.get_width()
        ax.annotate(f'{width:.2f} ({change:+.1f}%)',
                    xy=(width, bar.get_y() + bar.get_height()/2),
                    xytext=(5, 0), textcoords='offset points',
                    ha='left', va='center', fontsize=10)
    
    ax.set_xlabel('Predicted Yield (ton/ha)', fontsize=12)
    ax.set_title('Stress Test: Model Response to Climate Extremes', fontsize=14)
    ax.legend()
    ax.grid(True, alpha=0.3, axis='x')
    
    plt.tight_layout()
    plt.savefig(MODELS_DIR / "stress_test_scenarios.png", dpi=150, bbox_inches='tight')
    print(f"✅ Saved plot: {MODELS_DIR / 'stress_test_scenarios.png'}")
    plt.close()


# ========================
# RETRAIN FINAL MODEL
# ========================
def retrain_final_model():
    """Retrain final production model with all upgraded features."""
    print("\n" + "=" * 80)
    print("🏆 RETRAINING FINAL PRODUCTION MODEL")
    print("=" * 80)
    
    df = load_data()
    
    # Use upgraded features
    feature_cols = [
        'rain_Feb_Mar', 'soil_Apr_Jun', 'temp_max_MayJun', 
        'days_over_33', 'radiation_JunSep', 'rain_OctDec',
        'humidity_Apr_Jun', 'SPI_MarJun',
        'radiation_JunSep_NASA', 'ENSO_MarJun', 'SPEI_MarJun'
    ]
    
    available_features = [f for f in feature_cols if f in df.columns]
    
    print(f"\n   Using {len(available_features)} features:")
    for f in available_features:
        print(f"      - {f}")
    
    X = df[available_features]
    y = df['yield_ton_ha']
    
    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train
    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,
        min_child_weight=2,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0
    )
    model.fit(X_scaled, y)
    
    # Evaluate on training data
    y_pred = model.predict(X_scaled)
    mape = np.mean(np.abs((y - y_pred) / y)) * 100
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    r2 = r2_score(y, y_pred)
    
    print(f"\n📊 Training Performance:")
    print(f"   MAPE: {mape:.2f}%")
    print(f"   RMSE: {rmse:.3f}")
    print(f"   R²: {r2:.4f}")
    
    # Save model
    with open(MODELS_DIR / "trained_model_upgraded.pkl", 'wb') as f:
        pickle.dump(model, f)
    
    with open(MODELS_DIR / "scaler_upgraded.pkl", 'wb') as f:
        pickle.dump(scaler, f)
    
    with open(MODELS_DIR / "feature_columns_upgraded.json", 'w') as f:
        json.dump(available_features, f)
    
    print(f"\n✅ Saved: trained_model_upgraded.pkl")
    print(f"✅ Saved: scaler_upgraded.pkl")
    print(f"✅ Saved: feature_columns_upgraded.json")
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': available_features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n📊 Feature Importance (Upgraded Model):")
    for i, row in importance.iterrows():
        print(f"   {row['feature']:<25}: {row['importance']:.4f}")
    
    importance.to_csv(DATA_PROCESSED / "feature_importance_upgraded.csv", index=False)
    
    return model, scaler


# ========================
# MAIN
# ========================
def main():
    """Main function."""
    print("=" * 80)
    print("🚀 RETRAIN & VALIDATE WITH UPGRADED FEATURES")
    print("=" * 80)
    
    # Step 1: Compare original vs upgraded
    results_orig, results_upg = compare_models()
    
    # Step 2: Stress test
    stress_results = stress_test()
    
    # Step 3: Retrain final model
    model, scaler = retrain_final_model()
    
    # Summary
    mape_orig = results_orig['pct_error'].mean()
    mape_upg = results_upg['pct_error'].mean()
    improvement = mape_orig - mape_upg
    
    print("\n" + "=" * 80)
    print("🏆 FINAL SUMMARY")
    print("=" * 80)
    print(f"\n   Original MAPE:  {mape_orig:.2f}%")
    print(f"   Upgraded MAPE:  {mape_upg:.2f}%")
    print(f"   Improvement:    {improvement:+.2f}%")
    
    if improvement > 0:
        print(f"\n   ✅ Upgraded features IMPROVED model performance!")
    else:
        print(f"\n   ⚠️ Upgraded features did not improve overall MAPE")
        print(f"   But may still help with specific years (2018, 2022)")
    
    print("\n" + "=" * 80)
    print("✅ MODEL UPGRADE COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    main()
