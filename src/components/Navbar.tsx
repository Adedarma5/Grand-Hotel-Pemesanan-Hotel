"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                Grand Hotel
              </h1>
              <p className="text-xs text-gray-300 -mt-1">Premium Experience</p>
            </div>
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link 
                  href="/" 
                  className="text-white hover:text-amber-300 transition-all duration-300 font-medium relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/kamar" 
                  className="text-white hover:text-amber-300 transition-all duration-300 font-medium relative group"
                >
                  Kamar
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white hover:text-amber-300 transition-all duration-300 font-medium relative group"
                >
                  Tentang
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-amber-300 transition-all duration-300 font-medium relative group"
                >
                  Kontak
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <Link 
              href="/booking" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Pesan Sekarang
            </Link>
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-green-500 to-green-600 mx-3 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/50 backdrop-blur-sm rounded-lg mt-2 border border-slate-700/50">
            <Link
              href="/"
              className="block px-3 py-2 text-white hover:text-amber-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/kamar"
              className="block px-3 py-2 text-white hover:text-amber-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              kamar
            </Link>
            <Link
              href="/amenities"
              className="block px-3 py-2 text-white hover:text-amber-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Fasilitas
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-white hover:text-amber-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-white hover:text-amber-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="pt-2">
              <Link
                href="/booking"
                className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-full font-semibold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Pesan Sekarang
              </Link>
              <Link
                href="/booking"
                className="block w-full text-center bg-green-500 mt-2 hover:to-amber-700 text-white px-4 py-2.5 rounded-full font-semibold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}