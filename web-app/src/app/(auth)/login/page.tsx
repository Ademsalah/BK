"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "./loginSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = res.data;

      // save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      toast.success("Connexion réussie 🎉");

      // get saved redirect path
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      // remove after use
      localStorage.removeItem("redirectAfterLogin");

      // redirect to previous page
      if (redirectPath) {
        router.push(redirectPath);
        return;
      }

      // default redirects
      if (user.role === "ADMIN") {
        router.push("/dashboard");
      } else if (user.role === "PARTICIPANT") {
        router.push("/home");
      } else if (user.role === "PRESTATAIRE") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Email ou mot de passe invalide";

      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/10 backdrop-blur-xl  shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-white">
      <div className="flex flex-col items-center ">
        <img
          src="/circle.png"
          alt="BK Events"
          className="w-20 h-20 object-contain drop-shadow-lg "
        />
        <span className="text-white/70">BK Events</span>
      </div>
      <div className="text-center mb-6 space-y-3">
        <div className="inline-flex items-center justify-center px-3 py-1 text-xs bg-white/10 border border-white/10 rounded-full text-white/60 mx-auto backdrop-blur-md">
          Plateforme événementielle
        </div>

        <h1 className="text-2xl font-bold tracking-wide text-white/90">
          Bienvenue à BK Events
        </h1>

        <p className="text-sm text-white/50">
          Connectez-vous pour accéder à votre espace et gérer vos événements
        </p>
      </div>

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

      <Button
        title="Se connecter"
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-white/70 text-black font-semibold hover:bg-white"
      />

      <p className="text-center text-sm text-white/40">
        Vous n'avez pas de compte ?{" "}
        <Link href="/signup" className="text-white/60 font-medium underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
