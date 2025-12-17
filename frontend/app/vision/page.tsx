/**
 * Vision Page
 * The Future of Agricultural Planning
 * Apple-level cinematic storytelling
 * Bilingual: Vietnamese (default) / English
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function VisionPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const impactVi = [
    {
      title: "An ninh Lương thực Quốc gia",
      description:
        "Bộ Nông nghiệp có thể dự báo thiếu hụt và dư thừa, đưa ra chính sách kịp thời bảo vệ nông dân.",
    },
    {
      title: "Tối ưu Xuất khẩu Nông sản",
      description:
        "Doanh nghiệp có thể lên kế hoạch xuất khẩu cà phê, gạo, hồ tiêu với tầm nhìn dài hạn.",
    },
    {
      title: "Ổn định Giá cả",
      description:
        "Thông tin tốt hơn giúp giảm đầu cơ và biến động giá nông sản.",
    },
    {
      title: "Thích ứng Biến đổi Khí hậu",
      description:
        "Hiểu cách El Niño, La Niña ảnh hưởng đến từng vùng miền Việt Nam.",
    },
  ];

  const impactEn = [
    {
      title: "National Food Security",
      description:
        "Ministry of Agriculture can forecast shortages and surpluses, enabling timely policies to protect farmers.",
    },
    {
      title: "Export Optimization",
      description:
        "Enterprises can plan coffee, rice, pepper exports with long-term vision.",
    },
    {
      title: "Price Stability",
      description:
        "Better information reduces speculation and agricultural commodity price volatility.",
    },
    {
      title: "Climate Adaptation",
      description:
        "Understand how El Niño, La Niña affect each region of Vietnam.",
    },
  ];

  const impacts = language === "vi" ? impactVi : impactEn;

  return (
    <div
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div
          className={`absolute inset-0 opacity-60 ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#0a1a0a] to-black"
              : "bg-gradient-to-b from-emerald-50 to-slate-50"
          }`}
        />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <p
            className={`text-[11px] tracking-[0.3em] uppercase text-emerald-500/80 mb-6 transition-all duration-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi" ? "Tầm nhìn của Chúng tôi" : "Our Vision"}
          </p>

          <h1
            className={`text-[44px] sm:text-[64px] lg:text-[80px] font-semibold leading-[1.05] tracking-[-0.03em] transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {language === "vi" ? "AI hiểu được" : "AI that understands"}
            <br />
            {language === "vi"
              ? "mùa màng của hành tinh."
              : "the planet's harvest."}
          </h1>

          <p
            className={`max-w-[600px] mx-auto mt-8 text-[19px] leading-relaxed transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } ${theme === "dark" ? "text-white/40" : "text-slate-500"}`}
          >
            {language === "vi"
              ? "Một thế giới nơi chính phủ, doanh nghiệp và cộng đồng có thể dự đoán sản lượng nông nghiệp — và lên kế hoạch tương ứng."
              : "A world where governments, businesses, and communities can anticipate agricultural production — and plan accordingly."}
          </p>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-28 sm:py-40">
        <div className="max-w-[800px] mx-auto px-6">
          <p
            className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
              theme === "dark" ? "text-white/30" : "text-slate-500"
            }`}
          >
            {language === "vi" ? "Thách thức" : "The Challenge"}
          </p>
          <h2
            className={`text-[28px] sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight mb-12 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Nguồn cung lương thực thế giới không chắc chắn."
              : "The world's food supply is uncertain."}
          </h2>

          <div
            className={`space-y-8 text-[17px] sm:text-[19px] leading-relaxed ${
              theme === "dark" ? "text-white/50" : "text-slate-600"
            }`}
          >
            <p>
              {language === "vi"
                ? "Biến động khí hậu. Thay đổi mô hình thời tiết. Gián đoạn địa chính trị. Các yếu tố ảnh hưởng đến sản xuất lương thực toàn cầu chưa bao giờ phức tạp hơn."
                : "Climate volatility. Shifting weather patterns. Geopolitical disruptions. The factors affecting global food production have never been more complex."}
            </p>
            <p>
              {language === "vi"
                ? "Tuy nhiên, các quyết định định hình an ninh lương thực — từ chính sách chính phủ đến giao dịch hàng hóa — vẫn được đưa ra với thông tin không đầy đủ."
                : "Yet the decisions that shape food security — from government policy to commodity trading — are still made with incomplete information."}
            </p>
            <p>
              {language === "vi"
                ? "Điều gì nếu chúng ta có thể thấy mùa màng trước khi nó xảy ra?"
                : "What if we could see the harvest before it happens?"}
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section
        className={`py-28 sm:py-40 ${
          theme === "dark"
            ? "bg-gradient-to-b from-transparent to-[#050505]"
            : "bg-gradient-to-b from-slate-50 to-white"
        }`}
      >
        <div className="max-w-[800px] mx-auto px-6">
          <p
            className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
              theme === "dark" ? "text-white/30" : "text-slate-500"
            }`}
          >
            {language === "vi" ? "Giải pháp" : "The Solution"}
          </p>
          <h2
            className={`text-[28px] sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight mb-12 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "AI dự đoán sản lượng."
              : "AI that anticipates production."}
          </h2>

          <div
            className={`space-y-8 text-[17px] sm:text-[19px] leading-relaxed ${
              theme === "dark" ? "text-white/50" : "text-slate-600"
            }`}
          >
            <p>
              {language === "vi"
                ? "Nền tảng của chúng tôi tổng hợp hình ảnh vệ tinh, dữ liệu khí hậu và các mô hình nông nghiệp để dự đoán năng suất cây trồng hàng tháng — thậm chí hàng năm — trước."
                : "Our platform synthesizes satellite imagery, climate data, and agricultural patterns to project crop yields months — even years — in advance."}
            </p>
            <p>
              {language === "vi"
                ? "Không chỉ là dự báo đơn giản. Một sự hiểu biết toàn diện về tiềm năng nông nghiệp toàn cầu."
                : "Not a simple forecast. A comprehensive understanding of global agricultural potential."}
            </p>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-28 sm:py-40">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-20">
            <p
              className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
                theme === "dark" ? "text-white/30" : "text-slate-500"
              }`}
            >
              {language === "vi" ? "Tác động" : "Impact"}
            </p>
            <h2
              className={`text-[28px] sm:text-[40px] font-semibold tracking-[-0.02em] ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Điều gì trở nên có thể."
                : "What becomes possible."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impacts.map((item, index) => (
              <div
                key={index}
                className={`border-t pt-8 ${
                  theme === "dark" ? "border-white/[0.08]" : "border-slate-200"
                }`}
              >
                <h3
                  className={`text-[20px] font-medium mb-4 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-[16px] leading-relaxed ${
                    theme === "dark" ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Future */}
      <section
        className={`py-28 sm:py-40 ${
          theme === "dark"
            ? "bg-gradient-to-b from-transparent to-[#0a0a0a]"
            : "bg-gradient-to-b from-white to-slate-50"
        }`}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <p
            className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
              theme === "dark" ? "text-white/30" : "text-slate-500"
            }`}
          >
            {language === "vi" ? "Tương lai" : "The Future"}
          </p>
          <h2
            className={`text-[32px] sm:text-[48px] font-semibold tracking-[-0.02em] leading-tight mb-8 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Một thế giới lên kế hoạch"
              : "A world that plans"}
            <br />
            {language === "vi" ? "cho sự sung túc." : "for abundance."}
          </h2>
          <p
            className={`text-[17px] leading-relaxed mb-12 ${
              theme === "dark" ? "text-white/40" : "text-slate-500"
            }`}
          >
            {language === "vi"
              ? "Chúng tôi tin vào một tương lai nơi không ai bị bất ngờ bởi khủng hoảng lương thực. Nơi mọi quyết định về nông nghiệp được hỗ trợ bởi trí tuệ tốt nhất có thể. Nơi AI phục vụ nhu cầu cơ bản nhất của nhân loại."
              : "We believe in a future where no one is surprised by a food crisis. Where every decision about agriculture is informed by the best possible intelligence. Where AI serves humanity's most fundamental need."}
          </p>
        </div>
      </section>

      {/* Team Note */}
      <section
        className={`py-28 sm:py-40 border-t ${
          theme === "dark" ? "border-white/[0.04]" : "border-slate-200"
        }`}
      >
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div
            className={`inline-block rounded-2xl px-10 py-8 ${
              theme === "dark"
                ? "bg-white/[0.02] border border-white/[0.06]"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            <p
              className={`text-[15px] leading-relaxed italic ${
                theme === "dark" ? "text-white/40" : "text-slate-500"
              }`}
            >
              {language === "vi"
                ? '"Chúng tôi đang xây dựng lớp trí tuệ cho sản xuất lương thực toàn cầu. Đây chỉ là khởi đầu."'
                : '"We\'re building the intelligence layer for global food production. This is just the beginning."'}
            </p>
            <p
              className={`text-[13px] mt-4 ${
                theme === "dark" ? "text-white/30" : "text-slate-400"
              }`}
            >
              — {language === "vi" ? "Đội ngũ Trio AI" : "The Trio AI Team"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2
            className={`text-[28px] sm:text-[40px] font-semibold tracking-[-0.02em] ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Tham gia cùng chúng tôi xây dựng"
              : "Join us in building"}
            <br />
            {language === "vi"
              ? "tương lai của nông nghiệp."
              : "the future of agriculture."}
          </h2>

          {/* Academic Origin - Subtle acknowledgment */}
          <div className="mt-8 mb-6">
            <p
              className={`text-[11px] leading-relaxed ${
                theme === "dark" ? "text-white/25" : "text-slate-400"
              }`}
            >
              {language === "vi"
                ? "Được phát triển như một dự án nghiên cứu & tầm nhìn tại"
                : "Developed as a research & vision project at"}
              <br />
              <span
                className={
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }
              >
                Khoa Công nghệ Nông nghiệp, Trường Đại học Công nghệ – Đại học
                Quốc gia Hà Nội.
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/forecast"
              className={`w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {language === "vi" ? "Khám phá Dự báo" : "Explore Forecast"}
            </Link>
            <Link
              href="/premium"
              className={`inline-flex items-center gap-2 text-[15px] font-medium transition-colors ${
                theme === "dark"
                  ? "text-white/60 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Tìm hiểu về Premium"
                : "Learn about Premium"}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
