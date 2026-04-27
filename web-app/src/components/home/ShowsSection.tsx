"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowsSection() {
  const router = useRouter();
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/events?page=1&limit=5",
        );

        // adapt backend shape: res.data.data
        setShows(res.data.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  if (!shows) {
    return null;
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-auto">
      {/* LEFT SIDE */}
      <div className="bg-[#1c0f2e] text-white px-6 sm:px-10 md:px-14 py-10 md:py-14 flex flex-col justify-center">
        {/* HEADER */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="text-red-600 text-3xl sm:text-4xl mb-4">✕</div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-red-600 mb-6">
            PROCHAINS SPECTACLES
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
            Spectacles ouverts à partir de 18 ans. <br />
            Des tables VIP sont disponibles sur demande.
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : (
            shows.map((show) => (
              <div
                onClick={() => router.push(`/events/${show.id}`)}
                key={show.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between 
                gap-2 border border-gray-700 px-6 py-4 rounded-full 
                transition-all duration-300 cursor-pointer
                hover:bg-[#2a1745] hover:scale-[1.02]"
              >
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-400">
                    {new Date(show.date).toDateString()}
                  </p>
                  <p className="text-sm sm:text-base">{show.title}</p>
                </div>

                <button
                  className="border border-white px-4 py-1.5 rounded-full text-[11px] sm:text-xs 
                  hover:bg-gray-200 hover:text-black transition w-fit"
                >
                  ACHETER
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push("/events")}
            className="bg-red-500 px-5 sm:px-6 py-2.5 rounded-full 
            hover:bg-red-600 transition text-sm sm:text-base"
          >
            Voir plus
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center justify-center bg-white">
        <div className="relative w-full h-full">
          <Image
            src="/logo.png"
            alt="Event Image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
