// src/ app/ layout.tsx
import type { Metadata } from "next";
// Импортируем нужные шрифты из Google Fonts
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Настраиваем шрифты
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Создаем CSS переменную для Inter
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"], // Загружаем только нужные нам веса
  variable: "--font-plus-jakarta-sans", // Создаем CSS переменную для заголовков
});

export const metadata: Metadata = {
  title: "WeightLoss.AI",
  description: "Your personal weight loss meal plan — in 30 seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Применяем переменные шрифтов к всему приложению
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}