'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // ★ Убедимся, что Link импортирован
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

// --- Компоненты ---
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { MacroBar } from '@/components/shared/MacroBar';
import { StaggeredFadeIn, itemVariants } from '@/components/ui/StaggeredFadeIn';

// --- Моковые данные (в будущем будут приходить из API) ---
import { MOCK_RECIPES } from '@/lib/constants';

// --- Главный компонент страницы Плана ---
export default function PlanPage({ params }: { params: { planId: string } }) {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  // В будущем мы будем делать запрос к API, чтобы получить детали плана по planId
  // const { data: plan, isLoading } = usePlanData(params.planId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <StaggeredFadeIn>
        {/* ★★★ 1. ЗАГОЛОВОК С НОВОЙ КНОПКОЙ "НАЗАД" ★★★ */}
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-headings font-semibold">Plan — Day 1</h1>
            <p className="text-sm text-neutral-slate mt-1">Below is a preview for the first day of your plan.</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines">Return to Dashboard</Button>
          </Link>
        </motion.div>

        {/* --- Карточка с итогами дня --- */}
        <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-neutral-lines bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="relative grid size-20 place-items-center">
              <div className="absolute inset-0 rounded-full bg-neutral-lines" />
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#059669 93deg, transparent 93deg)` }} />
              <div className="absolute inset-2 rounded-full bg-white" />
              <div className="relative text-center">
                <div className="text-xl font-bold leading-none">1450</div>
                <div className="text-xs text-neutral-slate">/ 1500 kcal</div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-headings font-semibold">1450 kcal total</h2>
              <p className="text-xs text-neutral-slate">Target: 1500 kcal · <span className="text-accent hover:underline cursor-pointer">How we calculated</span></p>
              <div className="mt-2 text-xs">P: 126g · F: 42g · C: 138g</div>
            </div>
          </div>
        </motion.div>

        {/* --- Список приемов пищи --- */}
        <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_RECIPES.slice(0, 4).map(recipe => (
            <RecipeCard key={recipe.id} r={recipe} />
          ))}
        </motion.div>

        {/* --- Кнопки действий --- */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          {/* ★★★ 2. КНОПКА СКАЧИВАНИЯ PDF ТЕПЕРЬ РАБОТАЕТ ★★★ */}
          <a href={`/api/plan/${params.planId}/pdf`} download>
            <Button as="span" className="px-6 py-3 text-base">Download 7-day PDF</Button>
          </a>
          <Button onClick={() => setShoppingListOpen(true)} className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines px-6 py-3 text-base">Open shopping list</Button>
          <span className="text-sm text-neutral-slate">QR in the PDF links to your live plan.</span>
        </motion.div>
      </StaggeredFadeIn>

      {/* --- Drawer для списка покупок --- */}
      <Drawer open={shoppingListOpen} onClose={() => setShoppingListOpen(false)} title="Shopping List">
        <p>Your aggregated shopping list will appear here.</p>
      </Drawer>
    </main>
  );
}