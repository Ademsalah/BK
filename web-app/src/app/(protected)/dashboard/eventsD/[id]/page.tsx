"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Stars from "./components/stars";

function Event() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // EDIT MODE
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  // MODAL STATE (prestataires)
  const [openModal, setOpenModal] = useState(false);
  const [selectedEp, setSelectedEp] = useState<any>(null);

  // DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/events/${id}`);

      setEvent(res.data);

      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
        date: res.data.date?.slice(0, 10) || "",
        location: res.data.location || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  // SLIDER
  useEffect(() => {
    if (!event?.photos || event.photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === event.photos.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [event?.photos]);

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE EVENT
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/events/${id}`, formData);

      await fetchEvent();
      setEditMode(false);

      alert("Événement modifié avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  };

  // DELETE EVENT ✅
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);

      setShowDeleteModal(false);

      alert("Événement supprimé avec succès");

      router.push("/dashboard/eventsD"); // redirect after delete
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };
  const handleReplace = async (candidate: any) => {
    try {
      await axios.post("http://localhost:5000/recommend/replace-prestataire", {
        eventId: id,
        eventPrestataireId: selectedEp.id,
        newPrestataireId: candidate.id, // 👈 IMPORTANT
      });

      alert("Prestataire remplacé !");
      setOpenModal(false);
      fetchEvent(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Erreur remplacement");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Chargement...</div>;
  if (!event)
    return <div className="p-6 text-gray-500">Événement introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <img
          src={event.photos?.[currentIndex] || "/ev.jpg"}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 w-full p-6 text-white bg-black/40">
          {!editMode ? (
            <>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="text-lg mt-2">{event.description}</p>
              <p className="mt-2">{event.location}</p>
              <p>{event.date?.slice(0, 10)}</p>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black bg-gray-300"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black bg-gray-300 h-40"
                />
              </div>

              <div className="space-y-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black bg-gray-300"
                />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black bg-gray-300"
                />
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-4 flex gap-3">
            {!editMode ? (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-red-600 rounded text-white"
                >
                  Modifier
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-black/70 rounded text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 rounded text-white"
                >
                  Sauvegarder
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-500 rounded text-white"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-bold text-black">Confirmation</h2>

            <p className="text-sm text-gray-600 mt-2">
              Voulez-vous vraiment supprimer cet événement ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE + MODAL (UNCHANGED BELOW) */}
      <div className="w-full py-10">
        <div className="w-full bg-white shadow-lg overflow-x-auto">
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
                <tr key={ep.id} className="border-t text-black">
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {ep.PrestataireProfile?.User?.name}
                      </span>
                      <Stars rating={ep.PrestataireProfile?.rating || 0} />
                    </div>
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
                      className={`p-2 text-xs rounded-full ${
                        ep.status === "ACCEPTED"
                          ? "bg-green-600 text-white"
                          : ep.status === "REFUSED"
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-black"
                      }`}
                    >
                      {ep.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {ep.status === "REFUSED" && (
                      <button
                        onClick={async () => {
                          setSelectedEp(ep);
                          setOpenModal(true);
                          setLoadingCandidates(true);

                          try {
                            const res = await axios.post(
                              "http://localhost:5000/recommend/replacement-candidates",
                              {
                                eventId: id,
                                eventPrestataireId: ep.id,
                              },
                            );

                            // ✅ if backend empty
                            if (
                              !res.data.candidates ||
                              res.data.candidates.length === 0
                            ) {
                              setCandidates([
                                {
                                  id: 1,
                                  category: "TRAITEUR",
                                  priceMax: 2500,
                                  User: {
                                    name: "Le petit traiteur",
                                    email: "dummy1@test.com",
                                  },
                                },
                                {
                                  id: 2,
                                  category: "TRAITEUR",
                                  priceMax: 3200,
                                  User: {
                                    name: "Elite Food",
                                    email: "elite@test.com",
                                  },
                                },
                              ]);
                            } else {
                              setCandidates(res.data.candidates);
                            }
                          } catch (err) {
                            console.error(err);

                            // ✅ DUMMY DATA IF API FAILS
                            setCandidates([
                              {
                                id: 1,
                                category: "MUSICIEN",
                                priceMax: 1800,
                                User: {
                                  name: "DJ Samy",
                                  email: "dj@test.com",
                                },
                              },
                              {
                                id: 2,
                                category: "MUSICIEN",
                                priceMax: 2200,
                                User: {
                                  name: "Orchestra Lux",
                                  email: "lux@test.com",
                                },
                              },
                            ]);
                          } finally {
                            setLoadingCandidates(false);
                          }
                        }}
                        className="px-3 py-1 bg-black text-white rounded-lg"
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

      {/* EXISTING MODAL (UNCHANGED) */}
      {openModal && selectedEp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">
                Choisir un autre prestataire
              </h2>

              <button
                onClick={() => {
                  setOpenModal(false);
                  setCandidates([]);
                  setSelectedEp(null);
                }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {loadingCandidates ? (
              <p>Chargement...</p>
            ) : candidates.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 font-medium">
                  Aucun prestataire disponible pour cette catégorie
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Essayez plus tard ou changez de catégorie
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-semibold text-gray-700">
                        {c.User?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {c.category} • {c.priceMax} DT
                      </p>
                    </div>

                    <button
                      onClick={() => handleReplace(c)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Choisir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;
