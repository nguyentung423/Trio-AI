/**
 * HomeContent.tsx
 * Apple-level Vision Demo - Global Agricultural AI Platform
 * Target: Governments, Corporations, Global Institutions
 * Bilingual: Vietnamese (default) / English
 *
 * Hero: World map with AI scanning effect
 * - Minimal abstract map (Apple Weather / Vision style)
 * - Scan wave animation (slow, subtle)
 * - Strategic agricultural data points
 * - Floating AI insight cards
 */

"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { predictScenario, ScenarioKey } from "@/app/api/backend";

// Các vùng nông nghiệp chính của Việt Nam
// Coordinates are percentages (left%, top%)
const dataPoints = [
  { id: "tay-nguyen", left: 52, top: 55, crop: "Coffee", cropVi: "Cà phê" },
  {
    id: "dong-bang-song-cuu-long",
    left: 48,
    top: 78,
    crop: "Rice",
    cropVi: "Lúa gạo",
  },
  { id: "dong-nam-bo", left: 55, top: 65, crop: "Rubber", cropVi: "Cao su" },
  { id: "bac-trung-bo", left: 53, top: 42, crop: "Pepper", cropVi: "Hồ tiêu" },
  { id: "dong-bac-bo", left: 58, top: 25, crop: "Tea", cropVi: "Chè" },
];

// Floating insight cards data - cycle through these
const insightsVi = [
  {
    emoji: "☕",
    crop: "Cà phê",
    region: "Đắk Lắk",
    status: "Năng suất ổn định",
    confidence: "Độ tin cậy cao",
  },
  {
    emoji: "🌾",
    crop: "Lúa gạo",
    region: "Đồng bằng sông Cửu Long",
    status: "Vụ mùa thuận lợi",
    confidence: "Dự kiến năng suất cao",
  },
  {
    emoji: "🌶️",
    crop: "Hồ tiêu",
    region: "Bình Phước",
    status: "Giá tăng",
    confidence: "Xu hướng tích cực",
  },
  {
    emoji: "🌳",
    crop: "Cao su",
    region: "Đông Nam Bộ",
    status: "Ổn định",
    confidence: "Phục hồi sau mưa",
  },
];

const insightsEn = [
  {
    emoji: "☕",
    crop: "Coffee",
    region: "Dak Lak",
    status: "Yield stable",
    confidence: "High confidence",
  },
  {
    emoji: "🌾",
    crop: "Rice",
    region: "Mekong Delta",
    status: "Favorable season",
    confidence: "High yield expected",
  },
  {
    emoji: "🌶️",
    crop: "Black Pepper",
    region: "Binh Phuoc",
    status: "Price rising",
    confidence: "Positive trend",
  },
  {
    emoji: "🌳",
    crop: "Rubber",
    region: "Southeast",
    status: "Stable",
    confidence: "Post-rain recovery",
  },
];

// Prediction data for rotating display - bilingual
const globalPredictionsVi = [
  {
    emoji: "☕",
    crop: "Cà phê",
    region: "Đắk Lắk",
    yield: "2.8",
    unit: "t/ha",
  },
  {
    emoji: "🌾",
    crop: "Lúa gạo",
    region: "An Giang",
    yield: "6.5",
    unit: "t/ha",
  },
  {
    emoji: "🌳",
    crop: "Cao su",
    region: "Bình Dương",
    yield: "1.8",
    unit: "t/ha",
  },
  {
    emoji: "🌶️",
    crop: "Hồ tiêu",
    region: "Bình Phước",
    yield: "2.5",
    unit: "t/ha",
  },
  {
    emoji: "🥜",
    crop: "Điều",
    region: "Đồng Nai",
    yield: "1.2",
    unit: "t/ha",
  },
  {
    emoji: "🍵",
    crop: "Chè",
    region: "Thái Nguyên",
    yield: "8.5",
    unit: "t/ha",
  },
  {
    emoji: "🍈",
    crop: "Sầu riêng",
    region: "Lâm Đồng",
    yield: "15.0",
    unit: "t/ha",
  },
  {
    emoji: "🐉",
    crop: "Thanh long",
    region: "Bình Thuận",
    yield: "25.0",
    unit: "t/ha",
  },
];

const globalPredictionsEn = [
  {
    emoji: "☕",
    crop: "Coffee",
    region: "Dak Lak",
    yield: "2.8",
    unit: "t/ha",
  },
  { emoji: "🌾", crop: "Rice", region: "An Giang", yield: "6.5", unit: "t/ha" },
  {
    emoji: "🌳",
    crop: "Rubber",
    region: "Binh Duong",
    yield: "1.8",
    unit: "t/ha",
  },
  {
    emoji: "🌶️",
    crop: "Black Pepper",
    region: "Binh Phuoc",
    yield: "2.5",
    unit: "t/ha",
  },
  {
    emoji: "🥜",
    crop: "Cashew",
    region: "Dong Nai",
    yield: "1.2",
    unit: "t/ha",
  },
  {
    emoji: "🍵",
    crop: "Tea",
    region: "Thai Nguyen",
    yield: "8.5",
    unit: "t/ha",
  },
  {
    emoji: "🍈",
    crop: "Durian",
    region: "Lam Dong",
    yield: "15.0",
    unit: "t/ha",
  },
  {
    emoji: "🐉",
    crop: "Dragon Fruit",
    region: "Binh Thuan",
    yield: "25.0",
    unit: "t/ha",
  },
];

// Interactive demo data - bilingual
const cropsVi = [
  "Cà phê",
  "Lúa gạo",
  "Cao su",
  "Hồ tiêu",
  "Điều",
  "Chè",
  "Sầu riêng",
  "Thanh long",
  "Xoài",
  "Mía",
];
const cropsEn = [
  "Coffee",
  "Rice",
  "Rubber",
  "Black Pepper",
  "Cashew",
  "Tea",
  "Durian",
  "Dragon Fruit",
  "Mango",
  "Sugarcane",
];
const regionsVi = [
  "Đắk Lắk",
  "An Giang",
  "Bình Dương",
  "Thái Nguyên",
  "Lâm Đồng",
  "Bình Thuận",
  "Tiền Giang",
  "Gia Lai",
];
const regionsEn = [
  "Dak Lak",
  "An Giang",
  "Binh Duong",
  "Thai Nguyen",
  "Lam Dong",
  "Binh Thuan",
  "Tien Giang",
  "Gia Lai",
];
const years = ["2026", "2027", "2028", "2029", "2030"];

// Weather scenarios for prediction
const scenariosVi: { key: ScenarioKey; label: string }[] = [
  { key: "normal", label: "Bình thường" },
  { key: "favorable", label: "Thuận lợi (+5%)" },
  { key: "el_nino", label: "El Niño (hạn hán)" },
  { key: "la_nina", label: "La Niña (mưa nhiều)" },
  { key: "severe_drought", label: "Hạn hán nghiêm trọng" },
  { key: "major_storm", label: "Bão lớn" },
];
const scenariosEn: { key: ScenarioKey; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "favorable", label: "Favorable (+5%)" },
  { key: "el_nino", label: "El Niño (drought)" },
  { key: "la_nina", label: "La Niña (heavy rain)" },
  { key: "severe_drought", label: "Severe drought" },
  { key: "major_storm", label: "Major storm" },
];

export default function HomeContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [scanOrigin, setScanOrigin] = useState({ x: 50, y: 50 });

  // AI focus field states
  const [mapVisible, setMapVisible] = useState(false);
  const [focusPosition, setFocusPosition] = useState({ x: 20, y: 50 }); // Start from left side
  const [isSettled, setIsSettled] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<{
    name: string;
    nameVi: string;
    crop: string;
    cropVi: string;
    yield: string;
    x: number;
    y: number;
  } | null>(null);

  // Vietnamese provinces with positions on map (% within the map image)
  // These are approximate positions on a Vietnam map
  const provinces = [
    {
      name: "Dak Lak",
      nameVi: "Đắk Lắk",
      crop: "Coffee",
      cropVi: "Cà phê",
      yield: "2.8",
      x: 55,
      y: 65,
    },
    {
      name: "An Giang",
      nameVi: "An Giang",
      crop: "Rice",
      cropVi: "Lúa gạo",
      yield: "6.5",
      x: 40,
      y: 82,
    },
    {
      name: "Lam Dong",
      nameVi: "Lâm Đồng",
      crop: "Tea",
      cropVi: "Chè",
      yield: "8.2",
      x: 58,
      y: 70,
    },
    {
      name: "Binh Thuan",
      nameVi: "Bình Thuận",
      crop: "Dragon Fruit",
      cropVi: "Thanh long",
      yield: "25.0",
      x: 62,
      y: 75,
    },
    {
      name: "Gia Lai",
      nameVi: "Gia Lai",
      crop: "Rubber",
      cropVi: "Cao su",
      yield: "1.8",
      x: 55,
      y: 58,
    },
    {
      name: "Thai Nguyen",
      nameVi: "Thái Nguyên",
      crop: "Tea",
      cropVi: "Chè",
      yield: "7.5",
      x: 50,
      y: 18,
    },
    {
      name: "Can Tho",
      nameVi: "Cần Thơ",
      crop: "Rice",
      cropVi: "Lúa gạo",
      yield: "6.8",
      x: 45,
      y: 88,
    },
    {
      name: "Binh Phuoc",
      nameVi: "Bình Phước",
      crop: "Pepper",
      cropVi: "Hồ tiêu",
      yield: "2.5",
      x: 52,
      y: 72,
    },
  ];

  // Get language-specific data
  const globalPredictions =
    language === "vi" ? globalPredictionsVi : globalPredictionsEn;
  const insights = language === "vi" ? insightsVi : insightsEn;
  const crops = language === "vi" ? cropsVi : cropsEn;
  const regions = language === "vi" ? regionsVi : regionsEn;
  const scenarios = language === "vi" ? scenariosVi : scenariosEn;

  // Interactive demo state
  const [selectedCrop, setSelectedCrop] = useState(
    language === "vi" ? "Cà phê" : "Coffee"
  );
  const [selectedRegion, setSelectedRegion] = useState(
    language === "vi" ? "Đắk Lắk" : "Dak Lak"
  );
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>("normal");
  const [demoYield, setDemoYield] = useState("2.8");
  const [isComputing, setIsComputing] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Map fade in
    const mapTimer = setTimeout(() => setMapVisible(true), 500);

    // Journey positions: Brazil -> India -> Vietnam (shorter journey)
    const positions = [
      { x: 35, y: 55 }, // Brazil
      { x: 60, y: 40 }, // India
      { x: 78, y: 42 }, // Vietnam
    ];

    const timers: NodeJS.Timeout[] = [];

    // Move through each position - faster
    positions.forEach((pos, index) => {
      timers.push(
        setTimeout(() => {
          setFocusPosition(pos);
        }, 800 + index * 1200) // Start at 0.8s, then every 1.2s
      );
    });

    // After reaching Vietnam, show Dak Lak Coffee card (total ~4s)
    const settleTimer = setTimeout(() => {
      // Always show Coffee from Dak Lak
      const dakLakCoffee = provinces[0]; // First item is Dak Lak Coffee
      setSelectedProvince(dakLakCoffee);
      setIsSettled(true);
    }, 5500); // Show card at 5.5s (after dot settles at Vietnam)

    return () => {
      clearTimeout(mapTimer);
      clearTimeout(settleTimer);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Rotate predictions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrediction((prev) => (prev + 1) % globalPredictions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [globalPredictions.length]);

  // Call real API when selections change (only for Coffee in Đắk Lắk, year 2026)
  const updatePrediction = useCallback(async () => {
    // Only call API for Coffee/Cà phê
    const isCoffee = selectedCrop === "Cà phê" || selectedCrop === "Coffee";
    const isDakLak =
      selectedRegion === "Đắk Lắk" || selectedRegion === "Dak Lak";
    const isYear2026 = selectedYear === "2026";

    if (!isCoffee || !isDakLak || !isYear2026) {
      // For non-coffee, non-Đắk Lắk, or years other than 2026, show "Coming soon"
      setDemoYield("0");
      setPredictionError(null);
      setIsComputing(false);
      return;
    }

    setIsComputing(true);
    setPredictionError(null);

    try {
      const result = await predictScenario({
        province: "Đắk Lắk",
        year: parseInt(selectedYear),
        scenario: selectedScenario,
      });
      setDemoYield(result.predicted_yield_ton_ha.toFixed(2));
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
      const baseYield = 2 + Math.abs(hash % 100) / 100;
      setDemoYield(baseYield.toFixed(2));
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
    updatePrediction();
  }, [updatePrediction]);

  const prediction = globalPredictions[currentPrediction];
  const currentInsightData = insights[currentInsight];

  return (
    <div
      className={`relative transition-colors duration-300 ${
        theme === "dark" ? "bg-[#000000] text-white" : "bg-white text-slate-900"
      }`}
    >
      <style jsx global>{`
        /* ═══════════════════════════════════════════════════════════════════════
           AI FOCUS FIELD - Soft circular field that scans the planet
           Not a magnifying glass - a gentle awareness field
        ═══════════════════════════════════════════════════════════════════════ */
        .ai-focus-field {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 3s cubic-bezier(0.4, 0, 0.2, 1),
            top 3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (min-width: 640px) {
          .ai-focus-field {
            width: 120px;
            height: 120px;
          }
        }

        @media (min-width: 1024px) {
          .ai-focus-field {
            width: 150px;
            height: 150px;
          }
        }

        .ai-focus-field::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0.08) 40%,
            rgba(255, 255, 255, 0.02) 70%,
            transparent 100%
          );
        }

        .ai-focus-field::after {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          opacity: 0.8;
        }

        /* Scanning state - gentle pulse */
        .ai-focus-field.scanning::before {
          animation: focus-pulse 3s ease-in-out infinite;
        }

        /* Settled state - stable glow */
        .ai-focus-field.settled::before {
          background: radial-gradient(
            circle at center,
            rgba(52, 199, 89, 0.35) 0%,
            rgba(52, 199, 89, 0.2) 25%,
            rgba(52, 199, 89, 0.1) 50%,
            rgba(52, 199, 89, 0.03) 75%,
            transparent 100%
          );
        }

        .ai-focus-field.settled::after {
          border-color: rgba(52, 199, 89, 0.4);
          border-width: 2px;
        }

        @keyframes focus-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        /* ═══════════════════════════════════════════════════════════════════════
           MAP BRIGHTNESS MASK - Area under focus field is brighter
        ═══════════════════════════════════════════════════════════════════════ */
        .map-brightness-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          transition: all 2.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           VIETNAM INSIGHT CARD - Appears after AI settles
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes vietnam-card-appear {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vietnam-insight-card {
          animation: vietnam-card-appear 1.2s cubic-bezier(0.4, 0, 0.2, 1)
            forwards;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           PREMIUM TEXT FADE
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes premium-text-fade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .premium-text {
          animation: premium-text-fade 1.5s ease-out forwards;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           SCAN WAVE ANIMATION - The heart of AI scanning effect
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes scan-wave {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        .scan-wave {
          animation: scan-wave 20s ease-out infinite;
        }
        .scan-wave-delayed {
          animation: scan-wave 20s ease-out infinite;
          animation-delay: 10s;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           DATA POINT PULSE - Very subtle, strategic regions
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes data-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        .data-point {
          animation: data-pulse 4s ease-in-out infinite;
        }
        .data-point:nth-child(2) {
          animation-delay: 0.8s;
        }
        .data-point:nth-child(3) {
          animation-delay: 1.6s;
        }
        .data-point:nth-child(4) {
          animation-delay: 2.4s;
        }
        .data-point:nth-child(5) {
          animation-delay: 3.2s;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           INSIGHT CARD FADE - Slow, contemplative
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes insight-fade {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
        .insight-card {
          animation: insight-fade 8s ease-in-out forwards;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           ORIGINAL ANIMATIONS
        ═══════════════════════════════════════════════════════════════════════ */
        @keyframes slow-drift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-slow-drift {
          background-size: 400% 400%;
          animation: slow-drift 30s ease infinite;
        }
        @keyframes gentle-breathe {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-breathe {
          animation: gentle-breathe 4s ease-in-out infinite;
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 1.2s ease-out forwards;
        }
        .animate-fade-up-delay-1 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animate-fade-up-delay-2 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animate-fade-up-delay-3 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        .animate-fade-up-delay-4 {
          animation-delay: 0.8s;
          opacity: 0;
        }
        .animate-fade-up-delay-5 {
          animation-delay: 1s;
          opacity: 0;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Cinematic AI scanning the planet
          The Earth as a living system being understood by AI
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className={`relative h-[100svh] flex items-center justify-center overflow-hidden ${
          theme === "dark"
            ? "bg-[#050608]"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-50"
        }`}
      >
        {/* ═══════════════════════════════════════════════════════════════════════
            BACKGROUND IMAGE - Full screen
        ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out ${
            mapVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Full screen background image */}
          <img
            src="/icons/t.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 sm:opacity-40"
          />

          {/* AI Focus Dot - moves on screen */}
          <div
            className={`ai-focus-field ${isSettled ? "settled" : "scanning"}`}
            style={{
              left: `${focusPosition.x}%`,
              top: `${focusPosition.y}%`,
              transition:
                "left 3s cubic-bezier(0.25, 0.1, 0.25, 1), top 3s cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          />

          {/* Mobile Province Card - positioned at bottom */}
          {isSettled && selectedProvince && (
            <div className="vietnam-insight-card absolute z-20 lg:hidden left-3 right-3 sm:left-4 sm:right-4 bottom-28 sm:bottom-32">
              <div
                className={`backdrop-blur-xl border rounded-2xl px-4 py-3 shadow-2xl ${
                  theme === "dark"
                    ? "bg-black/70 border-white/10"
                    : "bg-white/90 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[24px]">
                    {selectedProvince.crop === "Coffee"
                      ? "☕"
                      : selectedProvince.crop === "Rice"
                      ? "🌾"
                      : selectedProvince.crop === "Tea"
                      ? "🍵"
                      : selectedProvince.crop === "Dragon Fruit"
                      ? "🐉"
                      : selectedProvince.crop === "Rubber"
                      ? "🌳"
                      : selectedProvince.crop === "Pepper"
                      ? "🌶️"
                      : "🌱"}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-[11px] font-medium ${
                        theme === "dark" ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      {language === "vi"
                        ? `${selectedProvince.cropVi} · ${selectedProvince.nameVi}`
                        : `${selectedProvince.crop} · ${selectedProvince.name}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[14px] font-medium ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {language === "vi" ? "Năng suất:" : "Yield:"}
                      </span>
                      <span className="text-emerald-500 text-[16px] font-semibold">
                        {selectedProvince.yield} t/ha
                      </span>
                      <div className="w-1 h-1 rounded-full bg-emerald-400 ml-1"></div>
                      <span className="text-[9px] text-emerald-500 uppercase tracking-wider">
                        {language === "vi" ? "Dự đoán AI" : "AI Forecast"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            HERO COPY - Centered, Apple Keynote style
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p
            className={`text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-8 font-normal transition-all duration-1000 delay-500 ${
              theme === "dark" ? "text-white/40" : "text-slate-500"
            } ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {language === "vi"
              ? "Trí tuệ Nhân tạo cho Nông nghiệp Việt Nam"
              : "AI for Vietnam Agriculture"}
          </p>

          {/* Main Headline */}
          <h1
            className={`transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span
              className={`block text-[28px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-semibold leading-[1.1] sm:leading-[1.05] tracking-[-0.02em] sm:tracking-[-0.03em] ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Dự báo mùa màng."
                : "Predicting the harvest."}
            </span>
            <span
              className={`block text-[28px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-semibold leading-[1.1] sm:leading-[1.05] tracking-[-0.02em] sm:tracking-[-0.03em] mt-1 ${
                theme === "dark" ? "text-white/35" : "text-slate-400"
              }`}
            >
              {language === "vi"
                ? "Bảo vệ người nông dân."
                : "Protecting farmers."}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`max-w-[650px] mx-auto mt-4 sm:mt-8 text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed font-normal transition-all duration-1000 delay-1000 ${
              theme === "dark" ? "text-white/50" : "text-slate-600"
            } ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {language === "vi"
              ? "Từ đồng bằng sông Cửu Long đến Tây Nguyên — AI phân tích khí hậu, đất đai và mùa vụ để giúp 63 tỉnh thành lên kế hoạch sản xuất nông nghiệp."
              : "From the Mekong Delta to the Central Highlands — AI analyzes climate, soil, and seasons to help 63 provinces plan agricultural production."}
          </p>

          {/* CTA - Minimal */}
          <div
            className={`mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 transition-all duration-1000 delay-1200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="/forecast"
              className={`inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-medium rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {language === "vi"
                ? "Khám phá dự báo"
                : "Explore global forecast"}
            </Link>
            <Link
              href="/premium"
              className={`inline-flex items-center gap-2 text-[14px] font-normal transition-colors ${
                theme === "dark"
                  ? "text-white/40 hover:text-white/70"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {language === "vi"
                ? "Yêu cầu quyền truy cập premium"
                : "Request premium access"}
              <svg
                className="w-3.5 h-3.5"
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

          {/* Province Yield Card - Desktop only, below CTA */}
          <div className="hidden lg:block mt-10 h-[80px]">
            <div
              className={`transition-all duration-1000 ease-out ${
                isSettled && selectedProvince
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              {selectedProvince && (
                <Link
                  href="/forecast"
                  className={`group inline-flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
                      : "bg-white/60 border border-slate-200/60 hover:bg-white/80 hover:border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Scanning indicator */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                      theme === "dark" ? "bg-emerald-500/10" : "bg-emerald-50"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-left">
                    <p
                      className={`text-[10px] uppercase tracking-widest mb-1 ${
                        theme === "dark"
                          ? "text-emerald-400/70"
                          : "text-emerald-600/70"
                      }`}
                    >
                      {language === "vi"
                        ? "Vị trí phát hiện"
                        : "Location detected"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px]">🇻🇳</span>
                      <p
                        className={`text-[14px] font-medium ${
                          theme === "dark" ? "text-white/90" : "text-slate-800"
                        }`}
                      >
                        {language === "vi"
                          ? "Cà phê · Đắk Lắk"
                          : "Coffee · Dak Lak"}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-1.5 ml-2 pl-4 border-l ${
                      theme === "dark"
                        ? "border-white/[0.06]"
                        : "border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[12px] font-medium ${
                        theme === "dark"
                          ? "text-white/50 group-hover:text-white/70"
                          : "text-slate-500 group-hover:text-slate-700"
                      } transition-colors`}
                    >
                      {language === "vi" ? "Xem dự báo" : "View forecast"}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 ${
                        theme === "dark" ? "text-white/40" : "text-slate-400"
                      }`}
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
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile when card is visible */}
        <div
          className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1500 ${
            mounted ? "opacity-100" : "opacity-0"
          } ${isSettled ? "hidden sm:block" : ""}`}
        >
          <div
            className={`animate-bounce ${
              theme === "dark" ? "text-white/15" : "text-slate-400"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          INTERACTIVE DEMO SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className={`py-28 sm:py-40 ${
          theme === "dark" ? "bg-[#0a0a0a]" : "bg-slate-50"
        }`}
      >
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
                theme === "dark" ? "text-white/30" : "text-slate-500"
              }`}
            >
              {language === "vi" ? "Trải nghiệm ngay" : "Try It Now"}
            </p>
            <h2
              className={`text-[32px] sm:text-[48px] font-semibold tracking-[-0.02em] ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Chọn cây trồng. Chọn khu vực."
                : "Select any crop. Any region."}
            </h2>
          </div>

          {/* Demo Interface */}
          <div
            className={`border rounded-3xl p-8 sm:p-12 ${
              theme === "dark"
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {/* Crop */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-2 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Cây trồng" : "Crop"}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
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
                      key={crop}
                      value={crop}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-2 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Khu vực" : "Region"}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
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
                      key={region}
                      value={region}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  className={`block text-[11px] uppercase tracking-wider mb-2 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Năm" : "Year"}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
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
                  className={`block text-[11px] uppercase tracking-wider mb-2 ${
                    theme === "dark" ? "text-white/30" : "text-slate-500"
                  }`}
                >
                  {language === "vi" ? "Kịch bản" : "Scenario"}
                </label>
                <select
                  value={selectedScenario}
                  onChange={(e) =>
                    setSelectedScenario(e.target.value as ScenarioKey)
                  }
                  className={`w-full border rounded-xl px-4 py-3 text-[15px] focus:outline-none transition-colors appearance-none cursor-pointer ${
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
                  {scenarios.map((s) => (
                    <option
                      key={s.key}
                      value={s.key}
                      className={theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Display */}
            <div className="text-center">
              <p
                className={`text-[13px] uppercase tracking-wider mb-3 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {selectedCrop} · {selectedRegion} · {selectedYear} ·{" "}
                {scenarios.find((s) => s.key === selectedScenario)?.label}
              </p>
              <div
                className={`flex items-baseline justify-center gap-2 transition-all duration-300 ${
                  isComputing ? "opacity-50 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {(selectedCrop === "Cà phê" || selectedCrop === "Coffee") &&
                (selectedRegion === "Đắk Lắk" ||
                  selectedRegion === "Dak Lak") &&
                selectedYear === "2026" ? (
                  <>
                    <span
                      className={`text-[72px] sm:text-[96px] font-semibold tracking-[-0.04em] leading-none ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {demoYield}
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
              <div className="flex flex-col items-center gap-2 mt-4">
                {(selectedCrop === "Cà phê" || selectedCrop === "Coffee") &&
                (selectedRegion === "Đắk Lắk" ||
                  selectedRegion === "Dak Lak") &&
                selectedYear === "2026" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          predictionError ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      ></div>
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
                          ? "Độ chính xác cao"
                          : "High accuracy"}
                      </span>
                    </div>
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
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CAPABILITIES SECTION - What This AI Can Do
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className={`py-28 sm:py-40 ${
          theme === "dark" ? "bg-black" : "bg-slate-50"
        }`}
      >
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-20">
            <p
              className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
                theme === "dark" ? "text-white/30" : "text-slate-500"
              }`}
            >
              {language === "vi" ? "Tầm nhìn" : "Vision"}
            </p>
            <h2
              className={`text-[32px] sm:text-[48px] font-semibold tracking-[-0.02em] ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "AI này có thể làm gì."
                : "What this AI can do."}
            </h2>
          </div>

          <div className="space-y-6">
            {(language === "vi"
              ? [
                  "Dự đoán thiếu hụt cây trồng trước khi xảy ra",
                  "Hỗ trợ lập kế hoạch an ninh lương thực toàn cầu",
                  "Giảm thiểu sự không chắc chắn trong chuỗi cung ứng",
                  "Hỗ trợ chính sách nông nghiệp dựa trên dữ liệu",
                  "Giúp doanh nghiệp phòng ngừa rủi ro sản xuất",
                ]
              : [
                  "Anticipate crop shortages before they happen",
                  "Support global food security planning",
                  "Reduce supply-chain uncertainty",
                  "Enable data-driven agricultural policy",
                  "Help enterprises hedge production risk",
                ]
            ).map((capability, index) => (
              <div
                key={index}
                className={`flex items-center gap-6 py-6 border-b group ${
                  theme === "dark" ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    theme === "dark"
                      ? "bg-white/[0.03] border-white/[0.08] group-hover:bg-white/[0.06]"
                      : "bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-emerald-400/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p
                  className={`text-[19px] sm:text-[22px] font-normal leading-relaxed ${
                    theme === "dark" ? "text-white/80" : "text-slate-700"
                  }`}
                >
                  {capability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PREMIUM SECTION - $10,000/year
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className={`py-28 sm:py-40 ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#0a0a0a] to-[#000000]"
            : "bg-gradient-to-b from-white to-slate-50"
        }`}
      >
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[11px] tracking-[0.2em] uppercase text-amber-500/80 mb-4">
              {language === "vi" ? "Truy cập Premium" : "Premium Access"}
            </p>
            <h2
              className={`text-[36px] sm:text-[56px] font-semibold tracking-[-0.02em] leading-tight ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Trí tuệ nông nghiệp"
                : "Global agricultural"}
              <br />
              {language === "vi" ? "toàn cầu." : "intelligence."}
            </h2>
            <p
              className={`max-w-[520px] mx-auto mt-6 text-[17px] leading-relaxed ${
                theme === "dark" ? "text-white/40" : "text-slate-500"
              }`}
            >
              {language === "vi"
                ? "Thiết kế cho chính phủ, tổ chức và doanh nghiệp hoạt động ở quy mô toàn cầu."
                : "Designed for governments, institutions, and enterprises that operate at planetary scale."}
            </p>
          </div>

          {/* Premium Card */}
          <div
            className={`rounded-[32px] p-10 sm:p-16 max-w-[600px] mx-auto ${
              theme === "dark"
                ? "bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
                : "bg-white border border-slate-200 shadow-xl"
            }`}
          >
            <div className="text-center">
              {/* Capabilities */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-12 text-left max-w-[400px] mx-auto">
                {(language === "vi"
                  ? [
                      "Bao phủ cây trồng toàn cầu",
                      "Dự báo đa quốc gia",
                      "Mô phỏng kịch bản khí hậu",
                      "Tín hiệu rủi ro chiến lược",
                      "Triển vọng sản xuất dài hạn",
                      "Insights cấp tổ chức",
                    ]
                  : [
                      "Global crop coverage",
                      "Multi-country forecasting",
                      "Climate scenario simulation",
                      "Strategic risk signals",
                      "Long-term production outlooks",
                      "Institutional-grade insights",
                    ]
                ).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span
                      className={`text-[14px] ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div
                className={`py-8 border-t border-b ${
                  theme === "dark" ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-[11px] uppercase tracking-widest mb-2 ${
                    theme === "dark" ? "text-white/30" : "text-slate-400"
                  }`}
                >
                  {language === "vi" ? "Truy cập Premium" : "Premium Access"}
                </p>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative group cursor-default">
                    <span
                      className={`text-[56px] sm:text-[72px] font-semibold tracking-tight ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {language === "vi" ? "Liên hệ" : "Contact"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 overflow-hidden pointer-events-none"></div>
                  </div>
                  <p
                    className={`text-[13px] mt-2 italic ${
                      theme === "dark" ? "text-white/20" : "text-slate-400"
                    }`}
                  >
                    {language === "vi"
                      ? "Giá được tùy chỉnh theo quy mô"
                      : "Pricing tailored to you"}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10">
                <button
                  className={`w-full sm:w-auto px-12 py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {language === "vi" ? "Yêu cầu Truy cập" : "Request Access"}
                </button>
                <p
                  className={`text-[12px] mt-4 ${
                    theme === "dark" ? "text-white/30" : "text-slate-400"
                  }`}
                >
                  {language === "vi"
                    ? "Theo lời mời hoặc yêu cầu"
                    : "By invitation or request"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className={`py-28 sm:py-40 border-t ${
          theme === "dark"
            ? "bg-black border-white/[0.04]"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2
            className={`text-[32px] sm:text-[48px] font-semibold tracking-[-0.02em] leading-tight ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Tương lai của quy hoạch nông nghiệp."
              : "The future of agricultural planning."}
          </h2>
          <p
            className={`text-[17px] mt-6 leading-relaxed ${
              theme === "dark" ? "text-white/40" : "text-slate-500"
            }`}
          >
            {language === "vi"
              ? "AI hiểu sản xuất toàn cầu. Trước khi nó xảy ra."
              : "AI that understands global production. Before it happens."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
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
