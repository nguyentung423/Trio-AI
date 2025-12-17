"use client";

import { useState, useEffect } from "react";
import { predictions } from "../data/predictions";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function ComparePage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort by error
  const sortedByError = [...predictions].sort((a, b) => a.error - b.error);
  const highRiskYears = predictions.filter((p) => p.error > 5);

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
            {language === "vi" ? "Đánh giá rủi ro" : "Risk Assessment"}
          </p>

          <h1
            className={`text-[32px] sm:text-[48px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-[1.1] max-w-[700px] transition-all duration-500 delay-75 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "Khi nào bạn nên cẩn trọng?"
              : "When should you be cautious?"}
          </h1>

          <p
            className={`text-[17px] text-[#6e6e73] mt-4 max-w-[600px] leading-relaxed transition-all duration-500 delay-150 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "Không phải mọi dự báo đều chính xác như nhau. Hiểu rủi ro giúp bạn ra quyết định tốt hơn."
              : "Not all forecasts are equally accurate. Understanding risk helps you decide better."}
          </p>
        </div>
      </section>

      <div className="max-w-[980px] mx-auto px-6 py-10 sm:py-14">
        {/* Risk Summary */}
        <section className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Low Risk */}
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#e8f5e9] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#2e7d32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide">
                    {language === "vi" ? "Độ tin cậy cao" : "High Confidence"}
                  </p>
                  <p className="text-[20px] font-semibold text-[#1d1d1f]">
                    {predictions.filter((p) => p.error < 5).length}/{predictions.length} {language === "vi" ? "năm" : "years"}
                  </p>
                </div>
              </div>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                {language === "vi"
                  ? "Các năm có sai số dưới 5%. Bạn có thể tin tưởng dự báo cho các điều kiện tương tự."
                  : "Years with under 5% error. You can trust forecasts for similar conditions."}
              </p>
            </div>

            {/* High Risk */}
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#fff3e0] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#e65100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] uppercase tracking-wide">
                    {language === "vi" ? "Cần cẩn trọng" : "Use Caution"}
                  </p>
                  <p className="text-[20px] font-semibold text-[#1d1d1f]">
                    {highRiskYears.length}/{predictions.length} {language === "vi" ? "năm" : "years"}
                  </p>
                </div>
              </div>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                {language === "vi"
                  ? "Các năm có sai số trên 5%. Thường xảy ra khi thời tiết biến động mạnh."
                  : "Years with over 5% error. Usually occurs during extreme weather."}
              </p>
            </div>
          </div>
        </section>

        {/* When to be Cautious */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-[#fff3e0] rounded-2xl p-6 sm:p-8 border border-[#ffe0b2]">
            <h2 className="text-[20px] font-semibold text-[#e65100] mb-4">
              {language === "vi" ? "Khi nào nên cẩn trọng hơn?" : "When to be more cautious?"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-[#e65100]">•</span>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "El Niño hoặc La Niña mạnh — dự báo có thể dao động 10-15%"
                    : "Strong El Niño or La Niña — forecast may vary 10-15%"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#e65100]">•</span>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Mùa khô kéo dài bất thường — cân nhắc điều chỉnh kế hoạch"
                    : "Unusually long dry season — consider plan adjustments"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#e65100]">•</span>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Nhiệt độ cao bất thường (>33°C kéo dài) — rủi ro giảm năng suất"
                    : "Abnormal high temp (>33°C extended) — yield drop risk"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#e65100]">•</span>
                <p className="text-[15px] text-[#1d1d1f]">
                  {language === "vi"
                    ? "Mưa lớn bất thường tháng 2-3 — ảnh hưởng ra hoa"
                    : "Unusual heavy rain Feb-Mar — flowering impact"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Year by Year */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] mb-6">
            {language === "vi" ? "Chi tiết từng năm" : "Year by Year"}
          </h2>

          <div className="space-y-3">
            {sortedByError.map((p, index) => (
              <div
                key={p.year}
                className={`bg-white rounded-2xl p-5 sm:p-6 ${
                  p.error < 5 ? "border-l-4 border-l-[#34c759]" : "border-l-4 border-l-[#ff9500]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[24px] font-semibold text-[#6e6e73]">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-[20px] font-semibold text-[#1d1d1f]">{p.year}</p>
                      <p className="text-[13px] text-[#6e6e73]">
                        {language === "vi" ? `Học từ ${p.trainYears} năm dữ liệu` : `Trained on ${p.trainYears} years`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-center">
                      <p className="text-[11px] text-[#6e6e73] uppercase">{language === "vi" ? "Thực tế" : "Actual"}</p>
                      <p className="text-[17px] font-semibold text-[#1d1d1f]">{p.actual}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-[#6e6e73] uppercase">{language === "vi" ? "Dự báo" : "Predicted"}</p>
                      <p className="text-[17px] font-semibold text-[#0066cc]">{p.predicted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-[#6e6e73] uppercase">{language === "vi" ? "Sai số" : "Error"}</p>
                      <p className={`text-[17px] font-semibold ${p.error < 5 ? "text-[#34c759]" : "text-[#ff9500]"}`}>
                        {p.error.toFixed(1)}%
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className={`px-3 py-1 text-[13px] font-medium rounded-full ${
                        p.error < 5 ? "bg-[#e8f5e9] text-[#2e7d32]" : "bg-[#fff3e0] text-[#e65100]"
                      }`}>
                        {p.error < 5 
                          ? (language === "vi" ? "Ổn định" : "Stable")
                          : (language === "vi" ? "Cẩn trọng" : "Caution")
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {p.explanation && (
                  <p className="text-[14px] text-[#6e6e73] mt-3 pt-3 border-t border-[#e8e8ed]">
                    {p.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-[#1d1d1f] rounded-2xl p-8 text-center">
            <h3 className="text-[24px] font-semibold text-white mb-3">
              {language === "vi"
                ? "Hiểu rủi ro rồi? Xem dự báo năm tới."
                : "Understand the risk? See next year's forecast."}
            </h3>
            <p className="text-[15px] text-[#86868b] mb-6 max-w-[400px] mx-auto">
              {language === "vi"
                ? "Áp dụng hiểu biết này vào quyết định kinh doanh."
                : "Apply this knowledge to your business decisions."}
            </p>
            <Link
              href="/forecast"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] text-white text-[15px] font-medium rounded-full hover:bg-[#0077ED] transition-colors"
            >
              {language === "vi" ? "Xem dự báo 2026" : "View 2026 Forecast"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
