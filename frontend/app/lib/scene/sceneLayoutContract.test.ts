import { describe, expect, it, beforeEach } from "vitest";

import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_METRICS,
} from "./sceneHudZoneContract";

describe("sceneLayoutContract", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
  });

  it("reserves object panel below top controls", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      topBarVisible: true,
    });
    expect(layout.objectPanelZone.top).toBeGreaterThan(layout.topBarZone.top);
    expect(layout.objectPanelZone.top).toBeGreaterThanOrEqual(
      layout.topBarZone.top + SCENE_HUD_ZONE_METRICS.topBarHeight + SCENE_HUD_ZONE_METRICS.zoneGap
    );
  });

  it("keeps timeline above chat clearance", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      timelineVisible: true,
    });
    expect(layout.timelineZone.bottom).toBeGreaterThanOrEqual(SCENE_HUD_ZONE_METRICS.chatInputClearance);
  });
});
