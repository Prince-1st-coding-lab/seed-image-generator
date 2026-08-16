import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/hooks/use-admin";

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { loading, isAdmin, email } = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/admin" className="font-display text-xl">
              Admin
            </Link>
            <nav className="flex gap-5 text-sm text-muted-foreground" aria-label="Admin">
              <Link to="/admin" activeProps={{ className: "text-primary" }}>
                Designs
              </Link>
              <Link to="/admin/gallery" activeProps={{ className: "text-primary" }}>
                Gallery
              </Link>
              <Link to="/" className="hover:text-foreground">
                View site
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {email && <span className="hidden sm:inline">{email}</span>}
            <button
              type="button"
              onClick={signOut}
              className="rounded-sm border border-border px-3 py-2 hover:bg-secondary"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl tracking-tight">{title}</h1>
        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : !isAdmin ? (
          <p className="mt-8 max-w-lg text-sm text-muted-foreground">
            This account does not have admin access. Ask the website owner to grant it.
          </p>
        ) : (
          <div className="mt-8">{children}</div>
        )}
      </main>
    </div>
  );
}
