// Содержимое для src/components/shared/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AuthModal } from './AuthModal';
import type { Currency } from '@/types';

// Маленький компонент для отображения токенов, используется только здесь
function TokenDisplay({ balance }: { balance: number }) {
  // ★★★ Убираем MOCK_TOKENS. Теперь используем пропс 'balance'
  return (
    <div className="hidden lg:flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-neutral-ink">
      <span className="font-semibold">Tokens</span>
      <span className="rounded-md bg-white px-1.5 py-0.5 font-bold">{balance}</span>
      {/* ★★★ Временно убираем отображение использованных токенов, т.к. этих данных пока нет в сессии */}
      {/* <span className="text-neutral-slate">{used}/{total}</span> */}
      <Link href="/top-up" passHref>
        <Button className="ml-1 rounded-full px-2 py-0.5 text-xs h-auto">Get</Button>
      </Link>
    </div>
  );
}

export function Header() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { currency, setCurrency } = useAppStore();
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-lines bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-accent" aria-hidden />
            <span className="font-headings font-semibold tracking-tight">WeightLoss.AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-slate">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="transition-colors hover:text-neutral-ink font-semibold">Dashboard</Link>
                <Link href="/" className="transition-colors hover:text-neutral-ink">Generate Plan</Link>
                <Link href="/top-up" className="transition-colors hover:text-neutral-ink">Top-up</Link>
                <TokenDisplay balance={session?.user?.tokenBalance ?? 0} />
                <button onClick={() => signOut({ callbackUrl: '/' })} className="transition-colors hover:text-neutral-ink">Log out</button>
                <div className="size-8 rounded-full bg-neutral-lines" /> 
              </>
            ) : (
              // ★★★ Навигация для ГОСТЯ
              <>
                <a href="/#how" className="transition-colors hover:text-neutral-ink">How it works</a>
                <a href="/#topup" className="transition-colors hover:text-neutral-ink">Pricing</a>
                <a href="/#faq" className="transition-colors hover:text-neutral-ink">FAQ</a>
                <div className="inline-flex rounded-full bg-neutral-lines/50 p-1">
                  {(['EUR','GBP'] as Currency[]).map(cur => (
                    <button key={cur} onClick={()=>setCurrency(cur)} className={cn("rounded-full px-2.5 py-1 text-xs", currency===cur ? "bg-white shadow font-semibold text-neutral-ink" : "hover:text-neutral-ink")}>
                      {cur==='EUR' ? '€ EUR' : '£ GBP'}
                    </button>
                  ))}
                </div>
                <button onClick={() => setAuthMode("login")} className="transition-colors hover:text-neutral-ink">Log in</button>
                <Button onClick={() => setAuthMode("signup")} className="px-4 py-2 text-sm">Sign up</Button>
              </>
            )}
          </nav>
        </div>
      </header>
      {/* Модальное окно теперь является частью хедера, так как именно он им управляет */}
      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} />
    </>
  );
}