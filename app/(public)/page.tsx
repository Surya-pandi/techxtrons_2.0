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
import { getSettings } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ButtonLink, Eyebrow } from "@/components/ui";
import Countdown from "@/components/countdown";
import EventWordmark from "@/components/event-wordmark";
export default async function Home() {
  const settings = await getSettings();
  const topics = [
    {
      label: "CODE",
      caption: "Think. Build. Repeat.",
      icon: Code2,
      href: "/technical-events",
      style: "code",
    },
    {
      label: "IDEATE",
      caption: "Start with a what if.",
      icon: Lightbulb,
      href: "/technical-events",
      style: "idea",
    },
    {
      label: "CREATE",
      caption: "Make it your own.",
      icon: Camera,
      href: "/non-technical-events",
      style: "create",
    },
    {
      label: "PLAY",
      caption: "Bring your game.",
      icon: Gamepad2,
      href: "/non-technical-events",
      style: "play",
    },
  ];
  return (
    <>
      <section className="festival-hero">
        <div className="festival-grid" aria-hidden="true" />
        <div className="festival-topline">
          <span>CURIOUS MINDS. BIG POSSIBILITIES.</span>
          <span>IT / {settings.year}</span>
        </div>
        <div className="festival-topics">
          {topics.map(({ label, caption, icon: Icon, href, style }) => (
            <Link
              key={label}
              href={href}
              className={"topic-card topic-" + style}
            >
              <span className="topic-card-top">
                {label}
                <ArrowUpRight size={14} />
              </span>
              <Icon className="topic-icon" strokeWidth={1.6} />
              <span className="topic-caption">{caption}</span>
            </Link>
          ))}
        </div>
        <div className="festival-hero-content">
          <div className="festival-pill">
            <span /> THE {settings.year} EDITION <Sparkles size={13} />
          </div>
          <p className="festival-presenter">
            {settings.association_name} presents
          </p>
          <h1 className="festival-title" aria-label={settings.event_name}>
            <EventWordmark name={settings.event_name} />
          </h1>
          <h2 className="festival-manifesto">
            Big ideas.
            <br />
            <span>Bigger possibilities.</span>
          </h2>
          <p className="festival-description">
            A place to code, create, compete, and connect. Bring your curiosity
            to {settings.event_name} and find your next big moment.
          </p>
          <div className="festival-actions">
            <ButtonLink href="/events">Find your event</ButtonLink>
            <ButtonLink href="/about" secondary>
              Meet TECHXTRONS
            </ButtonLink>
          </div>
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
        </div>
        <Link className="festival-scroll" href="/events">
          <ArrowUpRight size={16} />
          <span>EXPLORE THE EVENTS</span>
        </Link>
        <span className="festival-side-note" aria-hidden="true">
          &lt; THINK / CREATE / CONNECT &gt;
        </span>
      </section>
      <div className="festival-ribbon" aria-hidden="true">
        <span>CODE WITH CURIOSITY</span>
        <Sparkles />
        <span>CREATE WITH PURPOSE</span>
        <Sparkles />
        <span>COMPETE WITH SPIRIT</span>
        <Sparkles />
        <span>CONNECT WITH PEOPLE</span>
      </div>
      <section className="festival-countdown festival-home-countdown container">
        <div>
          <Eyebrow>SAVE THE MOMENT</Eyebrow>
          <h2>
            Something worth
            <br />
            looking forward to.
          </h2>
          <p>
            {settings.event_starts_at
              ? "Your next experience is getting closer."
              : "The event date will be announced here. Stay curious."}
          </p>
        </div>
        <Countdown target={settings.event_starts_at} />
      </section>
    </>
  );
}
