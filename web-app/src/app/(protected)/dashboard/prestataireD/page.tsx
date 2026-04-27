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

  // ✅ MODALS
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<"ban" | "unban" | null>(
    null,
  );

  // pagination (RESTORED)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 📥 FETCH
  const fetchPrestataires = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/prestataires");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  // 🚫 BAN / UNBAN (ONLY AFTER CONFIRMATION)
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

      toast.success(
        res.data.banned ? "Prestataire banni 🚫" : "Prestataire débanni ✅",
      );

      setShowBanModal(false);
      setSelectedId(null);
    } catch (err) {
      toast.error("Action échouée");
    }
  };

  // 🗑 DELETE (FIXED)
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await axios.delete(`http://localhost:5000/prestataires/${selectedId}`);

      setUsers((prev) => prev.filter((u) => u.id !== selectedId));

      toast.success("Prestataire supprimé 🗑️");

      setShowDeleteModal(false);
      setSelectedId(null);
    } catch (err) {
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

  // 🔍 FILTER
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

  // 📊 STATS
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => !u.banned).length,
      banned: users.filter((u) => u.banned).length,
    };
  }, [users]);

  // 📄 PAGINATION (RESTORED EXACT LOGIC)
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Prestataires</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-[#2a1845] text-white rounded-xl">
          Total: {stats.total}
        </div>
        <div className="p-4 bg-[#2a1845] text-green-400 rounded-xl">
          Actifs: {stats.active}
        </div>
        <div className="p-4 bg-[#2a1845] text-red-400 rounded-xl">
          Bannis: {stats.banned}
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Rechercher..."
        className="w-full mb-4 px-4 py-2 bg-[#2a1845] text-white rounded-md"
      />

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "banned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md ${
              filter === f ? "bg-red-600" : "bg-[#2a1845]"
            } text-white`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((p) => (
          <div key={p.id} className="p-5 bg-[#2a1845] text-white rounded-xl">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">
                {getInitials(p.name)}
              </div>
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-300">{p.email}</p>
              </div>
            </div>

            <div className="mt-3">
              {p.banned ? (
                <span className="text-red-400">BANNI</span>
              ) : (
                <span className="text-green-400">ACTIF</span>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleUpdate(p.id)}
                className="px-3 py-1 bg-white/10 rounded-md"
              >
                Modifier
              </button>

              {/* BAN BUTTON → OPENS MODAL */}
              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowBanModal(true);
                  setPendingAction(p.banned ? "unban" : "ban");
                }}
                className={`px-3 py-1 rounded-md ${
                  p.banned ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {p.banned ? "Débannir" : "Bannir"}
              </button>

              {/* DELETE */}
              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-1 bg-red-700 rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION (UNCHANGED) */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 ${
              currentPage === i + 1 ? "bg-red-600" : "bg-[#2a1845]"
            } text-white rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h2 className="text-lg font-bold mb-2">Confirmation</h2>
            <p>Êtes-vous sûr de vouloir supprimer ce prestataire ?</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h2 className="text-lg font-bold mb-2">Confirmation</h2>

            <p>
              Êtes-vous sûr de vouloir{" "}
              <b>{pendingAction === "ban" ? "bannir" : "débannir"}</b> ce
              prestataire ?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-3 py-1"
              >
                Annuler
              </button>
              <button
                onClick={confirmBanAction}
                className={`px-3 py-1 text-white rounded ${
                  pendingAction === "ban" ? "bg-red-600" : "bg-green-600"
                }`}
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
