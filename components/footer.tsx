import { SiteText, SiteSection } from "@/components/site-content";
import { ArrowUpRight } from "lucide-react";
import type { Contact, Settings } from "@/lib/types";
import { safeUrl } from "@/lib/utils";
export default function Footer({
  settings,
  contact,
}: {
  settings: Settings;
  contact: Contact;
}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="footer-kicker">
              <SiteText name="footer.curious-minds-belong-here" />
            </span>
            <h2>
              <SiteText name="footer.your-next" />
              <br />
              <SiteText name="footer.big-idea" />
              <span className="yellow">.</span>
            </h2>
          </div>
          <div className="footer-links">
            <span>
              <SiteText name="footer.explore" />
            </span>
            <a href="/about">
              <SiteText name="footer.the-association" />
            </a>
            <a href="/events">
              <SiteText name="footer.our-events" />
            </a>
            <a href="/gallery">
              <SiteText name="footer.the-gallery" />
            </a>
          </div>
          <div className="footer-links">
            <span>
              <SiteText name="footer.let-s-connect" />
            </span>
            <a href="/contact">
              <SiteText name="footer.get-in-touch" />
              <ArrowUpRight size={14} />
            </a>
            {[
              ["Instagram", contact.instagram_url],
              ["LinkedIn", contact.linkedin_url],
              ["YouTube", contact.youtube_url],
            ].map(
              ([label, url]) =>
                safeUrl(url) && (
                  <a
                    key={label}
                    href={safeUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                    <ArrowUpRight size={14} />
                  </a>
                ),
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {settings.year} {settings.event_name} ·{" "}
            {settings.association_name}
          </span>
          <span>
            <SiteText name="footer.techxtrons" />
            {settings.year}
          </span>
          <span>
            <SiteText name="footer.created-to-inspire" />
          </span>
        </div>
      </div>
    </footer>
  );
}
