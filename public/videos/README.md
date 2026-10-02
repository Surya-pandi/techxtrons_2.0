# TECHXTRONS intro videos

These are the supplied final clips, retained without re-encoding:
- `desktop-intro.mp4`: 1920 x 1080, 4.8 seconds.
- `mobile-intro.mp4`: 1080 x 1920, 4.46 seconds.

The shared public layout shows the intro when entering any public page and on refresh. It does not repeat while moving between pages or returning through browser history after the intro has finished. Mobile is selected below 768px; desktop is selected at 768px and wider.

Videos start muted and fit inside the viewport without cropping. If the browser blocks autoplay, a Play intro button appears. Skip, Escape, playback completion, media errors, and a 45-second timeout dismiss the overlay. Reduced-motion preferences and the administrator's intro setting are respected.

Replace clips here when updating the intro and bump INTRO_VERSION in lib/intro.ts. These are the canonical copies; duplicate source files and obsolete placeholder generators have been removed.
