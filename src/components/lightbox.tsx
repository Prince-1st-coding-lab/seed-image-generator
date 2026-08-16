import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { StorageImage } from "@/components/storage-image";

export type LightboxItem = {
  path: string;
  alt: string;
  caption?: string | null;
};

type LightboxContextValue = {
  open: (items: LightboxItem[], index?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used inside LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState(0);

  const open = useCallback((next: LightboxItem[], at = 0) => {
    const usable = next.filter((i) => !!i.path);
    if (usable.length === 0) return;
    setItems(usable);
    setIndex(Math.min(Math.max(at, 0), usable.length - 1));
  }, []);

  const close = useCallback(() => setItems([]), []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (items.length ? (i + delta + items.length) % items.length : 0)),
    [items.length],
  );

  useEffect(() => {
    if (items.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [items.length, close, step]);

  const value = useMemo(() => ({ open }), [open]);
  const current = items[index];

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={close}
            className="absolute right-4 top-4 rounded-sm border border-border bg-card/80 p-2 text-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm border border-border bg-card/80 p-2 text-foreground hover:bg-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-border bg-card/80 p-2 text-foreground hover:bg-secondary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-3"
          >
            <StorageImage
              path={current.path}
              alt={current.alt}
              loading="eager"
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
            <figcaption className="text-center text-xs text-muted-foreground">
              {current.caption || current.alt}
              {items.length > 1 && (
                <span className="ml-2 opacity-70">
                  {index + 1} / {items.length}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </LightboxContext.Provider>
  );
}
