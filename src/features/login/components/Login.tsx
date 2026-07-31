"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string>) => void;
        };
      };
    };
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C41.201 35.244 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function ClerkMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  );
}

export interface LoginProps {
  appName?: string;
  onGoogleSignIn?: () => void;
  onGoogleCredential?: (idToken: string) => void;
  onContinue?: (email: string) => void;
  onSignUp?: () => void;
  devMode?: boolean;
  className?: string;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function Login({
  appName = "test",
  onGoogleSignIn,
  onGoogleCredential,
  onContinue,
  onSignUp,
  devMode = true,
  className,
  isSubmitting = false,
  error,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [googleScriptReady, setGoogleScriptReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // Only render Google's real button once we have both a Client ID and a
  // handler to send the credential to. Otherwise fall back to the static
  // placeholder button below.
  const hasRealGoogleAuth = Boolean(googleClientId && onGoogleCredential);

  useEffect(() => {
    if (!googleScriptReady || !hasRealGoogleAuth || !googleButtonRef.current) return;
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId!,
      callback: (response) => onGoogleCredential!(response.credential),
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: "336",
    });
  }, [googleScriptReady, hasRealGoogleAuth, googleClientId, onGoogleCredential]);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    onContinue?.(email);
  }

  return (
    <div className={cn("flex w-full flex-col items-center px-4 py-8 sm:py-12", className)}>
      {hasRealGoogleAuth && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onReady={() => setGoogleScriptReady(true)}
        />
      )}
      <div className="mb-6 flex flex-col items-center gap-1">
        <Image src="/logo.png" alt="Гурван Дэлгэр ХХК" width={347} height={270} className="h-14 w-auto sm:h-16" />
        <span className="text-sm font-medium text-neutral-500">Гурван Дэлгэр ХХК</span>
      </div>

      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
        <div className="flex flex-col gap-6 px-5 pt-7 pb-6 sm:px-6 sm:pt-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-xl font-bold text-neutral-900">
              Асуулт хариултын апп руу тавтай морилно уу
            </h1>
            <p className="text-sm text-neutral-500">
               Үргэлжлүүлэхийн тулд нэвтэрнэ үү
            </p>
          </div>

          {hasRealGoogleAuth ? (
            <div ref={googleButtonRef} className="flex w-full justify-center" />
          ) : (
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <GoogleIcon className="size-4" />
              Google-ээр үргэлжлүүлэх
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">эсвэл</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-900"
              >
                И-мэйл хаяг
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="И-мэйл хаягаа оруулна уу"
                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Үргэлжлүүлж байна..." : "Үргэлжлүүлэх"}
              <ArrowRight className="size-4" />
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50 py-4 text-center text-sm text-neutral-500">
          {" "}
          <button
            type="button"
            onClick={onSignUp}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
          
          </button>
        </div>

        <div
          className="relative overflow-hidden border-t border-neutral-100 py-3 text-center"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(251,146,60,0.08) 0 6px, transparent 6px 12px)",
          }}
        >
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-400">
            <span>Хамгаалагдсан:</span>
            <span className="flex items-center gap-1 font-semibold text-neutral-600">
              <ClerkMark className="size-3.5" />
              
            </span>
          </div>
          {devMode && (
            <div className="mt-0.5 text-xs font-medium text-orange-500">
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
