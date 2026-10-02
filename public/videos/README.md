# TECHXTRONS intro videos

- `desktop-intro.mp4`: supplied `video/into_desktop.mp4`, 1920 x 1080, 4.8 seconds.
- `mobile-intro.mp4`: supplied `video/into_mobile.mp4`, 1080 x 1920, 4.46 seconds.

The home page selects mobile below 768px and desktop at 768px or wider. Videos autoplay muted, fit completely inside the viewport, and close when finished. Visitors can skip the intro or press Escape. Reduced-motion preferences are respected.

The intro plays once per tab session. Its versioned session key and video URLs ensure visitors who saw the previous placeholder can see these supplied clips. Bump INTRO_VERSION in components/intro-video.tsx whenever replacing them again. Do not run scripts/create-intros.ps1 unless you intend to overwrite these videos with generated placeholders.
