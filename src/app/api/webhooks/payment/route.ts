// src/app/api/webhooks/payment/route.ts
import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    const paymentProvider = getPaymentProvider();
    const result = await paymentProvider.handleWebhook(body, signature);

    if (result.success) {
      return NextResponse.json({ received: true });
    } else {
      return new NextResponse('Webhook processing failed', { status: 400 });
    }
  } catch (error) {
    console.error('WEBHOOK_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}