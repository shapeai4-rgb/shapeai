// Содержимое для src/app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/registration-confirmation";

// Эта функция будет обрабатывать POST-запросы на /api/register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, password, firstName, lastName,
      phone, dateOfBirth, street, city, country, postCode
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        street,
        city,
        country,
        postCode,
        // Мы не добавляем 'name', так как он будет заполняться
        // либо через Google, либо его можно будет составить из firstName + lastName позже
      },
    });

    const delivery = await sendWelcomeEmail({
      email: user.email ?? email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      tokenBalance: user.tokenBalance,
    });

    console.info("[REGISTER] Welcome email delivery:", {
      delivery,
      userId: user.id,
    });

    return NextResponse.json(user);
    
  } catch (error) {
    console.error("REGISTRATION ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
