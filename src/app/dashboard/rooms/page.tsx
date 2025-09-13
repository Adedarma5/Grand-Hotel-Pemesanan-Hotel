"use client";

import { useEffect, useState } from "react";

interface Room {
  id: number;
  name: string;
  fasilitas: string;
  deskripsi: string;
  price: number;
}

export default function DaftarKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Gagal fetch data kamar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Hapus kamar
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus kamar ini?")) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Kamar berhasil dihapus!");
        setRooms(rooms.filter(room => room.id !== id));
      } else {
        alert(data.message || "Gagal menghapus kamar");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus kamar");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Memuat data kamar...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Kamar</h1>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama Kamar</th>
            <th className="border px-4 py-2">Fasilitas</th>
            <th className="border px-4 py-2">Deskripsi</th>
            <th className="border px-4 py-2">Harga</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{room.id}</td>
              <td className="border px-4 py-2">{room.name}</td>
              <td className="border px-4 py-2">{room.fasilitas}</td>
              <td className="border px-4 py-2">{room.deskripsi}</td>
              <td className="border px-4 py-2">Rp {room.price.toLocaleString()}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => alert(`Edit belum diimplementasikan untuk ID ${room.id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(room.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rooms.length === 0 && (
        <p className="text-center mt-4 text-gray-500">Belum ada data kamar.</p>
      )}
    </div>
  );
}
