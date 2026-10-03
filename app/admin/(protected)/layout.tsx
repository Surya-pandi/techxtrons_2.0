import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/sidebar";
import "@/components/admin/website-editor.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Association admin",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <span>YOUR ASSOCIATION. YOUR SPACE.</span>
          <span>{user.email}</span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
