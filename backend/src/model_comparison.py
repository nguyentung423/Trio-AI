"""
model_comparison.py

So sánh CatBoostRegressor vs XGBoostRegressor bằng Walk-Forward Validation
cho dự báo năng suất cà phê Robusta tỉnh Đắk Lắk.

NGUYÊN TẮC FAIR COMPARISON:
- Cùng dữ liệu, cùng features
- Cùng pipeline walk-forward
- Cùng metrics đánh giá
- Không tuning quá mức
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

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
COMPARISON_CSV = DATA_PROCESSED / "model_comparison_walkforward.csv"
PLOT_ACTUAL_VS_PRED = MODELS_DIR / "compare_actual_vs_pred.png"
PLOT_ERROR_PER_YEAR = MODELS_DIR / "compare_error_per_year.png"

# Features to use
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

# ========================
# MODEL CONFIGURATIONS (FIXED - NO TUNING)
# ========================
XGB_PARAMS = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'max_depth': 4,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'n_jobs': -1
}

CAT_PARAMS = {
    'iterations': 500,
    'learning_rate': 0.05,
    'depth': 4,
    'loss_function': 'RMSE',
    'verbose': False,
    'random_seed': 42
}


def calculate_mape(y_true, y_pred):
    """Calculate Mean Absolute Percentage Error."""
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


def run_model_comparison():
    """
    So sánh XGBoost vs CatBoost bằng Walk-Forward Validation.
    """
    print("=" * 85)
    print("🔬 MODEL COMPARISON: XGBOOST vs CATBOOST (WALK-FORWARD VALIDATION)")
    print("=" * 85)
    
    # ===========================
    # 1. LOAD DATA
    # ===========================
    print("\n📂 Step 1: Loading data...")
    
    features_df = pd.read_csv(FEATURES_FILE)
    yield_df = pd.read_csv(YIELD_FILE)
    
    # Merge features with yield
    df = features_df.merge(yield_df[['year', 'yield_ton_ha']], on='year', how='inner')
    df = df.sort_values('year').reset_index(drop=True)
    
    print(f"   Total years with yield data: {len(df)}")
    print(f"   Years available: {list(df['year'].values)}")
    
    # ===========================
    # 2. XÁC ĐỊNH 7 NĂM BACKTEST
    # ===========================
    print("\n📅 Step 2: Identifying 7 most recent years for backtest...")
    
    all_years = sorted(df['year'].values)
    backtest_years = all_years[-7:]  # 7 năm cuối
    
    print(f"   ✅ Backtest years: {backtest_years}")
    
    # ===========================
    # 3. WALK-FORWARD VALIDATION
    # ===========================
    print("\n🧠 Step 3: Performing Walk-Forward Validation for both models...")
    print("-" * 85)
    
    results = []
    
    for year_n in backtest_years:
        print(f"\n   📍 Year {year_n}:")
        
        # Tạo train/test split (SAME for both models)
        train_mask = df['year'] < year_n
        df_train = df[train_mask].copy()
        
        X_train = df_train[FEATURE_COLUMNS]
        y_train = df_train['yield_ton_ha']
        
        test_mask = df['year'] == year_n
        df_test = df[test_mask].copy()
        
        X_test = df_test[FEATURE_COLUMNS]
        y_actual = df_test['yield_ton_ha'].values[0]
        
        print(f"      Train: {len(df_train)} years ({df_train['year'].min()}-{df_train['year'].max()})")
        
        # ---- XGBoost ----
        xgb_model = XGBRegressor(**XGB_PARAMS)
        xgb_model.fit(X_train, y_train)
        xgb_pred = xgb_model.predict(X_test)[0]
        xgb_error = abs(xgb_pred - y_actual) / y_actual * 100
        
        # ---- CatBoost ----
        cat_model = CatBoostRegressor(**CAT_PARAMS)
        cat_model.fit(X_train, y_train)
        cat_pred = cat_model.predict(X_test)[0]
        cat_error = abs(cat_pred - y_actual) / y_actual * 100
        
        print(f"      Actual: {y_actual:.2f}")
        print(f"      XGBoost:  Pred={xgb_pred:.2f}, Error={xgb_error:.2f}%")
        print(f"      CatBoost: Pred={cat_pred:.2f}, Error={cat_error:.2f}%")
        
        results.append({
            'Year': year_n,
            'Actual': y_actual,
            'XGB_Pred': xgb_pred,
            'XGB_Error%': xgb_error,
            'CAT_Pred': cat_pred,
            'CAT_Error%': cat_error
        })
    
    print("-" * 85)
    
    # ===========================
    # 4. TẠO DATAFRAME KẾT QUẢ
    # ===========================
    print("\n📊 Step 4: Creating results DataFrame...")
    
    results_df = pd.DataFrame(results)
    
    # Tính metrics cho từng model
    y_actual = results_df['Actual'].values
    
    # XGBoost metrics
    xgb_preds = results_df['XGB_Pred'].values
    xgb_mae = mean_absolute_error(y_actual, xgb_preds)
    xgb_rmse = np.sqrt(mean_squared_error(y_actual, xgb_preds))
    xgb_mape = calculate_mape(y_actual, xgb_preds)
    xgb_max_error = results_df['XGB_Error%'].max()
    xgb_std_error = results_df['XGB_Error%'].std()
    xgb_years_over_10 = len(results_df[results_df['XGB_Error%'] > 10])
    
    # CatBoost metrics
    cat_preds = results_df['CAT_Pred'].values
    cat_mae = mean_absolute_error(y_actual, cat_preds)
    cat_rmse = np.sqrt(mean_squared_error(y_actual, cat_preds))
    cat_mape = calculate_mape(y_actual, cat_preds)
    cat_max_error = results_df['CAT_Error%'].max()
    cat_std_error = results_df['CAT_Error%'].std()
    cat_years_over_10 = len(results_df[results_df['CAT_Error%'] > 10])
    
    # Lưu CSV
    results_df.to_csv(COMPARISON_CSV, index=False)
    print(f"   ✅ Saved: {COMPARISON_CSV}")
    
    # ===========================
    # 5. VẼ BIỂU ĐỒ
    # ===========================
    print("\n📈 Step 5: Creating comparison plots...")
    
    # Biểu đồ 1: Actual vs Predicted (XGB vs CAT)
    plt.figure(figsize=(12, 6))
    plt.plot(results_df['Year'], results_df['Actual'], 'o-', 
             color='black', linewidth=2.5, markersize=10, label='Actual', zorder=3)
    plt.plot(results_df['Year'], results_df['XGB_Pred'], 's--', 
             color='blue', linewidth=2, markersize=8, label='XGBoost')
    plt.plot(results_df['Year'], results_df['CAT_Pred'], '^--', 
             color='green', linewidth=2, markersize=8, label='CatBoost')
    plt.xlabel('Năm', fontsize=12)
    plt.ylabel('Năng suất (tấn/ha)', fontsize=12)
    plt.title('Walk-Forward Validation: Actual vs Predicted (XGBoost vs CatBoost)', fontsize=14)
    plt.legend(loc='best', fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.xticks(results_df['Year'])
    plt.tight_layout()
    plt.savefig(PLOT_ACTUAL_VS_PRED, dpi=150)
    plt.close()
    print(f"   ✅ Saved: {PLOT_ACTUAL_VS_PRED}")
    
    # Biểu đồ 2: Error (%) per year - Grouped Bar Chart
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(results_df['Year']))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, results_df['XGB_Error%'], width, label='XGBoost', color='blue', alpha=0.8)
    bars2 = ax.bar(x + width/2, results_df['CAT_Error%'], width, label='CatBoost', color='green', alpha=0.8)
    
    ax.axhline(y=xgb_mape, color='blue', linestyle='--', linewidth=1.5, alpha=0.7, label=f'XGB MAPE={xgb_mape:.2f}%')
    ax.axhline(y=cat_mape, color='green', linestyle='--', linewidth=1.5, alpha=0.7, label=f'CAT MAPE={cat_mape:.2f}%')
    ax.axhline(y=10, color='red', linestyle=':', linewidth=2, alpha=0.5, label='10% threshold')
    
    ax.set_xlabel('Năm', fontsize=12)
    ax.set_ylabel('Error (%)', fontsize=12)
    ax.set_title('Walk-Forward Validation: Error Comparison per Year', fontsize=14)
    ax.set_xticks(x)
    ax.set_xticklabels(results_df['Year'])
    ax.legend(loc='upper right', fontsize=10)
    ax.grid(True, alpha=0.3, axis='y')
    
    # Thêm giá trị trên bars
    for bar in bars1:
        height = bar.get_height()
        ax.annotate(f'{height:.1f}%', xy=(bar.get_x() + bar.get_width()/2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)
    for bar in bars2:
        height = bar.get_height()
        ax.annotate(f'{height:.1f}%', xy=(bar.get_x() + bar.get_width()/2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)
    
    plt.tight_layout()
    plt.savefig(PLOT_ERROR_PER_YEAR, dpi=150)
    plt.close()
    print(f"   ✅ Saved: {PLOT_ERROR_PER_YEAR}")
    
    # ===========================
    # 6. BÁO CÁO KẾT QUẢ
    # ===========================
    print("\n" + "=" * 85)
    print("📋 BÁO CÁO SO SÁNH MÔ HÌNH (WALK-FORWARD 7 NĂM)")
    print("=" * 85)
    
    # Bảng kết quả chi tiết
    print("\n┌────────┬─────────┬───────────┬───────────┬───────────┬───────────┐")
    print("│  Year  │ Actual  │ XGB_Pred  │ XGB_Err%  │ CAT_Pred  │ CAT_Err%  │")
    print("├────────┼─────────┼───────────┼───────────┼───────────┼───────────┤")
    for _, row in results_df.iterrows():
        xgb_better = "✓" if row['XGB_Error%'] < row['CAT_Error%'] else ""
        cat_better = "✓" if row['CAT_Error%'] < row['XGB_Error%'] else ""
        print(f"│  {int(row['Year'])}  │  {row['Actual']:.2f}   │   {row['XGB_Pred']:.2f}    │  {row['XGB_Error%']:>5.2f}% {xgb_better:<1} │   {row['CAT_Pred']:.2f}    │  {row['CAT_Error%']:>5.2f}% {cat_better:<1} │")
    print("└────────┴─────────┴───────────┴───────────┴───────────┴───────────┘")
    
    # Bảng metrics tổng hợp
    print("\n" + "=" * 85)
    print("📊 METRICS TỔNG HỢP (7 NĂM)")
    print("=" * 85)
    print(f"""
    ┌─────────────────────────┬────────────────┬────────────────┐
    │        Metric           │    XGBoost     │    CatBoost    │
    ├─────────────────────────┼────────────────┼────────────────┤
    │  MAE (tấn/ha)           │     {xgb_mae:.4f}      │     {cat_mae:.4f}      │
    │  RMSE (tấn/ha)          │     {xgb_rmse:.4f}      │     {cat_rmse:.4f}      │
    │  MAPE (%)               │     {xgb_mape:.2f}%      │     {cat_mape:.2f}%      │
    │  Max Error (%)          │     {xgb_max_error:.2f}%      │     {cat_max_error:.2f}%      │
    │  Std(Error %)           │     {xgb_std_error:.2f}%       │     {cat_std_error:.2f}%       │
    │  Số năm Error > 10%     │       {xgb_years_over_10}          │       {cat_years_over_10}          │
    └─────────────────────────┴────────────────┴────────────────┘
    """)
    
    # ===========================
    # 7. PHÂN TÍCH KẾT QUẢ
    # ===========================
    print("=" * 85)
    print("🧠 PHÂN TÍCH KẾT QUẢ CHI TIẾT")
    print("=" * 85)
    
    # 1. MAPE comparison
    print("\n1️⃣  MODEL NÀO CÓ MAPE THẤP HƠN?")
    if cat_mape < xgb_mape:
        mape_winner = "CatBoost"
        mape_diff = xgb_mape - cat_mape
        print(f"   ✅ CatBoost có MAPE thấp hơn: {cat_mape:.2f}% vs {xgb_mape:.2f}% (chênh lệch {mape_diff:.2f}%)")
    else:
        mape_winner = "XGBoost"
        mape_diff = cat_mape - xgb_mape
        print(f"   ✅ XGBoost có MAPE thấp hơn: {xgb_mape:.2f}% vs {cat_mape:.2f}% (chênh lệch {mape_diff:.2f}%)")
    
    # 2. Stability comparison
    print("\n2️⃣  MODEL NÀO ỔN ĐỊNH HƠN (STD ERROR THẤP)?")
    if cat_std_error < xgb_std_error:
        stability_winner = "CatBoost"
        print(f"   ✅ CatBoost ổn định hơn: Std={cat_std_error:.2f}% vs {xgb_std_error:.2f}%")
    else:
        stability_winner = "XGBoost"
        print(f"   ✅ XGBoost ổn định hơn: Std={xgb_std_error:.2f}% vs {cat_std_error:.2f}%")
    
    # 3. Difficult years (2018, 2022)
    print("\n3️⃣  MODEL NÀO XỬ LÝ TỐT HƠN CÁC NĂM KHÓ (2018, 2022)?")
    difficult_years = [2018, 2022]
    for year in difficult_years:
        row = results_df[results_df['Year'] == year].iloc[0]
        if row['CAT_Error%'] < row['XGB_Error%']:
            print(f"   • Năm {year}: CatBoost tốt hơn ({row['CAT_Error%']:.2f}% vs {row['XGB_Error%']:.2f}%)")
        else:
            print(f"   • Năm {year}: XGBoost tốt hơn ({row['XGB_Error%']:.2f}% vs {row['CAT_Error%']:.2f}%)")
    
    # Count wins for difficult years
    cat_wins_difficult = sum(1 for year in difficult_years 
                              if results_df[results_df['Year'] == year]['CAT_Error%'].values[0] < 
                                 results_df[results_df['Year'] == year]['XGB_Error%'].values[0])
    if cat_wins_difficult > len(difficult_years) / 2:
        difficult_winner = "CatBoost"
        print(f"   ✅ CatBoost xử lý tốt hơn các năm khó ({cat_wins_difficult}/{len(difficult_years)} năm)")
    else:
        difficult_winner = "XGBoost"
        print(f"   ✅ XGBoost xử lý tốt hơn các năm khó ({len(difficult_years) - cat_wins_difficult}/{len(difficult_years)} năm)")
    
    # 4. Overfit check
    print("\n4️⃣  CÓ HIỆN TƯỢNG OVERFIT KHÔNG?")
    # Check if error increases significantly when training data is small
    early_years_xgb = results_df[results_df['Year'] <= 2019]['XGB_Error%'].mean()
    late_years_xgb = results_df[results_df['Year'] >= 2022]['XGB_Error%'].mean()
    early_years_cat = results_df[results_df['Year'] <= 2019]['CAT_Error%'].mean()
    late_years_cat = results_df[results_df['Year'] >= 2022]['CAT_Error%'].mean()
    
    print(f"   • XGBoost: Early years (2018-2019) avg error = {early_years_xgb:.2f}%, Late years (2022-2024) avg = {late_years_xgb:.2f}%")
    print(f"   • CatBoost: Early years (2018-2019) avg error = {early_years_cat:.2f}%, Late years (2022-2024) avg = {late_years_cat:.2f}%")
    
    if early_years_xgb > late_years_xgb * 1.5:
        print(f"   ⚠️  XGBoost có dấu hiệu underfitting khi ít dữ liệu training")
    else:
        print(f"   ✅ XGBoost không có dấu hiệu overfit rõ ràng")
    
    if early_years_cat > late_years_cat * 1.5:
        print(f"   ⚠️  CatBoost có dấu hiệu underfitting khi ít dữ liệu training")
    else:
        print(f"   ✅ CatBoost không có dấu hiệu overfit rõ ràng")
    
    # 5. Overall winner determination
    print("\n5️⃣  KẾT LUẬN KHOA HỌC")
    
    # Scoring system
    xgb_score = 0
    cat_score = 0
    
    # MAPE (weight: 3)
    if xgb_mape < cat_mape:
        xgb_score += 3
    else:
        cat_score += 3
    
    # Stability (weight: 2)
    if xgb_std_error < cat_std_error:
        xgb_score += 2
    else:
        cat_score += 2
    
    # Max error (weight: 1)
    if xgb_max_error < cat_max_error:
        xgb_score += 1
    else:
        cat_score += 1
    
    # Years over 10% (weight: 2)
    if xgb_years_over_10 < cat_years_over_10:
        xgb_score += 2
    elif cat_years_over_10 < xgb_years_over_10:
        cat_score += 2
    
    print(f"   📊 Điểm tổng hợp: XGBoost = {xgb_score}, CatBoost = {cat_score}")
    
    if cat_score > xgb_score:
        winner = "CatBoost"
        loser = "XGBoost"
    elif xgb_score > cat_score:
        winner = "XGBoost"
        loser = "CatBoost"
    else:
        winner = "Cả hai" if cat_mape < xgb_mape else "XGBoost"
        loser = ""
    
    # ===========================
    # 8. KẾT LUẬN CUỐI CÙNG
    # ===========================
    print("\n" + "=" * 85)
    print("🏆 KẾT LUẬN CUỐI CÙNG")
    print("=" * 85)
    
    if winner == "CatBoost":
        conclusion = f"""
    ✅ CatBoost cho kết quả tổng quát TỐT HƠN trong bài toán dự báo năng suất 
       cà phê Đắk Lắk, với:
       • MAPE thấp hơn: {cat_mape:.2f}% vs {xgb_mape:.2f}%
       • Độ ổn định: Std(Error) = {cat_std_error:.2f}%
       • Số năm error > 10%: {cat_years_over_10}
       
    📌 CatBoost được KHUYẾN NGHỊ cho các phân tích và dự báo tiếp theo.
        """
    else:
        conclusion = f"""
    ✅ XGBoost cho kết quả tổng quát TỐT HƠN trong bài toán dự báo năng suất 
       cà phê Đắk Lắk, với:
       • MAPE thấp hơn: {xgb_mape:.2f}% vs {cat_mape:.2f}%
       • Độ ổn định: Std(Error) = {xgb_std_error:.2f}%
       • Số năm error > 10%: {xgb_years_over_10}
       
    📌 XGBoost được KHUYẾN NGHỊ cho các phân tích và dự báo tiếp theo.
        """
    
    print(conclusion)
    
    # Files saved
    print(f"\n📁 FILES ĐÃ LƯU:")
    print(f"   ├── {COMPARISON_CSV}")
    print(f"   ├── {PLOT_ACTUAL_VS_PRED}")
    print(f"   └── {PLOT_ERROR_PER_YEAR}")
    
    print("\n" + "=" * 85)
    print("✅ MODEL COMPARISON COMPLETE — CATBOOST vs XGBOOST EVALUATED FAIRLY.")
    print("=" * 85)
    
    return {
        'results': results_df,
        'xgb_metrics': {'mae': xgb_mae, 'rmse': xgb_rmse, 'mape': xgb_mape, 
                        'max_error': xgb_max_error, 'std_error': xgb_std_error},
        'cat_metrics': {'mae': cat_mae, 'rmse': cat_rmse, 'mape': cat_mape,
                        'max_error': cat_max_error, 'std_error': cat_std_error},
        'winner': winner
    }


if __name__ == "__main__":
    result = run_model_comparison()
