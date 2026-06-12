import test from "node:test";
import assert from "node:assert/strict";

import {
  TIMELINE_EMPTY_TIME_LABEL,
  isStableSemanticTimelineLabel,
  resetTimelineHydrationSafeTimeForTests,
  resolveHydrationSafeTimelineTime,
} from "./timelineHydrationSafeTimeContract.ts";

test.beforeEach(() => {
  resetTimelineHydrationSafeTimeForTests();
});

test("returns semantic labels before and after hydration", () => {
  assert.equal(
    resolveHydrationSafeTimelineTime({
      eventTime: "Now",
      hydrated: false,
    }),
    "Now"
  );
  assert.equal(
    resolveHydrationSafeTimelineTime({
      eventTime: "T-4h",
      hydrated: true,
    }),
    "T-4h"
  );
});

test("returns stable placeholder for ISO timestamps before hydration", () => {
  assert.equal(
    resolveHydrationSafeTimelineTime({
      eventTime: "2026-06-11T00:35:08.771Z",
      hydrated: false,
    }),
    TIMELINE_EMPTY_TIME_LABEL
  );
});

test("formats ISO timestamps after hydration", () => {
  assert.equal(
    resolveHydrationSafeTimelineTime({
      eventTime: "2026-06-11T00:35:08.771Z",
      hydrated: true,
    }),
    "00:35"
  );
});

test("uses fallback time after hydration when ISO is withheld pre-mount", () => {
  assert.equal(
    resolveHydrationSafeTimelineTime({
      eventTime: "2026-06-11T00:35:08.771Z",
      fallbackTime: "00:35",
      hydrated: true,
    }),
    "00:35"
  );
});

test("detects stable semantic labels", () => {
  assert.equal(isStableSemanticTimelineLabel("Now"), true);
  assert.equal(isStableSemanticTimelineLabel("2026-06-11T00:35:08.771Z"), false);
});
