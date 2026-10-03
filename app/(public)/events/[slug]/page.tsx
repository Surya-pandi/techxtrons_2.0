import { SiteText, SiteSection } from "@/components/site-content";
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
        <SiteText name="event-details.back-to-events" />
      </Link>
      <div className="event-detail-grid">
        <div>
          <span className="category">{categoryLabel(event.category)}</span>
          <h1 className="detail-title">
            {event.title}
            <span className="yellow">.</span>
          </h1>
          <p className="body-copy preserve-lines">{event.description}</p>
          <SiteSection name="event-details.poster.visible">
            <div className="detail-poster">
              <Image
                src={
                  event.poster_url ||
                  "/images/placeholders/event-placeholder.png"
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
          </SiteSection>
          {[
            ["rules", event.rules],
            ["coordinators", event.coordinators],
            ["prizes", event.prize_details],
          ]
            .filter(([, text]) => text.trim())
            .map(([id, text]) => (
              <SiteSection name={`event-details.${id}.visible`} key={id}>
                <section className="detail-section">
                  <h2>
                    <SiteText name={`event-details.${id}.title`} />
                  </h2>
                  <p className="preserve-lines">{text}</p>
                </section>
              </SiteSection>
            ))}
        </div>
        <SiteSection name="event-details.registration.visible">
          <aside className="registration-card">
            <span className="section-number">
              <SiteText name="event-details.your-next-challenge" />
            </span>
            <h2>
              <SiteText name="event-details.be-part-of-it" />
            </h2>
            <div>
              <CalendarDays />
              <span>
                <SiteText name="event-details.date" />
                <strong>{formatDate(event.event_date)}</strong>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <SiteText name="event-details.time-ist" />
                <strong>
                  {event.event_time?.slice(0, 5) || "To be announced"}
                </strong>
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                <SiteText name="event-details.venue" />
                <strong>{event.venue || "To be announced"}</strong>
              </span>
            </div>
            <div>
              <Trophy />
              <span>
                <SiteText name="event-details.prizes" />
                <strong>{event.prize_details || "To be announced"}</strong>
              </span>
            </div>
            {url ? (
              <a className="button" href={url} target="_blank" rel="noreferrer">
                <SiteText name="event-details.register-now" />
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <button className="button" disabled>
                <SiteText name="event-details.registration-opening-soon" />
              </button>
            )}
            <p>
              <SiteText name="event-details.for-questions" />{" "}
              <Link href="/contact">
                <SiteText name="event-details.contact-the-organizing-team" />
              </Link>
            </p>
          </aside>
        </SiteSection>
      </div>
      <SiteSection name="event-details.related.visible">
        {related.length > 0 && (
          <section className="section-pad">
            <SectionHeading
              number={<SiteText name="event-details.up-next" />}
              title={<SiteText name="event-details.keep-exploring" />}
            />
            <div className="event-grid">
              {related.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} />
              ))}
            </div>
          </section>
        )}
      </SiteSection>
    </div>
  );
}
