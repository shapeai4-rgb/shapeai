import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream, DocumentProps } from "@react-pdf/renderer";
import { PlanPdfDocument } from "@/components/pdf/PlanPdfDocument";
import { type MealPlanData } from "@/types/pdf";
import React from "react";

// ★★★ 1. ИСПОЛЬЗУЕМ ПРАВИЛЬНУЮ СИГНАТУРУ NEXT.JS ★★★
export async function GET(
  request: Request,
  context: { params: { planId: string } } // Второй аргумент - это объект context
) {
  try {
    console.log(`[PDF Route] Received request for planId: ${context.params.planId}`);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(`[PDF Route] User ${session.user.id} is authorized.`);

    const { planId } = context.params; // ★ 2. Получаем planId из context.params
    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: planId, userId: session.user.id },
    });

    if (!mealPlan) {
      return new NextResponse("Plan not found or access denied", { status: 404 });
    }
    console.log(`[PDF Route] Found meal plan in DB for planId: ${planId}`);
    
    console.log(`[PDF Route] Raw content from DB: ${JSON.stringify(mealPlan.content, null, 2)}`);

    const planData = mealPlan.content as unknown as MealPlanData;

    console.log(`[PDF Route] About to render PDF for plan title: "${planData.title}"`);
    
    const pdfStream = await renderToStream(
      React.createElement(PlanPdfDocument, { plan: planData }) as unknown as React.ReactElement<DocumentProps>
    );

    console.log(`[PDF Route] PDF stream rendered successfully. Sending response.`);

    return new NextResponse(pdfStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ShapeAI_Meal_Plan_${planId}.pdf"`,
      },
    });

  } catch (error) {
    console.error("[PDF Route] CRASHED:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}