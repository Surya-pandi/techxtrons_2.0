"use client";
import { SiteText, SiteSection } from "@/components/site-content";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Event } from "@/lib/types";
import EventCard from "./event-card";
import { EmptyState } from "./ui";
export default function EventBrowser({
  events,
  initialCategory = "all",
}: {
  events: Event[];
  initialCategory?: string;
}) {
  const category = initialCategory;
  const [search, setSearch] = useState("");
  const filtered = events.filter(
    (e) =>
      (category === "all" || category === e.category) &&
      `${e.title} ${e.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="filter-toolbar">
        <nav className="filter-tabs" aria-label="Event pages">
          {[
            ["all", "All events", "/events"],
            ["technical", "Technical", "/technical-events"],
            ["non_technical", "Non-technical", "/non-technical-events"],
          ].map(([value, label, href]) => (
            <a
              key={value}
              href={href}
              aria-current={category === value ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Search events"
            placeholder="Find your next challenge…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="results-caption">
        <span>
          {filtered.length}
          <SiteText name="event-listings.experiences-to-explore" />
        </span>
        <SlidersHorizontal size={15} />
      </div>
      {filtered.length ? (
        <div className="event-grid">
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={<SiteText name="event-listings.no-events-found" />}
          text={
            <SiteText name="event-listings.try-another-search-or-event-category" />
          }
        />
      )}
    </>
  );
}
