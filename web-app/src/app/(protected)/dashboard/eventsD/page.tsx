"use client";

import { useState } from "react";

export default function EventsD() {
  const [events, setEvents] = useState([
    { id: 1, title: "Conférence Tech", date: "2026-04-20", location: "Tunis" },
    { id: 2, title: "Festival de musique", date: "2026-05-01", location: "Sousse" },
    { id: 3, title: "Meetup Startup", date: "2026-05-10", location: "Ariana" },
    { id: 4, title: "Atelier IA", date: "2026-06-02", location: "Sfax" },
    { id: 5, title: "Bootcamp Design", date: "2026-06-15", location: "Hammamet" },
    { id: 6, title: "Soirée Networking", date: "2026-07-01", location: "Tunis" },
  ]);

  // Supprimer un événement
  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Modifier un événement (simulation)
  const handleUpdate = (id) => {
    alert("Modifier l'événement avec l'ID : " + id);
  };

  // Créer un événement (simulation)
  const handleCreate = () => {
    const newEvent = {
      id: Date.now(),
      title: "Nouvel événement",
      date: "2026-08-01",
      location: "Inconnu",
    };

    setEvents([newEvent, ...events]);
  };

  return (
    <div className="min-h-screen p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">
          Événements
        </h1>

        <button
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          + Créer un événement
        </button>
      </div>

      {/* Liste des événements */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl p-5 shadow-lg border border-white/10"
            style={{ backgroundColor: "#2a1845" }}
          >
            <h2 className="text-xl font-semibold text-white">
              {event.title}
            </h2>

            <p className="text-gray-300 mt-2">
              📅 {event.date}
            </p>

            <p className="text-gray-300">
              📍 {event.location}
            </p>

            {/* Boutons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleUpdate(event.id)}
                className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 transition"
              >
                Modifier
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}