"use client";

import { useState } from "react";

type Room = {
  id: number;
  name: string;
  type: string;
  image: string;
  gallery: string[];
  price: number;
  originalPrice: number;
  size: string;
  capacity: string;
  view: string;
  bedType: string;
  features: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  available: boolean;
};

type Filters = {
  priceRange: "all" | "budget" | "mid" | "luxury";
  roomType: string;
  view: string;
};

function BookingModal({
  room,
  onClose,
}: {
  room: Room;
  onClose: () => void;
}) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Pesan Kamar</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="text-xl font-bold mb-2">{room.name}</h4>
            <p className="text-2xl font-bold text-amber-600">
              {formatPrice(room.price)}
              <span className="text-sm text-gray-500">/malam</span>
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  defaultValue={new Date(
                    Date.now() + 86400000
                  ).toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  defaultValue={new Date(
                    Date.now() + 172800000
                  ).toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Tamu
              </label>
              <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option>1 Dewasa</option>
                <option>2 Dewasa</option>
                <option>2 Dewasa + 1 Anak</option>
                <option>2 Dewasa + 2 Anak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <input
                type="tel"
                placeholder="+62 xxx-xxxx-xxxx"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permintaan Khusus (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan permintaan khusus Anda..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1 malam × {formatPrice(room.price)}</span>
                <span>{formatPrice(room.price)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Pajak & Biaya Layanan</span>
                <span>{formatPrice(room.price * 0.21)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(room.price * 1.21)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Konfirmasi Pemesanan
            </button>
          </form>
        </div>
      </div>c
    </div>
  );
}

export default function kamar() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<Filters>({
    priceRange: "all",
    roomType: "all",
    view: "all",
  });

  const rooms: Room[] = [
    {
      id: 1,
      name: "Standard Room",
      type: "standard",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
      gallery: [],
      price: 850000,
      originalPrice: 1000000,
      size: "35m²",
      capacity: "2 Dewasa",
      view: "city",
      bedType: "Queen Bed",
      features: ["AC", "WiFi", "TV", "Mini Bar"],
      amenities: ["Handuk", "Toiletries"],
      rating: 4.5,
      reviews: 124,
      available: true,
    },

  ];

  const filteredRooms = rooms.filter((room) => {
    if (filters.priceRange === "budget" && room.price > 1500000) return false;
    if (
      filters.priceRange === "mid" &&
      (room.price < 1500000 || room.price > 3000000)
    )
      return false;
    if (filters.priceRange === "luxury" && room.price < 3000000) return false;
    if (filters.roomType !== "all" && room.type !== filters.roomType)
      return false;
    if (filters.view !== "all" && room.view !== filters.view) return false;
    return true;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pilih Kamar</h1>
        <p className="text-xl text-gray-300">
          Temukan akomodasi terbaik untuk Anda
        </p>
      </section>


      <section className="py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 px-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold">{room.name}</h3>
                <p className="text-amber-600 text-xl font-bold">
                  {formatPrice(room.price)}
                </p>
                <button
                  onClick={() => setSelectedRoom(room)}
                  className="mt-4 w-full bg-amber-600 text-white py-2 rounded-lg"
                >
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedRoom && (
        <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}
