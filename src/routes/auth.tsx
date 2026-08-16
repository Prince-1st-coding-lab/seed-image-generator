import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

import logo from "@/assets/amigos-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Amigos Wooden Vases" },
      { name: "description", content: "Sign in to manage the Amigos Wooden Vases website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin sign in — Amigos Wooden Vases" },
      { property: "og:description", content: "Private area for the website owner." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      await claimFirstAdmin().catch(() => undefined);
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <img src={logo.url} alt="Amigos Wooden Vases logo" className="mx-auto h-14 w-auto" />
      <h1 className="mt-8 text-center text-3xl tracking-tight">Admin area</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Sign in to manage designs and gallery photos.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <div>
          <label htmlFor="email" className="eyebrow">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="eyebrow">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "signin"
          ? "First time? Create the owner account"
          : "Already have an account? Sign in"}
      </button>

      <Link to="/" className="mt-4 text-center text-xs text-muted-foreground hover:text-foreground">
        Back to website
      </Link>
    </main>
  );
}
