import type { Field } from "@/components/admin/content-form";
export const eventFields: Field[] = [
  { name: "title", label: "Event title", required: true },
  {
    name: "slug",
    label: "URL slug",
    required: true,
    hint: "Lowercase words separated by hyphens, e.g. coding-competition.",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "technical", label: "Technical" },
      { value: "non_technical", label: "Non-technical" },
    ],
  },
  { name: "venue", label: "Venue" },
  { name: "event_date", label: "Date", type: "date" },
  { name: "event_time", label: "Time (IST)", type: "time" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "poster_url",
    label: "Event poster",
    type: "image",
    hint: "JPG, PNG or WebP · Up to 10 MB",
  },
  { name: "rules", label: "Rules", type: "textarea" },
  { name: "coordinators", label: "Coordinators", type: "textarea" },
  { name: "prize_details", label: "Prize details", type: "textarea" },
  { name: "registration_url", label: "Registration URL", type: "url" },
  {
    name: "is_featured",
    label: "Show first in event listings",
    type: "checkbox",
  },
];
export const aboutFields: Field[] = [
  { name: "title", label: "Association title", required: true },
  { name: "description", label: "Introduction", type: "textarea" },
  { name: "vision", label: "Vision", type: "textarea" },
  { name: "mission", label: "Mission", type: "textarea" },
  { name: "objectives", label: "Objectives", type: "textarea" },
  { name: "image_url", label: "Association image", type: "image" },
];
export const contactFields: Field[] = [
  { name: "department_name", label: "Department name", required: true },
  { name: "college_name", label: "College name", required: true },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address", type: "textarea" },
  ...["map", "instagram", "linkedin", "youtube"].map((name) => ({
    name: `${name}_url`,
    label: `${name.charAt(0).toUpperCase() + name.slice(1)} URL`,
    type: "url" as const,
  })),
];
export const settingsFields: Field[] = [
  { name: "event_name", label: "Event name", required: true },
  { name: "association_name", label: "Association name", required: true },
  { name: "year", label: "Edition year", required: true },
  {
    name: "event_starts_at",
    label: "Event start with timezone",
    hint: "ISO format, e.g. 2026-12-15T09:00:00+05:30. Leave blank until announced.",
  },
  { name: "venue", label: "Event venue" },
  { name: "logo_url", label: "Department logo", type: "image" },
  {
    name: "intro_enabled",
    label: "Enable intro video",
    type: "checkbox",
    hint: "Uses /videos/desktop-intro.mp4 or /videos/mobile-intro.mp4. Missing videos are skipped automatically.",
  },
];
