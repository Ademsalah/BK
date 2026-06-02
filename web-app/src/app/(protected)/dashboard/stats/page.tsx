"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Page() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events");

        const data = res.data;

        const eventsArray = Array.isArray(data)
          ? data
          : data?.events || data?.data || [];

        setEvents(eventsArray);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ---------------- STATS ----------------
  const enriched = events.map((e) => {
    const revenue = (e.bookedTickets || 0) * (e.ticketPrice || 0);
    const profit = revenue - (e.totalBudget || 0);
    const status = profit >= 0 ? "GAGNÉ" : "PERDU";

    return { ...e, revenue, profit, status };
  });

  const totalRevenue = enriched.reduce((a, b) => a + b.revenue, 0);
  const totalProfit = enriched.reduce((a, b) => a + b.profit, 0);

  const winCount = enriched.filter((e) => e.status === "GAGNÉ").length;

  const winRate = enriched.length
    ? Math.round((winCount / enriched.length) * 100)
    : 0;

  const bestEvent = enriched.reduce(
    (max, e) => (e.profit > (max?.profit || -Infinity) ? e : max),
    null,
  );

  const worstEvent = enriched.reduce(
    (min, e) => (e.profit < (min?.profit || Infinity) ? e : min),
    null,
  );

  const pieData = [
    { name: "GAGNÉ", value: winCount },
    { name: "PERDU", value: enriched.length - winCount },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  if (loading) {
    return (
      <div className="ml-56 flex h-screen items-center justify-center">
        <p className="text-gray-600">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Tableau de bord analytique
        </h1>
        <p className="text-gray-700">
          Vue d’ensemble de la performance de vos événements
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <Card title="Revenu total" value={`${totalRevenue} TND`} color="blue" />
        <Card title="Profit total" value={`${totalProfit} TND`} color="green" />
        <Card title="Taux de réussite" value={`${winRate}%`} color="purple" />
        <Card title="Événements" value={enriched.length} color="gray" />
      </div>

      {/* BEST / WORST */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <MiniCard
          title="🏆 Meilleur événement"
          name={bestEvent?.title || "N/A"}
          value={`${bestEvent?.profit || 0} TND`}
          color="green"
        />

        <MiniCard
          title="⚠️ Pire événement"
          name={worstEvent?.title || "N/A"}
          value={`${worstEvent?.profit || 0} TND`}
          color="red"
        />
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-bold text-gray-900 mb-4">
          📊 Répartition Gagné / Perdu
        </h2>

        <div className="flex justify-center">
          <PieChart width={320} height={320}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* EVENTS TABLE */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold text-gray-900 mb-4">
          📋 Détails des événements
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enriched.map((e) => (
            <div
              key={e.id}
              className="border rounded-xl p-4 hover:shadow transition"
            >
              <h3 className="font-bold text-gray-900">{e.title}</h3>

              <p className="text-sm text-gray-700">
                🎟 {e.bookedTickets} billets
              </p>

              <p className="text-sm text-gray-800">
                💰 Revenus: {e.revenue} TND
              </p>

              <p className="text-sm text-gray-800">
                🏗 Budget: {e.totalBudget} TND
              </p>

              <p
                className={`font-bold mt-2 ${
                  e.status === "GAGNÉ" ? "text-green-700" : "text-red-700"
                }`}
              >
                {e.status}
              </p>

              <p className="text-sm font-semibold text-gray-900">
                Profit: {e.profit} TND
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- UI COMPONENTS ----------------
function Card({ title, value, color }: any) {
  const colors: any = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    gray: "text-gray-800",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-700">{title}</p>
      <p className={`text-2xl font-bold text-gray-900 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function MiniCard({ title, name, value, color }: any) {
  const colors: any = {
    green: "text-green-700",
    red: "text-red-700",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-700">{title}</p>
      <p className="font-bold text-gray-900">{name}</p>
      <p className={`font-semibold ${colors[color]}`}>{value}</p>
    </div>
  );
}
