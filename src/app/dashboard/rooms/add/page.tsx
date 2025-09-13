"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function TambahKamar() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [price, setPrice] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          fasilitas,
          deskripsi,
          price: Number(price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowPopup(true);
        setName("");
        setFasilitas("");
        setDeskripsi("");
        setPrice("");

        setTimeout(() => {
          router.push("/dashboard/rooms");
        }, 2000);
      } else {
        alert(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menambahkan kamar");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <h1 className="text-2xl font-bold mb-4">Tambah Kamar Baru</h1>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 w-96">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-bold text-green-700 text-center">
              Kamar berhasil ditambahkan!
            </h2>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Kamar</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fasilitas (pisahkan koma)</label>
          <input
            type="text"
            value={fasilitas}
            onChange={e => setFasilitas(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Keterangan</label>
          <textarea
            value={deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Harga per Malam</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
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
