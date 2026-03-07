"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
    const router = useRouter();

    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold">Payment Successful 🎉</h2>
            <p className="mt-2 text-neutral-600">
                Your payment was received. Tokens will be credited shortly.
            </p>
            <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 px-5 py-2 bg-accent text-white rounded-xl"
            >
                Go to Dashboard
            </button>
        </div>
    );
}
