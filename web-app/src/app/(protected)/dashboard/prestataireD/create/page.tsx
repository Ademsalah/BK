"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { prestataireSchema } from "./prestataireSchema";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
        const res = await axios.get(`http://localhost:3000/prestataires/${id}`);

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
        await axios.put(`http://localhost:3000/prestataires/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Prestataire updated ✅");
      } else {
        // ➕ CREATE
        await axios.post(
          "http://localhost:3000/prestataires/create-prestataire",
          data,
          //   {
          //     headers: { Authorization: `Bearer ${token}` },
          //   },
        );

        alert("Prestataire created ✅");
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
    <div className="max-w-2xl mx-auto mt-10 bg-black p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-white">
        {isEdit ? "Update Prestataire" : "Create Prestataire"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <input {...register("name")} placeholder="Name" className="input" />
        <p className="text-red-500">{errors.name?.message}</p>

        <input {...register("email")} placeholder="Email" className="input" />
        <p className="text-red-500">{errors.email?.message}</p>

        {/* password only on create */}
        {/* {!isEdit && (
          <input
            type="password"
            {...register("password")}
            placeholder="Temporary Password"
            className="input"
          />
        )} */}

        <select {...register("category")} className="input">
          <option value="">Select Category</option>
          <option value="MUSICIEN">MUSICIEN</option>
          <option value="TRAITEUR">TRAITEUR</option>
          <option value="SALLE">SALLE</option>
          <option value="DECORATION">DECORATION</option>
        </select>
        <p className="text-red-500">{errors.category?.message}</p>

        <div className="flex gap-2">
          <input
            type="number"
            {...register("priceMin")}
            placeholder="Min Price"
            className="input"
          />

          <input
            type="number"
            {...register("priceMax")}
            placeholder="Max Price"
            className="input"
          />
        </div>

        <input
          {...register("location")}
          placeholder="Location"
          className="input"
        />

        <textarea
          {...register("description")}
          placeholder="Description"
          className="input"
        />

        <input
          type="number"
          step="0.1"
          {...register("rating")}
          placeholder="Rating"
          className="input"
        />

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 text-white py-2 rounded"
        >
          {isEdit ? "Update Prestataire" : "Create Prestataire"}
        </button>
      </form>
    </div>
  );
}
