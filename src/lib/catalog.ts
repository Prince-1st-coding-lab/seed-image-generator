import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "product-images";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  availability: string;
  status: string;
  sort_order: number;
  created_at: string;
  product_images: ProductImage[];
  categories?: { name: string; slug: string } | null;
};

export type GalleryImage = {
  id: string;
  storage_path: string;
  caption: string | null;
  alt_text: string | null;
  category_id: string | null;
  status: string;
  created_at: string;
};

const SIGNED_TTL = 60 * 60 * 24 * 7;
const urlCache = new Map<string, string>();

export async function signedUrl(path: string): Promise<string | null> {
  if (urlCache.has(path)) return urlCache.get(path)!;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  if (data?.signedUrl) {
    urlCache.set(path, data.signedUrl);
    return data.signedUrl;
  }
  return null;
}

export const imageUrlQuery = (path: string | null | undefined) =>
  queryOptions({
    queryKey: ["image-url", path],
    queryFn: () => (path ? signedUrl(path) : null),
    enabled: !!path,
    staleTime: 1000 * 60 * 60,
  });

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, sort_order")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
  staleTime: 1000 * 60 * 5,
});

const PRODUCT_SELECT =
  "id, name, slug, category_id, description, price, currency, availability, status, sort_order, created_at, categories(name, slug), product_images(id, product_id, storage_path, alt_text, sort_order)";

export const publishedProductsQuery = queryOptions({
  queryKey: ["products", "published"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Product) ?? null;
    },
  });

export const allProductsQuery = queryOptions({
  queryKey: ["products", "all"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export const publishedGalleryQuery = queryOptions({
  queryKey: ["gallery", "published"],
  queryFn: async (): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as GalleryImage[];
  },
});

export const allGalleryQuery = queryOptions({
  queryKey: ["gallery", "all"],
  queryFn: async (): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as GalleryImage[];
  },
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(price: number | null, currency: string) {
  if (price === null || price === undefined) return null;
  return `${new Intl.NumberFormat("en-RW").format(price)} ${currency}`;
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available",
  made_to_order: "Made to order",
  sold_out: "Sold out",
};

export async function uploadImage(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return path;
}
