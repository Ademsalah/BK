"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchema } from "./signupSchema";
import axios from "axios";

export default function SignupPage() {
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

      alert("Registration successful!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-5">
      <h2 className="text-center font-semibold !text-[#07173b]">
        Please Fill out form to Sign Up!
      </h2>

      {/* Controller-based Inputs */}
      <Input
        name="name"
        control={control}
        label="Full name"
        placeholder="Enter your name"
      />

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

      {/* Submit */}
      <Button title="Register" onClick={handleSubmit(onSubmit)} />

      <p className="text-center text-sm text-[#07173b]">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
}
