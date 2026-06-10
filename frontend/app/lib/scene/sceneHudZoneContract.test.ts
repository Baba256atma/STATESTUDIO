import { describe, expect, it, beforeEach } from "vitest";

import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_METRICS,
} from "./sceneHudZoneContract";

describe("sceneHudZoneContract", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
  });

  it("places object panel below topbar and above timeline", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
      topBarVisible: true,
    });

    expect(layout.objectPanelZone.top).toBeGreaterThan(
      layout.topBarZone.top + layout.topBarZone.height
    );
    expect(layout.objectPanelZone.top + layout.objectPanelZone.height).toBeLessThanOrEqual(
      layout.timelineZone.top
    );
  });

  it("clamps timeline width between side panels", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1280,
      viewportHeight: 900,
      sceneWidth: 820,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
    });

    expect(layout.timelineZone.width).toBeLessThan(820);
    expect(layout.timelineZone.bottom).toBeGreaterThanOrEqual(SCENE_HUD_ZONE_METRICS.chatInputClearance);
  });

  it("reports no overlap on desktop executive layout", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
      topBarVisible: true,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
    });

    expect(layout.overlapDetected).toBe(false);
    expect(layout.mrpOverlapDetected).toBe(false);
  });

  it("keeps timeline zone fixed regardless of object panel expanded state", () => {
    resetSceneHudZoneContractForTests();
    const compact = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      objectPanelExpanded: false,
    });
    resetSceneHudZoneContractForTests();
    const expanded = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      objectPanelExpanded: true,
    });

    expect(expanded.timelineZone).toEqual(compact.timelineZone);
  });

  it("anchors object panel inside scene container, left of MRP region", () => {
    resetSceneHudZoneContractForTests();
    const sceneBound = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
    });
    resetSceneHudZoneContractForTests();
    const viewportFallback = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
    });

    expect(sceneBound.objectPanelZone.right).toBeGreaterThan(0);
    expect(sceneBound.objectPanelZone.left + sceneBound.objectPanelZone.width).toBeLessThanOrEqual(900);
    expect(sceneBound.mrpOverlapDetected).toBe(false);
    expect(viewportFallback.mrpOverlapDetected).toBe(true);
    expect(sceneBound.objectPanelZone.left).toBeLessThan(viewportFallback.objectPanelZone.left);
  });
});
