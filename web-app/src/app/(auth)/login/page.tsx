"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-5">
      <h2 className="text-center font-semibold text-[rgb(7,23,59)]">
        Welcome Back!
      </h2>

      <Input label="Username" />
      <Input label="Password" type="password" />

      <Button title="Login" />

      <p className="text-center text-sm text-[#07173b]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500">
          Signup
        </Link>
      </p>

      
    </div>
  );
}
