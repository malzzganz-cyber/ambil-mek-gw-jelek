import { NextRequest, NextResponse } from "next/server";
import { getRumahServices } from "@/lib/api";
import { applyMarkup } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") ?? "id";
    const markup = parseInt(process.env.DEFAULT_MARKUP ?? "10");

    const data = await getRumahServices(country);

    const services = data.services.map((s) => ({
      ...s,
      priceWithMarkup: applyMarkup(s.price, markup)
    }));

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data service" },
      { status: 500 }
    );
  }
}
