import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Footer() {
  return (
    <footer className="bg-[#07173b] text-white pt-16 px-10">
      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="space-y-4">
          <h2 className="text-red-500 text-2xl font-bold">
            BK. <span className="text-sm text-white">EVENT & LOISIRS</span>
          </h2>

          <p className="text-sm text-gray-300">Tunis, Tunisie</p>

          <div className="text-sm text-gray-300 space-y-1">
            <p>📅 Horaires</p>
            <p>Lundi – Vendredi: 8h30 – 17h30</p>
            <p>Samedi: 9h00 – 13h00</p>
          </div>

          <p className="text-sm">📞 +216 22 136 545</p>
          <p className="text-sm">✉️ bk.event.loisirs@gmail.com</p>
        </div>

        {/* MIDDLE */}
        <div>
          <h3 className="font-semibold mb-4">Lien rapide</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>› Accueil</li>
            <li>› Galerie</li>
            <li>› Services</li>
            <li>› À propos de nous</li>
            <li>› Contactez-Nous</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="font-semibold mb-4">Actualités & Nouveautés</h3>
          <p className="text-sm text-gray-300 mb-4">
            Recevez nos dernières actualités directement dans votre boîte mail.
          </p>

          <div className="flex gap-2">
            <Input type="email" placeholder="Votre Email" textcolor="white" />
            <button className="bg-red-500 px-4 py-2 rounded-full">
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* SOCIAL + COPYRIGHT */}
      <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">
          © 2025 Big House Marketing. Tous droits réservés.
        </p>

        <div className="flex gap-4 mt-4 md:mt-0">
          {/* <Facebook size={18} />
          <Twitter size={18} />
          <Instagram size={18} />
          <Youtube size={18} /> */}
        </div>
      </div>
    </footer>
  );
}
