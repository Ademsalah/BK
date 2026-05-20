"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Role = "admin" | "prestataire";

type MenuItem = {
  name: string;
  path: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  // Get role safely from localStorage
  const storedRole = localStorage.getItem("role");

  const role: Role =
    storedRole === "ADMIN" || storedRole === "PRESTATAIRE"
      ? storedRole
      : "ADMIN";

  // Sidebar items by role
  const menuByRole: Record<Role, MenuItem[]> = {
    ADMIN: [
      { name: "Événements", path: "/dashboard/eventsD" },
      { name: "Prestataires", path: "/dashboard/prestataireD" },
      { name: "Participants", path: "/dashboard/participantD" },
    ],

    PRESTATAIRE: [
      { name: "Mes événements", path: "/dashboard/myEvents" },
      { name: "Mon profil", path: "/dashboard/profile" },
    ],
  };

  const menuItems = menuByRole[role];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/home");
  };

  return (
    <>
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 p-5 text-white">
        {/* Logo */}
        <h1 className="mb-8 text-2xl font-bold text-red-600">Dashboard</h1>

        {/* Menu */}
        <nav className="flex flex-1 flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`rounded-md px-4 py-2 font-medium transition ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-auto rounded-md bg-red-700 px-4 py-2 font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[320px] rounded-xl bg-white p-6 text-center shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Are you sure?
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              You will be logged out of your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-md bg-gray-200 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 rounded-md bg-red-600 py-2 text-white hover:bg-red-700"
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
