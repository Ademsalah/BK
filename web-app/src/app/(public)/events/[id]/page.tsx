"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<any>(null);

  const [quantity, setQuantity] = useState(0);
  const total = event?.ticketPrice * quantity;

  useEffect(() => {
    try {
      const fetchEvent = async () => {
        const response = await axios.get(`http://localhost:5000/events/${id}`);
        console.log(response.data);

        setEvent(response.data);
      };
      fetchEvent();
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c0f2e] text-white">
      {/* TOP */}
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-gray-400 mt-2">
          {new Date(event.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          • {event.location}
        </p>

        <button className="mt-6 bg-red-500 px-6 py-2 rounded-full">
          Buy Tickets
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex justify-center">
        <img src={event.image} className="w-[600px] h-[350px] object-cover" />
      </div>

      {/* BOTTOM SECTION */}
      <div className="bg-red-600 mt-[-50px] pt-20 pb-16 px-10 max-w-4xl mx-auto rounded-t-2xl">
        {/* TIME */}
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-sm mb-6">{event.description}</p>

        {/* TICKETS */}
        <h2 className="text-lg font-semibold mb-4">Tickets</h2>

        <div className="flex justify-between items-center border-b border-white/30 pb-4">
          <div>
            <p>Billet normal</p>
            <p className="text-sm">{event.ticketPrice} DT</p>
          </div>

          {/* QUANTITY CONTROL */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              className="bg-white text-black px-3 py-1 rounded"
            >
              -
            </button>

            <span className="min-w-[20px] text-center">{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="bg-white text-black px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between mt-6 text-lg font-semibold">
          <p>Total</p>
          <p>{total.toFixed(2)} DT</p>
        </div>

        {/* CHECKOUT */}
        <button
          disabled={quantity === 0}
          className={`mt-6 px-6 py-2 rounded-full w-full transition ${
            quantity === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
          }`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
