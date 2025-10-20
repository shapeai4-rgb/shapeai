'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AuthModal } from './AuthModal';
import { Drawer } from '@/components/ui/Drawer';
import type { Currency } from '@/types';

function TokenDisplay({ balance }: { balance: number }) {
  // ★★★ ИСПРАВЛЕНО: Добавлено 'return' ★★★
  return (
    <div className="hidden lg:flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-neutral-ink">
      <span className="font-semibold">Tokens</span>
      <span className="rounded-md bg-white px-1.5 py-0.5 font-bold">{balance}</span>
      <Link href="/top-up" passHref>
        <Button className="ml-1 rounded-full px-2 py-0.5 text-xs h-auto">Get</Button>
      </Link>
    </div>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useAppStore();
  return (
    <div className="inline-flex rounded-full bg-neutral-lines/50 p-1">
      {(['EUR','GBP','USD'] as Currency[]).map(cur => (
        <button key={cur} onClick={()=>setCurrency(cur)} className={cn("rounded-full px-2.5 py-1 text-xs", currency===cur ? "bg-white shadow font-semibold text-neutral-ink" : "hover:text-neutral-ink")}>
          {cur==='EUR' ? '€ EUR' : cur==='GBP' ? '£ GBP' : '$ USD'}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-lines bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.webp" alt="ShapeAI Logo" width={32} height={32} />
            <span className="font-headings font-semibold tracking-tight">ShapeAI.co.uk</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-slate">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="transition-colors hover:text-neutral-ink font-semibold">Dashboard</Link>
                <Link href="/" className="transition-colors hover:text-neutral-ink">Generate Plan</Link>
                <Link href="/top-up" className="transition-colors hover:text-neutral-ink">Top-up</Link>
                <TokenDisplay balance={session?.user?.tokenBalance ?? 0} />
                <CurrencySwitcher />
                <button onClick={() => signOut({ callbackUrl: '/' })} className="transition-colors hover:text-neutral-ink">Log out</button>
                {session.user?.image ? ( <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" /> ) : ( <div className="size-8 rounded-full bg-neutral-lines" /> )}
              </>
            ) : (
              <>
                <Link href="/#how" className="transition-colors hover:text-neutral-ink">How it works</Link>
                <Link href="/#topup" className="transition-colors hover:text-neutral-ink">Pricing</Link>
                <Link href="/#faq" className="transition-colors hover:text-neutral-ink">FAQ</Link>
                <CurrencySwitcher />
                <button onClick={() => setAuthMode("login")} className="transition-colors hover:text-neutral-ink">Log in</button>
                <Button onClick={() => setAuthMode("signup")} className="px-4 py-2 text-sm">Sign up</Button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>
      
      <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu">
        <nav className="flex flex-col gap-4 p-4 text-lg">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Generate Plan</Link>
              <Link href="/top-up" onClick={() => setIsMenuOpen(false)}>Top-up</Link>
              <hr />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-slate">Currency</span>
                <CurrencySwitcher />
              </div>
              <hr />
              <button onClick={() => { signOut({ callbackUrl: '/' }); setIsMenuOpen(false); }}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/#how" onClick={() => setIsMenuOpen(false)}>How it works</Link>
              <Link href="/#topup" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link href="/#faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              <hr />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-slate">Currency</span>
                <CurrencySwitcher />
              </div>
              <hr />
              <Button onClick={() => { setAuthMode("login"); setIsMenuOpen(false); }}>Log in</Button>
              {/* ★★★ ИСПРАВЛЕНО: 'variant' заменен на 'className' ★★★ */}
              <Button onClick={() => { setAuthMode("signup"); setIsMenuOpen(false); }} className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines">Sign up</Button>
            </>
          )}
        </nav>
      </Drawer>

      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </>
  );
}