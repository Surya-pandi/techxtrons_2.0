import EventListing from "@/components/event-listing";
export const metadata = {
  title: "Technical events",
  description:
    "Explore coding, presentation, and other technical department association events.",
};
export default function TechnicalEventsPage() {
  return <EventListing category="technical" />;
}
