"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between">
      {/* LOGO */}
      <div className="text-[#ff2d20] font-bold text-xl">
        BK<span className="text-sm ml-1">Event & Loisirs</span>
      </div>

      {/* LINKS */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-[#07173b]">
        <Link href="/" className="text-red-500">
          Accueil
        </Link>
        <Link href="/evenements">Evenements</Link>
        <Link href="/about">À Propos De Nous</Link>
        <Link href="/contact">Contactez-Nous</Link>
        <Link href="/login">login</Link>
      </div>

      {/* SEARCH ICON */}
      <div className="text-[#07173b]">
        <Search size={20} />
      </div>
    </nav>
  );
}
