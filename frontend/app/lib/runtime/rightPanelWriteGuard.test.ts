import test from "node:test";
import assert from "node:assert/strict";

import {
  areRightPanelCommitSignaturesEqual,
  buildRightPanelSignature,
  buildRightPanelSignatureFromState,
} from "./rightPanelWriteGuard.ts";

test("buildRightPanelSignature includes view context source and selection", () => {
  const signature = buildRightPanelSignature({
    view: "object",
    contextId: "obj-1",
    source: "object_click",
    selectedObjectId: "obj-1",
    isOpen: true,
  });
  assert.equal(signature, "object::obj-1::object_click::obj-1::none::open");
});

test("areRightPanelCommitSignaturesEqual skips duplicate panel commits", () => {
  const prev = { isOpen: true, view: "object" as const, contextId: "obj-1" };
  const next = { isOpen: true, view: "object" as const, contextId: "obj-1", timestamp: 123 };
  const extras = { source: "object_click", selectedObjectId: "obj-1" };
  assert.equal(areRightPanelCommitSignaturesEqual(prev, next, extras), true);
  assert.equal(
    buildRightPanelSignatureFromState(prev, extras),
    buildRightPanelSignatureFromState(next, extras)
  );
});
