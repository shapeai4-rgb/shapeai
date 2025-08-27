import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormEmail } from '@/components/emails/ContactFormEmail';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = 'info@shapeai.co.uk';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // ★★★ ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: Добавляем 'await' ★★★
    const emailHtml = await render(ContactFormEmail({ senderName: name, senderEmail: email, message }));

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <info@shapeai.co.uk>', // Теперь можно использовать ваш домен
      to: [toEmail],
      subject: `New Message from ${name} via ShapeAI`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Contact API] CRASH:', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}