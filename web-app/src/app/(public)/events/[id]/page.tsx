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
  const [selectedImage, setSelectedImage] = useState<string>("");

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getUserId = () =>
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/events/${id}`
        );

        setEvent(response.data);

        // default image
        if (response.data?.photos?.length > 0) {
          setSelectedImage(response.data.photos[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const remainingTickets =
    (event?.capacity || 0) - (event?.bookedTickets || 0);

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
        }
      );

      setMessage(response.data.message);

      setEvent((prev: any) => ({
        ...prev,
        bookedTickets: response.data.bookedTickets,
        status:
          response.data.remainingTickets === 0
            ? "non disponible"
            : prev.status,
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
          error.response?.data?.message || "Erreur lors de la réservation"
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
      </div>

      {/* MAIN IMAGE */}
      <div className="flex justify-center px-4">
        <img
          src={selectedImage || event.photos?.[0]||"/ev.jpg"}
          alt={event.title}
          className="w-full max-w-[700px] h-[400px] object-cover rounded-2xl"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex justify-center gap-3 mt-4 px-4 flex-wrap">
        {event.photos?.map((photo: string, index: number) => (
          <img
            key={index}
            src={photo}
            onClick={() => setSelectedImage(photo)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
              selectedImage === photo
                ? "border-white scale-105"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white mt-[-50px] pt-20 pb-16 px-6 max-w-4xl mx-auto rounded-t-3xl shadow-lg text-gray-900">
        <h2 className="text-2xl font-semibold mb-3">Description</h2>
        <p className="text-sm leading-7 mb-10 text-gray-600">
          {event.description}
        </p>

        <h2 className="text-2xl font-semibold mb-6">Tickets</h2>

        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
          <div>
            <p className="text-lg font-medium">Billet normal</p>
            <p className="text-sm text-gray-500">
              {event.ticketPrice} DT
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="bg-gray-100 text-gray-800 w-10 h-10 rounded-full font-bold"
            >
              -
            </button>

            <span className="text-xl min-w-[30px] text-center">
              {quantity}
            </span>

            <button
              disabled={quantity >= remainingTickets}
              onClick={() => setQuantity((q) => q + 1)}
              className="bg-gray-100 text-gray-800 w-10 h-10 rounded-full font-bold disabled:opacity-40"
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
          <div className="mt-6 bg-gray-100 p-4 rounded-xl text-center text-gray-700">
            {message}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={remainingTickets === 0 || loading}
          className="mt-8 w-full py-4 rounded-full text-lg font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-50"
        >
          {loading
            ? "Réservation..."
            : remainingTickets === 0
            ? "Complet"
            : "Réserver maintenant"}
        </button>
      </div>
    </div>
  );
}