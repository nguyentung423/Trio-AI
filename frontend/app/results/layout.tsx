import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả dự báo",
  description:
    "Biểu đồ so sánh năng suất cà phê thực tế và dự báo từ 2018-2024. Xem chi tiết sai số và phân tích từng năm.",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
