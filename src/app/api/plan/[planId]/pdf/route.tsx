import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { PlanPdfDocument } from "@/components/pdf/PlanPdfDocument";
import { type MealPlanData } from "@/types/pdf";

// ★★★ 1. ОПРЕДЕЛЯЕМ ПРАВИЛЬНЫЙ ТИП ДЛЯ АРГУМЕНТА КОНТЕКСТА ★★★
interface RouteContext {
  params: {
    planId: string;
  };
}

// ★★★ 2. ПРИМЕНЯЕМ ЭТОТ ТИП К ФУНКЦИИ GET ★★★
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planId } = context.params; // ★ 3. Получаем planId из контекста
    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    const mealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: planId,
        userId: session.user.id,
      },
    });

    if (!mealPlan) {
      return new NextResponse("Plan not found or access denied", { status: 404 });
    }

    const planData = mealPlan.content as unknown as MealPlanData;
    
    const pdfStream = await renderToStream(
      <PlanPdfDocument plan={planData} />
    );

    return new NextResponse(pdfStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ShapeAI_Meal_Plan_${planId}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF_GENERATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}