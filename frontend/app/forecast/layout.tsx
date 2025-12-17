import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự báo 2026",
  description:
    "Nhập điều kiện thời tiết dự kiến để xem dự báo năng suất cà phê năm 2026. Hỗ trợ các kịch bản El Niño, La Niña, hạn hán và năm lý tưởng.",
};

export default function ForecastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
