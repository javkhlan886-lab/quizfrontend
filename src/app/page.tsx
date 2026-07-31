"use client";

import { useRouter } from "next/navigation";
import Login from "@/features/login/components/Login";

export default function Home() {
  const router = useRouter();

  return <Login onContinue={() => router.push("/home")} />;
}
