import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const fasilitas = formData.get("fasilitas")?.toString() || "";
    const deskripsi = formData.get("deskripsi")?.toString() || "";
    const price = formData.get("price")?.toString();
    const imageFile = formData.get("image") as File | null;


    if (!name || !price) {
      return NextResponse.json({ message: "Name dan price wajib diisi" }, { status: 400 });
    }

    let imagePath = null;

    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${filename}`;
    } else {
      const [rows]: any = await db.query("SELECT image FROM rooms WHERE id = ?", [params.id]);
      imagePath = rows[0]?.image || null;
    }

    await db.query(
      "UPDATE rooms SET name=?, fasilitas=?, deskripsi=?, price=?, image=? WHERE id=?",
      [name, fasilitas, deskripsi, price, imagePath, params.id]
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
