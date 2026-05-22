import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, method } = body;

    if (!userId || !amount || !method) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const minDeposit = 10000;
    const maxDeposit = 5000000;

    if (amount < minDeposit) {
      return NextResponse.json(
        { success: false, error: `Minimum deposit Rp ${minDeposit.toLocaleString("id-ID")}` },
        { status: 400 }
      );
    }

    if (amount > maxDeposit) {
      return NextResponse.json(
        { success: false, error: `Maksimum deposit Rp ${maxDeposit.toLocaleString("id-ID")}` },
        { status: 400 }
      );
    }

    const depositId = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      data: {
        depositId,
        userId,
        amount,
        method,
        status: "pending",
        createdAt: new Date().toISOString(),
        message: method === "qris"
          ? "Scan QRIS di halaman deposit untuk melanjutkan pembayaran"
          : "Transfer ke rekening yang tertera, lalu upload bukti transfer"
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat deposit" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID diperlukan" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil riwayat deposit" }, { status: 500 });
  }
}
