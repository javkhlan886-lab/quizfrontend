"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/features/login/components/Login";
import { apiUrl } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue(email: string) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Нэвтрэхэд алдаа гарлаа.");
      }

      setSession(data.token, data.user);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тодорхойгүй алдаа гарлаа.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Login onContinue={handleContinue} isSubmitting={isSubmitting} error={error} />
  );
}
