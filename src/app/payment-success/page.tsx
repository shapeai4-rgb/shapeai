"use client";

import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMessage } from "@/i18n/messages";
import { useI18n } from "@/i18n/client";

type PaymentStatus = "checking" | "completed" | "pending" | "failed" | "unknown";

type ReconcileResponse = {
  error?: string;
  gatewayState?: string | null;
  referenceId?: string;
  status?: "completed" | "pending" | "failed" | "unknown";
};

function getQueryValue(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { messages } = useI18n();
  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [reference, setReference] = useState("");
  const [gatewayState, setGatewayState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function reconcilePayment() {
      const paymentId = getQueryValue("id");
      const referenceId = getQueryValue("ref");
      setReference(referenceId || paymentId || "unknown");

      if (!paymentId) {
        setStatus("unknown");
        return;
      }

      try {
        const response = await fetch("/api/bizon/reconcile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, referenceId }),
        });
        const data = (await response.json()) as ReconcileResponse;

        if (cancelled) return;

        setGatewayState(data.gatewayState ?? null);

        if (!response.ok || !data.status) {
          setStatus("unknown");
          return;
        }

        setStatus(data.status);
        setReference(data.referenceId || referenceId || paymentId);
      } catch {
        if (!cancelled) {
          setStatus("unknown");
        }
      }
    }

    reconcilePayment();

    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (status === "completed") {
      return {
        icon: <CheckCircle className="mb-4 h-20 w-20 text-green-500" />,
        lead: messages.payment.completedLead,
        title: messages.payment.completed,
      };
    }

    if (status === "pending") {
      return {
        icon: <Clock className="mb-4 h-20 w-20 text-amber-500" />,
        lead: messages.payment.pendingLead,
        title: messages.payment.pending,
      };
    }

    if (status === "failed") {
      return {
        icon: <XCircle className="mb-4 h-20 w-20 text-red-500" />,
        lead: messages.payment.failedLead,
        title: messages.payment.failed,
      };
    }

    if (status === "checking") {
      return {
        icon: <Loader2 className="mb-4 h-20 w-20 animate-spin text-accent" />,
        lead: messages.checkout.preparingPayment,
        title: messages.payment.checking,
      };
    }

    return {
      icon: <AlertCircle className="mb-4 h-20 w-20 text-amber-500" />,
      lead: formatMessage(messages.payment.supportLead, { reference }),
      title: messages.payment.unknown,
    };
  }, [messages, reference, status]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {content.icon}
      <h2 className="text-2xl font-semibold">{content.title}</h2>
      <p className="mt-2 max-w-xl text-neutral-600">{content.lead}</p>
      {gatewayState ? (
        <p className="mt-3 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
          Transfermit: {gatewayState}
        </p>
      ) : null}
      <button onClick={() => router.push("/dashboard")} className="mt-6 rounded-xl bg-accent px-5 py-2 text-white">
        {messages.payment.goDashboard}
      </button>
    </div>
  );
}
