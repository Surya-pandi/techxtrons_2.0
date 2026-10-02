import { z } from "zod";
const text = (max = 10000) => z.string().trim().max(max);
const url = z.union([
  z.literal(""),
  z.url().refine((s) => /^https?:\/\//i.test(s), "Use an HTTP or HTTPS URL."),
]);
const image = z.union([
  z.literal(""),
  z.string().regex(/^\/images\/[\w/.-]+$/),
  z.url().refine((s) => s.startsWith("https://"), "Image URLs must use HTTPS."),
]);
const optionalDate = z
  .union([z.literal(""), z.iso.date()])
  .transform((s) => s || null);
const optionalTime = z
  .union([
    z.literal(""),
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/),
  ])
  .transform((s) => s || null);
export const eventSchema = z.object({
  title: text(150).min(1),
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens.",
    ),
  category: z.enum(["technical", "non_technical"]),
  description: text(),
  poster_url: image,
  event_date: optionalDate,
  event_time: optionalTime,
  venue: text(300),
  rules: text(),
  coordinators: text(3000),
  prize_details: text(3000),
  registration_url: url,
  is_featured: z.boolean(),
});
export const gallerySchema = z.object({
  image_url: image,
  storage_path: z.string().max(500).nullable(),
  caption: text(500).min(1),
  category: z.enum([
    "technical",
    "non_technical",
    "cultural",
    "moments",
    "others",
  ]),
  event_id: z
    .union([z.uuid(), z.literal(""), z.null()])
    .transform((s) => s || null),
  is_featured: z.boolean(),
});
export const aboutSchema = z.object({
  title: text(200).min(1),
  description: text(),
  vision: text(),
  mission: text(),
  objectives: text(),
  image_url: image,
});
export const contactSchema = z.object({
  department_name: text(200).min(1),
  college_name: text(200).min(1),
  email: z.union([z.literal(""), z.email()]),
  phone: text(50),
  address: text(1000),
  map_url: url,
  instagram_url: url,
  linkedin_url: url,
  youtube_url: url,
});
export const settingsSchema = z.object({
  event_name: text(150).min(1),
  association_name: text(200).min(1),
  year: z.string().regex(/^\d{4}$/),
  event_starts_at: z
    .union([z.literal(""), z.iso.datetime({ offset: true })])
    .transform((s) => s || null),
  venue: text(300),
  logo_url: image,
  intro_enabled: z.boolean(),
});
export const messageSchema = z.object({
  name: text(100).min(2),
  email: z.email().max(254),
  subject: text(150).min(3),
  message: text(5000).min(10),
  website: z.string().max(0),
});
export const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
export function validateImage(file: { size: number; type: string }) {
  if (!acceptedImageTypes.includes(file.type))
    throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size === 0 || file.size > 10 * 1024 * 1024)
    throw new Error("Each image must be between 1 byte and 10 MB.");
}
