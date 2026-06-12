import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
  SCENE_PANEL_HEADER_HEIGHT,
  SCENE_PANEL_MINIMIZED_HEIGHT,
  SCENE_PANEL_TOP_INSET_PX,
  SCENE_PANEL_WIDTH,
  SCENE_PANEL_MAX_WIDTH,
  SCENE_PANEL_MIN_WIDTH,
  clampScenePanelWidth,
  resolveScenePanelFixedWidth,
  resolveScenePanelZoneHeight,
  resolveScenePanelZoneWidth,
  resetScenePanelWidthContractForTests,
} from "./scenePanelWidthContract.ts";

test.beforeEach(() => {
  resetScenePanelWidthContractForTests();
});

test("scene panel width is fixed in expanded and collapsed modes", () => {
  assert.equal(resolveScenePanelZoneWidth("expanded"), SCENE_PANEL_WIDTH);
  assert.equal(resolveScenePanelZoneWidth("collapsed"), SCENE_PANEL_WIDTH);
  assert.equal(resolveScenePanelFixedWidth(), SCENE_PANEL_WIDTH);
  assert.equal(SCENE_PANEL_WIDTH, 244);
});

test("scene panel expanded height uses half of available vertical space", () => {
  const timelineTop = 700;
  const available = timelineTop - SCENE_PANEL_TOP_INSET_PX - 8;
  const expandedHeight = resolveScenePanelZoneHeight({
    timelineTop,
    minimized: false,
    zoneGap: 8,
  });
  assert.equal(expandedHeight, Math.floor(available * SCENE_PANEL_EXPANDED_HEIGHT_RATIO));
});

test("scene panel minimized height includes always-visible command strip", () => {
  assert.equal(
    resolveScenePanelZoneHeight({ timelineTop: 700, minimized: true, zoneGap: 8 }),
    SCENE_PANEL_MINIMIZED_HEIGHT
  );
  assert.ok(SCENE_PANEL_MINIMIZED_HEIGHT > SCENE_PANEL_HEADER_HEIGHT);
});

test("clampScenePanelWidth respects min and max", () => {
  assert.equal(clampScenePanelWidth(180), SCENE_PANEL_MIN_WIDTH);
  assert.equal(clampScenePanelWidth(300), SCENE_PANEL_MAX_WIDTH);
  assert.equal(clampScenePanelWidth(244), 244);
});
