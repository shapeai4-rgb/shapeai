"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface Plan {
    name: string;
    price: number;
    currency: string;
    tokens?: number;
}

interface FormData {
    cardNumber: string;
    expiry: string;
    cvv: string;
    name: string;
    address: string;
}

export default function CheckoutPage() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState<FormData>({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
        address: "",
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            const stored = localStorage.getItem("selectedPlan");
            if (stored) setPlan(JSON.parse(stored) as Plan);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handlePay = async () => {
        if (!plan) {
            alert("No plan selected.");
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch("/api/bizon/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: "user@example.com",
                    amount: plan.price * 100,
                    currency: plan.currency || "USD",
                    description: `Payment for ${plan.name}`,
                }),
            });

            const data: { form?: string; error?: string } = await res.json();
            console.log("💳 Bizon JSON:", data);

            if (data.form) {
                const container = document.createElement("div");
                container.innerHTML = data.form;
                document.body.appendChild(container);

                const formEl = container.querySelector("form") as HTMLFormElement | null;
                if (formEl) formEl.submit();
            } else {
                alert("Error: no payment form returned");
            }
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : String(err);
            alert("Payment error: " + message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative flex items-center justify-center w-20 h-20 mb-5">
                        <div className="absolute w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute w-12 h-12 bg-blue-100 rounded-full"></div>
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        Generating Checkout Session...
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Please wait while we prepare your payment.
                    </p>
                </motion.div>
            </div>
        );

    if (!plan)
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                    No plan selected
                </h1>
                <Button
                    onClick={() => (window.location.href = "/")}
                    className="px-5 py-2"
                >
                    Go back
                </Button>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 max-w-lg w-full"
                >
                    <div className="flex flex-col items-center text-center border-b pb-5 mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                            Checkout
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Review your details and complete your purchase securely.
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            Invoice Summary
                        </h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Plan:</span>
                                <span className="font-medium text-gray-800">{plan.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tokens:</span>
                                <span>
                  {plan.tokens
                      ? plan.tokens.toLocaleString()
                      : "Custom amount"}
                </span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total due:</span>
                                <span className="text-blue-600">
                  {plan.price} {plan.currency}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            Payment Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Cardholder Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Card Number
                                </label>
                                <input
                                    name="cardNumber"
                                    value={form.cardNumber}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    maxLength={19}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        name="expiry"
                                        value={form.expiry}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        name="cvv"
                                        value={form.cvv}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="123"
                                        maxLength={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Billing Address
                                </label>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="123 Main St, City, Country"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handlePay}
                        disabled={processing}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        {processing ? "Redirecting..." : "Pay Now"}
                    </Button>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all"
                        >
                            ← Back to Plans
                        </button>
                    </div>

                    <div className="mt-10 text-xs text-gray-400 text-center border-t pt-4">
                        Secured by{" "}
                        <span className="font-semibold text-gray-600">
              Bizon Payment Gateway
            </span>
                        <br />
                        Your transaction is encrypted & protected.
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
