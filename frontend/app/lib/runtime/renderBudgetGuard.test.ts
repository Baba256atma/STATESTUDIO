import test from "node:test";
import assert from "node:assert/strict";

import {
  markPanelSelectionWrite,
  markSelectionCascade,
  resetRenderBudgetGuardForTests,
  scheduleDebouncedHeavySelection,
  shouldAllowPanelSelectionWrite,
  shouldAllowSelectionCascade,
  SELECTION_CASCADE_DEDUP_MS,
} from "./renderBudgetGuard.ts";

test.beforeEach(() => {
  resetRenderBudgetGuardForTests();
});

test("shouldAllowSelectionCascade blocks same object within dedup window", () => {
  const now = 1000;
  markSelectionCascade({ selectedObjectId: "obj-a", reason: "test", now });
  assert.equal(
    shouldAllowSelectionCascade({
      selectedObjectId: "obj-a",
      previousSelectedObjectId: "obj-a",
      now: now + 100,
    }),
    false
  );
  assert.equal(
    shouldAllowSelectionCascade({
      selectedObjectId: "obj-a",
      previousSelectedObjectId: "obj-a",
      now: now + SELECTION_CASCADE_DEDUP_MS,
    }),
    true
  );
});

test("shouldAllowSelectionCascade allows different objects", () => {
  assert.equal(
    shouldAllowSelectionCascade({
      selectedObjectId: "obj-b",
      previousSelectedObjectId: "obj-a",
    }),
    true
  );
});

test("shouldAllowPanelSelectionWrite dedupes repeated object writes", () => {
  markPanelSelectionWrite("obj-a", 1000);
  assert.equal(shouldAllowPanelSelectionWrite("obj-a", 1100), false);
  assert.equal(shouldAllowPanelSelectionWrite("obj-b", 1100), true);
});

test("scheduleDebouncedHeavySelection runs only latest object", async () => {
  const runs: string[] = [];
  scheduleDebouncedHeavySelection("obj-a", (id) => runs.push(id), 20);
  scheduleDebouncedHeavySelection("obj-b", (id) => runs.push(id), 20);
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.deepEqual(runs, ["obj-b"]);
});
