"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureUserRow } from "@/lib/supabase/users";

type AuthMode = "signup" | "signin";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const trimmedEmail = email.trim();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          await ensureUserRow(supabase, data.user.id, trimmedEmail);
        }

        if (data.session) {
          router.push("/swipe");
          router.refresh();
          return;
        }

        setMessage("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

        if (signInError) throw signInError;

        if (data.user) {
          await ensureUserRow(supabase, data.user.id, trimmedEmail);
        }

        router.push("/swipe");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-4xl font-medium italic text-black">
          Yevo
        </h1>
        <p className="mt-2 text-center text-sm text-black/50">
          For you, by you.
        </p>

        <div
          className="mt-10 flex border-b border-black/10"
          role="tablist"
          aria-label="Authentication mode"
        >
          {(
            [
              { id: "signup" as const, label: "Sign Up" },
              { id: "signin" as const, label: "Sign In" },
            ] as const
          ).map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setMode(tab.id);
                  setError(null);
                  setMessage(null);
                }}
                className={[
                  "flex-1 py-2.5 text-sm tracking-wide transition-colors",
                  isActive
                    ? "border-b border-black text-black"
                    : "text-black/45 hover:text-black/70",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-black/15 bg-white px-4 py-3.5 text-base text-black placeholder:text-black/35 outline-none focus:border-black/40"
            />
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-black/15 bg-white px-4 py-3.5 text-base text-black placeholder:text-black/35 outline-none focus:border-black/40"
            />
          </label>

          {error ? (
            <p className="text-center text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="text-center text-sm text-black/55">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-3.5 text-sm tracking-wide text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Please wait…" : "Continue with email"}
          </button>
        </form>
      </div>
    </main>
  );
}
