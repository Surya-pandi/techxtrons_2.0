import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const liveData = process.env.TEST_LIVE_DATA === "true";
const pageHtml = new Map();
async function checkPage(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} must load`);
  if (response.headers.get("content-type")?.includes("text/html")) {
    const html = await response.text();
    assert.ok(
      !html.includes("A brief intermission."),
      `${path} must not render the error page`,
    );
    pageHtml.set(path, html);
  } else {
    await response.arrayBuffer();
  }
  console.log(`PASS ${path}`);
}
const publicPaths = [
  "/",
  "/about",
  "/events",
  "/technical-events",
  "/non-technical-events",
  "/events?category=technical",
  "/events?category=non_technical",
  ...(!liveData ? ["/events/coding-competition"] : []),
  "/gallery",
  "/contact",
  "/admin/login",
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
  "/images/logo.png",
  "/videos/desktop-intro.mp4",
  "/videos/mobile-intro.mp4",
];
for (const path of publicPaths) {
  await checkPage(path);
}
const eventPaths = new Set(
  [...pageHtml.get("/events").matchAll(/href="(\/events\/[^"?#]+)"/g)].map(
    (match) => match[1],
  ),
);
for (const path of eventPaths) {
  if (!pageHtml.has(path)) await checkPage(path);
}
const assets = new Set();
for (const html of pageHtml.values()) {
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll("&amp;", "&"), base);
    if (
      url.origin === new URL(base).origin &&
      /^\/(?:_next|images|videos)\//.test(url.pathname)
    )
      assets.add(url.href);
  }
}
for (const url of assets) {
  const response = await fetch(url);
  assert.equal(response.status, 200, `Page asset must load: ${url}`);
  await response.arrayBuffer();
}
console.log(`PASS ${assets.size} linked scripts, styles, fonts and images`);
for (const path of [
  "/admin",
  "/admin/dashboard",
  "/admin/events",
  "/admin/gallery",
  "/admin/about",
  "/admin/contact",
  "/admin/settings",
  "/admin/website",
  "/admin/messages",
]) {
  const response = await fetch(base + path, { redirect: "manual" });
  assert.equal(
    response.status,
    307,
    `${path} must redirect anonymous visitors`,
  );
  assert.equal(
    new URL(response.headers.get("location"), base).pathname,
    "/admin/login",
  );
  console.log(`PASS anonymous protection: ${path}`);
}
for (const method of ["POST", "PUT"]) {
  const response = await fetch(base + "/api/admin/upload", {
    method,
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ bucket: "gallery", type: "image/png", size: 42 }),
  });
  assert.equal(
    response.status,
    401,
    `${method} upload must reject anonymous access`,
  );
  console.log(`PASS unauthorized ${method} upload`);
}
const crossOrigin = await fetch(base + "/api/admin/upload", {
  method: "POST",
  headers: {
    Origin: "https://untrusted.example",
    "Content-Type": "application/json",
  },
  body: "{}",
});
assert.equal(crossOrigin.status, 403, "Cross-origin upload must be rejected");
console.log("PASS cross-origin protection");
if (!liveData) {
  const filtered = pageHtml.get("/events?category=technical");
  assert.ok(filtered.includes("Code the night"));
  assert.ok(
    !filtered.includes("<h3>The hidden trail</h3>"),
    "Technical filter should exclude non-technical cards",
  );
  const nonTechnical = pageHtml.get("/events?category=non_technical");
  assert.ok(nonTechnical.includes("The hidden trail"));
  assert.ok(!nonTechnical.includes("<h3>Code the night</h3>"));
  console.log("PASS technical and non-technical event filters");
}
const missing = await fetch(base + "/this-page-does-not-exist");
assert.equal(missing.status, 404, "Unknown pages must return 404");
console.log("PASS unknown-page handling");
