"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { predictions, YearPrediction } from "../data/predictions";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function ResultsPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<YearPrediction | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stats
  const avgError = predictions.reduce((sum, p) => sum + p.error, 0) / predictions.length;
  const minError = Math.min(...predictions.map((p) => p.error));
  const maxError = Math.max(...predictions.map((p) => p.error));
  const yearsUnder5 = predictions.filter((p) => p.error < 5).length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-[#d2d2d7]">
          <p className="text-[15px] font-semibold text-[#1d1d1f] mb-2">{data.year}</p>
          <div className="space-y-1 text-[13px]">
            <p className="text-[#6e6e73]">
              {language === "vi" ? "Thực tế" : "Actual"}:{" "}
              <span className="text-[#1d1d1f] font-medium">{data.actual}</span> t/ha
            </p>
            <p className="text-[#6e6e73]">
              {language === "vi" ? "Dự báo" : "Predicted"}:{" "}
              <span className="text-[#0066cc] font-medium">{data.predicted}</span> t/ha
            </p>
            <p className="text-[#6e6e73]">
              {language === "vi" ? "Sai số" : "Error"}:{" "}
              <span className={`font-medium ${data.error < 5 ? "text-[#34c759]" : "text-[#ff9500]"}`}>
                {data.error.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.payload) {
      setSelectedYear(data.payload);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero - Trust Statement */}
      <section className="bg-white border-b border-[#d2d2d7]">
        <div className="max-w-[980px] mx-auto px-6 pt-28 pb-10 sm:pt-32 sm:pb-14">
          <p
            className={`text-[11px] tracking-[0.1em] uppercase text-[#6e6e73] mb-3 transition-all duration-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi" ? "Độ tin cậy" : "Reliability"}
          </p>

          <h1
            className={`text-[32px] sm:text-[48px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-[1.1] max-w-[700px] transition-all duration-500 delay-75 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "Mô hình duy trì sai số dưới 6% trong 6 năm liên tiếp."
              : "Model maintains under 6% error for 6 consecutive years."}
          </h1>

          <p
            className={`text-[17px] text-[#6e6e73] mt-4 max-w-[600px] leading-relaxed transition-all duration-500 delay-150 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi"
              ? "Dựa trên dữ liệu thực tế từ Tổng cục Thống kê Việt Nam, giai đoạn 2018–2024."
              : "Based on actual data from Vietnam General Statistics Office, 2018–2024."}
          </p>
        </div>
      </section>

      <div className="max-w-[980px] mx-auto px-6 py-10 sm:py-14">
        {/* Key Trust Metrics */}
        <section className="mb-10 sm:mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 text-center">
              <p className="text-[40px] sm:text-[48px] font-semibold text-[#1d1d1f] leading-none">
                {(100 - avgError).toFixed(0)}%
              </p>
              <p className="text-[13px] text-[#6e6e73] mt-2">
                {language === "vi" ? "Độ chính xác TB" : "Avg Accuracy"}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 text-center">
              <p className="text-[40px] sm:text-[48px] font-semibold text-[#34c759] leading-none">
                {minError.toFixed(1)}%
              </p>
              <p className="text-[13px] text-[#6e6e73] mt-2">
                {language === "vi" ? "Sai số thấp nhất" : "Lowest Error"}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 text-center">
              <p className="text-[40px] sm:text-[48px] font-semibold text-[#1d1d1f] leading-none">
                {yearsUnder5}/{predictions.length}
              </p>
              <p className="text-[13px] text-[#6e6e73] mt-2">
                {language === "vi" ? "Năm sai số <5%" : "Years <5% error"}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 text-center">
              <p className="text-[40px] sm:text-[48px] font-semibold text-[#1d1d1f] leading-none">
                7
              </p>
              <p className="text-[13px] text-[#6e6e73] mt-2">
                {language === "vi" ? "Năm kiểm chứng" : "Years Verified"}
              </p>
            </div>
          </div>
        </section>

        {/* Main Chart - Simplified */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] mb-2">
              {language === "vi" ? "So sánh thực tế và dự báo" : "Actual vs Predicted"}
            </h2>
            <p className="text-[14px] text-[#6e6e73] mb-6">
              {language === "vi"
                ? "Chạm vào cột để xem chi tiết từng năm"
                : "Tap a bar for yearly details"}
            </p>

            <div className="h-[280px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={predictions}
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barCategoryGap="15%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#86868b" }}
                    axisLine={{ stroke: "#e8e8ed" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[2, 2.8]}
                    tick={{ fontSize: 12, fill: "#86868b" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar
                    dataKey="actual"
                    fill="#86868b"
                    name={language === "vi" ? "Thực tế" : "Actual"}
                    radius={[6, 6, 0, 0]}
                    onClick={handleBarClick}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="predicted"
                    fill="#0071e3"
                    name={language === "vi" ? "Dự báo" : "Predicted"}
                    radius={[6, 6, 0, 0]}
                    onClick={handleBarClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#86868b] rounded-sm"></span>
                <span className="text-[#6e6e73]">{language === "vi" ? "Thực tế" : "Actual"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#0071e3] rounded-sm"></span>
                <span className="text-[#6e6e73]">{language === "vi" ? "Dự báo" : "Predicted"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Error Trend - Simplified */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] mb-2">
              {language === "vi" ? "Xu hướng sai số" : "Error Trend"}
            </h2>
            <p className="text-[14px] text-[#6e6e73] mb-6">
              {language === "vi"
                ? "Sai số giảm dần khi mô hình học thêm dữ liệu"
                : "Error decreases as model learns more data"}
            </p>

            <div className="h-[200px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={predictions}
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#86868b" }}
                    axisLine={{ stroke: "#e8e8ed" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 15]}
                    tick={{ fontSize: 12, fill: "#86868b" }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <ReferenceLine
                    y={avgError}
                    stroke="#0066cc"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Bar dataKey="error" radius={[6, 6, 0, 0]} cursor="pointer">
                    {predictions.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.error < 5 ? "#34c759" : "#86868b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#34c759] rounded-sm"></span>
                <span className="text-[#6e6e73]">{language === "vi" ? "Tốt" : "Good"} {"<5%"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] border-t-2 border-dashed border-[#0066cc]"></span>
                <span className="text-[#6e6e73]">TB {avgError.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Insight */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-8 border border-[#e8e8ed]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0071e3] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                  {language === "vi" ? "Tại sao bạn có thể tin tưởng?" : "Why you can trust this?"}
                </h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                  {language === "vi"
                    ? "Năm 2024 đạt sai số chỉ 0.34% — gần như hoàn hảo. Độ chính xác tăng dần vì mô hình được huấn luyện với nhiều dữ liệu hơn mỗi năm. Kết quả được đối chiếu với số liệu thống kê chính thức."
                    : "2024 achieved only 0.34% error — nearly perfect. Accuracy improves as the model trains with more data each year. Results verified against official statistics."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Year Detail */}
        {selectedYear && (
          <section className="mb-10 sm:mb-14">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0066cc]/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[11px] text-[#0066cc] uppercase tracking-wide mb-1">
                    {language === "vi" ? "Chi tiết năm" : "Year Details"}
                  </p>
                  <h3 className="text-[28px] font-semibold text-[#1d1d1f]">{selectedYear.year}</h3>
                </div>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="w-8 h-8 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p className="text-[13px] text-[#6e6e73] mb-1">{language === "vi" ? "Thực tế" : "Actual"}</p>
                  <p className="text-[20px] font-semibold text-[#1d1d1f]">{selectedYear.actual} t/ha</p>
                </div>
                <div>
                  <p className="text-[13px] text-[#6e6e73] mb-1">{language === "vi" ? "Dự báo" : "Predicted"}</p>
                  <p className="text-[20px] font-semibold text-[#0066cc]">{selectedYear.predicted} t/ha</p>
                </div>
                <div>
                  <p className="text-[13px] text-[#6e6e73] mb-1">{language === "vi" ? "Sai số" : "Error"}</p>
                  <p className={`text-[20px] font-semibold ${selectedYear.error < 5 ? "text-[#34c759]" : "text-[#ff9500]"}`}>
                    {selectedYear.error.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#6e6e73] mb-1">{language === "vi" ? "Dữ liệu huấn luyện" : "Training Data"}</p>
                  <p className="text-[20px] font-semibold text-[#1d1d1f]">{selectedYear.trainYears} {language === "vi" ? "năm" : "years"}</p>
                </div>
              </div>

              {selectedYear.explanation && (
                <div className="mt-6 pt-6 border-t border-[#e8e8ed]">
                  <p className="text-[15px] text-[#1d1d1f] leading-relaxed">{selectedYear.explanation}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        <section>
          <div className="bg-[#1d1d1f] rounded-2xl p-8 text-center">
            <h3 className="text-[24px] font-semibold text-white mb-3">
              {language === "vi"
                ? "Tin tưởng rồi? Xem dự báo năm tới."
                : "Convinced? See next year's forecast."}
            </h3>
            <p className="text-[15px] text-[#86868b] mb-6 max-w-[400px] mx-auto">
              {language === "vi"
                ? "Áp dụng độ tin cậy này vào quyết định kinh doanh của bạn."
                : "Apply this reliability to your business decisions."}
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
