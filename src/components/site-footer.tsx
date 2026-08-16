import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone } from "lucide-react";

import logoAsset from "@/assets/amigos-logo.png.asset.json";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <img
            src={logoAsset.url}
            alt="Amigos Wooden Vases logo"
            width={400}
            height={225}
            loading="lazy"
            className="h-20 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm italic text-muted-foreground">{SITE.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/designs" className="hover:text-foreground">
                Designs
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-foreground">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Get in touch</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="flex flex-col">
                <a href={`tel:${SITE.phonePrimary}`} className="hover:text-foreground">
                  {SITE.phonePrimaryDisplay}
                </a>
                <a href={`tel:${SITE.phoneSecondary}`} className="hover:text-foreground">
                  {SITE.phoneSecondaryDisplay}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{SITE.location}</span>
            </li>
            <li className="flex items-start gap-2">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Amigos Wooden Vases</span>
          <Link to="/auth" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
