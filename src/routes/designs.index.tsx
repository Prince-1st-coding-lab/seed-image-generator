import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/product-card";
import { categoriesQuery, publishedProductsQuery } from "@/lib/catalog";
import { generalWhatsappLink } from "@/lib/site";

type Search = { category?: string | undefined };

export const Route = createFileRoute("/designs/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search['category'] === "string" ? (search['category'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Designs & Catalog — Amigos Wooden Vases, Kigali" },
      {
        name: "description",
        content:
          "Browse wooden vases, TV stands, dining tables, side tables and other wooden designs made by Amigos Wooden Vases in Kigali.",
      },
      { property: "og:title", content: "Designs & Catalog — Amigos Wooden Vases" },
      {
        property: "og:description",
        content: "Wooden vases, tables, TV stands and custom wooden designs made in Kigali.",
      },
    ],
  }),
  component: Designs,
});

function Designs() {
  const { category } = Route.useSearch();
  const products = useQuery(publishedProductsQuery);
  const categories = useQuery(categoriesQuery);

  const visible = (products.data ?? []).filter((p) =>
    category ? p.categories?.slug === category : true,
  );
  const usedSlugs = new Set((products.data ?? []).map((p) => p.categories?.slug));
  const filters = (categories.data ?? []).filter((c) => usedSlugs.has(c.slug));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow">Our designs</p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-tight tracking-tight sm:text-6xl">
        Wooden designs for
        <span className="italic text-primary"> your space</span>
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Vases, tables, TV stands and other wooden pieces. Tap a design to see more photos and send
        us a message about it.
      </p>

      {filters.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Link
            to="/designs"
            search={{}}
            className={`rounded-sm border px-4 py-2 text-xs tracking-wide transition-colors ${
              !category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            All
          </Link>
          {filters.map((c) => (
            <Link
              key={c.id}
              to="/designs"
              search={{ category: c.slug }}
              className={`rounded-sm border px-4 py-2 text-xs tracking-wide transition-colors ${
                category === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {products.isLoading ? (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-card" />
          ))}
        </div>
      ) : products.isError ? (
        <p className="mt-14 text-sm text-muted-foreground">
          We couldn&apos;t load the designs right now. Please refresh the page or contact us
          directly.
        </p>
      ) : visible.length === 0 ? (
        <div className="mt-14 border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display text-2xl">Designs are being added</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            We&apos;re preparing photos of our work. In the meantime, message us on WhatsApp and we
            will send you what is available.
          </p>
          <a
            href={generalWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Ask on WhatsApp
          </a>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
