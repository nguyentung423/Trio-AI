/**
 * Contact Page
 * Simple, premium contact form
 * Bilingual: Vietnamese (default) / English
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function ContactPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      language === "vi"
        ? "Cảm ơn bạn đã quan tâm. Đây là website demo."
        : "Thank you for your interest. This is a demo website."
    );
  };

  return (
    <div
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <p
            className={`text-[11px] tracking-[0.3em] uppercase mb-6 transition-all duration-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            } ${theme === "dark" ? "text-white/30" : "text-slate-500"}`}
          >
            {language === "vi" ? "Liên hệ" : "Contact"}
          </p>

          <h1
            className={`text-[40px] sm:text-[56px] font-semibold leading-[1.1] tracking-[-0.03em] transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {language === "vi" ? "Liên hệ với chúng tôi." : "Get in touch."}
          </h1>

          <p
            className={`mt-6 text-[17px] leading-relaxed transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } ${theme === "dark" ? "text-white/40" : "text-slate-500"}`}
          >
            {language === "vi"
              ? "Quan tâm đến truy cập Premium hoặc cơ hội hợp tác? Chúng tôi rất muốn nghe từ bạn."
              : "Interested in Premium access or partnership opportunities? We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-[500px] mx-auto px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Tên" : "Name"}
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                }`}
                placeholder={language === "vi" ? "Tên của bạn" : "Your name"}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                }`}
                placeholder={
                  language === "vi" ? "ban@tochuc.com" : "you@organization.com"
                }
              />
            </div>

            <div>
              <label
                className={`block text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Tổ chức" : "Organization"}
              </label>
              <input
                type="text"
                value={formState.organization}
                onChange={(e) =>
                  setFormState({ ...formState, organization: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                }`}
                placeholder={
                  language === "vi" ? "Tổ chức của bạn" : "Your organization"
                }
              />
            </div>

            <div>
              <label
                className={`block text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Tin nhắn" : "Message"}
              </label>
              <textarea
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                rows={5}
                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-colors resize-none ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                }`}
                placeholder={
                  language === "vi"
                    ? "Hãy cho chúng tôi biết về nhu cầu của bạn..."
                    : "Tell us about your needs..."
                }
              />
            </div>

            <button
              type="submit"
              className={`w-full py-4 text-[15px] font-medium rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {language === "vi" ? "Gửi Tin nhắn" : "Send Message"}
            </button>
          </form>

          <p
            className={`text-[12px] text-center mt-6 ${
              theme === "dark" ? "text-white/30" : "text-slate-400"
            }`}
          >
            {language === "vi"
              ? "Chúng tôi thường phản hồi trong vòng 24 giờ."
              : "We typically respond within 24 hours."}
          </p>
        </div>
      </section>

      {/* Team Section - Corporate Premium Design */}
      <section
        className={`py-24 ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]"
            : "bg-gradient-to-b from-slate-50 to-white"
        }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase mb-5 ${
                theme === "dark"
                  ? "bg-amber-500/10 text-amber-400/90 border border-amber-500/20"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {language === "vi" ? "Đội ngũ lãnh đạo" : "Leadership Team"}
            </span>
            <h2
              className={`text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {language === "vi"
                ? "Những con người tạo nên thành công"
                : "The People Behind Our Success"}
            </h2>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lê Thị Nga - CEO */}
            <div
              className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-[#151515] border border-white/[0.08] hover:border-amber-500/30 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
                  : "bg-white border border-slate-200 hover:border-amber-300 shadow-lg shadow-slate-200/60 hover:shadow-xl"
              }`}
            >
              <div className="p-7">
                {/* Avatar */}
                <div className="relative w-[76px] h-[76px] mx-auto mb-5">
                  <div
                    className={`w-full h-full rounded-full overflow-hidden ${
                      theme === "dark"
                        ? "ring-2 ring-white/10"
                        : "ring-2 ring-slate-200"
                    }`}
                  >
                    <img
                      src="/icons/n.jpg"
                      alt="Lê Thị Nga"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3
                    className={`text-[16px] font-bold tracking-tight ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Lê Thị Nga
                  </h3>
                  <p
                    className={`text-[12px] font-semibold mt-1.5 uppercase tracking-wide ${
                      theme === "dark" ? "text-amber-400/80" : "text-amber-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Giám đốc Điều hành"
                      : "Chief Executive Officer"}
                  </p>
                  <p
                    className={`text-[13px] mt-3 leading-relaxed ${
                      theme === "dark" ? "text-white/60" : "text-slate-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Điều phối bộ máy, dẫn dắt đội ngũ chinh phục mục tiêu"
                      : "Orchestrating operations, leading the team to conquer goals"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tăng Tuấn Việt - Chairman (Featured) */}
            <div
              className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-[#161616] border border-amber-500/25 hover:border-amber-500/50 shadow-xl shadow-black/50 hover:shadow-2xl"
                  : "bg-white border-2 border-amber-300 hover:border-amber-400 shadow-xl shadow-amber-100/80 hover:shadow-2xl"
              }`}
            >
              {/* Featured badge */}
              <div
                className={`absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded text-[9px] font-bold tracking-[0.15em] uppercase ${
                  theme === "dark"
                    ? "bg-amber-500 text-black"
                    : "bg-amber-500 text-white"
                }`}
              >
                {language === "vi" ? "Chủ tịch" : "Chairman"}
              </div>

              <div className="p-7 pt-9">
                {/* Avatar */}
                <div className="relative w-[88px] h-[88px] mx-auto mb-5">
                  <div
                    className={`w-full h-full rounded-full overflow-hidden ${
                      theme === "dark"
                        ? "ring-[3px] ring-amber-500/50 shadow-lg shadow-amber-500/20"
                        : "ring-[3px] ring-amber-400 shadow-lg shadow-amber-200"
                    }`}
                  >
                    <img
                      src="/icons/v.jpg"
                      alt="Tăng Tuấn Việt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3
                    className={`text-[17px] font-bold tracking-tight ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Tăng Tuấn Việt
                  </h3>
                  <p
                    className={`text-[12px] font-bold mt-1.5 uppercase tracking-wide ${
                      theme === "dark" ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Chủ tịch HĐQT"
                      : "Chairman of the Board"}
                  </p>
                  <p
                    className={`text-[13px] mt-3 leading-relaxed ${
                      theme === "dark" ? "text-white/60" : "text-slate-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Người vẽ tương lai, kiến tạo đế chế AI"
                      : "Architecting the future, building an AI empire"}
                  </p>
                </div>
              </div>
            </div>

            {/* Nguyễn Hoàng Tùng - Security */}
            <div
              className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-[#151515] border border-white/[0.08] hover:border-amber-500/30 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
                  : "bg-white border border-slate-200 hover:border-amber-300 shadow-lg shadow-slate-200/60 hover:shadow-xl"
              }`}
            >
              <div className="p-7">
                {/* Avatar */}
                <div className="relative w-[76px] h-[76px] mx-auto mb-5">
                  <div
                    className={`w-full h-full rounded-full overflow-hidden ${
                      theme === "dark"
                        ? "ring-2 ring-white/10"
                        : "ring-2 ring-slate-200"
                    }`}
                  >
                    <img
                      src="/icons/k.jpg"
                      alt="Nguyễn Hoàng Tùng"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3
                    className={`text-[16px] font-bold tracking-tight ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Nguyễn Hoàng Tùng
                  </h3>
                  <p
                    className={`text-[12px] font-semibold mt-1.5 uppercase tracking-wide ${
                      theme === "dark" ? "text-amber-400/80" : "text-amber-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Nhân viên Bảo vệ"
                      : "Security Officer"}
                  </p>
                  <p
                    className={`text-[13px] mt-3 leading-relaxed ${
                      theme === "dark" ? "text-white/60" : "text-slate-600"
                    }`}
                  >
                    {language === "vi"
                      ? "Canh cổng, pha trà và bảo vệ giấc ngủ server"
                      : "Guarding gates, making tea & protecting server sleep"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Back Link */}
      <section
        className={`py-16 border-t ${
          theme === "dark" ? "border-white/[0.04]" : "border-slate-200"
        }`}
      >
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mb-12">
            <div
              className={`p-6 rounded-2xl ${
                theme === "dark" ? "bg-white/[0.02]" : "bg-white"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-white/60" : "text-slate-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p
                className={`text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                Email
              </p>
              <p
                className={`text-[15px] ${
                  theme === "dark" ? "text-white/70" : "text-slate-700"
                }`}
              >
                tungnh.vspace@gmail.com
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                theme === "dark" ? "bg-white/[0.02]" : "bg-white"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-white/60" : "text-slate-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p
                className={`text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Trụ sở chính" : "Headquarters"}
              </p>
              <p
                className={`text-[15px] ${
                  theme === "dark" ? "text-white/70" : "text-slate-700"
                }`}
              >
                {language === "vi"
                  ? "Đại học Quốc gia Hà Nội"
                  : "Vietnam National University, Hanoi"}
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                theme === "dark" ? "bg-white/[0.02]" : "bg-white"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-white/60" : "text-slate-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p
                className={`text-[11px] uppercase tracking-wider mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Giờ làm việc" : "Working Hours"}
              </p>
              <p
                className={`text-[15px] ${
                  theme === "dark" ? "text-white/70" : "text-slate-700"
                }`}
              >
                {language === "vi"
                  ? "8:00 - 17:00 (T2-T6)"
                  : "8:00 AM - 5:00 PM (Mon-Fri)"}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-[14px] transition-colors ${
                theme === "dark"
                  ? "text-white/40 hover:text-white/70"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {language === "vi" ? "Quay lại Trang chủ" : "Back to Home"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
