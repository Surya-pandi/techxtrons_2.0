// An editor can contain an incomplete URL while the user types. Only pass
// sources supported by next/image's configuration to the preview component.
export function imagePreviewSource(
  value: unknown,
  projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  if (/^\/images\/[\w/.-]+$/.test(value)) {
    const path = new URL(value, "https://local.invalid").pathname;
    return path.startsWith("/images/") ? path : undefined;
  }
  if (!projectUrl) return undefined;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.origin === new URL(projectUrl).origin &&
      !url.username &&
      !url.password &&
      url.pathname.startsWith("/storage/v1/object/public/")
    )
      return url.href;
  } catch {
    // Incomplete or invalid image URLs must not crash the editor.
  }
  return undefined;
}
