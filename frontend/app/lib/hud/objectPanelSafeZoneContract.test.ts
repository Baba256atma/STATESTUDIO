import { describe, expect, it, beforeEach } from "vitest";

import {
  MIN_OBJECT_PANEL_TO_MRP_GAP,
  resolveObjectPanelSafeZoneContract,
} from "./objectPanelSafeZoneContract.ts";
import {
  resetObjectPanelSafeZoneForTests,
  runObjectPanelSafeZoneEnforcement,
} from "./objectPanelSafeZoneRuntime.ts";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_METRICS,
} from "../scene/sceneHudZoneContract.ts";
import { MIN_TIMELINE_TO_OBJECT_PANEL_GAP } from "./timelineZoneContract.ts";

import { HUD_EDGE_INSET } from "../scene/sceneHudInsetContract.ts";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    viewportWidth: 1440,
    layoutWidth: 900,
    layoutHeight: 800,
    sideInset: HUD_EDGE_INSET,
    sideTop: 60,
    sideMaxHeight: 600,
    scenePanelLeft: HUD_EDGE_INSET,
    scenePanelWidth: SCENE_HUD_ZONE_METRICS.scenePanelWidth,
    objectPanelWidthRequested: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
    mrpWidth: 430,
    mrpVisible: true,
    usingViewportFallback: false,
    isMobile: false,
    objectPanelExpanded: false,
    ...overrides,
  };
}

describe("objectPanelSafeZoneContract", () => {
  beforeEach(() => {
    resetObjectPanelSafeZoneForTests();
    resetSceneHudZoneContractForTests();
  });

  it("keeps object panel inside scene right safe zone when scene-bound", () => {
    const result = resolveObjectPanelSafeZoneContract(baseInput());
    expect(result.overlapDetected).toBe(false);
    expect(result.objectPanelZone.left + result.objectPanelZone.width).toBeLessThanOrEqual(900 - HUD_EDGE_INSET);
    expect(result.gap).toBeGreaterThanOrEqual(0);
  });

  it("reserves MRP width and minimum gap on viewport fallback", () => {
    const result = resolveObjectPanelSafeZoneContract(
      baseInput({
        layoutWidth: 1440,
        usingViewportFallback: true,
      })
    );
    const objectPanelRight = result.objectPanelZone.left + result.objectPanelZone.width;
    expect(result.mrpLeft).toBe(1440 - 430);
    expect(result.mrpLeft - objectPanelRight).toBeGreaterThanOrEqual(MIN_OBJECT_PANEL_TO_MRP_GAP - 0.5);
    expect(result.overlapDetected).toBe(false);
  });

  it("clamps object panel width to safe zone capacity", () => {
    const result = resolveObjectPanelSafeZoneContract(
      baseInput({
        layoutWidth: 520,
        scenePanelWidth: 248,
        objectPanelWidthRequested: 320,
        usingViewportFallback: true,
        mrpWidth: 430,
      })
    );
    expect(result.objectPanelZone.width).toBeLessThanOrEqual(result.sceneRightSafeZone.width);
    expect(result.clamped).toBe(true);
  });
});

describe("objectPanelSafeZone resize validation", () => {
  const viewports = [1440, 1280, 1024, 900, 768] as const;

  for (const viewportWidth of viewports) {
    it(`keeps object panel left of MRP at ${viewportWidth}px`, () => {
      resetSceneHudZoneContractForTests();
      const sceneWidth = Math.max(480, viewportWidth - 72 - 430 - 24);
      const layout = resolveSceneHudZoneContract({
        viewportWidth,
        viewportHeight: 900,
        sceneWidth,
        sceneHeight: 800,
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
        scenePanelVisible: true,
        timelineVisible: true,
      });

      expect(layout.mrpOverlapDetected).toBe(false);
      expect(
        layout.objectPanelZone.left + layout.objectPanelZone.width + layout.objectPanelZone.right
      ).toBeLessThanOrEqual(layout.sceneWidth + 0.5);
      expect(layout.objectPanelZone.width).toBeGreaterThan(0);
    });
  }

  for (const viewportWidth of viewports) {
    it(`enforces viewport fallback at ${viewportWidth}px without MRP overlap`, () => {
      resetSceneHudZoneContractForTests();
      const layout = resolveSceneHudZoneContract({
        viewportWidth,
        viewportHeight: 900,
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
      });

      const safeZone = runObjectPanelSafeZoneEnforcement({
        viewportWidth,
        layoutWidth: viewportWidth,
        layoutHeight: 900,
        sideInset: HUD_EDGE_INSET,
        sideTop: 60,
        sideMaxHeight: 600,
        scenePanelLeft: HUD_EDGE_INSET,
        scenePanelWidth: SCENE_HUD_ZONE_METRICS.scenePanelWidth,
        objectPanelWidthRequested: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
        mrpWidth: 430,
        mrpVisible: true,
        usingViewportFallback: true,
        isMobile: viewportWidth < 768,
        objectPanelExpanded: false,
      });

      expect(safeZone.overlapDetected).toBe(false);
      expect(layout.mrpOverlapDetected).toBe(false);
    });
  }
});

describe("objectPanelSafeZone selection stability", () => {
  it("does not shift timeline height when object panel expand toggles", () => {
    resetSceneHudZoneContractForTests();
    const compact = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      objectPanelExpanded: false,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
      timelineVisible: true,
      topBarVisible: false,
    });
    resetSceneHudZoneContractForTests();
    const expanded = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      objectPanelExpanded: true,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
      timelineVisible: true,
      topBarVisible: false,
    });

    expect(expanded.timelineZone.top).toEqual(compact.timelineZone.top);
    expect(expanded.timelineZone.height).toEqual(compact.timelineZone.height);
    expect(expanded.timelineZone.width).toEqual(compact.timelineZone.width);
    expect(expanded.overlapDetected).toBe(false);
  });

  it("dedupes repeated enforcement traces", () => {
    const input = baseInput({ layoutWidth: 1440, usingViewportFallback: true });
    const first = runObjectPanelSafeZoneEnforcement(input);
    const second = runObjectPanelSafeZoneEnforcement(input);
    expect(first.objectPanelZone.left).toBe(second.objectPanelZone.left);
  });
});
