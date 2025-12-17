"""
preprocess.py

Module xử lý và làm sạch dữ liệu thời tiết 30 năm cho dự án dự báo năng suất cà phê Đắk Lắk.

Chức năng:
- Đọc dữ liệu thô từ data/external/
- Tạo các cột year, month
- Gom dữ liệu theo năm-tháng
- Xử lý missing values
- Lưu vào data/processed/weather_monthly.csv
"""

import os
import pandas as pd
import numpy as np
from pathlib import Path

# ========================
# CẤU HÌNH ĐƯỜNG DẪN
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_EXTERNAL = BASE_DIR / "data" / "external"
DATA_PROCESSED = BASE_DIR / "data" / "processed"

# File input/output
INPUT_FILE = DATA_EXTERNAL / "weather_daklak_1990_2025.csv"
OUTPUT_FILE = DATA_PROCESSED / "weather_monthly.csv"


def load_weather_data(filepath: Path) -> pd.DataFrame:
    """
    Load dữ liệu thời tiết từ file CSV.
    
    Args:
        filepath: Đường dẫn đến file CSV
        
    Returns:
        DataFrame với cột date đã parse
    """
    print(f"📂 Đang load dữ liệu từ: {filepath}")
    
    df = pd.read_csv(filepath, parse_dates=["date"])
    
    print(f"   ✅ Loaded {len(df):,} dòng")
    print(f"   📅 Khoảng thời gian: {df['date'].min().date()} → {df['date'].max().date()}")
    
    return df


def add_time_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Thêm các cột year, month, day từ cột date.
    
    Args:
        df: DataFrame có cột date
        
    Returns:
        DataFrame với các cột thời gian mới
    """
    print("\n🕐 Tạo các cột thời gian...")
    
    df = df.copy()
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    
    print(f"   ✅ Đã tạo cột: year, month, day")
    print(f"   📅 Số năm: {df['year'].nunique()} ({df['year'].min()} - {df['year'].max()})")
    
    return df


def aggregate_monthly(df: pd.DataFrame) -> pd.DataFrame:
    """
    Gom dữ liệu theo năm-tháng.
    
    Tạo bảng với các cột:
    - year, month
    - temp_max_mean, temp_min_mean
    - rain_sum
    - humidity_mean
    - radiation_sum
    - soil_0_7_mean, soil_7_28_mean
    
    Args:
        df: DataFrame dữ liệu ngày
        
    Returns:
        DataFrame dữ liệu tháng
    """
    print("\n📊 Gom dữ liệu theo năm-tháng...")
    
    monthly = df.groupby(["year", "month"]).agg({
        "temp_max": "mean",
        "temp_min": "mean",
        "rain": "sum",
        "humidity": "mean",
        "radiation": "sum",
        "soil_0_7": "mean",
        "soil_7_28": "mean"
    }).reset_index()
    
    # Đổi tên cột cho rõ ràng
    monthly = monthly.rename(columns={
        "temp_max": "temp_max_mean",
        "temp_min": "temp_min_mean",
        "rain": "rain_sum",
        "humidity": "humidity_mean",
        "radiation": "radiation_sum",
        "soil_0_7": "soil_0_7_mean",
        "soil_7_28": "soil_7_28_mean"
    })
    
    print(f"   ✅ Tạo được {len(monthly)} dòng (năm-tháng)")
    print(f"   📋 Các cột: {list(monthly.columns)}")
    
    return monthly


def check_missing_values(df: pd.DataFrame, name: str = "DataFrame") -> None:
    """
    Kiểm tra và báo cáo missing values.
    
    Args:
        df: DataFrame cần kiểm tra
        name: Tên để hiển thị
    """
    print(f"\n🔍 Kiểm tra missing values trong {name}:")
    
    missing = df.isnull().sum()
    total_missing = missing.sum()
    
    if total_missing == 0:
        print("   ✅ Không có missing values!")
    else:
        print(f"   ⚠️ Tổng missing: {total_missing}")
        for col, count in missing.items():
            if count > 0:
                pct = (count / len(df)) * 100
                print(f"      - {col}: {count} ({pct:.2f}%)")


def save_processed_data(df: pd.DataFrame, filepath: Path) -> None:
    """
    Lưu DataFrame đã xử lý ra file CSV.
    
    Args:
        df: DataFrame cần lưu
        filepath: Đường dẫn output
    """
    # Tạo thư mục nếu chưa tồn tại
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    df.to_csv(filepath, index=False)
    
    size_kb = filepath.stat().st_size / 1024
    print(f"\n💾 Đã lưu file: {filepath}")
    print(f"   - Số dòng: {len(df)}")
    print(f"   - Kích thước: {size_kb:.2f} KB")


def preprocess_weather_data():
    """
    Pipeline chính để preprocess dữ liệu thời tiết.
    
    Returns:
        Tuple (daily_df, monthly_df)
    """
    print("=" * 60)
    print("🔧 PREPROCESS DỮ LIỆU THỜI TIẾT ĐẮK LẮK")
    print("=" * 60)
    
    # 1. Load dữ liệu
    df = load_weather_data(INPUT_FILE)
    
    # 2. Thêm cột thời gian
    df = add_time_columns(df)
    
    # 3. Kiểm tra missing values
    check_missing_values(df, "dữ liệu ngày")
    
    # 4. Gom theo tháng
    monthly = aggregate_monthly(df)
    
    # 5. Kiểm tra missing values sau aggregate
    check_missing_values(monthly, "dữ liệu tháng")
    
    # 6. Lưu file
    save_processed_data(monthly, OUTPUT_FILE)
    
    print("\n" + "=" * 60)
    print("✅ PREPROCESS HOÀN TẤT")
    print("=" * 60)
    
    return df, monthly


def main():
    """Entry point."""
    daily, monthly = preprocess_weather_data()
    
    # Preview
    print("\n📋 PREVIEW DỮ LIỆU THÁNG:")
    print(monthly.head(12).to_string())
    
    return daily, monthly


if __name__ == "__main__":
    main()
