"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import type { Event, GalleryImage } from "@/lib/types";
import { categoryLabel } from "@/lib/utils";
import { EmptyState } from "./ui";
export default function GalleryBrowser({
  images,
  events,
}: {
  images: GalleryImage[];
  events: Event[];
}) {
  const [category, setCategory] = useState("all");
  const [eventId, setEventId] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const filtered = images.filter(
    (i) =>
      (category === "all" || i.category === category) &&
      (eventId === "all" || i.event_id === eventId),
  );
  useEffect(() => {
    if (selected === null) return;
    returnFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      returnFocus.current?.focus();
    };
  }, [selected === null]);
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight")
        setSelected((n) => (n === null ? null : (n + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setSelected((n) =>
          n === null ? null : (n - 1 + filtered.length) % filtered.length,
        );
      if (e.key === "Tab") {
        const buttons =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        if (e.shiftKey && document.activeElement === buttons[0]) {
          e.preventDefault();
          buttons[buttons.length - 1].focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === buttons[buttons.length - 1]
        ) {
          e.preventDefault();
          buttons[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected, filtered.length]);
  const photo = selected === null ? null : filtered[selected];
  return (
    <>
      <div className="filter-toolbar gallery-toolbar">
        <div className="filter-tabs" role="group" aria-label="Gallery category">
          {[
            "all",
            "technical",
            "non_technical",
            "cultural",
            "moments",
            "others",
          ].map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {categoryLabel(c)}
            </button>
          ))}
        </div>
        <select
          aria-label="Filter by event"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="all">All events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>
      {filtered.length ? (
        <div className="gallery-grid">
          {filtered.map((photo, i) => (
            <button
              onClick={() => setSelected(i)}
              className={`gallery-tile gallery-tile-${i % 3}`}
              key={photo.id}
            >
              <Image
                src={photo.image_url}
                className={
                  photo.image_url.startsWith("/images/placeholders/")
                    ? "placeholder-image"
                    : undefined
                }
                alt={photo.caption}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw"
              />
              <span>
                {photo.caption}
                <ArrowUpRight size={20} />
              </span>
              {photo.is_featured && <em>FEATURED</em>}
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="The memories start here."
          text="Photos from TECHXTRONS 2.0 will appear here as the organizing team shares them. Try another collection or check back for the first moments."
        />
      )}
      {photo && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          ref={dialogRef}
          onClick={() => setSelected(null)}
        >
          <button
            className="lightbox-close"
            ref={closeRef}
            aria-label="Close image viewer"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <button
            className="lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setSelected((selected! - 1 + filtered.length) % filtered.length);
            }}
          >
            <ChevronLeft />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <div>
              <Image
                src={photo.image_url}
                className={
                  photo.image_url.startsWith("/images/placeholders/")
                    ? "placeholder-image"
                    : undefined
                }
                alt={photo.caption}
                fill
                sizes="90vw"
              />
            </div>
            <figcaption>
              {photo.caption}
              <span>
                {selected! + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
          <button
            className="lightbox-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setSelected((selected! + 1) % filtered.length);
            }}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
