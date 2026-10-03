"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowUpRight, X, Search } from "lucide-react";
import type { Event } from "@/lib/types";
import { categoryLabel, formatDate } from "@/lib/utils";
import { deleteRecord } from "@/app/actions/admin";
import { eventFields } from "@/lib/admin-fields";
import ContentForm from "./content-form";
import ConfirmDialog from "./confirm-dialog";
const blank = {
  title: "",
  slug: "",
  category: "technical",
  description: "",
  poster_url: "",
  event_date: "",
  event_time: "",
  venue: "",
  rules: "",
  coordinators: "",
  prize_details: "",
  registration_url: "",
  is_featured: false,
};
export default function EventsManager({ events }: { events: Event[] }) {
  const [editing, setEditing] = useState<Event | "new" | null>(null);
  const [deleting, setDeleting] = useState<Event | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const filtered = events.filter(
    (e) =>
      (category === "all" || category === e.category) &&
      e.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">THE EXPERIENCES</span>
          <h1>Event management.</h1>
          <p>Create, refine, and spotlight your events.</p>
        </div>
        <button className="button" onClick={() => setEditing("new")}>
          <Plus size={16} />
          New event
        </button>
      </div>
      {notice && (
        <p className="form-notice" role="status">
          {notice}
        </p>
      )}
      {editing !== null ? (
        <section className="admin-panel">
          <div className="panel-title">
            <h2>
              {editing === "new" ? "Create an event" : `Edit ${editing.title}`}
            </h2>
            <button
              className="icon-button"
              aria-label="Close editor"
              onClick={() => setEditing(null)}
            >
              <X />
            </button>
          </div>
          <ContentForm
            key={editing === "new" ? "new" : editing.id}
            table="events"
            id={editing === "new" ? null : editing.id}
            fields={eventFields}
            initial={
              editing === "new"
                ? blank
                : {
                    ...editing,
                    event_date: editing.event_date || "",
                    event_time: editing.event_time || "",
                    created_at: editing.created_at || "",
                  }
            }
            onSaved={() => {
              setEditing(null);
              setNotice("Event saved.");
            }}
          />
        </section>
      ) : (
        <>
          <div className="filter-toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                aria-label="Search events"
                placeholder="Search events"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="technical">Technical</option>
              <option value="non_technical">Non-technical</option>
            </select>
          </div>
          <section className="admin-panel">
            {filtered.length ? (
              filtered.map((event) => (
                <div className="admin-event-row" key={event.id}>
                  <div>
                    <h3>
                      {event.title}
                      {event.is_featured && (
                        <span className="featured-tag">FEATURED</span>
                      )}
                    </h3>
                    <p>
                      {categoryLabel(event.category)} ·{" "}
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                  <div className="row-actions">
                    <Link
                      className="icon-button"
                      href={`/events/${event.slug}`}
                      aria-label={`Preview ${event.title}`}
                      target="_blank"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                    <button
                      className="icon-button"
                      aria-label={`Edit ${event.title}`}
                      onClick={() => setEditing(event)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${event.title}`}
                      onClick={() => setDeleting(event)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No events found. Create an event to get started.</p>
            )}
          </section>
        </>
      )}
      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.title}?`}
          text="This will permanently delete the event. Associated gallery images will remain in the gallery."
          pending={pending}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            startTransition(async () => {
              try {
                const result = await deleteRecord("events", deleting.id);
                setNotice(result.message);
                setDeleting(null);
                if (result.success) {
                  router.refresh();
                }
              } catch {
                setNotice(
                  "Unable to delete. Check your connection and try again.",
                );
                setDeleting(null);
              }
            })
          }
        />
      )}
    </>
  );
}
