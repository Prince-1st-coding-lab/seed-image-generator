import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react";

import heroVases from "@/assets/hero-vases.jpg";
import workshop from "@/assets/workshop.jpg";
import { ProductCard } from "@/components/product-card";
import { publishedProductsQuery } from "@/lib/catalog";
import { SITE, generalWhatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amigos Wooden Vases — Wooden Décor & Furniture, Kigali" },
      {
        name: "description",
        content:
          "Amigos Wooden Vases makes wooden vases, tables, TV stands and custom wooden furniture in Gakinjiro ka Gisozi, Kigali. Call or WhatsApp +250 789 450 358.",
      },
      {
        property: "og:title",
        content: "Amigos Wooden Vases — Wooden Décor & Furniture, Kigali",
      },
      {
        property: "og:description",
        content:
          "Wooden vases, tables, TV stands and custom wooden designs made in Kigali, Rwanda.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useQuery(publishedProductsQuery);
  const featured = (data ?? []).slice(0, 4);

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroVases}
          alt="Wooden vases arranged in a warm interior"
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-20">
          <p className="eyebrow">{SITE.location}</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            Amigos
            <span className="block italic text-primary">Wooden Vases</span>
          </h1>
          <p className="mt-5 max-w-xl text-base italic text-muted-foreground">{SITE.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Wooden vases, tables, TV stands and custom wooden designs for homes and interior
            spaces in Kigali.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/designs"
              search={{}}
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Our Designs
            </Link>
            <a
              href={generalWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm tracking-wide text-foreground transition-colors hover:bg-secondary"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Phone, label: "Call us", value: SITE.phonePrimaryDisplay },
            { icon: MapPin, label: "Find us", value: "Gakinjiro ka Gisozi, Kigali" },
            { icon: Instagram, label: "Follow", value: SITE.instagramHandle },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-6">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="eyebrow">{label}</p>
                <p className="mt-1 text-sm text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured designs */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Our designs</p>
            <h2 className="mt-4 text-4xl tracking-tight sm:text-5xl">
              Pieces in <span className="italic text-primary">grain</span>
            </h2>
          </div>
          <Link
            to="/designs"
            search={{}}
            className="hidden shrink-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:block"
          >
            View all designs
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="mt-14 border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-2xl">Our catalog is being prepared</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Message us on WhatsApp and we will share the designs available right now.
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
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Craft */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
          <img
            src={workshop}
            alt="Wood being shaped in a workshop"
            width={1200}
            height={1408}
            loading="lazy"
            className="w-full object-cover"
            style={{ boxShadow: "var(--shadow-deep)" }}
          />
          <div>
            <p className="eyebrow">What we make</p>
            <h2 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
              Wood for the
              <span className="block italic text-primary">whole home</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              From vases and corner vases to TV stands, dining tables and other wooden furniture —
              we also take on custom designs made to your space.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-y-8">
              {[
                ["Wooden vases", "Table and corner vases"],
                ["Tables", "Dining, side and console"],
                ["TV stands", "Living room pieces"],
                ["Custom designs", "Made to your space"],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-display text-lg">{t}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{d}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center rounded-sm border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary"
            >
              About Amigos
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="eyebrow">Visit or call</p>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl leading-tight tracking-tight sm:text-6xl">
          Gakinjiro ka Gisozi —
          <span className="italic text-primary"> Kigali</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={generalWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp {SITE.phonePrimaryDisplay}
          </a>
          <a
            href={`tel:${SITE.phoneSecondary}`}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneSecondaryDisplay}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary"
          >
            <MapPin className="h-4 w-4" /> Directions
          </Link>
        </div>
      </section>
    </main>
  );
}
