"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Stars from "./components/stars";

function Event() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  // ✅ AUTO SLIDER
  useEffect(() => {
    if (!event?.photos || event.photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === event.photos.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [event?.photos]);

  if (loading) return <div className="p-6 text-gray-500">Chargement...</div>;

  if (!event)
    return <div className="p-6 text-gray-500">Événement introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO CAROUSEL */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        {/* IMAGE */}
        <img
          src={event.photos?.[currentIndex] || "/ev.jpg"}
          className="w-full h-full object-cover transition duration-700 ease-in-out"
          alt="event"
        />

        {/* TEXT */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>

          <p className="text-gray-200 mt-2 max-w-2xl">{event.description}</p>

          <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-200">
            <span>📍 {event.location}</span>
            <span>📅 {new Date(event.date).toLocaleDateString("fr-FR")}</span>
            <span>💰 {event.totalBudget} DT</span>
            <span>🎟 {event.ticketPrice} DT</span>
            <span>👥 {event.capacity}</span>
            <span className="text-red-400 font-semibold">{event.status}</span>
          </div>
        </div>
      </div>

      {/* DOTS */}
      {event.photos?.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {event.photos.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === currentIndex ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* TABLE */}
      <div className="w-full py-10">
        <div className="w-full bg-white shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Prestataires
              <span className="ml-2 text-gray-500 font-normal">
                ({event.EventPrestataires?.length || 0})
              </span>
            </h2>

            <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  {[
                    "Nom",
                    "Catégorie",
                    "Email",
                    "Évaluation",
                    "Fourchette de prix",
                    "Proposé",
                    "Statut",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-4 font-medium tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {event.EventPrestataires?.map((ep: any, i: number) => (
                  <tr
                    key={ep.id}
                    className={`transition hover:bg-gray-50 border-t ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {ep.PrestataireProfile?.User?.name}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {ep.PrestataireProfile?.category}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {ep.PrestataireProfile?.User?.email}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Stars rating={ep.PrestataireProfile?.rating || 0} />
                        <span className="text-xs text-gray-500">
                          {ep.PrestataireProfile?.rating?.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {ep.PrestataireProfile?.priceMin} -{" "}
                      {ep.PrestataireProfile?.priceMax} DT
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {ep.proposedPrice} DT
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          ep.status === "ACCEPTED"
                            ? "bg-red-600 text-white"
                            : ep.status === "REFUSED"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {ep.status === "ACCEPTED"
                          ? "Accepté"
                          : ep.status === "REFUSED"
                            ? "Refusé"
                            : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
