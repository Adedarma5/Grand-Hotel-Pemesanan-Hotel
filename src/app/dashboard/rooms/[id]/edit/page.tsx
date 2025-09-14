"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function EditKamar() {
  const router = useRouter();
  const params = useParams(); // ambil id dari url
  const id = params?.id as string;

  const [name, setName] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch data kamar saat halaman dibuka
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        if (!res.ok) throw new Error("Gagal ambil data kamar");
        const data = await res.json();

        setName(data.name);
        setFasilitas(data.fasilitas);
        setDeskripsi(data.deskripsi);
        setPrice(data.price.toString());
        setPreview(data.image); // tampilkan foto lama
      } catch (error) {
        console.error(error);
        setMessage("Gagal memuat data kamar");
      }
    };

    if (id) fetchRoom();
  }, [id]);

  // 🔹 Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("fasilitas", fasilitas);
    formData.append("deskripsi", deskripsi);
    formData.append("price", price);
    if (image) formData.append("image", image); // hanya kirim jika ada gambar baru

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setShowPopup(true);
        setTimeout(() => {
          router.push("/dashboard/rooms");
        }, 2000);
      } else {
        alert(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengupdate kamar");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <h1 className="text-2xl font-bold mb-4">Edit Kamar</h1>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 w-96">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-bold text-green-700 text-center">
              Kamar berhasil diperbarui!
            </h2>
          </div>
        </div>
      )}

      {message && <div className="mb-4 text-red-500 font-medium">{message}</div>}

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
          <label className="block mb-1 font-medium">Fasilitas</label>
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

        <div>
          <label className="block mb-1 font-medium">Ganti Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files ? e.target.files[0] : null;
              setImage(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
