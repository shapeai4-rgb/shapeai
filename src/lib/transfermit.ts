export type TransfermitNormalizedState = "completed" | "pending" | "failed" | "unknown";

export type TransfermitPayment = {
  id?: string;
  referenceId?: string;
  state?: string;
  amount?: number | string;
  currency?: string;
  [key: string]: unknown;
};

type TransfermitResponse = {
  result?: unknown;
  [key: string]: unknown;
};

const COMPLETED_STATES = new Set(["COMPLETED"]);
const PENDING_STATES = new Set(["PENDING", "CHECKOUT", "RECONCILIATION", "AWAITING_WEBHOOK"]);
const FAILED_STATES = new Set(["DECLINED", "CANCELLED", "CANCELED", "ERROR", "CHARGEBACK"]);

function transfermitBaseUrl() {
  const baseUrl = process.env.TRANSFERMIT_API_URL;
  if (!baseUrl) {
    throw new Error("TRANSFERMIT_API_URL is not configured");
  }

  return baseUrl.replace(/\/+$/, "");
}

function transfermitApiKey() {
  const apiKey = process.env.TRANSFERMIT_API_KEY;
  if (!apiKey) {
    throw new Error("TRANSFERMIT_API_KEY is not configured");
  }

  return apiKey;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapPaymentResponse(data: TransfermitResponse): unknown {
  return data.result ?? data;
}

export function normalizeTransfermitState(state: unknown): TransfermitNormalizedState {
  if (typeof state !== "string") {
    return "unknown";
  }

  const normalized = state.trim().toUpperCase();
  if (COMPLETED_STATES.has(normalized)) return "completed";
  if (PENDING_STATES.has(normalized)) return "pending";
  if (FAILED_STATES.has(normalized)) return "failed";
  return "unknown";
}

export function extractTransfermitPayment(payload: unknown): TransfermitPayment | null {
  const candidate = isRecord(payload)
    ? payload.payment ?? payload.result ?? payload
    : null;

  if (!isRecord(candidate)) {
    return null;
  }

  return candidate as TransfermitPayment;
}

export async function createTransfermitPayment(payload: Record<string, unknown>): Promise<TransfermitPayment> {
  const response = await fetch(`${transfermitBaseUrl()}/payments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${transfermitApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as TransfermitResponse;
  const payment = unwrapPaymentResponse(data);

  if (!response.ok || !isRecord(payment)) {
    throw new Error("Transfermit create payment failed");
  }

  return payment as TransfermitPayment;
}

export async function getTransfermitPayment(paymentId: string): Promise<TransfermitPayment> {
  const response = await fetch(`${transfermitBaseUrl()}/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${transfermitApiKey()}`,
    },
  });

  const data = (await response.json()) as TransfermitResponse;
  const payment = unwrapPaymentResponse(data);

  if (!response.ok || !isRecord(payment)) {
    throw new Error("Transfermit payment status lookup failed");
  }

  return payment as TransfermitPayment;
}
