"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Trash2, Pencil, X } from "lucide-react";
import type { Event, GalleryImage } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { validateImage } from "@/lib/validation";
import { saveRecord, deleteRecord } from "@/app/actions/admin";
import { categoryLabel } from "@/lib/utils";
import ContentForm from "./content-form";
import ConfirmDialog from "./confirm-dialog";
const categories = [
  "technical",
  "non_technical",
  "cultural",
  "moments",
  "others",
];
type PendingFile = {
  file: File;
  preview: string;
  caption: string;
  progress: number;
  status: string;
  asset?: { url: string; path: string };
  done?: boolean;
};
export default function GalleryManager({
  images,
  events,
}: {
  images: GalleryImage[];
  events: Event[];
}) {
  const [files, setFiles] = useState<PendingFile[]>([]);
  const filesRef = useRef<PendingFile[]>([]);
  const [category, setCategory] = useState("moments");
  const [eventId, setEventId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState<GalleryImage | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  filesRef.current = files;
  useEffect(
    () => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview)),
    [],
  );
  function addFiles(list: FileList | null) {
    if (!list || uploading) return;
    const next: PendingFile[] = [];
    const errors: string[] = [];
    Array.from(list).forEach((file) => {
      try {
        validateImage(file);
        next.push({
          file,
          preview: URL.createObjectURL(file),
          caption: file.name.replace(/\.[^.]+$/, ""),
          progress: 0,
          status: "Ready",
        });
      } catch (error) {
        errors.push(
          `${file.name}: ${error instanceof Error ? error.message : "Invalid file."}`,
        );
      }
    });
    setFiles((prev) => [...prev, ...next]);
    setNotice(errors.join(" "));
  }
  function update(index: number, patch: Partial<PendingFile>) {
    setFiles((previous) =>
      previous.map((file, i) => (i === index ? { ...file, ...patch } : file)),
    );
  }
  async function uploadAll() {
    setUploading(true);
    setNotice("");
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      if (files[i].done) continue;
      try {
        update(i, { status: "Uploading…" });
        const asset =
          files[i].asset ||
          (await uploadImage(files[i].file, "gallery", (progress) =>
            update(i, { progress }),
          ));
        update(i, { asset, status: "Saving…" });
        const result = await saveRecord("gallery", null, {
          image_url: asset.url,
          storage_path: asset.path,
          caption: files[i].caption,
          category,
          event_id: eventId,
          is_featured: featured,
        });
        if (!result.success) throw new Error(result.message);
        update(i, { progress: 100, status: "Published", done: true });
      } catch (error) {
        failed++;
        update(i, {
          status: error instanceof Error ? error.message : "Upload failed.",
        });
      }
    }
    setUploading(false);
    setNotice(
      failed
        ? `${failed} image(s) could not be published. You can retry the remaining uploads.`
        : "All images published to the gallery.",
    );
    router.refresh();
  }
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">COLLECT THE MOMENTS</span>
          <h1>Gallery management.</h1>
          <p>Upload, organize, and share the highlights.</p>
        </div>
      </div>
      <section className="admin-panel">
        <label
          className="upload-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <UploadCloud size={32} />
          <strong>Drop your images here</strong>
          <span>or click to browse · JPG, PNG, WebP · 10 MB per image</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {files.length > 0 && (
          <>
            <div className="form-row upload-options">
              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(c)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Event
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  disabled={uploading}
                >
                  <option value="">No associated event</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                disabled={uploading}
              />
              Feature in gallery
            </label>
            <div className="upload-previews">
              {files.map((file, i) => (
                <div key={file.preview}>
                  <Image
                    src={file.preview}
                    alt={file.caption || "Upload preview"}
                    unoptimized
                    width={180}
                    height={120}
                  />
                  <input
                    aria-label={`Caption for ${file.file.name}`}
                    value={file.caption}
                    onChange={(e) => update(i, { caption: e.target.value })}
                    disabled={uploading || file.done}
                  />
                  <progress value={file.progress} max={100} />
                  <small>{file.status}</small>
                  <button
                    type="button"
                    className="text-link"
                    disabled={uploading}
                    onClick={() => {
                      URL.revokeObjectURL(file.preview);
                      setFiles((prev) =>
                        prev.filter((_, index) => index !== i),
                      );
                    }}
                  >
                    Remove from queue
                  </button>
                </div>
              ))}
            </div>
            <button
              className="button"
              onClick={uploadAll}
              disabled={
                uploading ||
                files.every((f) => f.done) ||
                files.some((f) => !f.caption.trim())
              }
            >
              {uploading ? "Publishing images…" : "Publish pending images"}
            </button>
          </>
        )}
        {notice && (
          <p className="form-notice" role="status">
            {notice}
          </p>
        )}
      </section>
      {editing && (
        <section className="admin-panel">
          <div className="panel-title">
            <h2>Edit image details</h2>
            <button
              className="icon-button"
              aria-label="Close image editor"
              onClick={() => setEditing(null)}
            >
              <X />
            </button>
          </div>
          <ContentForm
            key={editing.id}
            table="gallery"
            id={editing.id}
            initial={{ ...editing }}
            fields={[
              {
                name: "caption",
                label: "Caption / alternative text",
                required: true,
              },
              {
                name: "category",
                label: "Category",
                type: "select",
                options: categories.map((c) => ({
                  value: c,
                  label: categoryLabel(c),
                })),
              },
              {
                name: "event_id",
                label: "Event",
                type: "select",
                options: [
                  { value: "", label: "No associated event" },
                  ...events.map((e) => ({ value: e.id, label: e.title })),
                ],
              },
              {
                name: "is_featured",
                label: "Feature in gallery",
                type: "checkbox",
              },
            ]}
            onSaved={() => setEditing(null)}
          />
        </section>
      )}
      <div className="admin-gallery-grid">
        {images.map((image) => (
          <article key={image.id}>
            <Image
              src={image.image_url}
              alt={image.caption}
              width={400}
              height={280}
            />
            <div>
              <h3>{image.caption}</h3>
              <p>
                {categoryLabel(image.category)}
                {image.is_featured ? " · Featured" : ""}
              </p>
              <div className="row-actions">
                <button
                  className="icon-button"
                  aria-label={`Edit ${image.caption}`}
                  onClick={() => setEditing(image)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${image.caption}`}
                  onClick={() => setDeleting(image)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!images.length && (
        <p>No gallery images yet. Upload your first collection above.</p>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this image?"
          text="The image will be permanently removed from both the gallery and storage."
          pending={pending}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            startTransition(async () => {
              const result = await deleteRecord("gallery", deleting.id);
              setNotice(result.message);
              setDeleting(null);
              if (result.success) {
                router.refresh();
              }
            })
          }
        />
      )}
    </>
  );
}
