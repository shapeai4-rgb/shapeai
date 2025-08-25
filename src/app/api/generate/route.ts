import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

// 1. Инициализируем клиент OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Определяем тип для входящего запроса для безопасности
interface GenerateApiRequest {
  freeText: string;
  days: number;
  goals: object;
  structure: object;
  diet: {
    types: string[];
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  try {
    // --- Шаг 1: Проверка сессии и баланса токенов ---
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.tokenBalance <= 0) {
      return new NextResponse("Insufficient tokens", { status: 402 });
    }

    // --- Шаг 2: Получение данных из фронтенд-формы ---
    const { freeText, days, goals, structure, diet }: GenerateApiRequest = await request.json();
    if (!days || !goals || !structure || !diet) {
      return new NextResponse("Invalid request body. Missing required fields.", { status: 400 });
    }
    
    // --- Шаг 3: Вызов OpenAI API ---
    
    // Промпт разделен на 'system' (инструкции) и 'user' (данные) для лучшего качества
    const systemPrompt = `
      You are a nutrition assistant. Create a personalized weight-loss meal plan.
      STRICT OUTPUT FORMAT:
      - Respond ONLY with a valid JSON object (no extra text, no markdown).
      - Top-level MUST contain exactly ${days} keys: "day1" … "day${days}".
      - Each day MUST include meals: "breakfast", "lunch", "dinner".
      - If snacks are allowed (see inputs), include optional "snacks": [{ "title": string, "kcal": number }] (can be empty).
      - For every meal provide at least: { "title": string, "kcal": number }.
      - Numbers MUST be numbers (e.g., 450), not strings.
      - Do NOT include any keys other than the day keys at the top level.
    `;
    
    const userPrompt = `
      Generate a ${days}-day plan based on the following user data:
      {
        "freeText": ${JSON.stringify(freeText)},
        "days": ${days},
        "goals": ${JSON.stringify(goals)},
        "structure": ${JSON.stringify(structure)},
        "diet": ${JSON.stringify(diet)}
      }
    `;

    let textResponse: string;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" }, // Гарантирует возврат валидного JSON
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

    // --- Шаг 4: Безопасный парсинг и сохранение в БД ---
    
    function tryParseJson(s: string) {
      try { 
        return JSON.parse(s); 
      } catch (e) {
        console.error("Failed to parse JSON from AI:", s, e);
        return null;
      }
    }

    const generatedPlan = tryParseJson(textResponse);

    if (!generatedPlan) {
      console.error("Model returned invalid or unparsable JSON:\n", textResponse);
      return new NextResponse("AI returned an invalid response format.", { status: 502 });
    }
    
    await prisma.mealPlan.create({
      data: {
        userId: userId,
        content: generatedPlan,
        title: `AI Plan created on ${new Date().toLocaleDateString()}`,
        days: days,
        kcalTarget: 0, // Placeholder
        status: "Active",
        dietTags: diet.types || [],
      }
    });
    
    // --- Шаг 5: Списание токена и возврат результата ---
    await prisma.user.update({
      where: { id: userId },
      data: { tokenBalance: { decrement: 1 } },
    });
    
    return NextResponse.json(generatedPlan);

  } catch (error) {
    console.error("GENERATE_API_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}