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

  const fetchEvents = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/events?page=${pageNumber}&limit=6`,
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

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Événements</h1>

        <button
          onClick={() => router.push("/dashboard/eventsD/create/step1")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          + Créer un événement
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Events grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl p-5 shadow-lg border border-white/10"
            style={{ backgroundColor: "#2a1845" }}
          >
            <h2 className="text-xl font-semibold text-white">{event.title}</h2>

            <p className="text-gray-300 mt-2">
              📅 {new Date(event.date).toLocaleDateString()}
            </p>

            <p className="text-gray-300">📍 {event.location}</p>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => fetchEvents(page - 1)}
            className="px-4 py-2 rounded-md text-white bg-[#2a1845] hover:bg-[#3a235f] disabled:opacity-40 transition"
          >
            Prev
          </button>

          {/* Page indicator buttons */}
          {Array.from({ length: pagination.totalPages }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => fetchEvents(pageNumber)}
                className={`px-4 py-2 rounded-md transition border border-white/10 ${
                  isActive
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "bg-[#2a1845] text-white hover:bg-[#3a235f]"
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
            className="px-4 py-2 rounded-md text-white bg-[#2a1845] hover:bg-[#3a235f] disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
