export type Currency = "EUR" | "GBP" | "USD";
export type PlanType = "lite" | "standard" | "pro" | "custom";

const FIXED_PLAN_TOKENS: Record<Exclude<PlanType, "custom">, number> = {
    lite: 90,
    standard: 210,
    pro: 600,
};

export function calculateTokens(amount: number, planType: PlanType): number {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }

    if (planType !== "custom") {
        return FIXED_PLAN_TOKENS[planType];
    }

    return Math.floor(amount * 10);
}
