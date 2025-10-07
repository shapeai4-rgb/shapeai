'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import axios from 'axios';

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { AuthModal } from "@/components/shared/AuthModal";

// --- Типы и Данные ---
type Currency = 'EUR' | 'GBP';
type TopUpPlan = {
  id: string;
  name: string;
  priceEUR?: number;
  tokens?: number;
  bonus?: string;
  popular?: boolean;
  custom?: boolean;
};

const TOPUP_PLANS: TopUpPlan[] = [
  { id: "lite", name: "Lite", priceEUR: 9, tokens: 90 },
  { id: "standard", name: "Standard", priceEUR: 19, tokens: 210, bonus: "+10%", popular: true },
  { id: "pro", name: "Pro", priceEUR: 49, tokens: 600, bonus: "+20%" },
  { id: "custom", name: "Custom", custom: true },
];

// --- Вспомогательные функции ---
const FX_EUR_GBP = 0.85;
function formatCurrency(cur: Currency, amount: number, opts: { trimCents?: boolean } = {}) { const symbol = cur === 'EUR' ? '€' : '£'; const value = opts.trimCents ? amount.toFixed(0) : amount.toFixed(2); return `${symbol}${value}`; }
function convertEUR(amountEUR: number, to: Currency) { return to === 'EUR' ? amountEUR : amountEUR * FX_EUR_GBP; }
function isValidAmount(input: string) { const trimmed = input.trim(); if (!trimmed) return false; return /^\d+(?:[\.,]\d{1,2})?$/.test(trimmed); }
function normalizeAmount(input: string) { return input.replace(',', '.'); }

// --- Компонент TopUpCard (теперь с рабочей логикой) ---
function TopUpCard({ plan, onSelect, isLoggedIn }: { plan: TopUpPlan; onSelect: () => void; isLoggedIn: boolean; }) {
  const [amount, setAmount] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const currency = useAppStore((state) => state.currency);
  const symbol = currency === 'EUR' ? '€' : '£';
  const valid = plan.custom ? isValidAmount(amount) : true;
  const priceInSelected = plan.custom ? (valid ? Number(normalizeAmount(amount)) : null) : (plan.priceEUR != null ? convertEUR(plan.priceEUR, currency) : null);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      onSelect();
      return;
    }
    setIsRedirecting(true);
    try {
      const lowerCaseCurrency = currency.toLowerCase();
      const requestBody = plan.custom
        ? { customAmount: Math.round(Number(normalizeAmount(amount)) * 100), currency: lowerCaseCurrency }
        : { planId: plan.id, currency: lowerCaseCurrency };
      
      if (plan.custom && !valid) {
        alert("Please enter a valid amount.");
        setIsRedirecting(false);
        return;
      }

      const { data } = await axios.post('/api/checkout-sessions', requestBody);
      console.log('Checkout response:', data);
      
      if (data.url) {
        console.log('Making request to:', data.url);
        // Для бесплатного режима делаем fetch запрос вместо редиректа
        // В продакшене используем полный URL, в разработке - относительный
        const isProduction = window.location.hostname === 'shapeai.co.uk';
        const requestUrl = isProduction ? data.url : data.url.replace('https://shapeai.co.uk', '');
        console.log('Making request to:', requestUrl);
        const response = await fetch(requestUrl);
        console.log('Free top-up response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Free top-up result:', result);
        
        if (result.success) {
          // Обновляем страницу для получения нового баланса токенов
          window.location.href = result.redirectUrl;
        } else {
          alert("Failed to add tokens. Please try again.");
          setIsRedirecting(false);
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatedCard>
      <article className={cn("relative rounded-card border p-5 shadow-soft h-full", plan.popular ? "border-accent bg-accent/10" : "border-neutral-lines bg-white")}>
        {plan.popular && <div className="absolute -top-2 right-4 rounded-full bg-accent px-2 py-0.5 text-xs text-white">Most popular</div>}
        <div className="flex items-baseline justify-between">
          <h3 className="font-headings text-base font-semibold">{plan.name}</h3>
          {plan.bonus && <span className="text-xs text-accent">{plan.bonus}</span>}
        </div>
        {plan.custom ? (
          <div className="mt-2">
            <label className="text-xs text-neutral-slate">Amount ({symbol})</label>
            <input inputMode="decimal" placeholder={symbol + " 12.50"} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-lines px-3 py-2 text-sm outline-none ring-accent/50 focus:ring-2" />
            <p className={cn("mt-1 text-xs", valid ? "text-neutral-slate/80" : "text-status-danger")}>{valid ? "Up to 2 decimals (dot or comma)." : "Please enter a valid amount."}</p>
          </div>
        ) : (
          <div className="mt-2 text-2xl font-headings font-semibold">{formatCurrency(currency, Number(priceInSelected?.toFixed(0) ?? 0), { trimCents: true })}</div>
        )}
        {plan.tokens && <div className="mt-1 text-xs text-neutral-slate">≈ {plan.tokens.toLocaleString()} tokens</div>}
        <div className="mt-4 text-xs text-neutral-slate">
          {isLoggedIn ? 'Get tokens instantly' : 'Sign in to get tokens'}
        </div>
        <Button onClick={handleCheckout} locked={plan.custom && !valid} disabled={isRedirecting} className="w-full mt-2 text-sm py-2">
        {isRedirecting ? 'Getting tokens...' : (
            isLoggedIn 
              ? (plan.custom ? `Get ${plan.tokens || Math.round(Number(normalizeAmount(amount)) * 10)} tokens` : `Get ${plan.tokens} tokens`)
              : 'Sign up to get tokens'
          )}
        </Button>
      </article>
    </AnimatedCard>
  );
}

// --- Главный компонент страницы ---
export default function TopUpPage() {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <StaggeredFadeIn>
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight">
              Top-up tokens
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-neutral-slate md:text-lg">
              Choose a pack or enter a custom amount. Tokens are currently free for all users!
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {TOPUP_PLANS.map((p) => (
              <TopUpCard key={p.id} plan={p} onSelect={() => setAuthMode("signup")} isLoggedIn={isLoggedIn} />
            ))}
          </motion.div>
        </StaggeredFadeIn>
      </main>
      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </>
  );
}