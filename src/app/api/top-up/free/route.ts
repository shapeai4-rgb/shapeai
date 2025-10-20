import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { TOP_UP_PRICES, TOKENS_FOR_PLAN } from '@/lib/constants';

const TOKENS_PER_EURO = 10;
const FX_EUR_GBP = 0.85;
const FX_EUR_USD = 1.17;

export async function GET(request: Request) {
  try {
    console.log('[FREE_TOPUP] Request received:', request.url);
    
    // 1. --- User Authentication ---
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('[FREE_TOPUP] No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const userId = session.user.id;
    console.log('[FREE_TOPUP] User authenticated:', userId);

    // 2. --- Parse URL Parameters ---
    const url = new URL(request.url);
    const amount = parseInt(url.searchParams.get('amount') || '0');
    const currency = url.searchParams.get('currency') as 'eur' | 'gbp' | 'usd';
    const planId = url.searchParams.get('planId');
    const sessionId = url.searchParams.get('sessionId');

    console.log('[FREE_TOPUP] Parameters:', { amount, currency, planId, sessionId });

    if (!amount || !currency || !sessionId) {
      console.log('[FREE_TOPUP] Missing required parameters');
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    // 3. --- Calculate Tokens to Add ---
    let tokensToAdd = 0;

    if (planId && TOP_UP_PRICES[planId as keyof typeof TOP_UP_PRICES]) {
      // Fixed plan logic
      tokensToAdd = TOKENS_FOR_PLAN[planId as keyof typeof TOKENS_FOR_PLAN] || 0;
    } else {
      // Custom amount logic
      const amountInEur = currency === 'eur' ? amount / 100 : 
                          currency === 'gbp' ? (amount / 100) / FX_EUR_GBP :
                          (amount / 100) / FX_EUR_USD;
      tokensToAdd = Math.round(amountInEur * TOKENS_PER_EURO);
    }

    console.log(`[FREE_TOPUP] Processing for userId: ${userId}`);
    console.log(`[FREE_TOPUP] Amount: ${amount}, Currency: ${currency}, Tokens: ${tokensToAdd}`);

    // 4. --- Add Tokens to User Balance and Record Transaction ---
    if (tokensToAdd > 0) {
      try {
        // Обновляем баланс пользователя
        await prisma.user.update({
          where: { id: userId },
          data: { tokenBalance: { increment: tokensToAdd } },
        });

        // Записываем транзакцию
        const amountInEur = currency === 'eur' ? amount / 100 : 
                            currency === 'gbp' ? (amount / 100) / FX_EUR_GBP :
                            (amount / 100) / FX_EUR_USD;
        const description = planId 
          ? `Top-up: ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`
          : `Top-up: Custom Amount (${currency.toUpperCase()})`;

        await prisma.transaction.create({
          data: {
            userId,
            action: 'topup',
            tokenAmount: tokensToAdd,
            amount: amountInEur,
            currency: currency.toUpperCase(),
            description,
          },
        });

        console.log(`Successfully credited ${tokensToAdd} tokens to user ${userId}.`);
      } catch (dbError) {
        console.error('Failed to update user token balance:', dbError);
        return new NextResponse('Database error.', { status: 500 });
      }
    }

    // 5. --- Return Success Response with Redirect URL ---
    const origin = process.env.NODE_ENV === 'production' 
      ? 'https://shapeai.co.uk' 
      : 'http://localhost:3000';
    const redirectUrl = `${origin}/dashboard?payment_success=true&tokens_added=${tokensToAdd}`;
    
    return NextResponse.json({ 
      success: true, 
      tokensAdded: tokensToAdd,
      redirectUrl 
    });

  } catch (error) {
    console.error('FREE_TOPUP_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
