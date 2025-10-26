// src/app/page.tsx
'use client';

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import axios from 'axios';

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { RecipeCard } from "@/components/shared/RecipeCard";
import { AuthModal } from "@/components/shared/AuthModal";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { GeneratorPanel } from '@/components/shared/GeneratorPanel';
import { type GeneratorFormData } from "@/types";
import { ContactForm } from '@/components/shared/ContactForm';

// Типы для ответа от AI

// --- Типы и Данные ---
type Currency = 'EUR' | 'GBP' | 'USD';
type TopUpPlan = { id: string; name: string; priceEUR?: number; tokens?: number; bonus?: string; popular?: boolean; custom?: boolean; };
type Recipe = { id: string; title: string; kcal: number; macro: { protein: number; fat: number; carbs: number }; time: string; portion: string; image?: string; };

const TOPUP_PLANS: TopUpPlan[] = [ { id: "lite", name: "Lite", priceEUR: 9, tokens: 90 }, { id: "standard", name: "Standard", priceEUR: 19, tokens: 210, bonus: "+10%", popular: true }, { id: "pro", name: "Pro", priceEUR: 49, tokens: 600, bonus: "+20%" }, { id: "custom", name: "Custom", custom: true }, ];
const MOCK_RECIPES: Recipe[] = [ { id: "r1", title: "Greek Chicken Bowl", kcal: 520, macro: { protein: 45, fat: 18, carbs: 45 }, time: "20–25 min", portion: "1 bowl (380 g)", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1640&auto=format&fit=crop" }, { id: "r2", title: "Steamed Salmon with Veg", kcal: 430, macro: { protein: 36, fat: 15, carbs: 32 }, time: "18–22 min", portion: "1 serving (300 g)", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1640&auto=format&fit=crop" }, { id: "r3", title: "Overnight Oats Protein Pudding", kcal: 310, macro: { protein: 28, fat: 7, carbs: 35 }, time: "10–15 min", portion: "1 cup (260 g)", image: "https://images.unsplash.com/photo-1532768641073-503a250f9754?q=80&w=1640&auto=format&fit=crop" }, ];
const STEP_ITEMS = [ { title: "Brief", desc: "Describe habits and limits: cook time, budget, cuisines, allergies.", icon: ( <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"> <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" /> </svg> )}, { title: "Preview", desc: "Instant 1‑day plan: calories, macros, portions and quick swaps.", icon: ( <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"> <path d="M3 7h18M3 12h18M3 17h18" /> </svg> )}, { title: "7‑Day PDF", desc: "Download a branded PDF with shopping list and QR to live plan.", icon: ( <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> <path d="M14 2v6h6" /> </svg> )}, ];
const FAQ = [ { q: "How accurate are calories?", a: "We use BMR/TDEE with a safe deficit. You can inspect and adjust assumptions in the calculation popover." }, { q: "Can I swap meals?", a: "Yes. Each meal has 2–3 isocaloric alternatives with similar macros." }, { q: "GLP‑1 mode available?", a: "Yes — smaller portions, higher protein, and gentle texture tips + hydration reminders." }, { q: "Is the PDF free?", a: "1‑day preview is free. The 7‑day PDF export unlocks after sign up." }, ];

// --- Вспомогательные функции ---
const FX_EUR_GBP = 0.85;
const FX_EUR_USD = 1.17;
function formatCurrency(cur: Currency, amount: number, opts: { trimCents?: boolean } = {}) { const symbol = cur === 'EUR' ? '€' : cur === 'GBP' ? '£' : '$'; const value = opts.trimCents ? amount.toFixed(0) : amount.toFixed(2); return `${symbol}${value}`; }
function convertEUR(amountEUR: number, to: Currency) { return to === 'EUR' ? amountEUR : to === 'GBP' ? amountEUR * FX_EUR_GBP : amountEUR * FX_EUR_USD; }
function isValidAmount(input: string) { const trimmed = input.trim(); if (!trimmed) return false; return /^\d+(?:[\.,]\d{1,2})?$/.test(trimmed); }
function normalizeAmount(input: string) { return input.replace(',', '.'); }

// --- Уникальные Компоненты для Этой Страницы ---
function TopUpCard({ plan, onSelect, isLoggedIn }: { plan: TopUpPlan; onSelect: () => void; isLoggedIn: boolean; }) {
  const [amount, setAmount] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const currency = useAppStore((state) => state.currency);
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const valid = plan.custom ? isValidAmount(amount) : true;
  const priceInSelected = plan.custom ? (valid ? Number(normalizeAmount(amount)) : null) : (plan.priceEUR != null ? convertEUR(plan.priceEUR, currency) : null);

    const handleCheckout = async () => {
        if (!isLoggedIn) { onSelect(); return; }

        setIsRedirecting(true);

        try {
            const selectedPlan = {
                id: plan.id,
                name: plan.name,
                price: priceInSelected,
                currency,
                tokens: plan.tokens,
            };

            localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));

            // 👇 створюємо ордер і редіректимось
            const res = await fetch("/api/bizon/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "User Name",
                    email: "user@example.com",
                    amount: Number(priceInSelected!.toFixed(2)),
                    currency,
                    description: `Top-up for ${plan.name}`,
                }),
            });

            const data = await res.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                console.error("Payment error:", data);
                alert("Payment failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Payment error: " + err);
        } finally {
            setIsRedirecting(false);
        }
    };

    return (
    <AnimatedCard>
      <article className={cn("relative rounded-card border p-5 shadow-soft h-full", plan.popular ? "border-accent bg-accent/10" : "border-neutral-lines bg-white")}>
        {plan.popular && <div className="absolute -top-2 right-4 rounded-full bg-accent px-2 py-0.5 text-xs text-white">Most popular</div>}
        <div className="flex items-baseline justify-between"> <h3 className="font-headings text-base font-semibold">{plan.name}</h3> {plan.bonus && <span className="text-xs text-accent">{plan.bonus}</span>} </div>
        {plan.custom ? (
          <div className="mt-2">
            <label className="text-xs text-neutral-slate">Amount ({symbol})</label>
            <input inputMode="decimal" placeholder={symbol + " 12.50"} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-lines px-3 py-2 text-sm outline-none ring-accent/50 focus:ring-2" />
            <p className={cn("mt-1 text-xs", valid ? "text-neutral-slate/80" : "text-status-danger")}>{valid ? "Up to 2 decimals (dot or comma)." : "Please enter a valid amount."}</p>
          </div>
        ) : ( <div className="mt-2 text-2xl font-headings font-semibold">{formatCurrency(currency, priceInSelected ?? 0)}</div> )}
        {plan.tokens && <div className="mt-1 text-xs text-neutral-slate">≈ {plan.tokens.toLocaleString()} tokens</div>}
        <div className="mt-4 text-xs text-neutral-slate"> {isLoggedIn ? 'Proceed to checkout' : 'Sign in to Top‑up'} </div>
        <Button onClick={handleCheckout} locked={plan.custom && !valid} disabled={isRedirecting} className="w-full mt-2 text-sm py-2"> {isRedirecting ? 'Redirecting...' : (
            isLoggedIn 
              ? `Top-up ${formatCurrency(currency, priceInSelected ?? 0)}`
              : 'Sign up to Top-up'
          )}
        </Button>
      </article>
    </AnimatedCard>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div variants={itemVariants} className="rounded-card border border-neutral-lines bg-white p-5">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between text-left">
        <span className="font-headings font-semibold text-neutral-ink">{q}</span>
        <motion.span className="text-neutral-slate" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>⌄</motion.span>
      </button>
      <AnimatePresence>
        {isOpen && ( <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '12px' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.2 }}> <p className="text-sm text-neutral-slate">{a}</p> </motion.div> )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Главный компонент страницы ---
export default function HomePage() {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Recipe[] | null>(MOCK_RECIPES);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async (formData: GeneratorFormData) => {
    setLoading(true);
    // Прежний setPreview(null) можно оставить или убрать, так как мы будем перенаправлять
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        setLoading(false);
        return;
      }

      // ★ Получаем ID плана из нового ответа API
      const { planId } = await response.json();
      
      if (planId) {
        // ★ И сразу перенаправляем пользователя на страницу нового плана
        window.location.href = `/plan/${planId}`;
      } else {
        throw new Error("Plan ID was not returned from the API.");
      }
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("An error occurred while generating the plan.");
      // В случае ошибки можно вернуть моковые рецепты для превью
      setPreview(MOCK_RECIPES); 
      setLoading(false);
    }
    // setLoading(false) в случае успеха не нужен, так как страница все равно перенаправится
  };

  return (
    <main className="relative text-neutral-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient" />
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 -z-10 size-[520px] rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-24 -z-10 size-[420px] rounded-full bg-accent/5 blur-3xl" />
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <StaggeredFadeIn>
            <motion.h1 variants={itemVariants} className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight"> Your personal <span className="text-accent">weight loss</span> meal plan — in 30 seconds </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 text-neutral-slate md:text-lg"> Describe your habits and goals, pick dietary limits — get a free 1‑day preview and a <span className="font-semibold text-neutral-ink">7‑day PDF</span> with shopping list and swaps. </motion.p>
            <motion.div variants={itemVariants} className="mt-6">
              <GeneratorPanel onGenerate={handleGenerate} loading={loading} onAuth={() => setAuthMode("signup")} />
            </motion.div>
          </StaggeredFadeIn>
          <div aria-labelledby="preview-title" ref={previewRef}>
            <h2 id="preview-title" className="sr-only">Plan preview</h2>
            <StaggeredFadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading && [...Array(4)].map((_, i) => (<motion.div variants={itemVariants} key={i}><SkeletonCard /></motion.div>))}
              {!loading && preview && preview.map((r) => (<motion.div variants={itemVariants} key={r.id}><AnimatedCard><RecipeCard r={r} /></AnimatedCard></motion.div>))}
            </StaggeredFadeIn>
          </div>
        </div>
      </section>
      <section id="how" className="mx-auto max-w-7xl px-4 pb-6 md:pb-10">
        <StaggeredFadeIn>
          <motion.div variants={itemVariants} className="rounded-3xl border border-neutral-lines bg-white p-6 md:p-8 shadow-soft">
            <h2 className="text-xl md:text-2xl font-headings font-semibold">How it works</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEP_ITEMS.map((s) => ( <motion.div variants={itemVariants} key={s.title}> <AnimatedCard className="h-full"> <div className="rounded-card border border-neutral-lines p-5 h-full flex flex-col"> <div className="flex items-center gap-3"> <div className="flex size-10 items-center justify-center rounded-lg bg-accent-mint/50 text-accent">{s.icon}</div> <div className="font-headings font-semibold">{s.title}</div> </div> <p className="mt-3 text-sm text-neutral-slate">{s.desc}</p> </div> </AnimatedCard> </motion.div> ))}
            </div>
          </motion.div>
        </StaggeredFadeIn>
      </section>
      <section id="topup" className="mx-auto max-w-7xl px-4 py-10">
        <StaggeredFadeIn>
          <motion.div variants={itemVariants} className="rounded-3xl border border-neutral-lines bg-white p-6 md:p-8 shadow-soft">
            <h2 className="text-xl md:text-2xl font-headings font-semibold">Top‑up tokens</h2>
            <p className="mt-1 text-sm text-neutral-slate">Choose a pack or enter a custom amount. Sign‑in required to complete top‑up.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {TOPUP_PLANS.map((p) => ( <motion.div variants={itemVariants} key={p.id}> <TopUpCard plan={p} onSelect={() => setAuthMode("signup")} isLoggedIn={isLoggedIn} /> </motion.div> ))}
            </div>
          </motion.div>
        </StaggeredFadeIn>
      </section>
      <section id="faq" className="mx-auto max-w-7xl px-4 py-12">
        <StaggeredFadeIn className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.h2 variants={itemVariants} className="text-xl md:text-2xl font-headings font-semibold col-span-full">FAQ</motion.h2>
          {FAQ.map((f) => (<FaqItem key={f.q} q={f.q} a={f.a} />))}
        </StaggeredFadeIn>
      </section>
      <section id="contact-home" className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <StaggeredFadeIn>
          <motion.div 
            variants={itemVariants} 
            className="rounded-3xl border border-neutral-lines bg-white p-6 md:p-8 shadow-soft max-w-3xl mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-headings font-semibold text-center">Get in Touch</h2>
            <p className="mt-2 text-sm text-neutral-slate text-center">
              Have questions or feedback? Fill out the form below.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </motion.div>
        </StaggeredFadeIn>
      </section>
      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </main>
  );
}