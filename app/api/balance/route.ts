import { NextResponse } from "next/server";
import { getRumahBalance } from "@/lib/api";

export async function GET() {
  try {
    const data = await getRumahBalance();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil saldo";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
