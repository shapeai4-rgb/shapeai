import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { TOKENS_FOR_PLAN } from '@/lib/constants';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TOKENS_PER_EURO = 10;
const FX_EUR_GBP = 0.85; // Наш курс для конвертации

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  // 1. --- Проверяем подпись веб-хука ---
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 2. --- Обрабатываем только событие `checkout.session.completed` ---
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session & {
      line_items: Stripe.ApiList<Stripe.LineItem>
    };

    const userId = session.metadata?.userId;
    if (!userId) {
      return new NextResponse('User ID not found in session metadata.', { status: 400 });
    }

    const lineItem = session.line_items.data[0];
    if (!lineItem || !lineItem.description) {
      return new NextResponse('Line item description not found.', { status: 400 });
    }

    let tokensToAdd = 0;

    // 3. --- Рассчитываем количество токенов для начисления ---
    if (lineItem.description.includes('Custom Amount')) {
      const amount = session.amount_total! / 100; // Сумма в EUR или GBP
      const currency = session.currency!.toLowerCase();
      
      if (currency === 'eur') {
        tokensToAdd = Math.round(amount * TOKENS_PER_EURO);
      } else if (currency === 'gbp') {
        const amountInEur = amount / FX_EUR_GBP;
        tokensToAdd = Math.round(amountInEur * TOKENS_PER_EURO);
      }
    } else {
      // Ищем ID плана по названию (например, "Top-up: Standard Plan")
      const planId = Object.keys(TOKENS_FOR_PLAN).find(
        p => lineItem.description?.toLowerCase().includes(p)
      ) as keyof typeof TOKENS_FOR_PLAN | undefined;

      if (planId && TOKENS_FOR_PLAN[planId]) {
        tokensToAdd = TOKENS_FOR_PLAN[planId];
      }
    }
    
    if (tokensToAdd > 0) {
      // 4. --- Атомарно пополняем баланс пользователя в БД ---
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            tokenBalance: {
              increment: tokensToAdd,
            },
          },
        });
        console.log(`Successfully credited ${tokensToAdd} tokens to user ${userId}.`);
      } catch (dbError) {
        console.error('Failed to update user token balance:', dbError);
        return new NextResponse('Database error.', { status: 500 });
      }
    }
  }

  // 5. --- Отправляем успешный ответ в Stripe ---
  return NextResponse.json({ received: true });
}