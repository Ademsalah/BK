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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      {/* Glass Card */}
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            ✨ Create Your Event
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Fill the details and bring your event to life
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <Input
            name="title"
            control={control}
            label="Title"
            placeholder="Amazing concert..."
          />
          <Input
            name="description"
            control={control}
            label="Description"
            placeholder="What is your event about?"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input name="date" control={control} label="Date" type="date" />
            <Input
              name="location"
              control={control}
              label="Location"
              placeholder="Tunis..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              name="capacity"
              control={control}
              label="Capacity"
              type="number"
            />
            <Input
              name="ticketPrice"
              control={control}
              label="Ticket"
              type="number"
            />
            <Input
              name="totalBudget"
              control={control}
              label="Budget"
              type="number"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit(onSubmit)}
          className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
