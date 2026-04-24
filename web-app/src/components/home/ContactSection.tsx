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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message envoyé !");
  };

  return (
    <section id="contact" className="bg-red-600 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          
          {/* LEFT SIDE */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
              Nous contacter
            </h2>

            <div className="space-y-5 sm:space-y-6 text-gray-700">
              <Info icon={<MapPin className="text-red-600" />} title="Adresse">
                47 rue des Couronnes <br />
                75020 Paris, France
              </Info>

              <Info icon={<Mail className="text-red-600" />} title="E-mail">
                info@monsite.fr
              </Info>

              <Info icon={<Phone className="text-red-600" />} title="Téléphone">
                01 23 45 67 89
              </Info>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                name="firstName"
                placeholder="Prénom *"
                value={form.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Nom de famille *"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            {/* CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                name="phone"
                placeholder="Téléphone *"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="E-mail *"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* MESSAGE */}
            <textarea
              name="message"
              placeholder="Votre message..."
              value={form.message}
              onChange={handleChange}
              className="w-full h-28 sm:h-36 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition active:scale-[0.98]"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* MAP */}
        <div className="mt-10 sm:mt-12 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://maps.google.com/maps?q=Paris&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-52 sm:h-64 border-0"
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- COMPONENTS ---------- */

function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
    />
  );
}

function Info({ icon, title, children }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {icon}
      <div>
        <p className="font-semibold text-sm sm:text-base">{title}</p>
        <p className="text-sm sm:text-base">{children}</p>
      </div>
    </div>
  );
}