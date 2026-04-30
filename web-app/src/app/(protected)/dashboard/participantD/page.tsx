"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function ParticipantD() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");

  const fetchParticipants = async (pageNumber = 1, searchValue = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/participants/participants?page=${pageNumber}&limit=12&search=${searchValue}`,
      );

      setParticipants(res.data.data);
      setPagination(res.data.pagination);
      setPage(res.data.pagination.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(1, "");
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchParticipants(1, search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const toggleBan = async (id: number) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/participants/participants/${id}/ban`,
      );

      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? res.data : p)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const filteredParticipants = useMemo(() => {
    if (filter === "active") return participants.filter((p) => !p.banned);
    if (filter === "banned") return participants.filter((p) => p.banned);
    return participants;
  }, [participants, filter]);

  const stats = useMemo(() => {
    const total = participants.length;
    const banned = participants.filter((p) => p.banned).length;
    const active = total - banned;

    return { total, banned, active };
  }, [participants]);

  if (loading) {
    return <p className="p-8 text-gray-400 animate-pulse">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Participants
        </h1>
      </div>

    

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white border border-gray-400 text-gray-900 placeholder-gray-300 outline-none"
        />

        <div className="flex gap-2">
          {(["all", "active", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === f
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-white hover:bg-red-600"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

       <div className="flex gap-2 flex-wrap mb-8">
  <div className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm flex items-center gap-2">
    <span>Total</span>
    <span className="font-bold">{stats.total}</span>
  </div>

  <div className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm flex items-center gap-2">
    <span>Actifs</span>
    <span className="font-bold text-green-400">{stats.active}</span>
  </div>

  <div className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm flex items-center gap-2">
    <span>Bannis</span>
    <span className="font-bold text-red-400">{stats.banned}</span>
  </div>
</div>
      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredParticipants.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials(p.name)}
              </div>

              <div>
                <h2 className="text-white font-semibold">{p.name}</h2>
                <p className="text-gray-300 text-sm">{p.email}</p>
              </div>
            </div>

            <div className="mt-4">
              {p.banned ? (
                <span className="text-red-400">BANNI</span>
              ) : (
                <span className="text-green-400">ACTIF</span>
              )}
            </div>

            <div className="mt-5">
              <button
                onClick={() => toggleBan(p.id)}
                className={`px-4 py-2 rounded-full text-white transition ${
                  p.banned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {p.banned ? "Débannir" : "Bannir"}
              </button>
            </div>

            {/* accent line like EventsD */}
            <div className="mt-6 h-1 w-0 bg-red-500 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* PAGINATION (kept logic, only UI restyled) */}
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => fetchParticipants(page - 1, search)}
            className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 transition"
          >
            ←
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => fetchParticipants(pageNumber, search)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  isActive
                    ? "bg-red-600 text-white scale-110"
                    : "bg-gray-900 text-white hover:bg-red-600"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={page === pagination.totalPages}
            onClick={() => fetchParticipants(page + 1, search)}
            className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}