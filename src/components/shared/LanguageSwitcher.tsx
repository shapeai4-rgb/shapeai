"use client";

import { LOCALE_LABELS, normalizeLocale, SUPPORTED_LOCALES } from "@/i18n/config";
import { useI18n } from "@/i18n/client";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, messages, setLocale } = useI18n();

  return (
    <label className={compact ? "block" : "inline-flex items-center gap-2"}>
      <span className={compact ? "mb-1 block text-xs text-neutral-slate" : "sr-only"}>
        {messages.header.language}
      </span>
      <select
        aria-label={messages.header.language}
        value={locale}
        onChange={(event) => setLocale(normalizeLocale(event.target.value))}
        className="rounded-xl border border-neutral-lines bg-white px-3 py-2 text-sm text-neutral-ink outline-none ring-accent/50 focus:ring-2"
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {LOCALE_LABELS[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
