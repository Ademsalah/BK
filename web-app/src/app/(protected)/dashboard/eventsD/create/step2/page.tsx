"use client";

import axios from "axios";
import { useAtom } from "jotai";
import { useState } from "react";
import { eventAtom } from "@/atoms/EventAtom";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "TRAITEUR", label: "🍽️ Traiteur" },
  { value: "MUSICIEN", label: "🎧 Musicien" },
  { value: "SALLE", label: "🏛️ Salle" },
  { value: "DECORATION", label: "🎨 Decoration" },
];

export default function EventStep2() {
  const router = useRouter();
  const [event] = useAtom(eventAtom);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ NEW: categories as object { TRAITEUR: 2, ... }
  const [categories, setCategories] = useState<Record<string, number>>({});

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ update quantity
  const updateCategoryCount = (value: string, count: number) => {
    setCategories((prev) => {
      if (count <= 0) {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      }

      return {
        ...prev,
        [value]: count,
      };
    });
  };

  const handleRecommend = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/recommend",
        {
          budget: event.totalBudget,
          categories, // ✅ correct format now
          location: event.location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignTeam = async (team: any[]) => {
    console.log("TEAM:",team);
    try {
      const res = await axios.post(
        "http://localhost:5000/event-prestataires/assign",
        {
          eventId: event.id,
          team: team.map((p) => ({
            prestataireId: p.id,
            proposedPrice: p.priceMax,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Equipe assignée avec successe");
      router.push("/dashboard/eventsD");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error assigning team");
    }
  };

 return (
  <div className="min-h-screen p-8 bg-white flex justify-center">
    <div className="w-full max-w-5xl space-y-8">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Construisez votre équipe idéale 
        </h1>
        <p className="text-gray-500 mt-2">
          L’IA vous recommande les meilleurs prestataires pour votre événement
        </p>
      </div>

      {/* EVENT SUMMARY */}
      <div className="bg-slate-700 text-white rounded-2xl p-6 shadow-lg flex justify-between">
        <div>
          <p className="text-gray-300">📍 {event.location}</p>
          <p className="text-gray-300">
            💰 Budget : {event.totalBudget} TND
          </p>
        </div>

        <div className="text-sm text-gray-300">
          Choisissez la quantité par catégorie 👇
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
          const count = categories[cat.value] || 0;

          return (
            <div
              key={cat.value}
              className="flex items-center justify-between bg-slate-700 text-white rounded-2xl p-5 shadow-lg"
            >
              <span className="font-medium">{cat.label}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCategoryCount(cat.value, count - 1)}
                  className="px-3 py-1 rounded-full bg-gray-900 hover:bg-red-600 transition"
                >
                  -
                </button>

                <span className="w-6 text-center font-semibold">
                  {count}
                </span>

                <button
                  onClick={() => updateCategoryCount(cat.value, count + 1)}
                  className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={handleRecommend}
          disabled={loading || Object.keys(categories).length === 0}
          className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Analyse en cours..." : "Trouver les meilleures équipes 🚀"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="grid gap-8">
        {results.map((t, i) => (
          <div
            key={i}
            className="group bg-slate-700 text-white rounded-2xl p-6 shadow-lg border border-white/10 hover:scale-[1.01] transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Recommandation #{i + 1}
              </h3>

              <span className="text-red-400 font-bold text-sm">
                {Math.round(t.score)}% match
              </span>
            </div>

            {/* SCORE BAR */}
            <div className="w-full h-2 bg-gray-900 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-red-600"
                style={{ width: `${t.score}%` }}
              />
            </div>

            {/* TEAM */}
            <div className="space-y-4">
              {Object.entries(
                t.team.reduce((acc: any, p: any) => {
                  if (!acc[p.category]) acc[p.category] = [];
                  acc[p.category].push(p);
                  return acc;
                }, {}),
              ).map(([category, items]: any) => (
                <div key={category} className="bg-gray-900 rounded-xl p-4">
                  <h4 className="text-red-400 font-semibold mb-3">
                    {category}
                  </h4>

                  <div className="space-y-3">
                    {items.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between bg-slate-800 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium">{p.User?.name}</p>
                          <p className="text-gray-400 text-xs">
                            📧 {p.User?.email}
                          </p>
                          <p className="text-gray-400 text-xs">
                            📍 {p.location}
                          </p>
                        </div>

                        <div className="text-right text-xs">
                          <p>💰 {p.priceMax} TND</p>
                          <p>⭐ {p.rating}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-300 text-sm">
                Total : {t.totalPrice} TND
              </p>

              <button
                onClick={() => {
                  setSelectedTeam(i);
                  assignTeam(t.team);
                }}
                className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition"
              >
                Sélectionner cette équipe ✅
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  </div>
);
}
