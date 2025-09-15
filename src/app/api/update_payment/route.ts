import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id diperlukan" }, { status: 400 });


    await db.query("UPDATE bookings SET payment_status = 'success' WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}
