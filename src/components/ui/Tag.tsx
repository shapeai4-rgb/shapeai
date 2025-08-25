// Содержимое для нового файла: src/components/ui/Tag.tsx
import React from 'react';

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-neutral-mist px-2.5 py-1 text-xs text-neutral-slate">{children}</span>;
}