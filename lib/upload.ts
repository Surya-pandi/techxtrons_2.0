import { validateImage } from "./validation";
export async function uploadImage(
  file: File,
  bucket: "gallery" | "event-posters" | "site-assets",
  onProgress: (value: number) => void,
): Promise<{ url: string; path: string }> {
  validateImage(file);
  const prepared = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, type: file.type, size: file.size }),
  });
  const signed = await prepared.json();
  if (!prepared.ok)
    throw new Error(signed.error || "Unable to prepare upload.");
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signed.signedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = 120000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error("Upload failed. Please try again."));
    xhr.onerror = () => reject(new Error("Connection lost. Please try again."));
    xhr.ontimeout = () =>
      reject(new Error("Upload timed out. Please try again."));
    xhr.send(file);
  });
  const verified = await fetch("/api/admin/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, path: signed.path }),
  });
  const asset = await verified.json();
  if (!verified.ok) throw new Error(asset.error);
  onProgress(100);
  return asset;
}
