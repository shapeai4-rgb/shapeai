import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  // ★ 2. Создаем массив ссылок для удобства
  const policyLinks = [
    { href: "/privacy-policy", text: "Privacy Policy" },
    { href: "/cookie-policy", text: "Cookie Policy" },
    { href: "/terms-of-service", text: "Terms of Service" },
    { href: "/refunds-policy", text: "Refunds Policy" },
    { href: "/ai-use-safety-policy", text: "AI Use & Safety Policy" },
    { href: "/medical-nutrition-disclaimer", text: "Medical & Nutrition Disclaimer" },
  ];

  const paymentLogos = [
    { src: '/visa-logo.svg', alt: 'Visa' },
    { src: '/mastercard-logo.svg', alt: 'Mastercard' },
    { src: '/American_Express_logo.svg', alt: 'American Express' },
    { src: '/Maestro_Logo.svg', alt: 'Maestro' },
    { src: '/Apple_Pay_logo.svg', alt: 'Apple Pay' },
    { src: '/Google_Pay_Logo.svg', alt: 'Google Pay' },
  ];

  return (
    <footer className="border-t border-neutral-lines bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-slate">
        <div className="flex flex-col items-center gap-6">
          {/* Блок с политиками и контактами */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {policyLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-neutral-ink">
                {link.text}
              </Link>
            ))}
            <Link href="/contact" className="transition-colors hover:text-neutral-ink">
              Contact
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4">
            {paymentLogos.map((logo) => (
              <Image 
                key={logo.src} 
                src={logo.src} 
                alt={logo.alt}
                width={40} // Задаем базовую ширину
                height={24} // Задаем базовую высоту
                className="h-6 w-auto opacity-60 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
          <div>© {new Date().getFullYear()} PREPARING BUSINESS LTD</div>
        </div>
      </div>
    </footer>
  );
}