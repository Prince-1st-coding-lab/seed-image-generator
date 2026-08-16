import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { StorageImage } from "@/components/storage-image";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, allGalleryQuery, uploadImage, type GalleryImage } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Manage gallery — Amigos Wooden Vases" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminGallery,
});

function AdminGallery() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(allGalleryQuery);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["gallery"] });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const path = await uploadImage(file, "gallery");
        const { error: insertError } = await supabase
          .from("gallery_images")
          .insert({ storage_path: path, status: "published" });
        if (insertError) throw insertError;
      }
      void refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (img: GalleryImage) => {
    await supabase
      .from("gallery_images")
      .update({ status: img.status === "published" ? "draft" : "published" })
      .eq("id", img.id);
    void refresh();
  };

  const remove = async (img: GalleryImage) => {
    await supabase.storage.from(BUCKET).remove([img.storage_path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    void refresh();
  };

  const setCaption = async (img: GalleryImage, caption: string) => {
    await supabase
      .from("gallery_images")
      .update({ caption: caption || null, alt_text: caption || null })
      .eq("id", img.id);
    void refresh();
  };

  return (
    <AdminShell title="Gallery">
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => void upload(e.target.files)}
        className="block w-full max-w-md text-sm text-muted-foreground file:mr-4 file:rounded-sm file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground"
      />
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {(data ?? []).map((img) => (
            <div key={img.id} className="space-y-2">
              <div className="relative">
                <StorageImage
                  path={img.storage_path}
                  alt={img.alt_text ?? "Gallery photo"}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Delete photo"
                  onClick={() => void remove(img)}
                  className="absolute right-1 top-1 rounded-sm bg-background/90 p-1.5 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                defaultValue={img.caption ?? ""}
                placeholder="Caption"
                maxLength={160}
                onBlur={(e) => void setCaption(img, e.target.value.trim())}
                className="w-full rounded-sm border border-border bg-card px-3 py-2 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => void toggle(img)}
                className="w-full rounded-sm border border-border px-3 py-2 text-xs hover:bg-secondary"
              >
                {img.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
