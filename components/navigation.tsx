"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  House,
  Users,
  CalendarDays,
  Images,
  Mail,
  Code2,
  Gamepad2,
} from "lucide-react";
import type { Settings } from "@/lib/types";
import { SiteText, SiteSection, useSiteContent } from "./site-content";
// Use native links so each menu selection loads its independent page document.
const navigationItems = [
  { id: "home", icon: House },
  { id: "about", icon: Users },
  { id: "events", icon: CalendarDays },
  { id: "technical", icon: Code2 },
  {
    id: "nontechnical",
    icon: Gamepad2,
  },
  { id: "gallery", icon: Images },
  { id: "contact", icon: Mail },
];
export default function Navigation({ settings }: { settings: Settings }) {
  const content = useSiteContent();
  const links = navigationItems
    .filter(
      ({ id }) =>
        content[`nav.${id}.visible`] !== false &&
        content[`nav.${id}.label`] &&
        content[`nav.${id}.href`],
    )
    .map((item) => ({
      ...item,
      label: String(content[`nav.${item.id}.label`]),
      href: String(content[`nav.${item.id}.href`]),
    }));
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || (href === "/events" && path.startsWith("/events/"));
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <header className="festival-header">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="festival-masthead">
          <SiteSection name="navigation.brand.visible">
            <a
              href="/"
              className="festival-brand"
              aria-label={settings.event_name + " home"}
            >
              {settings.logo_url && settings.logo_url !== "/images/logo.png" ? (
                <Image src={settings.logo_url} alt="" width={38} height={38} />
              ) : (
                <span className="festival-brand-icon" aria-hidden="true">
                  X
                </span>
              )}
              <span>
                {settings.event_name}
                <small>
                  <SiteText name="nav.subtitle" />
                </small>
              </span>
            </a>
          </SiteSection>
          <SiteSection name="navigation.tagline.visible">
            <span className="festival-host">
              {settings.association_name}
              <span>
                <SiteText name="nav.tagline" />
              </span>
            </span>
          </SiteSection>
          <SiteSection name="navigation.cta.visible">
            {content["nav.cta.href"] && content["nav.cta"] && (
              <a
                className="festival-header-cta"
                href={String(content["nav.cta.href"])}
              >
                <SiteText name="nav.cta" />
                <ArrowUpRight size={17} />
              </a>
            )}
          </SiteSection>
          <button
            className="festival-menu-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="festival-mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map(({ id, href, label, icon: Icon }) => (
              <a
                key={id}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <SiteSection name="navigation.dock.visible">
        <nav className="festival-dock" aria-label="Main navigation">
          {links.map(({ id, href, label, icon: Icon }) => (
            <a
              key={id}
              href={href}
              aria-label={label}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={21} strokeWidth={1.7} />
              <span className="dock-label">{label}</span>
            </a>
          ))}
        </nav>
      </SiteSection>
    </>
  );
}
