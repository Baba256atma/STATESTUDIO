import { describe, expect, it, beforeEach } from "vitest";

import {
  MIN_TIMELINE_TO_MRP_GAP,
  resolveTimelineZoneContract,
  resolveTimelineWidthFromSceneWidth,
} from "./timelineZoneContract.ts";
import {
  resetTimelineZoneForTests,
  runTimelineZoneEnforcement,
} from "./timelineZoneRuntime.ts";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_METRICS,
} from "../scene/sceneHudZoneContract.ts";
import {
  HUD_EDGE_INSET,
  TIMELINE_LEFT,
  TIMELINE_RIGHT,
} from "../scene/sceneHudInsetContract.ts";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    viewportWidth: 1440,
    layoutWidth: 900,
    layoutHeight: 800,
    sideInset: HUD_EDGE_INSET,
    timelineTop: 680,
    timelineHeight: 116,
    timelineBottomOffset: HUD_EDGE_INSET,
    scenePanelLeft: HUD_EDGE_INSET,
    scenePanelWidth: SCENE_HUD_ZONE_METRICS.scenePanelWidth,
    objectPanelLeft: 640,
    objectPanelWidth: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
    objectPanelBandWidth: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
    mrpWidth: 430,
    mrpVisible: true,
    usingViewportFallback: false,
    isMobile: false,
    ...overrides,
  };
}

describe("timelineZoneContract", () => {
  beforeEach(() => {
    resetTimelineZoneForTests();
    resetSceneHudZoneContractForTests();
  });

  it("spans timeline between unified left and right edge insets", () => {
    const result = resolveTimelineZoneContract(baseInput({ layoutWidth: 900 }));
    expect(result.overlapDetected).toBe(false);
    expect(result.timelineZone.width).toBeCloseTo(900 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(result.timelineLeft).toBe(TIMELINE_LEFT);
    expect(result.timelineZone.right).toBe(TIMELINE_RIGHT);
  });

  it("keeps edge inset contract on narrow scene widths", () => {
    const result = resolveTimelineZoneContract(
      baseInput({
        layoutWidth: 420,
        objectPanelLeft: 220,
        objectPanelWidth: 248,
      })
    );
    expect(result.timelineZone.width).toBeCloseTo(420 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(result.overlapDetected).toBe(false);
  });

  it("respects MRP reservation on viewport fallback", () => {
    const result = resolveTimelineZoneContract(
      baseInput({
        layoutWidth: 1440,
        usingViewportFallback: true,
        objectPanelLeft: 960,
        objectPanelWidth: 248,
      })
    );
    expect(result.sceneWidth).toBe(1440 - 430 - MIN_TIMELINE_TO_MRP_GAP);
    expect(result.timelineZone.width).toBeCloseTo(
      result.sceneWidth - TIMELINE_LEFT - TIMELINE_RIGHT,
      0
    );
    expect(result.overlapDetected).toBe(false);
  });
});

describe("timelineZone responsive validation", () => {
  const viewports = [1440, 1280, 1024, 900, 768] as const;

  for (const viewportWidth of viewports) {
    it(`keeps timeline edge insets inside scene at ${viewportWidth}px`, () => {
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
        topBarVisible: false,
      });

      expect(layout.timelineZone.width).toBeCloseTo(sceneWidth - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
      expect(layout.timelineZone.left).toBe(TIMELINE_LEFT);
      expect(layout.timelineZone.right).toBe(TIMELINE_RIGHT);
      expect(layout.overlapDetected).toBe(false);
    });
  }

  for (const viewportWidth of viewports) {
    it(`enforces viewport fallback at ${viewportWidth}px without overlap`, () => {
      resetSceneHudZoneContractForTests();
      const layout = resolveSceneHudZoneContract({
        viewportWidth,
        viewportHeight: 900,
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
        timelineVisible: true,
        topBarVisible: false,
      });

      expect(layout.timelineZone.width).toBeGreaterThan(0);
      expect(layout.overlapDetected).toBe(false);
    });
  }
});

describe("timelineZone selection stability", () => {
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
    });

    expect(expanded.timelineZone.top).toEqual(compact.timelineZone.top);
    expect(expanded.timelineZone.height).toEqual(compact.timelineZone.height);
    expect(expanded.timelineZone.width).toEqual(compact.timelineZone.width);
  });

  it("dedupes repeated enforcement traces", () => {
    const input = baseInput();
    const first = runTimelineZoneEnforcement(input);
    const second = runTimelineZoneEnforcement(input);
    expect(first.timelineLeft).toBe(second.timelineLeft);
    expect(first.timelineZone.width).toBe(second.timelineZone.width);
  });
});

describe("resolveTimelineWidthFromSceneWidth", () => {
  it("matches unified edge inset width contract", () => {
    const resolved = resolveTimelineWidthFromSceneWidth(1320);
    expect(resolved.timelineWidth).toBe(1320 - TIMELINE_LEFT - TIMELINE_RIGHT);
    expect(resolved.timelineLeft).toBe(TIMELINE_LEFT);
  });
});
