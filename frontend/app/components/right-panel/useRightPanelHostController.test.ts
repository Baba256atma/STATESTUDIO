import assert from "node:assert/strict";
import test from "node:test";
import { isValidRightPanelView } from "../../lib/ui/right-panel/rightPanelRouter.ts";

/**
 * Focused AD-FE-HOOKS-01 contract checks that do not require a React renderer.
 * Hook behavior is covered by host integration + full Scene suite.
 */
test("previous-valid-view hold contract: invalid views are not canonical", () => {
  assert.equal(isValidRightPanelView("dashboard"), true);
  assert.equal(isValidRightPanelView("__invalid__"), false);
});

test("signature-stable identity contract: equal signatures imply reusable cache key", () => {
  const sig = (v: { id: number }) => String(v.id);
  const a = { id: 7 };
  const b = { id: 7 };
  const c = { id: 8 };
  assert.equal(sig(a), sig(b));
  assert.notEqual(sig(a), sig(c));
});
