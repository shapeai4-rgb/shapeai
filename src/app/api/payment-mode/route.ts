import { NextResponse } from "next/server";
import { isWithoutPaymentEnabled } from "@/lib/payment-mode";

export async function GET() {
  return NextResponse.json({
    withoutPayment: isWithoutPaymentEnabled(),
  });
}
