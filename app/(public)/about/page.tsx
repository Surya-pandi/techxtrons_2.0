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
      <PageHeading
        eyebrow="THE PEOPLE BEHIND THE IDEAS"
        title="United by curiosity"
        description={contact.department_name}
      />
      <section className="container about-grid section-pad">
        <div className={hasPhoto ? "about-page-image" : "festival-about-art"}>
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
                THE TECHXTRONS MINDSET
                <ArrowUpRight size={19} />
              </span>
              <Code2 size={68} strokeWidth={1.1} />
              <strong>
                Stay curious.
                <br />
                Make things.
                <br />
                <span>Grow together.</span>
              </strong>
              <span className="about-art-foot">
                INFORMATION TECHNOLOGY / 2.0
              </span>
            </>
          )}
        </div>
        <Reveal>
          <div className="section-number">OUR STORY</div>
          <h2>{about.title}</h2>
          <p className="body-copy preserve-lines">{about.description}</p>
          <ButtonLink href="/events">Discover our events</ButtonLink>
        </Reveal>
      </section>
      <section className="soft-section section-pad">
        <div className="container values-grid">
          {[
            { title: "Our vision", text: about.vision, icon: Lightbulb },
            { title: "Our mission", text: about.mission, icon: Users },
            { title: "Our objectives", text: about.objectives, icon: Code2 },
          ].map(({ title, text, icon: Icon }, i) => (
            <Reveal key={title} className="value-card">
              <span className="value-number">
                0{i + 1}
                <Icon size={24} />
              </span>
              <h2>{title}</h2>
              <p className="preserve-lines">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <div className="container about-closing">
        <span className="festival-pill">FIND YOUR PEOPLE</span>
        <h2>
          One department.
          <br />
          So many possibilities.
        </h2>
        <ButtonLink href="/contact" secondary>
          Let's connect
        </ButtonLink>
      </div>
    </>
  );
}
