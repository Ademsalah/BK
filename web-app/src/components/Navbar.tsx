"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = (id) => {
    if (pathname === "/home") {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      router.push(`/home#${id}`);
    }
  };

  const navItems = [
    { name: "Accueil", path: "/home" },
    { name: "Evenements", path: "/events" },
    { name: "À Propos De Nous", action: () => handleScroll("about") },
    { name: "Contactez-Nous", action: () => handleScroll("contact") },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between">
      {/* LOGO */}
      <div
        onClick={() => router.push("/home")}
        className="text-[#ff2d20] font-bold text-xl cursor-pointer"
      >
        BK<span className="text-sm ml-1">Event & Loisirs</span>
      </div>

      {/* LINKS */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        {navItems.map((item, index) => (
          <p
            key={index}
            onClick={() =>
              item.action ? item.action() : router.push(item.path)
            }
            className="cursor-pointer text-[#07173b] hover:text-orange-400 transition"
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
