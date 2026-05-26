'use client';

import { useEffect, useState } from "react";

type PaymentModeResponse = {
  withoutPayment: boolean;
};

export function usePaymentMode() {
  const [withoutPayment, setWithoutPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/payment-mode")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load payment mode.");
        }

        return (await response.json()) as PaymentModeResponse;
      })
      .then((data) => {
        if (!cancelled) {
          setWithoutPayment(Boolean(data.withoutPayment));
        }
      })
      .catch((error) => {
        console.error("[PAYMENT_MODE] Failed to load runtime flag:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isLoading,
    withoutPayment,
  };
}
