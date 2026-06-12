import test from "node:test";
import assert from "node:assert/strict";

import { TIMELINE_BOTTOM_INSET_PX } from "./timelineBottomAnchorContract.ts";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
} from "../scene/sceneHudZoneContract.ts";

test.beforeEach(() => {
  resetSceneHudZoneContractForTests();
});

test("compact and expanded timeline modes keep the same bottom inset", () => {
  const base = {
    viewportWidth: 1440,
    viewportHeight: 900,
    sceneWidth: 900,
    sceneHeight: 800,
    timelineVisible: true,
  };

  resetSceneHudZoneContractForTests();
  const compact = resolveSceneHudZoneContract({
    ...base,
    timelineHeightMode: "compact",
  });
  resetSceneHudZoneContractForTests();
  const expanded = resolveSceneHudZoneContract({
    ...base,
    timelineHeightMode: "expanded",
  });

  assert.equal(compact.timelineZone.bottom, TIMELINE_BOTTOM_INSET_PX);
  assert.equal(expanded.timelineZone.bottom, TIMELINE_BOTTOM_INSET_PX);
  assert.ok(expanded.timelineZone.top < compact.timelineZone.top);
  assert.ok(expanded.timelineZone.height > compact.timelineZone.height);
});

test("timeline width remains responsive while bottom inset stays fixed", () => {
  resetSceneHudZoneContractForTests();
  const narrow = resolveSceneHudZoneContract({
    viewportWidth: 1440,
    viewportHeight: 900,
    sceneWidth: 720,
    sceneHeight: 800,
    mainRightPanelWidth: 430,
    mainRightPanelVisible: true,
    timelineHeightMode: "expanded",
  });
  resetSceneHudZoneContractForTests();
  const wide = resolveSceneHudZoneContract({
    viewportWidth: 1440,
    viewportHeight: 900,
    sceneWidth: 1024,
    sceneHeight: 800,
    mainRightPanelWidth: 0,
    mainRightPanelVisible: false,
    timelineHeightMode: "expanded",
  });

  assert.equal(narrow.timelineZone.bottom, TIMELINE_BOTTOM_INSET_PX);
  assert.equal(wide.timelineZone.bottom, TIMELINE_BOTTOM_INSET_PX);
  assert.ok(wide.timelineZone.width > narrow.timelineZone.width);
});
