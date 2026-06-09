"use client";

import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { eventAtom } from "@/atoms/EventAtom";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { NotebookPen, ShieldAlert } from "lucide-react";

const CATEGORIES = [
  { value: "TRAITEUR", label: "🍽️ Traiteur" },
  { value: "Audiovisuel", label: "🎤 Audiovisuel" },
  { value: "Photo/Vidéo", label: "📸 Photo/Vidéo" },
  { value: "Animation", label: "🎭 Animation" },
  { value: "Impression", label: "🖨️ Impression" },
  { value: "Marketing digital", label: "📱 Marketing digital" },
  { value: "Transport", label: "🚌 Transport" },
  { value: "SALLE", label: "🏛️ Salle" },
  { value: "Sécurité", label: "🛡️ Sécurité" },
  {
    value: "Prestataires spécialisés",
    label: "🧰 Prestataires spécialisés",
  },
  { value: "DECORATION", label: "🎨 Décoration" },
];
export default function EventStep2() {
  const router = useRouter();
  const [event] = useAtom(eventAtom);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [categories, setCategories] = useState<Record<string, number>>({});
  const [nores, setNores] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budget, setBudget] = useState(event.totalBudget);

  

  const handleSaveBudget = async () => {
    try {
      await axios.patch(`http://localhost:3000/events/${event.id}`, {
        budget,
      });

      toast.success("Budget updated successfully ✅");
      setIsEditingBudget(false);

      // optional: update UI instantly
      event.totalBudget = budget;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update budget ❌");
    }
  };

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
      if (res.data.length === 0) {
        setNores(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignTeam = async (team: any[]) => {
    console.log("TEAM:", team);
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

            <div className="flex flex-row items-center">
              <p className="text-gray-300">💰 Budget :</p>

              {isEditingBudget ? (
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="ml-2 w-28 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white outline-none"
                />
              ) : (
                <span className="ml-2 text-gray-300">{budget} TND</span>
              )}

              {isEditingBudget ? (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleSaveBudget}
                    className="bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-xs"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setBudget(event.totalBudget);
                      setIsEditingBudget(false);
                    }}
                    className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="flex items-center gap-2 ml-6 bg-white/10 hover:bg-white/20 transition-all duration-200 px-3 py-1.5 rounded-xl border border-white/10"
                >
                  <NotebookPen color="white" size={15} />
                  <span className="text-white text-xs font-medium">
                    Modifier
                  </span>
                </button>
              )}
            </div>
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

                  <span className="w-6 text-center font-semibold">{count}</span>

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
            {loading
              ? "Analyse en cours..."
              : "Trouver les meilleures équipes 🚀"}
          </button>
        </div>

        {nores && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-gray-50  border border-gray-200 rounded-3xl p-10 shadow-slate-400 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl">
                  <ShieldAlert color="red" size={35} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune équipe trouvée
              </h2>

              {/* Description */}
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Nous n’avons trouvé aucun groupe de prestataires correspondant à
                votre budget et aux catégories sélectionnées.
              </p>

              {/* Suggestions */}
              <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 text-left">
                <p className="font-semibold text-gray-800 mb-3">
                  Suggestions :
                </p>

                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Augmentez légèrement votre budget</li>
                  <li>• Réduisez le nombre de prestataires demandés</li>
                  <li>• Essayez d’autres catégories</li>
                </ul>
              </div>

              {/* Action */}
              <button
                onClick={() => setNores(false)}
                className="mt-7 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Modifier ma recherche
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
      {results.length > 0 && (  <div className="grid md:grid-cols-2 gap-5">
          {results.map((t, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Team #{i + 1}</h3>

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
                  }, {}),
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
      )}
      </div>
    </div>
  );
}
