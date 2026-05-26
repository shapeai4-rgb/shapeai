import { DATE_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, normalizeLocale, type Locale } from "@/i18n/config";

export function getLocaleFromCookieHeader(cookieHeader: string | null | undefined): Locale {
  if (!cookieHeader) return DEFAULT_LOCALE;

  const value = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];

  return normalizeLocale(value);
}

export function getLocaleFromRequest(request: Request): Locale {
  return getLocaleFromCookieHeader(request.headers.get("cookie"));
}

export function formatLocalizedDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatLocalizedDateTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
