import type { Currency, PlanType } from "@/lib/tokenCalculator";

const REFERENCE_PREFIX = "shapeai-topup:";

export type TopUpReferencePayload = {
  userId: string;
  planType: PlanType;
  planName: string;
  amount: number;
  currency: Currency;
  nonce: string;
};

export function createTopUpReference(payload: TopUpReferencePayload) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${REFERENCE_PREFIX}${encoded}`;
}

export function parseTopUpReference(referenceId: string) {
  if (!referenceId.startsWith(REFERENCE_PREFIX)) {
    return null;
  }

  try {
    const encoded = referenceId.slice(REFERENCE_PREFIX.length);
    const decoded = Buffer.from(encoded, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<TopUpReferencePayload>;

    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.planType !== "string" ||
      typeof parsed.planName !== "string" ||
      typeof parsed.amount !== "number" ||
      typeof parsed.currency !== "string" ||
      typeof parsed.nonce !== "string"
    ) {
      return null;
    }

    return parsed as TopUpReferencePayload;
  } catch {
    return null;
  }
}
