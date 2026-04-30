"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export default function EventsD() {
  const router = useRouter();
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

 const fetchEvents = async (pageNumber = 1, searchValue = "") => {
  try {
    setLoading(true);

    const res = await axios.get(
      `http://localhost:5000/events?page=${pageNumber}&limit=6&search=${searchValue}`,
    );

    setEvents(res.data.data);
    setPagination(res.data.pagination);
    setPage(res.data.pagination.currentPage);
  } catch (err) {
    console.error("Error fetching events:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents(1);
  }, []);


  useEffect(() => {
  const delay = setTimeout(() => {
    fetchEvents(1, search);
  }, 300);

  return () => clearTimeout(delay);
}, [search]);
  return (
    <div className="min-h-screen p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Événements
        </h1>

        <button
          onClick={() => router.push("/dashboard/eventsD/create/step1")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Créer
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Rechercher un événement..."
    className="flex-1 px-4 py-2 rounded-xl bg-white border border-gray-400 text-gray-900 placeholder-gray-300 outline-none"
  />
</div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 animate-pulse">Loading events...</p>
      )}

      {/* Events grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            onClick={() => router.push(`/dashboard/eventsD/${event.id}`)}
            key={event.id}
            className="group rounded-2xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-slate-700"
            
          >
            <h2 className="text-xl font-semibold text-white group-hover:text-red-400 transition">
              {event.title}
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-300 flex items-center gap-2">
                <span>📅</span>
                {new Date(event.date).toLocaleDateString()}
              </p>

              <p className="text-gray-300 flex items-center gap-2">
                <span>📍</span>
                {event.location}
              </p>
            </div>

            {/* subtle bottom accent */}
            <div className="mt-6 h-1 w-0 bg-red-500 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
          {/* Prev */}
        {/* Prev */}
<button
  disabled={page === 1}
  onClick={() => fetchEvents(page - 1)}
  className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-gray-900 transition"
>
  ←
</button>

{/* Pages */}
{Array.from({ length: pagination.totalPages }, (_, i) => {
  const pageNumber = i + 1;
  const isActive = page === pageNumber;

  return (
    <button
      key={pageNumber}
      onClick={() => fetchEvents(pageNumber)}
      className={`px-4 py-2 rounded-full text-sm transition border ${
        isActive
          ? "bg-red-600 text-white shadow-lg scale-110 border-red-600"
          : "bg-gray-900 text-white border-gray-700 hover:bg-red-600 hover:border-red-600"
      }`}
    >
      {pageNumber}
    </button>
  );
})}

{/* Next */}
<button
  disabled={page === pagination.totalPages}
  onClick={() => fetchEvents(page + 1)}
  className="px-4 py-2 rounded-full text-white bg-gray-900 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-gray-900 transition"
>
  →
</button>
        </div>
      )}
    </div>
  );
}
