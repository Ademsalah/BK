"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getUserId = () =>
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const remainingTickets = (event?.capacity || 0) - (event?.bookedTickets || 0);

  const total = (event?.ticketPrice || 0) * quantity;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = getToken();
      const userId = getUserId();

      if (!token) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);

        router.push("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/tickets",
        {
          eventId: event.id,
          quantity,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(response.data.message);

      setEvent((prev: any) => ({
        ...prev,
        bookedTickets: response.data.bookedTickets,
        status:
          response.data.remainingTickets === 0 ? "non disponible" : prev.status,
      }));

      setQuantity(1);
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        localStorage.setItem("redirectAfterLogin", window.location.pathname);

        router.push("/login");
      } else {
        setMessage(
          error.response?.data?.message || "Erreur lors de la réservation",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1c0f2e] text-white">
        Chargement...
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-[#1c0f2e] text-white">
      {/* HEADER */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold">{event.title}</h1>

        <p className="text-gray-300 mt-3">
          {new Date(event.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          {" • "}
          {event.location}
        </p>

        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <span className="bg-black/40 px-4 py-2 rounded-full text-sm">
            Capacité : {event.capacity}
          </span>

          <span className="bg-black/40 px-4 py-2 rounded-full text-sm">
            Réservés : {event.bookedTickets}
          </span>

          <span className="bg-black/40 px-4 py-2 rounded-full text-sm">
            Restants : {remainingTickets}
          </span>

          <span
            className={`px-4 py-2 rounded-full text-sm ${
              event.status === "non disponible" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* IMAGE */}
      <div className="flex justify-center px-4">
        <img
          src={event.image}
          alt={event.title}
          className="w-full max-w-[700px] h-[400px] object-cover rounded-2xl"
        />
      </div>

      {/* CONTENT */}
      <div className="bg-red-600 mt-[-50px] pt-20 pb-16 px-6 max-w-4xl mx-auto rounded-t-3xl">
        <h2 className="text-2xl font-semibold mb-3">Description</h2>
        <p className="text-sm leading-7 mb-10">{event.description}</p>

        <h2 className="text-2xl font-semibold mb-6">Tickets</h2>

        <div className="flex justify-between items-center border-b border-white/30 pb-5">
          <div>
            <p className="text-lg font-medium">Billet normal</p>
            <p className="text-sm text-white/80">{event.ticketPrice} DT</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="bg-white text-black w-10 h-10 rounded-full font-bold"
            >
              -
            </button>

            <span className="text-xl min-w-[30px] text-center">{quantity}</span>

            <button
              disabled={quantity >= remainingTickets}
              onClick={() => setQuantity((q) => q + 1)}
              className={`w-10 h-10 rounded-full font-bold ${
                quantity >= remainingTickets
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-white text-black"
              }`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-8 text-2xl font-bold">
          <p>Total</p>
          <p>{total.toFixed(2)} DT</p>
        </div>

        {message && (
          <div className="mt-6 bg-black/30 p-4 rounded-xl text-center">
            {message}
          </div>
        )}

        {/* BUTTON */}
        {!getToken() ? (
          <button
            onClick={() => {
              localStorage.setItem(
                "redirectAfterLogin",
                window.location.pathname,
              );
              router.push("/login");
            }}
            className="mt-8 w-full py-4 rounded-full text-lg font-semibold bg-black hover:bg-gray-900"
          >
            Se connecter pour réserver
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={remainingTickets === 0 || loading}
            className={`mt-8 w-full py-4 rounded-full text-lg font-semibold transition ${
              remainingTickets === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading
              ? "Réservation..."
              : remainingTickets === 0
                ? "Complet"
                : "Réserver maintenant"}
          </button>
        )}
      </div>
    </div>
  );
}
