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
export const getSettings = cache(() =>
  singleton<Settings>("settings", defaultSettings),
);
export const getAbout = cache(() => singleton<About>("about", defaultAbout));
export const getContact = cache(() =>
  singleton<Contact>("contact", defaultContact),
);
