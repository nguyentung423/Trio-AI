# TRIO-AI – Dự báo năng suất cà phê theo kịch bản khí hậu

## Tổng quan

TRIO-AI là hệ thống AI dự báo năng suất cà phê tại Đắk Lắk, Việt Nam theo các kịch bản khí hậu khác nhau. Dựa trên 35 năm dữ liệu thời tiết (1990–2025), hệ thống hỗ trợ nông dân và nhà hoạch định đưa ra quyết định canh tác thích ứng với biến đổi khí hậu.

## Tính năng chính

- Dự báo năng suất cà phê (tấn/ha) với sai số ~7%
- Dự báo theo kịch bản khí hậu (Bình thường, El Niño, La Niña, Hạn hán, Bão)
- Giải thích ngắn gọn và gợi ý canh tác theo từng kịch bản
- Giao diện web song ngữ Việt–Anh

## Công nghệ sử dụng

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Machine Learning:** XGBoost
- **Nguồn dữ liệu:** Open-Meteo, NASA POWER, NOAA CPC

## Cấu trúc dự án

```
TRIO-AI/
├── frontend/    # Ứng dụng web Next.js
├── backend/     # Server FastAPI & ML pipeline
├── README.md
└── .gitignore
```

## Hướng dẫn chạy

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn src.api:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Truy cập: http://localhost:3000/forecast

## Biến môi trường

```
NEXT_PUBLIC_API_URL
GROQ_API_KEY
```

Các biến môi trường được đặt trong file `.env.local` và không được commit lên repository.

## Đánh giá mô hình

Mô hình được đánh giá bằng walk-forward validation và Leave-One-Year-Out (LOYO) cross-validation để đảm bảo độ tin cậy và giảm thiểu overfitting.

## Demo

Xem video demo đính kèm để hiểu rõ hơn về hệ thống.

## Lưu ý

Đây là prototype được phát triển cho mục đích thi đấu.
