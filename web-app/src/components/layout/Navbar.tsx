"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 get current route

  const navItems = [
    { name: "Accueil", path: "/home" },
    { name: "Evenements", path: "/events" },
    { name: "À Propos De Nous", path: "/about" },
    { name: "Contactez-Nous", path: "/contact" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between">
      {/* LOGO */}
      <div
        onClick={() => router.push("/")}
        className="text-[#ff2d20] font-bold text-xl cursor-pointer"
      >
        BK<span className="text-sm ml-1">Event & Loisirs</span>
      </div>

      {/* LINKS */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        {navItems.map((item) => (
          <p
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`cursor-pointer transition ${
              pathname === item.path
                ? "text-orange-500 font-semibold" // ✅ ACTIVE
                : "text-[#07173b] hover:text-orange-400"
            }`}
          >
            {item.name}
          </p>
        ))}
      </div>

      {/* SEARCH ICON */}
      <div className="text-[#07173b]">
        <Search size={20} />
      </div>
    </nav>
  );
}
