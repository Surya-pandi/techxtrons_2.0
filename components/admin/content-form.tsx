"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload } from "lucide-react";
import { saveRecord } from "@/app/actions/admin";
import { uploadImage } from "@/lib/upload";
export type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "date"
    | "time"
    | "url"
    | "email"
    | "checkbox"
    | "image"
    | "select"
    | "datetime";
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
};
type Values = Record<string, string | boolean | null>;
export default function ContentForm({
  table,
  id,
  fields,
  initial,
  onSaved,
}: {
  table: "events" | "about" | "contact" | "settings" | "gallery";
  id: string | null;
  fields: Field[];
  initial: Values;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [notice, setNotice] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const update = (name: string, value: string | boolean) =>
    setValues((v) => ({ ...v, [name]: value }));
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(null);
    startTransition(async () => {
      try {
        const result = await saveRecord(table, id, values);
        setNotice(result);
        if (result.success) {
          router.refresh();
          onSaved?.();
        }
      } catch {
        setNotice({
          success: false,
          message: "The changes could not be saved. Please try again.",
        });
      }
    });
  };
  async function upload(file?: File, field?: string) {
    if (!file || !field) return;
    setUploading(true);
    setNotice(null);
    setProgress(0);
    try {
      const asset = await uploadImage(
        file,
        table === "events" ? "event-posters" : "site-assets",
        setProgress,
      );
      update(field, asset.url);
    } catch (error) {
      setNotice({
        success: false,
        message: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      setUploading(false);
    }
  }
  return (
    <form className="content-form" onSubmit={submit}>
      <div className="content-form-grid">
        {fields.map((field) => (
          <label
            key={field.name}
            className={
              ["textarea", "image"].includes(field.type ?? "")
                ? "full-width"
                : field.type === "checkbox"
                  ? "checkbox-field"
                  : ""
            }
          >
            {field.type !== "checkbox" && (
              <span>
                {field.label}
                {field.required && " *"}
              </span>
            )}
            {field.type === "textarea" ? (
              <textarea
                value={String(values[field.name] ?? "")}
                rows={4}
                onChange={(e) => update(field.name, e.target.value)}
                required={field.required}
              />
            ) : field.type === "checkbox" ? (
              <>
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => update(field.name, e.target.checked)}
                />
                {field.label}
              </>
            ) : field.type === "select" ? (
              <select
                value={String(values[field.name] ?? "")}
                onChange={(e) => update(field.name, e.target.value)}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "image" ? (
              <div className="image-field">
                {values[field.name] && (
                  <Image
                    src={String(values[field.name])}
                    alt={`${field.label} preview`}
                    width={200}
                    height={130}
                  />
                )}
                <input
                  type="text"
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => update(field.name, e.target.value)}
                  placeholder="Image URL or /images/placeholder.png"
                />
                <div className="file-input-wrap">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => upload(e.target.files?.[0], field.name)}
                    disabled={uploading}
                  />
                </div>
              </div>
            ) : (
              <input
                type={field.type === "datetime" ? "text" : field.type || "text"}
                value={String(values[field.name] ?? "")}
                required={field.required}
                onChange={(e) => update(field.name, e.target.value)}
              />
            )}{" "}
            {field.hint && <small>{field.hint}</small>}
          </label>
        ))}
      </div>
      {uploading && (
        <div role="status">
          <progress value={progress} max={100} />
          <span>Uploading {progress}%</span>
        </div>
      )}
      {notice && (
        <p
          role={notice.success ? "status" : "alert"}
          className={`form-notice ${notice.success ? "success-notice" : "error-notice"}`}
        >
          {notice.message}
        </p>
      )}
      <button disabled={pending || uploading} className="button">
        <Save size={16} />
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
