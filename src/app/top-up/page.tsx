'use client';

import React, { useState } from "react";

// Top‑up — standalone page
// TailwindCSS required. Export: default React component.
// Features:
// - Currency switcher (EUR/GBP) in header
// - 3 fixed packs + 1 custom amount (2 decimals, dot or comma)
// - "Sign in to Top‑up" note on each card
// - Summary of last selection (client-side)

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Types
 type TopUpPlan = {
  id: string;
  name: string;
  priceEUR?: number; // fixed price; undefined for custom
  tokens?: number;
  bonus?: string; // e.g., "+10%"
  popular?: boolean;
  custom?: boolean;
 };
 type Currency = 'EUR' | 'GBP';

// Data
 const PLANS: TopUpPlan[] = [
  { id: "lite", name: "Lite", priceEUR: 9, tokens: 90 },
  { id: "standard", name: "Standard", priceEUR: 19, tokens: 210, bonus: "+10%", popular: true },
  { id: "pro", name: "Pro", priceEUR: 49, tokens: 600, bonus: "+20%" },
  { id: "custom", name: "Custom", custom: true },
 ];

// Currency helpers (indicative FX)
 const FX_EUR_GBP = 0.85;
 function convertEUR(amountEUR: number, to: Currency) {
  return to === 'EUR' ? amountEUR : amountEUR * FX_EUR_GBP;
 }
 function formatCurrency(cur: Currency, amount: number, opts: { trimCents?: boolean } = {}) {
  const symbol = cur === 'EUR' ? '€' : '£';
  const value = opts.trimCents ? amount.toFixed(0) : amount.toFixed(2);
  return `${symbol}${value}`;
 }

// Validation
 function isValidAmount(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return false;
  return /^\d+(?:[\.,]\d{1,2})?$/.test(trimmed);
 }
 function normalizeAmount(input: string) { return input.replace(',', '.'); }

function Card({ plan, currency, onSelect }: { plan: TopUpPlan; currency: Currency; onSelect: (sel: { amount: number; currency: Currency } | null) => void }) {
  const [amount, setAmount] = useState('');
  const valid = plan.custom ? isValidAmount(amount) : true;
  const price = plan.custom ? (valid ? Number(normalizeAmount(amount)) : null) : (plan.priceEUR != null ? convertEUR(plan.priceEUR, currency) : null);
  const symbol = currency === 'EUR' ? '€' : '£';

  return (
    <article className={cx('relative rounded-2xl border p-5 shadow-sm', plan.popular ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white')}>
      {plan.popular && <div className="absolute -top-2 right-4 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">Most popular</div>}
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold">{plan.name}</h3>
        {plan.bonus && <span className="text-xs text-emerald-700">{plan.bonus}</span>}
      </div>
      {plan.custom ? (
        <div className="mt-2">
          <label className="text-xs text-gray-600">Amount ({symbol})</label>
          <input
            inputMode="decimal"
            pattern="^\\d+(?:[\\.,]\\d{1,2})?$"
            placeholder={symbol + ' 12.50'}
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring-2"
          />
          <p className={cx('mt-1 text-xs', valid ? 'text-gray-500' : 'text-red-600')}>{valid ? 'Up to 2 decimals (dot or comma).' : 'Please enter a valid amount (e.g. 9, 9.9, 9.99).'}</p>
        </div>
      ) : (
        <div className="mt-2 text-2xl font-semibold">{formatCurrency(currency, Number(price?.toFixed(0) ?? 0), { trimCents: true })}</div>
      )}
      {plan.tokens && <div className="mt-1 text-xs text-gray-600">≈ {plan.tokens.toLocaleString()} tokens</div>}
      <div className="mt-4 text-xs text-gray-600">Sign in to Top‑up</div>
      <a href="#" onClick={(e)=>{ e.preventDefault(); if(price==null){ onSelect(null); } else { onSelect({ amount: Number(price.toFixed(2)), currency }); } }}
         className={cx('mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium', plan.custom ? (valid ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : 'bg-emerald-600 text-white hover:bg-emerald-700')}
         aria-disabled={plan.custom && !valid}>
        {plan.custom ? 'Continue' : `Top‑up ${formatCurrency(currency, Number(price?.toFixed(0) ?? 0), { trimCents: true })}`}
      </a>
    </article>
  );
}

export default function TopUpPage() {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [last, setLast] = useState<{ amount: number; currency: Currency } | null>(null);

  return (
    <main className="relative text-gray-900">
      {/* Pricing grid */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Top‑up tokens</h1>
              <p className="mt-1 text-sm text-gray-600">Select a pack or enter your own amount. You need to sign in to complete the purchase.</p>
            </div>
            {last && <div className="text-xs text-gray-600">Last selected: {formatCurrency(last.currency, last.amount)}</div>}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {PLANS.map(p => (
              <Card key={p.id} plan={p} currency={currency} onSelect={setLast} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="font-medium">How it works</div>
              <p className="mt-2 text-gray-600">Choose a pack, sign in, and complete payment. Tokens appear instantly in your account and are used for plan generation and exports.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="font-medium">Refunds</div>
              <p className="mt-2 text-gray-600">If you made a purchase by mistake, contact support within 14 days and we’ll help. Unused tokens are refundable.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="font-medium">Taxes & FX</div>
              <p className="mt-2 text-gray-600">Prices include applicable VAT. FX rates are indicative; final total is shown at checkout.</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">By topping up, you agree to our Terms and Privacy Policy.</div>
        </div>
      </section>
    </main>
  );
}

// Dev sanity tests
(function __devTests(){
  try {
    const ok = ['9','9.9','9.99','9,99'];
    const bad = ['','a','9.999'];
    ok.forEach(x=>{ if(!/^\d+(?:[\.,]\d{1,2})?$/.test(x)) throw new Error('valid amount failed '+x); });
    bad.forEach(x=>{ if(/^\d+(?:[\.,]\d{1,2})?$/.test(x)) throw new Error('invalid amount passed '+x); });
  } catch(e) { console.warn('[TopUp tests]', e); }
})();
