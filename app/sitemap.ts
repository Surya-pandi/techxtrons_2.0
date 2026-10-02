import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const events = await getEvents();
  return [
    ...[
      "",
      "/about",
      "/events",
      "/technical-events",
      "/non-technical-events",
      "/gallery",
      "/contact",
    ].map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...events.map((event) => ({
      url: `${base}/events/${event.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
