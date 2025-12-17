/**
 * Navbar.tsx
 * Apple-style Navigation - Minimal, Premium
 * Simplified structure with language switcher
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", label: language === "vi" ? "Trang chủ" : "Home" },
    {
      href: "/forecast",
      label: language === "vi" ? "Dự báo" : "Forecast",
    },
    { href: "/premium", label: "Premium" },
    { href: "/vision", label: language === "vi" ? "Tầm nhìn" : "Vision" },
    { href: "/contact", label: language === "vi" ? "Liên hệ" : "Contact" },
  ];

  // Detect scroll for background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.closest(".lang-dropdown")) {
        setShowLangDropdown(false);
      }
    }
    if (showLangDropdown) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showLangDropdown]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHomePage = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? theme === "dark"
            ? "bg-[rgba(0,0,0,0.8)] backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-[rgba(255,255,255,0.9)] backdrop-blur-xl border-b border-black/[0.06] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo with sub-brand */}
          <Link
            href="/"
            className="group flex flex-col justify-center transition-colors"
          >
            <span
              className={`group-hover:opacity-100 text-[13px] sm:text-[14px] font-semibold tracking-tight transition-colors ${
                theme === "dark"
                  ? "text-white/90"
                  : scrolled || !isHomePage
                  ? "text-slate-800"
                  : "text-white/90"
              }`}
            >
              Trio AI
            </span>
            <span
              className={`text-[8px] sm:text-[9px] font-normal tracking-wide ${
                theme === "dark"
                  ? "text-white/40"
                  : scrolled || !isHomePage
                  ? "text-slate-500"
                  : "text-white/40"
              }`}
            >
              {language === "vi"
                ? "Dự án nghiên cứu & tầm nhìn · UET – ĐHQGHN"
                : "Research & vision project · UET – VNU"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-[12px] font-normal transition-all duration-200 ${
                  pathname === item.href
                    ? theme === "dark"
                      ? "text-white"
                      : scrolled || !isHomePage
                      ? "text-slate-900"
                      : "text-white"
                    : theme === "dark"
                    ? "text-white/50 hover:text-white/80"
                    : scrolled || !isHomePage
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-full transition-all duration-200 ${
                theme === "dark"
                  ? "text-white/50 hover:text-white/80 hover:bg-white/10"
                  : scrolled || !isHomePage
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-white/50 hover:text-white/80 hover:bg-white/10"
              }`}
              aria-label={
                theme === "dark"
                  ? "Chuyển sang chế độ sáng"
                  : "Chuyển sang chế độ tối"
              }
            >
              {theme === "dark" ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Language Toggle */}
            <div className="relative ml-2 lang-dropdown">
              <button
                onClick={() => setShowLangDropdown((v) => !v)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[12px] transition-colors border rounded-full ${
                  theme === "dark"
                    ? "text-white/50 hover:text-white/80 border-white/10"
                    : scrolled || !isHomePage
                    ? "text-slate-600 hover:text-slate-900 border-slate-200"
                    : "text-white/50 hover:text-white/80 border-white/10"
                }`}
              >
                {language === "vi" ? "VI" : "EN"}
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showLangDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showLangDropdown && (
                <div
                  className={`absolute right-0 top-full mt-2 backdrop-blur-xl rounded-xl border overflow-hidden min-w-[120px] ${
                    theme === "dark"
                      ? "bg-[rgba(0,0,0,0.95)] border-white/10"
                      : "bg-white border-slate-200 shadow-lg"
                  }`}
                >
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      setShowLangDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] transition-colors ${
                      language === "vi"
                        ? theme === "dark"
                          ? "text-white bg-white/10"
                          : "text-slate-900 bg-slate-100"
                        : theme === "dark"
                        ? "text-white/50 hover:text-white hover:bg-white/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    🇻🇳 Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLangDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] transition-colors ${
                      language === "en"
                        ? theme === "dark"
                          ? "text-white bg-white/10"
                          : "text-slate-900 bg-slate-100"
                        : theme === "dark"
                        ? "text-white/50 hover:text-white hover:bg-white/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              theme === "dark"
                ? "text-white/80 hover:text-white"
                : scrolled || !isHomePage
                ? "text-slate-600 hover:text-slate-900"
                : "text-white/80 hover:text-white"
            }`}
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`backdrop-blur-xl border-t ${
            theme === "dark"
              ? "bg-[rgba(0,0,0,0.95)] border-white/[0.06]"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-3 text-[14px] transition-colors ${
                  pathname === item.href
                    ? theme === "dark"
                      ? "text-white"
                      : "text-slate-900"
                    : theme === "dark"
                    ? "text-white/50"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle */}
            <div
              className={`pt-4 border-t flex items-center justify-between ${
                theme === "dark" ? "border-white/10" : "border-slate-200"
              }`}
            >
              <span
                className={`text-[12px] ${
                  theme === "dark" ? "text-white/50" : "text-slate-500"
                }`}
              >
                {language === "vi" ? "Chế độ" : "Theme"}
              </span>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] transition-colors ${
                  theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {theme === "dark" ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {language === "vi" ? "Sáng" : "Light"}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    {language === "vi" ? "Tối" : "Dark"}
                  </>
                )}
              </button>
            </div>

            {/* Mobile Language Toggle */}
            <div
              className={`pt-4 border-t flex gap-4 ${
                theme === "dark" ? "border-white/10" : "border-slate-200"
              }`}
            >
              <button
                onClick={() => setLanguage("vi")}
                className={`text-[12px] ${
                  language === "vi"
                    ? theme === "dark"
                      ? "text-white"
                      : "text-slate-900"
                    : theme === "dark"
                    ? "text-white/50"
                    : "text-slate-500"
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`text-[12px] ${
                  language === "en"
                    ? theme === "dark"
                      ? "text-white"
                      : "text-slate-900"
                    : theme === "dark"
                    ? "text-white/50"
                    : "text-slate-500"
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
