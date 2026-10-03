import { SiteText } from "@/components/site-content";
import { Eyebrow } from "@/components/ui";

export default function EventTracks() {
  return (
    <section
      className="festival-explore container section-bottom"
      aria-label="Event categories"
    >
      <div className="festival-section-heading">
        <Eyebrow>
          <SiteText name="event-categories.choose-your-experience" />
        </Eyebrow>
        <h2>
          <SiteText name="event-categories.different-interests" />
          <br />
          <span className="yellow">
            <SiteText name="event-categories.the-same-energy" />
          </span>
        </h2>
        <p>
          <SiteText name="event-categories.from-technical-challenges-to-creative-adventures-there-" />
        </p>
      </div>
    </section>
  );
}
