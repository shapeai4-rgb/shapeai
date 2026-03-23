"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface Plan {
  id?: string;
  name: string;
  price: number;
  currency: string;
  tokens?: number;
}

interface FormData {
  address: string;
  cardNumber: string;
  cvv: string;
  expiry: string;
  name: string;
}

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState<FormData>({
    address: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    name: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const stored = localStorage.getItem("selectedPlan");
      if (stored) {
        setPlan(JSON.parse(stored) as Plan);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

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
          amount: plan.price,
          currency: plan.currency || "USD",
          planName: plan.name,
          planType: plan.id || "custom",
        }),
      });

      const data: { error?: string; redirectUrl?: string } = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      alert(`Error: ${data.error || "No payment redirect returned"}`);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      alert("Payment error: " + message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
            <div className="absolute h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <div className="absolute h-12 w-12 rounded-full bg-blue-100" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Generating checkout session...</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we prepare your payment.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="mb-3 text-2xl font-semibold text-gray-800">No plan selected</h1>
        <Button onClick={() => (window.location.href = "/")} className="px-5 py-2">
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-10">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-2xl md:p-10"
        >
          <div className="mb-6 flex flex-col items-center border-b pb-5 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-800">Checkout</h1>
            <p className="mt-2 text-gray-500">
              Review your details and complete your purchase securely.
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Invoice Summary</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium text-gray-800">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens:</span>
                <span>{plan.tokens ? plan.tokens.toLocaleString() : "Custom amount"}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total due:</span>
                <span className="text-blue-600">
                  {plan.price} {plan.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">Cardholder Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Card Number</label>
                <input
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm text-gray-600">Expiry Date</label>
                  <input
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="mb-1 block text-sm text-gray-600">CVV</label>
                  <input
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Billing Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="123 Main St, City, Country"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handlePay}
            disabled={processing}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            {processing ? "Redirecting..." : "Pay Now"}
          </Button>

          <div className="mt-6 text-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-sm text-gray-500 transition-all hover:text-gray-700 hover:underline"
            >
              Back to Plans
            </button>
          </div>

          <div className="mt-10 border-t pt-4 text-center text-xs text-gray-400">
            Secured by <span className="font-semibold text-gray-600">ShapeAI Payments</span>
            <br />
            Your transaction is encrypted and protected.
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
