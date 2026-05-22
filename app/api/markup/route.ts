import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const markup = parseInt(process.env.DEFAULT_MARKUP ?? "10");
    return NextResponse.json({ success: true, data: { default: markup, services: {} } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil markup" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { markup, serviceMarkups } = body;

    return NextResponse.json({
      success: true,
      data: { markup, serviceMarkups, updatedAt: new Date().toISOString() }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal update markup" }, { status: 500 });
  }
}
