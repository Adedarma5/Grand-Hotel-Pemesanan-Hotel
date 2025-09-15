import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    let rows;
    if (decoded.role === "admin") {
      [rows] = await db.query("SELECT * FROM bookings ORDER BY createdAt DESC");
    } else {
      [rows] = await db.query(
        "SELECT * FROM bookings WHERE id_pengguna = ? ORDER BY createdAt DESC",
        [decoded.id]
      );
    }

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error fetching bookings" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    const body = await req.json();
    const { roomId, roomName, checkIn, checkOut, fullName, email, phone, note } = body;

    if (!roomId || !fullName || !checkIn || !checkOut || !email) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const [roomRows]: any = await db.query("SELECT price FROM rooms WHERE id = ?", [roomId]);
    if (roomRows.length === 0) {
      return NextResponse.json({ success: false, message: "Kamar tidak ditemukan" }, { status: 404 });
    }
    const roomPrice = roomRows[0].price;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * roomPrice;

    await db.query(
      `INSERT INTO bookings 
      (roomId, roomName, checkIn, checkOut, fullName, email, phone, note, price, id_pengguna) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        roomId,
        roomName,
        checkIn,
        checkOut,
        fullName,
        email,
        phone,
        note || "",
        totalPrice,
        decoded.id
      ]
    );

    const html = `
      <h2>Terima kasih telah memesan kamar!</h2>
      <p>Halo <strong>${fullName}</strong>,</p>
      <p>Booking kamar Anda telah berhasil:</p>
      <ul>
        <li><strong>Nama Kamar:</strong> ${roomName}</li>
        <li><strong>Check-in:</strong> ${checkIn}</li>
        <li><strong>Check-out:</strong> ${checkOut}</li>
        <li><strong>Jumlah Malam:</strong> ${nights}</li>
        <li><strong>Total Harga:</strong> Rp ${totalPrice.toLocaleString("id-ID")}</li>
      </ul>
      <p>Terima kasih telah menggunakan Hotel Grand.</p>
    `;
    await sendMail(email, `Konfirmasi Booking Kamar: ${roomName}`, html);

    return NextResponse.json({ success: true, totalPrice });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error saving booking" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID tidak ditemukan" }, { status: 400 });

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error deleting booking" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error updating status" }, { status: 500 });
  }
}
