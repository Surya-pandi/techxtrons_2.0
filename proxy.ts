import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const protectedPage =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login";
  if (!url || !key)
    return protectedPage
      ? NextResponse.redirect(new URL("/admin/login", request.url))
      : response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (protectedPage) {
    const { data: admin } = user
      ? await supabase
          .from("admins")
          .select("id")
          .eq("id", user.id)
          .maybeSingle()
      : { data: null };
    if (!admin) {
      const redirected = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      response.cookies
        .getAll()
        .forEach((cookie) => redirected.cookies.set(cookie));
      redirected.headers.set("Cache-Control", "private, no-store");
      return redirected;
    }
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
