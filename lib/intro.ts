export const INTRO_VERSION = "techxtrons-intro-v3";
export const INTRO_SESSION_KEY = `intro-seen:${INTRO_VERSION}`;

export function introSource(mobile: boolean) {
  return `/videos/${mobile ? "mobile" : "desktop"}-intro.mp4?v=${INTRO_VERSION}`;
}

export function shouldPlayIntro(
  seen: boolean,
  navigationType: string | undefined,
  referrer: string,
  origin: string,
) {
  if (!seen) return true;
  if (navigationType === "reload") return true;
  if (navigationType === "back_forward") return false;
  if (!referrer) return true;
  try {
    return new URL(referrer).origin !== origin;
  } catch {
    return true;
  }
}
