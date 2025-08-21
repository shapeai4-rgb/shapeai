// Содержимое для src/components/ui/Drawer.tsx
'use client';

import React from 'react';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export function Drawer({ open, onClose, children, title }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-ink/30" onClick={onClose} />
      {/* Panel */}
      <div className="absolute inset-0 flex justify-end">
        <div className="mt-auto h-[75vh] w-full rounded-t-card border-l border-t border-neutral-lines bg-white shadow-soft md:mt-0 md:h-full md:w-[420px] md:rounded-l-card md:rounded-t-none">
          <div className="flex items-center justify-between border-b border-neutral-lines px-4 py-3">
            <h3 className="font-headings text-base font-semibold text-neutral-ink">{title}</h3>
            <button onClick={onClose} className="text-neutral-slate transition-colors hover:text-neutral-ink">✕</button>
          </div>
          <div className="h-[calc(100%-53px)] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}