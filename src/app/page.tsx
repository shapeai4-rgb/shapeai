'use client';

import React, { useMemo, useRef, useState } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { RecipeCard } from "@/components/shared/RecipeCard";
import { PdfMini } from "@/components/shared/PdfMini";
import { AuthModal } from "@/components/shared/AuthModal";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

// --- Данные и Типы ---
import type { Recipe } from "@/types";
import { QUICK_CHIPS, STEP_ITEMS, FAQ, MOCK_RECIPES } from "@/lib/constants";

// --- Кастомный компонент для FAQ с плавной анимацией ---
function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div variants={itemVariants} className="rounded-card border border-neutral-lines bg-white p-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-headings font-semibold text-neutral-ink">{q}</span>
        <motion.span
          className="text-neutral-slate"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ⌄
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-neutral-slate">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Главный компонент страницы ---
export default function HomePage() {
  // --- Состояние (State) ---
  const [free, setFree] = useState("");
  const [active, setActive] = useState<string[]>(["lose", "3-4", "high-protein"]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Recipe[] | null>(MOCK_RECIPES);
  const [advanced, setAdvanced] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  // ★★★ НОВОЕ СОСТОЯНИЕ: Моделируем, залогинен ли пользователь ★★★
  // В будущем это будет браться из стейт-менеджера (Zustand)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleChip = (id: string) => {
    setActive((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]));
  };

  const handleGenerate = () => {
    // ★★★ НОВАЯ ЛОГИКА: Проверяем, авторизован ли пользователь ★★★
    if (!isLoggedIn) {
      setAuthMode("signup"); // Если нет - открываем модалку регистрации
      return;
    }

    // Если авторизован, запускаем генерацию (как и раньше)
    setLoading(true);
    setPreview(null);
    setTimeout(() => {
      setPreview(MOCK_RECIPES);
      setLoading(false);
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1100);
  };

  const chipHint = useMemo(() => {
    const map: Record<string, string> = {
      lose: "calorie deficit", "3-4": "3–4 meals", "high-protein": ">=1.6 g/kg protein",
      "gluten-free": "gluten‑free", vegetarian: "vegetarian", if168: "window 16:8", glp1: "GLP‑1 mode",
    };
    return active.map((id) => map[id]).filter(Boolean).join(" · ");
  }, [active]);

  return (
    <main className="relative text-neutral-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient" />
      
      <header className="sticky top-0 z-40 border-b border-neutral-lines bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-accent" aria-hidden />
            <span className="font-headings font-semibold tracking-tight">WeightLoss.AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-slate">
            <a href="#how" className="transition-colors hover:text-neutral-ink">How it works</a>
            <a href="#faq" className="transition-colors hover:text-neutral-ink">FAQ</a>
            <button onClick={() => setAuthMode("login")} className="transition-colors hover:text-neutral-ink">Log in</button>
            <Button onClick={() => setAuthMode("signup")} className="px-4 py-2 text-sm">Sign up</Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <StaggeredFadeIn>
            <motion.h1 variants={itemVariants} className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight">
              Your personal <span className="text-accent">weight loss</span> meal plan — in 30 seconds
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 text-neutral-slate md:text-lg">
              Describe your habits and goals, pick dietary limits — get a free 1‑day preview and a <span className="font-semibold text-neutral-ink">7‑day PDF</span> with shopping list and swaps.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-6 rounded-card border border-neutral-lines bg-white p-4 md:p-5 shadow-soft">
              <label htmlFor="free" className="text-sm font-medium text-neutral-slate">Free‑text brief</label>
              <textarea id="free" placeholder="Love Mediterranean food, cook ≤20 min, lactose‑free, budget €10/day…" value={free} onChange={(e) => setFree(e.target.value)} rows={3} className="mt-2 w-full resize-y rounded-xl border border-neutral-lines bg-white px-3 py-2 text-sm outline-none ring-accent/50 focus:ring-2" />
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_CHIPS.map((c) => (<Chip key={c.id} active={active.includes(c.id)} onClick={() => handleChip(c.id)}>{c.label}</Chip>))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-slate">
                <button type="button" onClick={() => setAdvanced((v) => !v)} className="hover:text-neutral-ink">{advanced ? "Hide advanced" : "+ More options"}</button>
                <div className="hidden md:block">{chipHint}</div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  onClick={handleGenerate}
                  className="w-full sm:w-auto"
                  locked={!isLoggedIn} // ★★★ Кнопка заблокирована, если пользователь НЕ залогинен
                >
                  {loading ? "Generating…" : "Generate preview plan"}
                </Button>
                <div className="text-xs text-neutral-slate">Sign-up needed to generate. Full week — in PDF.</div>
              </div>
            </motion.div>
          </StaggeredFadeIn>

          <div aria-labelledby="preview-title" ref={previewRef}>
            <h2 id="preview-title" className="sr-only">Plan preview</h2>
            <StaggeredFadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}><AnimatedCard><PdfMini /></AnimatedCard></motion.div>
              {loading && [...Array(3)].map((_, i) => (<motion.div variants={itemVariants} key={i}><SkeletonCard /></motion.div>))}
              {!loading && preview && preview.map((r) => (<motion.div variants={itemVariants} key={r.id}><AnimatedCard><RecipeCard r={r} /></AnimatedCard></motion.div>))}
              {!loading && preview && (
                <motion.div variants={itemVariants} className="col-span-full">
                  <div className="mt-2 rounded-xl border border-dashed border-neutral-lines p-4 text-sm text-neutral-slate">
                    Days 2–7 are available in the PDF.
                    {/* ★★★ ИЗМЕНЕНИЕ: Добавляем Link на страницу плана ★★★ */}
                    <Link href="/plan" className="ml-2 font-semibold text-accent hover:underline">Download 7‑day PDF</Link>
                  </div>
                </motion.div>
              )}
            </StaggeredFadeIn>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 pb-6 md:pb-10">
        <StaggeredFadeIn>
          <motion.div variants={itemVariants} className="rounded-3xl border border-neutral-lines bg-white p-6 md:p-8 shadow-soft">
            <h2 className="text-xl md:text-2xl font-headings font-semibold">How it works</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEP_ITEMS.map((s) => (
                <motion.div variants={itemVariants} key={s.title}>
                  <AnimatedCard className="h-full">
                    <div className="rounded-card border border-neutral-lines p-5 h-full flex flex-col">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-accent-mint/50 text-accent">{s.icon}</div>
                        <div className="font-headings font-semibold">{s.title}</div>
                      </div>
                      <p className="mt-3 text-sm text-neutral-slate">{s.desc}</p>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
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

      <footer className="border-t border-neutral-lines bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-slate flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} WeightLoss.AI</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-ink">Privacy</a>
            <a href="#" className="hover:text-neutral-ink">Contact</a>
          </div>
        </div>
      </footer>
      
      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} />
    </main>
  );
}