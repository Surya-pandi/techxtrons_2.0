import test from "node:test";
import assert from "node:assert/strict";
import { imagePreviewSource } from "../lib/image-source";

const project = "https://project.supabase.co";

test("image previews ignore incomplete, unsafe and unsupported sources", () => {
  for (const value of [
    null,
    "",
    "h",
    "https:",
    "https://",
    "javascript:alert(1)",
    "//untrusted.example/image.png",
    "https://untrusted.example/image.png",
    `${project}/not-storage/image.png`,
    "https://user:password@project.supabase.co/storage/v1/object/public/gallery/a.png",
    "/images/../../admin",
    "http://project.supabase.co/storage/v1/object/public/gallery/a.png",
  ]) {
    assert.equal(imagePreviewSource(value, project), undefined, String(value));
  }
});

test("image previews allow local assets and this project's public uploads", () => {
  const uploaded = `${project}/storage/v1/object/public/site-assets/admin/logo.png`;
  assert.equal(imagePreviewSource(uploaded, project), uploaded);
  assert.equal(imagePreviewSource("/images/logo.png", ""), "/images/logo.png");
  assert.equal(imagePreviewSource(uploaded, ""), undefined);
  assert.equal(imagePreviewSource(uploaded, "invalid"), undefined);
});
