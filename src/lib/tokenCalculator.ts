export type Currency = "EUR" | "GBP" | "USD";
export type PlanType = "lite" | "standard" | "pro" | "custom";

const BONUS_MAP: Record<PlanType, number> = {
    lite: 0,
    standard: 0.10,
    pro: 0.20,
    custom: 0,
};

export function calculateTokens(amount: number, planType: PlanType): number {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }

    const baseTokens = amount * 10;
    const bonus = baseTokens * (BONUS_MAP[planType] ?? 0);

    return Math.floor(baseTokens + bonus);
}
