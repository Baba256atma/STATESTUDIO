import { describe, expect, it, beforeEach } from "vitest";

import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_METRICS,
} from "./sceneHudZoneContract";
import {
  HUD_EDGE_INSET,
  OBJECT_PANEL_RIGHT,
  OBJECT_PANEL_TOP,
  SCENE_PANEL_LEFT,
  SCENE_PANEL_TOP,
  TIMELINE_LEFT,
  TIMELINE_RIGHT,
} from "./sceneHudInsetContract";

describe("sceneHudZoneContract", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
  });

  it("anchors scene panel at 4px with half-height expansion", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
      topBarVisible: false,
    });

    expect(layout.scenePanelZone.top).toBe(SCENE_PANEL_TOP);
    expect(layout.scenePanelZone.left).toBe(SCENE_PANEL_LEFT);
    expect(layout.objectPanelZone.top).toBe(OBJECT_PANEL_TOP);
    expect(layout.objectPanelZone.right).toBe(OBJECT_PANEL_RIGHT);
    expect(layout.timelineZone.left).toBe(TIMELINE_LEFT);
    expect(layout.timelineZone.right).toBe(TIMELINE_RIGHT);
    expect(layout.timelineZone.bottom).toBe(HUD_EDGE_INSET);
    expect(layout.scenePanelZone.width).toBe(244);
    expect(layout.scenePanelZone.height).toBeLessThan(
      layout.timelineZone.top - layout.scenePanelZone.top
    );
    expect(layout.objectPanelZone.top + layout.objectPanelZone.height).toBeLessThanOrEqual(
      layout.timelineZone.top
    );
  });

  it("keeps scene panel width fixed when minimized", () => {
    const expanded = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      scenePanelCollapsed: false,
    });
    resetSceneHudZoneContractForTests();
    const minimized = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      scenePanelCollapsed: true,
    });

    expect(minimized.scenePanelZone.width).toBe(expanded.scenePanelZone.width);
    expect(minimized.scenePanelZone.height).toBeLessThan(expanded.scenePanelZone.height);
  });

  it("uses edge-inset timeline width for scene canvas", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1280,
      viewportHeight: 900,
      sceneWidth: 820,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
    });

    expect(layout.timelineZone.width).toBeCloseTo(820 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(layout.timelineZone.bottom).toBe(HUD_EDGE_INSET);
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

    expect(expanded.timelineZone.top).toEqual(compact.timelineZone.top);
    expect(expanded.timelineZone.height).toEqual(compact.timelineZone.height);
    expect(expanded.timelineZone.width).toEqual(compact.timelineZone.width);
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
    expect(viewportFallback.mrpOverlapDetected).toBe(false);
    expect(viewportFallback.objectPanelZone.left).toBeLessThan(viewportFallback.viewportWidth - 430 - HUD_EDGE_INSET);
  });
});
