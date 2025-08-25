// Содержимое для src/app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// Эта функция будет обрабатывать POST-запросы на /api/register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

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
        // Мы не добавляем 'name', так как он будет заполняться
        // либо через Google, либо его можно будет составить из firstName + lastName позже
      },
    });

    return NextResponse.json(user);
    
  } catch (error) {
    console.error("REGISTRATION ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}