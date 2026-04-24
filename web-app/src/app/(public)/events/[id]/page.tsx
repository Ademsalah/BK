"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id;

  const event = {
    id,
    title: "Teflon T",
    date: "14-08-2025",
    location: "Paris, France",
    price: 40,
    image: "/images/show.jpg",
  };

  const [quantity, setQuantity] = useState(0);

  const total = quantity * event.price;

  return (
    <div className="min-h-screen bg-[#1c0f2e] text-white">
      {/* TOP */}
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-gray-400 mt-2">
          {event.date} • {event.location}
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
        <h2 className="text-lg font-semibold mb-2">Time & Location</h2>
        <p className="text-sm mb-6">
          {event.date} — {event.location}
        </p>

        {/* TICKETS */}
        <h2 className="text-lg font-semibold mb-4">Tickets</h2>

        <div className="flex justify-between items-center border-b border-white/30 pb-4">
          <div>
            <p>Billet normal</p>
            <p className="text-sm">{event.price} €</p>
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
          <p>{total.toFixed(2)} €</p>
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
