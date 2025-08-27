import type { Metadata } from "next";
// ...

export const metadata: Metadata = {
  title: "WeightLoss.AI",
  description: "Your personal weight loss meal plan.",
  // ★★★ НОВЫЙ БЛОК ДЛЯ ИКОНОК ★★★
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Остальные теги (для android) добавляются напрямую в head */}
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}