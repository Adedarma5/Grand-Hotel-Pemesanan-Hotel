"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

type Booking = {
  id: number;
  roomName: string;
  fullName: string;
  checkIn: string;
  checkOut: string;
  email: string;
  phone: string;
  status: string;
  note?: string;
  price: string;
};

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data.filter((b: Booking) => b.status !== "checkout"));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      Swal.fire("Berhasil!", `Status diperbarui menjadi ${status}`, "success");
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui status", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus booking ini?")) return;
    await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
    fetchBookings();
  };

  const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

  const filteredBookings = bookings.filter(
    (b) =>
      b.roomName.toLowerCase().includes(search.toLowerCase()) ||
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>;
      case "checkin":
        return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Check-in</span>;
      case "checkout":
        return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">Check-out</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Daftar Booking</h1>
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Cari booking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-64 focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Nama Tamu</th>
              <th className="px-4 py-2 text-left">Nama Kamar</th>
              <th className="px-4 py-2 text-left">Check-in</th>
              <th className="px-4 py-2 text-left">Check-out</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Harga</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((b, index) => (
              <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-4 py-2">{b.fullName}</td>
                <td className="px-4 py-2">{b.roomName}</td>
                <td className="px-4 py-2">{formatDate(b.checkIn)}</td>
                <td className="px-4 py-2">{formatDate(b.checkOut)}</td>
                <td className="px-4 py-2">{statusBadge(b.status)}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-300 px-3 py-2 rounded-full text-sm font-semibold">
                    {b.price
                      ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(b.price))
                      : "Rp 0"}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    title="Detail"
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <EyeIcon className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    title="Hapus"
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-y-auto max-h-[90vh] p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedBooking.roomName}</h2>
            <p><strong>Tamu:</strong> {selectedBooking.fullName}</p>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Telepon:</strong> {selectedBooking.phone}</p>
            <p><strong>Check-in:</strong> {formatDate(selectedBooking.checkIn)}</p>
            <p><strong>Check-out:</strong> {formatDate(selectedBooking.checkOut)}</p>
            <p><strong>Status:</strong> {statusBadge(selectedBooking.status)}</p>
            <p><strong>Harga:</strong> {selectedBooking.price
              ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(selectedBooking.price))
              : "Rp 0"}</p>
            {selectedBooking.note && <p><strong>Catatan:</strong> {selectedBooking.note}</p>}

            <div className="mt-6 flex gap-3">
              {selectedBooking.status === "pending" && (
                <button
                  onClick={() => updateStatus(selectedBooking.id, "checkin")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Konfirmasi Check-in
                </button>
              )}
              {selectedBooking.status === "checkin" && (
                <button
                  onClick={() => updateStatus(selectedBooking.id, "checkout")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Check-out
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
