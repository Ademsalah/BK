"use client";

import { useState } from "react";

export default function ParticipantD() {
  const [participants, setParticipants] = useState([
    { id: 1, name: "Salah Adem", email: "salah@email.com", banned: false },
    { id: 2, name: "Amira Ben Ali", email: "amira@email.com", banned: false },
    { id: 3, name: "Youssef Trabelsi", email: "youssef@email.com", banned: true },
    { id: 4, name: "Mariem Jaziri", email: "mariem@email.com", banned: false },
    { id: 5, name: "Omar Lahmar", email: "omar@email.com", banned: false },
    { id: 6, name: "Ines Hamdi", email: "ines@email.com", banned: true },
  ]);

  // Bannir / débannir utilisateur
  const toggleBan = (id) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, banned: !p.banned } : p
      )
    );
  };

  // Initiales pour avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen p-6">

      {/* Titre */}
      <h1 className="text-3xl font-bold text-black mb-6">
        Participants
      </h1>

      {/* Liste */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 border border-white/10 shadow-lg"
            style={{ backgroundColor: "#2a1845" }}
          >

            {/* Avatar + infos */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                {getInitials(p.name)}
              </div>

              <div>
                <h2 className="text-white font-semibold">
                  {p.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {p.email}
                </p>
              </div>
            </div>

            {/* Statut */}
            <div className="mt-4">
              {p.banned ? (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  🚫 Banni
                </span>
              ) : (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  ✅ Actif
                </span>
              )}
            </div>

            {/* Action */}
            <div className="mt-5">
              <button
                onClick={() => toggleBan(p.id)}
                className={`px-4 py-2 rounded-md text-white transition ${
                  p.banned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {p.banned ? "Débannir" : "Bannir"}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}