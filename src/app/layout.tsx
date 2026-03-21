import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShapeAI - Personalized Meal Plans",
  description: "Generate your personalized weight loss meal plan in seconds. Describe your goals and get a 7-day PDF with recipes and a shopping list.",
  openGraph: {
    title: "ShapeAI - Personalized Meal Plans",
    description: "Generate your personalized weight loss meal plan in seconds.",
    url: "https://shapeai.co.uk",
    siteName: "ShapeAI",
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
    title: "ShapeAI - Personalized Meal Plans",
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
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
