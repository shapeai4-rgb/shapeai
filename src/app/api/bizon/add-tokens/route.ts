import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateTokens, PlanType, Currency } from "@/lib/tokenCalculator";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const amount = Number(body.amount);
        const planType = body.planType as PlanType;
        const currency = (body.currency ?? "EUR") as Currency;
        const planName = body.planName ?? planType;

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (!["lite", "standard", "pro", "custom"].includes(planType)) {
            return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
        }

        // ✅ SINGLE SOURCE OF TRUTH
        const tokens = calculateTokens(amount, planType);

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenBalance: {
                    increment: tokens,
                },
            },
        });

        await prisma.transaction.create({
            data: {
                userId: user.id,
                action: "topup",
                tokenAmount: tokens,
                amount,
                currency,
                description: `Top-up: ${planName}`,
            },
        });

        return NextResponse.json({
            success: true,
            tokensAdded: tokens,
            newBalance: updatedUser.tokenBalance,
        });
    } catch (e: any) {
        console.error("add-tokens error:", e);
        return NextResponse.json(
            { error: "Failed to add tokens" },
            { status: 500 }
        );
    }
}
