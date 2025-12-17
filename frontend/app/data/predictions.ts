/**
 * Dữ liệu dự báo walk-forward (2018-2024)
 * Dữ liệu này được lấy từ kết quả chạy mô hình XGBoost upgraded
 */

export interface YearPrediction {
  year: number;
  actual: number;
  predicted: number;
  error: number; // phần trăm sai số
  trainYears: number; // số năm dữ liệu huấn luyện
  explanation: string; // giải thích ngôn ngữ tự nhiên
  status: "good" | "medium" | "poor"; // đánh giá
}

export const predictions: YearPrediction[] = [
  {
    year: 2018,
    actual: 2.51,
    predicted: 2.21,
    error: 12.07,
    trainYears: 3,
    explanation:
      "Đây là năm đầu tiên mô hình dự báo. Tại thời điểm này, mô hình chỉ được học từ dữ liệu 3 năm trước đó (2015-2017), nên chưa có đủ ví dụ về các kiểu thời tiết khác nhau để dự đoán chính xác.",
    status: "poor",
  },
  {
    year: 2019,
    actual: 2.29,
    predicted: 2.27,
    error: 0.76,
    trainYears: 4,
    explanation:
      "Mô hình dự báo rất chính xác! Điều kiện thời tiết năm này tương tự với các năm trước, giúp mô hình dễ dàng nhận ra quy luật.",
    status: "good",
  },
  {
    year: 2020,
    actual: 2.43,
    predicted: 2.25,
    error: 7.41,
    trainYears: 5,
    explanation:
      "Sai số ở mức trung bình. Mô hình đã học được nhiều hơn nhưng năm 2020 có một số biến động thời tiết khác thường so với các năm trước.",
    status: "medium",
  },
  {
    year: 2021,
    actual: 2.47,
    predicted: 2.31,
    error: 6.53,
    trainYears: 6,
    explanation:
      "Dự báo khá tốt. Với 6 năm dữ liệu huấn luyện, mô hình đã bắt đầu nhận ra được nhiều quy luật hơn.",
    status: "medium",
  },
  {
    year: 2022,
    actual: 2.62,
    predicted: 2.44,
    error: 6.69,
    trainYears: 7,
    explanation:
      'Năm 2022 có năng suất cao kỷ lục (2.62 tấn/ha). Mô hình dự báo thấp hơn thực tế vì chưa từng "thấy" năng suất cao như vậy trong dữ liệu học.',
    status: "medium",
  },
  {
    year: 2023,
    actual: 2.56,
    predicted: 2.4,
    error: 6.43,
    trainYears: 8,
    explanation:
      "Sai số ổn định ở mức trung bình. Mô hình tiếp tục cải thiện khi có thêm dữ liệu từ các năm trước.",
    status: "medium",
  },
  {
    year: 2024,
    actual: 2.52,
    predicted: 2.51,
    error: 0.34,
    trainYears: 9,
    explanation:
      "Dự báo gần như hoàn hảo! Với 9 năm dữ liệu huấn luyện, mô hình đã học được đầy đủ các quy luật về mối quan hệ giữa thời tiết và năng suất cà phê.",
    status: "good",
  },
];

// Thông tin về các yếu tố quan trọng
export interface FeatureFactor {
  name: string;
  importance: number; // phần trăm
  icon: string;
  description: string;
  effect: string; // ảnh hưởng đến năng suất
}

export const featureFactors: FeatureFactor[] = [
  {
    name: "Bức xạ mặt trời (tháng 6-9)",
    importance: 47.3,
    icon: "☀️",
    description:
      "Lượng ánh sáng mặt trời trong giai đoạn quả cà phê đang tích lũy chất dinh dưỡng.",
    effect:
      "Nhiều ánh sáng → Cây quang hợp tốt → Hạt cà phê nặng hơn → Năng suất cao",
  },
  {
    name: "Bức xạ từ vệ tinh NASA",
    importance: 29.3,
    icon: "🛰️",
    description:
      "Dữ liệu bức xạ đo từ vệ tinh, cho kết quả chính xác hơn đo từ mặt đất.",
    effect:
      "Xác nhận thêm vai trò quan trọng của ánh sáng trong giai đoạn tích lũy",
  },
  {
    name: "Chỉ số El Niño / La Niña",
    importance: 11.6,
    icon: "🌊",
    description:
      "Hiện tượng khí hậu toàn cầu ảnh hưởng đến lượng mưa ở Tây Nguyên.",
    effect:
      "El Niño → Hạn hán → Năng suất giảm | La Niña → Mưa nhiều → Năng suất tăng nhẹ",
  },
  {
    name: "Mưa đầu vụ (tháng 2-3)",
    importance: 3.0,
    icon: "🌧️",
    description: "Lượng mưa trong giai đoạn cây cà phê ra hoa.",
    effect: "Mưa vừa đủ → Hoa nở đồng loạt → Nhiều quả → Năng suất cao",
  },
  {
    name: "Chỉ số hạn SPEI",
    importance: 2.5,
    icon: "🏜️",
    description:
      "Đánh giá mức độ khô hạn kết hợp giữa lượng mưa và độ bốc hơi.",
    effect: "Hạn nặng → Cây thiếu nước → Rụng quả non → Năng suất giảm",
  },
  {
    name: "Số ngày nắng nóng >33°C",
    importance: 2.0,
    icon: "🌡️",
    description: "Số ngày nhiệt độ vượt quá 33°C trong tháng 5-6.",
    effect:
      "Nắng nóng kéo dài → Cây bị stress → Rụng hoa, rụng quả → Năng suất giảm",
  },
];

// Thống kê tổng quan
export const summaryStats = {
  avgYield: 2.41,
  avgError: 5.75,
  bestYear: 2024,
  worstYear: 2018,
  totalYears: 7, // số năm backtest
  dataYears: 35, // số năm dữ liệu thời tiết
};
