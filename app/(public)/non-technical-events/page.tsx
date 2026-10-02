import EventListing from "@/components/event-listing";
export const metadata = {
  title: "Non-technical events",
  description:
    "Explore creative, gaming, and other non-technical department association events.",
};
export default function NonTechnicalEventsPage() {
  return <EventListing category="non_technical" />;
}
