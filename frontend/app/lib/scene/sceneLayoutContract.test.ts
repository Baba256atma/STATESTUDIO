import { describe, expect, it, beforeEach } from "vitest";

import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
} from "./sceneHudZoneContract";
import { HUD_EDGE_INSET, SCENE_PANEL_TOP } from "./sceneHudInsetContract";

describe("sceneLayoutContract", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
  });

  it("places the object panel at the MRP_HUD:14:9 canonical HUD-edge inset", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      topBarVisible: true,
    });
    // Unified edge inset: object panel top equals SCENE_PANEL_TOP (not a stacked top-bar model).
    expect(SCENE_PANEL_TOP).toBe(HUD_EDGE_INSET);
    expect(SCENE_PANEL_TOP).toBe(4);
    expect(layout.objectPanelZone.top).toBe(SCENE_PANEL_TOP);
    expect(layout.objectPanelZone.right).toBeGreaterThan(0);
  });

  it("keeps timeline above chat clearance", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      timelineVisible: true,
    });
    expect(layout.timelineZone.bottom).toBe(4);
  });
});
