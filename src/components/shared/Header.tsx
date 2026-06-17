"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { AuthModal } from "@/components/shared/AuthModal";
import { Drawer } from "@/components/ui/Drawer";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useI18n } from "@/i18n/client";
import type { Currency } from "@/types";

function TokenDisplay({ balance }: { balance: number }) {
  const { messages } = useI18n();

  return (
    <div className="hidden items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-neutral-ink lg:flex">
      <span className="font-semibold">{messages.header.tokens}</span>
      <span className="rounded-md bg-white px-1.5 py-0.5 font-bold">{balance}</span>
      <Link href="/top-up" passHref>
        <Button className="ml-1 h-auto rounded-full px-2 py-0.5 text-xs">
          {messages.header.getTokens}
        </Button>
      </Link>
    </div>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useAppStore();

  return (
    <div className="inline-flex rounded-full bg-neutral-lines/50 p-1">
      {(["EUR", "GBP", "USD"] as Currency[]).map((cur) => (
        <button
          key={cur}
          onClick={() => setCurrency(cur)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            currency === cur ? "bg-white font-semibold text-neutral-ink shadow" : "hover:text-neutral-ink"
          )}
        >
          {cur === "EUR" ? "EUR" : cur === "GBP" ? "GBP" : "USD"}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { data: session, status } = useSession();
  const { messages } = useI18n();
  const isLoggedIn = status === "authenticated";
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-lines bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.webp" alt="ShapeAI Logo" width={32} height={32} />
            <span className="font-headings font-semibold tracking-tight">ShapeAI.co.uk</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-neutral-slate md:flex">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="font-semibold transition-colors hover:text-neutral-ink">
                  {messages.header.dashboard}
                </Link>
                <Link href="/" className="transition-colors hover:text-neutral-ink">
                  {messages.header.generatePlan}
                </Link>
                <Link href="/top-up" className="transition-colors hover:text-neutral-ink">
                  {messages.header.topUp}
                </Link>
                <TokenDisplay balance={session?.user?.tokenBalance ?? 0} />
                <CurrencySwitcher />
                <LanguageSwitcher />
                <button onClick={() => signOut({ callbackUrl: "/" })} className="transition-colors hover:text-neutral-ink">
                  {messages.header.logout}
                </button>
                {session.user?.image ? (
                  <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="size-8 rounded-full bg-neutral-lines" />
                )}
              </>
            ) : (
              <>
                <Link href="/#how" className="transition-colors hover:text-neutral-ink">
                  {messages.header.howItWorks}
                </Link>
                <Link href="/#topup" className="transition-colors hover:text-neutral-ink">
                  {messages.header.pricing}
                </Link>
                <Link href="/#faq" className="transition-colors hover:text-neutral-ink">
                  {messages.common.faq}
                </Link>
                <CurrencySwitcher />
                <LanguageSwitcher />
                <button onClick={() => setAuthMode("login")} className="transition-colors hover:text-neutral-ink">
                  {messages.header.login}
                </button>
                <Button onClick={() => setAuthMode("signup")} className="px-4 py-2 text-sm">
                  {messages.header.signup}
                </Button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2" aria-label={messages.header.menu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} title={messages.header.menu}>
        <nav className="flex flex-col gap-4 p-4 text-lg">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>{messages.header.dashboard}</Link>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>{messages.header.generatePlan}</Link>
              <Link href="/top-up" onClick={() => setIsMenuOpen(false)}>{messages.header.topUp}</Link>
              <hr />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-slate">{messages.header.currency}</span>
                <CurrencySwitcher />
              </div>
              <LanguageSwitcher compact />
              <hr />
              <button onClick={() => { signOut({ callbackUrl: "/" }); setIsMenuOpen(false); }}>{messages.header.logout}</button>
            </>
          ) : (
            <>
              <Link href="/#how" onClick={() => setIsMenuOpen(false)}>{messages.header.howItWorks}</Link>
              <Link href="/#topup" onClick={() => setIsMenuOpen(false)}>{messages.header.pricing}</Link>
              <Link href="/#faq" onClick={() => setIsMenuOpen(false)}>{messages.common.faq}</Link>
              <hr />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-slate">{messages.header.currency}</span>
                <CurrencySwitcher />
              </div>
              <LanguageSwitcher compact />
              <hr />
              <Button onClick={() => { setAuthMode("login"); setIsMenuOpen(false); }}>{messages.header.login}</Button>
              <Button onClick={() => { setAuthMode("signup"); setIsMenuOpen(false); }} className="bg-neutral-mist text-neutral-ink hover:bg-neutral-lines">
                {messages.header.signup}
              </Button>
            </>
          )}
        </nav>
      </Drawer>

      <AuthModal open={authMode !== null} mode={authMode || "signup"} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </>
  );
}
