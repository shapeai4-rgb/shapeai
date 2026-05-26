export const SUPPORTED_LOCALES = ["en", "es", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "shapeai_locale";

export const LOCALE_STORAGE_KEY = "shapeai_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  de: "DE",
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
};

export const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  es: "es-ES",
  de: "de-DE",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
