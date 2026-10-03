"use client";
import { useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";
import { useSiteContent } from "./site-content";

export default function ScrollingRibbon() {
  const content = useSiteContent();
  const [paused, setPaused] = useState(false);
  const animate = content["home.ribbon.animate"] !== false;
  const slogans = [
    "home.code-with-curiosity",
    "home.create-with-purpose",
    "home.compete-with-spirit",
    "home.connect-with-people",
  ]
    .map((key) => content[key])
    .filter(
      (text): text is string =>
        typeof text === "string" && Boolean(text.trim()),
    );
  if (!slogans.length) return null;
  return (
    <div
      className="festival-ribbon"
      data-paused={paused}
      data-animated={animate}
    >
      <div className="festival-ribbon-track">
        {[0, 1].map((copy) => (
          <div
            className="festival-ribbon-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {slogans.map((text, index) => (
              <div className="festival-ribbon-item" key={index}>
                <span>{text}</span>
                <Sparkles aria-hidden="true" />
              </div>
            ))}
          </div>
        ))}
      </div>
      {animate && (
        <button
          type="button"
          className="ribbon-pause"
          aria-label={
            paused ? "Resume scrolling slogans" : "Pause scrolling slogans"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      )}
    </div>
  );
}
