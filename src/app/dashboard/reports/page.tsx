"use client";

import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Booking = {
    id: number;
    roomId: number;
    roomName: string;
    fullName: string;
    price: number;
    checkOut: string;
};

export default function FinanceReport() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [monthFilter, setMonthFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const reportRef = useRef<HTMLDivElement>(null);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const fetchBookings = async () => {
        try {
            const query = new URLSearchParams();
            if (monthFilter) query.append("month", monthFilter);
            if (yearFilter) query.append("year", yearFilter);

            const res = await fetch(`/api/reports?${query.toString()}`);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Gagal fetch laporan:", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [monthFilter, yearFilter]);

    const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

    const handlePrint = () => {
        if (!reportRef.current) return;
        html2canvas(reportRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Laporan_Keuangan_${yearFilter || "All"}_${monthFilter || "All"}.pdf`);
        });
    };

    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Laporan Keuangan Checkout</h1>
            <div className="flex gap-4 mb-4">
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">Bulan (Semua)</option>
                    {monthNames.map((m, i) => (
                        <option key={i} value={i + 1}>{m}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Tahun"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-amber-500"
                />

                <button
                    onClick={handlePrint}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                    Cetak PDF
                </button>
            </div>

            <div ref={reportRef} className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">No</th>
                            <th className="px-4 py-2 text-left">Nama Tamu</th>
                            <th className="px-4 py-2 text-left">Nama Kamar</th>
                            <th className="px-4 py-2 text-left">Harga</th>
                            <th className="px-4 py-2 text-left">Check-out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((b, idx) => (
                                <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{b.fullName}</td>
                                    <td className="px-4 py-2">{b.roomName}</td>
                                    <td className="px-6 py-2">
                                        <span className="bg-green-300 px-3 py-2 rounded-full text-sm font-semibold">
                                            {b.price ? formatCurrency(b.price) : "Rp 0"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{formatDate(b.checkOut)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-4 py-2 text-center" colSpan={5}>Tidak ada data</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                        <tr>
                            <td className="px-4 py-2" colSpan={3}>Total Pendapatan</td>
                            <td className="px-6 py-2">
                                <span className="bg-green-300  px-3 py-2 rounded-full text-md font-bold">
                                    {formatCurrency(totalRevenue)}
                                </span>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
