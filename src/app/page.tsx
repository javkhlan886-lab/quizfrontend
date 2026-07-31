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

  async function loginWith(path: string, body: Record<string, string>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(apiUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <Login
      onContinue={(email) => loginWith("/api/auth/login", { email })}
      onGoogleCredential={(idToken) => loginWith("/api/auth/google", { idToken })}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
