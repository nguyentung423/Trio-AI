import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giải thích mô hình",
  description:
    "Tìm hiểu các yếu tố thời tiết ảnh hưởng đến năng suất cà phê: bức xạ mặt trời, El Niño, lượng mưa, nhiệt độ. FAQ và hướng dẫn sử dụng.",
};

export default function ExplainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
