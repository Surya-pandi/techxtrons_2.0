import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Code2,
  Compass,
  Images,
  Plus,
  Upload,
  ArrowUpRight,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getEvents, getGallery } from "@/lib/data";
import { formatDate } from "@/lib/utils";
export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [events, gallery, messages] = await Promise.all([
    getEvents(),
    getGallery(),
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">THE BIG PICTURE</span>
          <h1>Welcome to your control room.</h1>
          <p>Bring your association’s next chapter to life.</p>
        </div>
      </div>
      <div className="stats-grid">
        {[
          ["Total events", events.length, CalendarDays],
          [
            "Technical events",
            events.filter((e) => e.category === "technical").length,
            Code2,
          ],
          [
            "Non-technical events",
            events.filter((e) => e.category === "non_technical").length,
            Compass,
          ],
          ["Gallery images", gallery.length, Images],
        ].map(([label, count, Icon]) => {
          const Component = Icon as typeof CalendarDays;
          return (
            <div className="stat-card" key={label as string}>
              <Component size={20} />
              <strong>{count as number}</strong>
              <span>{label as string}</span>
            </div>
          );
        })}
      </div>
      <div className="quick-actions">
        <Link className="button" href="/admin/events">
          <Plus size={16} />
          Create an event
        </Link>
        <Link className="button button-outline" href="/admin/gallery">
          <Upload size={16} />
          Upload gallery images
        </Link>
      </div>
      <section className="admin-panel">
        <div className="panel-title">
          <h2>Recent events</h2>
          <Link className="text-link" href="/admin/events">
            Manage
            <ArrowUpRight size={16} />
          </Link>
        </div>
        {events.length ? (
          events.slice(0, 5).map((e) => (
            <div className="admin-list-row" key={e.id}>
              <Link href={`/events/${e.slug}`}>{e.title}</Link>
              <span>{formatDate(e.event_date)}</span>
            </div>
          ))
        ) : (
          <p>No events yet. Create your first event above.</p>
        )}
      </section>
      <section className="admin-panel">
        <h2>Recent gallery uploads</h2>
        <div className="admin-recent-gallery">
          {gallery.slice(0, 6).map((i) => (
            <Image
              src={i.image_url}
              alt={i.caption}
              key={i.id}
              width={150}
              height={100}
            />
          ))}
        </div>
        {!gallery.length && <p>Your gallery starts with the first upload.</p>}
      </section>
      <section className="admin-panel">
        <h2>Recent enquiries</h2>
        {messages.error ? (
          <p role="alert">Enquiries could not be loaded.</p>
        ) : messages.data?.length ? (
          messages.data.map((m) => (
            <article className="message-row" key={m.id}>
              <h3>{m.subject}</h3>
              <a href={`mailto:${m.email}`}>
                {m.name} · {m.email}
              </a>
              <p className="preserve-lines">{m.message}</p>
              <small>{formatDate(m.created_at)}</small>
            </article>
          ))
        ) : (
          <p>No enquiries yet.</p>
        )}
      </section>
    </>
  );
}
