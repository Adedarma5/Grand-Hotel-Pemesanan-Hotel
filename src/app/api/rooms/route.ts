import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const [rows]: any = await db.query("SELECT * FROM rooms");
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: Request) {
  try {
    const { name, fasilitas, deskripsi, price } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ message: "Name and price are required" }, { status: 400 });
    }

    const [result]: any = await db.query(
      "INSERT INTO rooms (name, fasilitas, deskripsi, price) VALUES (?, ?, ?, ?)",
      [name, fasilitas, deskripsi, price]
    );

    return NextResponse.json({ message: "Room created", id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

