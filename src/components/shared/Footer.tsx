// Содержимое для src/components/shared/Footer.tsx
import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-lines bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-slate flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} WeightLoss.AI</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-neutral-ink">Privacy</a>
          <a href="#" className="hover:text-neutral-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}