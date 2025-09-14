import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let filterSQL = "";
    const params: any[] = [];

    if (search) {
      filterSQL = "AND (YEAR(checkOut) = ? OR MONTH(checkOut) = ?)";
      const parsed = Number(search);
      if (!isNaN(parsed)) params.push(parsed, parsed);
    }

    const [rows]: any = await db.query(
      `
      SELECT id, roomId, roomName, fullName,  price, checkOut 
      FROM bookings
      WHERE status = 'checkout'
      ${filterSQL}
      ORDER BY checkOut DESC
      `,
      params
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data booking checkout" },
      { status: 500 }
    );
  }
}
