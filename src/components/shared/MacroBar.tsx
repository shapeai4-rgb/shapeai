"use client";

import type { Macro } from "@/types";
import { useI18n } from "@/i18n/client";

type MacroBarProps = {
  macro: Macro;
};

export function MacroBar({ macro }: MacroBarProps) {
  const { messages } = useI18n();
  // Рассчитываем проценты для полосок
  const total = Math.max(1, macro.protein + macro.fat + macro.carbs);
  const p = (macro.protein / total) * 100;
  const f = (macro.fat / total) * 100;
  const c = (macro.carbs / total) * 100;

  return (
    <div className="w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-emerald-600" style={{ width: `${p}%` }} />
        <div className="h-full bg-emerald-300" style={{ width: `${f}%` }} />
        <div className="h-full bg-emerald-100" style={{ width: `${c}%` }} />
      </div>
      <div className="mt-2 text-xs text-gray-600 flex gap-3">
        <span>{messages.common.protein}: {macro.protein}g</span>
        <span>{messages.common.fat}: {macro.fat}g</span>
        <span>{messages.common.carbs}: {macro.carbs}g</span>
      </div>
    </div>
  );
}
