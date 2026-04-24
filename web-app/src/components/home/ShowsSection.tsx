"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const shows = [
  { date: "Sat, Jul 07", title: "Kev Junior avec BD Vic" },
  { date: "Sun, Jul 08", title: "Le Super Dollar" },
  { date: "Tue, Jul 10", title: "Chips et Rafale 3D" },
  { date: "Thu, Jul 12", title: "La Bajfe avec Cellulaire" },
  { date: "Sat, Jul 14", title: "Télon T" },
  { date: "Sun, Jul 15", title: "Les Chats de l’Ouest" },
];

export default function ShowsSection() {
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT SIDE */}
      <div className="bg-[#1c0f2e] text-white px-6 sm:px-10 md:px-14 py-12 md:py-16 flex flex-col justify-center">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-red-500 text-lg sm:text-xl font-bold">
            PROCHAINS SPECTACLES
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Spectacles ouverts à partir de 18 ans. <br />
            Des tables VIP sont disponibles sur demande.
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-5 sm:space-y-6">
          {shows.map((show, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
            >
              <div>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  {show.date}
                </p>
                <p className="text-sm sm:text-base">{show.title}</p>
              </div>

              <button
                className="border border-white px-4 py-1.5 rounded-full text-[11px] sm:text-xs 
                hover:bg-white hover:text-black transition w-fit"
              >
                RÉPONDRE
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/events")}
          className="mt-8 sm:mt-10 bg-red-500 px-5 sm:px-6 py-2.5 rounded-full 
          w-fit hover:bg-red-600 transition text-sm sm:text-base"
        >
          Voir plus
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center justify-center bg-white ">
        {/* RIGHT SIDE */}
        <div className="hidden md:block relative w-full h-full min-h-screen">
          <Image
            src="/images/show.jpg"
            alt="show"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
