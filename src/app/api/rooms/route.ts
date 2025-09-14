import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM rooms");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const fasilitas = formData.get("fasilitas")?.toString() || "";
    const deskripsi = formData.get("deskripsi")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const image = formData.get("image") as Blob | null;

    if (!name || !price || !image) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}_${name.replace(/\s+/g, "_")}.jpg`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const { db } = await import("@/lib/db");
    const [result]: any = await db.query(
      "INSERT INTO rooms (name, fasilitas, deskripsi, price, image) VALUES (?, ?, ?, ?, ?)",
      [name, fasilitas, deskripsi, Number(price), `/uploads/${filename}`]
    );

    return NextResponse.json({ message: "Kamar berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("POST /api/rooms error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
};