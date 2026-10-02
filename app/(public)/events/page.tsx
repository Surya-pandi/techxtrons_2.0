import EventListing from "@/components/event-listing";
export const metadata = {
  title: "Explore events",
  description:
    "Explore technical and non-technical department association events.",
};
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <EventListing
      category={
        category === "technical" || category === "non_technical"
          ? category
          : "all"
      }
    />
  );
}
