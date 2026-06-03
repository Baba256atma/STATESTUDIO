import test from "node:test";
import assert from "node:assert/strict";

import {
  isSelectionBurstActive,
  markSelectionActivity,
  resetSelectionBurstGuardForTests,
  SELECTION_BURST_WINDOW_MS,
  shouldLogSelectionBurstHudDriftSkip,
} from "./selectionBurstGuard.ts";

test.beforeEach(() => {
  resetSelectionBurstGuardForTests();
});

test("selection burst is active within the burst window", () => {
  const now = 1_000;
  markSelectionActivity(now);
  assert.equal(isSelectionBurstActive(now + 100), true);
  assert.equal(isSelectionBurstActive(now + SELECTION_BURST_WINDOW_MS), false);
});

test("hud drift skip log fires once per burst window", () => {
  const now = 2_000;
  markSelectionActivity(now);
  assert.equal(shouldLogSelectionBurstHudDriftSkip(now + 50), true);
  assert.equal(shouldLogSelectionBurstHudDriftSkip(now + 100), false);
});
