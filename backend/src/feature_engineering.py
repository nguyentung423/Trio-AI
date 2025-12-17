"""
feature_engineering.py

Module tạo features cho model ML dự báo năng suất cà phê Robusta Đắk Lắk.

Features được thiết kế dựa trên kiến thức domain về sinh học cà phê Robusta:
- Giai đoạn ra hoa (T2-3): cần mưa kích hoa
- Giai đoạn quả non (T4-6): cần soil moisture ổn định
- Stress nhiệt (T5-6): nhiệt độ cao gây stress
- Tích lũy quả (T6-9): cần bức xạ tốt
- Chín (T10-12): mưa nhiều ảnh hưởng chất lượng
- Hạn (T3-6): SPI đánh giá mức độ hạn

Output: features_yearly.csv với các features theo năm
"""

import os
import pandas as pd
import numpy as np
from scipy import stats
from pathlib import Path

# ========================
# CẤU HÌNH ĐƯỜNG DẪN
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_EXTERNAL = BASE_DIR / "data" / "external"
DATA_PROCESSED = BASE_DIR / "data" / "processed"

# File input/output
WEATHER_DAILY_FILE = DATA_EXTERNAL / "weather_daklak_1990_2025.csv"
WEATHER_MONTHLY_FILE = DATA_PROCESSED / "weather_monthly.csv"
FEATURES_OUTPUT_FILE = DATA_PROCESSED / "features_yearly.csv"


def load_daily_data(filepath: Path) -> pd.DataFrame:
    """
    Load dữ liệu thời tiết hàng ngày.
    """
    print(f"📂 Loading daily data từ: {filepath}")
    df = pd.read_csv(filepath, parse_dates=["date"])
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    print(f"   ✅ Loaded {len(df):,} dòng ({df['year'].min()}-{df['year'].max()})")
    return df


def load_monthly_data(filepath: Path) -> pd.DataFrame:
    """
    Load dữ liệu thời tiết hàng tháng (đã aggregate).
    """
    print(f"📂 Loading monthly data từ: {filepath}")
    df = pd.read_csv(filepath)
    print(f"   ✅ Loaded {len(df)} dòng")
    return df


# ============================================================
# FEATURE FUNCTIONS - DỰA TRÊN SINH HỌC CÀ PHÊ ROBUSTA
# ============================================================

def calc_rain_feb_mar(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🌸 Giai đoạn RA HOA (T2-3): Tổng lượng mưa kích thích ra hoa.
    
    Mưa đầu mùa (Feb-Mar) giúp cà phê ra hoa đồng loạt.
    Thiếu mưa → ra hoa không đều → năng suất giảm.
    """
    print("   🌸 Tính rain_Feb_Mar (mưa kích hoa)...")
    
    mask = daily["month"].isin([2, 3])
    result = daily[mask].groupby("year")["rain"].sum().reset_index()
    result.columns = ["year", "rain_Feb_Mar"]
    
    return result


def calc_soil_apr_jun(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🌱 Giai đoạn QUẢ NON (T4-6): Độ ẩm đất trung bình.
    
    Quả non cần nước ổn định để phát triển.
    Soil moisture thấp → quả rụng, năng suất giảm.
    """
    print("   🌱 Tính soil_Apr_Jun (độ ẩm đất giai đoạn quả non)...")
    
    mask = daily["month"].isin([4, 5, 6])
    result = daily[mask].groupby("year")["soil_0_7"].mean().reset_index()
    result.columns = ["year", "soil_Apr_Jun"]
    
    return result


def calc_temp_max_may_jun(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🔥 Giai đoạn STRESS NHIỆT (T5-6): Nhiệt độ max trung bình.
    
    Nhiệt độ cao (>33°C) gây stress cho cây, ảnh hưởng quang hợp.
    """
    print("   🔥 Tính temp_max_MayJun (stress nhiệt)...")
    
    mask = daily["month"].isin([5, 6])
    result = daily[mask].groupby("year")["temp_max"].mean().reset_index()
    result.columns = ["year", "temp_max_MayJun"]
    
    return result


def calc_days_over_33(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🔥 Số ngày nhiệt độ > 33°C trong tháng 5-6.
    
    Đếm số ngày stress nhiệt cực đoan.
    """
    print("   🔥 Tính days_over_33 (số ngày nóng cực đoan)...")
    
    mask = (daily["month"].isin([5, 6])) & (daily["temp_max"] > 33)
    result = daily[mask].groupby("year").size().reset_index()
    result.columns = ["year", "days_over_33"]
    
    # Đảm bảo có tất cả các năm (kể cả năm không có ngày nào > 33)
    all_years = daily["year"].unique()
    result = pd.DataFrame({"year": all_years}).merge(result, on="year", how="left")
    result["days_over_33"] = result["days_over_33"].fillna(0).astype(int)
    
    return result


def calc_radiation_jun_sep(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🌞 Giai đoạn TÍCH LŨY QUẢ (T6-9): Tổng bức xạ.
    
    Bức xạ mặt trời ảnh hưởng đến quang hợp và tích lũy chất khô.
    """
    print("   🌞 Tính radiation_JunSep (bức xạ tích lũy quả)...")
    
    mask = daily["month"].isin([6, 7, 8, 9])
    result = daily[mask].groupby("year")["radiation"].sum().reset_index()
    result.columns = ["year", "radiation_JunSep"]
    
    return result


def calc_temp_jun_sep(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🌡️ Nhiệt độ trung bình giai đoạn T6-9 (backup cho radiation).
    """
    print("   🌡️ Tính temp_JunSep (nhiệt độ tích lũy quả)...")
    
    mask = daily["month"].isin([6, 7, 8, 9])
    temp_avg = (daily["temp_max"] + daily["temp_min"]) / 2
    daily_temp = daily.copy()
    daily_temp["temp_avg"] = temp_avg
    
    result = daily_temp[mask].groupby("year")["temp_avg"].mean().reset_index()
    result.columns = ["year", "temp_JunSep"]
    
    return result


def calc_rain_oct_dec(daily: pd.DataFrame) -> pd.DataFrame:
    """
    🍒 Giai đoạn CHÍN (T10-12): Tổng lượng mưa.
    
    Mưa nhiều trong giai đoạn chín ảnh hưởng chất lượng hạt,
    gây khó khăn thu hoạch và phơi sấy.
    """
    print("   🍒 Tính rain_OctDec (mưa giai đoạn chín)...")
    
    mask = daily["month"].isin([10, 11, 12])
    result = daily[mask].groupby("year")["rain"].sum().reset_index()
    result.columns = ["year", "rain_OctDec"]
    
    return result


def calc_humidity_apr_jun(daily: pd.DataFrame) -> pd.DataFrame:
    """
    💧 Độ ẩm không khí trung bình T4-6.
    """
    print("   💧 Tính humidity_Apr_Jun...")
    
    mask = daily["month"].isin([4, 5, 6])
    result = daily[mask].groupby("year")["humidity"].mean().reset_index()
    result.columns = ["year", "humidity_Apr_Jun"]
    
    return result


def calc_spi(daily: pd.DataFrame, months: list = [3, 4, 5, 6]) -> pd.DataFrame:
    """
    🌵 Tính Standardized Precipitation Index (SPI) cho các tháng 3-6.
    
    SPI đánh giá mức độ hạn hán so với trung bình lịch sử:
    - SPI > 0: ẩm hơn bình thường
    - SPI < 0: khô hơn bình thường  
    - SPI < -1: hạn nhẹ
    - SPI < -1.5: hạn nặng
    - SPI < -2: hạn cực đoan
    
    Công thức: SPI = (P - μ) / σ
    với P = lượng mưa năm đó, μ = trung bình 30 năm, σ = độ lệch chuẩn
    """
    print("   🌵 Tính SPI_MarJun (chỉ số hạn)...")
    
    # Tính tổng mưa T3-6 mỗi năm
    mask = daily["month"].isin(months)
    yearly_rain = daily[mask].groupby("year")["rain"].sum().reset_index()
    yearly_rain.columns = ["year", "rain_MarJun"]
    
    # Tính SPI = (P - mean) / std
    mean_rain = yearly_rain["rain_MarJun"].mean()
    std_rain = yearly_rain["rain_MarJun"].std()
    
    yearly_rain["SPI_MarJun"] = (yearly_rain["rain_MarJun"] - mean_rain) / std_rain
    
    print(f"      Mean rain T3-6: {mean_rain:.1f} mm")
    print(f"      Std rain T3-6: {std_rain:.1f} mm")
    
    return yearly_rain[["year", "SPI_MarJun"]]


def calc_anomalies(features: pd.DataFrame, reference_years: tuple = (1990, 2020)) -> pd.DataFrame:
    """
    Tính anomaly (độ lệch so với trung bình 30 năm) cho các features.
    
    Anomaly giúp model nhận biết năm bất thường.
    """
    print("\n📊 Tính anomalies (so với TB 1990-2020)...")
    
    # Lọc dữ liệu reference period
    ref_mask = (features["year"] >= reference_years[0]) & (features["year"] <= reference_years[1])
    ref_data = features[ref_mask]
    
    # Các cột cần tính anomaly
    cols_to_anomaly = [
        "rain_Feb_Mar", "soil_Apr_Jun", "temp_max_MayJun", 
        "radiation_JunSep", "rain_OctDec"
    ]
    
    result = features.copy()
    
    for col in cols_to_anomaly:
        if col in result.columns:
            mean_val = ref_data[col].mean()
            std_val = ref_data[col].std()
            
            anomaly_col = f"{col}_anomaly"
            result[anomaly_col] = (result[col] - mean_val) / std_val
            
            print(f"   ✅ {anomaly_col}: mean={mean_val:.2f}, std={std_val:.2f}")
    
    return result


def create_yearly_features(daily: pd.DataFrame) -> pd.DataFrame:
    """
    Pipeline chính tạo tất cả features theo năm.
    
    Args:
        daily: DataFrame dữ liệu ngày
        
    Returns:
        DataFrame features theo năm
    """
    print("\n" + "=" * 60)
    print("🎯 TẠO FEATURES THEO NĂM - SINH HỌC CÀ PHÊ ROBUSTA")
    print("=" * 60)
    
    # Lấy danh sách tất cả các năm
    years = daily["year"].unique()
    features = pd.DataFrame({"year": sorted(years)})
    
    print(f"\n📅 Tạo features cho {len(years)} năm ({min(years)}-{max(years)})")
    
    # 1. Mưa kích hoa (T2-3)
    rain_feb_mar = calc_rain_feb_mar(daily)
    features = features.merge(rain_feb_mar, on="year", how="left")
    
    # 2. Soil moisture quả non (T4-6)
    soil_apr_jun = calc_soil_apr_jun(daily)
    features = features.merge(soil_apr_jun, on="year", how="left")
    
    # 3. Stress nhiệt (T5-6)
    temp_max_may_jun = calc_temp_max_may_jun(daily)
    features = features.merge(temp_max_may_jun, on="year", how="left")
    
    # 4. Số ngày nóng > 33°C
    days_hot = calc_days_over_33(daily)
    features = features.merge(days_hot, on="year", how="left")
    
    # 5. Bức xạ tích lũy quả (T6-9)
    radiation = calc_radiation_jun_sep(daily)
    features = features.merge(radiation, on="year", how="left")
    
    # 6. Nhiệt độ T6-9 (backup)
    temp_jun_sep = calc_temp_jun_sep(daily)
    features = features.merge(temp_jun_sep, on="year", how="left")
    
    # 7. Mưa giai đoạn chín (T10-12)
    rain_oct_dec = calc_rain_oct_dec(daily)
    features = features.merge(rain_oct_dec, on="year", how="left")
    
    # 8. Độ ẩm T4-6
    humidity = calc_humidity_apr_jun(daily)
    features = features.merge(humidity, on="year", how="left")
    
    # 9. SPI (chỉ số hạn T3-6)
    spi = calc_spi(daily)
    features = features.merge(spi, on="year", how="left")
    
    # 10. Tính anomalies
    features = calc_anomalies(features)
    
    return features


def validate_features(features: pd.DataFrame) -> None:
    """
    Kiểm tra tính hợp lệ của features.
    """
    print("\n🔍 KIỂM TRA FEATURES:")
    
    # Missing values
    missing = features.isnull().sum()
    total_missing = missing.sum()
    
    if total_missing == 0:
        print("   ✅ Không có missing values!")
    else:
        print(f"   ⚠️ Có {total_missing} missing values:")
        for col, count in missing.items():
            if count > 0:
                print(f"      - {col}: {count}")
    
    # Thống kê
    print("\n📊 THỐNG KÊ FEATURES:")
    print(features.describe().round(2).to_string())


def save_features(features: pd.DataFrame, filepath: Path) -> None:
    """
    Lưu features ra file CSV.
    """
    filepath.parent.mkdir(parents=True, exist_ok=True)
    features.to_csv(filepath, index=False)
    
    size_kb = filepath.stat().st_size / 1024
    print(f"\n💾 Đã lưu features: {filepath}")
    print(f"   - Số năm: {len(features)}")
    print(f"   - Số features: {len(features.columns) - 1}")  # Trừ cột year
    print(f"   - Kích thước: {size_kb:.2f} KB")


def run_feature_engineering():
    """
    Pipeline chính cho feature engineering.
    """
    print("=" * 60)
    print("🔧 FEATURE ENGINEERING - CÀ PHÊ ROBUSTA ĐẮK LẮK")
    print("=" * 60)
    
    # 1. Load dữ liệu
    daily = load_daily_data(WEATHER_DAILY_FILE)
    
    # 2. Tạo features
    features = create_yearly_features(daily)
    
    # 3. Validate
    validate_features(features)
    
    # 4. Lưu file
    save_features(features, FEATURES_OUTPUT_FILE)
    
    print("\n" + "=" * 60)
    print("✅ FEATURE ENGINEERING HOÀN TẤT — DỮ LIỆU SẴN SÀNG ĐỂ TRAIN MODEL.")
    print("=" * 60)
    
    return features


def main():
    """Entry point."""
    features = run_feature_engineering()
    
    # Preview
    print("\n📋 PREVIEW FEATURES:")
    print(features.head(10).to_string())
    
    return features


if __name__ == "__main__":
    main()
