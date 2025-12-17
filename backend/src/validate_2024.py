"""
validate_2024.py

Kiểm tra mô hình bằng cách dự đoán năng suất cà phê năm 2024
MÔ HÌNH KHÔNG ĐƯỢC NHÌN THẤY YIELD 2024 TRONG TRAINING

Điều kiện:
- Train: features & yield 2015-2023 (9 năm)
- Test: features 2024 (chỉ features, không có yield)
- So sánh: yield predicted vs yield actual của 2024
"""

import numpy as np
import pandas as pd
from pathlib import Path
from xgboost import XGBRegressor

# ========================
# CẤU HÌNH ĐƯỜNG DẪN
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"

# Files
FEATURES_FILE = DATA_PROCESSED / "features_yearly.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# Features to use (same as train_model.py)
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


def validate_2024():
    """
    Validate model by predicting 2024 yield WITHOUT seeing 2024 yield during training.
    """
    print("=" * 70)
    print("🔬 VALIDATION: DỰ BÁO NĂNG SUẤT 2024 (MODEL KHÔNG NHÌN THẤY YIELD 2024)")
    print("=" * 70)
    
    # ===========================
    # 1. LOAD DATA
    # ===========================
    print("\n📂 Step 1: Loading data...")
    
    features_df = pd.read_csv(FEATURES_FILE)
    yield_df = pd.read_csv(YIELD_FILE)
    
    print(f"   Features: {len(features_df)} years ({features_df['year'].min()}-{features_df['year'].max()})")
    print(f"   Yield: {len(yield_df)} years ({yield_df['year'].min()}-{yield_df['year'].max()})")
    
    # Merge features with yield
    df = features_df.merge(yield_df[['year', 'yield_ton_ha']], on='year', how='inner')
    df = df.sort_values('year').reset_index(drop=True)
    
    print(f"   Merged data: {len(df)} years with both features and yield")
    print(f"   Years: {list(df['year'].values)}")
    
    # ===========================
    # 2. TÁCH RIÊNG DỮ LIỆU 2024
    # ===========================
    print("\n📊 Step 2: Separating 2024 data...")
    
    # Data for 2024 (TEST - model will NEVER see yield)
    df_2024 = df[df['year'] == 2024].copy()
    X_2024 = df_2024[FEATURE_COLUMNS]
    y_2024_real = df_2024['yield_ton_ha'].values[0]
    
    print(f"   ✅ X_2024 shape: {X_2024.shape}")
    print(f"   ✅ y_2024_real (chỉ dùng để so sánh SAU KHI dự đoán): {y_2024_real} tấn/ha")
    
    # ===========================
    # 3. TẠO TRAINING DATA (KHÔNG CÓ 2024)
    # ===========================
    print("\n🏋️ Step 3: Creating training data (EXCLUDING 2024)...")
    
    # Training data: all years EXCEPT 2024
    df_train = df[df['year'] != 2024].copy()
    X_train = df_train[FEATURE_COLUMNS]
    y_train = df_train['yield_ton_ha']
    
    print(f"   ✅ Training years: {list(df_train['year'].values)}")
    print(f"   ✅ X_train shape: {X_train.shape}")
    print(f"   ✅ y_train shape: {y_train.shape}")
    print(f"   ⚠️  2024 yield is NOT in training data!")
    
    # ===========================
    # 4. TRAIN MODEL
    # ===========================
    print("\n🚀 Step 4: Training XGBoost model (on 2015-2023 data only)...")
    
    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("   ✅ Model trained successfully!")
    
    # ===========================
    # 5. DỰ ĐOÁN NĂM 2024
    # ===========================
    print("\n🔮 Step 5: Predicting 2024 yield (model has NEVER seen 2024 yield)...")
    
    y_2024_pred = model.predict(X_2024)[0]
    print(f"   ✅ Predicted yield 2024: {y_2024_pred:.4f} tấn/ha")
    
    # ===========================
    # 6. SO SÁNH KẾT QUẢ
    # ===========================
    print("\n📈 Step 6: Comparing prediction with actual value...")
    
    # Calculate errors
    absolute_error = abs(y_2024_pred - y_2024_real)
    percentage_error = (absolute_error / y_2024_real) * 100
    
    # ===========================
    # 7. IN BÁO CÁO KẾT QUẢ
    # ===========================
    print("\n" + "=" * 70)
    print("📋 BÁO CÁO KẾT QUẢ DỰ BÁO NĂM 2024")
    print("=" * 70)
    
    print(f"""
    ┌─────────────────────────────────────────────────────────┐
    │  FORECAST VALIDATION REPORT - YEAR 2024                 │
    ├─────────────────────────────────────────────────────────┤
    │  Training Period:     2015 - 2023 (9 years)             │
    │  Test Year:           2024 (unseen during training)     │
    ├─────────────────────────────────────────────────────────┤
    │  Actual_2024:         {y_2024_real:.2f} tấn/ha                       │
    │  Predicted_2024:      {y_2024_pred:.2f} tấn/ha                       │
    ├─────────────────────────────────────────────────────────┤
    │  Sai lệch tuyệt đối:  {absolute_error:.4f} tấn/ha                    │
    │  Sai lệch %:          {percentage_error:.2f}%                           │
    └─────────────────────────────────────────────────────────┘
    """)
    
    # Feature importance for this model
    print("🔝 Top Features (từ model này):")
    feature_importance = dict(zip(FEATURE_COLUMNS, model.feature_importances_))
    sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    for i, (feat, imp) in enumerate(sorted_features[:5], 1):
        print(f"   {i}. {feat}: {imp:.4f}")
    
    # Features used for 2024 prediction
    print("\n📊 Features năm 2024 đã dùng để dự đoán:")
    for col in FEATURE_COLUMNS:
        print(f"   {col}: {X_2024[col].values[0]:.4f}")
    
    print("\n" + "=" * 70)
    print("✅ FORECAST 2024 COMPLETE — MODEL NEVER SAW 2024 DURING TRAINING.")
    print("=" * 70)
    
    return {
        'actual': y_2024_real,
        'predicted': y_2024_pred,
        'absolute_error': absolute_error,
        'percentage_error': percentage_error
    }


if __name__ == "__main__":
    result = validate_2024()
