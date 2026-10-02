// Explicit preview mode keeps draft content available while the database is set up.
// Live database errors are never automatically replaced with sample content.
export function isPreviewMode() {
  return process.env.SITE_PREVIEW_MODE === "true";
}

export function isSupabaseEnabled() {
  return (
    !isPreviewMode() &&
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  );
}
