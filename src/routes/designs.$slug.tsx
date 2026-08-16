import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";

import { StorageImage } from "@/components/storage-image";
import {
  AVAILABILITY_LABELS,
  formatPrice,
  productBySlugQuery,
} from "@/lib/catalog";
import { SITE, productWhatsappLink } from "@/lib/site";

export const Route = createFileRoute("/designs/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} — Amigos Wooden Vases` },
        {
          name: "description",
          content: `Details and photos of the ${name} design by Amigos Wooden Vases in Kigali, Rwanda.`,
        },
        { property: "og:title", content: `${name} — Amigos Wooden Vases` },
        {
          property: "og:description",
          content: `A wooden design made by Amigos Wooden Vases in Kigali, Rwanda.`,
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product, isLoading, isError } = useQuery(productBySlugQuery(slug));
  const [active, setActive] = useState(0);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24">
        <div className="aspect-[4/3] animate-pulse bg-card" />
      </main>
    );
  }

  if (isError || !product || product.status !== "published") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Design not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This design may have been removed or is not published yet.
        </p>
        <Link
          to="/designs"
          search={{}}
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to designs
        </Link>
      </main>
    );
  }

  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const current = images[active] ?? images[0];
  const price = formatPrice(product.price, product.currency);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <Link
        to="/designs"
        search={{}}
        className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All designs
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-card">
            <StorageImage
              path={current?.storage_path}
              alt={current?.alt_text ?? product.name}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`aspect-square overflow-hidden border ${
                    i === active ? "border-primary" : "border-border"
                  }`}
                >
                  <StorageImage
                    path={img.storage_path}
                    alt={img.alt_text ?? `${product.name} photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories?.name && (
            <p className="eyebrow">{product.categories.name}</p>
          )}
          <h1 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {price && <p className="text-lg text-primary">{price}</p>}
            <span className="rounded-sm border border-border px-3 py-1 text-xs tracking-wide text-muted-foreground">
              {AVAILABILITY_LABELS[product.availability] ?? product.availability}
            </span>
          </div>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={productWhatsappLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
            <a
              href={`tel:${SITE.phonePrimary}`}
              className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary"
            >
              <Phone className="h-4 w-4" /> {SITE.phonePrimaryDisplay}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
