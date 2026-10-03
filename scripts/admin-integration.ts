// Exercises the real Next routes/actions against a disposable, local Supabase
// HTTP fixture. It never reads project credentials or writes to the live database.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { createServerClient } from "@supabase/ssr";
import {
  defaultAbout,
  defaultContact,
  defaultSettings,
  singletonId,
} from "../lib/defaults";

type Row = Record<string, unknown>;
const adminId = "11111111-1111-4111-8111-111111111111";
const memberId = "22222222-2222-4222-8222-222222222222";
const imageId = "33333333-3333-4333-8333-333333333333";
const messageId = "44444444-4444-4444-8444-444444444444";
const tables: Record<string, Row[]> = {
  admins: [{ id: adminId }],
  settings: [{ ...defaultSettings, website_content: {} }],
  about: [{ ...defaultAbout }],
  contact: [{ ...defaultContact }],
  events: [],
  gallery: [
    {
      id: imageId,
      image_url: "/images/logo.png",
      storage_path: "fixture/photo.png",
      caption: "Fixture photo",
      category: "moments",
      event_id: null,
      is_featured: false,
    },
  ],
  messages: [
    {
      id: messageId,
      name: "Test sender",
      email: "sender@example.test",
      subject: "Test enquiry",
      message: "A disposable test message",
      created_at: new Date().toISOString(),
    },
  ],
};
const user = (id: string) => ({
  id,
  aud: "authenticated",
  role: "authenticated",
  email: `${id === adminId ? "admin" : "member"}@example.test`,
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
});
const token = (id: string) =>
  [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ),
    Buffer.from(
      JSON.stringify({
        sub: id,
        exp: Math.floor(Date.now() / 1000) + 3600,
        role: "authenticated",
      }),
    ).toString("base64url"),
    "test-signature",
  ].join(".");
let storageDeletes = 0;
let app: ChildProcess | undefined;
let logs = "";
let temporary = "";
const server = createServer(async (request, response) => {
  const url = new URL(request.url!, "http://localhost");
  let raw = "";
  for await (const chunk of request) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};
  const send = (data: unknown, status = 200) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  };
  if (url.pathname === "/auth/v1/token") {
    const id = body.email.startsWith("admin") ? adminId : memberId;
    return send({
      access_token: token(id),
      refresh_token: `refresh-${id}`,
      expires_in: 3600,
      token_type: "bearer",
      user: user(id),
    });
  }
  if (url.pathname === "/auth/v1/user") {
    const encoded = request.headers.authorization?.split(".")[1];
    const id = encoded
      ? JSON.parse(Buffer.from(encoded, "base64url").toString()).sub
      : memberId;
    return send(user(id));
  }
  if (
    url.pathname.startsWith("/storage/v1/object/") &&
    request.method === "DELETE"
  ) {
    storageDeletes++;
    return send([]);
  }
  const table = url.pathname.split("/rest/v1/")[1];
  if (!table || !tables[table])
    return send({ message: "Unknown fixture endpoint" }, 404);
  const id = url.searchParams.get("id")?.replace(/^eq\./, "");
  let rows = tables[table].filter((row) => !id || row.id === id);
  if (request.method === "POST") {
    const row = { ...body, id: body.id || crypto.randomUUID() };
    const existing = tables[table].findIndex((item) => item.id === row.id);
    if (existing >= 0) tables[table][existing] = row;
    else tables[table].push(row);
    rows = [row];
  } else if (request.method === "PATCH") {
    rows.forEach((row) => Object.assign(row, body));
  } else if (request.method === "DELETE") {
    tables[table] = tables[table].filter((row) => !rows.includes(row));
  }
  response.setHeader(
    "Content-Range",
    `0-${Math.max(rows.length - 1, 0)}/${rows.length}`,
  );
  if (request.headers.accept?.includes("application/vnd.pgrst.object+json")) {
    if (rows.length !== 1)
      return send({ code: "PGRST116", message: "Expected one row" }, 406);
    return send(rows[0]);
  }
  send(rows);
});

async function main() {
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const backend = `http://127.0.0.1:${address.port}`;
  const cwd = process.cwd();
  // Keep the fixture on the same drive as node_modules for Windows Webpack resolution.
  temporary = mkdtempSync(join(cwd, ".admin-integration-"));
  for (const file of [
    "app",
    "components",
    "lib",
    "public",
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "postcss.config.mjs",
    "proxy.ts",
  ])
    cpSync(join(cwd, file), join(temporary, file), { recursive: true });
  symlinkSync(
    join(cwd, "node_modules"),
    join(temporary, "node_modules"),
    process.platform === "win32" ? "junction" : "dir",
  );
  const port = Number(process.env.ADMIN_TEST_PORT || 3112);
  const base = `http://localhost:${port}`;
  const { NODE_ENV: _nodeEnv, ...inheritedEnvironment } = process.env;
  const environment: NodeJS.ProcessEnv = {
    ...inheritedEnvironment,
    NODE_ENV: "development",
    SITE_PREVIEW_MODE: "false",
    NEXT_PUBLIC_SUPABASE_URL: backend,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-fixture-key",
    NEXT_PUBLIC_SITE_URL: base,
    NEXT_TELEMETRY_DISABLED: "1",
  };
  app = spawn(
    process.execPath,
    [
      join(cwd, "node_modules/next/dist/bin/next"),
      "dev",
      "--webpack",
      "--port",
      String(port),
    ],
    {
      cwd: temporary,
      env: environment,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  app.stdout?.on("data", (chunk) => {
    logs = (logs + chunk.toString()).slice(-18000);
  });
  app.stderr?.on("data", (chunk) => {
    logs = (logs + chunk.toString()).slice(-18000);
  });
  let started = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      const result = await fetch(base + "/admin/login", {
        signal: AbortSignal.timeout(15000),
      });
      if (result.ok) {
        started = true;
        break;
      }
    } catch {}
    if (app.exitCode !== null)
      throw new Error("Test app stopped before becoming ready.");
    await new Promise((done) => setTimeout(done, 1000));
  }
  assert.ok(started, "Test app must start");
  async function cookie(email: string) {
    const jar = new Map<string, string>();
    const client = createServerClient(backend, "local-fixture-key", {
      cookies: {
        getAll: () => [...jar].map(([name, value]) => ({ name, value })),
        setAll: (values) =>
          values.forEach(({ name, value }) => jar.set(name, value)),
      },
    });
    const { error } = await client.auth.signInWithPassword({
      email,
      password: "local-fixture-password",
    });
    assert.equal(error, null);
    return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
  }
  const adminCookie = await cookie("admin@example.test");
  const memberCookie = await cookie("member@example.test");
  for (const path of [
    "dashboard",
    "events",
    "gallery",
    "about",
    "contact",
    "settings",
    "website",
    "messages",
  ]) {
    const result = await fetch(`${base}/admin/${path}`, {
      headers: { Cookie: adminCookie },
      redirect: "manual",
    });
    const html = await result.text();
    assert.equal(result.status, 200, `Admin page ${path}`);
    assert.ok(
      !html.includes("A brief intermission."),
      `Admin page ${path} must render`,
    );
    assert.ok(!html.includes("Database update required."));
    console.log(`PASS authenticated /admin/${path}`);
  }
  for (const cookieValue of ["", memberCookie]) {
    const result = await fetch(`${base}/admin/website`, {
      headers: { Cookie: cookieValue },
      redirect: "manual",
    });
    assert.equal(result.status, 307, "Non-admins cannot open website editor");
  }
  async function action(
    name: string,
    args: unknown[],
    cookieValue = adminCookie,
  ) {
    const manifest = JSON.parse(
      readFileSync(
        join(temporary, ".next/dev/server/server-reference-manifest.json"),
        "utf8",
      ),
    );
    const entry = Object.entries(
      manifest.node as Record<string, { exportedName: string }>,
    ).find(([, value]) => value.exportedName === name);
    assert.ok(entry, `Server action ${name} is registered`);
    const result = await fetch(`${base}/admin/website`, {
      method: "POST",
      headers: {
        Cookie: cookieValue,
        Origin: base,
        "Next-Action": entry[0],
        "Content-Type": "text/plain;charset=UTF-8",
        Accept: "text/x-component",
      },
      body: JSON.stringify(args),
      redirect: "manual",
    });
    if (result.status === 307)
      return { success: false, message: "Unauthorized" };
    const body = await result.text();
    for (const line of body.split("\n")) {
      try {
        const value = JSON.parse(line.slice(line.indexOf(":") + 1));
        if (typeof value?.success === "boolean")
          return value as { success: boolean; message: string };
      } catch {}
    }
    throw new Error(
      `No action result for ${name} (${result.status}): ${body.slice(0, 400)}`,
    );
  }
  const event = {
    title: "Fixture event",
    slug: "fixture-event",
    category: "technical",
    description: "Original description",
    poster_url: "",
    event_date: "",
    event_time: "",
    venue: "",
    rules: "",
    coordinators: "",
    prize_details: "",
    registration_url: "",
    is_featured: false,
  };
  assert.equal(
    (await action("saveRecord", ["events", null, event])).success,
    true,
  );
  const eventId = tables.events[0].id;
  assert.equal(
    (
      await action("saveRecord", [
        "events",
        eventId,
        { ...event, title: "Edited event" },
      ])
    ).success,
    true,
  );
  assert.equal(tables.events[0].title, "Edited event");
  assert.equal(
    (
      await action("saveRecord", [
        "events",
        null,
        { ...event, registration_url: "javascript:alert(1)" },
      ])
    ).success,
    false,
  );
  assert.equal(
    (await action("saveRecord", ["events", crypto.randomUUID(), event]))
      .success,
    false,
    "Missing rows must not report success",
  );
  assert.equal(
    (
      await action("saveRecord", [
        "about",
        singletonId,
        { ...defaultAbout, title: "Edited About", vision: "" },
      ])
    ).success,
    true,
  );
  assert.equal(
    (
      await action("saveRecord", [
        "contact",
        singletonId,
        {
          ...defaultContact,
          college_name: "",
          linkedin_url: "https://linkedin.com/company/test",
        },
      ])
    ).success,
    true,
  );
  assert.equal(
    (
      await action("saveRecord", [
        "settings",
        singletonId,
        { ...defaultSettings, event_starts_at: "", event_name: "New Event" },
      ])
    ).success,
    true,
  );
  assert.equal(tables.settings[0].event_starts_at, null);
  assert.equal(
    (
      await action("saveWebsiteContent", [
        { "home.big-ideas": "Edited heading", "home.ribbon.visible": false },
      ])
    ).success,
    true,
  );
  const homepage = await fetch(base).then((result) => result.text());
  assert.ok(homepage.includes("Edited heading"));
  assert.ok(!homepage.includes('class="festival-ribbon"'));
  assert.ok(homepage.includes("New Event"));
  assert.equal(
    (
      await action(
        "saveWebsiteContent",
        [{ "home.big-ideas": "Unauthorized change" }],
        memberCookie,
      )
    ).success,
    false,
  );
  assert.equal(
    (tables.settings[0].website_content as Row)["home.big-ideas"],
    "Edited heading",
  );
  assert.equal(
    (await action("deleteRecord", ["events", eventId])).success,
    true,
  );
  assert.equal(
    (await action("deleteRecord", ["events", eventId])).success,
    false,
  );
  assert.equal(
    (await action("deleteRecord", ["gallery", imageId])).success,
    true,
  );
  assert.equal(storageDeletes, 1);
  assert.equal(
    (await action("deleteRecord", ["messages", messageId])).success,
    true,
  );
  assert.equal(tables.events.length, 0);
  assert.equal(tables.gallery.length, 0);
  assert.equal(tables.messages.length, 0);
  console.log(
    "PASS admin create/edit/delete, content publication, clearing fields, validation, missing records and non-admin protection",
  );
}
main()
  .catch((error) => {
    console.error(error);
    console.error(logs);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (app?.pid) {
      if (process.platform === "win32")
        spawnSync("taskkill", ["/PID", String(app.pid), "/T", "/F"], {
          windowsHide: true,
          stdio: "ignore",
        });
      else app.kill("SIGTERM");
    }
    await new Promise<void>((done) => server.close(() => done()));
    if (
      temporary &&
      dirname(resolve(temporary)) === resolve(process.cwd()) &&
      basename(temporary).startsWith(".admin-integration-")
    )
      rmSync(temporary, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
      });
  });
