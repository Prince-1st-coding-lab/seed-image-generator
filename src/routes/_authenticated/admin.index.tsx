import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { StorageImage } from "@/components/storage-image";
import { supabase } from "@/integrations/supabase/client";
import { allProductsQuery, formatPrice, type Product } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Manage designs — Amigos Wooden Vases" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProducts,
});

function AdminProducts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(allProductsQuery);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  const toggle = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from("products")
        .update({ status: product.status === "published" ? "draft" : "published" })
        .eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (product: Product) => {
      const paths = (product.product_images ?? []).map((i) => i.storage_path);
      if (paths.length) await supabase.storage.from("product-images").remove(paths);
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return (
    <AdminShell title="Designs">
      <div className="flex justify-end">
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New design
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading designs…</p>
      ) : (data ?? []).length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No designs yet. Add your first one.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {(data ?? []).map((p) => {
            const cover = [...(p.product_images ?? [])].sort(
              (a, b) => a.sort_order - b.sort_order,
            )[0];
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 py-4">
                <StorageImage
                  path={cover?.storage_path}
                  alt={p.name}
                  className="h-16 w-16 object-cover"
                />
                <div className="min-w-40 flex-1">
                  <Link
                    to="/admin/products/$id"
                    params={{ id: p.id }}
                    className="font-display text-lg hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.categories?.name ?? "No category"}
                    {formatPrice(p.price, p.currency) ? ` · ${formatPrice(p.price, p.currency)}` : ""}
                    {` · ${p.product_images?.length ?? 0} photo(s)`}
                  </p>
                </div>
                <span
                  className={`rounded-sm px-3 py-1 text-xs ${
                    p.status === "published"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
                <button
                  type="button"
                  onClick={() => toggle.mutate(p)}
                  className="rounded-sm border border-border px-3 py-2 text-xs hover:bg-secondary"
                >
                  {p.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${p.name}`}
                  onClick={() => {
                    if (confirm(`Delete "${p.name}"? This cannot be undone.`)) remove.mutate(p);
                  }}
                  className="rounded-sm border border-border p-2 text-destructive hover:bg-secondary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
