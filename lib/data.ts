import "server-only";
import { cache } from "react";
import { createClient, isConfigured } from "./supabase/server";
import {
  defaultAbout,
  defaultContact,
  defaultSettings,
  sampleEvents,
  sampleGallery,
} from "./defaults";
import type { About, Contact, Event, GalleryImage, Settings } from "./types";
import { branding } from "./branding";
import { resolveSettings } from "./settings";
import { resolveWebsiteContent } from "./website-content";
export const getEvents = cache(async (): Promise<Event[]> => {
  if (!isConfigured()) return sampleEvents;
  const db = await createClient();
  const { data, error } = await db
    .from("events")
    .select("*")
    .order("event_date", { ascending: true, nullsFirst: false });
  if (error) throw new Error("Events could not be loaded. Please try again.");
  return data ?? [];
});
export const getGallery = cache(async (): Promise<GalleryImage[]> => {
  if (!isConfigured()) return sampleGallery;
  const db = await createClient();
  const { data, error } = await db
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    throw new Error("The gallery could not be loaded. Please try again.");
  return data ?? [];
});
async function singleton<T>(table: string, fallback: T): Promise<T> {
  if (!isConfigured()) return fallback;
  const db = await createClient();
  const { data, error } = await db
    .from(table)
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Site information could not be loaded.");
  return (data as T) ?? fallback;
}
export const getSettings = cache(async () => {
  const settings = await singleton<Settings>("settings", defaultSettings);
  return resolveSettings(settings);
});
export const getAbout = cache(async () => {
  const about = await singleton<About>("about", defaultAbout);
  return {
    ...about,
    description: about.description.replace(
      /\bTECHXTRONS\s+2\.0\b/gi,
      branding.eventName,
    ),
  };
});
export const getContact = cache(() =>
  singleton<Contact>("contact", defaultContact),
);
export const getWebsiteContent = cache(async () => {
  const settings = await getSettings();
  return resolveWebsiteContent(settings.website_content);
});
