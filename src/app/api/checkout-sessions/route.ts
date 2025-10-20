import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { getPaymentProvider } from '@/lib/payment';
import { TOP_UP_PRICES } from '@/lib/constants';

type PlanId = keyof typeof TOP_UP_PRICES;

interface RequestBody {
  currency: 'eur' | 'gbp' | 'usd';
  planId?: PlanId;
  customAmount?: number; // Amount in smallest currency unit (e.g., cents)
}

export async function POST(request: Request) {
  try {
    // 1. --- User Authentication ---
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // 2. --- Prepare Payment Parameters ---
    const body: RequestBody = await request.json();
    const { currency, planId, customAmount } = body;
    
    let amount = 0;
    if (planId && TOP_UP_PRICES[planId]) {
      amount = TOP_UP_PRICES[planId][currency];
    } else if (customAmount && customAmount >= 50) {
      amount = customAmount;
    } else {
      return new NextResponse('Invalid plan or amount.', { status: 400 });
    }

    // 3. --- Create Checkout Session using Payment Provider ---
    const paymentProvider = getPaymentProvider();
    const checkoutResult = await paymentProvider.createCheckoutSession({
      userId,
      amount,
      currency,
      planId,
      customAmount
    });

    // 4. --- Return the session URL to the frontend ---
    return NextResponse.json({ url: checkoutResult.url });

  } catch (error) {
    console.error('CHECKOUT_SESSION_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}