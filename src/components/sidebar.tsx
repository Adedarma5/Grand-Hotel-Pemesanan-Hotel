"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
          Home
        </Link>
        <Link href="/dashboard/rooms" className="block p-2 rounded hover:bg-gray-700">
          Kamar
        </Link>
        <Link href="/dashboard/users" className="block p-2 rounded hover:bg-gray-700">
          Users
        </Link>
      </nav>
    </div>
  );
}
