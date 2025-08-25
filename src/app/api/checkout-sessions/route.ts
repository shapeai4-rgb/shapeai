import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { TOP_UP_PRICES } from '@/lib/constants';

type PlanId = keyof typeof TOP_UP_PRICES;

interface RequestBody {
  currency: 'eur' | 'gbp';
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

    // 2. --- Get or Create Stripe Customer ---
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      // Save the new customer ID to our database
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // 3. --- Prepare Line Item for Stripe ---
    const body: RequestBody = await request.json();
    const { currency, planId, customAmount } = body;
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://shapeai.co.uk';
    
    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (planId && TOP_UP_PRICES[planId]) {
      // --- Fixed Plan Logic ---
      const plan = TOP_UP_PRICES[planId];
      const amount = plan[currency];
      const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

      line_items.push({
        price_data: {
          currency: currency,
          product_data: { name: `Top-up: ${planName} Plan` },
          unit_amount: amount, // Amount in cents
        },
        quantity: 1,
      });
    } else if (customAmount && customAmount >= 500) { // Stripe has a minimum amount, usually 0.50 USD/EUR
      // --- Custom Amount Logic ---
      line_items.push({
        price_data: {
          currency: currency,
          product_data: { name: 'Top-up: Custom Amount' },
          unit_amount: customAmount,
        },
        quantity: 1,
      });
    } else {
      return new NextResponse('Invalid plan or amount.', { status: 400 });
    }
    
    // 4. --- Create Stripe Checkout Session ---
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/dashboard?payment_success=true`,
      cancel_url: `${origin}/top-up?payment_cancelled=true`,
      metadata: {
        userId: userId,
      }
    });

    if (!checkoutSession.url) {
      return new NextResponse('Could not create checkout session.', { status: 500 });
    }
    
    // 5. --- Return the session URL to the frontend ---
    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('STRIPE_CHECKOUT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}