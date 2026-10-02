import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EventWordmark from "../components/event-wordmark";
import { branding, resolveEventName } from "../lib/branding";

test("legacy database names retain the styled wordmark and current edition", () => {
  for (const name of [
    "TECHXTRONS 2.0",
    "techxtrons 3.0",
    " TECHXTRONS\n2.0 ",
    "TECHXTRONS",
  ]) {
    assert.equal(resolveEventName(name), branding.eventName);
    const html = renderToStaticMarkup(createElement(EventWordmark, { name }));
    assert.ok(html.includes('class="event-wordmark-x">X</span>'));
    assert.ok(html.includes('class="event-wordmark-edition">3.0</span>'));
    assert.ok(!html.includes("2.0"));
  }
});

test("custom event names are preserved", () => {
  assert.equal(resolveEventName("IT Project Showcase"), "IT Project Showcase");
});
