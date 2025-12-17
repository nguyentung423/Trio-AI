"""
run_pipeline.py

Script chạy toàn bộ quy trình phân tích dữ liệu và dự báo năng suất cà phê
từ đầu đến cuối (End-to-End Pipeline)

WORKFLOW:
=========
1. Tiền xử lý dữ liệu thời tiết (preprocess.py)
2. Tạo đặc trưng cho mô hình (feature_engineering.py)  
3. Huấn luyện mô hình (train_model.py)
4. Đánh giá mô hình (evaluate_model.py)
5. Giải thích mô hình với SHAP (explain_model.py)

Mỗi bước sẽ có thông báo rõ ràng về việc đang làm gì với dữ liệu.
"""

import os
import sys
import time
from pathlib import Path

# Thêm thư mục src vào PYTHONPATH
BASE_DIR = Path(__file__).parent
sys.path.insert(0, str(BASE_DIR / "src"))


def print_header(step_number: int, title: str, description: str):
    """In tiêu đề cho mỗi bước"""
    print("\n" + "="*80)
    print(f"🔷 BƯỚC {step_number}: {title}")
    print("="*80)
    print(f"📝 Mô tả: {description}")
    print("-"*80)


def print_section(title: str):
    """In tiêu đề section nhỏ"""
    print(f"\n{'─'*60}")
    print(f"▶️  {title}")
    print(f"{'─'*60}")


def print_success(message: str):
    """In thông báo thành công"""
    print(f"✅ {message}")


def print_info(message: str):
    """In thông báo thông tin"""
    print(f"ℹ️  {message}")


def print_error(message: str):
    """In thông báo lỗi"""
    print(f"❌ {message}")


def main():
    """Chạy toàn bộ pipeline"""
    
    print("\n" + "🌟"*40)
    print("   HỆ THỐNG DỰ BÁO NĂNG SUẤT CÀ PHÊ ĐẮK LẮK")
    print("   Quy trình phân tích dữ liệu End-to-End")
    print("🌟"*40)
    
    start_time = time.time()
    
    try:
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
        
        from preprocess import main as preprocess_main
        preprocess_main()
        
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
        
        from feature_engineering import main as feature_main
        feature_main()
        
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
        print_info("Kỹ thuật: Time Series Cross-Validation")
        print_info("Mô hình đầu ra: models/coffee_model.pkl")
        
        from train_model import main as train_main
        train_main()
        
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
        print_info("Kết quả lưu tại: data/processed/")
        
        from evaluate_model import main as evaluate_main
        evaluate_main()
        
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
        
        from explain_model import main as explain_main
        explain_main()
        
        print_success("Hoàn thành giải thích mô hình!")
        
        # ============================================================
        # HOÀN THÀNH
        # ============================================================
        elapsed_time = time.time() - start_time
        
        print("\n" + "🎉"*40)
        print("   HOÀN THÀNH TOÀN BỘ QUY TRÌNH!")
        print("🎉"*40)
        
        print(f"\n⏱️  Thời gian thực hiện: {elapsed_time:.2f} giây ({elapsed_time/60:.2f} phút)")
        
        print("\n📊 KẾT QUẢ CUỐI CÙNG:")
        print("   ✓ Dữ liệu đã được xử lý và làm sạch")
        print("   ✓ Đặc trưng đã được tạo và tối ưu")
        print("   ✓ Mô hình đã được huấn luyện và lưu trữ")
        print("   ✓ Hiệu suất mô hình đã được đánh giá")
        print("   ✓ Các yếu tố quan trọng đã được phân tích")
        
        print("\n📁 Các file kết quả:")
        print("   • data/processed/weather_monthly.csv - Dữ liệu thời tiết theo tháng")
        print("   • data/processed/features_yearly.csv - Đặc trưng theo năm")
        print("   • models/coffee_model.pkl - Mô hình đã huấn luyện")
        print("   • data/processed/feature_importance.csv - Độ quan trọng của đặc trưng")
        
        print("\n🚀 Bước tiếp theo:")
        print("   • Chạy API server: uvicorn src.api:app --reload")
        print("   • Xem kết quả tại: http://localhost:8000/docs")
        print("   • Hoặc chạy frontend: cd frontend && npm run dev")
        
        print("\n" + "="*80 + "\n")
        
    except Exception as e:
        print_error(f"Đã xảy ra lỗi: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
