import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Code2,
  Crosshair,
  Zap,
} from "lucide-react";
import type { Event } from "@/lib/types";
import { categoryLabel, formatDate } from "@/lib/utils";
export default function EventCard({
  event,
  index = 0,
}: {
  event: Event;
  index?: number;
}) {
  const Icon = [Code2, Zap, Crosshair][index % 3];
  const placeholder =
    !event.poster_url || event.poster_url.startsWith("/images/placeholders/");
  return (
    <article className="event-card">
      <Link
        href={`/events/${event.slug}`}
        className={`event-poster poster-${index % 3}`}
        aria-label={`View ${event.title}`}
      >
        {placeholder ? (
          <>
            <div className="poster-top">
              <span>
                {event.id.startsWith("sample")
                  ? "SAMPLE EVENT"
                  : "EVENT POSTER PLACEHOLDER"}
              </span>
              <span>0{index + 1}</span>
            </div>
            <Icon className="poster-icon" strokeWidth={0.8} />
            <div className="poster-title">
              {event.title.split(" ").slice(0, -1).join(" ")}
              <br />
              <b>{event.title.split(" ").slice(-1)}</b>
              <ArrowUpRight size={27} />
            </div>
          </>
        ) : (
          <Image
            src={event.poster_url}
            alt={`${event.title} event poster`}
            fill
            sizes="(max-width: 640px) 95vw, (max-width: 1000px) 48vw, 32vw"
          />
        )}
      </Link>
      <div className="event-card-meta">
        <span className={`category ${event.category}`}>
          {categoryLabel(event.category)}
        </span>
        <span>
          <CalendarDays size={13} />
          {formatDate(event.event_date)}
        </span>
      </div>
      <Link href={`/events/${event.slug}`} className="event-card-title">
        <h3>{event.title}</h3>
        <ArrowUpRight size={20} />
      </Link>
      <p>
        {event.id.startsWith("sample")
          ? "Sample event · Details coming soon"
          : event.venue || "Venue to be announced"}
      </p>
    </article>
  );
}
