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
// Use native links so each menu selection loads its independent page document.
const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/about", label: "About", icon: Users },
  { href: "/events", label: "All events", icon: CalendarDays },
  { href: "/technical-events", label: "Technical events", icon: Code2 },
  {
    href: "/non-technical-events",
    label: "Non-technical events",
    icon: Gamepad2,
  },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/contact", label: "Contact", icon: Mail },
];
export default function Navigation({ settings }: { settings: Settings }) {
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
              <small>DEPARTMENT OF IT</small>
            </span>
          </a>
          <span className="festival-host">
            {settings.association_name}
            <span>Ideas. Energy. Impact.</span>
          </span>
          <a className="festival-header-cta" href="/events">
            Explore events
            <ArrowUpRight size={17} />
          </a>
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
            {links.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
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
      <nav className="festival-dock" aria-label="Main navigation">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon size={21} strokeWidth={1.7} />
            <span className="dock-label">{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
