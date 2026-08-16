import { Link } from "@tanstack/react-router";

import { StorageImage } from "@/components/storage-image";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const cover = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];
  const price = formatPrice(product.price, product.currency);

  return (
    <Link
      to="/designs/$slug"
      params={{ slug: product.slug }}
      className="group block"
      aria-label={product.name}
    >
      <div className="aspect-[4/5] overflow-hidden bg-card">
        <StorageImage
          path={cover?.storage_path}
          alt={cover?.alt_text ?? `${product.name} by Amigos Wooden Vases`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4">
        <p className="font-display text-lg leading-tight">{product.name}</p>
        {product.categories?.name && (
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {product.categories.name}
          </p>
        )}
        {price && <p className="mt-2 text-sm text-primary">{price}</p>}
      </div>
    </Link>
  );
}
