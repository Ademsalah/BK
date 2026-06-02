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
      {/* RESULTS */}
<div className="grid md:grid-cols-2 gap-5">
  {results.map((t, i) => (
    <div
      key={i}
      className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">
          Team #{i + 1}
        </h3>

        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          {Math.round(t.score)}% Match
        </span>
      </div>

      {/* Budget */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Budget total</p>
        <p className="font-bold text-lg text-red-600">
          {t.totalPrice} TND
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {Object.entries(
          t.team.reduce((acc: any, p: any) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
          }, {})
        ).map(([category, items]: any) => (
          <div key={category}>
            <p className="text-xs uppercase text-gray-400 mb-2">
              {category}
            </p>

            <div className="flex flex-wrap gap-2">
              {items.map((p: any) => (
                <span
                  key={p.id}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs"
                >
                  {p.User?.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button
        onClick={() => {
          setSelectedTeam(i);
          assignTeam(t.team);
        }}
        className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium"
      >
        Select Team
      </button>
    </div>
  ))}
</div>
    </div>
  </div>
);
}
