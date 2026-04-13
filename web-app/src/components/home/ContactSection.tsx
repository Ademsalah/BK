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
    <section id="contact" className="bg-red-600 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-14"
      >
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Nous contacter
            </h2>

            <div className="space-y-6 text-gray-700">
              <div className="flex items-start gap-4">
                <MapPin className="text-red-600" />
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p>47 rue des Couronnes</p>
                  <p>75020 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-red-600" />
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p>info@monsite.fr</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-red-600" />
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p>01 23 45 67 89</p>
                </div>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-8">
              {/* <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Instagram />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Youtube />} /> */}
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <textarea
              name="message"
              placeholder="Votre message..."
              value={form.message}
              onChange={handleChange}
              className="w-full h-36 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-[1.02]"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* MAP */}
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://maps.google.com/maps?q=Paris&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-64 border-0"
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
}

/* INPUT COMPONENT */
function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
    />
  );
}

/* SOCIAL ICON */
function SocialIcon({ icon }) {
  return (
    <div className="p-3 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white cursor-pointer transition transform hover:scale-110">
      {icon}
    </div>
  );
}
