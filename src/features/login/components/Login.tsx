"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  onContinue,
  onSignUp,
  devMode = true,
  className,
  isSubmitting = false,
  error,
}: LoginProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    onContinue?.(email);
  }

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <div className="mb-6 flex flex-col items-center gap-1">
        <Image src="/logo.png" alt="Гурван Дэлгэр ХХК" width={347} height={270} className="h-16 w-auto" />
        <span className="text-sm font-medium text-neutral-500">Гурван Дэлгэр ХХК</span>
      </div>

      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
        <div className="flex flex-col gap-6 px-6 pt-8 pb-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-xl font-bold text-neutral-900">
              Sign in to {appName}
            </h1>
            <p className="text-sm text-neutral-500">
              Welcome back! Please sign in to continue
            </p>
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <GoogleIcon className="size-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-900"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Continuing..." : "Continue"}
              <ArrowRight className="size-4" />
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50 py-4 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Sign up
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
            <span>Secured by</span>
            <span className="flex items-center gap-1 font-semibold text-neutral-600">
              <ClerkMark className="size-3.5" />
              clerk
            </span>
          </div>
          {devMode && (
            <div className="mt-0.5 text-xs font-medium text-orange-500">
              Development mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
