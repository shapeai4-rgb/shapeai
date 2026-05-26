"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/client";

export function Footer() {
  const { locale, messages } = useI18n();
  const localizedLinks = {
    en: {
      aiUseSafety: "AI Use & Safety Policy",
      cookiePolicy: "Cookie Policy",
      medicalDisclaimer: "Medical & Nutrition Disclaimer",
      privacyPolicy: "Privacy Policy",
      refundsPolicy: "Refund and Return Policy",
      terms: "Terms and Conditions",
    },
    es: {
      aiUseSafety: "Política de uso y seguridad de IA",
      cookiePolicy: "Política de cookies",
      medicalDisclaimer: "Descargo médico y nutricional",
      privacyPolicy: "Política de privacidad",
      refundsPolicy: "Política de reembolsos y devoluciones",
      terms: "Términos y condiciones",
    },
    de: {
      aiUseSafety: "KI-Nutzung und Sicherheit",
      cookiePolicy: "Cookie-Richtlinie",
      medicalDisclaimer: "Medizinischer und Ernährungshinweis",
      privacyPolicy: "Datenschutzerklärung",
      refundsPolicy: "Rückerstattungs- und Rückgaberichtlinie",
      terms: "Allgemeine Geschäftsbedingungen",
    },
  }[locale];
  const companyInfo = {
    name: "PREPARING BUSINESS LTD",
    companyNumber: "16107292",
    address: "12 Skinner Lane, Leeds, England, LS7 1DL",
    email: "info@shapeai.co.uk",
    phone: "+44 7463 585216",
  };

  const legalLinks = [
    { href: "/privacy-policy", text: localizedLinks.privacyPolicy },
    { href: "/cookie-policy", text: localizedLinks.cookiePolicy },
    { href: "/terms-of-service", text: localizedLinks.terms },
    { href: "/refunds-policy", text: localizedLinks.refundsPolicy },
  ];

  const usefulLinks = [
    { href: "/ai-use-safety-policy", text: localizedLinks.aiUseSafety },
    { href: "/medical-nutrition-disclaimer", text: localizedLinks.medicalDisclaimer },
    { href: "/contact", text: messages.footer.contact },
    { href: "/#faq", text: messages.common.faq },
    { href: "/#topup", text: messages.header.pricing },
  ];

  const socialLinks = [
    {
      href: "https://www.instagram.com/shapeai.uk/?igsh=NG04bHhueXFvemhm&utm_source=qr#",
      text: "Instagram",
      icon: "IG",
    },
    {
      href: "https://www.linkedin.com/company/shape%E2%80%94ai",
      text: "LinkedIn",
      icon: "in",
    },
  ];

  return (
    <footer className="border-t border-neutral-lines bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">{messages.footer.company}</h3>
            <div className="space-y-2 text-sm text-neutral-slate">
              <div className="font-medium text-neutral-ink">{companyInfo.name}</div>
              <div>{messages.footer.companyNo}: {companyInfo.companyNumber}</div>
              <div>{companyInfo.address}</div>
              <div>
                <a href={`mailto:${companyInfo.email}`} className="transition-colors hover:text-neutral-ink">
                  {companyInfo.email}
                </a>
              </div>
              <div>
                <a href={`tel:${companyInfo.phone}`} className="transition-colors hover:text-neutral-ink">
                  {companyInfo.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">{messages.footer.legal}</h3>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-neutral-slate transition-colors hover:text-neutral-ink">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">{messages.footer.usefulLinks}</h3>
            <div className="space-y-2">
              {usefulLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-neutral-slate transition-colors hover:text-neutral-ink">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">{messages.footer.social}</h3>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-neutral-slate transition-colors hover:text-neutral-ink">
                  <span className="text-xs font-semibold">{link.icon}</span>
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-lines pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-neutral-slate">
              © {new Date().getFullYear()} {companyInfo.name}. {messages.footer.allRights}
            </div>
            <div className="flex items-center gap-4">
              <Image src="/visa-logo.svg" alt="Visa" width={40} height={24} className="h-6 w-auto opacity-60" />
              <Image src="/mastercard-logo.svg" alt="Mastercard" width={40} height={24} className="h-6 w-auto opacity-60" />
              <Image src="/pci-dss-logo.svg" alt="PCI DSS" width={40} height={24} className="h-6 w-auto opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
