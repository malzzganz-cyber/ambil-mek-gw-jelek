import { NextRequest, NextResponse } from "next/server";
import { buyRumahNumber, cancelRumahOrder, getRumahSms } from "@/lib/api";
import { applyMarkup } from "@/lib/utils";
import admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0]!;
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, countryCode = "id", userId, price } = body;

    if (!serviceId || !userId) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const order = await buyRumahNumber(serviceId, countryCode);
    const markup = parseInt(process.env.DEFAULT_MARKUP ?? "10");
    const finalPrice = applyMarkup(price ?? order.price, markup);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        number: order.number,
        service: order.service,
        country: order.country,
        expires: order.expires,
        price: finalPrice
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID diperlukan" }, { status: 400 });
    }

    const data = await getRumahSms(orderId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil status order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID diperlukan" }, { status: 400 });
    }

    const data = await cancelRumahOrder(orderId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membatalkan order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
