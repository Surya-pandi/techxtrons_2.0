import { getEvents } from "@/lib/data";
import type { Category } from "@/lib/types";
import EventBrowser from "./event-browser";
import EventTracks from "./event-tracks";
import { PageHeading } from "./ui";
import { SiteSection, SiteText } from "./site-content";

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
      <SiteSection name="event-listings.heading.visible">
        <PageHeading
          eyebrow={<SiteText name={`listing.${category}.eyebrow`} />}
          title={<SiteText name={`listing.${category}.title`} />}
          description={<SiteText name={`listing.${category}.description`} />}
        />
      </SiteSection>
      <SiteSection name="event-listings.categories.visible">
        {category === "all" && <EventTracks />}
      </SiteSection>
      <SiteSection name="event-listings.list.visible">
        <section className="container section-bottom">
          <EventBrowser
            key={category}
            events={visible}
            initialCategory={category}
          />
        </section>
      </SiteSection>
    </>
  );
}
