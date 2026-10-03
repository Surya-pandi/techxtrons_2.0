import test from "node:test";
import assert from "node:assert/strict";
import { Children, isValidElement } from "react";
import ErrorPage from "../app/error";

test("Try again invokes Next's retry callback to fetch fresh server data", () => {
  let retries = 0;
  const page = ErrorPage({
    retry: () => {
      retries++;
    },
  });
  const button = Children.toArray(page.props.children).find(
    (child) => isValidElement(child) && child.type === "button",
  );
  assert.ok(isValidElement<{ onClick: () => void }>(button));
  button.props.onClick();
  assert.equal(retries, 1);
});
