import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import MessagesManager from "@/components/admin/messages-manager";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const raw = Number((await searchParams).page ?? 1);
  const page = Number.isSafeInteger(raw) && raw > 0 ? Math.min(raw, 100000) : 1;
  const { data, error, count } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id")
    .range((page - 1) * 25, page * 25 - 1);
  const ready = Object.hasOwn(await getSettings(), "website_content");
  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>Enquiries.</h1>
          <p>Review and remove contact submissions.</p>
        </div>
      </div>
      {!ready && (
        <p role="alert" className="form-notice">
          Apply migration 006 to enable enquiry deletion.
        </p>
      )}
      {error ? (
        <p role="alert">Enquiries could not be loaded. Refresh to try again.</p>
      ) : (
        <MessagesManager messages={data ?? []} ready={ready} />
      )}
      <nav className="quick-actions" aria-label="Enquiry pages">
        {page > 1 && (
          <Link href={`/admin/messages?page=${page - 1}`}>Previous page</Link>
        )}
        <span>Page {page}</span>
        {page * 25 < (count ?? 0) && (
          <Link href={`/admin/messages?page=${page + 1}`}>Next page</Link>
        )}
      </nav>
    </>
  );
}
