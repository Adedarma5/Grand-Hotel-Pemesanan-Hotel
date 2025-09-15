import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, grossAmount, fullName, email, roomName, phone, checkIn, checkOut } = await req.json();

    if (!orderId || !grossAmount) {
      return NextResponse.json({ error: "orderId dan grossAmount wajib diisi" }, { status: 400 });
    }

    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY!;
    const auth = Buffer.from(midtransServerKey + ":").toString("base64");

    const payload = {
      transaction_details: {
        order_id: orderId.toString(),
        gross_amount: grossAmount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: fullName,
        email,
        phone,
      },
       item_details: [
        {
          id: `ROOM-${orderId}`,
          price: grossAmount,
          quantity: 1,
          name: roomName,
        },
      ],
      custom_fields: [
        { label: "Check-in", value: checkIn },
        { label: "Check-out", value: checkOut },
      ],
    };

    const response = await fetch("https://api.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.token) {
      return NextResponse.json({ error: "Gagal generate Snap token", data }, { status: 500 });
    }

    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error("Error generate Snap token:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
