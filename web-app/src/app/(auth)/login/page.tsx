"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "./loginSchema";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const Router  = useRouter();
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
    console.log("LOGIN DATA:", data);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email: data.email,
        password: data.password,
      });

      // save token (example)
      localStorage.setItem("token", res.data.token);
Router.push("/");
      alert("Login successful!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-5">
      <h2 className="text-center font-semibold text-[rgb(7,23,59)]">
        Welcome Back!
      </h2>

      <Input
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <Input
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      <Button title="Login" onClick={handleSubmit(onSubmit)} />

      <p className="text-center text-sm text-[#07173b]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500">
          Signup
        </Link>
      </p>
    </div>
  );
}
