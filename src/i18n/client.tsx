"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "@/i18n/config";
import { formatMessage, getMessages, type Messages } from "@/i18n/messages";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (template: string, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readCookieLocale() {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];

  return normalizeLocale(value);
}

function persistLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return initialLocale;
    const stored = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
    const cookieLocale = readCookieLocale();
    return stored !== DEFAULT_LOCALE ? stored : cookieLocale;
  });

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const messages = getMessages(locale);

    return {
      locale,
      messages,
      setLocale(nextLocale) {
        setLocaleState(nextLocale);
        persistLocale(nextLocale);
      },
      t(template, values) {
        return values ? formatMessage(template, values) : template;
      },
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
