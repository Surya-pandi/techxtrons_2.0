# TECHXTRONS 3.0 — Department of Information Technology

A dark event site for TECHXTRONS 3.0 with a centered typographic hero, floating IT topic cards, a desktop navigation dock, and separate pages. The layout takes inspiration from hackathon2026.in while retaining the yellow and orange TECHXTRONS identity. Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide, and Supabase. Dates, venue, college details, and actual events remain to be supplied.

## Run locally

Requires Node.js 20.9+ (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Without Supabase, public pages show **sample** events and an empty gallery. Admin sign-in and contact submissions are intentionally unavailable. Sample data is never silently used to conceal a configured database failure. When connected, an empty database shows proper empty states.

## Connect Supabase when ready

1. Create a Supabase project. Run the SQL files in `supabase/migrations/` in numerical order, once each, in its SQL editor. They create tables, RLS policies, image buckets, a contact-submission function, and the TECHXTRONS 3.0 / IT department branding. If you already ran `001_initial.sql`, apply only the subsequent migrations.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`. Use the public anon/publishable key; the application does not need a service-role key.
3. Create your administrator in Supabase **Authentication → Users**. Set a secure password and confirm the account. Turn off public sign-ups if you do not need them.
4. Grant that user admin access with this SQL, substituting its exact Auth user UUID and email:

   ```sql
   insert into public.admins (id, email)
   values ('AUTH-USER-UUID', 'your-admin-email@example.com');
   ```

5. Restart the app. Visit `/admin/login`. In Settings, enter the event name, association name, year, venue, and a start date with timezone (for example `2026-12-15T09:00:00+05:30`). Until a date is supplied, the countdown displays dashes.
6. Add your actual events, About and Contact content, and gallery images. Recent contact submissions appear on the admin dashboard; no outgoing email service is configured.

## Images and intro videos

- Upload your department logo and real event images through the admin panel. The original logo PNG must be supplied as a file to use it in the hero; the current hero is a typographic wordmark. The local Plus Jakarta Sans font is licensed under OFL (see `app/fonts/OFL.txt`).
- Upload event posters, gallery photographs, the association image, and logo through the admin panel after connecting Supabase. Supported: JPG, PNG, WebP up to 10 MB per file.
- Gallery supports multiple selection, drag/drop, previews, captions, progress, retry, category/event association, featured images, editing, and deletion of both the record and stored image.
- Your supplied intro clips are installed at `/public/videos/desktop-intro.mp4` (landscape, 4.8 seconds) and `/public/videos/mobile-intro.mp4` (portrait, 4.46 seconds). The intro chooses one viewport-specific source, plays muted, skips missing/erroring videos, provides a Skip button, and honors reduced motion. It starts on entry to any public page and on refresh, skips repeats during internal page navigation, and times out after 45 seconds. A Play intro button is shown if autoplay is blocked.

## Security and operations

- Each admin mutation and upload API verifies the Auth user and the `admins` table. Protected pages redirect unauthorized visitors to login. Supabase RLS independently restricts changes and storage operations to administrators.
- Admin membership cannot be created through the website. Session cookies are maintained with Supabase SSR. No plaintext password or service-role key is stored in source or the browser.
- User text is rendered as text; URLs are limited to HTTP/HTTPS. Uploads use admin-authorized signed URLs, bucket MIME/size restrictions, and server-side file signature validation. Direct storage uploads support the 10 MB requirement without passing the image through Vercel's request-body limit.
- Contact messages are stored through a validation function with a three-message-per-email hourly limit and a form honeypot. This is a basic abuse control, not a comprehensive anti-bot system. Add CAPTCHA if the public form receives abuse.
- Unused uploaded posters/site assets can remain in Storage when an editor cancels a form or replaces an image. Periodically remove unreferenced objects. Gallery deletion removes both its storage object and database record; a reported failure should be retried.
- Storage buckets are publicly readable by design. Upload only images intended for public display.

## Deploy to Vercel

This project preserves the requested native Next.js/Vercel architecture. It does not use the Cloudflare-specific Sites starter or hosting runtime.

1. Push this folder to your repository and import it into Vercel as a Next.js project.
2. Add the same environment variables in Vercel. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS site origin. Set the Supabase Auth Site URL to that origin.
3. Use the standard `npm run build` build command and automatic Next.js output settings.
4. Deploy and verify an authorized admin login, denied non-admin access, event CRUD, image upload/edit/delete, and a contact submission against your own Supabase project.

No remote deployment or live Supabase configuration has been performed. Without environment variables, a deployed build will display sample content.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

With the unconfigured preview running, use `npm run test:smoke` to check public pages, sample event filtering, admin redirects, and rejected unauthorized/cross-origin uploads. Set `TEST_BASE_URL` to test another local server.

Unit tests exercise security-relevant validation, upload limits, dates, URLs, contact input, and gallery associations. The schema and live authenticated flows require your Supabase project for integration testing. Browser visual and interaction QA also needs to be completed in a browser; the in-app browser was not available during implementation.

## Routes

Public: `/`, `/about`, `/events`, `/technical-events`, `/non-technical-events`, `/events/[slug]`, `/gallery`, `/contact`.

Home contains the introduction, countdown, and links to the separate pages. About, event listings, gallery images, and contact information live on their dedicated pages. Event category navigation opens separate Technical and Non-Technical pages; the earlier `/events?category=...` links remain supported.

Admin: `/admin/login`, `/admin/dashboard`, `/admin/events`, `/admin/gallery`, `/admin/about`, `/admin/contact`, `/admin/settings`.

SEO: route metadata, event titles/descriptions, original typographic Open Graph image, X card, `/sitemap.xml`, and `/robots.txt` excluding admin/API routes. Update branding metadata in `app/layout.tsx` and `app/opengraph-image.tsx` when the actual association identity is available.

## Database setup pending

If Supabase returns PGRST205 (required tables missing), run `supabase/setup.sql` once in the project's SQL editor. This bundles migrations 001 through 004 in a transaction; do not run the same migrations again afterward. For a database with existing tables, apply only the migrations not yet applied.

`SITE_PREVIEW_MODE=true` explicitly enables labelled sample content while setup is pending. Credentials are preserved, and admin sign-in, uploads, and contact submissions stay unavailable in this mode. After successful SQL setup, set `SITE_PREVIEW_MODE=false` in `.env.local`, then refresh the site (restart Next.js if the environment change is not picked up). Add an admin membership as described above. Live-mode database failures remain errors and are never silently replaced with samples.
