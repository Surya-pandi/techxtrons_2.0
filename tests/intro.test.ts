import test from "node:test";
import assert from "node:assert/strict";
import { introSource, shouldPlayIntro } from "../lib/intro";

const origin = "https://techxtrons.example";
test("first entry plays even when entering a page other than Home", () => {
  assert.equal(
    shouldPlayIntro(false, "navigate", `${origin}/about`, origin),
    true,
  );
});
test("refresh and new external visits replay the intro", () => {
  assert.equal(
    shouldPlayIntro(true, "reload", `${origin}/gallery`, origin),
    true,
  );
  assert.equal(
    shouldPlayIntro(true, "navigate", "https://search.example/", origin),
    true,
  );
  assert.equal(shouldPlayIntro(true, "navigate", "", origin), true);
});
test("moving between pages and browser history do not replay a completed intro", () => {
  assert.equal(
    shouldPlayIntro(true, "navigate", `${origin}/events`, origin),
    false,
  );
  assert.equal(shouldPlayIntro(true, "back_forward", "", origin), false);
});
test("each device receives its matching video", () => {
  assert.match(introSource(true), /^\/videos\/mobile-intro\.mp4\?v=/);
  assert.match(introSource(false), /^\/videos\/desktop-intro\.mp4\?v=/);
});
