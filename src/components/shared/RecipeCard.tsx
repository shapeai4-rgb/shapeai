// Содержимое для src/components/shared/RecipeCard.tsx

import type { Recipe } from "@/types";
import { MacroBar } from "@/components/shared/MacroBar";
import Image from "next/image";

type RecipeCardProps = {
  r: Recipe;
};

export function RecipeCard({ r }: RecipeCardProps) {
  return (
    <article className="rounded-card border border-neutral-lines bg-white p-4 shadow-soft">
      <div className="relative overflow-hidden rounded-xl">
        {/* Улучшаем доступность, как и планировали в дорожной карте */}
        <Image 
          src={r.image ?? "/placeholder.png"} 
          alt={r.title}
          width={400} 
          height={144} 
          className="h-36 w-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      {/* Применяем наши кастомные шрифты и цвета */}
      <h3 className="mt-3 font-headings text-base font-semibold text-neutral-ink">{r.title}</h3>
      <p className="mt-1 text-sm text-neutral-slate">{r.portion} · {r.time} · {r.kcal} kcal</p>
      <div className="mt-3">
        <MacroBar macro={r.macro} />
      </div>
      {r.tags && (
        <div className="mt-3 flex flex-wrap gap-2">
          {r.tags.map((t) => (
            <span key={t} className="rounded-full bg-neutral-mist px-2.5 py-1 text-xs text-neutral-slate">{t}</span>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <button className="text-sm font-semibold text-accent transition-opacity hover:opacity-80">Swap meal</button>
        <button className="text-sm text-neutral-slate transition-colors hover:text-neutral-ink">Portion ±10–20%</button>
      </div>
    </article>
  );
}