import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nông nghiệp AI – Global Agricultural Intelligence",
    template: "%s | Nông nghiệp AI",
  },
  description:
    "AI dự báo và phân tích sản lượng cây trồng toàn cầu. Dự án nghiên cứu & tầm nhìn · UET – ĐHQGHN.",
  keywords: [
    "nông nghiệp AI",
    "agricultural intelligence",
    "dự báo sản lượng",
    "crop yield prediction",
    "machine learning",
    "global agriculture",
    "AI farming",
  ],
  authors: [{ name: "Tung Nguyen", url: "mailto:tungnh.vspace@gmail.com" }],
  creator: "UET – ĐHQGHN",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Nông nghiệp AI – Global Agricultural Intelligence",
    description:
      "AI dự báo và phân tích sản lượng cây trồng toàn cầu. Dự án nghiên cứu & tầm nhìn · UET – ĐHQGHN.",
    siteName: "Nông nghiệp AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
