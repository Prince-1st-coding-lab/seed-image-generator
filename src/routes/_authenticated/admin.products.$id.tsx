import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AdminShell } from "@/components/admin-shell";
import { ProductEditor } from "@/components/product-editor";
import { allProductsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/products/$id")({
  head: () => ({
    meta: [{ title: "Edit design — Amigos Wooden Vases" }, { name: "robots", content: "noindex" }],
  }),
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(allProductsQuery);
  const product = (data ?? []).find((p) => p.id === id);

  return (
    <AdminShell title={product?.name ?? "Edit design"}>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !product ? (
        <p className="text-sm text-muted-foreground">This design no longer exists.</p>
      ) : (
        <ProductEditor product={product} />
      )}
    </AdminShell>
  );
}
