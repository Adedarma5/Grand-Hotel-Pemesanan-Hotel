"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import TrafficChart from "./components/TrafficChart";


interface Stats {
  users: number;
  rooms: number;
  bookings: number;
  completed: number;
}

export default function DashboardPage() {
  const [username, setUsername] = useState("User");
  const [stats, setStats] = useState<Stats>({
    users: 0,
    rooms: 0,
    bookings: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Gagal fetch data");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchData();

    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      setUsername("Admin");
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang, {username}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Berikut ringkasan aktivitas hotel hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total User"
          value={stats.users}
          icon={<UserIcon className="w-8 h-8 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Jumlah Kamar"
          value={stats.rooms}
          icon={<BuildingOfficeIcon className="w-8 h-8 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Booking"
          value={stats.bookings}
          icon={<ClipboardDocumentListIcon className="w-8 h-8 text-yellow-600" />}
          color="bg-yellow-100"
        />
        <StatCard
          title="Pesanan Selesai"
          value={stats.completed}
          icon={<CheckCircleIcon className="w-8 h-8 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>
      <TrafficChart />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all">
      <div
        className={`p-4 rounded-lg ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
