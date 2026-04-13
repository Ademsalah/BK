"use client";

import { useState } from "react";

export default function PrestataireD() {
  const [prestataires, setPrestataires] = useState([
    { id: 1, name: "Ali Services", skill: "Traiteur", city: "Tunis" },
    { id: 2, name: "DJ NightPro", skill: "DJ", city: "Sousse" },
    { id: 3, name: "PhotoVision", skill: "Photographie", city: "Ariana" },
    { id: 4, name: "Decor Plus", skill: "Décoration", city: "Sfax" },
    { id: 5, name: "Sound Masters", skill: "Sonorisation", city: "Hammamet" },
    { id: 6, name: "Event Cleaners", skill: "Nettoyage", city: "Bizerte" },
  ]);

  // Supprimer prestataire
  const handleDelete = (id) => {
    setPrestataires(prestataires.filter((p) => p.id !== id));
  };

  // Modifier prestataire (simulation)
  const handleUpdate = (id) => {
    alert("Modifier prestataire : " + id);
  };

  // Initiales avatar
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
        Prestataires
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prestataires.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 shadow-lg border border-white/10 hover:scale-[1.02] transition"
            style={{ backgroundColor: "#2a1845" }}
          >

            {/* Avatar + infos */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                {getInitials(p.name)}
              </div>

              <div>
                <h2 className="text-white font-semibold text-lg">
                  {p.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  📍 {p.city}
                </p>
              </div>
            </div>

            {/* Compétence */}
            <div className="mt-4">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                🛠️ {p.skill}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => handleUpdate(p.id)}
                className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition"
              >
                Modifier
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}