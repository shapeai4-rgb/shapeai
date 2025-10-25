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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 🔹 Безпечне оновлення балансу
        const currentBalance = (user as Record<string, unknown>)["tokenBalance"] as number | undefined;
        const newBalance = (currentBalance ?? 0) + tokens;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { tokenBalance: newBalance },
        });

        // 🔹 Записуємо транзакцію
        await prisma.transaction.create({
            data: {
                userId: user.id,
                // якщо у тебе поле називається "action" — залишаємо його
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
    } catch (err: unknown) {
        console.error("💥 Add tokens error:", err);

        const message =
            err instanceof Error ? err.message : "Unknown server error";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
