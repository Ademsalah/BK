"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function PrestataireD() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<"ban" | "unban" | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchPrestataires = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/prestataires");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Erreur lors du chargement");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  const confirmBanAction = async () => {
    if (!selectedId) return;

    try {
      const res = await axios.patch(
        `http://localhost:5000/prestataires/${selectedId}/ban`,
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedId ? { ...u, banned: res.data.banned } : u,
        ),
      );

      toast.success(res.data.banned ? "Prestataire banni 🚫" : "Prestataire débanni ✅");

      setShowBanModal(false);
      setSelectedId(null);
    } catch {
      toast.error("Action échouée");
    }
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await axios.delete(`http://localhost:5000/prestataires/${selectedId}`);

      setUsers((prev) => prev.filter((u) => u.id !== selectedId));

      toast.success("Prestataire supprimé 🗑️");

      setShowDeleteModal(false);
      setSelectedId(null);
    } catch {
      toast.error("Suppression échouée");
    }
  };

  const handleUpdate = (id: number) => {
    router.push(`/dashboard/prestataireD/create/${id}`);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u?.name?.toLowerCase().includes(search.toLowerCase()) ||
        u?.email?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ? true : filter === "active" ? !u.banned : u.banned;

      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading)
    return <p className="p-8 text-gray-400 animate-pulse">Loading...</p>;

  return (
    <div className="min-h-screen p-8 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Prestataires
        </h1>

        <button
          onClick={() => router.push("/dashboard/prestataireD/create")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition"
        >
          + Créer
        </button>
      </div>

      {/* SEARCH + FILTER */}
     <div className="flex flex-col md:flex-row gap-4 mb-8">
  <input
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="Rechercher..."
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
            : "bg-gray-900 text-white hover:bg-red-600"
        }`}
      >
        {f.toUpperCase()}
      </button>
    ))}
  </div>
</div>
      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {current.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-slate-700"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
                {getInitials(p.name)}
              </div>

              <div>
                <p className="text-white font-semibold">{p.name}</p>
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

            <div className="flex gap-2 mt-5 flex-wrap">
              <button
                onClick={() => handleUpdate(p.id)}
                className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                Modifier
              </button>

              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowBanModal(true);
                  setPendingAction(p.banned ? "unban" : "ban");
                }}
                className={`px-3 py-1 rounded-full text-white transition ${
                  p.banned ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {p.banned ? "Débannir" : "Bannir"}
              </button>

              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-1 rounded-full bg-red-700 text-white"
              >
                Supprimer
              </button>
            </div>

            <div className="mt-5 h-1 w-0 bg-red-500 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 transition"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                isActive
                  ? "bg-red-600 text-white scale-110"
                  : "bg-gray-900 text-white hover:bg-red-600"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 transition"
        >
          →
        </button>
      </div>

      {/* MODALS (unchanged logic, same UI style not forced here) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h2 className="text-lg font-bold mb-2">Confirmation</h2>
            <p>Supprimer ce prestataire ?</p>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h2 className="text-lg font-bold mb-2">Confirmation</h2>
            <p>
              Confirmer{" "}
              <b>{pendingAction === "ban" ? "bannir" : "débannir"}</b> ?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowBanModal(false)}>Annuler</button>
              <button
                onClick={confirmBanAction}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}