"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrestataireD() {
  const router = useRouter();

  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 GET ALL PRESTATAIRES (NO TOKEN)
  const fetchPrestataires = async () => {
    try {
      const res = await axios.get("http://localhost:5000/prestataires");

      console.log(res.data);
      setPrestataires(res.data);
    } catch (err) {
      console.error("Error loading prestataires:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  // 🗑 DELETE (NO TOKEN)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this prestataire?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/prestataires/${id}`);

      setPrestataires((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleUpdate = (id) => {
    router.push(`/dashboard/prestataireD/create/${id}`);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Prestataires</h1>

        <button
          onClick={() => router.push("/dashboard/prestataireD/create")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          + Créer un prestataire
        </button>
      </div>

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
                <h2 className="text-white font-semibold text-lg">{p.name}</h2>

                <p className="text-gray-400 text-sm">📍 {p.location}</p>
              </div>
            </div>

            {/* Skill */}
            <div className="mt-4">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                🛠️ {p.category}
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
