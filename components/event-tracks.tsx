import Link from "next/link";
import { ArrowUpRight, Terminal, Sparkles, Gamepad2 } from "lucide-react";
import { Eyebrow } from "@/components/ui";

export default function EventTracks() {
  return (
    <section
      className="festival-explore container section-bottom"
      aria-label="Event categories"
    >
      <div className="festival-section-heading">
        <Eyebrow>CHOOSE YOUR EXPERIENCE</Eyebrow>
        <h2>
          Different interests.
          <br />
          <span className="yellow">The same energy.</span>
        </h2>
        <p>
          From technical challenges to creative adventures, there is more than
          one way to make your mark.
        </p>
      </div>
      <div className="festival-tracks">
        <Link
          href="/technical-events"
          className="festival-track track-technical"
        >
          <div className="track-top">
            <span>01 / TECHNICAL</span>
            <Terminal size={27} />
          </div>
          <h3>
            Think it.
            <br />
            Build it.
          </h3>
          <p>
            Coding, paper presentations, and projects. Explore ideas that move
            technology forward.
          </p>
          <span className="track-link">
            Explore technical events
            <ArrowUpRight size={21} />
          </span>
          <span className="track-symbol" aria-hidden="true">
            &lt;/&gt;
          </span>
        </Link>
        <Link
          href="/non-technical-events"
          className="festival-track track-creative"
        >
          <div className="track-top">
            <span>02 / NON-TECHNICAL</span>
            <Sparkles size={27} />
          </div>
          <h3>
            Find your
            <br />
            wild card.
          </h3>
          <p>
            Treasure hunts, photography, and gaming. Follow your curiosity
            beyond the code.
          </p>
          <span className="track-link">
            Explore non-technical events
            <ArrowUpRight size={21} />
          </span>
          <Gamepad2 className="track-symbol" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
