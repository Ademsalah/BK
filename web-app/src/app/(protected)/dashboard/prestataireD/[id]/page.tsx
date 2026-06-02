"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function OnePrestataire() {
  const params = useParams();

  const [prestataire, setPrestataire] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrestataire = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/event-prestataires/Epresta/${params.id}`,
      );

      setPrestataire(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataire();
  }, []);

  if (loading) {
    return <div className="p-10 text-gray-400">Chargement...</div>;
  }

  if (!prestataire) {
    return <div className="p-10 text-red-500">Prestataire introuvable</div>;
  }

  const user = prestataire.user;

  const profile = user.PrestataireProfile;

  const events = profile?.EventPrestataires || [];

  return (
    <div className="min-h-screen bg-white p-8">
      {/* HEADER */}
      <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0)}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>

            <p className="text-gray-300">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-700 rounded-2xl p-4">
            <p className="text-gray-300 text-sm">Catégorie</p>

            <h2 className="text-xl font-semibold mt-1">{profile?.category}</h2>
          </div>

          <div className="bg-slate-700 rounded-2xl p-4">
            <p className="text-gray-300 text-sm">Événements</p>

            <h2 className="text-xl font-semibold mt-1">{events.length}</h2>
          </div>

          <div className="bg-slate-700 rounded-2xl p-4">
            <p className="text-gray-300 text-sm">Rating</p>

            <h2 className="text-xl font-semibold mt-1">
              ⭐ {profile?.rating || 0}
            </h2>
          </div>
        </div>
      </div>

      {/* EVENTS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Événements assignés
        </h2>

        {events.length === 0 ? (
          <div className="bg-gray-100 rounded-2xl p-6 text-gray-500">
            Aucun événement assigné
          </div>
        ) : (
          <div className="grid gap-5">
            {events.map((e: any) => (
              <div
                key={e.id}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {e.Event?.title}
                    </h3>

                    <p className="text-gray-500 mt-1">{e.Event?.location}</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      e.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : e.status === "REFUSED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  Prix proposé : {e.proposedPrice} DT
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
