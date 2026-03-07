'use client';

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// --- Components ---
import { Button } from "@/components/ui/Button";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { AuthModal } from "@/components/shared/AuthModal";

// --- Types & Data ---
type Currency = "EUR" | "GBP" | "USD";

type PlanType = "lite" | "standard" | "pro" | "custom";

type TopUpPlan = {
    id: PlanType;
    name: string;
    priceEUR?: number;
    tokens?: number;
    bonus?: string;
    popular?: boolean;
    custom?: boolean;
};

type SelectedPlan = {
    type: PlanType;
    name: string;
    price: number; // real amount in selected currency
    currency: Currency;
};

const TOPUP_PLANS: TopUpPlan[] = [
    { id: "lite", name: "Lite", priceEUR: 9, tokens: 90 },
    { id: "standard", name: "Standard", priceEUR: 19, tokens: 210, bonus: "+10%", popular: true },
    { id: "pro", name: "Pro", priceEUR: 49, tokens: 600, bonus: "+20%" },
    { id: "custom", name: "Custom", custom: true },
];

// --- Helpers ---
const FX_EUR_GBP = 0.85;
const FX_EUR_USD = 1.17;

function formatCurrency(cur: Currency, amount: number, opts: { trimCents?: boolean } = {}) {
    const symbol = cur === "EUR" ? "€" : cur === "GBP" ? "£" : "$";
    const value = opts.trimCents ? amount.toFixed(0) : amount.toFixed(2);
    return `${symbol}${value}`;
}

function convertEUR(amountEUR: number, to: Currency) {
    return to === "EUR" ? amountEUR : to === "GBP" ? amountEUR * FX_EUR_GBP : amountEUR * FX_EUR_USD;
}

function isValidAmount(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return /^\d+(?:[\.,]\d{1,2})?$/.test(trimmed);
}

function normalizeAmount(input: string) {
    return input.replace(",", ".");
}

function clampTo2Decimals(n: number) {
    return Math.round(n * 100) / 100;
}

// --- Card ---
function TopUpCard({
                       plan,
                       onSelectAuth,
                       isLoggedIn,
                   }: {
    plan: TopUpPlan;
    onSelectAuth: () => void;
    isLoggedIn: boolean;
}) {
    const [amount, setAmount] = useState<string>("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const currency = useAppStore((state) => state.currency) as Currency;

    const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    const valid = plan.custom ? isValidAmount(amount) : true;

    const priceInSelected = useMemo(() => {
        if (plan.custom) {
            if (!valid) return null;
            const v = Number(normalizeAmount(amount));
            if (!Number.isFinite(v) || v <= 0) return null;
            return clampTo2Decimals(v);
        }
        if (plan.priceEUR == null) return null;
        return clampTo2Decimals(convertEUR(plan.priceEUR, currency));
    }, [plan.custom, plan.priceEUR, amount, valid, currency]);

    const approxTokens = useMemo(() => {
        // UI-only preview; final tokens are computed on the backend in /api/bizon/add-tokens
        if (!plan.custom) return plan.tokens ?? null;
        if (priceInSelected == null) return null;
        return Math.floor(priceInSelected * 10); // 1 unit = 10 tokens, no bonus for custom
    }, [plan.custom, plan.tokens, priceInSelected]);

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            onSelectAuth();
            return;
        }

        if (plan.custom && !valid) {
            alert("Please enter a valid amount.");
            return;
        }

        const amountNumber = Number(priceInSelected);
        if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
            alert("Invalid amount");
            return;
        }

        setIsRedirecting(true);

        try {
            // ✅ залишаємо — потрібно для success page
            const selectedPlan: SelectedPlan = {
                type: plan.id,
                name: plan.name,
                price: amountNumber,
                currency,
            };
            localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));

            const res = await fetch("/api/bizon/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amountNumber,
                    currency,
                }),
            });

            // ✅ ЧИТАЄМО JSON РІВНО 1 РАЗ
            const data = await res.json();

            if (!res.ok || !data?.redirectUrl) {
                console.error("Payment create-order failed:", data);
                alert("Payment failed: " + (data?.error || `HTTP ${res.status}`));
                return;
            }

            // ✅ ЄДИНИЙ редірект
            window.location.href = data.redirectUrl;
        } catch (err: any) {
            console.error("Payment error:", err);
            alert("Payment error: " + (err?.message || String(err)));
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
                            placeholder={`${symbol} 12.50`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-neutral-lines px-3 py-2 text-sm outline-none ring-accent/50 focus:ring-2"
                        />
                        <p className={cn("mt-1 text-xs", valid ? "text-neutral-slate/80" : "text-status-danger")}>
                            {valid ? "Up to 2 decimals (dot or comma)." : "Please enter a valid amount."}
                        </p>

                        <div className="mt-3 text-2xl font-headings font-semibold">
                            {priceInSelected != null ? formatCurrency(currency, priceInSelected) : `${symbol}0.00`}
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 text-2xl font-headings font-semibold">
                        {formatCurrency(currency, priceInSelected ?? 0)}
                    </div>
                )}

                {approxTokens != null && (
                    <div className="mt-1 text-xs text-neutral-slate">≈ {approxTokens.toLocaleString()} tokens</div>
                )}

                <div className="mt-4 text-xs text-neutral-slate">
                    {isLoggedIn ? "Proceed to checkout" : "Sign in to top-up"}
                </div>

                <Button
                    onClick={handleCheckout}
                    disabled={isRedirecting || (plan.custom && !valid)}
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

// --- Page ---
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
                                onSelectAuth={() => setAuthMode("signup")}
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
