"use client";
import { useEffect, useState } from "react";
export default function Countdown({ target }: { target: string | null }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!target) {
      setRemaining(null);
      return;
    }
    const tick = () =>
      setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);
  if (remaining === 0)
    return (
      <div className="countdown-started" role="status">
        THE WAIT IS OVER. LET’S BEGIN.
      </div>
    );
  return (
    <div
      className="countdown"
      aria-label={
        target ? "Countdown to the event" : "Event date to be announced"
      }
    >
      {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, i) => (
        <div className="countdown-unit" key={label}>
          <strong>
            {remaining === null
              ? "—"
              : String(
                  [
                    Math.floor(remaining / 86400000),
                    Math.floor(remaining / 3600000) % 24,
                    Math.floor(remaining / 60000) % 60,
                    Math.floor(remaining / 1000) % 60,
                  ][i],
                ).padStart(2, "0")}
          </strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
