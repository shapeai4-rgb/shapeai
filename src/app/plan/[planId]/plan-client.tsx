'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { type MealPlanData } from '@/types/pdf'; // Импортируем наш главный тип

// --- Компоненты ---
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { StaggeredFadeIn, itemVariants } from '@/components/ui/StaggeredFadeIn';
import { motion } from 'framer-motion';

// ★★★ Компонент теперь принимает реальные данные плана ★★★
export default function PlanClient({ planId, plan }: { planId: string, plan: MealPlanData }) {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  // Получаем данные для первого дня для отображения
  const firstDay = plan.days[0];
  if (!firstDay) {
    return <div>Error: Plan data is incomplete.</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <StaggeredFadeIn>
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-headings font-semibold">
              {plan.title} - Day {firstDay.day}
            </h1>
            <p className="text-sm text-neutral-slate mt-1">Below is a preview for the first day of your plan.</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines">Return to Dashboard</Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-neutral-lines bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="relative grid size-20 place-items-center">
              <div className="absolute inset-0 rounded-full bg-neutral-lines" />
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#059669 ${Math.round((firstDay.summary.kcal / plan.targets.daily_kcal) * 360)}deg, transparent 0deg)` }} />
              <div className="absolute inset-2 rounded-full bg-white" />
              <div className="relative text-center">
                <div className="text-xl font-bold leading-none">{firstDay.summary.kcal}</div>
                <div className="text-xs text-neutral-slate">/ {plan.targets.daily_kcal} kcal</div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-headings font-semibold">{firstDay.summary.kcal} kcal total</h2>
              <p className="text-xs text-neutral-slate">Target: {plan.targets.daily_kcal} kcal</p>
              <div className="mt-2 text-xs">
                P: {firstDay.summary.protein_g}g · F: {firstDay.summary.fat_g}g · C: {firstDay.summary.carbs_g}g
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {firstDay.meals.map(meal => {
            const recipe = plan.recipes[meal.recipe_id];
            if (!recipe) return null;
            return (
              <div key={meal.recipe_id}>
                <h3 className="text-sm font-semibold mb-2">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</h3>
                {/* Здесь можно использовать RecipeCard, если адаптировать его пропсы, или просто отобразить данные */}
                <div className="rounded-card border border-neutral-lines bg-white p-4">
                  <p className="font-semibold">{recipe.title}</p>
                  <p className="text-sm text-neutral-slate">{recipe.portion} · {meal.kcal} kcal</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          <a href={`/api/plan/${planId}/pdf`} download>
            <Button as="span" className="px-6 py-3 text-base">Download 7-day PDF</Button>
          </a>
          <Button onClick={() => setShoppingListOpen(true)} className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines px-6 py-3 text-base">Open shopping list</Button>
          <span className="text-sm text-neutral-slate">QR in the PDF links to your live plan.</span>
        </motion.div>
      </StaggeredFadeIn>

      <Drawer open={shoppingListOpen} onClose={() => setShoppingListOpen(false)} title="Shopping List">
        <p>Your aggregated shopping list will appear here.</p>
      </Drawer>
    </main>
  );
}