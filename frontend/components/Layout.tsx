/**
 * Layout.tsx
 *
 * Page layout wrapper component
 * Cung cấp layout chung cho các trang
 */

import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>© 2024 Coffee Yield Prediction System</p>
      </footer>
    </div>
  );
}
