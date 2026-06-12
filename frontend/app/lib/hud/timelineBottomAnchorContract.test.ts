import test from "node:test";
import assert from "node:assert/strict";

import {
  TIMELINE_BOTTOM_INSET_PX,
  isTimelineBottomAnchorValid,
  resolveTimelineAnchorState,
  resolveTimelineBottomAnchoredTop,
  resetTimelineBottomAnchorContractForTests,
} from "./timelineBottomAnchorContract.ts";

test.beforeEach(() => {
  resetTimelineBottomAnchorContractForTests();
});

test("resolveTimelineBottomAnchoredTop keeps fixed bottom inset", () => {
  const compactTop = resolveTimelineBottomAnchoredTop({
    layoutHeight: 800,
    timelineHeight: 80,
  });
  const expandedTop = resolveTimelineBottomAnchoredTop({
    layoutHeight: 800,
    timelineHeight: 300,
  });

  assert.equal(compactTop, 800 - TIMELINE_BOTTOM_INSET_PX - 80);
  assert.equal(expandedTop, 800 - TIMELINE_BOTTOM_INSET_PX - 300);
  assert.ok(expandedTop < compactTop);
});

test("compact and expanded share the same bottom inset", () => {
  const layoutHeight = 900;
  const compactHeight = 80;
  const expandedHeight = 300;

  const compactTop = resolveTimelineBottomAnchoredTop({
    layoutHeight,
    timelineHeight: compactHeight,
  });
  const expandedTop = resolveTimelineBottomAnchoredTop({
    layoutHeight,
    timelineHeight: expandedHeight,
  });

  assert.equal(layoutHeight - compactTop - compactHeight, TIMELINE_BOTTOM_INSET_PX);
  assert.equal(layoutHeight - expandedTop - expandedHeight, TIMELINE_BOTTOM_INSET_PX);
});

test("isTimelineBottomAnchorValid detects violations", () => {
  assert.equal(
    isTimelineBottomAnchorValid({
      layoutHeight: 800,
      timelineTop: 716,
      timelineHeight: 80,
    }),
    true
  );
  assert.equal(
    isTimelineBottomAnchorValid({
      layoutHeight: 800,
      timelineTop: 500,
      timelineHeight: 80,
    }),
    false
  );
});

test("resolveTimelineAnchorState maps full mode to maximized", () => {
  assert.equal(resolveTimelineAnchorState("compact"), "compact");
  assert.equal(resolveTimelineAnchorState("expanded"), "expanded");
  assert.equal(resolveTimelineAnchorState("full"), "maximized");
});
