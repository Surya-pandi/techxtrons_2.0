"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_SESSION_KEY, introSource, shouldPlayIntro } from "@/lib/intro";

export default function IntroVideo({ enabled }: { enabled: boolean }) {
  const [source, setSource] = useState("");
  const [needsPlay, setNeedsPlay] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finish = useCallback(() => {
    setSource("");
    setNeedsPlay(false);
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (
      !enabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {}
    const navigation = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    if (
      !shouldPlayIntro(
        seen,
        navigation?.type,
        document.referrer,
        window.location.origin,
      )
    )
      return;
    // Start loading the selected clip immediately, without a separate HEAD request.
    setSource(introSource(window.matchMedia("(max-width: 767px)").matches));
  }, [enabled]);

  useEffect(() => {
    if (!source) return;
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;
    try {
      dialog.showModal();
    } catch {
      finish();
      return;
    }
    let active = true;
    video.muted = true;
    video.play().catch((error: unknown) => {
      if (!active) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNeedsPlay(true);
    });
    const timeout = setTimeout(finish, 45000);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      active = false;
      video.pause();
      dialog.close();
      clearTimeout(timeout);
      document.body.style.overflow = previous;
    };
  }, [source, finish]);

  const play = () => {
    videoRef.current
      ?.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true));
  };

  return source ? (
    <dialog
      ref={dialogRef}
      className="intro-overlay"
      aria-label="Event introduction"
      onCancel={(event) => {
        event.preventDefault();
        finish();
      }}
    >
      <video
        ref={videoRef}
        src={source}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="TECHXTRONS introduction"
        onPlaying={() => setNeedsPlay(false)}
        onEnded={finish}
        onError={finish}
      />
      <div className="intro-controls">
        {needsPlay && (
          <button onClick={play} className="button button-outline">
            Play intro
          </button>
        )}
        <button autoFocus onClick={finish} className="button">
          Skip intro
        </button>
      </div>
    </dialog>
  ) : null;
}
