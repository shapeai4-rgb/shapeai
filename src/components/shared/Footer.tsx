import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  // Данные компании
  const companyInfo = {
    name: "PREPARING BUSINESS LTD",
    companyNumber: "16107292",
    address: "12 Skinner Lane, Leeds, England, LS7 1DL",
    email: "info@shapeai.co.uk",
    phone: "+44 7418 638914"
  };

  // Legal ссылки
  const legalLinks = [
    { href: "/privacy-policy", text: "Privacy Policy" },
    { href: "/cookie-policy", text: "Cookie Policy" },
    { href: "/terms-of-service", text: "Terms and Conditions" },
    { href: "/refunds-policy", text: "Refund and Return Policy" },
  ];

  // Полезные ссылки
  const usefulLinks = [
    { href: "/ai-use-safety-policy", text: "AI Use & Safety Policy" },
    { href: "/medical-nutrition-disclaimer", text: "Medical & Nutrition Disclaimer" },
    { href: "/contact", text: "Contact" },
    { href: "/#faq", text: "FAQ" },
    { href: "/#topup", text: "Pricing" },
  ];

  // Социальные сети
  const socialLinks = [
    { 
      href: "https://www.instagram.com/shapeai.uk/?igsh=NG04bHhueXFvemhm&utm_source=qr#", 
      text: "Instagram",
      icon: "📷"
    },
    {
      href: "https://www.linkedin.com/company/shape%E2%80%94ai",
      text: "LinkedIn",
      icon: "in"
    },
  ];

  return (
    <footer className="border-t border-neutral-lines bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">Company</h3>
            <div className="space-y-2 text-sm text-neutral-slate">
              <div className="font-medium text-neutral-ink">{companyInfo.name}</div>
              <div>Company no.: {companyInfo.companyNumber}</div>
              <div>{companyInfo.address}</div>
              <div>
                <a href={`mailto:${companyInfo.email}`} className="hover:text-neutral-ink transition-colors">
                  {companyInfo.email}
                </a>
              </div>
              <div>
                <a href={`tel:${companyInfo.phone}`} className="hover:text-neutral-ink transition-colors">
                  {companyInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">Legal</h3>
            <div className="space-y-2">
              {legalLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block text-sm text-neutral-slate hover:text-neutral-ink transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">Useful Links</h3>
            <div className="space-y-2">
              {usefulLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block text-sm text-neutral-slate hover:text-neutral-ink transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-ink">Social</h3>
            <div className="space-y-2">
              {socialLinks.map(link => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neutral-slate hover:text-neutral-ink transition-colors"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.text}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-lines">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-slate">
              © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            </div>
            
            {/* Payment logos */}
            <div className="flex items-center gap-4">
              <Image 
                src="/visa-logo.svg" 
                alt="Visa"
                width={40}
                height={24}
                className="h-6 w-auto opacity-60"
              />
              <Image 
                src="/mastercard-logo.svg" 
                alt="Mastercard"
                width={40}
                height={24}
                className="h-6 w-auto opacity-60"
              />
              <Image 
                src="/American_Express_logo.svg" 
                alt="American Express"
                width={40}
                height={24}
                className="h-6 w-auto opacity-60"
              />
              <Image 
                src="/Maestro_Logo.svg" 
                alt="Maestro"
                width={40}
                height={24}
                className="h-6 w-auto opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}