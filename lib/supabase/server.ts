import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseEnabled } from "../site-mode";
export function isConfigured() {
  return isSupabaseEnabled();
}
export async function createClient() {
  if (!isConfigured())
    throw new Error(
      "Supabase is not configured. Add the project URL and public key.",
    );
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {
            /* Proxy refreshes cookies when rendering a Server Component. */
          }
        },
      },
    },
  );
}
