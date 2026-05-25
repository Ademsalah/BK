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

  // MODAL STATE
  const [openModal, setOpenModal] = useState(false);
  const [selectedEp, setSelectedEp] = useState<any>(null);

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

  // 👉 suggested prestataires (front-only logic)
  const getSuggestions = (refusedEp: any) => {
    if (!event?.EventPrestataires) return [];

    const category = refusedEp?.PrestataireProfile?.category;
    const targetPrice = refusedEp?.proposedPrice || 0;

    return event.EventPrestataires.filter((ep: any) => {
      // ❌ never include refused ones
      if (ep.status === "REFUSED") return false;

      // ✅ same category only
      return ep.PrestataireProfile?.category === category;
    })
      .map((ep: any) => {
        const price = ep.proposedPrice || 0;
        const rating = ep.PrestataireProfile?.rating || 0;

        // scoring system (you can tweak later)
        const priceScore = 1 / (1 + Math.abs(price - targetPrice));
        const ratingScore = rating / 5;

        return {
          ...ep,
          score: priceScore * 0.6 + ratingScore * 0.4,
        };
      })
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 8); // 👉 MORE suggestions
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <img
          src={event.photos?.[currentIndex] || "/ev.jpg"}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <h1 className="text-3xl font-bold">{event.title}</h1>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full py-10">
        <div className="w-full bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                {[
                  "Nom",
                  "Catégorie",
                  "Email",
                  "Prix proposé",
                  "Statut",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-5 py-4 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {event.EventPrestataires?.map((ep: any) => (
                <tr key={ep.id} className="border-t">
                  <td className="px-5 py-4">
                    {ep.PrestataireProfile?.User?.name}
                  </td>

                  <td className="px-5 py-4">
                    {ep.PrestataireProfile?.category}
                  </td>

                  <td className="px-5 py-4">
                    {ep.PrestataireProfile?.User?.email}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {ep.proposedPrice} DT
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        ep.status === "ACCEPTED"
                          ? "bg-green-600 text-white"
                          : ep.status === "REFUSED"
                            ? "bg-red-600 text-white"
                            : "bg-gray-200"
                      }`}
                    >
                      {ep.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">
                    {ep.status === "REFUSED" && (
                      <button
                        onClick={() => {
                          setSelectedEp(ep);
                          setOpenModal(true);
                        }}
                        className="px-3 py-1 bg-black text-white rounded"
                      >
                        Remplacer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {openModal && selectedEp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[500px] p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4">
              Choisir un autre prestataire
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              Suggestions proches de {selectedEp.proposedPrice} DT
            </p>

            <div className="space-y-3 max-h-[300px] overflow-auto">
              {getSuggestions(selectedEp).map((p: any) => (
                <div
                  key={p.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {p.PrestataireProfile?.User?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.proposedPrice} DT
                    </p>
                  </div>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => {
                      console.log("proposer:", p.id);
                      setOpenModal(false);
                    }}
                  >
                    Proposer
                  </button>
                </div>
              ))}
            </div>

            <button
              className="mt-4 text-sm text-gray-500"
              onClick={() => setOpenModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;
