import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Clock3,
  ArrowLeft,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import { getEvents } from "@/lib/data";
import { formatDate, categoryLabel, safeUrl } from "@/lib/utils";
import EventCard from "@/components/event-card";
import { SectionHeading } from "@/components/ui";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = (await getEvents()).find((e) => e.slug === slug);
  return {
    title: event?.title || "Event not found",
    description: event?.description.slice(0, 160),
    openGraph: {
      title: event?.title,
      description: event?.description.slice(0, 160),
    },
  };
}
export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();
  const related = events
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);
  const url = safeUrl(event.registration_url);
  return (
    <div className="container section-pad">
      <Link className="text-link back-link" href="/events">
        <ArrowLeft size={16} />
        Back to events
      </Link>
      <div className="event-detail-grid">
        <div>
          <span className="category">{categoryLabel(event.category)}</span>
          <h1 className="detail-title">
            {event.title}
            <span className="yellow">.</span>
          </h1>
          <p className="body-copy preserve-lines">{event.description}</p>
          <div className="detail-poster">
            <Image
              src={
                event.poster_url || "/images/placeholders/event-placeholder.png"
              }
              alt={`${event.title} event poster`}
              className={
                !event.poster_url ||
                event.poster_url.startsWith("/images/placeholders/")
                  ? "placeholder-image"
                  : undefined
              }
              fill
              sizes="(max-width: 768px) 90vw, 60vw"
            />
          </div>
          {[
            ["The challenge", event.rules],
            ["Your coordinators", event.coordinators],
            ["What’s at stake", event.prize_details],
          ].map(([title, text]) => (
            <section className="detail-section" key={title}>
              <h2>{title}</h2>
              <p className="preserve-lines">{text || "To be announced."}</p>
            </section>
          ))}
        </div>
        <aside className="registration-card">
          <span className="section-number">YOUR NEXT CHALLENGE</span>
          <h2>Be part of it.</h2>
          <div>
            <CalendarDays />
            <span>
              DATE<strong>{formatDate(event.event_date)}</strong>
            </span>
          </div>
          <div>
            <Clock3 />
            <span>
              TIME · IST
              <strong>
                {event.event_time?.slice(0, 5) || "To be announced"}
              </strong>
            </span>
          </div>
          <div>
            <MapPin />
            <span>
              VENUE<strong>{event.venue || "To be announced"}</strong>
            </span>
          </div>
          <div>
            <Trophy />
            <span>
              PRIZES<strong>{event.prize_details || "To be announced"}</strong>
            </span>
          </div>
          {url ? (
            <a className="button" href={url} target="_blank" rel="noreferrer">
              Register now
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <button className="button" disabled>
              Registration opening soon
            </button>
          )}
          <p>
            For questions,{" "}
            <Link href="/contact">contact the organizing team.</Link>
          </p>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section-pad">
          <SectionHeading number="UP NEXT" title="Keep exploring." />
          <div className="event-grid">
            {related.map((e, i) => (
              <EventCard key={e.id} event={e} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
