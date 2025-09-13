"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "🏊‍♂️",
      title: "Kolam Renang Infinity",
      description: "Nikmati pemandangan spektakuler dari kolam renang infinity kami yang menghadap ke laut"
    },
    {
      icon: "🍽️",
      title: "Fine Dining Restaurant",
      description: "Cicipi hidangan internasional dan lokal terbaik dari chef berpengalaman kami"
    },
    {
      icon: "💆‍♀️",
      title: "Spa & Wellness",
      description: "Manjakan diri Anda dengan treatment spa premium dan fasilitas wellness lengkap"
    },
    {
      icon: "🏋️‍♂️",
      title: "Fitness Center",
      description: "Gym modern dengan peralatan terkini dan instruktur profesional"
    },
    {
      icon: "🚗",
      title: "Valet Parking",
      description: "Layanan parkir valet 24 jam untuk kenyamanan maksimal tamu"
    },
    {
      icon: "📶",
      title: "WiFi High Speed",
      description: "Koneksi internet cepat dan stabil di seluruh area hotel"
    }
  ];

  const rooms = [
    {
      name: "Deluxe Ocean View",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "Rp 1.500.000",
      features: ["Ocean View", "King Bed", "45m²", "Balcony"]
    },
    {
      name: "Executive Suite",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "Rp 2.800.000",
      features: ["Living Room", "Kitchen", "75m²", "City View"]
    },
    {
      name: "Presidential Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "Rp 5.500.000",
      features: ["Private Pool", "Butler Service", "150m²", "Panoramic View"]
    }
  ];

  return (
    <div className="bg-white">
      <section className="h-screen">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                Grand Hotel
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light">
              Pengalaman Menginap Premium di Jantung Kota
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-1">
                Pesan Sekarang
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                Jelajahi Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-amber-400' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Selamat Datang di <span className="text-amber-600">Grand Hotel</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Terletak di pusat kota dengan arsitektur mewah dan layanan bintang lima, Grand Hotel menawarkan 
            pengalaman menginap yang tak terlupakan. Setiap detail dirancang untuk memberikan kenyamanan 
            dan kemewahan terbaik bagi para tamu.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fasilitas Premium</h2>
            <p className="text-lg text-gray-600">Nikmati berbagai fasilitas kelas dunia untuk pengalaman menginap yang sempurna</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kamar & Suite</h2>
            <p className="text-lg text-gray-600">Pilih akomodasi yang sesuai dengan kebutuhan Anda</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-4">{room.price}<span className="text-sm text-gray-500">/malam</span></p>
                  <div className="space-y-2 mb-6">
                    {room.features.map((feature, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-1">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5">
                    Pesan Kamar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Siap untuk Pengalaman Tak Terlupakan?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Pesan sekarang dan dapatkan penawaran spesial untuk menginap di Grand Hotel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-1">
              Pesan Sekarang
            </button>
            <button className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
              Lihat Penawaran
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Tamu Puas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">150</div>
              <div className="text-gray-600">Kamar Mewah</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-gray-600">Layanan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">5⭐</div>
              <div className="text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}