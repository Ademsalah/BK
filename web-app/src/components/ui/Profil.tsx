"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "./Input";

const profileSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profil() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [changePasswordMode, setChangePasswordMode] = useState(false);

  // OTP STATES
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const { data } = await axios.get(
          `http://localhost:5000/participants/user/${userId}`,
        );

        reset({
          name: data.name || "",
          email: data.email || "",
          password: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  // STEP 1 → SEND OTP ONLY
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setUpdating(true);

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const payload: any = {
        name: data.name,
      };

      if (changePasswordMode && data.password) {
        payload.password = data.password;
      }

      // send OTP FIRST
      await axios.post(`http://localhost:5000/update/send-otp`, {
        userId,
      });

      setPendingData(payload);
      setOtpStep(true);

      alert("OTP envoyé à votre email 📩");
    } catch (err) {
      console.error(err);
      alert("Erreur envoi OTP ❌");
    } finally {
      setUpdating(false);
    }
  };

  // STEP 2 → VERIFY OTP + UPDATE
  const verifyOtpAndUpdate = async () => {
    try {
      setUpdating(true);

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      await axios.post(`http://localhost:5000/update/verify-otp`, {
        userId,
        otp,
        data: pendingData,
      });

      alert("Profil mis à jour avec succès ✅");

      // reset everything
      setOtpStep(false);
      setOtp("");
      setPendingData(null);
      setChangePasswordMode(false);
    } catch (err) {
      console.error(err);
      alert("OTP invalide ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600 text-center py-10">Chargement...</div>;
  }

  return (
    <div >
      <div className="w-full max-w-3xl p-6 flex flex-col gap-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Mon Profil
        </h2>

        {/* STEP 1 FORM */}
        {!otpStep ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            <Input
              name="name"
              control={control}
              label="Nom complet"
              labelClassName="text-gray-700 font-medium"
              className="bg-white border border-gray-300 text-gray-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <Input
              name="email"
              control={control}
              type="email"
              label="Email"
              labelClassName="text-gray-700 font-medium"
              className="bg-gray-100 border border-gray-300 text-gray-500 rounded-xl"
              disabled
            />

            {changePasswordMode && (
              <Input
                name="password"
                control={control}
                type="password"
                label="Nouveau mot de passe"
                labelClassName="text-gray-700 font-medium"
                className="bg-white border border-gray-300 text-gray-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            )}

            <button
              type="submit"
              disabled={updating}
             className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-md w-fit self-center"
            >
              {updating ? "Envoi OTP..." : "Sauvegarder"}
            </button>

            <button
              type="button"
              onClick={() => setChangePasswordMode((prev) => !prev)}
              className="text-sm font-semibold text-gray-600 hover:text-red-600 transition"
            >
              {changePasswordMode ? "← Retour profil" : "Changer mot de passe"}
            </button>
          </form>
        ) : (
          /* STEP 2 OTP */
          <div className="flex flex-col gap-6 mt-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Code OTP"
              className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            />

            <button
              onClick={verifyOtpAndUpdate}
              disabled={updating}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-md"
            >
              {updating ? "Vérification..." : "Confirmer OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
