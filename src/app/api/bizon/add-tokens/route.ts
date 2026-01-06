// src/app/api/bizon/add-tokens/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const tokens = Number(body.tokens);
        const amount = Number(body.amount);

        if (!Number.isFinite(tokens) || tokens <= 0) {
            return NextResponse.json(
                { error: "Invalid tokens amount" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ ATOMIC UPDATE
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
                amount: Number.isFinite(amount) ? amount : null,
                currency: body.currency ?? "EUR",
                description: `Top-up: ${body.planName ?? "Unknown plan"}`,
            },
        });

        return NextResponse.json({
            success: true,
            newBalance: updatedUser.tokenBalance,
        });
    } catch (err) {
        console.error("💥 Add tokens error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Server error" },
            { status: 500 }
        );
    }
}
