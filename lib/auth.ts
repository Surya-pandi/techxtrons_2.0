import "server-only";
import { redirect } from "next/navigation";
import { createClient, isConfigured } from "./supabase/server";
export async function getAdmin() {
  if (!isConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  return admin ? { user, supabase } : null;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function authorizeMutation() {
  const admin = await getAdmin();
  if (!admin) throw new Error("You must be signed in as an administrator.");
  return admin;
}
