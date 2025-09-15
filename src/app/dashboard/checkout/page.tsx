"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
    price: number;
    payment_status: "success" | "pending";
};

export default function BookingSelesai() {
    const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchCompletedBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire("Unauthorized", "Silakan login terlebih dahulu", "warning");
                return;
            }

            const res = await fetch("/api/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            const bookingsArray: Booking[] = Array.isArray(data) ? data : data.bookings || [];

            setCompletedBookings(bookingsArray.filter(b => b.status === "checkout"));
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Gagal memuat data booking selesai", "error");
        }
    };

    useEffect(() => {
        fetchCompletedBookings();
    }, []);

    const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

    const totalPages = Math.ceil(completedBookings.length / itemsPerPage);
    const paginatedBookings = completedBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Booking Selesai</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">No</th>
                            <th className="px-4 py-2 text-left">Nama Kamar</th>
                            <th className="px-4 py-2 text-left">Tamu</th>
                            <th className="px-4 py-2 text-left">Check-in</th>
                            <th className="px-4 py-2 text-left">Check-out</th>
                            <th className="px-4 py-2 text-left">Harga</th>
                            <th className="px-4 py-2 text-left">Pembayaran</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBookings.map((b, index) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-2">{b.roomName}</td>
                                <td className="px-4 py-2">{b.fullName}</td>
                                <td className="px-4 py-2">{formatDate(b.checkIn)}</td>
                                <td className="px-4 py-2">{formatDate(b.checkOut)}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-300 px-3 py-2 rounded-full text-sm font-semibold">
                                        {b.price
                                            ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(b.price))
                                            : "Rp 0"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 ">
                                    <span className="bg-green-500  px-3 py-2 rounded-full text-sm font-semibold">{b.payment_status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                        {b.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-2 py-1">{currentPage} / {totalPages || 1}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
