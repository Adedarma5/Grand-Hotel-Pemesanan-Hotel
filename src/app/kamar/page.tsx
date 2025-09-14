"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Room = {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  size: string;
  capacity: string;
  view: string;
  bedType: string;
  fasilitas: string;
};

function BookingModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 172800000).toISOString().split("T")[0]);
  const [totalPrice, setTotalPrice] = useState(room.price);

  // Hitung harga otomatis
  useEffect(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    setTotalPrice(nights > 0 ? nights * room.price : room.price);
  }, [checkIn, checkOut, room.price]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      roomId: room.id,
      roomName: room.name,
      checkIn: formData.get("checkin"),
      checkOut: formData.get("checkout"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      note: formData.get("note"),
      price: totalPrice, // kirim totalPrice ke backend
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking berhasil!",
          text: `Terima kasih, kamar Anda telah dipesan.\nTotal Harga: ${formatPrice(totalPrice)}`,
          confirmButtonColor: "#f59e0b",
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking gagal",
          text: data.message || "Silakan coba lagi.",
          confirmButtonColor: "#f59e0b",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Kesalahan jaringan",
        text: "Terjadi kesalahan. Silakan coba lagi.",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoading(false);
    }
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
            <h3 className="text-2xl font-bold text-gray-900">Pesan Kamar</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none">×</button>
          </div>

          <div className="mb-6">
            <img src={room.image} alt={room.name} className="w-full h-56 object-cover rounded-xl mb-4" />
            <h4 className="text-xl font-semibold mb-1">{room.name}</h4>
            <p className="text-2xl font-bold text-amber-600">{formatPrice(room.price)} <span className="text-sm text-gray-500">/malam</span></p>
          </div>

          <form className="space-y-4" onSubmit={handleBookingSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input type="date" name="checkin" onChange={e => setCheckIn(e.target.value)}  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input type="date" name="checkout" onChange={e => setCheckOut(e.target.value)}  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
              </div>
            </div>
            <p className="text-lg font-semibold text-amber-600">Total Harga: {formatPrice(totalPrice)}</p>

            <input type="text" name="fullName" placeholder="Nama Lengkap" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
            <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
            <input type="tel" name="phone" placeholder="No. Telepon" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
            <textarea name="note" placeholder="Permintaan khusus (Opsional)" rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition flex justify-center items-center ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span> : null}
              {loading ? "Memproses..." : "Konfirmasi Pemesanan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function KamarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pilih Kamar</h1>
        <p className="text-xl text-gray-300">Temukan akomodasi terbaik untuk Anda</p>
      </section>

      <section className="py-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 md:grid-cols-2 gap-6 px-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img src={room.image} alt={room.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-2xl font-bold">{room.name}</h3>
                <p className="text-amber-600 text-xl font-bold">{formatPrice(room.price)} <span className="text-sm text-gray-500">/Malam</span></p>
                <p className="text-gray-500 text-sm mt-1">Tipe: {room.type}, Kapasitas: {room.capacity}, Ukuran: {room.size}</p>
                <button onClick={() => setSelectedRoom(room)} className="mt-4 w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition">
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedRoom && <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </div>
  );
}
