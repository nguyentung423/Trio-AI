import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "So sánh các năm",
  description:
    "So sánh chi tiết năng suất cà phê qua các năm. Xếp hạng năm nào dự báo chính xác nhất, năm nào sai nhiều và lý do.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
