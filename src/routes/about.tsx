import { createFileRoute, Link } from "@tanstack/react-router";

import workshop from "@/assets/workshop.jpg";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Amigos Wooden Vases — Woodwork in Kigali" },
      {
        name: "description",
        content:
          "Amigos Wooden Vases makes wooden vases, tables and furniture for homes and interior spaces in Kigali, Rwanda.",
      },
      { property: "og:title", content: "About Amigos Wooden Vases" },
      {
        property: "og:description",
        content:
          "Wooden vases, tables and furniture made for homes and interior spaces in Kigali.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow">About us</p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-tight tracking-tight sm:text-6xl">
        Wooden pieces made for
        <span className="block italic text-primary">real homes</span>
      </h1>
      <p className="mt-4 text-sm italic text-muted-foreground">{SITE.tagline}</p>

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:items-start">
        <img
          src={workshop}
          alt="Wood being shaped in a workshop"
          width={1200}
          height={1408}
          loading="lazy"
          className="w-full object-cover"
          style={{ boxShadow: "var(--shadow-deep)" }}
        />
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Amigos Wooden Vases is a woodworking business based in Gakinjiro ka Gisozi, Gasabo,
            Kigali. We make wooden vases, tables and furniture for homes and interior spaces.
          </p>
          <p>
            Our work covers wooden vases and corner vases, TV stands, dining tables, side and
            bedside tables, console tables, living room pieces and other wooden designs. If you
            have something specific in mind, we also work on custom designs.
          </p>
          <p>
            Each piece is made to be used every day — simple shapes, honest wood and finishes that
            fit into the room they are made for. We are happy to talk through sizes, wood and
            finishes before we start.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/designs"
              className="inline-flex items-center rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Our Designs
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-sm border border-border px-6 py-3 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
