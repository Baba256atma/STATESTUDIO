import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_OBJECT_SELECTION_OWNER,
  reportObjectSelection,
  reportSelectionMiss,
  reportSelectionResolved,
  resetObjectSelectionRuntimeContractLogsForTests,
} from "./objectSelectionRuntimeContract.ts";
import { resolveObjectSelectionHitProxyScale } from "./nexoraObjectClickTransaction.ts";

test.beforeEach(() => {
  resetObjectSelectionRuntimeContractLogsForTests();
});

test("canonical selection owner is HomeScreen.selectedObjectIdState", () => {
  assert.equal(CANONICAL_OBJECT_SELECTION_OWNER, "HomeScreen.selectedObjectIdState");
});

test("hit proxy scale increases with object density", () => {
  const single = resolveObjectSelectionHitProxyScale({ sceneObjectCount: 1 });
  const medium = resolveObjectSelectionHitProxyScale({ sceneObjectCount: 6 });
  const dense = resolveObjectSelectionHitProxyScale({ sceneObjectCount: 12 });
  assert.ok(single < medium);
  assert.ok(medium < dense);
  assert.ok(dense <= 1.55);
});

test("runtime contract diagnostics dedupe repeated emissions", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  const originalWarn = globalThis.console.warn;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  globalThis.console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    reportObjectSelection({ objectId: "obj-1", source: "test", phase: "hit_detection" });
    reportObjectSelection({ objectId: "obj-1", source: "test", phase: "hit_detection" });
    reportSelectionResolved({ objectId: "obj-1", source: "test", phase: "selection_commit" });
    reportSelectionMiss({ source: "test", reason: "miss", phase: "hit_detection" });
    assert.equal(logs.filter((label) => label === "[Nexora][ObjectSelection]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][SelectionResolved]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][SelectionMiss]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
    globalThis.console.warn = originalWarn;
  }
});
