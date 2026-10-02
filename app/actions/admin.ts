"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, isConfigured } from "@/lib/supabase/server";
import { authorizeMutation } from "@/lib/auth";
import { singletonId } from "@/lib/defaults";
import {
  eventSchema,
  gallerySchema,
  aboutSchema,
  contactSchema,
  settingsSchema,
} from "@/lib/validation";
export type ActionState = { success: boolean; message: string };
export async function login(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isConfigured())
    return {
      success: false,
      message: "Connect Supabase before signing in. See the setup guide.",
    };
  const credentials = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse(Object.fromEntries(form));
  if (!credentials.success)
    return {
      success: false,
      message: "Enter a valid email address and password.",
    };
  const db = await createClient();
  const { data, error } = await db.auth.signInWithPassword(credentials.data);
  if (error || !data.user)
    return {
      success: false,
      message: "Unable to sign in. Check your email and password.",
    };
  const { data: admin } = await db
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!admin) {
    await db.auth.signOut();
    return {
      success: false,
      message: "This account does not have administrator access.",
    };
  }
  redirect("/admin/dashboard");
}
export async function logout() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/admin/login");
}
const schemas = {
  events: eventSchema,
  gallery: gallerySchema,
  about: aboutSchema,
  contact: contactSchema,
  settings: settingsSchema,
};
export async function saveRecord(
  table: keyof typeof schemas,
  id: string | null,
  values: unknown,
): Promise<ActionState> {
  try {
    const { supabase } = await authorizeMutation();
    if (!Object.hasOwn(schemas, table))
      throw new Error("Invalid content type.");
    const parsed = schemas[table].safeParse(values);
    if (!parsed.success)
      return {
        success: false,
        message: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(" · "),
      };
    for (const [key, value] of Object.entries(parsed.data)) {
      if (
        ["poster_url", "image_url", "logo_url"].includes(key) &&
        typeof value === "string" &&
        value.startsWith("https://")
      ) {
        const imageUrl = new URL(value);
        const projectUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
        if (
          imageUrl.origin !== projectUrl.origin ||
          !imageUrl.pathname.startsWith("/storage/v1/object/public/")
        )
          throw new Error("Use an uploaded image from this Supabase project.");
      }
    }
    if (id && !z.uuid().safeParse(id).success)
      throw new Error("Invalid record.");
    if (table === "gallery") {
      const gallery = gallerySchema.parse(values);
      if (!gallery.storage_path) throw new Error("Upload an image first.");
      const { data: asset } = supabase.storage
        .from("gallery")
        .getPublicUrl(gallery.storage_path);
      if (asset.publicUrl !== gallery.image_url)
        throw new Error("Invalid gallery image.");
    }
    const singleton = ["about", "contact", "settings"].includes(table);
    const payload: Record<string, string | boolean | null> = { ...parsed.data };
    const query = singleton
      ? supabase.from(table).upsert({ ...payload, id: singletonId })
      : id
        ? supabase.from(table).update(payload).eq("id", id)
        : supabase.from(table).insert(payload);
    const { error } = await query;
    if (error)
      return {
        success: false,
        message:
          error.code === "23505"
            ? "That event slug already exists. Choose a different one."
            : "The changes could not be saved. Please try again.",
      };
    revalidatePath("/", "layout");
    return { success: true, message: "Changes saved." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to save changes.",
    };
  }
}
export async function deleteRecord(
  table: "events" | "gallery",
  id: string,
): Promise<ActionState> {
  try {
    const { supabase } = await authorizeMutation();
    if (
      !["events", "gallery"].includes(table) ||
      !z.uuid().safeParse(id).success
    )
      throw new Error("Invalid record.");
    if (table === "gallery") {
      const { data, error } = await supabase
        .from("gallery")
        .select("storage_path")
        .eq("id", id)
        .single();
      if (error) throw new Error("Image not found.");
      if (data.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("gallery")
          .remove([data.storage_path]);
        if (storageError)
          throw new Error(
            "The stored image could not be removed. Please try again.",
          );
      }
    }
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error)
      throw new Error("The record could not be removed. Please try again.");
    revalidatePath("/", "layout");
    return { success: true, message: "Deleted successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to delete.",
    };
  }
}
