"use client";
export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="standalone-state">
      <span className="section-number">LET’S TRY THAT AGAIN</span>
      <h1>A brief intermission.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <button className="button" onClick={retry}>
        Try again
      </button>
    </main>
  );
}
