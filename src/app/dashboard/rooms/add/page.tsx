"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function TambahKamar() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      Swal.fire("Peringatan!", "Silahkan upload gambar!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("fasilitas", fasilitas);
    formData.append("deskripsi", deskripsi);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Tidak ada response JSON dari server" };
      }

      if (res.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Kamar berhasil ditambahkan.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/dashboard/rooms");
        });

        setName("");
        setFasilitas("");
        setDeskripsi("");
        setPrice("");
        setImage(null);
      } else {
        Swal.fire("Gagal!", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan kamar.", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <h1 className="text-2xl font-bold mb-4">Tambah Kamar Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Kamar</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fasilitas (pisahkan koma)</label>
          <input
            type="text"
            value={fasilitas}
            onChange={(e) => setFasilitas(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Keterangan</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Harga per Malam</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full"
            required
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Tambah Kamar
        </button>
      </form>
    </div>
  );
}
