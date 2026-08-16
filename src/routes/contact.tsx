import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";

import { SITE, generalWhatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Amigos Wooden Vases — Kigali, Rwanda" },
      {
        name: "description",
        content:
          "Call or WhatsApp Amigos Wooden Vases on +250 789 450 358 or +250 735 329 961. Find us in Gakinjiro ka Gisozi, Gasabo, Kigali.",
      },
      { property: "og:title", content: "Contact Amigos Wooden Vases" },
      {
        property: "og:description",
        content: "Call, WhatsApp or visit our workshop in Gakinjiro ka Gisozi, Kigali.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-tight tracking-tight sm:text-6xl">
        Let&apos;s talk about
        <span className="italic text-primary"> your piece</span>
      </h1>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <p className="eyebrow">Phone</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href={`tel:${SITE.phonePrimary}`}
                className="inline-flex items-center gap-2 text-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" /> {SITE.phonePrimaryDisplay}
              </a>
              <a
                href={`tel:${SITE.phoneSecondary}`}
                className="inline-flex items-center gap-2 text-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" /> {SITE.phoneSecondaryDisplay}
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">WhatsApp</p>
            <a
              href={generalWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Chat with us
            </a>
          </div>

          <div>
            <p className="eyebrow">Instagram</p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
            >
              <Instagram className="h-4 w-4 text-primary" /> {SITE.instagramHandle}
            </a>
          </div>

          <div>
            <p className="eyebrow">Location</p>
            <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {SITE.location}
            </p>
          </div>
        </div>

        <div className="overflow-hidden border border-border">
          <iframe
            title="Map showing Amigos Wooden Vases in Gakinjiro ka Gisozi, Kigali"
            src="https://www.google.com/maps?q=Gakinjiro%20ka%20Gisozi,%20Gasabo,%20Kigali,%20Rwanda&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full"
          />
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-border px-4 py-3 text-center text-sm hover:bg-secondary"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </main>
  );
}
