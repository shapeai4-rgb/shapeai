import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream, DocumentProps } from "@react-pdf/renderer";
import { PlanPdfDocument } from "@/components/pdf/PlanPdfDocument";
import { type MealPlanData } from "@/types/pdf";
import React from "react";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    console.log(`[PDF Route] START: Request for planId: ${planId}`);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(`[PDF Route] OK: User ${session.user.id} is authorized.`);

    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: planId, userId: session.user.id },
    });

    if (!mealPlan) {
      return new NextResponse("Plan not found or access denied", { status: 404 });
    }
    console.log(`[PDF Route] OK: Found meal plan in DB.`);
    
    // ★★★ САМЫЙ ВАЖНЫЙ ЛОГ ★★★
    // Этот лог покажет нам точную структуру JSON, которую мы пытаемся обработать
    console.log(`[PDF Route] DEBUG: Raw plan content from DB: ${JSON.stringify(mealPlan.content, null, 2)}`);

    const planData = mealPlan.content as unknown as MealPlanData;

    console.log(`[PDF Route] PRE-RENDER: About to render PDF for title: "${planData?.title ?? 'No Title Found'}"`);
    
    const pdfStream = await renderToStream(
      React.createElement(PlanPdfDocument, { plan: planData }) as unknown as React.ReactElement<DocumentProps>
    );

    console.log(`[PDF Route] OK: PDF stream rendered successfully. Sending response.`);

    return new NextResponse(pdfStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ShapeAI_Meal_Plan_${planId}.pdf"`,
      },
    });

  } catch (error) {
    // ★★★ ЛОВИМ ТОЧНУЮ ОШИБКУ ★★★
    console.error("[PDF Route] CRASH:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}