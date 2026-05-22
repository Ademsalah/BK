"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ✅ SAFE login check (NO useEffect, NO setState)
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleScroll = (id: string) => {
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
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    setOpen(false);
    router.replace("/home");
  };

  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between relative">
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

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 relative">
        {/* <Search size={20} className="text-[#07173b]" /> */}

        {/* NOT LOGGED IN */}
        {!isLoggedIn ? (
          <p
            onClick={() => router.push("/login")}
            className="cursor-pointer text-sm text-[#07173b] hover:text-orange-400"
          >
            Login
          </p>
        ) : (
          <div className="relative">
            {/* Avatar */}
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer w-8 h-8 rounded-full bg-[#07173b] text-white flex items-center justify-center"
            >
              <User size={16} />
            </div>

            {/* BACKDROP */}
            {open && (
              <div className="fixed inset-0" onClick={() => setOpen(false)} />
            )}

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="py-1">
                  <p
                    onClick={() => {
                      setOpen(false);
                      router.push("/profile");
                    }}
                    className="px-4 py-2 text-sm text-[#07173b] hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </p>

                  <div className="h-px bg-gray-100" />

                  <p
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
