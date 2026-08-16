import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { StorageImage } from "@/components/storage-image";
import { publishedGalleryQuery } from "@/lib/catalog";
import { generalWhatsappLink } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Amigos Wooden Vases, Kigali" },
      {
        name: "description",
        content:
          "Photos of wooden vases, tables and furniture made by Amigos Wooden Vases in Kigali, Rwanda.",
      },
      { property: "og:title", content: "Gallery — Amigos Wooden Vases" },
      {
        property: "og:description",
        content: "Photos of finished wooden pieces made by Amigos in Kigali.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { data, isLoading, isError } = useQuery(publishedGalleryQuery);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow">Gallery</p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-tight tracking-tight sm:text-6xl">
        Our work in
        <span className="italic text-primary"> pictures</span>
      </h1>

      {isLoading ? (
        <div className="mt-14 columns-2 gap-6 lg:columns-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-6 h-64 animate-pulse bg-card" />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-14 text-sm text-muted-foreground">
          We couldn&apos;t load the gallery right now. Please refresh the page.
        </p>
      ) : (data ?? []).length === 0 ? (
        <div className="mt-14 border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display text-2xl">Photos coming soon</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            We are adding photos of finished pieces. Message us and we will share what we have.
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
        <div className="mt-14 columns-2 gap-6 lg:columns-3">
          {(data ?? []).map((img) => (
            <figure key={img.id} className="mb-6 break-inside-avoid">
              <StorageImage
                path={img.storage_path}
                alt={img.alt_text ?? img.caption ?? "Wooden piece by Amigos Wooden Vases"}
                className="w-full object-cover"
              />
              {img.caption && (
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}
