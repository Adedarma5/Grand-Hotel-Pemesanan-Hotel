import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [usersResult]: any = await db.query("SELECT COUNT(*) AS users FROM users");
    const users = usersResult[0]?.users || 0;
    const [roomsResult]: any = await db.query("SELECT COUNT(*) AS rooms FROM rooms");
    const rooms = roomsResult[0]?.rooms || 0;
    const [bookingsResult]: any = await db.query("SELECT COUNT(*) AS bookings FROM bookings");
    const bookings = bookingsResult[0]?.bookings || 0;

    const [completedResult]: any = await db.query(
      "SELECT COUNT(*) AS completed FROM bookings WHERE status = 'checkout'"
    );
    const completed = completedResult[0]?.completed || 0;

    return NextResponse.json({ users, rooms, bookings, completed });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
