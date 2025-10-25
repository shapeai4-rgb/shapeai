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
                // Отримуємо тариф із localStorage
                const stored = localStorage.getItem("selectedPlan");
                if (!stored) throw new Error("No selected plan found");

                const plan = JSON.parse(stored);

                // Надсилаємо запит на сервер
                const res = await fetch("/api/bizon/add-tokens", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        planName: plan.name,
                        amount: plan.price,
                        currency: plan.currency,
                        tokens: plan.tokens,
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setBalance(data.newBalance);
                    setStatus("success");
                    localStorage.removeItem("selectedPlan");
                } else throw new Error(data.error);
            } catch (e) {
                console.error(e);
                setStatus("error");
            }
        }
        processTokens();
    }, []);

    if (status === "loading") {
        return (
            <div className="flex h-screen flex-col items-center justify-center text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mb-4"
                />
                <p className="text-neutral-600 text-sm">Verifying your payment...</p>
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
                    className="mt-6 px-5 py-2 bg-accent text-white rounded-xl shadow hover:bg-accent/90 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-neutral-900">
                Payment Successful 🎉
            </h2>
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
                className="mt-6 px-5 py-2 bg-accent text-white rounded-xl shadow hover:bg-accent/90 transition"
            >
                Go to Dashboard
            </button>
        </div>
    );
}
