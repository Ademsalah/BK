"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "ADMIN") {
      router.push("/dashboard/eventsD");
    }

    if (role === "PRESTATAIRE") {
      router.push("/dashboard/myEvents");
    }
  }, []);

  return null;
}