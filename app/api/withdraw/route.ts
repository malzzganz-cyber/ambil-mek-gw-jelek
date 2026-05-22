import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, method, accountNumber, accountName } = body;

    if (!userId || !amount || !method || !accountNumber || !accountName) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    if (amount < 10000) {
      return NextResponse.json(
        { success: false, error: "Minimum withdraw Rp 10.000" },
        { status: 400 }
      );
    }

    const withdrawId = `WD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      data: {
        withdrawId,
        userId,
        amount,
        method,
        accountNumber,
        accountName,
        status: "pending",
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat withdraw" }, { status: 500 });
  }
}
