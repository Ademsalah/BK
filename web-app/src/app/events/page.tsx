"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const allEvents = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  title: `Event ${i + 1}`,
  date: "dim. 08 juil.",
  image: "/images/show.jpg",
}));

const ITEMS_PER_PAGE = 9;

export default function EventsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentEvents = allEvents.slice(start, start + ITEMS_PER_PAGE);

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
        {currentEvents.map((event) => (
          <div key={event.id} className="space-y-4">
            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={event.image}
                alt="event"
                className="w-full h-[260px] object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="flex justify-between items-end gap-4">
              {/* LEFT SIDE (TEXT) */}
              <div>
                <h2 className="font-semibold text-lg leading-tight">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">{event.date}</p>

                <p className="text-sm underline mt-2 cursor-pointer">
                  Plus d'infos
                </p>
              </div>

              {/* RIGHT SIDE (BUTTON) */}
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
