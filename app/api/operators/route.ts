import { NextRequest, NextResponse } from "next/server";
import { getRumahOperators } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") ?? "id";

    const data = await getRumahOperators(country);
    return NextResponse.json({ success: true, data: data.operators });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data operator" },
      { status: 500 }
    );
  }
}
