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

  // 📥 FETCH (backend fully responsible)
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

  // initial load
  useEffect(() => {
    fetchParticipants(1, "");
  }, []);

  // 🔍 SEARCH (reset page)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchParticipants(1, search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // 🚫 BAN / UNBAN (SYNC WITH BACKEND)
  const toggleBan = async (id: number) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/participants/participants/${id}/ban`,
      );

      // update from backend response (IMPORTANT FIX)
      setParticipants((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  // 👤 initials
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // 🔥 FILTER (frontend only display logic)
  const filteredParticipants = useMemo(() => {
    if (filter === "active") return participants.filter((p) => !p.banned);
    if (filter === "banned") return participants.filter((p) => p.banned);
    return participants;
  }, [participants, filter]);

  // 📊 STATS (based on backend data)
  const stats = useMemo(() => {
    const total = participants.length;
    const banned = participants.filter((p) => p.banned).length;
    const active = total - banned;

    return { total, banned, active };
  }, [participants]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-black mb-4">Participants</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl text-white bg-[#2a1845]">
          <p className="text-sm text-gray-300">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="p-4 rounded-xl text-white bg-[#2a1845]">
          <p className="text-sm text-gray-300">Actifs</p>
          <p className="text-2xl font-bold text-green-400">{stats.active}</p>
        </div>

        <div className="p-4 rounded-xl text-white bg-[#2a1845]">
          <p className="text-sm text-gray-300">Bannis</p>
          <p className="text-2xl font-bold text-red-400">{stats.banned}</p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md bg-[#2a1845] text-white placeholder-gray-300 border border-white/10 focus:border-red-500 outline-none"
        />

        <div className="flex gap-2">
          {(["all", "active", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md transition border border-white/10 ${
                filter === f
                  ? "bg-red-600 text-white"
                  : "bg-[#2a1845] text-white hover:bg-[#3a235f]"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParticipants.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 border border-white/10 shadow-lg"
            style={{ backgroundColor: "#2a1845" }}
          >
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                {getInitials(p.name)}
              </div>

              <div>
                <h2 className="text-white font-semibold">{p.name}</h2>
                <p className="text-gray-400 text-sm">{p.email}</p>
              </div>
            </div>

            {/* STATUS */}
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

            {/* ACTION */}
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

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => fetchParticipants(page - 1, search)}
            className="px-4 py-2 rounded-md text-white bg-[#2a1845] hover:bg-[#3a235f] disabled:opacity-40 transition"
          >
            Prev
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => fetchParticipants(pageNumber, search)}
                className={`px-4 py-2 rounded-md border border-white/10 transition ${
                  isActive
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "bg-[#2a1845] text-white hover:bg-[#3a235f]"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={page === pagination.totalPages}
            onClick={() => fetchParticipants(page + 1, search)}
            className="px-4 py-2 rounded-md text-white bg-[#2a1845] hover:bg-[#3a235f] disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
