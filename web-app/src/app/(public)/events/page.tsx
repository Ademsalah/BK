"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ITEMS_PER_PAGE = 9;

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/events?page=${page}&limit=${ITEMS_PER_PAGE}`,
        );

        setEvents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <div className="min-h-screen bg-[#1c0f2e] text-white px-10 py-16">
      {/* TITLE */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold tracking-widest">
          PROCHAINS SPECTACLES
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          Ouverture 90 minutes avant le début du spectacle.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {events.map((event) => (
          <div key={event.id} className="space-y-4"
                onClick={() => router.push(`/events/${event.id}`)}
          >
            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={event.image || "/images/show.jpg"}
                alt="event image"
                className="w-full h-[260px] object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="flex justify-between items-end gap-4">
              <div>
                <h2 className="font-semibold text-lg leading-tight">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(event.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

               
              </div>

              <button
                onClick={() => router.push(`/events/${event.id}`)}
                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                Acheter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-16 gap-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-full text-sm flex items-center justify-center ${
              page === i + 1
                ? "bg-red-500 text-white"
                : "border border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
