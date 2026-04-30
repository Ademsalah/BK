"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { prestataireSchema } from "./prestataireSchema";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreatePrestatairePage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // 👈 edit mode if exists
  const router = useRouter();

  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(prestataireSchema),
  });

  // 🔐 token
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  // 📥 fetch prestataire if edit mode
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/prestataires/${id}`);

        reset(res.data); // fill form
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, reset]);

  // 🚀 submit (create or update)
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isEdit) {
        // ✏️ UPDATE
        await axios.put(`http://localhost:5000/prestataires/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Prestataire modifié avec successe ");
      } else {
        // ➕ CREATE
        await axios.post(
          "http://localhost:5000/prestataires/create-prestataire",
          data,
          //   {
          //     headers: { Authorization: `Bearer ${token}` },
          //   },
        );

       toast.success("Prestataire créé avec successe ");
      }

      router.push("/dashboard/prestataireD");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen p-8 bg-white flex justify-center">
    <div className="w-full max-w-2xl rounded-2xl bg-slate-700 shadow-2xl p-8 border border-white/10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        {isEdit ? "Modifier le prestataire" : "Créer un prestataire"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">

        {/* NAME */}
        <div>
          <label className="text-white text-sm mb-1 block">Nom</label>
          <input
            {...register("name")}
            placeholder="Nom"
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          />
          <p className="text-red-400 text-sm mt-1">{errors.name?.message}</p>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-white text-sm mb-1 block">Email</label>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          />
          <p className="text-red-400 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-white text-sm mb-1 block">
            Catégorie
          </label>

          <select
            {...register("category")}
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="MUSICIEN">🎧 Musicien</option>
            <option value="TRAITEUR">🍽️ Traiteur</option>
            <option value="SALLE">🏛️ Salle</option>
            <option value="DECORATION">🎨 Décoration</option>
          </select>

          <p className="text-red-400 text-sm mt-1">
            {errors.category?.message}
          </p>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-white text-sm mb-1 block">
              Prix minimum
            </label>
            <input
              type="number"
              {...register("priceMin")}
              className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">
              Prix maximum
            </label>
            <input
              type="number"
              {...register("priceMax")}
              className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
            />
          </div>

        </div>

        {/* LOCATION */}
        <div>
          <label className="text-white text-sm mb-1 block">Lieu</label>
          <input
            {...register("location")}
            placeholder="Lieu"
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-white text-sm mb-1 block">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          />
        </div>

        {/* RATING */}
        <div>
          <label className="text-white text-sm mb-1 block">Note</label>
          <input
            type="number"
            step="0.1"
            {...register("rating")}
            className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="mt-4 w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
        >
          {isEdit ? "Mettre à jour" : "Créer le prestataire"}
        </button>

      </form>
    </div>
  </div>
);
}
