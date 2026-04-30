"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { createEventSchema } from "../event.schema";
import Input from "@/components/ui/Input";
import { eventAtom } from "@/atoms/EventAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const [, setEvent] = useAtom(eventAtom);
  const router = useRouter();

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

      const payload = {
        ...data,
        date: new Date(data.date),
        totalBudget: Number(data.totalBudget || 0),
        ticketPrice: Number(data.ticketPrice || 0),
        capacity: Number(data.capacity || 0),
      };

      const res = await axios.post("http://localhost:5000/events", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvent(res.data);
      reset();
      router.push("/dashboard/eventsD/create/step2");
    } catch (err) {
      console.error(err);
    }
  };

 return (
  <div className="min-h-screen p-8 bg-white flex items-center justify-center">
    {/* Card */}
    <div className="w-full max-w-2xl rounded-2xl bg-slate-700 shadow-2xl p-8 border border-white/10">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          Créer un événement
        </h1>
        <p className="text-gray-300 text-sm mt-2">
          Remplissez les informations pour créer votre événement
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-5">

        <Input
          name="title"
          control={control}
          label="Titre"
          placeholder="Concert incroyable..."
          className="bg-white text-gray-900"
        />

        <Input
          name="description"
          control={control}
          label="Description"
          placeholder="De quoi parle votre événement ?"
          className="bg-white text-gray-900"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="date"
            control={control}
            label="Date"
            type="date"
            className="bg-white text-gray-900"
          />

          <Input
            name="location"
            control={control}
            label="Lieu"
            placeholder="Tunis..."
            className="bg-white text-gray-900"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            name="capacity"
            control={control}
            label="Capacité"
            type="number"
            className="bg-white text-gray-900"
          />

          <Input
            name="ticketPrice"
            control={control}
            label="Prix billet"
            type="number"
            className="bg-white text-gray-900"
          />

          <Input
            name="totalBudget"
            control={control}
            label="Budget total"
            type="number"
            className="bg-white text-gray-900"
          />
        </div>

      </div>

      {/* Button */}
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
