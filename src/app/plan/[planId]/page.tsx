'use client';

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// --- Компоненты ---
import { MacroBar } from "@/components/shared/MacroBar";
import { Ring } from "@/components/shared/Ring";
import { AuthModal } from "@/components/shared/AuthModal";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { useSession } from "next-auth/react";

// --- Данные, Типы и Утилиты ---
import type { Meal } from "@/types";
import { START_MEALS, SWAP_CATALOG } from "@/lib/constants";
import { totals, buildShoppingList } from "@/lib/utils";

// --- Главный компонент страницы ---
export default function DayPreviewPage() {
    const [meals, setMeals] = useState<Meal[]>(START_MEALS);
    const [targetKcal] = useState(1500);
    const [economy, setEconomy] = useState(false);
    const [calcOpen, setCalcOpen] = useState(false);
    const [swapOpenFor, setSwapOpenFor] = useState<Meal | null>(null);
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
    const [shopOpen, setShopOpen] = useState(false);

    const t = useMemo(() => totals(meals), [meals]);
    const kcalDelta = t.kcal - targetKcal;
    const shopping = useMemo(() => buildShoppingList(meals), [meals]);
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated'; // ★★★ Наша новая, реальная переменная
    const handleDownload = () => {
      if (!isLoggedIn) {
        setAuthMode("signup");
        return;
      }
      // В будущем здесь будет логика скачивания PDF
      alert("Downloading PDF...");
    };

    function adjustPortion(id: string, delta: number) {
        setMeals((list) => list.map((m) => {
            if (m.id !== id) return m;
            const factor = 1 + delta;
            return {
                ...m,
                kcal: Math.round(m.kcal * factor),
                macro: {
                    protein: Math.round(m.macro.protein * factor),
                    fat: Math.round(m.macro.fat * factor),
                    carbs: Math.round(m.macro.carbs * factor),
                },
            };
        }));
    }

    function swapMeal(slot: Meal["slot"], alt: Meal) {
        setMeals((list) => list.map((m) => (m.slot === slot ? { ...alt, id: m.id } : m)));
        setSwapOpenFor(null);
    }

    // ЗАМЕНИ ВЕСЬ БЛОК RETURN НА ЭТОТ КОД

  return (
      <main className="bg-brand-gradient text-neutral-ink">
          <section className="mx-auto max-w-7xl px-4 py-10">
              <StaggeredFadeIn className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 items-start">
                  <motion.div variants={itemVariants}>
                      <div className="rounded-card border border-neutral-lines bg-white p-6 shadow-soft">
                          <div className="text-sm text-neutral-slate">Plan — Day 1</div>
                          <div className="mt-2 flex items-center gap-6">
                              <Ring value={t.kcal} target={targetKcal} />
                              <div>
                                  <div className="font-headings text-xl font-semibold">{t.kcal} kcal total</div>
                                  <div className="mt-1 text-sm text-neutral-slate">Target: {targetKcal} kcal · <button onClick={() => setCalcOpen(true)} className="font-semibold text-accent transition-opacity hover:opacity-80">How we calculated</button></div>
                                  <div className="mt-2"><MacroBar macro={t.macro} /></div>
                                  <div className="mt-2 text-xs text-neutral-slate">Delta vs target: <span className={kcalDelta > 0 ? "text-status-danger" : kcalDelta < 0 ? "text-status-warning" : "text-neutral-ink"}>{kcalDelta > 0 ? "+" : ""}{kcalDelta} kcal</span></div>
                              </div>
                          </div>
                      </div>
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div variants={itemVariants}>
                          <div className="rounded-card border border-neutral-lines bg-white p-4 shadow-soft flex items-center justify-between h-full">
                              <div>
                                  <div className="font-headings text-sm font-semibold">Economy mode</div>
                                  <div className="text-xs text-neutral-slate">Reduce ingredient variety</div>
                              </div>
                              <button onClick={() => setEconomy(!economy)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${economy ? "bg-accent" : "bg-neutral-lines"}`}>
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${economy ? "translate-x-6" : "translate-x-1"}`} />
                              </button>
                          </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                          <div className="rounded-card border border-neutral-lines bg-white p-4 shadow-soft flex items-center justify-between h-full">
                              <div>
                                  <div className="font-headings text-sm font-semibold">Meals per day</div>
                                  <div className="text-xs text-neutral-slate">Adjust portions to fit</div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <button className="rounded-lg border border-neutral-lines px-2 py-1 text-sm transition-colors hover:bg-neutral-mist">3</button>
                                  <button className="rounded-lg border border-neutral-lines px-2 py-1 text-sm transition-colors hover:bg-neutral-mist">4</button>
                                  <button className="rounded-lg border border-neutral-lines px-2 py-1 text-sm transition-colors hover:bg-neutral-mist">5</button>
                              </div>
                          </div>
                      </motion.div>
                  </div>
              </StaggeredFadeIn>
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-10">
              <StaggeredFadeIn className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meals.map((m) => (
                      <motion.div variants={itemVariants} key={m.id}>
                          <article className="rounded-card border border-neutral-lines bg-white p-5 shadow-soft h-full">
                              <div className="flex items-start justify-between gap-4">
                                  <div>
                                      <div className="text-xs uppercase tracking-wide text-neutral-slate">{m.slot}</div>
                                      <h3 className="font-headings text-base font-semibold text-neutral-ink">{m.title}</h3>
                                      <p className="mt-1 text-sm text-neutral-slate">{m.portion} · {m.time} · {m.kcal} kcal</p>
                                      <div className="mt-3"><MacroBar macro={m.macro} /></div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                      <button onClick={() => setSwapOpenFor(m)} className="text-sm font-semibold text-accent transition-opacity hover:opacity-80">Swap</button>
                                      <div className="flex gap-2">
                                          <button onClick={() => adjustPortion(m.id, -0.1)} className="rounded-lg border border-neutral-lines px-2 py-1 text-sm transition-colors hover:bg-neutral-mist">−10%</button>
                                          <button onClick={() => adjustPortion(m.id, +0.1)} className="rounded-lg border border-neutral-lines px-2 py-1 text-sm transition-colors hover:bg-neutral-mist">+10%</button>
                                      </div>
                                  </div>
                              </div>
                          </article>
                      </motion.div>
                  ))}
              </StaggeredFadeIn>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    onClick={handleDownload}
                    locked={!isLoggedIn} // ★★★ Кнопка заблокирована, если пользователь НЕ залогинен
                  >
                    Download 7‑day PDF
                  </Button>
                  <Button onClick={() => setShopOpen(true)} className="bg-white text-neutral-ink border border-neutral-lines hover:bg-neutral-mist">Open shopping list</Button>
                  <div className="text-xs text-neutral-slate">QR in the PDF links to your live plan.</div>
              </div>
          </section>

          {/* ★★★ ИСПРАВЛЕННЫЙ БЛОК С MODAL И DRAWER ★★★ */}
          <Modal open={calcOpen} onClose={() => setCalcOpen(false)} title="How we calculated (BMR/TDEE)">
              <div className="text-sm text-neutral-slate space-y-3">
                <p><span className="font-semibold text-neutral-ink">BMR</span> via Mifflin‑St Jeor. <span className="font-semibold text-neutral-ink">TDEE</span> = BMR × activity factor. Your daily target = TDEE − safe deficit (10–25%).</p>
                <div className="rounded-lg bg-neutral-mist p-3 text-xs">
                  Example: BMR 1650 × 1.4 = TDEE 2310 kcal. Deficit 20% → target ≈ 1850 kcal.
                </div>
                <p>You can fine‑tune activity and deficit later in Settings.</p>
              </div>
          </Modal>

          <Modal open={Boolean(swapOpenFor)} onClose={() => setSwapOpenFor(null)} title={`Swap ${swapOpenFor?.slot || "meal"}`}>
              <div className="grid grid-cols-1 gap-3">
                {(swapOpenFor ? SWAP_CATALOG[swapOpenFor.slot] : []).map((alt) => (
                  <button key={alt.id} onClick={() => swapMeal(alt.slot, alt)} className="rounded-xl border border-neutral-lines p-4 text-left transition-colors hover:border-accent">
                    <div className="font-headings text-sm font-semibold">{alt.title}</div>
                    <div className="mt-1 text-xs text-neutral-slate">{alt.portion} · {alt.time} · {alt.kcal} kcal</div>
                    <div className="mt-2"><MacroBar macro={alt.macro} /></div>
                  </button>
                ))}
              </div>
          </Modal>

          <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} />

          <Drawer open={shopOpen} onClose={() => setShopOpen(false)} title="Shopping list (Day 1)">
              <div className="text-xs text-neutral-slate">Grouped by category · Quantities are for the current day preview</div>
              <div className="mt-3 space-y-3">
                {Array.from(new Set(shopping.map(i => i.category))).map((cat) => (
                  <div key={cat}>
                    <div className="font-headings text-sm font-semibold text-neutral-ink">{cat}</div>
                    <ul className="mt-2 space-y-1">
                      {shopping.filter(i => i.category === cat).map((i) => (
                        <li key={`${i.name}-${i.unit}`} className="flex items-center justify-between rounded-lg border border-neutral-lines px-3 py-2">
                          <span className="text-sm text-neutral-ink">{i.name}</span>
                          <span className="text-sm text-neutral-slate">{i.qty} {i.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button className="text-sm px-4 py-2">Export CSV</Button>
                <Button onClick={() => setShopOpen(false)} className="bg-white text-neutral-ink border border-neutral-lines hover:bg-neutral-mist text-sm px-4 py-2">Close</Button>
              </div>
          </Drawer>
      </main>
  );
}