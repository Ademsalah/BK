"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await axios.get(
          `http://localhost:5000/event-prestataires/${userId}`,
          {
            params: {
              page: 1,
              limit: 10,
              search: "",
            },
          },
        );

        setEvents(res.data.data);
        console.log(res.data.data, "event-prestatares");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1c0f2e]">Mes Evenements</h1>

      {loading && <p className="text-gray-500 animate-pulse">Chargement...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       {events.map((item) => {
  const event = item?.Event;

  return (
    <div
      key={item.id}
      onClick={() => router.push(`/dashboard/myEvents/${item.eventId}`)}
      className="rounded-2xl shadow-lg p-6 bg-slate-800 text-white hover:scale-[1.02] transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold text-red-400">
        {event?.title}
      </h2>

      <div className="mt-3 space-y-2 text-sm text-gray-300">
        <p>
          📅{" "}
          {event?.date
            ? new Date(event.date).toLocaleDateString("fr-FR")
            : "Date invalide"}
        </p>

        <p>📍 {event?.location}</p>
        <p>💰 {item.proposedPrice} DT</p>

        <p>
          Status:{" "}
          <span
            className={
              item.status === "ACCEPTED"
                ? "text-green-400"
                : item.status === "REFUSED"
                ? "text-red-400"
                : "text-yellow-400"
            }
          >
            {item.status}
          </span>
        </p>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}
