"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone-state">
      <span className="section-number">LET’S TRY THAT AGAIN</span>
      <h1>A brief intermission.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
