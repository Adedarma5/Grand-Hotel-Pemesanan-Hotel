"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrafficData {
  month: string;
  booking: number;
  completed: number;
}

export default function TrafficChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);    
  const [data, setData] = useState<TrafficData[]>([]);

  const fetchTraffic = async (selectedYear: number) => {
    try {
      const res = await fetch(`/api/dashboard/traffic?year=${selectedYear}`);
      if (!res.ok) throw new Error("Gagal fetch traffic");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetch traffic:", error);
    }
  };

  useEffect(() => {
    fetchTraffic(year);
  }, [year]);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">
          📊 Trafik Pemesanan (Booking vs Selesai)
        </h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded p-2 text-gray-700"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="booking"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Total Booking"
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={3}
            name="Pesanan Selesai"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
