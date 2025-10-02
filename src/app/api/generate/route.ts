import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { calculateGenerationCost, hasEnoughTokens, type CostCalculationRequest } from "@/lib/cost-calculation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateApiRequest extends CostCalculationRequest {
  diet: {
    types: string[];
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  try {
    // --- Шаг 1: Проверка сессии ---
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // --- Шаг 2: Получение данных и расчет стоимости ---
    const formData: GenerateApiRequest = await request.json();
    const { days } = formData;
    
    // Рассчитываем стоимость генерации
    const costCalculation = calculateGenerationCost(formData);
    
    // Получаем баланс пользователя
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { tokenBalance: true }
    });
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    
    // Проверяем, достаточно ли токенов
    if (!hasEnoughTokens(user.tokenBalance, costCalculation.totalCost)) {
      return new NextResponse(`Insufficient tokens. Required: ${costCalculation.totalCost}, Available: ${user.tokenBalance}`, { status: 402 });
    }
    
    // --- Шаг 3: Генерация плана через OpenAI ---
    const systemPrompt = `
      You are an expert nutritionist AI. Create a detailed, personalized ${days}-day meal plan.
      Your response MUST be a single, valid JSON object that strictly adheres to the following schema.
      Do not include any text, markdown, or explanations outside of the JSON object.

      SCHEMA:
      - title: string (e.g., "Weight Loss — ${days}-Day Personalized Plan")
      - user: { name: string } (Use the user's first name if available, otherwise use "User")
      - targets: { daily_kcal: number, daily_macros: { protein_g: number, fat_g: number, carbs_g: number } }
      - pdf: { qr_url: string } (Use a placeholder URL like "https://shapeai.co.uk/plan/PLAN_ID_PLACEHOLDER")
      - legal: { medical_disclaimer: string } (Use a standard disclaimer)
      - days: Day[] (An array of day objects, length must be exactly ${days})
      - recipes: Record<string, Recipe> (A dictionary of all unique recipes used in the plan)
      - shopping_list: ShoppingList (An aggregated shopping list for the entire plan)

      Day Object Schema:
      - day: number (e.g., 1)
      - summary: { kcal: number, protein_g: number, fat_g: number, carbs_g: number } (Totals for the day)
      - meals: Meal[] (An array of meals for the day)

      Meal Object Schema:
      - type: "breakfast" | "lunch" | "snack" | "dinner"
      - recipe_id: string (A unique ID, e.g., "r_oats_1". MUST match a key in the main 'recipes' object)
      - kcal: number
      - protein_g: number
      - fat_g: number
      - carbs_g: number

      Recipe Object Schema (for the main 'recipes' dictionary):
      - title: string (e.g., "Greek Chicken Bowl")
      - portion: string (e.g., "1 bowl (380 g)")
      - ingredients: { name: string, qty: number, unit: string }[]
      - instructions: string[]

      ShoppingList Schema:
      - by_category: { category: string, items: { name: string, qty: number, unit: string }[] }[]
      
      RULES:
      1.  Generate unique recipe_id for each distinct meal (e.g., r_oats_1, r_salmon_2).
      2.  Every recipe_id used in the 'days' array MUST have a corresponding entry in the 'recipes' object.
      3.  The 'shopping_list' must be aggregated for the entire week. Sum up the quantities of identical ingredients.
      4.  Base the plan on the user's detailed preferences provided in the user prompt.
    `;
    
    const userPrompt = `Generate the meal plan based on this user data: ${JSON.stringify(formData)}`;

    let textResponse: string;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      });
      textResponse = completion.choices[0].message.content ?? "";
    } catch (err) {
      console.error("OpenAI API call failed:", err);
      return new NextResponse("The AI model failed to respond.", { status: 504 });
    }
    
    const generatedPlan = JSON.parse(textResponse);
    if (!generatedPlan || !generatedPlan.days || !generatedPlan.recipes) {
      console.error("Model returned invalid JSON structure:\n", textResponse);
      return new NextResponse("AI returned an invalid response format.", { status: 502 });
    }
    
    // --- Шаг 4: Сохранение плана и списание токенов ---
    const createdPlan = await prisma.mealPlan.create({
      data: {
        userId: userId,
        content: generatedPlan,
        title: generatedPlan.title || `AI Plan created on ${new Date().toLocaleDateString()}`,
        days: days,
        kcalTarget: generatedPlan.targets?.daily_kcal || 0,
        status: "Active",
        dietTags: formData.diet.types || [],
      }
    });

    // Списываем токены по новой логике
    await prisma.user.update({
      where: { id: userId },
      data: { tokenBalance: { decrement: costCalculation.totalCost } },
    });

    // Записываем транзакцию траты токенов с детализацией
    const additionalOptionsText = costCalculation.breakdown.additionalOptions.length > 0 
      ? ` (${costCalculation.breakdown.additionalOptions.map(opt => opt.name).join(', ')})`
      : '';
    
    await prisma.transaction.create({
      data: {
        userId,
        action: 'spend',
        tokenAmount: -costCalculation.totalCost, // Отрицательное значение для трат
        amount: null, // Нет денежной суммы для трат
        currency: null,
        description: `Generated ${days}-day meal plan: ${generatedPlan.title}${additionalOptionsText}`,
      },
    });
    
    // Возвращаем ID созданного плана, чтобы можно было сразу перейти на его страницу
    return NextResponse.json({ planId: createdPlan.id });

  } catch (error) {
    console.error("GENERATE_API_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}