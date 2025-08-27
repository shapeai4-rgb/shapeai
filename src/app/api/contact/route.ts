import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormEmail } from '@/components/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = 'info@shapeai.co.uk';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Простая валидация
    if (!name || !email || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'ShapeAI Contact Form <onboarding@resend.dev>', // ★ Домен resend.dev разрешен по умолчанию
      to: [toEmail],
      subject: `New Message from ${name}`,
      react: ContactFormEmail({ senderName: name, senderEmail: email, message }),
      replyTo: email, // Позволяет отвечать прямо на email пользователя
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}