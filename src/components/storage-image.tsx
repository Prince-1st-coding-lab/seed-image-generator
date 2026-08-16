import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";

import { imageUrlQuery } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function StorageImage({
  path,
  alt,
  className,
  loading = "lazy",
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const { data, isLoading } = useQuery(imageUrlQuery(path));

  if (!path || (!isLoading && !data)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-secondary text-muted-foreground",
          className,
        )}
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6" aria-hidden="true" />
      </div>
    );
  }

  if (!data) {
    return <div className={cn("animate-pulse bg-secondary", className)} aria-hidden="true" />;
  }

  return <img src={data} alt={alt} loading={loading} className={className} />;
}
