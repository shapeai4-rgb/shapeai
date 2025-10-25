"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000); // ⏳ через 5 секунд повертає на головну
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex h-screen flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.7 }}
            >
                <XCircle className="w-20 h-20 text-red-500 mb-4" />
            </motion.div>

            <h2 className="text-3xl font-semibold text-neutral-900">
                Payment Failed ❌
            </h2>

            <p className="mt-2 text-neutral-600 max-w-md">
                Unfortunately, your transaction could not be completed.
                <br />
                Please check your payment details or try again later.
            </p>

            <button
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-2 bg-accent text-white rounded-xl shadow hover:bg-accent/90 transition"
            >
                Back to Home
            </button>

            {/* Підказка */}
            <p className="mt-4 text-xs text-neutral-400">
                You’ll be redirected automatically in a few seconds...
            </p>
        </div>
    );
}
