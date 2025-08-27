import React from 'react';
import Link from 'next/link'; // ★ 1. Импортируем Link для 'Contact'

export function Footer() {
  // ★ 2. Создаем массив ссылок для удобства
  const policyLinks = [
    { href: "/privacy-policy", text: "Privacy Policy" },
    { href: "/cookie-policy", text: "Cookie Policy" },
    { href: "/terms-of-service", text: "Terms of Service" },
    { href: "/refunds-policy", text: "Refunds Policy" },
    { href: "/ai-use-safety-policy", text: "AI Use & Safety Policy" },
    { href: "/medical-disclaimer", text: "Medical & Nutrition Disclaimer" },
  ];

  return (
    <footer className="border-t border-neutral-lines bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-slate">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* ★ 3. Обновленный копирайт */}
          <div>© {new Date().getFullYear()} PREPARING BUSINESS LTD</div>

          {/* ★ 4. Новый блок со всеми ссылками */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {policyLinks.map(link => (
              // Используем <a> для внешних ссылок или страниц, которые еще не созданы
              <a key={link.href} href={link.href} className="transition-colors hover:text-neutral-ink">
                {link.text}
              </a>
            ))}
            {/* Используем Link для внутренних страниц, таких как Contact */}
            <Link href="/contact" className="transition-colors hover:text-neutral-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}