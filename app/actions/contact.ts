"use server";
import { messageSchema } from "@/lib/validation";
import { createClient, isConfigured } from "@/lib/supabase/server";
export type ContactState = { success: boolean; message: string };
export async function sendMessage(
  _previous: ContactState,
  form: FormData,
): Promise<ContactState> {
  const parsed = messageSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { success: false, message: parsed.error.issues[0].message };
  if (!isConfigured())
    return {
      success: false,
      message:
        "The contact form is not connected yet. Please try again after the organizing team publishes its contact details.",
    };
  try {
    const db = await createClient();
    const data = parsed.data;
    const { error } = await db.rpc("submit_contact", {
      p_name: data.name,
      p_email: data.email,
      p_subject: data.subject,
      p_message: data.message,
    });
    if (error)
      return {
        success: false,
        message:
          "Your message could not be sent. If you have sent several messages recently, please wait an hour and try again.",
      };
    return {
      success: true,
      message: "Message received. The organizing team will get back to you.",
    };
  } catch {
    return {
      success: false,
      message: "We could not send your message. Please try again.",
    };
  }
}
