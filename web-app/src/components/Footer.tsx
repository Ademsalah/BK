"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-4">BK EVENTS</h2>

          <p className="text-sm text-white/80 leading-relaxed">
            Nous créons des événements uniques et mémorables avec passion,
            créativité et professionnalisme.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="hover:text-white transition cursor-pointer">
              Accueil
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Services
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Événements
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Tunis, Centre Ville
            </li>

            <li className="flex items-center gap-2">
              <Phone size={16} /> +216 00 000 000
            </li>

            <li className="flex items-center gap-2">
              <Mail size={16} /> contact@bkevents.com
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold mb-4">Actualités & Nouveautés</h3>

          <p className="text-sm text-white/80 mb-4">
            Recevez nos dernières actualités directement dans votre boîte mail.
          </p>

          {/* MODERN INPUT */}
          <div className="flex items-center border border-white/30 rounded-xl bg-white/10 backdrop-blur-md overflow-hidden">
            <input
              type="email"
              placeholder="Votre email"
              className="
      flex-1 px-4 py-3
      text-sm text-white
      bg-transparent
      placeholder-white/60
      outline-none
      min-w-0
    "
            />

            <button
              className="
      flex-shrink-0
      whitespace-nowrap
      px-6 py-3
      bg-white text-red-600
      text-sm font-semibold
      hover:bg-gray-100
      transition
    "
            >
              S’abonner
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/70">
        © 2026 BK EVENTS. Tous droits réservés.{" "}
      </div>
    </footer>
  );
}
