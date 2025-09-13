import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

// GET semua rooms
export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM rooms");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Disable default body parser untuk form upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST tambah room + upload gambar
export async function POST(req: Request) {
  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Buat folder upload jika belum ada
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files: any) => {
      if (err) {
        console.error(err);
        resolve(
          NextResponse.json({ message: "Upload gagal" }, { status: 500 })
        );
        return;
      }

      const { name, fasilitas, deskripsi, price } = fields;
      let imageName = "";

      // Ambil nama file (file tunggal atau array)
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        imageName = path.basename(file.filepath);
      }

      if (!name || !price) {
        resolve(
          NextResponse.json({ message: "Name dan price wajib diisi" }, { status: 400 })
        );
        return;
      }

      try {
        const [result]: any = await db.query(
          "INSERT INTO rooms (name, fasilitas, deskripsi, price, image) VALUES (?, ?, ?, ?, ?)",
          [name, fasilitas, deskripsi, Number(price), `/uploads/${imageName}`]
        );

        resolve(
          NextResponse.json({ message: "Room created", id: result.insertId })
        );
      } catch (error) {
        console.error(error);
        resolve(
          NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
        );
      }
    });
  });
}
