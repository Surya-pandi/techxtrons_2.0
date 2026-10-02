import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "button-outline" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
export function SectionHeading({
  number,
  title,
  text,
  href,
  link,
}: {
  number: string;
  title: string;
  text?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="section-number">{number} / THE EXPERIENCE</div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-heading container">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>
        {title}
        <span className="yellow">.</span>
      </h1>
      <p>{description}</p>
    </section>
  );
}
export function EmptyState({
  title = "Something extraordinary is on its way.",
  text = "Check back soon for updates from the organizing team.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty-state">
      <Sparkles size={28} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
