import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  defaultWebsiteContent,
  resolveWebsiteContent,
  websiteContentSchema,
  websiteFields,
} from "../lib/website-content";
import {
  SiteContentProvider,
  SiteText,
  SiteSection,
} from "../components/site-content";
import Footer from "../components/footer";
import { defaultSettings, defaultContact, defaultAbout } from "../lib/defaults";
import { aboutSchema, contactSchema } from "../lib/validation";

test("website defaults are valid and field keys are unique", () => {
  assert.equal(
    websiteContentSchema.safeParse(defaultWebsiteContent).success,
    true,
  );
  assert.equal(
    new Set(websiteFields.map((field) => field.key)).size,
    websiteFields.length,
  );
});
test("removed text and hidden sections survive a save/load round trip", () => {
  const saved = websiteContentSchema.parse({
    "home.big-ideas": "",
    "home.hero.visible": false,
  });
  const loaded = resolveWebsiteContent(JSON.parse(JSON.stringify(saved)));
  assert.equal(loaded["home.big-ideas"], "");
  assert.equal(loaded["home.hero.visible"], false);
  assert.equal(
    loaded["home.bigger-possibilities"],
    defaultWebsiteContent["home.bigger-possibilities"],
  );
});
test("rejects unknown fields, executable links and incorrect visibility values", () => {
  for (const value of [
    { unknown: "test" },
    { "home.hero.visible": "false" },
    { "home.big-ideas": true },
    { "nav.home.href": "javascript:alert(1)" },
    { "intro.desktop": "data:text/html,hello" },
    { "nav.home.href": "//untrusted.example" },
  ])
    assert.equal(websiteContentSchema.safeParse(value).success, false);
  assert.equal(
    websiteContentSchema.safeParse({
      "nav.home.href": "/events",
      "intro.desktop": "https://example.com/intro.mp4",
    }).success,
    true,
  );
});
test("public rendering escapes edited text and omits hidden sections", () => {
  const content = resolveWebsiteContent({
    "home.big-ideas": "<script>alert(1)</script>",
    "home.hero.visible": false,
  });
  const html = renderToStaticMarkup(
    createElement(SiteContentProvider, {
      content,
      children: [
        createElement(SiteText, { key: "copy", name: "home.big-ideas" }),
        createElement(SiteSection, {
          key: "section",
          name: "home.hero.visible",
          children: "HIDDEN CONTENT",
        }),
      ],
    }),
  );
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("HIDDEN CONTENT"));
});
test("footer renders saved social links and removes cleared copy", () => {
  const content = resolveWebsiteContent({
    "footer.curious-minds-belong-here": "",
  });
  const html = renderToStaticMarkup(
    createElement(SiteContentProvider, {
      content,
      children: createElement(Footer, {
        settings: defaultSettings,
        contact: {
          ...defaultContact,
          linkedin_url: "https://linkedin.com/company/example",
          youtube_url: "https://youtube.com/@example",
        },
      }),
    }),
  );
  assert.ok(html.includes('href="https://linkedin.com/company/example"'));
  assert.ok(html.includes('href="https://youtube.com/@example"'));
  assert.ok(!html.includes("CURIOUS MINDS BELONG HERE."));
});
test("optional About and Contact content can be cleared", () => {
  assert.equal(
    aboutSchema.safeParse({
      ...defaultAbout,
      title: "",
      description: "",
      image_url: "",
    }).success,
    true,
  );
  assert.equal(
    contactSchema.safeParse({
      ...defaultContact,
      department_name: "",
      college_name: "",
    }).success,
    true,
  );
});
