"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Room {
  id: number;
  name: string;
  fasilitas: string;
  deskripsi: string;
  price: number;
  image: string | null;
}

export default function DaftarKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setRooms(rooms.filter((room) => room.id !== id));
        Swal.fire("Berhasil!", "Data kamar berhasil dihapus.", "success");
      } else {
        Swal.fire("Gagal!", data.message || "Gagal menghapus data", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan server", "error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Memuat data kamar...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Daftar Kamar</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => router.push("/dashboard/rooms/add")}
        >
          + Tambah Kamar
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Kamar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fasilitas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Foto</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room, i) => (
              <tr key={room.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {i + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {room.fasilitas
                      ? room.fasilitas.split(",").map((f, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                        >
                          {f.trim()}
                        </span>
                      ))
                      : <span className="text-gray-400">-</span>
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.deskripsi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {room.price
                    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(room.price))
                    : "Rp 0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-20 w-28 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Tidak ada gambar</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    className="text-yellow-600 hover:text-yellow-800 px-3 py-1 border border-yellow-600 rounded-md"
                    onClick={() => router.push(`/dashboard/rooms/${room.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded-md"
                    onClick={() => handleDelete(room.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rooms.length === 0 && (
        <p className="text-center mt-6 text-gray-500 text-lg">
          Belum ada data kamar.
        </p>
      )}
    </div>
  );
}
