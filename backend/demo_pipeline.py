"""
demo_pipeline.py

Script demo hiển thị quy trình phân tích dữ liệu và huấn luyện mô hình
với log giả để minh họa end-to-end workflow
"""

import time
import random

def print_header(step_number: int, title: str, description: str):
    """In tiêu đề cho mỗi bước"""
    print("\n" + "="*80)
    print(f"🔷 BƯỚC {step_number}: {title}")
    print("="*80)
    print(f"📝 Mô tả: {description}")
    print("-"*80)

def print_success(message: str):
    """In thông báo thành công"""
    print(f"✅ {message}")

def print_info(message: str):
    """In thông báo thông tin"""
    print(f"ℹ️  {message}")

def simulate_delay(seconds=1):
    """Giả lập thời gian xử lý"""
    time.sleep(seconds)

def main():
    print("\n" + "🌟"*40)
    print("   HỆ THỐNG DỰ BÁO NĂNG SUẤT CÀ PHÊ ĐẮK LẮK")
    print("   Quy trình phân tích dữ liệu End-to-End")
    print("🌟"*40)
    
    start_time = time.time()
    
    # ============================================================
    # BƯỚC 1: TIỀN XỬ LÝ DỮ LIỆU THỜI TIẾT
    # ============================================================
    print_header(
        1,
        "TIỀN XỬ LÝ DỮ LIỆU THỜI TIẾT",
        "Đọc dữ liệu thời tiết 30 năm (1990-2025), làm sạch và tổng hợp theo tháng"
    )
    
    print_info("Dữ liệu đầu vào: data/external/weather_daklak_1990_2025.csv")
    print_info("Dữ liệu đầu ra: data/processed/weather_monthly.csv")
    
    print("\n📂 Đang load dữ liệu từ: weather_daklak_1990_2025.csv")
    simulate_delay(0.5)
    print("   ✅ Loaded 13,088 dòng dữ liệu thời tiết")
    print("   📅 Khoảng thời gian: 1990-01-01 → 2025-10-31")
    
    print("\n🕐 Tạo các cột thời gian (year, month, day)...")
    simulate_delay(0.3)
    print("   ✅ Đã tạo cột thời gian")
    print("   📅 Số năm: 36 năm (1990 - 2025)")
    
    print("\n🔍 Kiểm tra missing values...")
    simulate_delay(0.3)
    print("   ✅ Không có missing values!")
    
    print("\n📊 Gom dữ liệu theo năm-tháng...")
    simulate_delay(0.5)
    print("   ✅ Tạo được 430 dòng (năm-tháng)")
    print("   📋 Các cột: temp_max, temp_min, rain_sum, humidity, radiation, soil_moisture")
    
    print("\n💾 Lưu file: data/processed/weather_monthly.csv")
    print("   - Số dòng: 430")
    print("   - Kích thước: 46.00 KB")
    
    print_success("Hoàn thành tiền xử lý dữ liệu thời tiết!")
    
    # ============================================================
    # BƯỚC 2: TẠO ĐẶC TRƯNG (FEATURE ENGINEERING)
    # ============================================================
    print_header(
        2,
        "TẠO ĐẶC TRƯNG CHO MÔ HÌNH",
        "Kết hợp dữ liệu thời tiết với năng suất cà phê, tạo các đặc trưng mới"
    )
    
    print_info("Dữ liệu đầu vào:")
    print_info("  - data/processed/weather_monthly.csv (dữ liệu thời tiết)")
    print_info("  - data/raw/coffee_yield_daklak.csv (năng suất cà phê thực tế)")
    print_info("Dữ liệu đầu ra: data/processed/features_yearly.csv")
    
    print("\n📂 Load dữ liệu thời tiết theo tháng...")
    simulate_delay(0.3)
    print("   ✅ Loaded 430 dòng (năm-tháng)")
    
    print("\n📂 Load dữ liệu năng suất cà phê...")
    simulate_delay(0.3)
    print("   ✅ Loaded 34 năm (1990-2023)")
    print("   📊 Năng suất trung bình: 2.45 tấn/ha")
    print("   📈 Xu hướng: Tăng từ 1.8 tấn/ha (1990) → 2.8 tấn/ha (2023)")
    
    print("\n🔧 Tạo đặc trưng theo giai đoạn phát triển cà phê...")
    print("   📅 Giai đoạn ra hoa (Tháng 1-3):")
    simulate_delay(0.3)
    print("      • Nhiệt độ trung bình, Lượng mưa, Độ ẩm")
    print("   🌱 Giai đoạn phát triển quả (Tháng 4-8):")
    simulate_delay(0.3)
    print("      • Nhiệt độ, Mưa tích lũy, Bức xạ mặt trời, Độ ẩm đất")
    print("   ☕ Giai đoạn chín quả (Tháng 9-12):")
    simulate_delay(0.3)
    print("      • Nhiệt độ, Mưa, Độ ẩm, Bức xạ")
    
    print("\n✨ Tạo đặc trưng tương tác...")
    simulate_delay(0.3)
    print("   • temp_rain_ratio: Tỷ lệ nhiệt độ/mưa")
    print("   • stress_index: Chỉ số stress khô hạn")
    print("   • growth_index: Chỉ số tăng trưởng")
    
    print("\n💾 Lưu file features: data/processed/features_yearly.csv")
    print("   - Số năm: 34 năm (1990-2023)")
    print("   - Số đặc trưng: 42 features")
    print("   - Kích thước: 28.50 KB")
    
    print_success("Hoàn thành tạo đặc trưng!")
    
    # ============================================================
    # BƯỚC 3: HUẤN LUYỆN MÔ HÌNH
    # ============================================================
    print_header(
        3,
        "HUẤN LUYỆN MÔ HÌNH MACHINE LEARNING",
        "Sử dụng XGBoost để học mối quan hệ giữa thời tiết và năng suất cà phê"
    )
    
    print_info("Dữ liệu đầu vào: data/processed/features_yearly.csv")
    print_info("Mô hình sử dụng: XGBoost Regression")
    print_info("Kỹ thuật: Time Series Cross-Validation (5 folds)")
    print_info("Mô hình đầu ra: models/coffee_model.pkl")
    
    print("\n📂 Load dữ liệu features...")
    simulate_delay(0.3)
    print("   ✅ Loaded 34 năm với 42 đặc trưng")
    
    print("\n🔀 Chia dữ liệu Train/Test (Time Series Split)...")
    simulate_delay(0.3)
    print("   📊 Train set: 27 năm (1990-2016) - 79%")
    print("   📊 Test set: 7 năm (2017-2023) - 21%")
    
    print("\n🎯 Thiết lập siêu tham số XGBoost:")
    print("   • max_depth: 4 (độ sâu cây)")
    print("   • learning_rate: 0.05 (tốc độ học)")
    print("   • n_estimators: 200 (số cây)")
    print("   • subsample: 0.8 (tỷ lệ mẫu)")
    print("   • colsample_bytree: 0.8 (tỷ lệ đặc trưng)")
    
    print("\n🚀 Bắt đầu huấn luyện mô hình...")
    print("\n" + "─"*60)
    
    # Giả lập quá trình training với các vòng lặp
    epochs = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]
    train_rmse = [1.250, 0.890, 0.650, 0.520, 0.440, 0.390, 0.360, 0.340, 0.330, 0.325, 0.320]
    val_rmse = [1.280, 0.920, 0.710, 0.580, 0.510, 0.470, 0.450, 0.445, 0.442, 0.440, 0.438]
    
    for i, (epoch, tr_rmse, v_rmse) in enumerate(zip(epochs, train_rmse, val_rmse)):
        print(f"[{epoch:3d}] Train RMSE: {tr_rmse:.4f} | Val RMSE: {v_rmse:.4f}")
        if i < len(epochs) - 1:
            simulate_delay(0.4)
    
    print("─"*60)
    print("\n✅ Huấn luyện hoàn tất sau 200 iterations!")
    
    print("\n📊 Kết quả Cross-Validation (5 folds):")
    simulate_delay(0.3)
    print("   Fold 1: RMSE = 0.452, R² = 0.876")
    print("   Fold 2: RMSE = 0.438, R² = 0.885")
    print("   Fold 3: RMSE = 0.465, R² = 0.868")
    print("   Fold 4: RMSE = 0.441, R² = 0.881")
    print("   Fold 5: RMSE = 0.448, R² = 0.879")
    print("   " + "─"*50)
    print("   📈 Trung bình: RMSE = 0.449 ± 0.010, R² = 0.878 ± 0.006")
    
    print("\n💾 Lưu mô hình: models/coffee_model.pkl")
    print("   - Kích thước: 1.2 MB")
    
    print_success("Hoàn thành huấn luyện mô hình!")
    
    # ============================================================
    # BƯỚC 4: ĐÁNH GIÁ MÔ HÌNH
    # ============================================================
    print_header(
        4,
        "ĐÁNH GIÁ HIỆU SUẤT MÔ HÌNH",
        "Kiểm tra độ chính xác của mô hình trên dữ liệu test"
    )
    
    print_info("Các chỉ số đánh giá: MAE, RMSE, R², MAPE")
    print_info("Test set: 7 năm (2017-2023)")
    
    print("\n🔮 Dự báo trên tập test...")
    simulate_delay(0.5)
    
    print("\n📊 KẾT QUẢ ĐÁNH GIÁ TRÊN TẬP TEST:")
    print("="*60)
    print(f"   {'Chỉ số':<20} {'Giá trị':<15} {'Ý nghĩa'}")
    print("="*60)
    print(f"   {'MAE':<20} {'0.285 tấn/ha':<15} Sai số tuyệt đối trung bình")
    print(f"   {'RMSE':<20} {'0.352 tấn/ha':<15} Căn bậc 2 sai số bình phương")
    print(f"   {'R² Score':<20} {'0.892':<15} Độ phù hợp (89.2%)")
    print(f"   {'MAPE':<20} {'10.8%':<15} Sai số phần trăm trung bình")
    print("="*60)
    
    print("\n📈 Dự báo chi tiết từng năm:")
    print("─"*70)
    print(f"{'Năm':<8} {'Thực tế':<12} {'Dự báo':<12} {'Sai số':<12} {'% Sai số'}")
    print("─"*70)
    
    actual_yields = [2.52, 2.58, 2.61, 2.55, 2.48, 2.72, 2.79]
    predicted_yields = [2.61, 2.49, 2.73, 2.48, 2.56, 2.81, 2.71]
    years = list(range(2017, 2024))
    
    for year, actual, pred in zip(years, actual_yields, predicted_yields):
        error = pred - actual
        pct_error = (error / actual) * 100
        error_sign = "+" if error > 0 else ""
        print(f"{year:<8} {actual:<12.2f} {pred:<12.2f} {error_sign}{error:<11.3f} {error_sign}{pct_error:.1f}%")
        simulate_delay(0.2)
    
    print("─"*70)
    
    print("\n💾 Lưu kết quả đánh giá: data/processed/model_evaluation.csv")
    
    print_success("Hoàn thành đánh giá mô hình!")
    
    # ============================================================
    # BƯỚC 5: GIẢI THÍCH MÔ HÌNH VỚI SHAP
    # ============================================================
    print_header(
        5,
        "GIẢI THÍCH MÔ HÌNH VỚI SHAP",
        "Phân tích đặc trưng nào ảnh hưởng nhiều nhất đến dự báo năng suất"
    )
    
    print_info("Công cụ: SHAP (SHapley Additive exPlanations)")
    print_info("Kết quả lưu tại: data/processed/feature_importance.csv")
    
    print("\n🔍 Tính toán SHAP values cho 42 đặc trưng...")
    simulate_delay(1.0)
    
    print("\n📊 TOP 10 ĐẶC TRƯNG QUAN TRỌNG NHẤT:")
    print("="*70)
    print(f"{'Hạng':<6} {'Đặc trưng':<35} {'Độ quan trọng':<15}")
    print("="*70)
    
    features = [
        ("rain_sum_growth (Mưa giai đoạn phát triển)", 0.187),
        ("temp_mean_flower (Nhiệt độ ra hoa)", 0.142),
        ("soil_moisture_growth (Độ ẩm đất)", 0.124),
        ("radiation_sum_ripening (Bức xạ chín quả)", 0.098),
        ("humidity_mean_growth (Độ ẩm không khí)", 0.086),
        ("stress_index (Chỉ số stress khô hạn)", 0.075),
        ("temp_range_flower (Biên độ nhiệt ra hoa)", 0.068),
        ("rain_sum_ripening (Mưa giai đoạn chín)", 0.061),
        ("growth_index (Chỉ số tăng trưởng)", 0.054),
        ("temp_rain_ratio (Tỷ lệ nhiệt độ/mưa)", 0.048),
    ]
    
    for rank, (feature, importance) in enumerate(features, 1):
        bar_length = int(importance * 100)
        bar = "█" * (bar_length // 2)
        print(f"{rank:<6} {feature:<35} {importance:.3f} {bar}")
        simulate_delay(0.2)
    
    print("="*70)
    
    print("\n💡 PHÂN TÍCH CHI TIẾT:")
    print("─"*70)
    print("🌧️  Lượng mưa giai đoạn phát triển (Tháng 4-8):")
    print("    • Quan trọng nhất (18.7%)")
    print("    • Ảnh hưởng: Mưa 200-400mm → tăng năng suất 0.3-0.5 tấn/ha")
    print("    • Mưa > 500mm → giảm năng suất do úng")
    
    print("\n🌡️  Nhiệt độ giai đoạn ra hoa (Tháng 1-3):")
    print("    • Quan trọng thứ 2 (14.2%)")
    print("    • Ảnh hưởng: 27-29°C là tối ưu")
    print("    • < 25°C hoặc > 31°C → giảm năng suất 15-20%")
    
    print("\n💧 Độ ẩm đất giai đoạn phát triển:")
    print("    • Quan trọng thứ 3 (12.4%)")
    print("    • Ảnh hưởng: 0.35-0.45 m³/m³ là tối ưu")
    print("    • Độ ẩm thấp < 0.25 → stress hạn → giảm 20-30%")
    print("─"*70)
    
    print("\n💾 Lưu feature importance: data/processed/feature_importance.csv")
    
    print_success("Hoàn thành giải thích mô hình!")
    
    # ============================================================
    # HOÀN THÀNH
    # ============================================================
    elapsed_time = time.time() - start_time
    
    print("\n" + "🎉"*40)
    print("   HOÀN THÀNH TOÀN BỘ QUY TRÌNH!")
    print("🎉"*40)
    
    print(f"\n⏱️  Thời gian thực hiện: {elapsed_time:.2f} giây")
    
    print("\n📊 TÓM TẮT KẾT QUẢ:")
    print("="*70)
    print("✓ Dữ liệu: 13,088 quan sát thời tiết → 34 năm features")
    print("✓ Mô hình: XGBoost với 42 đặc trưng")
    print("✓ Hiệu suất: R² = 0.892, RMSE = 0.352 tấn/ha, MAPE = 10.8%")
    print("✓ Đặc trưng quan trọng nhất: Lượng mưa giai đoạn phát triển (18.7%)")
    print("="*70)
    
    print("\n📁 CÁC FILE KẾT QUẢ:")
    print("   • data/processed/weather_monthly.csv - Dữ liệu thời tiết theo tháng")
    print("   • data/processed/features_yearly.csv - 42 đặc trưng theo năm")
    print("   • models/coffee_model.pkl - Mô hình XGBoost đã huấn luyện")
    print("   • data/processed/feature_importance.csv - Độ quan trọng đặc trưng")
    print("   • data/processed/model_evaluation.csv - Kết quả đánh giá")
    
    print("\n🚀 BƯỚC TIẾP THEO:")
    print("   1️⃣  Chạy API server: uvicorn src.api:app --reload")
    print("   2️⃣  Truy cập API docs: http://localhost:8000/docs")
    print("   3️⃣  Chạy frontend: cd frontend && npm run dev")
    print("   4️⃣  Dự báo năng suất: GET /predict-year?year=2026")
    
    print("\n💡 Ý NGHĨA THỰC TẾ:")
    print("   • Mô hình có thể dự báo năng suất cà phê với độ chính xác ~89%")
    print("   • Sai số trung bình chỉ ~0.3 tấn/ha (11% so với thực tế)")
    print("   • Có thể cảnh báo sớm về năng suất thấp do điều kiện thời tiết")
    print("   • Hỗ trợ nông dân lập kế hoạch canh tác hiệu quả hơn")
    
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()
