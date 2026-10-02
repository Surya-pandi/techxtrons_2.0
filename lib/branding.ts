export const branding = {
  eventName: "TECHXTRONS 3.0",
  edition: "3.0",
  departmentName: "Department of Information Technology",
  tagline: "Rise beyond. Be extraordinary.",
};

// Older database seeds can still contain the previous event edition.
export function resolveEventName(name: string) {
  const compact = name.replace(/\s+/g, "");
  return /^techxtrons(?:[23]\.0)?$/i.test(compact) ? branding.eventName : name;
}
