/**
 * LanguageContext.tsx
 *
 * Context để quản lý ngôn ngữ toàn ứng dụng
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, Language, Translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true);
    // Load language từ localStorage khi mount
    try {
      const saved = localStorage.getItem("language") as Language;
      if (saved && (saved === "vi" || saved === "en")) {
        setLanguageState(saved);
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  // Save language vào localStorage khi thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("language", lang);
    } catch (e) {
      // localStorage not available
    }
  };

  const t = translations[language];

  // Prevent hydration mismatch by rendering null until client
  if (!isClient) {
    return (
      <LanguageContext.Provider
        value={{ language: "vi", setLanguage, t: translations.vi }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
