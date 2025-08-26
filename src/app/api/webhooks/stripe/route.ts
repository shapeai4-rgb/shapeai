// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { TOKENS_FOR_PLAN } from '@/lib/constants';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TOKENS_PER_EURO = 10;
const FX_EUR_GBP = 0.85;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook signature verification failed.', errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const sessionFromWebhook = event.data.object as Stripe.Checkout.Session;

    // ★★★ НОВЫЙ БЛОК: Получаем полную сессию с деталями покупки ★★★
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      sessionFromWebhook.id,
      { expand: ['line_items'] }
    );
    // ★★★ КОНЕЦ НОВОГО БЛОКА ★★★

    const userId = sessionWithLineItems.metadata?.userId;
    if (!userId) {
      return new NextResponse('User ID not found in session metadata.', { status: 400 });
    }

    const lineItem = sessionWithLineItems.line_items?.data[0];
    if (!lineItem) {
      return new NextResponse('Line item not found.', { status: 400 });
    }

    // ★★★ НАЧАЛО БЛОКА ДЛЯ ОТЛАДКИ ★★★
    console.log(`[WEBHOOK] Processing for userId: ${userId}`);
    console.log(`[WEBHOOK] Line item description: "${lineItem.description}"`);
    // ★★★ КОНЕЦ БЛОКА ДЛЯ ОТЛАДКИ ★★★

    let tokensToAdd = 0;

    if (lineItem.description?.includes('Custom Amount')) {
      const amount = sessionWithLineItems.amount_total! / 100;
      const currency = sessionWithLineItems.currency!.toLowerCase();
      
      if (currency === 'eur') {
        tokensToAdd = Math.round(amount * TOKENS_PER_EURO);
      } else if (currency === 'gbp') {
        const amountInEur = amount / FX_EUR_GBP;
        tokensToAdd = Math.round(amountInEur * TOKENS_PER_EURO);
      }
    } else {
      const planId = Object.keys(TOKENS_FOR_PLAN).find(
        p => lineItem.description?.toLowerCase().includes(p)
      ) as keyof typeof TOKENS_FOR_PLAN | undefined;

      // ★★★ НАЧАЛО БЛОКА ДЛЯ ОТЛАДКИ ★★★
      console.log(`[WEBHOOK] Matched planId: "${planId}"`);
      // ★★★ КОНЕЦ БЛОКА ДЛЯ ОТЛАДКИ ★★★

      if (planId && TOKENS_FOR_PLAN[planId]) {
        tokensToAdd = TOKENS_FOR_PLAN[planId];
      }
    }

    // ★★★ НАЧАЛО БЛОКА ДЛЯ ОТЛАДКИ ★★★
    console.log(`[WEBHOOK] Calculated tokensToAdd: ${tokensToAdd}`);
    // ★★★ КОНЕЦ БЛОКА ДЛЯ ОТЛАДКИ ★★★
    
    if (tokensToAdd > 0) {
      try {
        console.log('[WEBHOOK] Attempting to update user token balance...');
        await prisma.user.update({
          where: { id: userId },
          data: { tokenBalance: { increment: tokensToAdd } },
        });
        console.log(`Successfully credited ${tokensToAdd} tokens to user ${userId}.`);
      } catch (dbError) {
        console.error('Failed to update user token balance:', dbError);
        return new NextResponse('Database error.', { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}