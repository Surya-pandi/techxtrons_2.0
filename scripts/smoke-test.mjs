import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const publicPaths = [
  "/",
  "/about",
  "/events",
  "/technical-events",
  "/non-technical-events",
  "/events?category=technical",
  "/events?category=non_technical",
  "/events/coding-competition",
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
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `${path} must load`);
  console.log(`PASS ${path}`);
}
for (const path of [
  "/admin",
  "/admin/dashboard",
  "/admin/events",
  "/admin/gallery",
  "/admin/about",
  "/admin/contact",
  "/admin/settings",
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
const filtered = await fetch(base + "/events?category=technical").then((r) =>
  r.text(),
);
assert.ok(filtered.includes("Code the night"));
assert.ok(
  !filtered.includes("<h3>The hidden trail</h3>"),
  "Technical filter should exclude non-technical cards",
);
console.log("PASS cross-origin protection and technical event filter");
