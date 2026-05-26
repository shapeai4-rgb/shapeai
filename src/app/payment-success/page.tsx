"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/client";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { messages } = useI18n();

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <CheckCircle className="mb-4 h-20 w-20 text-green-500" />
      <h2 className="text-2xl font-semibold">{messages.payment.success}</h2>
      <p className="mt-2 text-neutral-600">{messages.payment.successLead}</p>
      <button onClick={() => router.push("/dashboard")} className="mt-6 rounded-xl bg-accent px-5 py-2 text-white">
        {messages.payment.goDashboard}
      </button>
    </div>
  );
}
