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

        const { planName, amount, currency, tokens } = await req.json();

        if (!Number.isInteger(tokens) || tokens <= 0) {
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

        // ✅ ATOMIC INCREMENT
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
