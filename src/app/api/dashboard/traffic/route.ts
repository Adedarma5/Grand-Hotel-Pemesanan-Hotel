import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT 
      MONTH(createdAt) AS month,
      COUNT(*) AS booking,
      SUM(CASE WHEN status = 'checkOut' THEN 1 ELSE 0 END) AS completed
      FROM bookings
      GROUP BY MONTH(createdAt)
      ORDER BY MONTH(createdAt)
    `);


    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const data = rows.map((row: any) => ({
      month: monthNames[row.month - 1],
      booking: row.booking,
      completed: row.completed,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetch traffic data:", error);
    return NextResponse.json({ error: "Gagal ambil data trafik" }, { status: 500 });
  }
}
