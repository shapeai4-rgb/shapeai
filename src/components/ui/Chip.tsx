'use client';

import { cn } from "@/lib/utils"; // ★★★ 1. Импортируем 'cn' вместо 'cx'
import React from 'react';

type ChipProps = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      // ★★★ 2. Используем 'cn' вместо 'cx'
      className={cn(
        "px-3 h-9 inline-flex items-center rounded-full border text-sm transition-colors",
        // Используем синтаксис, который 'cn' отлично понимает
        {
          "bg-accent text-white border-accent shadow-soft": active,
          "bg-white/80 border-neutral-lines hover:border-accent": !active
        }
      )}
      aria-pressed={Boolean(active)}
    >
      {children}
    </button>
  );
}