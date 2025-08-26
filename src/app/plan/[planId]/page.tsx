import { getServerSession } from "next-auth";
import { notFound } from 'next/navigation';
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type MealPlanData } from "@/types/pdf";

import PlanClient from './plan-client'; // Импортируем наш клиентский компонент

// Эта функция будет выполняться на сервере
async function getPlanData(planId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return notFound(); // Если пользователь не залогинен, показываем 404
  }

  const mealPlan = await prisma.mealPlan.findUnique({
    where: {
      id: planId,
      userId: session.user.id, // Гарантирует, что пользователь может видеть только свой план
    },
  });

  if (!mealPlan) {
    return notFound(); // Если план не найден или не принадлежит пользователю, показываем 404
  }
  
  // Безопасно приводим тип JSON-контента к нашему MealPlanData
  return mealPlan.content as unknown as MealPlanData;
}

// ★★★ ЭТО ТЕПЕРЬ ASYNC СЕРВЕРНЫЙ КОМПОНЕНТ ★★★
export default async function PlanPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const planData = await getPlanData(planId);

  // Рендерим клиентский компонент и передаем ему ID и реальные данные плана
  return <PlanClient planId={planId} plan={planData} />;
}