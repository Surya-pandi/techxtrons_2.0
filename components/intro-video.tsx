"use client";
import { useCallback, useEffect, useRef, useState } from "react";
const INTRO_VERSION = "techxtrons-intro-v2";
const INTRO_SESSION_KEY = `intro-seen:${INTRO_VERSION}`;
export default function IntroVideo({ enabled }: { enabled: boolean }) {
  const [source, setSource] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const finish = useCallback(() => {
    setSource("");
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
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) return;
    } catch {}
    const videoPath = window.matchMedia("(max-width: 767px)").matches
      ? "/videos/mobile-intro.mp4"
      : "/videos/desktop-intro.mp4";
    const path = `${videoPath}?v=${INTRO_VERSION}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    fetch(path, { method: "HEAD", signal: controller.signal })
      .then((r) => {
        if (r.ok && !controller.signal.aborted) setSource(path);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [enabled]);
  useEffect(() => {
    if (!source) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const timeout = setTimeout(finish, 45000);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => {
      dialog?.close();
      clearTimeout(timeout);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [source, finish]);
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
        src={source}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />
      <button autoFocus onClick={finish} className="button">
        SKIP INTRO ↗
      </button>
    </dialog>
  ) : null;
}
