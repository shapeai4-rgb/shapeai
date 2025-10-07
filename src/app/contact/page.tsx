'use client';

import React from 'react';
import { ContactForm } from '@/components/shared/ContactForm'; // ★ 1. Импортируем компонент

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-neutral-slate md:text-lg">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* --- Левая колонка: Контактные данные --- */}
        <div className="space-y-4 text-neutral-slate">
          <h2 className="text-xl font-semibold text-neutral-ink">Our Details</h2>
          <p><strong>Company:</strong> PREPARING BUSINESS LTD</p>
          <p><strong>Email:</strong> info@shapeai.co.uk</p>
          <p><strong>Phone:</strong> +44 7418 638914</p>
          <p>
            We aim to respond to all inquiries within 2 business days.
          </p>
        </div>

        {/* --- Правая колонка: Форма обратной связи --- */}
        <div>
          {/* ★ 2. Вся логика и JSX формы теперь здесь */}
          <ContactForm /> 
        </div>
      </div>
    </main>
  );
}