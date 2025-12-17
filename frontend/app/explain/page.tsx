"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function ExplainPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const factors = [
    {
      icon: "☀️",
      name: language === "vi" ? "Nhiệt độ" : "Temperature",
      impact: 35,
      description: language === "vi" 
        ? "Nhiệt độ trung bình ảnh hưởng trực tiếp đến quá trình ra hoa và phát triển quả."
        : "Average temperature directly affects flowering and fruit development.",
    },
    {
      icon: "💧",
      name: language === "vi" ? "Lượng mưa" : "Rainfall",
      impact: 30,
      description: language === "vi"
        ? "Phân bố lượng mưa theo mùa quyết định sức khỏe cây và chất lượng hạt."
        : "Seasonal rainfall distribution determines tree health and bean quality.",
    },
    {
      icon: "🌡️",
      name: language === "vi" ? "Độ ẩm" : "Humidity",
      impact: 20,
      description: language === "vi"
        ? "Độ ẩm cao có thể gây bệnh nấm, nhưng cũng cần thiết trong giai đoạn ra hoa."
        : "High humidity can cause fungal diseases, but is needed during flowering.",
    },
    {
      icon: "📊",
      name: language === "vi" ? "Xu hướng lịch sử" : "Historical Trend",
      impact: 15,
      description: language === "vi"
        ? "Năng suất các năm trước giúp dự báo chu kỳ sinh học của cây."
        : "Previous yields help predict the biological cycle of trees.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero */}
      <section className="bg-white border-b border-[#d2d2d7]">
        <div className="max-w-[980px] mx-auto px-6 pt-28 pb-10 sm:pt-32 sm:pb-14">
          <p
            className={`text-[11px] tracking-[0.1em] uppercase text-[#6e6e73] mb-3 transition-all duration-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi" ? "Phương pháp" : "Methodology"}
          </p>

          <h1
            className={`text-[32px] sm:text-[48px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-[1.1] max-w-[700px] transition-all duration-500 delay-75 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "Mô hình học từ dữ liệu thực"
              : "A model trained on real data"}
          </h1>

          <p
            className={`text-[17px] text-[#6e6e73] mt-4 max-w-[600px] leading-relaxed transition-all duration-500 delay-150 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "35 năm dữ liệu thời tiết và năng suất cà phê Đắk Lắk được phân tích để đưa ra dự báo đáng tin cậy."
              : "35 years of weather and Dak Lak coffee yield data analyzed for reliable forecasts."}
          </p>
        </div>
      </section>

      <div className="max-w-[980px] mx-auto px-6 py-10 sm:py-14">
        {/* How it works - Simple */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] mb-6">
            {language === "vi" ? "Cách hệ thống hoạt động" : "How the system works"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#e3f2fd] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📥</span>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                {language === "vi" ? "1. Thu thập dữ liệu" : "1. Data Collection"}
              </h3>
              <p className="text-[14px] text-[#6e6e73] leading-relaxed">
                {language === "vi"
                  ? "Dữ liệu thời tiết từ NASA và sản lượng cà phê từ Cục Thống kê Đắk Lắk."
                  : "Weather data from NASA and coffee yields from Dak Lak Statistics Office."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#e8f5e9] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                {language === "vi" ? "2. Phân tích mẫu" : "2. Pattern Analysis"}
              </h3>
              <p className="text-[14px] text-[#6e6e73] leading-relaxed">
                {language === "vi"
                  ? "AI học mối quan hệ giữa thời tiết và năng suất qua 35 năm dữ liệu."
                  : "AI learns relationships between weather and yield from 35 years of data."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#fff3e0] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                {language === "vi" ? "3. Dự báo" : "3. Prediction"}
              </h3>
              <p className="text-[14px] text-[#6e6e73] leading-relaxed">
                {language === "vi"
                  ? "Dựa vào thời tiết hiện tại và xu hướng, mô hình dự báo năng suất năm tới."
                  : "Based on current weather and trends, the model forecasts next year's yield."}
              </p>
            </div>
          </div>
        </section>

        {/* What influences the forecast */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] mb-6">
            {language === "vi" ? "Yếu tố nào ảnh hưởng dự báo?" : "What influences the forecast?"}
          </h2>

          <div className="space-y-4">
            {factors.map((factor, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{factor.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{factor.name}</h3>
                      <span className="text-[15px] font-medium text-[#0066cc]">{factor.impact}%</span>
                    </div>
                    <div className="w-full bg-[#e8e8ed] rounded-full h-2 mb-3">
                      <div
                        className="bg-[#0071e3] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${factor.impact}%` }}
                      />
                    </div>
                    <p className="text-[14px] text-[#6e6e73]">{factor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-[#e8f5e9] rounded-2xl p-6 sm:p-8 border border-[#c8e6c9]">
            <h2 className="text-[20px] font-semibold text-[#2e7d32] mb-4">
              {language === "vi" ? "Tại sao bạn có thể tin tưởng?" : "Why can you trust this?"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#2e7d32] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Dữ liệu từ nguồn chính thống (NASA, Cục Thống kê)"
                    : "Data from official sources (NASA, Statistics Office)"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#2e7d32] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Kiểm nghiệm trên 15 năm dữ liệu thực tế"
                    : "Validated on 15 years of real data"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#2e7d32] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Sai số dưới 5% trong điều kiện bình thường"
                    : "Under 5% error in normal conditions"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#2e7d32] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Cập nhật dữ liệu thời tiết hàng tuần"
                    : "Weather data updated weekly"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details (Collapsible) */}
        <section className="mb-10 sm:mb-14">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-5 sm:p-6 text-left hover:bg-[#fafafa] transition-colors"
          >
            <div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                {language === "vi" ? "Chi tiết kỹ thuật" : "Technical Details"}
              </h3>
              <p className="text-[14px] text-[#6e6e73]">
                {language === "vi"
                  ? "Thông tin dành cho chuyên gia và nhà nghiên cứu"
                  : "Information for experts and researchers"}
              </p>
            </div>
            <svg
              className={`w-6 h-6 text-[#6e6e73] transition-transform ${showTechnical ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTechnical && (
            <div className="bg-white rounded-b-2xl p-6 -mt-2 border-t border-[#e8e8ed]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                    {language === "vi" ? "Mô hình" : "Model"}
                  </p>
                  <p className="text-[15px] text-[#1d1d1f]">XGBoost Regressor</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                    {language === "vi" ? "Số features" : "Features"}
                  </p>
                  <p className="text-[15px] text-[#1d1d1f]">24 weather features</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                    {language === "vi" ? "Dữ liệu huấn luyện" : "Training Data"}
                  </p>
                  <p className="text-[15px] text-[#1d1d1f]">1990-2025 (35 years)</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                    {language === "vi" ? "Phương pháp validation" : "Validation Method"}
                  </p>
                  <p className="text-[15px] text-[#1d1d1f]">Walk-forward (expanding window)</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">MAE</p>
                  <p className="text-[15px] text-[#1d1d1f]">0.089 t/ha</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">MAPE</p>
                  <p className="text-[15px] text-[#1d1d1f]">3.42%</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <section>
          <div className="bg-[#1d1d1f] rounded-2xl p-8 text-center">
            <h3 className="text-[24px] font-semibold text-white mb-3">
              {language === "vi"
                ? "Sẵn sàng xem dự báo?"
                : "Ready to see the forecast?"}
            </h3>
            <p className="text-[15px] text-[#86868b] mb-6 max-w-[400px] mx-auto">
              {language === "vi"
                ? "Dự báo năng suất cà phê 2026 dựa trên dữ liệu thực."
                : "2026 coffee yield forecast based on real data."}
            </p>
            <Link
              href="/forecast"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] text-white text-[15px] font-medium rounded-full hover:bg-[#0077ED] transition-colors"
            >
              {language === "vi" ? "Xem dự báo ngay" : "View Forecast Now"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
