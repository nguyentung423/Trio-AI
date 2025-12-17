"""
walk_forward_backtest.py

Walk-Forward Backtest cho mô hình dự báo năng suất cà phê Đắk Lắk
Backtest 7 năm gần nhất, mỗi lần dự đoán 1 năm mà mô hình chưa từng thấy yield năm đó.

Quy trình Walk-Forward:
- Năm N: Train trên data < N, predict năm N
- Lặp lại cho 7 năm gần nhất
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from xgboost import XGBRegressor
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
BACKTEST_CSV = DATA_PROCESSED / "backtest_walk_forward.csv"
PLOT_ACTUAL_VS_PRED = MODELS_DIR / "wf_actual_vs_predicted.png"
PLOT_ERROR_PER_YEAR = MODELS_DIR / "wf_error_per_year.png"

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

# XGBoost hyperparameters
XGB_PARAMS = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'max_depth': 4,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'n_jobs': -1
}


def calculate_mape(y_true, y_pred):
    """Calculate Mean Absolute Percentage Error."""
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


def walk_forward_backtest():
    """
    Thực hiện Walk-Forward Backtest cho 7 năm gần nhất.
    """
    print("=" * 80)
    print("🔄 WALK-FORWARD BACKTEST - DỰ BÁO NĂNG SUẤT CÀ PHÊ ĐẮK LẮK")
    print("=" * 80)
    
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
    # 2. XÁC ĐỊNH 7 NĂM GẦN NHẤT
    # ===========================
    print("\n📅 Step 2: Identifying 7 most recent years for backtest...")
    
    all_years = sorted(df['year'].values)
    backtest_years = all_years[-7:]  # 7 năm cuối
    
    print(f"   ✅ Backtest years: {backtest_years}")
    print(f"   ✅ Training will use data from years < each backtest year")
    
    # ===========================
    # 3. WALK-FORWARD VALIDATION
    # ===========================
    print("\n🧠 Step 3: Performing Walk-Forward Validation...")
    print("-" * 80)
    
    results = []
    feature_importances = []
    
    for year_n in backtest_years:
        print(f"\n   📍 Backtesting Year {year_n}:")
        
        # Bước 1: Tạo training data (all years < N)
        train_mask = df['year'] < year_n
        df_train = df[train_mask].copy()
        
        X_train = df_train[FEATURE_COLUMNS]
        y_train = df_train['yield_ton_ha']
        
        print(f"      Train: {len(df_train)} years ({df_train['year'].min()}-{df_train['year'].max()})")
        
        # Bước 2: Tạo test data (only year N)
        test_mask = df['year'] == year_n
        df_test = df[test_mask].copy()
        
        X_test = df_test[FEATURE_COLUMNS]
        y_real = df_test['yield_ton_ha'].values[0]
        
        # Bước 3: Train model
        model = XGBRegressor(**XGB_PARAMS)
        model.fit(X_train, y_train)
        
        # Bước 4: Predict năm N
        y_pred = model.predict(X_test)[0]
        
        # Bước 5: Tính sai lệch
        error_pct = abs(y_pred - y_real) / y_real * 100
        
        print(f"      Actual: {y_real:.2f}, Predicted: {y_pred:.2f}, Error: {error_pct:.2f}%")
        
        # Bước 6: Lưu kết quả
        results.append({
            'year': year_n,
            'actual': y_real,
            'predicted': y_pred,
            'error_%': error_pct
        })
        
        # Lưu feature importance
        feature_importances.append({
            'year': year_n,
            **dict(zip(FEATURE_COLUMNS, model.feature_importances_))
        })
    
    print("-" * 80)
    
    # ===========================
    # 4. TẠO DATAFRAME KẾT QUẢ
    # ===========================
    print("\n📊 Step 4: Creating results DataFrame...")
    
    results_df = pd.DataFrame(results)
    
    # Tính metrics tổng hợp
    y_actual = results_df['actual'].values
    y_predicted = results_df['predicted'].values
    
    mae_7y = mean_absolute_error(y_actual, y_predicted)
    rmse_7y = np.sqrt(mean_squared_error(y_actual, y_predicted))
    mape_7y = calculate_mape(y_actual, y_predicted)
    
    # Lưu CSV
    results_df.to_csv(BACKTEST_CSV, index=False)
    print(f"   ✅ Saved: {BACKTEST_CSV}")
    
    # ===========================
    # 5. VẼ BIỂU ĐỒ
    # ===========================
    print("\n📈 Step 5: Creating plots...")
    
    # Biểu đồ 1: Actual vs Predicted
    plt.figure(figsize=(10, 6))
    plt.plot(results_df['year'], results_df['actual'], 'o-', 
             color='brown', linewidth=2, markersize=8, label='Actual')
    plt.plot(results_df['year'], results_df['predicted'], 's--', 
             color='blue', linewidth=2, markersize=8, label='Predicted')
    plt.fill_between(results_df['year'], 
                     results_df['predicted'] * 0.95, 
                     results_df['predicted'] * 1.05, 
                     alpha=0.2, color='blue', label='±5% band')
    plt.xlabel('Năm', fontsize=12)
    plt.ylabel('Năng suất (tấn/ha)', fontsize=12)
    plt.title('Walk-Forward Backtest: Actual vs Predicted (7 năm)', fontsize=14)
    plt.legend(loc='best')
    plt.grid(True, alpha=0.3)
    plt.xticks(results_df['year'])
    plt.tight_layout()
    plt.savefig(PLOT_ACTUAL_VS_PRED, dpi=150)
    plt.close()
    print(f"   ✅ Saved: {PLOT_ACTUAL_VS_PRED}")
    
    # Biểu đồ 2: Error (%) mỗi năm
    colors = ['green' if e < 5 else 'orange' if e < 10 else 'red' for e in results_df['error_%']]
    plt.figure(figsize=(10, 6))
    bars = plt.bar(results_df['year'], results_df['error_%'], color=colors, edgecolor='black')
    plt.axhline(y=mape_7y, color='red', linestyle='--', linewidth=2, label=f'MAPE = {mape_7y:.2f}%')
    plt.axhline(y=5, color='green', linestyle=':', linewidth=1.5, alpha=0.7, label='5% threshold')
    plt.xlabel('Năm', fontsize=12)
    plt.ylabel('Error (%)', fontsize=12)
    plt.title('Walk-Forward Backtest: Prediction Error per Year', fontsize=14)
    plt.legend(loc='best')
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(results_df['year'])
    # Thêm giá trị trên mỗi bar
    for bar, error in zip(bars, results_df['error_%']):
        plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, 
                 f'{error:.1f}%', ha='center', va='bottom', fontsize=10)
    plt.tight_layout()
    plt.savefig(PLOT_ERROR_PER_YEAR, dpi=150)
    plt.close()
    print(f"   ✅ Saved: {PLOT_ERROR_PER_YEAR}")
    
    # ===========================
    # 6. BÁO CÁO CUỐI CÙNG
    # ===========================
    print("\n" + "=" * 80)
    print("📋 BÁO CÁO WALK-FORWARD BACKTEST (7 NĂM)")
    print("=" * 80)
    
    # Bảng kết quả
    print("\n┌────────┬─────────┬───────────┬──────────┐")
    print("│  Year  │ Actual  │ Predicted │ Error %  │")
    print("├────────┼─────────┼───────────┼──────────┤")
    for _, row in results_df.iterrows():
        print(f"│  {int(row['year'])}  │  {row['actual']:.2f}   │   {row['predicted']:.2f}    │   {row['error_%']:.2f}%  │")
    print("└────────┴─────────┴───────────┴──────────┘")
    
    # Metrics tổng hợp
    print(f"\n📊 METRICS TỔNG HỢP (7 NĂM):")
    print(f"   ├── MAE:  {mae_7y:.4f} tấn/ha")
    print(f"   ├── RMSE: {rmse_7y:.4f} tấn/ha")
    print(f"   └── MAPE: {mape_7y:.2f}%")
    
    # Năm tốt nhất / kém nhất
    best_year = results_df.loc[results_df['error_%'].idxmin()]
    worst_year = results_df.loc[results_df['error_%'].idxmax()]
    
    print(f"\n🏆 NĂM DỰ BÁO TỐT NHẤT:")
    print(f"   └── {int(best_year['year'])}: Error = {best_year['error_%']:.2f}%")
    
    print(f"\n⚠️  NĂM DỰ BÁO KÉM NHẤT:")
    print(f"   └── {int(worst_year['year'])}: Error = {worst_year['error_%']:.2f}%")
    
    # Nhận xét tổng quan
    print(f"\n💡 NHẬN XÉT TỔNG QUAN:")
    if mape_7y < 5:
        print(f"   ✅ Mô hình có độ chính xác CAO (MAPE < 5%)")
        print(f"   ✅ Phù hợp cho dự báo năng suất cà phê thực tế")
    elif mape_7y < 10:
        print(f"   ⚠️  Mô hình có độ chính xác TRUNG BÌNH (5% < MAPE < 10%)")
        print(f"   ⚠️  Có thể cải thiện bằng thêm features hoặc tuning")
    else:
        print(f"   ❌ Mô hình có độ chính xác THẤP (MAPE > 10%)")
        print(f"   ❌ Cần xem xét lại features và mô hình")
    
    # Phân tích thêm
    years_under_5pct = len(results_df[results_df['error_%'] < 5])
    print(f"\n   📈 Số năm có error < 5%: {years_under_5pct}/7")
    print(f"   📈 Error trung bình: {results_df['error_%'].mean():.2f}%")
    print(f"   📈 Error cao nhất: {results_df['error_%'].max():.2f}%")
    print(f"   📈 Error thấp nhất: {results_df['error_%'].min():.2f}%")
    
    # Feature importance trung bình
    print(f"\n🔝 FEATURE IMPORTANCE (TRUNG BÌNH 7 NĂM):")
    fi_df = pd.DataFrame(feature_importances)
    mean_importance = fi_df[FEATURE_COLUMNS].mean().sort_values(ascending=False)
    for i, (feat, imp) in enumerate(mean_importance.items(), 1):
        print(f"   {i}. {feat}: {imp:.4f}")
    
    # Files đã lưu
    print(f"\n📁 FILES ĐÃ LƯU:")
    print(f"   ├── {BACKTEST_CSV}")
    print(f"   ├── {PLOT_ACTUAL_VS_PRED}")
    print(f"   └── {PLOT_ERROR_PER_YEAR}")
    
    print("\n" + "=" * 80)
    print("✅ WALK-FORWARD BACKTEST COMPLETE — MODEL VALIDATED FOR 7 YEARS.")
    print("=" * 80)
    
    return {
        'results': results_df,
        'mae': mae_7y,
        'rmse': rmse_7y,
        'mape': mape_7y,
        'best_year': int(best_year['year']),
        'worst_year': int(worst_year['year'])
    }


if __name__ == "__main__":
    result = walk_forward_backtest()
