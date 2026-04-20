"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen grid md:grid-cols-2">
      {/* LEFT IMAGE SIDE */}
      <div className="relative h-[400px] md:h-auto">
        <img
          src="/images/event.jpg" // 👈 replace with your image
          alt="event"
          className="w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#1c0f2e]/80"></div>

        {/* BIG TEXT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold tracking-widest text-center leading-tight">
            <span className="text-[#e6000a]">BK</span> <br /> EVENTS
          </h1>
        </div>
      </div>

      {/* RIGHT CONTENT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100 flex flex-col justify-center px-10 md:px-16 py-16 text-center"
      >
        {/* ICON */}
        <div className="text-red-600 text-4xl mb-6">✕</div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold tracking-widest text-red-600 mb-6">
          À PROPOS <br /> DE BK EVENTS
        </h2>

        {/* TEXT */}
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          BK Events est une entreprise tunisienne spécialisée dans
          l’événementiel, la communication et les solutions digitales. Nous
          accompagnons nos clients dans la création et la réussite de leurs
          projets avec innovation et professionnalisme.
        </p>

        <p className="text-gray-500 text-sm mt-6 max-w-md mx-auto">
          Notre objectif est d’apporter une réelle valeur ajoutée grâce à des
          solutions modernes, créatives et adaptées aux besoins de chaque
          client.
        </p>
      </motion.div>
    </section>
  );
}
