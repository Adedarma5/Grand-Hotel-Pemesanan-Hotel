import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email } = await req.json();
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, params.id]);
    return NextResponse.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal update user" }, { status: 500 });
  }
}
