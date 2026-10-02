import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone-state">
      <span className="section-number">404 / A DIFFERENT PATH</span>
      <h1>This page is off the grid.</h1>
      <p>The page you’re looking for may have moved.</p>
      <Link className="button" href="/">
        Back to home ↗
      </Link>
    </main>
  );
}
