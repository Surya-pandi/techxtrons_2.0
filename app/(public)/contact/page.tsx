import { SiteText, SiteSection } from "@/components/site-content";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getContact } from "@/lib/data";
import { safeUrl } from "@/lib/utils";
import { PageHeading } from "@/components/ui";
import ContactForm from "@/components/contact-form";
export const metadata = { title: "Get in touch" };
export default async function ContactPage() {
  const c = await getContact();
  return (
    <>
      <SiteSection name="contact.heading.visible">
        <PageHeading
          eyebrow={<SiteText name="contact.we-re-just-a-message-away" />}
          title={<SiteText name="contact.let-s-connect" />}
          description={
            <SiteText name="contact.questions-ideas-or-a-little-more-information-we-d-love-" />
          }
        />
      </SiteSection>
      <section className="container contact-grid section-bottom">
        <SiteSection name="contact.details.visible">
          <div className="contact-info">
            <h2>{c.department_name}</h2>
            <p>{c.college_name}</p>
            <SiteSection name="contact.email.visible">
              <div className="contact-info-card">
                <Mail />
                <div>
                  <span>
                    <SiteText name="contact.email-us" />
                  </span>
                  {c.email ? (
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  ) : (
                    <p>
                      <SiteText name="contact.email-to-be-announced" />
                    </p>
                  )}
                </div>
              </div>
            </SiteSection>
            <SiteSection name="contact.phone.visible">
              <div className="contact-info-card">
                <Phone />
                <div>
                  <span>
                    <SiteText name="contact.give-us-a-call" />
                  </span>
                  {c.phone ? (
                    <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
                      {c.phone}
                    </a>
                  ) : (
                    <p>
                      <SiteText name="contact.phone-number-to-be-announced" />
                    </p>
                  )}
                </div>
              </div>
            </SiteSection>
            <SiteSection name="contact.address.visible">
              <div className="contact-info-card">
                <MapPin />
                <div>
                  <span>
                    <SiteText name="contact.find-us-here" />
                  </span>
                  <p>{c.address}</p>
                  {safeUrl(c.map_url) ? (
                    <a
                      className="text-link"
                      href={safeUrl(c.map_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <SiteText name="contact.open-in-maps" />
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <small>
                      <SiteText name="contact.directions-will-be-shared-once-the-venue-is-confirmed" />
                    </small>
                  )}
                </div>
              </div>
            </SiteSection>
            <SiteSection name="contact.socials.visible">
              <div className="social-links">
                {[
                  ["Instagram", c.instagram_url, Instagram],
                  ["LinkedIn", c.linkedin_url, Linkedin],
                  ["YouTube", c.youtube_url, Youtube],
                ].map(([label, url, Icon]) => {
                  const href = safeUrl(url as string);
                  const SocialIcon = Icon as typeof Instagram;
                  return href ? (
                    <a
                      key={label as string}
                      aria-label={label as string}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <SocialIcon size={20} />
                    </a>
                  ) : null;
                })}
              </div>
            </SiteSection>
          </div>
        </SiteSection>
        <SiteSection name="contact.form.visible">
          <ContactForm />
        </SiteSection>
      </section>
    </>
  );
}
