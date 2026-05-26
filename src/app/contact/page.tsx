"use client";

import React from "react";
import { ContactForm } from "@/components/shared/ContactForm";
import { useI18n } from "@/i18n/client";

export default function ContactPage() {
  const { locale, messages } = useI18n();
  const labels = {
    en: { address: "Address", phone: "Phone" },
    es: { address: "Dirección", phone: "Teléfono" },
    de: { address: "Adresse", phone: "Telefon" },
  }[locale];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="font-headings text-3xl/tight font-semibold tracking-tight md:text-5xl/tight">
          {messages.contact.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-slate md:text-lg">
          {messages.contact.lead}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-4 text-neutral-slate">
          <h2 className="text-xl font-semibold text-neutral-ink">{messages.contact.details}</h2>
          <p><strong>{messages.contact.company}:</strong> PREPARING BUSINESS LTD</p>
          <p><strong>{messages.contact.companyNumber}:</strong> 16107292</p>
          <p><strong>{labels.address}:</strong> 12 Skinner Lane, Leeds, England, LS7 1DL</p>
          <p><strong>Email:</strong> info@shapeai.co.uk</p>
          <p><strong>{labels.phone}:</strong> +44 7463 585216</p>
          <p>{messages.contact.responseTime}</p>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
