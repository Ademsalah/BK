"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { name: "Événements", path: "/dashboard/eventsD" },
    { name: "Prestataires", path: "/dashboard/prestataireD" },
    { name: "Participants", path: "/dashboard/participantD" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/home");
  };

  return (
    <>
      <aside className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 p-5 flex flex-col">
        {/* Logo */}
        <h1 className="text-2xl font-bold mb-8 text-red-600">Dashboard</h1>

        {/* Menu */}
        <nav className="flex flex-col gap-3 flex-1">
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

        {/* Logout Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-auto px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 transition font-medium text-white"
        >
          Logout
        </button>
      </aside>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure?
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              You will be logged out of your account.
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
