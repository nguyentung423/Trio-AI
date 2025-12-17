"""
fetch_weather.py

Thu thập dữ liệu thời tiết 30 năm cho dự án dự báo năng suất cà phê Đắk Lắk.
Sử dụng Open-Meteo Archive API.

Chức năng:
- Kết nối Open-Meteo Archive API
- Lấy dữ liệu nhiệt độ, lượng mưa, độ ẩm, soil moisture theo ngày
- Lưu vào thư mục data/external/
"""

import os
import requests
import pandas as pd
from datetime import datetime
import time

# ========================
# CẤU HÌNH
# ========================
LATITUDE = 12.71
LONGITUDE = 108.23
START_DATE = "1990-01-01"
END_DATE = "2025-10-31"  # Cập nhật đến tháng 10/2025
TIMEZONE = "Asia/Bangkok"

# Các biến khí hậu DAILY
DAILY_VARIABLES = [
    "temperature_2m_max",
    "temperature_2m_min", 
    "precipitation_sum",
    "relative_humidity_2m_mean",
    "shortwave_radiation_sum"  # Bức xạ cho feature radiation_JunSep
]

# Các biến HOURLY cần aggregate (soil moisture không có trong daily)
HOURLY_VARIABLES = [
    "soil_moisture_0_to_7cm",
    "soil_moisture_7_to_28cm"
]

# Đường dẫn output
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "external")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "weather_daklak_1990_2025.csv")  # Cập nhật tên file

# API endpoint
API_URL = "https://archive-api.open-meteo.com/v1/archive"


def fetch_weather_chunk(start_date: str, end_date: str, max_retries: int = 3) -> dict:
    """
    Fetch một chunk dữ liệu thời tiết từ Open-Meteo Archive API.
    API có giới hạn, cần chia nhỏ request.
    """
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ",".join(DAILY_VARIABLES),
        "hourly": ",".join(HOURLY_VARIABLES),
        "timezone": TIMEZONE
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.get(API_URL, params=params, timeout=120)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"   ⚠️ Lỗi: {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 5
                print(f"   ⏳ Đợi {wait_time} giây...")
                time.sleep(wait_time)
            else:
                raise Exception(f"❌ Không thể fetch dữ liệu: {e}")
    
    return None


def fetch_weather_data_in_chunks():
    """
    Fetch dữ liệu theo từng năm để tránh giới hạn API.
    """
    all_daily_data = []
    all_hourly_data = []
    
    start_year = int(START_DATE[:4])
    end_year = int(END_DATE[:4])
    
    print(f"\n📅 Sẽ fetch dữ liệu từ {start_year} đến {end_year} ({end_year - start_year + 1} năm)")
    
    for year in range(start_year, end_year + 1):
        chunk_start = f"{year}-01-01"
        # Với năm cuối, sử dụng END_DATE thay vì 12-31
        if year == end_year:
            chunk_end = END_DATE
        else:
            chunk_end = f"{year}-12-31"
        
        print(f"   📡 Năm {year}...", end=" ", flush=True)
        
        try:
            data = fetch_weather_chunk(chunk_start, chunk_end)
            
            # Lấy daily data
            if "daily" in data:
                daily_df = pd.DataFrame(data["daily"])
                all_daily_data.append(daily_df)
            
            # Lấy hourly data và aggregate theo ngày
            if "hourly" in data:
                hourly_df = pd.DataFrame(data["hourly"])
                hourly_df["time"] = pd.to_datetime(hourly_df["time"])
                hourly_df["date"] = hourly_df["time"].dt.date
                
                # Aggregate hourly -> daily (mean)
                hourly_agg = hourly_df.groupby("date").agg({
                    "soil_moisture_0_to_7cm": "mean",
                    "soil_moisture_7_to_28cm": "mean"
                }).reset_index()
                hourly_agg["date"] = pd.to_datetime(hourly_agg["date"])
                all_hourly_data.append(hourly_agg)
            
            print("✅")
            
            # Delay nhỏ giữa các requests
            time.sleep(0.5)
            
        except Exception as e:
            print(f"❌ {e}")
            continue
    
    return all_daily_data, all_hourly_data


def combine_and_process_data(daily_chunks, hourly_chunks):
    """
    Ghép các chunks và tạo DataFrame hoàn chỉnh.
    """
    # Ghép daily data
    daily_df = pd.concat(daily_chunks, ignore_index=True)
    daily_df["time"] = pd.to_datetime(daily_df["time"])
    daily_df = daily_df.rename(columns={"time": "date"})
    
    # Ghép hourly aggregated data
    hourly_df = pd.concat(hourly_chunks, ignore_index=True)
    
    # Merge daily và hourly
    df = pd.merge(daily_df, hourly_df, on="date", how="left")
    
    # Đổi tên cột cho đẹp
    df = df.rename(columns={
        "temperature_2m_max": "temp_max",
        "temperature_2m_min": "temp_min",
        "precipitation_sum": "rain",
        "relative_humidity_2m_mean": "humidity",
        "shortwave_radiation_sum": "radiation",
        "soil_moisture_0_to_7cm": "soil_0_7",
        "soil_moisture_7_to_28cm": "soil_7_28"
    })
    
    # Sắp xếp theo ngày
    df = df.sort_values("date").reset_index(drop=True)
    
    return df


def validate_data(df: pd.DataFrame) -> None:
    """
    Kiểm tra và cảnh báo về dữ liệu.
    """
    print("\n📊 KIỂM TRA DỮ LIỆU:")
    print(f"   - Tổng số dòng: {len(df):,}")
    print(f"   - Khoảng thời gian: {df['date'].min()} → {df['date'].max()}")
    print(f"   - Số năm: {df['date'].dt.year.nunique()}")
    
    # Kiểm tra missing values
    print("\n📋 MISSING VALUES:")
    for col in df.columns:
        if col != "date":
            missing = df[col].isna().sum()
            pct = (missing / len(df)) * 100
            if missing > 0:
                print(f"   ⚠️ {col}: {missing:,} ({pct:.2f}%)")
            else:
                print(f"   ✅ {col}: OK")
    
    # Cảnh báo nếu ít hơn 12,000 dòng
    if len(df) < 12000:
        print(f"\n⚠️ CẢNH BÁO: Chỉ có {len(df):,} dòng, ít hơn 12,000 dòng yêu cầu!")
    else:
        print(f"\n✅ Đủ dữ liệu: {len(df):,} dòng (> 12,000)")


def save_to_csv(df: pd.DataFrame, filepath: str) -> None:
    """
    Lưu DataFrame thành file CSV.
    """
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, index=False)
    print(f"\n💾 Đã lưu file: {filepath}")
    print(f"   - Kích thước: {os.path.getsize(filepath) / 1024:.2f} KB")


def main():
    """Main function để chạy toàn bộ pipeline."""
    print("=" * 60)
    print("🌦 FETCH DỮ LIỆU THỜI TIẾT 30 NĂM - ĐẮK LẮK")
    print("=" * 60)
    print(f"\n📍 Tọa độ: {LATITUDE}°N, {LONGITUDE}°E")
    print(f"📅 Khoảng thời gian: {START_DATE} → {END_DATE}")
    print(f"🌡 Biến DAILY: {', '.join(DAILY_VARIABLES)}")
    print(f"💧 Biến HOURLY (aggregate): {', '.join(HOURLY_VARIABLES)}")
    
    # Fetch dữ liệu theo chunks
    print("\n" + "-" * 60)
    daily_chunks, hourly_chunks = fetch_weather_data_in_chunks()
    
    # Ghép và xử lý
    print("\n🔄 Đang ghép và xử lý dữ liệu...")
    df = combine_and_process_data(daily_chunks, hourly_chunks)
    
    # Validate
    validate_data(df)
    
    # Lưu file
    save_to_csv(df, OUTPUT_FILE)
    
    # Preview
    print("\n📋 PREVIEW DỮ LIỆU:")
    print(df.head(10).to_string())
    print("\n...")
    print(df.tail(5).to_string())
    
    print("\n" + "=" * 60)
    print("✅ ĐÃ TẢI XONG DỮ LIỆU 30 NĂM — FILE CSV SẴN SÀNG CHO FEATURE ENGINEERING.")
    print("=" * 60)
    
    return df


if __name__ == "__main__":
    main()
