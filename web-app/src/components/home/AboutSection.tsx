"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh] md:min-h-[80vh]"
    >
      {/* LEFT IMAGE SIDE */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative w-full h-[280px] sm:h-[380px] md:h-full"
      >
        <Image
          src="/bkevent.png"
          alt="Event Image"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* RIGHT CONTENT SIDE */}
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-[#1c0f2e] flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 text-center"
      >
        <div className="text-red-600 text-3xl sm:text-4xl mb-4">
          ✕
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-red-600 mb-6">
          À PROPOS <br /> DE BK EVENTS
        </h2>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          BK Events est une entreprise tunisienne spécialisée dans
          l’événementiel, la communication et les solutions digitales.
          Nous accompagnons nos clients avec innovation et professionnalisme.
        </p>

        <p className="text-gray-500 text-sm sm:text-base mt-5 max-w-md mx-auto">
          Notre objectif est d’apporter une réelle valeur ajoutée grâce à des
          solutions modernes et créatives adaptées à chaque client.
        </p>
      </motion.div>
    </section>
  );
}