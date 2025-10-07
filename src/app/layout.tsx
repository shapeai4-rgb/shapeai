import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // ★ 1. Импортируем наш провайдер
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeightLoss.AI - Personalized Meal Plans", // ★ 1. Более информативный заголовок
  description: "Generate your personalized weight loss meal plan in seconds. Describe your goals and get a 7-day PDF with recipes and a shopping list.",
  
  // ★★★ 2. НОВЫЙ БЛОК ДЛЯ OPEN GRAPH ★★★
  openGraph: {
    title: "WeightLoss.AI - Personalized Meal Plans",
    description: "Generate your personalized weight loss meal plan in seconds.",
    url: "https://shapeai.co.uk",
    siteName: "WeightLoss.AI",
    // ★ Убедитесь, что это изображение есть в папке public/
    // ★ Идеальный размер: 1200x630px
    images: [
      {
        url: "https://shapeai.co.uk/og-image.png", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeightLoss.AI - Personalized Meal Plans",
    description: "Generate your personalized weight loss meal plan in seconds.",
    images: ["https://shapeai.co.uk/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      </head>
      <body className={inter.className}>
        {/* ★★★ 2. ОБОРАЧИВАЕМ ВСЁ ПРИЛОЖЕНИЕ В AuthProvider ★★★ */}
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}