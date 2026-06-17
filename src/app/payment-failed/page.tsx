"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function PaymentFailedPage() {
  const router = useRouter();
  const { messages } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 0.7 }}>
        <XCircle className="mb-4 h-20 w-20 text-red-500" />
      </motion.div>

      <h2 className="text-3xl font-semibold text-neutral-900">{messages.payment.failed}</h2>
      <p className="mt-2 max-w-md text-neutral-600">{messages.payment.failedLead}</p>
      <button onClick={() => router.push("/")} className="mt-6 rounded-xl bg-accent px-6 py-2 text-white shadow transition hover:bg-accent/90">
        {messages.payment.backHome}
      </button>
      <p className="mt-4 text-xs text-neutral-400">{messages.payment.redirecting}</p>
    </div>
  );
}
