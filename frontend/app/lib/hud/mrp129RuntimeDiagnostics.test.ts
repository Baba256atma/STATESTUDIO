import { afterEach, describe, expect, it, vi } from "vitest";

import {
  resetTimelineZoneForTests,
  runTimelineZoneEnforcement,
} from "./timelineZoneRuntime";
import { resolveTimelineWidthFromSceneWidth } from "./timelineZoneContract";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract";
import { HUD_EDGE_INSET, TIMELINE_LEFT, TIMELINE_RIGHT } from "../scene/sceneHudInsetContract";
import { resetMrp129RuntimeDiagnosticsForTests } from "./mrp129RuntimeDiagnostics";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    viewportWidth: 1440,
    layoutWidth: 1320,
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

describe("mrp129 timeline responsive width", () => {
  afterEach(() => {
    resetTimelineZoneForTests();
    resetMrp129RuntimeDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("derives timeline width from unified edge insets", () => {
    const resolved = resolveTimelineWidthFromSceneWidth(1320);
    expect(resolved.timelineWidth).toBe(1320 - TIMELINE_LEFT - TIMELINE_RIGHT);
    expect(resolved.timelineLeft).toBe(TIMELINE_LEFT);
  });

  it("anchors timeline to left edge inset within scene width", () => {
    const result = runTimelineZoneEnforcement(baseInput({ layoutWidth: 900 }));
    expect(result.timelineZone.width).toBeCloseTo(900 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(result.timelineLeft).toBe(TIMELINE_LEFT);
    expect(result.timelineZone.right).toBe(TIMELINE_RIGHT);
  });

  it("logs MRP129 timeline width update trace", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    runTimelineZoneEnforcement(baseInput({ layoutWidth: 1320 }));
    expect(log.mock.calls.some((call) => String(call[0]).includes("TimelineWidthUpdated"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("sceneWidth=1320"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes(`timelineWidth=${1320 - TIMELINE_LEFT - TIMELINE_RIGHT}`))).toBe(true);
  });

  it("updates width when scene width changes", () => {
    const narrow = runTimelineZoneEnforcement(baseInput({ layoutWidth: 1024 }));
    const wide = runTimelineZoneEnforcement(baseInput({ layoutWidth: 1440 }));
    expect(narrow.timelineZone.width).toBeCloseTo(1024 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(wide.timelineZone.width).toBeCloseTo(1440 - TIMELINE_LEFT - TIMELINE_RIGHT, 0);
    expect(wide.timelineZone.width).toBeGreaterThan(narrow.timelineZone.width);
  });
});
