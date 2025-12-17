/**
 * Footer.tsx
 * Apple-inspired minimal footer - Global Agricultural AI
 * Bilingual: Vietnamese (default) / English
 */

"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function Footer() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#000000] text-white/40 border-white/[0.04]"
          : "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className={`text-[11px] ${
              theme === "dark" ? "text-white/30" : "text-slate-400"
            }`}
          >
            © {currentYear} Trio AI.
          </p>
          <div
            className={`flex items-center gap-6 text-[11px] ${
              theme === "dark" ? "text-white/30" : "text-slate-400"
            }`}
          >
            <span>{language === "vi" ? "Bảo mật" : "Privacy"}</span>
            <span>{language === "vi" ? "Điều khoản" : "Terms"}</span>
          </div>
        </div>

        {/* Academic Origin - Subtle acknowledgment at very bottom */}
        <div
          className={`mt-8 pt-6 border-t ${
            theme === "dark" ? "border-white/[0.02]" : "border-slate-200"
          }`}
        >
          <p
            className={`text-[10px] text-center leading-relaxed ${
              theme === "dark" ? "text-white/15" : "text-slate-400"
            }`}
          >
            {language === "vi"
              ? "Được phát triển như một dự án nghiên cứu & tầm nhìn tại"
              : "Developed as a research & vision project at"}{" "}
            <span
              className={theme === "dark" ? "text-white/20" : "text-slate-500"}
            >
              Khoa Công nghệ Nông nghiệp, Trường Đại học Công nghệ – Đại học
              Quốc gia Hà Nội.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
