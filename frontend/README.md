# Coffee Yield Prediction - Frontend

Frontend Next.js Dashboard cho hệ thống dự báo năng suất cà phê.

## 📁 Cấu trúc

```
frontend/
├── app/                # Next.js App Router
│   ├── page.tsx        # Trang chủ
│   ├── predict/        # Trang dự báo
│   ├── charts/         # Components biểu đồ
│   └── api/            # API helpers
├── components/         # Reusable components
├── public/             # Static assets
├── styles/             # CSS styles
└── package.json        # Dependencies
```

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 📊 Trang chính

- **/** : Dashboard tổng quan với các biểu đồ
- **/predict** : Form dự báo năng suất theo năm

## 🔗 Kết nối Backend

Frontend kết nối với Backend API tại `http://localhost:8000`.

Đảm bảo Backend đang chạy trước khi sử dụng các tính năng.

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (biểu đồ)
