import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const [rows]: any = await db.query("SELECT * FROM rooms WHERE id = ?", [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, fasilitas, deskripsi, price } = await req.json();
    await db.query(
      "UPDATE rooms SET name=?, facilities=?, description=?, price=? WHERE id=?",
      [name, fasilitas, deskripsi, price, params.id]
    );
    return NextResponse.json({ message: "Room updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.query("DELETE FROM rooms WHERE id=?", [params.id]);
    return NextResponse.json({ message: "Room deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
