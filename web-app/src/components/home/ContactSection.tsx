"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
    alert("Message envoyé !");
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6">

      {/* CONTACT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          max-w-6xl mx-auto
          bg-white
          rounded-3xl
          shadow-xl
          border border-gray-100
          p-6 sm:p-10 md:p-14
        "
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Nous contacter
            </h2>

            <div className="space-y-6 text-gray-700">

              <Info icon={<MapPin className="text-red-500" />} title="Adresse">
                47 rue des Couronnes <br />
                75020 Paris, France
              </Info>

              <Info icon={<Mail className="text-red-500" />} title="E-mail">
                info@monsite.fr
              </Info>

              <Info icon={<Phone className="text-red-500" />} title="Téléphone">
                01 23 45 67 89
              </Info>

            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="Prénom *"
                value={form.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Nom *"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Téléphone *"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="message"
              placeholder="Votre message..."
              value={form.message}
              onChange={handleChange}
              className="
                w-full h-36 p-4 rounded-xl
                bg-gray-50
                text-gray-900 placeholder-gray-400
                border border-gray-200
                focus:ring-2 focus:ring-red-400
                outline-none transition
              "
            />

            <button
              type="submit"
              className="
                w-full bg-red-500 text-white
                py-3 rounded-xl font-semibold
                hover:bg-red-600 transition
                active:scale-[0.98]
              "
            >
              Envoyer le message
            </button>

          </form>

        </div>
      </motion.div>

      {/* MAP SECTION (FULL WIDTH) */}
      <div className="mt-16 w-full">
        <div className="w-full h-72 sm:h-80 md:h-96 overflow-hidden shadow-lg border border-gray-200 rounded-2xl">
          <iframe
            src="https://maps.google.com/maps?q=Tunis%20Centre%20Ville&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>

    </section>
  );
}

/* ---------- INPUT ---------- */

function Input({ name, value, onChange, placeholder, type = "text" }: any) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="
        w-full p-4 rounded-xl
        bg-gray-50
        text-gray-900 placeholder-gray-400
        border border-gray-200
        focus:ring-2 focus:ring-red-400
        outline-none transition
      "
    />
  );
}

/* ---------- INFO ---------- */

function Info({ icon, title, children }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  );
}