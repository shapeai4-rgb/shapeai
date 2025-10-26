'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { AuthModal } from "@/components/shared/AuthModal";

// --- Типы и Данные ---
type Currency = 'EUR' | 'GBP' | 'USD';
type TopUpPlan = {
    id: string;
    name: string;
    priceEUR?: number;
    tokens?: number;
    bonus?: string;
    popular?: boolean;
    custom?: boolean;
};

const TOPUP_PLANS: TopUpPlan[] = [
    { id: "lite", name: "Lite", priceEUR: 9, tokens: 90 },
    { id: "standard", name: "Standard", priceEUR: 19, tokens: 210, bonus: "+10%", popular: true },
    { id: "pro", name: "Pro", priceEUR: 49, tokens: 600, bonus: "+20%" },
    { id: "custom", name: "Custom", custom: true },
];

// --- Вспомогательные функции ---
const FX_EUR_GBP = 0.85;
const FX_EUR_USD = 1.17;
function formatCurrency(cur: Currency, amount: number, opts: { trimCents?: boolean } = {}) {
    const symbol = cur === 'EUR' ? '€' : cur === 'GBP' ? '£' : '$';
    const value = opts.trimCents ? amount.toFixed(0) : amount.toFixed(2);
    return `${symbol}${value}`;
}
function convertEUR(amountEUR: number, to: Currency) {
    return to === 'EUR' ? amountEUR : to === 'GBP' ? amountEUR * FX_EUR_GBP : amountEUR * FX_EUR_USD;
}
function isValidAmount(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return /^\d+(?:[\.,]\d{1,2})?$/.test(trimmed);
}
function normalizeAmount(input: string) {
    return input.replace(',', '.');
}

// --- Компонент карточки ---
function TopUpCard({
                       plan,
                       onSelect,
                       isLoggedIn
                   }: {
    plan: TopUpPlan;
    onSelect: () => void;
    isLoggedIn: boolean;
}) {
    const [amount, setAmount] = useState<string>("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const currency = useAppStore((state) => state.currency);
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    const valid = plan.custom ? isValidAmount(amount) : true;
    const priceInSelected = plan.custom
        ? valid
            ? Number(normalizeAmount(amount))
            : null
        : plan.priceEUR != null
            ? convertEUR(plan.priceEUR, currency)
            : null;

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            onSelect();
            return;
        }

        if (plan.custom && !valid) {
            alert("Please enter a valid amount.");
            return;
        }

        setIsRedirecting(true);

        try {
            const selectedPlan = {
                id: plan.id,
                name: plan.name,
                price: priceInSelected,
                currency,
                tokens: plan.tokens,
                custom: plan.custom,
            };
            localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));

            const res = await fetch("/api/bizon/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "User Name",
                    email: "user@example.com",
                    amount: Number(priceInSelected!.toFixed(2)),
                    currency,
                    description: `Top-up for ${plan.name}`,
                }),
            });

            const data = await res.json();

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                console.error("Payment error:", data);
                alert("Payment failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment error: " + err);
        } finally {
            setIsRedirecting(false);
        }
    };


    return (
        <AnimatedCard>
            <article
                className={cn(
                    "relative rounded-card border p-5 shadow-soft h-full",
                    plan.popular ? "border-accent bg-accent/10" : "border-neutral-lines bg-white"
                )}
            >
                {plan.popular && (
                    <div className="absolute -top-2 right-4 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                        Most popular
                    </div>
                )}
                <div className="flex items-baseline justify-between">
                    <h3 className="font-headings text-base font-semibold">{plan.name}</h3>
                    {plan.bonus && <span className="text-xs text-accent">{plan.bonus}</span>}
                </div>

                {plan.custom ? (
                    <div className="mt-2">
                        <label className="text-xs text-neutral-slate">Amount ({symbol})</label>
                        <input
                            inputMode="decimal"
                            placeholder={symbol + " 12.50"}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-neutral-lines px-3 py-2 text-sm outline-none ring-accent/50 focus:ring-2"
                        />
                        <p
                            className={cn(
                                "mt-1 text-xs",
                                valid ? "text-neutral-slate/80" : "text-status-danger"
                            )}
                        >
                            {valid
                                ? "Up to 2 decimals (dot or comma)."
                                : "Please enter a valid amount."}
                        </p>
                    </div>
                ) : (
                    <div className="mt-2 text-2xl font-headings font-semibold">
                        {formatCurrency(currency, priceInSelected ?? 0)}
                    </div>
                )}

                {plan.tokens && (
                    <div className="mt-1 text-xs text-neutral-slate">
                        ≈ {plan.tokens.toLocaleString()} tokens
                    </div>
                )}
                <div className="mt-4 text-xs text-neutral-slate">
                    {isLoggedIn ? "Proceed to checkout" : "Sign in to top-up"}
                </div>
                <Button
                    onClick={handleCheckout}
                    locked={plan.custom && !valid}
                    disabled={isRedirecting}
                    className="w-full mt-2 text-sm py-2"
                >
                    {isRedirecting
                        ? "Redirecting..."
                        : isLoggedIn
                            ? plan.custom
                                ? "Continue to checkout"
                                : `Buy ${plan.tokens} tokens`
                            : "Sign up to continue"}
                </Button>
            </article>
        </AnimatedCard>
    );
}

// --- Главный компонент ---
export default function TopUpPage() {
    const { status } = useSession();
    const isLoggedIn = status === "authenticated";
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

    return (
        <>
            <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <StaggeredFadeIn>
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight">
                            Top-up tokens
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-neutral-slate md:text-lg">
                            Choose a pack or enter a custom amount. Then proceed to checkout to complete your payment securely.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
                    >
                        {TOPUP_PLANS.map((p) => (
                            <TopUpCard
                                key={p.id}
                                plan={p}
                                onSelect={() => setAuthMode("signup")}
                                isLoggedIn={isLoggedIn}
                            />
                        ))}
                    </motion.div>
                </StaggeredFadeIn>
            </main>

            <AuthModal
                open={authMode !== null}
                mode={authMode || "signup"}
                onClose={() => setAuthMode(null)}
                onModeChange={setAuthMode}
            />
        </>
    );
}
