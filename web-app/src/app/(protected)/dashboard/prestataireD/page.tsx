"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PrestataireD() {
  const router = useRouter();

  const [prestataires, setPrestataires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPrestataireId, setSelectedPrestataireId] = useState<
    number | null
  >(null);
  const fetchPrestataires = async (pageNumber = 1, searchValue = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/prestataires?page=${pageNumber}&limit=12&search=${searchValue}`,
      );

      console.log(res.data);

      setPrestataires(res.data || []);

      // SAFE PAGINATION
      if (res.data.pagination) {
        setPagination(res.data.pagination);
        setPage(res.data.pagination.currentPage || 1);
      } else {
        setPagination(null);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPrestataires(1, "");
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPrestataires(1, search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const toggleBan = async (id: number) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/prestataires/${id}/ban`,
      );

      setPrestataires((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async () => {
    if (!selectedPrestataireId) return;

    try {
      await axios.delete(
        `http://localhost:5000/prestataires/${selectedPrestataireId}`,
      );

      setPrestataires((prev) =>
        prev.filter((p) => p.id !== selectedPrestataireId),
      );

      setShowDeleteModal(false);
      setSelectedPrestataireId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  const filteredPrestataires = useMemo(() => {
    if (filter === "active") return prestataires.filter((p) => !p.banned);

    if (filter === "banned") return prestataires.filter((p) => p.banned);

    return prestataires;
  }, [prestataires, filter]);

  const stats = useMemo(() => {
    const total = prestataires.length;
    const suspendus = prestataires.filter((p) => p.banned).length;

    const active = total - suspendus;

    return {
      total,
      suspendus,
      active,
    };
  }, [prestataires]);

  if (loading) {
    return <p className="p-8 text-gray-400 animate-pulse">Chargement...</p>;
  }

  return (
    <div className=" bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Prestataires</h1>

        <button
          onClick={() => router.push("/dashboard/prestataireD/create")}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
        >
          + Créer un prestataire
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher un prestataire..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white border border-gray-400 text-gray-900 placeholder-gray-300 outline-none"
        />

        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === f
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-white"
              }`}
            >
              {f === "all" ? "TOUS" : f === "active" ? "ACTIFS" : "SUSPENDUS"}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="flex gap-3 flex-wrap mb-8">
        <div className="px-4 py-2 rounded-full bg-gray-900 text-white">
          Total : {stats.total}
        </div>

        <div className="px-4 py-2 rounded-full bg-green-600 text-white">
          Actifs : {stats.active}
        </div>

        <div className="px-4 py-2 rounded-full bg-red-600 text-white">
          Suspendus : {stats.suspendus}
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrestataires.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl p-4 shadow-lg bg-slate-800 hover:scale-[1.02] transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(p.name)}
              </div>

              <div>
                <h2
                  onClick={() => router.push(`/dashboard/prestataireD/${p.id}`)}
                  className="text-white font-semibold text-lg cursor-pointer hover:text-red-400 transition"
                >
                  {p.name}
                </h2>
                <p className="text-red-400 text-sm mt-1">{p.category}</p>
                <p className="text-gray-300 text-sm">{p.email}</p>
              </div>
            </div>

            <div className="mt-5">
              {p.banned ? (
                <span className="text-red-400 font-medium">SUSPENDU</span>
              ) : (
                <span className="text-green-400 font-medium">ACTIF</span>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => toggleBan(p.id)}
                className={`px-5 py-2 rounded-full text-white font-medium transition ${
                  p.banned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {p.banned ? "Réactiver" : "Suspendre"}
              </button>
              <button
                onClick={() => router.push(`/dashboard/prestataireD/${p.id}`)}
                className="px-5 py-2 rounded-full text-white font-medium bg-gray-900 hover:bg-gray-700 transition"
              >
                Voir
              </button>

              <button
                onClick={() => {
                  setSelectedPrestataireId(p.id);
                  setShowDeleteModal(true);
                }}
                className="px-5 py-2 rounded-full text-white font-medium bg-red-600 hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
            {/* subtle bottom accent */}
            <div className="mt-6 h-1 w-0 bg-red-500 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => fetchPrestataires(page - 1, search)}
            className="px-4 py-2 bg-gray-900 text-white rounded-full disabled:opacity-40"
          >
            ←
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchPrestataires(i + 1, search)}
              className={`px-4 py-2 rounded-full ${
                page === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === pagination.totalPages}
            onClick={() => fetchPrestataires(page + 1, search)}
            className="px-4 py-2 bg-gray-900 text-white rounded-full disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold text-black">Confirmation</h2>

            <p className="text-sm text-gray-600 mt-2">
              Voulez-vous vraiment supprimer ce prestataire ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPrestataireId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
