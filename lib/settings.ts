import { resolveEventName } from "./branding";
import type { Settings } from "./types";

export function resolveSettings(settings: Settings): Settings {
  return {
    ...settings,
    event_name: resolveEventName(settings.event_name),
  };
}
