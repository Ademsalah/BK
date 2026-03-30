"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-5">
      <h2 className="text-center font-semibold !text-[#07173b]">
        Please Fill out form to Sign Up!
      </h2>

      <Input label="Full name" />
      <Input label="Username" />
      <Input label="Email" type="email" />
      <Input label="Password" type="password" />
      <Input label="Confirm Password" type="password" />

      <Button title="Register" />

      <p className="text-center text-sm text-[#07173b]">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </p>

      <div className="flex justify-center gap-4 text-xl">
        <span>🌐</span>
        <span>💬</span>
        <span>📩</span>
      </div>
    </div>
  );
}
