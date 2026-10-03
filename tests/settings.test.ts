import test from "node:test";
import assert from "node:assert/strict";
import { defaultSettings } from "../lib/defaults";
import { resolveSettings } from "../lib/settings";
import { settingsSchema } from "../lib/validation";

test("clearing the countdown stays unannounced after loading saved settings", () => {
  const saved = settingsSchema.parse({
    ...defaultSettings,
    event_starts_at: "",
  });
  const loaded = resolveSettings({ ...defaultSettings, ...saved });
  assert.equal(loaded.event_starts_at, null);
});

test("loading settings preserves configured dates and upgrades legacy branding", () => {
  const loaded = resolveSettings({
    ...defaultSettings,
    event_name: "TECHXTRONS 2.0",
    event_starts_at: "2026-12-15T09:00:00+05:30",
  });
  assert.equal(loaded.event_name, "TECHXTRONS 3.0");
  assert.equal(loaded.event_starts_at, "2026-12-15T09:00:00+05:30");
  assert.equal(
    resolveSettings(defaultSettings).event_starts_at,
    defaultSettings.event_starts_at,
  );
});
