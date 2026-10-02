import { getEvents } from "@/lib/data";
import type { Category } from "@/lib/types";
import EventBrowser from "./event-browser";
import EventTracks from "./event-tracks";
import { PageHeading } from "./ui";

const headings = {
  all: {
    eyebrow: "FIND YOUR ARENA",
    title: "Made for your moment",
    description:
      "Chase an idea. Take on a challenge. Discover something new about yourself.",
  },
  technical: {
    eyebrow: "FOR THE CURIOUS MINDS",
    title: "Technical events",
    description:
      "Code, create, and put your ideas to the test. Explore challenges built for curious minds.",
  },
  non_technical: {
    eyebrow: "FOR THE FREE SPIRITS",
    title: "Non-technical events",
    description:
      "Bring your creativity, teamwork, and competitive spirit. Find your next experience beyond the technical.",
  },
};

export default async function EventListing({
  category = "all",
}: {
  category?: Category | "all";
}) {
  const events = [...(await getEvents())].sort(
    (a, b) => Number(b.is_featured) - Number(a.is_featured),
  );
  const visible =
    category === "all"
      ? events
      : events.filter((event) => event.category === category);
  return (
    <>
      <PageHeading {...headings[category]} />
      {category === "all" && <EventTracks />}
      <section className="container section-bottom">
        <EventBrowser
          key={category}
          events={visible}
          initialCategory={category}
        />
      </section>
    </>
  );
}
