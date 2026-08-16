import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin-shell";
import { ProductEditor } from "@/components/product-editor";

export const Route = createFileRoute("/_authenticated/admin/products/new")({
  head: () => ({
    meta: [{ title: "New design — Amigos Wooden Vases" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AdminShell title="New design">
      <ProductEditor />
    </AdminShell>
  ),
});
