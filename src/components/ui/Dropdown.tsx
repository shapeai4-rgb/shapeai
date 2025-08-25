// Содержимое для нового файла: src/components/ui/Dropdown.tsx
'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full min-w-40 justify-between border border-neutral-lines bg-white text-sm text-neutral-ink shadow-sm hover:bg-neutral-mist"
      >
        <span>{label}: <span className="font-semibold">{value}</span></span>
        <svg className="ml-2 size-4 text-neutral-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6"/></svg>
      </Button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-neutral-lines bg-white shadow-lg">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className={cn("w-full px-3 py-2 text-left text-sm hover:bg-neutral-mist", value === opt && "bg-neutral-mist font-semibold")}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}