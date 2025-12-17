# Coffee Yield Prediction - Backend

Backend Python cho hệ thống dự báo năng suất cà phê.

## 📁 Cấu trúc

```
backend/
├── data/
│   ├── raw/           # Dữ liệu thô
│   ├── processed/     # Dữ liệu đã xử lý
│   └── external/      # Dữ liệu từ nguồn ngoài
├── models/            # Model artifacts (.pkl files)
├── src/               # Source code
├── notebooks/         # Jupyter notebooks
├── tests/             # Unit tests
└── requirements.txt   # Dependencies
```

## 🚀 Cài đặt

```bash
# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Cài đặt dependencies
pip install -r requirements.txt
```

## 🏃 Chạy API Server

```bash
uvicorn src.api:app --reload --port 8000
```

API sẽ chạy tại: http://localhost:8000

Swagger docs: http://localhost:8000/docs

## 📊 API Endpoints

| Endpoint                  | Method | Mô tả             |
| ------------------------- | ------ | ----------------- |
| `/`                       | GET    | Root endpoint     |
| `/health`                 | GET    | Health check      |
| `/predict-year?year=2026` | GET    | Dự báo năng suất  |
| `/feature-importance`     | GET    | SHAP importance   |
| `/yield-history`          | GET    | Lịch sử năng suất |

## 🧪 Testing

```bash
pytest tests/
```

## 📓 Notebooks

- `EDA.ipynb`: Exploratory Data Analysis
- `model_experiments.ipynb`: Thử nghiệm các model ML
