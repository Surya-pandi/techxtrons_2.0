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
            <span className="footer-kicker">CURIOUS MINDS BELONG HERE.</span>
            <h2>
              Your next
              <br />
              big idea<span className="yellow">.</span>
            </h2>
          </div>
          <div className="footer-links">
            <span>EXPLORE</span>
            <a href="/about">The association</a>
            <a href="/events">Our events</a>
            <a href="/gallery">The gallery</a>
          </div>
          <div className="footer-links">
            <span>LET’S CONNECT</span>
            <a href="/contact">
              Get in touch <ArrowUpRight size={14} />
            </a>
            {safeUrl(contact.instagram_url) && (
              <a
                href={safeUrl(contact.instagram_url)}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {settings.year} {settings.event_name} ·{" "}
            {settings.association_name}
          </span>
          <span>TECHXTRONS / {settings.year}</span>
          <span>CREATED TO INSPIRE.</span>
        </div>
      </div>
    </footer>
  );
}
