"use client";

import axios from "axios";
import { useAtom } from "jotai";
import { useState } from "react";
import { eventAtom } from "@/atoms/EventAtom";

const CATEGORIES = [
  { value: "TRAITEUR", label: "🍽️ Traiteur" },
  { value: "MUSICIEN", label: "🎧 Musicien" },
  { value: "SALLE", label: "🏛️ Salle" },
  { value: "DECORATION", label: "🎨 Decoration" },
];

export default function EventStep2() {
  const [event] = useAtom(eventAtom);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  const handleRecommend = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/recommend",
        {
          budget: event.totalBudget,
          categories,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Build Your Dream Event Team ✨
          </h1>
          <p className="text-gray-500 mt-1">
            AI will recommend the best matching providers for your event
          </p>
        </div>

        {/* EVENT SUMMARY CARD */}
        <div className="bg-white border shadow-sm rounded-2xl p-5 flex justify-between">
          <div>
            <p className="text-gray-600">📍 {event.location}</p>
            <p className="text-gray-600">💰 Budget: {event.totalBudget} TND</p>
          </div>

          <div className="text-right text-sm text-gray-400">
            Select categories below 👇
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => {
            const active = categories.includes(cat.value);

            return (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`px-4 py-2 rounded-full border transition-all text-sm font-medium
                ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* CTA BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleRecommend}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "AI is analyzing..." : "Find Best Teams 🚀"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="grid gap-5">
          {results.map((t, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  Team Recommendation #{i + 1}
                </h3>

                <span className="text-indigo-600 font-bold text-sm">
                  {Math.round(t.score)}% match
                </span>
              </div>

              {/* SCORE BAR */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${t.score}%` }}
                />
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  🏛️ Salle: <b>{t.team.salle?.name}</b>
                </p>
                <p>
                  🍽️ Traiteur: <b>{t.team.traiteur?.name}</b>
                </p>
                <p>
                  🎧 Musicien: <b>{t.team.musicien?.name}</b>
                </p>
                <p>
                  🎨 Decoration: <b>{t.team.decoration?.name}</b>
                </p>
              </div>

              <p className="text-right text-gray-500 mt-3 text-sm">
                Total: {t.totalPrice} TND
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
