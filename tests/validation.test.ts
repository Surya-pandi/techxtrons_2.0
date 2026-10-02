import test from "node:test";
import assert from "node:assert/strict";
import {
  eventSchema,
  settingsSchema,
  messageSchema,
  validateImage,
  gallerySchema,
} from "../lib/validation";
import { defaultSettings } from "../lib/defaults";
import { safeUrl } from "../lib/utils";
const event = {
  title: "Coding",
  slug: "coding",
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
test("rejects executable URLs and invalid event categories", () => {
  assert.equal(
    eventSchema.safeParse({ ...event, registration_url: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, category: "administrator" }).success,
    false,
  );
  assert.equal(safeUrl("javascript:alert(1)"), undefined);
  assert.equal(
    safeUrl("https://example.com/register"),
    "https://example.com/register",
  );
});
test("keeps unannounced event times nullable and rejects malformed dates", () => {
  const parsed = eventSchema.parse(event);
  assert.equal(parsed.event_date, null);
  assert.equal(parsed.event_time, null);
  assert.equal(
    eventSchema.safeParse({ ...event, event_date: "2026-02-30" }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, event_time: "25:70" }).success,
    false,
  );
});
test("rejects oversized and executable uploads", () => {
  assert.throws(() => validateImage({ type: "image/svg+xml", size: 500 }));
  assert.throws(() =>
    validateImage({ type: "image/png", size: 10 * 1024 * 1024 + 1 }),
  );
  assert.throws(() => validateImage({ type: "image/png", size: 0 }));
  assert.doesNotThrow(() =>
    validateImage({ type: "image/webp", size: 10 * 1024 * 1024 }),
  );
});
test("countdown requires an explicit timezone and allows an unannounced date", () => {
  assert.equal(
    settingsSchema.safeParse({
      ...defaultSettings,
      event_starts_at: "2026-12-15T09:00:00+05:30",
    }).success,
    true,
  );
  assert.equal(
    settingsSchema.safeParse({
      ...defaultSettings,
      event_starts_at: "2026-12-15T09:00",
    }).success,
    false,
  );
  assert.equal(
    settingsSchema.parse({ ...defaultSettings, event_starts_at: "" })
      .event_starts_at,
    null,
  );
});
test("contact form rejects invalid email, short messages and honeypot submissions", () => {
  const message = {
    name: "A Student",
    email: "student@example.com",
    subject: "Event enquiry",
    message: "Please tell me more about the event.",
    website: "",
  };
  assert.equal(messageSchema.safeParse(message).success, true);
  for (const change of [
    { email: "invalid" },
    { message: "hi" },
    { website: "spam" },
  ])
    assert.equal(
      messageSchema.safeParse({ ...message, ...change }).success,
      false,
    );
});
test("gallery association must be a UUID or blank", () => {
  const gallery = {
    image_url: "/images/placeholders/event-placeholder.png",
    storage_path: "admin/photo.png",
    caption: "A photo",
    category: "moments",
    event_id: "",
    is_featured: false,
  };
  assert.equal(gallerySchema.parse(gallery).event_id, null);
  assert.equal(
    gallerySchema.safeParse({ ...gallery, event_id: "bad-id" }).success,
    false,
  );
});
