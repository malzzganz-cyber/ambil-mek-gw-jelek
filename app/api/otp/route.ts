import { NextRequest, NextResponse } from "next/server";
import { getRumahSms } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID diperlukan" },
        { status: 400 }
      );
    }

    const data = await getRumahSms(orderId);

    return NextResponse.json({
      success: true,
      data: {
        status: data.status,
        otp: data.sms?.code ?? null,
        sms: data.sms ?? null
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil OTP";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
