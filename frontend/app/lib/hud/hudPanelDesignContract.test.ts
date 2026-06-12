import test from "node:test";
import assert from "node:assert/strict";

import {
  HUD_PANEL_RADIUS,
  HUD_PANEL_STICKY_HEADER_HEIGHT,
  HUD_PANEL_STICKY_HEADER_STYLE,
  HUD_PANEL_SUBPANEL_INSET_X,
  OBJECT_PANEL_EXPANDED_WIDTH,
  OBJECT_PANEL_WIDTH,
  SCENE_PANEL_WIDTH,
  areHudSubpanelInsetsEqual,
  resetHudPanelDesignContractForTests,
  resetHudPanelStickyHeaderContractForTests,
} from "./hudPanelDesignContract.ts";

test.beforeEach(() => {
  resetHudPanelDesignContractForTests();
  resetHudPanelStickyHeaderContractForTests();
});

test("scene-native hud panel tokens use unified radius and upgraded widths", () => {
  assert.equal(HUD_PANEL_RADIUS, 3);
  assert.equal(SCENE_PANEL_WIDTH, 244);
  assert.equal(OBJECT_PANEL_WIDTH, 272);
  assert.equal(OBJECT_PANEL_EXPANDED_WIDTH, 344);
  assert.equal(areHudSubpanelInsetsEqual(HUD_PANEL_SUBPANEL_INSET_X, HUD_PANEL_SUBPANEL_INSET_X), true);
});

test("sticky header contract keeps stable chrome height", () => {
  assert.equal(HUD_PANEL_STICKY_HEADER_STYLE.position, "sticky");
  assert.equal(HUD_PANEL_STICKY_HEADER_STYLE.top, 0);
  assert.equal(HUD_PANEL_STICKY_HEADER_STYLE.zIndex, 2);
  assert.equal(HUD_PANEL_STICKY_HEADER_HEIGHT, 44);
});
