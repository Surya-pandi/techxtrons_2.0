import { Mail, MapPin, Phone, ArrowUpRight, Instagram } from "lucide-react";
import { getContact } from "@/lib/data";
import { safeUrl } from "@/lib/utils";
import { PageHeading } from "@/components/ui";
import ContactForm from "@/components/contact-form";
export const metadata = { title: "Get in touch" };
export default async function ContactPage() {
  const c = await getContact();
  return (
    <>
      <PageHeading
        eyebrow="WE’RE JUST A MESSAGE AWAY"
        title="Let’s connect"
        description="Questions, ideas, or a little more information. We’d love to hear from you."
      />
      <section className="container contact-grid section-bottom">
        <div className="contact-info">
          <h2>{c.department_name}</h2>
          <p>{c.college_name}</p>
          <div className="contact-info-card">
            <Mail />
            <div>
              <span>EMAIL US</span>
              {c.email ? (
                <a href={`mailto:${c.email}`}>{c.email}</a>
              ) : (
                <p>Email to be announced</p>
              )}
            </div>
          </div>
          <div className="contact-info-card">
            <Phone />
            <div>
              <span>GIVE US A CALL</span>
              {c.phone ? (
                <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>{c.phone}</a>
              ) : (
                <p>Phone number to be announced</p>
              )}
            </div>
          </div>
          <div className="contact-info-card">
            <MapPin />
            <div>
              <span>FIND US HERE</span>
              <p>{c.address}</p>
              {safeUrl(c.map_url) ? (
                <a
                  className="text-link"
                  href={safeUrl(c.map_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <small>
                  Directions will be shared once the venue is confirmed.
                </small>
              )}
            </div>
          </div>
          <div className="social-links">
            {safeUrl(c.instagram_url) ? (
              <a
                aria-label="Instagram"
                href={safeUrl(c.instagram_url)}
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={20} />
              </a>
            ) : (
              <span
                title="Instagram link to be added"
                aria-label="Instagram link to be added"
              >
                <Instagram size={20} />
              </span>
            )}
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
