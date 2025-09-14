"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ className = "" }: { className?: string }) {
  const [isPesananOpen, setPesananOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const togglePesanan = () => setPesananOpen(!isPesananOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Logout Berhasil!",
          text: "Anda akan diarahkan ke halaman login.",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Logout Gagal",
          text: "Silakan coba lagi.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Tidak dapat logout.",
      });
    }
  };

  const MenuItem = ({ href, icon: Icon, children }: any) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-500/20 text-gray-300 hover:text-white"
          }`}
      >
        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
        <span className="font-medium">{children}</span>
        {active && <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />}
      </Link>
    );
  };

  const SubMenuItem = ({ href, icon: Icon, children }: any) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg transition-all duration-200 group ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-blue-500/20 hover:text-white"
          }`}
      >
        <Icon className={`w-4 h-4 ${active ? "text-white" : "group-hover:text-blue-400"}`} />
        <span className="text-sm">{children}</span>
      </Link>
    );
  };

  const DropdownButton = ({ icon: Icon, children, isOpen, onClick }: any) => (
    <button
      onClick={onClick}
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="true"
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group text-gray-300 hover:text-white"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        <span className="font-medium">{children}</span>
      </div>
      {isOpen ? (
        <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
      ) : (
        <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
      )}
    </button>
  );

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-gray-900/90 text-white hover:bg-gray-800 transition-all duration-200"
      >
        {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={closeMobileMenu} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-64 
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
          text-white flex flex-col shadow-2xl lg:shadow-xl
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-white">Grand Hotel</h1>
              <p className="text-xs text-gray-400">Management Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <MenuItem href="/dashboard" icon={HomeIcon}>Dashboard</MenuItem>
          <MenuItem href="/dashboard/rooms" icon={BuildingOfficeIcon}>Kamar</MenuItem>

          <div className="space-y-1">
            <DropdownButton
              icon={ClipboardDocumentListIcon}
              isOpen={isPesananOpen}
              onClick={togglePesanan}
            >
              Pesanan
            </DropdownButton>

            <div className={`overflow-hidden transition-all duration-300 ${isPesananOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-1 py-1">
                <SubMenuItem href="/dashboard/book" icon={BookOpenIcon}>Book</SubMenuItem>
                <SubMenuItem href="/dashboard/checkout" icon={CheckCircleIcon}>Selesai</SubMenuItem>
              </div>
            </div>
          </div>

          <MenuItem href="/dashboard/reports" icon={DocumentTextIcon}>Laporan</MenuItem>
          <MenuItem href="/dashboard/users" icon={UserIcon}>User</MenuItem>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-blue-600 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
