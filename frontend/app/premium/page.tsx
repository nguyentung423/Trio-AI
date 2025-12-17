/**
 * Premium Page
 * Global Agricultural Intelligence - $10,000/year
 * Apple-level cinematic design
 * Bilingual: Vietnamese (default) / English
 */

"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger (client-side only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PremiumPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Refs for cinematic wipe effect
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBadgeRef = useRef<HTMLParagraphElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP ScrollTrigger - Cinematic clip-path wipe effect
  useLayoutEffect(() => {
    if (!mounted) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Fallback for reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // Timeline for cinematic wipe (clip-path reveal)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "+=60%",
          scrub: 0.3, // Fast response, still smooth
        },
      });

      // Subtitle wipes out FIRST (faster, starts immediately)
      // clip-path: inset(0 0 0 0) → inset(0 0 100% 0) = wipe from bottom
      tl.to(
        heroSubtitleRef.current,
        {
          clipPath: "inset(0 0 100% 0)",
          y: 8,
          opacity: 0.2,
          ease: "power1.out",
          duration: 0.5,
        },
        0
      );

      // Badge wipes with subtitle
      tl.to(
        heroBadgeRef.current,
        {
          clipPath: "inset(0 0 100% 0)",
          y: 6,
          opacity: 0.2,
          ease: "power1.out",
          duration: 0.55,
        },
        0
      );

      // Headline wipes LAST (slightly delayed)
      tl.to(
        heroHeadlineRef.current,
        {
          clipPath: "inset(0 0 100% 0)",
          y: 10,
          opacity: 0.3,
          ease: "power1.out",
          duration: 0.7,
        },
        0.08 // Starts 8% later
      );
    }, heroSectionRef);

    // Cleanup
    return () => {
      ctx.revert();
    };
  }, [mounted]);

  // Bilingual content
  const capabilitiesVi = [
    {
      title: "63 Tỉnh Thành Việt Nam",
      description:
        "Dự đoán AI cho tất cả các tỉnh thành trên toàn quốc Việt Nam.",
    },
    {
      title: "20+ Loại Cây Trồng",
      description:
        "Cà phê, lúa gạo, cao su, hồ tiêu, sầu riêng, thanh long và nhiều cây khác.",
    },
    {
      title: "Kịch bản Thời tiết Việt Nam",
      description: "Mô phỏng El Niño, La Niña, hạn hán, bão lũ cho từng vùng.",
    },
    {
      title: "Cảnh báo Rủi ro Sớm",
      description:
        "Cảnh báo sớm về sâu bệnh, thiên tai và biến động thị trường.",
    },
    {
      title: "Dự báo Dài hạn",
      description: "Dự báo sản lượng kéo dài 5+ năm trong tương lai.",
    },
    {
      title: "Báo cáo Chuyên sâu",
      description:
        "Phân tích chi tiết cho nhà hoạch định chính sách và doanh nghiệp.",
    },
  ];

  const capabilitiesEn = [
    {
      title: "63 Vietnam Provinces",
      description: "AI predictions for all provinces across Vietnam.",
    },
    {
      title: "20+ Crop Types",
      description:
        "Coffee, rice, rubber, black pepper, durian, dragon fruit and many more.",
    },
    {
      title: "Vietnam Weather Scenarios",
      description:
        "Simulate El Niño, La Niña, drought, storms for each region.",
    },
    {
      title: "Early Risk Warnings",
      description:
        "Early alerts for pests, natural disasters and market volatility.",
    },
    {
      title: "Long-Term Forecasts",
      description: "Production forecasts extending 5+ years into the future.",
    },
    {
      title: "In-depth Reports",
      description: "Detailed analysis for policy makers and enterprises.",
    },
  ];

  const audienceVi = [
    { label: "Chính phủ", desc: "Bộ Nông nghiệp, Sở NN&PTNT các tỉnh" },
    { label: "Viện nghiên cứu", desc: "Viện KHKT Nông nghiệp, ĐH Nông nghiệp" },
    {
      label: "Doanh nghiệp",
      desc: "Xuất khẩu cà phê, gạo, nông sản",
    },
  ];

  const audienceEn = [
    { label: "Government", desc: "Ministry of Agriculture, Provincial Depts" },
    {
      label: "Research",
      desc: "Agricultural Research Institutes, Universities",
    },
    { label: "Enterprises", desc: "Coffee, rice, agricultural exporters" },
  ];

  const faqVi = [
    {
      q: "Làm thế nào để được truy cập?",
      a: "Liên hệ với chúng tôi qua email hoặc hotline để được tư vấn và triển khai.",
    },
    {
      q: "Những cây trồng nào được hỗ trợ?",
      a: "Hệ thống hỗ trợ 20+ loại cây trồng phổ biến ở Việt Nam: cà phê, lúa, cao su, hồ tiêu, sầu riêng, thanh long...",
    },
    {
      q: "Những tỉnh nào được hỗ trợ?",
      a: "Tất cả 63 tỉnh thành của Việt Nam, từ Bắc đến Nam.",
    },
    {
      q: "Có thời gian dùng thử không?",
      a: "Chúng tôi cung cấp chương trình thí điểm miễn phí 30 ngày cho các tổ chức đủ điều kiện.",
    },
  ];

  const faqEn = [
    {
      q: "How do I get access?",
      a: "Contact us via email or hotline for consultation and deployment.",
    },
    {
      q: "What crops are covered?",
      a: "The system supports 20+ popular crops in Vietnam: coffee, rice, rubber, pepper, durian, dragon fruit...",
    },
    {
      q: "What provinces are supported?",
      a: "All 63 provinces of Vietnam, from North to South.",
    },
    {
      q: "Is there a trial period?",
      a: "We offer a free 30-day pilot program for qualified organizations.",
    },
  ];

  const capabilities = language === "vi" ? capabilitiesVi : capabilitiesEn;
  const audience = language === "vi" ? audienceVi : audienceEn;
  const faq = language === "vi" ? faqVi : faqEn;

  return (
    <div
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <style jsx global>{`
        @keyframes slow-pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-slow-pulse {
          animation: slow-pulse 8s ease-in-out infinite;
        }
      `}</style>

      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="premium-hero relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Subtle gradient orb */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial rounded-full blur-3xl animate-slow-pulse pointer-events-none ${
            theme === "dark"
              ? "from-amber-900/20 to-transparent"
              : "from-amber-200/30 to-transparent"
          }`}
        />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <p
            ref={heroBadgeRef}
            style={{
              clipPath: "inset(0 0 0 0)",
              willChange: "clip-path, transform, opacity",
            }}
            className={`text-[11px] tracking-[0.3em] uppercase text-amber-500/80 mb-6 transition-all duration-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {language === "vi" ? "Truy cập Premium" : "Premium Access"}
          </p>

          <h1
            ref={heroHeadlineRef}
            style={{
              clipPath: "inset(0 0 0 0)",
              willChange: "clip-path, transform, opacity",
            }}
            className={`text-[48px] sm:text-[72px] lg:text-[88px] font-semibold leading-[1.0] tracking-[-0.03em] transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {language === "vi" ? "Trí tuệ nông nghiệp" : "Global agricultural"}
            <br />
            {language === "vi" ? "toàn cầu." : "intelligence."}
          </h1>

          <p
            ref={heroSubtitleRef}
            style={{
              clipPath: "inset(0 0 0 0)",
              willChange: "clip-path, transform, opacity",
            }}
            className={`max-w-[560px] mx-auto mt-8 text-[19px] leading-relaxed transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } ${theme === "dark" ? "text-white/40" : "text-slate-500"}`}
          >
            {language === "vi"
              ? "Thiết kế cho chính phủ, tổ chức và doanh nghiệp hoạt động ở quy mô toàn cầu."
              : "Designed for governments, institutions, and enterprises that operate at planetary scale."}
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 transition-colors duration-500 ${
                  theme === "dark"
                    ? "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 mb-6" />
                <h3
                  className={`text-[18px] font-medium mb-3 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-[15px] leading-relaxed ${
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

      {/* Who This Is For */}
      <section
        className={`py-24 sm:py-32 ${
          theme === "dark"
            ? "bg-gradient-to-b from-transparent to-[#0a0a0a]"
            : "bg-gradient-to-b from-slate-50 to-white"
        }`}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <p
            className={`text-[11px] tracking-[0.2em] uppercase mb-4 ${
              theme === "dark" ? "text-white/30" : "text-slate-500"
            }`}
          >
            {language === "vi" ? "Xây dựng Cho" : "Built For"}
          </p>
          <h2
            className={`text-[32px] sm:text-[44px] font-semibold tracking-[-0.02em] mb-16 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Các tổ chức định hình"
              : "Organizations that shape"}
            <br />
            {language === "vi"
              ? "hệ thống lương thực toàn cầu."
              : "the global food system."}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {audience.map((item, index) => (
              <div
                key={index}
                className={`border-t pt-6 ${
                  theme === "dark" ? "border-white/[0.08]" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-[17px] font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-[14px] ${
                    theme === "dark" ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[600px] mx-auto px-6">
          <div
            className={`rounded-[32px] p-12 sm:p-16 text-center ${
              theme === "dark"
                ? "bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
                : "bg-white border border-slate-200 shadow-xl"
            }`}
          >
            <p
              className={`text-[11px] uppercase tracking-widest mb-4 ${
                theme === "dark" ? "text-white/30" : "text-slate-400"
              }`}
            >
              {language === "vi" ? "Truy cập Premium" : "Premium Access"}
            </p>

            <div className="flex flex-col items-center justify-center mb-4">
              {/* Mysterious Price Display */}
              <div className="relative group cursor-default">
                <span
                  className={`text-[64px] sm:text-[80px] font-semibold tracking-tight ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {language === "vi" ? "Liên hệ" : "Contact"}
                </span>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 overflow-hidden pointer-events-none"></div>
              </div>
              <p
                className={`text-[13px] mt-2 italic ${
                  theme === "dark" ? "text-white/20" : "text-slate-400"
                }`}
              >
                {language === "vi"
                  ? "Giá được tùy chỉnh theo quy mô tổ chức"
                  : "Pricing tailored to your organization"}
              </p>
            </div>

            <p
              className={`text-[15px] mb-10 max-w-[320px] mx-auto ${
                theme === "dark" ? "text-white/40" : "text-slate-500"
              }`}
            >
              {language === "vi"
                ? "Truy cập đầy đủ nền tảng trí tuệ nông nghiệp toàn cầu với hỗ trợ cấp tổ chức."
                : "Full access to global agricultural intelligence platform with institutional-grade support."}
            </p>

            <button
              className={`w-full sm:w-auto px-14 py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {language === "vi" ? "Yêu cầu Truy cập" : "Request Access"}
            </button>

            <p
              className={`text-[12px] mt-6 ${
                theme === "dark" ? "text-white/30" : "text-slate-400"
              }`}
            >
              {language === "vi"
                ? "Theo lời mời hoặc yêu cầu · Bao gồm hướng dẫn"
                : "By invitation or request · Includes onboarding"}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className={`py-24 sm:py-32 border-t ${
          theme === "dark" ? "border-white/[0.04]" : "border-slate-200"
        }`}
      >
        <div className="max-w-[700px] mx-auto px-6">
          <h2
            className={`text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] text-center mb-16 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi" ? "Câu hỏi" : "Questions"}
          </h2>

          <div className="space-y-0">
            {faq.map((item, index) => (
              <div
                key={index}
                className={`border-b py-8 ${
                  theme === "dark" ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-[17px] font-medium mb-3 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.q}
                </p>
                <p
                  className={`text-[15px] leading-relaxed ${
                    theme === "dark" ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2
            className={`text-[28px] sm:text-[40px] font-semibold tracking-[-0.02em] ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {language === "vi"
              ? "Sẵn sàng nhìn thấy tương lai"
              : "Ready to see the future"}
            <br />
            {language === "vi"
              ? "của sản xuất lương thực?"
              : "of food production?"}
          </h2>
          <div className="mt-10">
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center px-10 py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {language === "vi" ? "Liên hệ với chúng tôi" : "Contact Us"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
