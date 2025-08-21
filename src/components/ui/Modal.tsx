// Содержимое для src/components/ui/Modal.tsx
'use client';

import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export function Modal({ open, onClose, children, title }: ModalProps) {
  // AnimatePresence от Framer Motion будет добавлена здесь позже
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-ink/30" onClick={onClose} />
      {/* Panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-card border border-neutral-lines bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-headings text-base font-semibold text-neutral-ink">{title}</h3>
            <button onClick={onClose} className="text-neutral-slate transition-colors hover:text-neutral-ink">✕</button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}