import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { isConfigured } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/login-form";
export const metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};
export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin/dashboard");
  return (
    <main className="login-page">
      <Link href="/" className="login-home">
        ← Back to website
      </Link>
      <LoginForm configured={isConfigured()} />
    </main>
  );
}
