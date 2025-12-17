"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        language === "vi"
          ? "Xin chào. Tôi có thể giúp bạn tìm hiểu về dự báo nông nghiệp."
          : "Hello. I can help you explore agricultural forecasting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SYSTEM_PROMPT =
    language === "vi"
      ? `Bạn là trợ lý AI của Trio AI - công ty công nghệ chuyên về dự báo nông nghiệp bằng AI.

## VỀ TRIO AI
- Trio AI là công ty công nghệ AI chuyên về dự báo năng suất nông nghiệp toàn cầu
- Sứ mệnh: Mang công nghệ AI tiên tiến đến ngành nông nghiệp, giúp nông dân và doanh nghiệp đưa ra quyết định chính xác hơn
- Website demo các tính năng dự báo năng suất cà phê sử dụng Machine Learning

## ĐỘI NGŨ LÃNH ĐẠO
1. **Tăng Tuấn Việt** - Chủ tịch HĐQT: Người vẽ tương lai, kiến tạo đế chế AI
2. **Lê Thị Nga** - Giám đốc Điều hành (CEO): Điều phối bộ máy, dẫn dắt đội ngũ chinh phục mục tiêu
3. **Nguyễn Hoàng Tùng** - Nhân viên Bảo vệ: Canh cổng, pha trà và bảo vệ giấc ngủ server

## CÁC TÍNH NĂNG CHÍNH
1. **Dự báo năng suất (Predict)**: Nhập thông số thời tiết để dự báo năng suất cà phê bằng mô hình XGBoost
2. **So sánh (Compare)**: So sánh năng suất giữa các quốc gia sản xuất cà phê hàng đầu
3. **Kết quả (Results)**: Xem kết quả dự báo chi tiết với biểu đồ trực quan
4. **Giải thích AI (Explain)**: Hiểu cách AI đưa ra dự báo, các yếu tố ảnh hưởng
5. **Vision AI**: Phân tích hình ảnh lá cà phê để phát hiện bệnh
6. **Premium**: Gói nâng cao với nhiều tính năng hơn

## CÔNG NGHỆ SỬ DỤNG
- Frontend: Next.js, React, TailwindCSS
- Backend: Node.js, Express
- AI/ML: XGBoost, Python, scikit-learn
- Dữ liệu: FAO, NASA POWER (thời tiết)

## HƯỚNG DẪN SỬ DỤNG
- Vào trang "Dự báo" để nhập dữ liệu thời tiết và nhận kết quả
- Các thông số cần nhập: nhiệt độ, lượng mưa, độ ẩm, ánh sáng mặt trời
- Hệ thống sẽ trả về năng suất dự báo (tấn/ha) cùng độ tin cậy

Luôn trả lời ngắn gọn, chuyên nghiệp, thân thiện. Nếu không biết thì nói không biết.
Khi được hỏi về đội ngũ, giới thiệu một cách vui vẻ nhưng vẫn chuyên nghiệp.`
      : `You are an AI assistant for Trio AI - a technology company specializing in AI-powered agricultural forecasting.

## ABOUT TRIO AI
- Trio AI is an AI technology company specializing in global agricultural yield forecasting
- Mission: Bringing advanced AI technology to agriculture, helping farmers and businesses make more accurate decisions
- This website demos coffee yield prediction features using Machine Learning

## LEADERSHIP TEAM
1. **Tăng Tuấn Việt** - Chairman of the Board: Architecting the future, building an AI empire
2. **Lê Thị Nga** - Chief Executive Officer: Orchestrating operations, leading the team to conquer goals
3. **Nguyễn Hoàng Tùng** - Security Officer: Guarding gates, making tea & protecting server sleep

## MAIN FEATURES
1. **Predict**: Input weather parameters to forecast coffee yield using XGBoost model
2. **Compare**: Compare yields between top coffee-producing countries
3. **Results**: View detailed prediction results with visual charts
4. **Explain AI**: Understand how AI makes predictions, influencing factors
5. **Vision AI**: Analyze coffee leaf images to detect diseases
6. **Premium**: Advanced package with more features

## TECHNOLOGY STACK
- Frontend: Next.js, React, TailwindCSS
- Backend: Node.js, Express
- AI/ML: XGBoost, Python, scikit-learn
- Data: FAO, NASA POWER (weather)

## HOW TO USE
- Go to "Predict" page to input weather data and get results
- Parameters needed: temperature, rainfall, humidity, sunlight
- System returns predicted yield (tons/ha) with confidence level

Always respond concisely, professionally, and friendly. If you don't know, say so.
When asked about the team, introduce them in a fun but professional way.`;

  // Fade in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lock body scroll when chatbot opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "vi"
              ? "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau."
              : "Sorry, an error occurred. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger - Corporate AI Assistant */}
      <div
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Tooltip on hover */}
        <div className="relative group">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative flex items-center justify-center transition-all duration-300 ease-out ${
              isOpen
                ? "w-10 h-10 rounded-full bg-neutral-800/90 backdrop-blur-md border border-white/[0.06]"
                : "w-10 h-10 rounded-full bg-neutral-900/95 backdrop-blur-md border border-white/[0.08] hover:bg-neutral-800/95 hover:border-white/[0.12]"
            }`}
            style={{
              boxShadow:
                "0 4px 24px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.1)",
            }}
            aria-label={language === "vi" ? "Trợ lý AI" : "AI Assistant"}
          >
            {isOpen ? (
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <div className="relative flex items-center justify-center">
                {/* Minimal AI icon - abstract neural dot */}
                <div className="relative">
                  <div className="w-[6px] h-[6px] bg-neutral-400 rounded-full group-hover:bg-neutral-300 transition-colors duration-300"></div>
                  {/* Subtle pulse ring */}
                  <div className="absolute inset-0 w-[6px] h-[6px] bg-neutral-400/50 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                {/* Orbital ring */}
                <div className="absolute w-5 h-5 border border-neutral-600/50 rounded-full group-hover:border-neutral-500/60 transition-colors duration-300"></div>
              </div>
            )}
          </button>

          {/* Tooltip - appears on hover when closed */}
          {!isOpen && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="px-2.5 py-1.5 bg-neutral-900/95 backdrop-blur-sm border border-white/[0.06] rounded-md whitespace-nowrap">
                <span className="text-[11px] text-neutral-400 font-medium tracking-wide uppercase">
                  {language === "vi" ? "Trợ lý AI" : "AI Assistant"}
                </span>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="w-0 h-0 border-l-4 border-l-neutral-900/95 border-y-4 border-y-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel - Premium Overlay */}
      <div
        className={`fixed inset-0 md:inset-auto md:bottom-24 md:right-8 md:w-[380px] md:h-[520px] z-50 transition-all duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none md:translate-y-4"
        }`}
      >
        <div
          className="w-full h-full bg-[#0a0a0a] md:rounded-2xl overflow-hidden flex flex-col md:border md:border-white/[0.08]"
          style={{
            boxShadow:
              "0 24px 80px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Header - Minimal */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* AI Symbol - Neutral */}
              <div className="relative w-8 h-8 bg-neutral-800 border border-white/[0.08] rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-neutral-400/30 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-white/90">
                  Trio AI
                </h3>
                <p className="text-[11px] text-white/40">
                  {language === "vi"
                    ? "Trợ lý nông nghiệp"
                    : "Agricultural assistant"}
                </p>
              </div>
            </div>

            {/* Close button - Mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.06] transition-colors md:hidden"
            >
              <svg
                className="w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Suggestions - Only on first message */}
          {messages.length === 1 && (
            <div className="px-5 py-4 border-b border-white/[0.04]">
              <p className="text-[11px] text-white/30 uppercase tracking-wider mb-3">
                {language === "vi" ? "Gợi ý" : "Suggestions"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(language === "vi"
                  ? [
                      "Dự báo năng suất",
                      "Phân tích thời tiết",
                      "Xu hướng toàn cầu",
                    ]
                  : ["Yield forecast", "Weather analysis", "Global trends"]
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-[12px] text-white/50 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white/70 rounded-full border border-white/[0.06] transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI indicator */}
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/[0.06] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-neutral-700 text-white/90"
                      : "bg-white/[0.06] text-white/80"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator - Subtle */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/[0.06] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                </div>
                <div className="bg-white/[0.06] px-4 py-3 rounded-2xl">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></span>
                    <span
                      className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Clean */}
          <div className="p-4 border-t border-white/[0.06] safe-area-inset-bottom">
            <div className="flex items-center gap-3 bg-white/[0.04] rounded-full px-4 py-2 border border-white/[0.06] focus-within:border-white/[0.12] transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "vi" ? "Nhập câu hỏi..." : "Type a question..."
                }
                className="flex-1 bg-transparent text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none"
                style={{ fontSize: "16px" }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
