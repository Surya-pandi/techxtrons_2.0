export function categoryLabel(value: string) {
  return value === "non_technical"
    ? "Non-technical"
    : value.charAt(0).toUpperCase() + value.slice(1);
}
export function formatDate(value?: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(
        new Date(value.length === 10 ? value + "T00:00:00+05:30" : value),
      )
    : "Date to be announced";
}
export function safeUrl(value?: string | null) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
