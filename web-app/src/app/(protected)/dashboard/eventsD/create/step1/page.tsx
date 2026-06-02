"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { createEventSchema } from "../event.schema";
import Input from "@/components/ui/Input";
import { eventAtom } from "@/atoms/EventAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateEvent() {
  const [, setEvent] = useAtom(eventAtom);
  const router = useRouter();

  const [photos, setPhotos] = useState<File[]>([]);
  const MAX_PHOTOS = 5;

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      totalBudget: 0,
      ticketPrice: 0,
      capacity: 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("date", new Date(data.date).toISOString());
      formData.append("location", data.location);
      formData.append("totalBudget", String(data.totalBudget));
      formData.append("ticketPrice", String(data.ticketPrice));
      formData.append("capacity", String(data.capacity));

      photos.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await axios.post("http://localhost:5000/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEvent(res.data);
      reset();
      setPhotos([]);

      router.push("/dashboard/eventsD/create/step2");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-700 shadow-2xl p-8 border border-white/10">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Créer un événement</h1>
          <p className="text-gray-300 text-sm mt-2">
            Remplissez les informations pour créer votre événement
          </p>
        </div>

        {/* FORM INPUTS */}
        <div className="space-y-5">
          <Input
            name="title"
            control={control}
            label="Titre"
            placeholder="Concert incroyable..."
            className="bg-white text-gray-900"
            labelClassName="text-white"
          />

          <Input
            name="description"
            control={control}
            label="Description"
            placeholder="De quoi parle votre événement ?"
            className="bg-white text-gray-900"
            labelClassName="text-white"

          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="date"
              control={control}
              label="Date"
              type="date"
              className="w-full p-2 rounded text-black bg-white "
            labelClassName="text-white"

            />

            <Input
              name="location"
              control={control}
              label="Lieu"
              placeholder="Tunis..."
              className="bg-white text-gray-900"
            labelClassName="text-white"

            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              name="capacity"
              control={control}
              label="Capacité"
              type="number"
              className="bg-white text-gray-900"
            labelClassName="text-white"

            />

            <Input
              name="ticketPrice"
              control={control}
              label="Prix billet"
              type="number"
              className="bg-white text-gray-900"
            labelClassName="text-white"

            />

            <Input
              name="totalBudget"
              control={control}
              label="Budget total"
              type="number"
              className="bg-white text-gray-900"
            labelClassName="text-white"

            />
          </div>
        </div>

        {/* PHOTO UPLOAD */}
        <div className="space-y-3 mt-6 ">
          <label className="text-white font-medium text-sm">
            Photos ({photos.length}/{MAX_PHOTOS})
          </label>

          <div className="relative border-2 border-dashed border-white/30 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={photos.length >= MAX_PHOTOS}
              onChange={(e) => {
                if (!e.target.files) return;

                const newFiles = Array.from(e.target.files);

                setPhotos((prev) => {
                  const combined = [...prev, ...newFiles];

                  if (combined.length > MAX_PHOTOS) {
                    alert("Maximum 5 photos allowed");
                  }

                  return combined.slice(0, MAX_PHOTOS);
                });

                e.target.value = "";
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <div className="text-center text-white ">
              <p className="text-sm font-medium">
                Ajouter des photos de l’événement
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Maximum 5 images (PNG, JPG, WEBP)
              </p>
            </div>
          </div>

          {/* PREVIEW */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {photos.slice(0, MAX_PHOTOS).map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-white/20"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit(onSubmit)}
          className="mt-8 w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
