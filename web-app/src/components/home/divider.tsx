"use client";

import {
  Calendar,
  Users,
  Paintbrush,
  Mountain,
} from "lucide-react";

const services = [
  {
    title: "Organisation d’Événements",
    desc: "Création et gestion complète d’événements sur-mesure pour entreprises et particuliers, sans contrainte.",
    icon: Calendar,
  },
  {
    title: "Team Building & Cohésion d’Équipe",
    desc: "Renforcez la cohésion de vos équipes grâce à des activités engageantes, ludiques et interactives.",
    icon: Users,
  },
  {
    title: "Ateliers Créatifs & Artistiques",
    desc: "Stimulez la créativité de vos participants avec des ateliers artistiques, culinaires et jeux immersifs.",
    icon: Paintbrush,
  },
  {
    title: "Activités Sportives & Aventures en Nature",
    desc: "Offrez à vos équipes des aventures uniques en plein air pour vivre des moments forts et inoubliables.",
    icon: Mountain,
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 px-6">
      {/* HEADER */}
      <div className="text-center mb-14">
        <p className="text-red-600 uppercase text-sm font-semibold tracking-widest">
          Nos Services
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-[#1c0f2e] mt-3">
          Découvrez Nos Services
        </h2>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <div
              key={index}
              className=" bg-white border border-gray-100 rounded-2xl p-8 text-center
              shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* ICON */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-600 text-white p-4 rounded-full group-hover:scale-110 transition">
                  <Icon size={28} />
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-[#1c0f2e] mb-3">
                {service.title}
              </h3>

              {/* DESC */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {service.desc}
              </p>
            </div>
          );
        })}
      </div>


    </section>
  );
}