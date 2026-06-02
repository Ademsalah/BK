"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchema } from "./signupSchema";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    console.log("FORM DATA:", data);

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      alert("Inscription réussie !");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-white">
      
      {/* Logo Section (same as login) */}
      <div className="flex flex-col items-center ">
        <img
          src="/circle.png"
          alt="BK Events"
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
        <span className="text-white/70">BK Events</span>
      </div>

      {/* Title Section (same style as login) */}
      <div className="text-center mb-6 space-y-3">
        <div className="inline-flex items-center justify-center px-3 py-1 text-xs bg-white/10 border border-white/10 rounded-full text-white/60 mx-auto backdrop-blur-md">
          Plateforme événementielle
        </div>

        <h1 className="text-2xl font-bold tracking-wide text-white/90">
          Créer un compte BK Events
        </h1>

        <p className="text-sm text-white/50">
          Inscrivez-vous pour accéder à votre espace événementiel
        </p>
      </div>

      {/* Inputs */}
      <Input
        name="name"
        control={control}
        label="Nom complet"
        placeholder="Entrez votre nom"
        className="text-white placeholder:text-white/25"
        labelClassName="text-white/60 font-semibold"
      />

      <Input
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="Entrez votre email"
        className="text-white placeholder:text-white/25"
        labelClassName="text-white/60 font-semibold"
      />

      <Input
        name="password"
        control={control}
        label="Mot de passe"
        type="password"
        placeholder="Entrez votre mot de passe"
        className="text-white placeholder:text-white/25"
        labelClassName="text-white/60 font-semibold"
      />

      {/* Button */}
      <Button
        title="S'inscrire"
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-white/70 text-black font-semibold hover:bg-white"
      />

      {/* Footer link */}
      <p className="text-center text-sm text-white/40">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-white/60 font-medium underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}