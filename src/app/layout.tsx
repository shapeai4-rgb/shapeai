// src/app/layout.tsx 
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// ★★★ Импорты, которые я пропустил ★★★
import AuthProvider from "@/components/providers/AuthProvider";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

// ★★★ Определения шрифтов, которые я пропустил ★★★
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "WeightLoss.AI",
  description: "Your personal weight loss meal plan — in 30 seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          {/* ★★★ Оборачиваем {children} в <main> для семантической верстки ★★★ */}
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}