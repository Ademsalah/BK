"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const userId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("userId"))
      : null;

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

  // AUTO SLIDER (same UI as main page)
  useEffect(() => {
    if (!event?.photos || event.photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === event.photos.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [event?.photos]);

  // ACCEPT / REFUSE
  const updateStatus = async (epId: number, status: string) => {
    try {
      await axios.put(
        `http://localhost:5000/event-prestataires/status/${userId}`,
        { status },
      );

      setEvent((prev: any) => {
        const updated = prev.EventPrestataires.map((ep: any) =>
          ep.id === epId ? { ...ep, status } : ep,
        );
        return { ...prev, EventPrestataires: updated };
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Chargement...</div>;

  if (!event)
    return <div className="p-6 text-gray-500">Événement introuvable</div>;

  const myRequest = event.EventPrestataires?.find(
    (ep: any) => ep.PrestataireProfile?.userId === userId,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO CAROUSEL */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        {/* IMAGE */}
        <img
          src={event.photos?.[currentIndex] || "/ev.jpg"}
          className="w-full h-full object-cover transition duration-700"
          alt="event"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

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

      {/* REQUEST SECTION */}
      <div className="p-6 md:p-10">
        {myRequest ? (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span
                  className={
                    myRequest.status === "accepted"
                      ? "text-green-600"
                      : myRequest.status === "refused"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }
                >
                  {myRequest.status}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(myRequest.id, "accepted")}
                disabled={myRequest.status === "accepted"}
                className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(myRequest.id, "refused")}
                disabled={myRequest.status === "refused"}
                className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              >
                Refuse
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">You are not assigned to this event</p>
        )}
      </div>
    </div>
  );
}

export default Page;
