import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { PlanPdfDocument } from "@/components/pdf/PlanPdfDocument";
import { type MealPlanData } from "@/types/pdf";

export async function GET(
  request: Request,
  { params }: { params: { planId: string } }
) {
  try {
    // 1. Проверка авторизации
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planId } = params;
    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    // 2. Поиск плана в БД + проверка, что он принадлежит текущему пользователю
    const mealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: planId,
        userId: session.user.id, // Гарантирует, что пользователь может скачать только свой план
      },
    });

    if (!mealPlan) {
      return new NextResponse("Plan not found or access denied", { status: 404 });
    }

    // 3. Рендеринг React-компонента в PDF-поток
    const planData = mealPlan.content as unknown as MealPlanData; // ★ Сначала приводим тип
    
    const pdfStream = await renderToStream(
      <PlanPdfDocument plan={planData} /> // ★ Затем используем переменную
    );

    // 4. Отправка файла для скачивания
    return new NextResponse(pdfStream as unknown as ReadableStream<any>, { // ★ Исправлено на безопасный тип
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