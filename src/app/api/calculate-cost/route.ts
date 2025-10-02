// src/app/api/calculate-cost/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateGenerationCost, hasEnoughTokens, type CostCalculationRequest } from "@/lib/cost-calculation";

export async function POST(request: Request) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Получаем данные запроса
    const body: CostCalculationRequest = await request.json();
    
    // Валидируем обязательные поля
    if (typeof body.freeText !== 'string') {
      return new NextResponse("freeText must be a string", { status: 400 });
    }
    
    if (!body.days || typeof body.days !== 'number' || body.days < 1) {
      return new NextResponse("days must be a positive number", { status: 400 });
    }

    // Рассчитываем стоимость
    const costCalculation = calculateGenerationCost(body);
    
    // Получаем баланс пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tokenBalance: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Проверяем, достаточно ли токенов
    const canGenerate = hasEnoughTokens(user.tokenBalance, costCalculation.totalCost);

    return NextResponse.json({
      ...costCalculation,
      userBalance: user.tokenBalance,
      canGenerate,
      wordCount: body.freeText.match(/\b\w+\b/g)?.length || 0,
    });

  } catch (error) {
    console.error("CALCULATE_COST_ERROR", error);
    
    if (error instanceof Error && error.message.includes("Maximum")) {
      return new NextResponse(error.message, { status: 400 });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
