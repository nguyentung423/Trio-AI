/**
 * Global Forecast Page
 * Interactive demo for exploring crop predictions worldwide
 * Bilingual: Vietnamese (default) / English
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { predictScenario, ScenarioKey } from "@/app/api/backend";
import { getScenarioContent } from "@/lib/scenarioContent";

// Danh sách cây trồng phổ biến Việt Nam
const cropsVi = [
  { id: "coffee", name: "Cà phê", emoji: "☕" },
  { id: "rice", name: "Lúa gạo", emoji: "🌾" },
  { id: "rubber", name: "Cao su", emoji: "🌳" },
  { id: "pepper", name: "Hồ tiêu", emoji: "🌶️" },
  { id: "cashew", name: "Điều", emoji: "🥜" },
  { id: "tea", name: "Chè", emoji: "🍵" },
  { id: "corn", name: "Ngô", emoji: "🌽" },
  { id: "cassava", name: "Sắn", emoji: "🥔" },
  { id: "sugarcane", name: "Mía", emoji: "🎋" },
  { id: "coconut", name: "Dừa", emoji: "🥥" },
  { id: "dragon-fruit", name: "Thanh long", emoji: "🐉" },
  { id: "durian", name: "Sầu riêng", emoji: "🍈" },
  { id: "mango", name: "Xoài", emoji: "🥭" },
  { id: "longan", name: "Nhãn", emoji: "🫐" },
  { id: "lychee", name: "Vải", emoji: "🍒" },
  { id: "peanut", name: "Lạc (Đậu phộng)", emoji: "🥜" },
  { id: "soybean", name: "Đậu nành", emoji: "🌿" },
  { id: "vegetable", name: "Rau màu", emoji: "🥬" },
  { id: "cocoa", name: "Ca cao", emoji: "🍫" },
  { id: "macadamia", name: "Mắc ca", emoji: "🌰" },
];

const cropsEn = [
  { id: "coffee", name: "Coffee", emoji: "☕" },
  { id: "rice", name: "Rice", emoji: "🌾" },
  { id: "rubber", name: "Rubber", emoji: "🌳" },
  { id: "pepper", name: "Black Pepper", emoji: "🌶️" },
  { id: "cashew", name: "Cashew", emoji: "🥜" },
  { id: "tea", name: "Tea", emoji: "🍵" },
  { id: "corn", name: "Corn", emoji: "🌽" },
  { id: "cassava", name: "Cassava", emoji: "🥔" },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋" },
  { id: "coconut", name: "Coconut", emoji: "🥥" },
  { id: "dragon-fruit", name: "Dragon Fruit", emoji: "🐉" },
  { id: "durian", name: "Durian", emoji: "🍈" },
  { id: "mango", name: "Mango", emoji: "🥭" },
  { id: "longan", name: "Longan", emoji: "🫐" },
  { id: "lychee", name: "Lychee", emoji: "🍒" },
  { id: "peanut", name: "Peanut", emoji: "🥜" },
  { id: "soybean", name: "Soybean", emoji: "🌿" },
  { id: "vegetable", name: "Vegetables", emoji: "🥬" },
  { id: "cocoa", name: "Cocoa", emoji: "🍫" },
  { id: "macadamia", name: "Macadamia", emoji: "🌰" },
];

// Danh sách 63 tỉnh thành Việt Nam theo vùng
const regionsVi = [
  // Đông Bắc Bộ
  { id: "ha-giang", name: "Hà Giang", continent: "Đông Bắc Bộ" },
  { id: "cao-bang", name: "Cao Bằng", continent: "Đông Bắc Bộ" },
  { id: "bac-kan", name: "Bắc Kạn", continent: "Đông Bắc Bộ" },
  { id: "tuyen-quang", name: "Tuyên Quang", continent: "Đông Bắc Bộ" },
  { id: "lang-son", name: "Lạng Sơn", continent: "Đông Bắc Bộ" },
  { id: "thai-nguyen", name: "Thái Nguyên", continent: "Đông Bắc Bộ" },
  { id: "bac-giang", name: "Bắc Giang", continent: "Đông Bắc Bộ" },
  { id: "quang-ninh", name: "Quảng Ninh", continent: "Đông Bắc Bộ" },
  // Tây Bắc Bộ
  { id: "lai-chau", name: "Lai Châu", continent: "Tây Bắc Bộ" },
  { id: "dien-bien", name: "Điện Biên", continent: "Tây Bắc Bộ" },
  { id: "son-la", name: "Sơn La", continent: "Tây Bắc Bộ" },
  { id: "hoa-binh", name: "Hòa Bình", continent: "Tây Bắc Bộ" },
  { id: "lao-cai", name: "Lào Cai", continent: "Tây Bắc Bộ" },
  { id: "yen-bai", name: "Yên Bái", continent: "Tây Bắc Bộ" },
  { id: "phu-tho", name: "Phú Thọ", continent: "Tây Bắc Bộ" },
  // Đồng bằng sông Hồng
  { id: "ha-noi", name: "Hà Nội", continent: "Đồng bằng sông Hồng" },
  { id: "vinh-phuc", name: "Vĩnh Phúc", continent: "Đồng bằng sông Hồng" },
  { id: "bac-ninh", name: "Bắc Ninh", continent: "Đồng bằng sông Hồng" },
  { id: "hai-duong", name: "Hải Dương", continent: "Đồng bằng sông Hồng" },
  { id: "hai-phong", name: "Hải Phòng", continent: "Đồng bằng sông Hồng" },
  { id: "hung-yen", name: "Hưng Yên", continent: "Đồng bằng sông Hồng" },
  { id: "thai-binh", name: "Thái Bình", continent: "Đồng bằng sông Hồng" },
  { id: "ha-nam", name: "Hà Nam", continent: "Đồng bằng sông Hồng" },
  { id: "nam-dinh", name: "Nam Định", continent: "Đồng bằng sông Hồng" },
  { id: "ninh-binh", name: "Ninh Bình", continent: "Đồng bằng sông Hồng" },
  // Bắc Trung Bộ
  { id: "thanh-hoa", name: "Thanh Hóa", continent: "Bắc Trung Bộ" },
  { id: "nghe-an", name: "Nghệ An", continent: "Bắc Trung Bộ" },
  { id: "ha-tinh", name: "Hà Tĩnh", continent: "Bắc Trung Bộ" },
  { id: "quang-binh", name: "Quảng Bình", continent: "Bắc Trung Bộ" },
  { id: "quang-tri", name: "Quảng Trị", continent: "Bắc Trung Bộ" },
  { id: "thua-thien-hue", name: "Thừa Thiên Huế", continent: "Bắc Trung Bộ" },
  // Duyên hải Nam Trung Bộ
  { id: "da-nang", name: "Đà Nẵng", continent: "Duyên hải Nam Trung Bộ" },
  { id: "quang-nam", name: "Quảng Nam", continent: "Duyên hải Nam Trung Bộ" },
  { id: "quang-ngai", name: "Quảng Ngãi", continent: "Duyên hải Nam Trung Bộ" },
  { id: "binh-dinh", name: "Bình Định", continent: "Duyên hải Nam Trung Bộ" },
  { id: "phu-yen", name: "Phú Yên", continent: "Duyên hải Nam Trung Bộ" },
  { id: "khanh-hoa", name: "Khánh Hòa", continent: "Duyên hải Nam Trung Bộ" },
  { id: "ninh-thuan", name: "Ninh Thuận", continent: "Duyên hải Nam Trung Bộ" },
  { id: "binh-thuan", name: "Bình Thuận", continent: "Duyên hải Nam Trung Bộ" },
  // Tây Nguyên
  { id: "kon-tum", name: "Kon Tum", continent: "Tây Nguyên" },
  { id: "gia-lai", name: "Gia Lai", continent: "Tây Nguyên" },
  { id: "dak-lak", name: "Đắk Lắk", continent: "Tây Nguyên" },
  { id: "dak-nong", name: "Đắk Nông", continent: "Tây Nguyên" },
  { id: "lam-dong", name: "Lâm Đồng", continent: "Tây Nguyên" },
  // Đông Nam Bộ
  { id: "binh-phuoc", name: "Bình Phước", continent: "Đông Nam Bộ" },
  { id: "tay-ninh", name: "Tây Ninh", continent: "Đông Nam Bộ" },
  { id: "binh-duong", name: "Bình Dương", continent: "Đông Nam Bộ" },
  { id: "dong-nai", name: "Đồng Nai", continent: "Đông Nam Bộ" },
  {
    id: "ba-ria-vung-tau",
    name: "Bà Rịa - Vũng Tàu",
    continent: "Đông Nam Bộ",
  },
  { id: "ho-chi-minh", name: "TP. Hồ Chí Minh", continent: "Đông Nam Bộ" },
  // Đồng bằng sông Cửu Long
  { id: "long-an", name: "Long An", continent: "Đồng bằng sông Cửu Long" },
  {
    id: "tien-giang",
    name: "Tiền Giang",
    continent: "Đồng bằng sông Cửu Long",
  },
  { id: "ben-tre", name: "Bến Tre", continent: "Đồng bằng sông Cửu Long" },
  { id: "tra-vinh", name: "Trà Vinh", continent: "Đồng bằng sông Cửu Long" },
  { id: "vinh-long", name: "Vĩnh Long", continent: "Đồng bằng sông Cửu Long" },
  { id: "dong-thap", name: "Đồng Tháp", continent: "Đồng bằng sông Cửu Long" },
  { id: "an-giang", name: "An Giang", continent: "Đồng bằng sông Cửu Long" },
  {
    id: "kien-giang",
    name: "Kiên Giang",
    continent: "Đồng bằng sông Cửu Long",
  },
  { id: "can-tho", name: "Cần Thơ", continent: "Đồng bằng sông Cửu Long" },
  { id: "hau-giang", name: "Hậu Giang", continent: "Đồng bằng sông Cửu Long" },
  { id: "soc-trang", name: "Sóc Trăng", continent: "Đồng bằng sông Cửu Long" },
  { id: "bac-lieu", name: "Bạc Liêu", continent: "Đồng bằng sông Cửu Long" },
  { id: "ca-mau", name: "Cà Mau", continent: "Đồng bằng sông Cửu Long" },
];

const regionsEn = [
  // Northeast
  { id: "ha-giang", name: "Ha Giang", continent: "Northeast" },
  { id: "cao-bang", name: "Cao Bang", continent: "Northeast" },
  { id: "bac-kan", name: "Bac Kan", continent: "Northeast" },
  { id: "tuyen-quang", name: "Tuyen Quang", continent: "Northeast" },
  { id: "lang-son", name: "Lang Son", continent: "Northeast" },
  { id: "thai-nguyen", name: "Thai Nguyen", continent: "Northeast" },
  { id: "bac-giang", name: "Bac Giang", continent: "Northeast" },
  { id: "quang-ninh", name: "Quang Ninh", continent: "Northeast" },
  // Northwest
  { id: "lai-chau", name: "Lai Chau", continent: "Northwest" },
  { id: "dien-bien", name: "Dien Bien", continent: "Northwest" },
  { id: "son-la", name: "Son La", continent: "Northwest" },
  { id: "hoa-binh", name: "Hoa Binh", continent: "Northwest" },
  { id: "lao-cai", name: "Lao Cai", continent: "Northwest" },
  { id: "yen-bai", name: "Yen Bai", continent: "Northwest" },
  { id: "phu-tho", name: "Phu Tho", continent: "Northwest" },
  // Red River Delta
  { id: "ha-noi", name: "Hanoi", continent: "Red River Delta" },
  { id: "vinh-phuc", name: "Vinh Phuc", continent: "Red River Delta" },
  { id: "bac-ninh", name: "Bac Ninh", continent: "Red River Delta" },
  { id: "hai-duong", name: "Hai Duong", continent: "Red River Delta" },
  { id: "hai-phong", name: "Hai Phong", continent: "Red River Delta" },
  { id: "hung-yen", name: "Hung Yen", continent: "Red River Delta" },
  { id: "thai-binh", name: "Thai Binh", continent: "Red River Delta" },
  { id: "ha-nam", name: "Ha Nam", continent: "Red River Delta" },
  { id: "nam-dinh", name: "Nam Dinh", continent: "Red River Delta" },
  { id: "ninh-binh", name: "Ninh Binh", continent: "Red River Delta" },
  // North Central Coast
  { id: "thanh-hoa", name: "Thanh Hoa", continent: "North Central Coast" },
  { id: "nghe-an", name: "Nghe An", continent: "North Central Coast" },
  { id: "ha-tinh", name: "Ha Tinh", continent: "North Central Coast" },
  { id: "quang-binh", name: "Quang Binh", continent: "North Central Coast" },
  { id: "quang-tri", name: "Quang Tri", continent: "North Central Coast" },
  {
    id: "thua-thien-hue",
    name: "Thua Thien Hue",
    continent: "North Central Coast",
  },
  // South Central Coast
  { id: "da-nang", name: "Da Nang", continent: "South Central Coast" },
  { id: "quang-nam", name: "Quang Nam", continent: "South Central Coast" },
  { id: "quang-ngai", name: "Quang Ngai", continent: "South Central Coast" },
  { id: "binh-dinh", name: "Binh Dinh", continent: "South Central Coast" },
  { id: "phu-yen", name: "Phu Yen", continent: "South Central Coast" },
  { id: "khanh-hoa", name: "Khanh Hoa", continent: "South Central Coast" },
  { id: "ninh-thuan", name: "Ninh Thuan", continent: "South Central Coast" },
  { id: "binh-thuan", name: "Binh Thuan", continent: "South Central Coast" },
  // Central Highlands
  { id: "kon-tum", name: "Kon Tum", continent: "Central Highlands" },
  { id: "gia-lai", name: "Gia Lai", continent: "Central Highlands" },
  { id: "dak-lak", name: "Dak Lak", continent: "Central Highlands" },
  { id: "dak-nong", name: "Dak Nong", continent: "Central Highlands" },
  { id: "lam-dong", name: "Lam Dong", continent: "Central Highlands" },
  // Southeast
  { id: "binh-phuoc", name: "Binh Phuoc", continent: "Southeast" },
  { id: "tay-ninh", name: "Tay Ninh", continent: "Southeast" },
  { id: "binh-duong", name: "Binh Duong", continent: "Southeast" },
  { id: "dong-nai", name: "Dong Nai", continent: "Southeast" },
  { id: "ba-ria-vung-tau", name: "Ba Ria - Vung Tau", continent: "Southeast" },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", continent: "Southeast" },
  // Mekong Delta
  { id: "long-an", name: "Long An", continent: "Mekong Delta" },
  { id: "tien-giang", name: "Tien Giang", continent: "Mekong Delta" },
  { id: "ben-tre", name: "Ben Tre", continent: "Mekong Delta" },
  { id: "tra-vinh", name: "Tra Vinh", continent: "Mekong Delta" },
  { id: "vinh-long", name: "Vinh Long", continent: "Mekong Delta" },
  { id: "dong-thap", name: "Dong Thap", continent: "Mekong Delta" },
  { id: "an-giang", name: "An Giang", continent: "Mekong Delta" },
  { id: "kien-giang", name: "Kien Giang", continent: "Mekong Delta" },
  { id: "can-tho", name: "Can Tho", continent: "Mekong Delta" },
  { id: "hau-giang", name: "Hau Giang", continent: "Mekong Delta" },
  { id: "soc-trang", name: "Soc Trang", continent: "Mekong Delta" },
  { id: "bac-lieu", name: "Bac Lieu", continent: "Mekong Delta" },
  { id: "ca-mau", name: "Ca Mau", continent: "Mekong Delta" },
];

const years = ["2026", "2027", "2028", "2029", "2030"];

// Map UI scenario IDs to API scenario keys
const scenarioIdToApiKey: Record<string, ScenarioKey> = {
  baseline: "normal",
  favorable: "favorable",
  "el-nino": "el_nino",
  "la-nina": "la_nina",
  drought: "severe_drought",
  storm: "major_storm",
};

const scenariosVi = [
  {
    id: "baseline",
    name: "Bình thường",
    description: "Thời tiết diễn biến như trung bình nhiều năm",
  },
  {
    id: "favorable",
    name: "Thuận lợi",
    description: "Mưa thuận gió hòa, ít sâu bệnh",
  },
  {
    id: "el-nino",
    name: "El Niño",
    description: "Hạn hán, nắng nóng kéo dài",
  },
  {
    id: "la-nina",
    name: "La Niña",
    description: "Mưa nhiều, lũ lụt, ngập úng",
  },
  {
    id: "drought",
    name: "Hạn hán nặng",
    description: "Thiếu nước nghiêm trọng, mất mùa",
  },
  {
    id: "storm",
    name: "Bão lớn",
    description: "Ảnh hưởng bão, gió mạnh, mưa to",
  },
];

const scenariosEn = [
  {
    id: "baseline",
    name: "Normal",
    description: "Weather follows historical averages",
  },
  {
    id: "favorable",
    name: "Favorable",
    description: "Good rainfall, minimal pests",
  },
  {
    id: "el-nino",
    name: "El Niño",
    description: "Drought, prolonged heat waves",
  },
  {
    id: "la-nina",
    name: "La Niña",
    description: "Heavy rain, flooding, waterlogging",
  },
  {
    id: "drought",
    name: "Severe Drought",
    description: "Serious water shortage, crop failure",
  },
  {
    id: "storm",
    name: "Major Storm",
    description: "Typhoon impact, strong winds, heavy rain",
  },
];

export default function ForecastPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("coffee");
  const [selectedRegion, setSelectedRegion] = useState("dak-lak");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedScenario, setSelectedScenario] = useState("baseline");
  const [prediction, setPrediction] = useState({
    yield: "2.80",
    confidence: "high",
  });
  const [isComputing, setIsComputing] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Get language-specific data
  const crops = language === "vi" ? cropsVi : cropsEn;
  const regions = language === "vi" ? regionsVi : regionsEn;
  const scenarios = language === "vi" ? scenariosVi : scenariosEn;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Call real API for Coffee + Đắk Lắk + 2026, otherwise show "Coming soon"
  const computePrediction = useCallback(async () => {
    const isCoffee = selectedCrop === "coffee";
    const isDakLak = selectedRegion === "dak-lak";
    const isYear2026 = selectedYear === "2026";

    // Only call API for Coffee + Đắk Lắk + 2026
    if (!isCoffee || !isDakLak || !isYear2026) {
      setPrediction({ yield: "0", confidence: "high" });
      setPredictionError(null);
      setIsComputing(false);
      return;
    }

    setIsComputing(true);
    setPredictionError(null);

    try {
      const apiScenario = scenarioIdToApiKey[selectedScenario] || "normal";
      const result = await predictScenario({
        province: "Đắk Lắk",
        year: parseInt(selectedYear),
        scenario: apiScenario,
      });

      const confidenceLevel =
        selectedScenario === "drought" || selectedScenario === "storm"
          ? "moderate"
          : "high";

      setPrediction({
        yield: result.predicted_yield_ton_ha.toFixed(2),
        confidence: confidenceLevel,
      });
      setPredictionError(null);
    } catch (err) {
      console.error("Prediction error:", err);
      // Fallback to mock value on error
      const hash = (
        selectedCrop +
        selectedRegion +
        selectedYear +
        selectedScenario
      )
        .split("")
        .reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0);

      let baseYield = 2 + Math.abs(hash % 100) / 100;

      // Adjust based on scenario
      if (selectedScenario === "favorable") baseYield *= 1.15;
      if (selectedScenario === "el-nino") baseYield *= 0.85;
      if (selectedScenario === "la-nina") baseYield *= 0.92;
      if (selectedScenario === "drought") baseYield *= 0.65;
      if (selectedScenario === "storm") baseYield *= 0.75;

      const confidenceLevel =
        selectedScenario === "drought" || selectedScenario === "storm"
          ? "moderate"
          : "high";

      setPrediction({
        yield: baseYield.toFixed(2),
        confidence: confidenceLevel,
      });
      setPredictionError(
        language === "vi"
          ? "Không thể kết nối API, hiển thị giá trị mẫu"
          : "API unavailable, showing sample value"
      );
    } finally {
      setIsComputing(false);
    }
  }, [selectedCrop, selectedRegion, selectedYear, selectedScenario, language]);

  useEffect(() => {
    computePrediction();
  }, [computePrediction]);

  const selectedCropData = crops.find((c) => c.id === selectedCrop);
  const selectedRegionData = regions.find((r) => r.id === selectedRegion);
  const isCoffee = selectedCrop === "coffee";

  return (
    <div
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <section className="pt-28 pb-12">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <p
            className={`text-[11px] tracking-[0.25em] uppercase mb-4 transition-all duration-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            } ${theme === "dark" ? "text-white/30" : "text-slate-500"}`}
          >
            {language === "vi"
              ? "Dự báo Năng suất Việt Nam"
              : "Vietnam Yield Forecast"}
          </p>
          <h1
            className={`text-[36px] sm:text-[52px] font-semibold leading-[1.1] tracking-[-0.03em] transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {language === "vi" ? "Dự báo năng suất" : "Yield prediction"}
            <br />
            {language === "vi"
              ? "cho 63 tỉnh thành Việt Nam"
              : "for 63 provinces of Vietnam"}
          </h1>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-12">
        <div className="max-w-[900px] mx-auto px-6">
          <div
            className={`rounded-3xl p-8 sm:p-12 ${
              theme === "dark"
                ? "bg-white/[0.02] border border-white/[0.06]"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Crop */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-3 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Cây trồng" : "Crop"}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-white/[0.05] border-white/10 text-white focus:border-white/20"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                      theme === "dark"
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(100,116,139,0.8)"
                    }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  {crops.map((crop) => (
                    <option
                      key={crop.id}
                      value={crop.id}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {crop.emoji} {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-3 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Tỉnh/Thành" : "Province"}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-white/[0.05] border-white/10 text-white focus:border-white/20"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                      theme === "dark"
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(100,116,139,0.8)"
                    }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  {regions.map((region) => (
                    <option
                      key={region.id}
                      value={region.id}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-3 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Năm" : "Year"}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-white/[0.05] border-white/10 text-white focus:border-white/20"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                      theme === "dark"
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(100,116,139,0.8)"
                    }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-3 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Kịch bản" : "Scenario"}
                </label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-white/[0.05] border-white/10 text-white focus:border-white/20"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                      theme === "dark"
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(100,116,139,0.8)"
                    }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  {scenarios.map((scenario) => (
                    <option
                      key={scenario.id}
                      value={scenario.id}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {scenario.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Display */}
            <div
              className={`text-center py-8 border-t ${
                theme === "dark" ? "border-white/[0.06]" : "border-slate-200"
              }`}
            >
              <div className="mb-4">
                <span className="text-[48px] sm:text-[64px]">
                  {selectedCropData?.emoji}
                </span>
              </div>
              <p
                className={`text-[13px] uppercase tracking-wider mb-3 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {selectedCropData?.name} · {selectedRegionData?.name} ·{" "}
                {selectedYear}
              </p>
              <div
                className={`flex items-baseline justify-center gap-3 transition-all duration-300 ${
                  isComputing ? "opacity-50 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {isCoffee &&
                selectedRegion === "dak-lak" &&
                selectedYear === "2026" ? (
                  <>
                    <span
                      className={`text-[80px] sm:text-[112px] font-semibold tracking-[-0.04em] leading-none ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {prediction.yield}
                    </span>
                    <span
                      className={`text-[24px] font-normal ${
                        theme === "dark" ? "text-white/40" : "text-slate-400"
                      }`}
                    >
                      t/ha
                    </span>
                  </>
                ) : (
                  <span
                    className={`text-[32px] sm:text-[48px] font-medium ${
                      theme === "dark" ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    {language === "vi" ? "Sớm cập nhật" : "Coming soon"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                {isCoffee &&
                selectedRegion === "dak-lak" &&
                selectedYear === "2026" ? (
                  <>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        predictionError
                          ? "bg-amber-400"
                          : prediction.confidence === "high"
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`text-[12px] uppercase tracking-wider ${
                        theme === "dark" ? "text-white/40" : "text-slate-500"
                      }`}
                    >
                      {isComputing
                        ? language === "vi"
                          ? "Đang tính toán..."
                          : "Computing..."
                        : predictionError
                        ? predictionError
                        : language === "vi"
                        ? prediction.confidence === "high"
                          ? "Độ chính xác cao"
                          : "Độ chính xác trung bình"
                        : prediction.confidence === "high"
                        ? "High accuracy"
                        : "Medium accuracy"}
                    </span>
                  </>
                ) : (
                  <span
                    className={`text-[12px] uppercase tracking-wider ${
                      theme === "dark" ? "text-white/40" : "text-slate-500"
                    }`}
                  >
                    {language === "vi"
                      ? "Dữ liệu sẽ sớm được cập nhật"
                      : "Data coming soon"}
                  </span>
                )}
              </div>
            </div>

            {/* Scenario Description */}
            <div
              className={`mt-8 pt-8 border-t text-center ${
                theme === "dark" ? "border-white/[0.06]" : "border-slate-200"
              }`}
            >
              <p
                className={`text-[13px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Kịch bản:" : "Scenario:"}{" "}
                {scenarios.find((s) => s.id === selectedScenario)?.name}
              </p>
              <p
                className={`text-[15px] ${
                  theme === "dark" ? "text-white/50" : "text-slate-600"
                }`}
              >
                {scenarios.find((s) => s.id === selectedScenario)?.description}
              </p>
            </div>

            {/* Why & Actions Cards - Only show for Coffee + Đắk Lắk + 2026 */}
            {isCoffee &&
              selectedRegion === "dak-lak" &&
              selectedYear === "2026" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Why Card */}
                  <div
                    className={`rounded-2xl p-6 ${
                      theme === "dark"
                        ? "bg-white/[0.03] border border-white/[0.08]"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🔍</span>
                      <h3
                        className={`text-[14px] font-medium uppercase tracking-wider ${
                          theme === "dark" ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        {language === "vi"
                          ? "Vì sao dự báo như vậy?"
                          : "Why this prediction?"}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {getScenarioContent(selectedScenario).why[
                        language === "vi" ? "vi" : "en"
                      ].map((item, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 text-[13px] leading-relaxed ${
                            theme === "dark"
                              ? "text-white/50"
                              : "text-slate-600"
                          }`}
                        >
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions Card */}
                  <div
                    className={`rounded-2xl p-6 ${
                      theme === "dark"
                        ? "bg-white/[0.03] border border-white/[0.08]"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🌱</span>
                      <h3
                        className={`text-[14px] font-medium uppercase tracking-wider ${
                          theme === "dark" ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        {language === "vi"
                          ? "Gợi ý canh tác"
                          : "Farming recommendations"}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {getScenarioContent(selectedScenario).actions[
                        language === "vi" ? "vi" : "en"
                      ].map((item, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 text-[13px] leading-relaxed ${
                            theme === "dark"
                              ? "text-white/50"
                              : "text-slate-600"
                          }`}
                        >
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(language === "vi"
              ? [
                  {
                    title: "63 Tỉnh Thành",
                    description:
                      "Dự báo cho tất cả các tỉnh thành trên toàn quốc Việt Nam.",
                  },
                  {
                    title: "20+ Cây Trồng",
                    description:
                      "Cà phê, lúa, cao su, hồ tiêu, sầu riêng và nhiều loại cây khác.",
                  },
                  {
                    title: "Kịch bản Thời tiết",
                    description:
                      "El Niño, La Niña, hạn hán, bão lũ và các điều kiện khác.",
                  },
                ]
              : [
                  {
                    title: "63 Provinces",
                    description:
                      "Predictions available for all provinces across Vietnam.",
                  },
                  {
                    title: "20+ Crops",
                    description:
                      "Coffee, rice, rubber, pepper, durian and many other crops.",
                  },
                  {
                    title: "Weather Scenarios",
                    description:
                      "El Niño, La Niña, drought, storms and other conditions.",
                  },
                ]
            ).map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${
                  theme === "dark"
                    ? "bg-white/[0.02] border border-white/[0.06]"
                    : "bg-white border border-slate-200 shadow-sm"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mb-4" />
                <h3
                  className={`text-[16px] font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-[14px] leading-relaxed ${
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

      {/* Premium CTA */}
      <section
        className={`py-20 border-t ${
          theme === "dark" ? "border-white/[0.04]" : "border-slate-200"
        }`}
      >
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-amber-500/80 mb-4">
            {language === "vi" ? "Truy cập Premium" : "Premium Access"}
          </p>
          <h2
            className={`text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] mb-4 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Cần thông tin cấp tổ chức?"
              : "Need institutional-grade intelligence?"}
          </h2>
          <p
            className={`text-[15px] mb-8 ${
              theme === "dark" ? "text-white/40" : "text-slate-500"
            }`}
          >
            {language === "vi"
              ? "Truy cập các tính năng nâng cao, tích hợp API và hỗ trợ chuyên dụng."
              : "Access advanced features, API integration, and dedicated support."}
          </p>
          <Link
            href="/premium"
            className={`inline-flex items-center justify-center px-10 py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
              theme === "dark"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {language === "vi" ? "Khám phá Premium" : "Explore Premium"}
          </Link>
        </div>
      </section>
    </div>
  );
}
