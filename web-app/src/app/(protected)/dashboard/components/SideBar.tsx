"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Événements", path: "/dashboard/eventsD" },
    { name: "Prestataires", path: "/dashboard/prestataireD" },
    { name: "Participants", path: "/dashboard/participantD" },
  ];

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 p-5">

      {/* Logo */}
      <h1 className="text-2xl font-bold mb-8 text-red-600">
        Dashboard
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-md transition font-medium ${
                isActive
                  ? "bg-red-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}