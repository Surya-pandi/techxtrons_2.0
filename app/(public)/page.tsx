import ScrollingRibbon from "@/components/scrolling-ribbon";
import { SiteText, SiteSection } from "@/components/site-content";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Code2,
  Lightbulb,
  Camera,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { getSettings, getWebsiteContent } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ButtonLink, Eyebrow } from "@/components/ui";
import Countdown from "@/components/countdown";
import EventWordmark from "@/components/event-wordmark";
export default async function Home() {
  const settings = await getSettings();
  const content = await getWebsiteContent();
  const topics = [
    { icon: Code2, style: "code" },
    { icon: Lightbulb, style: "idea" },
    { icon: Camera, style: "create" },
    { icon: Gamepad2, style: "play" },
  ];
  return (
    <>
      <SiteSection name="home.hero.visible">
        <section className="festival-hero">
          <div className="festival-grid" aria-hidden="true" />
          <div className="festival-topline">
            <span>
              <SiteText name="home.curious-minds-big-possibilities" />
            </span>
            <span>
              <SiteText name="home.it" />
              {settings.year}
            </span>
          </div>
          <SiteSection name="home.topics.visible">
            <div className="festival-topics">
              {topics
                .filter(
                  ({ style }) =>
                    content[`topic.${style}.visible`] !== false &&
                    content[`topic.${style}.href`],
                )
                .map(({ icon: Icon, style }) => (
                  <Link
                    key={style}
                    href={String(content[`topic.${style}.href`])}
                    className={"topic-card topic-" + style}
                  >
                    <span className="topic-card-top">
                      <SiteText name={`topic.${style}.label`} />
                      <ArrowUpRight size={14} />
                    </span>
                    <Icon className="topic-icon" strokeWidth={1.6} />
                    <span className="topic-caption">
                      <SiteText name={`topic.${style}.caption`} />
                    </span>
                  </Link>
                ))}
            </div>
          </SiteSection>
          <div className="festival-hero-content">
            <div className="festival-pill">
              <span />
              <SiteText name="home.the" />
              {settings.year}
              <SiteText name="home.edition" />
              <Sparkles size={13} />
            </div>
            <p className="festival-presenter">
              {settings.association_name}
              <SiteText name="home.presents" />
            </p>
            <h1 className="festival-title" aria-label={settings.event_name}>
              <EventWordmark
                name={settings.event_name}
                imageSrc={
                  settings.logo_url && settings.logo_url !== "/images/logo.png"
                    ? settings.logo_url
                    : undefined
                }
              />
            </h1>
            <h2 className="festival-manifesto">
              <SiteText name="home.big-ideas" />
              <br />
              <span>
                <SiteText name="home.bigger-possibilities" />
              </span>
            </h2>
            <p className="festival-description">
              {String(content["home.description"]).replaceAll(
                "{event_name}",
                settings.event_name,
              )}
            </p>
            <SiteSection name="home.actions.visible">
              <div className="festival-actions">
                {content["home.primary"] && content["home.primary.href"] && (
                  <ButtonLink href={String(content["home.primary.href"])}>
                    <SiteText name="home.primary" />
                  </ButtonLink>
                )}
                {content["home.secondary"] &&
                  content["home.secondary.href"] && (
                    <ButtonLink
                      href={String(content["home.secondary.href"])}
                      secondary
                    >
                      <SiteText name="home.secondary" />
                    </ButtonLink>
                  )}
              </div>
            </SiteSection>
            <SiteSection name="home.details.visible">
              <div className="festival-details">
                <span>
                  <CalendarDays size={15} />
                  {formatDate(settings.event_starts_at)}
                </span>
                <span>
                  <MapPin size={15} />
                  {settings.venue}
                </span>
              </div>
            </SiteSection>
          </div>
          <Link className="festival-scroll" href="/events">
            <ArrowUpRight size={16} />
            <span>
              <SiteText name="home.explore-the-events" />
            </span>
          </Link>
          <span className="festival-side-note" aria-hidden="true">
            <SiteText name="home.think-create-connect" />
          </span>
        </section>
      </SiteSection>
      <SiteSection name="home.ribbon.visible">
        <ScrollingRibbon />
      </SiteSection>
      <SiteSection name="home.countdown.visible">
        <section className="festival-countdown festival-home-countdown container">
          <div>
            <Eyebrow>
              <SiteText name="home.save-the-moment" />
            </Eyebrow>
            <h2>
              <SiteText name="home.something-worth" />
              <br />
              <SiteText name="home.looking-forward-to" />
            </h2>
            <p>
              {settings.event_starts_at ? (
                <SiteText name="home.countdown.description" />
              ) : (
                <SiteText name="home.countdown.unannounced" />
              )}
            </p>
          </div>
          <Countdown target={settings.event_starts_at} />
        </section>
      </SiteSection>
    </>
  );
}
