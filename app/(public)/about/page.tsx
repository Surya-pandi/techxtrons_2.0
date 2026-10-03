import { SiteText, SiteSection } from "@/components/site-content";
import Image from "next/image";
import { Code2, Lightbulb, Users, ArrowUpRight } from "lucide-react";
import { getAbout, getContact } from "@/lib/data";
import { PageHeading, ButtonLink } from "@/components/ui";
import Reveal from "@/components/reveal";
export const metadata = { title: "About the association" };
export default async function AboutPage() {
  const [about, contact] = await Promise.all([getAbout(), getContact()]);
  const hasPhoto =
    about.image_url && !about.image_url.startsWith("/images/placeholders/");
  return (
    <>
      <SiteSection name="about.heading.visible">
        <PageHeading
          eyebrow={<SiteText name="about.the-people-behind-the-ideas" />}
          title={<SiteText name="about.united-by-curiosity" />}
          description={contact.department_name}
        />
      </SiteSection>
      <SiteSection name="about.story.visible">
        <section className="container about-grid section-pad">
          <SiteSection name="about.image.visible">
            <div
              className={hasPhoto ? "about-page-image" : "festival-about-art"}
            >
              {hasPhoto ? (
                <Image
                  src={about.image_url}
                  alt={contact.department_name}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              ) : (
                <>
                  <span className="about-art-label">
                    <SiteText name="about.the-techxtrons-mindset" />
                    <ArrowUpRight size={19} />
                  </span>
                  <Code2 size={68} strokeWidth={1.1} />
                  <strong>
                    <SiteText name="about.stay-curious" />
                    <br />
                    <SiteText name="about.make-things" />
                    <br />
                    <span>
                      <SiteText name="about.grow-together" />
                    </span>
                  </strong>
                  <span className="about-art-foot">
                    <SiteText name="about.information-technology-3-0" />
                  </span>
                </>
              )}
            </div>
          </SiteSection>
          <Reveal>
            <div className="section-number">
              <SiteText name="about.our-story" />
            </div>
            <h2>{about.title}</h2>
            <p className="body-copy preserve-lines">{about.description}</p>
            <ButtonLink href="/events">
              <SiteText name="about.discover-our-events" />
            </ButtonLink>
          </Reveal>
        </section>
      </SiteSection>
      <SiteSection name="about.values.visible">
        <section className="soft-section section-pad">
          <div className="container values-grid">
            {[
              { id: "vision", text: about.vision, icon: Lightbulb },
              { id: "mission", text: about.mission, icon: Users },
              { id: "objectives", text: about.objectives, icon: Code2 },
            ]
              .filter(({ text }) => text.trim())
              .map(({ id, text, icon: Icon }, i) => (
                <Reveal key={id} className="value-card">
                  <span className="value-number">
                    0{i + 1}
                    <Icon size={24} />
                  </span>
                  <h2>
                    <SiteText name={`about.${id}.title`} />
                  </h2>
                  <p className="preserve-lines">{text}</p>
                </Reveal>
              ))}
          </div>
        </section>
      </SiteSection>
      <SiteSection name="about.closing.visible">
        <div className="container about-closing">
          <span className="festival-pill">
            <SiteText name="about.find-your-people" />
          </span>
          <h2>
            <SiteText name="about.one-department" />
            <br />
            <SiteText name="about.so-many-possibilities" />
          </h2>
          <ButtonLink href="/contact" secondary>
            <SiteText name="about.let-s-connect" />
          </ButtonLink>
        </div>
      </SiteSection>
    </>
  );
}
