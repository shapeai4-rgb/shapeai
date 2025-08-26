// Содержимое для нового файла: src/components/shared/PlanCard.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types';
import { Tag } from '@/components/ui/Tag';
import { MacroBar } from '@/components/shared/MacroBar';
import { Button } from '@/components/ui/Button';

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function PlanCard({ p, onShop }: { p: Plan; onShop: (plan: Plan) => void }) {
  const statusColor = p.status === 'Active' ? 'text-status-success bg-status-success/10 border-status-success/20' : p.status === 'Draft' ? 'text-status-warning bg-status-warning/10 border-status-warning/20' : 'text-neutral-slate bg-neutral-mist border-neutral-lines';
  return (
    <article className="rounded-card border border-neutral-lines bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={cn('inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs', statusColor)}>
            <span className="size-1.5 rounded-full bg-current" /> {p.status}
          </div>
          <h3 className="mt-2 text-base font-headings font-semibold text-neutral-ink">{p.title}</h3>
          <p className="mt-1 text-sm text-neutral-slate">{p.days} days · {p.kcalTarget} kcal/day target · created {fmtDate(p.createdAt)}</p>
          <div className="mt-3 flex flex-wrap gap-2">{p.dietTags.map(t => <Tag key={t}>{t}</Tag>)}{p.glp1 && <Tag>GLP‑1</Tag>}</div>
        </div>
        <div className="hidden sm:block w-40">
          {p.macroTarget && <MacroBar macro={p.macroTarget} />}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/plan/${p.id}`} passHref>
          <Button className="px-3 py-2 text-sm">View online</Button>
        </Link>
        <a href={`/api/plan/${p.id}/pdf`} download>
            <Button as="span" className="px-3 py-2 text-sm bg-white text-neutral-ink border border-neutral-lines hover:bg-neutral-mist">Download PDF</Button>
        </a>
        <Button onClick={() => onShop(p)} className="px-3 py-2 text-sm bg-white text-neutral-ink border border-neutral-lines hover:bg-neutral-mist">Shopping list</Button>
      </div>
    </article>
  );
} 