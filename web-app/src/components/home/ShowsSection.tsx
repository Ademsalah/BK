"use client";

const shows = [
  {
    date: "Sat, Jul 07",
    title: "Kev Junior avec BD Vic",
  },
  {
    date: "Sun, Jul 08",
    title: "Le Super Dollar",
  },
  {
    date: "Tue, Jul 10",
    title: "Chips et Rafale 3D",
  },
  {
    date: "Thu, Jul 12",
    title: "La Bajfe avec Cellulaire",
  },
  {
    date: "Sat, Jul 14",
    title: "Télon T",
  },
  {
    date: "Sun, Jul 15",
    title: "Les Chats de l’Ouest",
  },
];
import { useRouter } from "next/navigation";
export default function ShowsSection() {
  const router = useRouter();
  return (
    <section className="flex min-h-screen">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-[#1c0f2e] text-white p-10 flex flex-col justify-center">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-red-500 text-xl font-bold">
            PROCHAINS SPECTACLES
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Spectacles ouverts à partir de 18 ans.
            <br />
            Des tables VIP sont disponibles sur demande.
          </p>
        </div>

        {/* List */}
        <div className="space-y-6">
          {shows.map((show, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">{show.date}</p>
                <p className="text-sm">{show.title}</p>
              </div>

              <button className="border border-white px-4 py-1 rounded-full text-xs hover:bg-white hover:text-black transition">
                RÉPONDRE
              </button>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => router.push("/events")}
          className="mt-10 bg-red-500 px-6 py-2 rounded-full w-fit hover:bg-red-600 transition"
        >
          Voir plus
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 bg-red-600 items-center justify-center relative">
        <img
          src="/images/show.jpg"
          alt="show"
          className="w-64 h-80 object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
