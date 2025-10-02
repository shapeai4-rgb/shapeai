import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Ограничиваем до 50 последних транзакций
    });

    return NextResponse.json(transactions);

  } catch (error) {
    console.error("GET_TRANSACTIONS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



