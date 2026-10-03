import { z } from "zod";
import catalog from "./website-fields.json";

export type WebsiteContent = Record<string, string | boolean>;
export type WebsiteField = {
  key: string;
  group: string;
  label: string;
  type: "text" | "visible" | "url";
  value: string | boolean;
};
export const websiteFields = catalog as WebsiteField[];
const fieldsByKey = new Map(websiteFields.map((field) => [field.key, field]));
export const defaultWebsiteContent: WebsiteContent = Object.fromEntries(
  websiteFields.map((field) => [field.key, field.value]),
);

export function validContentUrl(value: string) {
  if (!value) return true;
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return true;
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export const websiteContentSchema = z
  .record(z.string(), z.union([z.string().max(5000), z.boolean()]))
  .superRefine((content, ctx) => {
    for (const [key, value] of Object.entries(content)) {
      const field = fieldsByKey.get(key);
      if (
        !field ||
        (field.type === "visible"
          ? typeof value !== "boolean"
          : typeof value !== "string")
      ) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Unknown field or invalid value.",
        });
      } else if (field.type === "url" && !validContentUrl(value as string)) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Use a local path or HTTP/HTTPS URL.",
        });
      }
    }
  });

export function resolveWebsiteContent(saved: unknown): WebsiteContent {
  const parsed = websiteContentSchema.safeParse(saved ?? {});
  if (!parsed.success)
    throw new Error(
      "Website content is invalid. Please contact the administrator.",
    );
  // Explicit empty strings and false values remove content; only absent keys use defaults.
  return { ...defaultWebsiteContent, ...parsed.data };
}
