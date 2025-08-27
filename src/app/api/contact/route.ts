import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormEmail } from '@/components/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = 'info@shapeai.co.uk';

// ...
export async function POST(request: Request) {
  try {
    console.log('[Contact API] Received request.');
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    console.log(`[Contact API] Data parsed: ${name}, ${email}`);

    // ★ Проверяем, видит ли сервер API ключ
    if (!process.env.RESEND_API_KEY) {
      console.error('[Contact API] CRITICAL: RESEND_API_KEY is not configured.');
      throw new Error("Server is not configured for sending emails.");
    }

    console.log('[Contact API] Attempting to send email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'ShapeAI Contact Form <onboarding@resend.dev>',
      to: [toEmail],
      subject: `New Message from ${name}`,
      react: ContactFormEmail({ senderName: name, senderEmail: email, message }),
      replyTo: email,
    });

    if (error) {
      // ★ Логируем точную ошибку от Resend
      console.error('[Contact API] Resend API returned an error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[Contact API] Email sent successfully!', data);
    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Contact API] CRASH:', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}