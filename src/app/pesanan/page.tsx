"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Booking {
    id: number; 
    roomName: string;
    checkIn: string;
    checkOut: string;
    price: number;
    status: string;
    payment_status: "success" | "pending";
    fullName: string;
    email: string;
    phone: string;
    note: string;
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function PesananPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
        script.async = true;
        document.body.appendChild(script);

        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire({
                        title: "Harus login dulu",
                        text: "Silakan login untuk melihat pesanan.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    }).then(() => {
                        window.location.href = "/login";
                    });
                    return;
                }

                const res = await fetch("/api/bookings", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (res.ok) setBookings(data);
                else setBookings([]);
            } catch (err) {
                console.error(err);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handlePay = async (booking: Booking) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/payment-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: booking.id,      
                    grossAmount: booking.price,
                    fullName: booking.fullName,
                    email: booking.email,
                    phone: booking.phone,
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                    roomName: booking.roomName,
                }),
            });

            const data = await res.json();
            if (!data.token) {
                Swal.fire("Gagal generate token", "", "error");
                return;
            }

            window.snap.pay(data.token, {
                onSuccess: async function () {
                    try {
                        await fetch("/api/update_payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: booking.id }), 
                        });

                        Swal.fire("Pembayaran Berhasil!", "", "success").then(() => {
                            window.location.reload();
                        });
                    } catch (err) {
                        console.error(err);
                        Swal.fire("Error update status", "Silakan coba lagi.", "error");
                    }
                },
                onPending: function () {
                    Swal.fire("Pembayaran Tertunda", "", "info");
                },
                onError: function () {
                    Swal.fire("Pembayaran Gagal", "", "error");
                },
                onClose: function () {
                    Swal.fire("Anda menutup popup pembayaran", "", "warning");
                },
            });
        } catch (err) {
            console.error(err);
            Swal.fire("Kesalahan jaringan", "Silakan coba lagi.", "error");
        }
    };


    if (loading) return <div className="p-6 text-center">Memuat pesanan...</div>;

    if (bookings.length === 0)
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-3xl font-bold text-center text-gray-700 px-4">
                    Belum ada pesanan. <br />
                    Silahkan Login Terlebih dahulu Untuk Melihat Pesanan Anda
                </h1>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((b) => (
                    <div
                        key={b.id}
                        className="p-4 rounded-lg shadow-md bg-white border border-gray-200 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{b.roomName}</h2>
                            <p className="text-sm text-gray-600">
                                {new Date(b.checkIn).toLocaleDateString("id-ID")} →{" "}
                                {new Date(b.checkOut).toLocaleDateString("id-ID")}
                            </p>
                            <p className="mt-1 font-semibold">
                                Total: Rp {b.price.toLocaleString("id-ID")}
                            </p>

                            <p
                                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${b.status === "success"
                                        ? "bg-green-100 text-green-700"
                                        : b.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                Status: {b.status}
                            </p>

                            <p
                                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${b.payment_status === "success"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                Pembayaran: {b.payment_status}
                            </p>

                            <div className="mt-3 text-sm text-gray-600">
                                <p>Nama Pemesan: {b.fullName}</p>
                                <p>Email: {b.email}</p>
                                <p>Telp: {b.phone}</p>
                                {b.note && <p>Catatan: {b.note}</p>}
                            </div>
                        </div>

                        {b.payment_status === "pending" && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handlePay(b)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
