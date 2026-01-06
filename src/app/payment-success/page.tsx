"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [balance, setBalance] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function processTokens() {
            try {
                const stored = localStorage.getItem("selectedPlan");
                if (!stored) throw new Error("No selected plan");

                const plan = JSON.parse(stored);

                const tokens = Number(plan.tokens);
                const amount = Number(plan.price);

                if (!Number.isFinite(tokens) || tokens <= 0) {
                    throw new Error("Invalid plan tokens");
                }

                const res = await fetch("/api/bizon/add-tokens", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        planName: plan.name,
                        amount,
                        currency: plan.currency,
                        tokens,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Token processing failed");
                }

                setBalance(data.newBalance);
                setStatus("success");
                localStorage.removeItem("selectedPlan");
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        }

        processTokens();
    }, []);

    if (status === "loading") {
        return (
            <div className="flex h-screen flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mb-4"
                />
                <p className="text-sm text-neutral-600">Verifying your payment…</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex h-screen flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
                <p className="mt-2 text-neutral-600">
                    Something went wrong while confirming your payment.
                </p>
                <button
                    onClick={() => router.push("/top-up")}
                    className="mt-6 px-5 py-2 bg-accent text-white rounded-xl"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold">Payment Successful 🎉</h2>
            <p className="mt-2 text-neutral-600">
                Your tokens have been added to your account.
            </p>
            {balance !== null && (
                <p className="mt-3 text-lg font-medium text-accent">
                    New balance: {balance.toLocaleString()} tokens
                </p>
            )}
            <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 px-5 py-2 bg-accent text-white rounded-xl"
            >
                Go to Dashboard
            </button>
        </div>
    );
}
