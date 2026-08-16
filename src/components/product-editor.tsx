import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { StorageImage } from "@/components/storage-image";
import { supabase } from "@/integrations/supabase/client";
import {
  BUCKET,
  categoriesQuery,
  slugify,
  uploadImage,
  type Product,
  type ProductImage,
} from "@/lib/catalog";

const inputClass =
  "mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary";

export function ProductEditor({ product }: { product?: Product | undefined }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categories = useQuery(categoriesQuery);

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [availability, setAvailability] = useState(product?.availability ?? "available");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [images, setImages] = useState<ProductImage[]>(
    [...(product?.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setImages(
        [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      );
    }
  }, [product]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["products"] });
    void queryClient.invalidateQueries({ queryKey: ["product"] });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        slug: slugify(name),
        category_id: categoryId || null,
        description: description.trim() || null,
        price: price ? Number(price) : null,
        availability,
        status,
      };
      if (product) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);
        if (updateError) throw updateError;
        refresh();
        void navigate({ to: "/admin" });
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        refresh();
        void navigate({ to: "/admin/products/$id", params: { id: data.id } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the design.");
    } finally {
      setBusy(false);
    }
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length || !product) return;
    setBusy(true);
    setError(null);
    try {
      let order = images.length;
      for (const file of Array.from(files)) {
        const path = await uploadImage(file, `products/${product.id}`);
        const { data, error: insertError } = await supabase
          .from("product_images")
          .insert({
            product_id: product.id,
            storage_path: path,
            alt_text: name || null,
            sort_order: order++,
          })
          .select("id, product_id, storage_path, alt_text, sort_order")
          .single();
        if (insertError) throw insertError;
        setImages((prev) => [...prev, data as ProductImage]);
      }
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async (img: ProductImage) => {
    await supabase.storage.from(BUCKET).remove([img.storage_path]);
    await supabase.from("product_images").delete().eq("id", img.id);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    refresh();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-5">
        <div>
          <label htmlFor="name" className="eyebrow">
            Name
          </label>
          <input
            id="name"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="category" className="eyebrow">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">No category</option>
            {(categories.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="eyebrow">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="eyebrow">
              Price (RWF, optional)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="availability" className="eyebrow">
              Availability
            </label>
            <select
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="made_to_order">Made to order</option>
              <option value="sold_out">Sold out</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="eyebrow">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Saving…" : product ? "Save changes" : "Create design"}
        </button>
      </form>

      <div>
        <p className="eyebrow">Photos</p>
        {!product ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Create the design first, then you can upload photos.
          </p>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => void addPhotos(e.target.files)}
              className="mt-3 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-sm file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground"
            />
            <div className="mt-6 grid grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative">
                  <StorageImage
                    path={img.storage_path}
                    alt={img.alt_text ?? name}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Delete photo"
                    onClick={() => void removePhoto(img)}
                    className="absolute right-1 top-1 rounded-sm bg-background/90 p-1.5 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
