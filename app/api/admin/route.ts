import { NextRequest, NextResponse } from "next/server";
import { getRumahBalance } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "balance") {
      const data = await getRumahBalance();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, error: "Action tidak dikenali" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data admin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "confirm-deposit") {
      return NextResponse.json({ success: true, message: "Deposit dikonfirmasi" });
    }

    if (action === "reject-deposit") {
      return NextResponse.json({ success: true, message: "Deposit ditolak" });
    }

    if (action === "process-withdraw") {
      return NextResponse.json({ success: true, message: "Withdraw diproses" });
    }

    return NextResponse.json({ success: false, error: "Action tidak dikenali" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses action" }, { status: 500 });
  }
}
