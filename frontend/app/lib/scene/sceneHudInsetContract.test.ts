import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  HUD_EDGE_INSET,
  OBJECT_PANEL_RIGHT,
  OBJECT_PANEL_TOP,
  resetSceneHudInsetContractForTests,
  resolveSceneHudBoundaryInsets,
  resolveSceneHudEdgeInset,
  SCENE_PANEL_LEFT,
  SCENE_PANEL_TOP,
  TIMELINE_BOTTOM,
  TIMELINE_LEFT,
  TIMELINE_RIGHT,
  traceSceneHudInsets,
  validateSceneHudBoundaryAlignment,
} from "./sceneHudInsetContract";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
} from "./sceneHudZoneContract";

describe("sceneHudInsetContract", () => {
  beforeEach(() => {
    resetSceneHudInsetContractForTests();
    resetSceneHudZoneContractForTests();
  });

  it("derives all panel edge tokens from HUD_EDGE_INSET", () => {
    expect(HUD_EDGE_INSET).toBe(4);
    expect(resolveSceneHudEdgeInset()).toBe(HUD_EDGE_INSET);
    expect(SCENE_PANEL_LEFT).toBe(HUD_EDGE_INSET);
    expect(OBJECT_PANEL_RIGHT).toBe(HUD_EDGE_INSET);
    expect(TIMELINE_LEFT).toBe(HUD_EDGE_INSET);
    expect(TIMELINE_RIGHT).toBe(HUD_EDGE_INSET);
    expect(TIMELINE_BOTTOM).toBe(HUD_EDGE_INSET);
    expect(SCENE_PANEL_TOP).toBe(HUD_EDGE_INSET);
    expect(OBJECT_PANEL_TOP).toBe(HUD_EDGE_INSET);

    const insets = resolveSceneHudBoundaryInsets();
    expect(insets.edgeInset).toBe(HUD_EDGE_INSET);
    expect(insets.sceneLeft).toBe(SCENE_PANEL_LEFT);
    expect(insets.objectRight).toBe(OBJECT_PANEL_RIGHT);
  });

  it("validates unified boundary alignment from zone contract", () => {
    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
      topBarVisible: false,
    });

    expect(layout.scenePanelZone.left).toBe(SCENE_PANEL_LEFT);
    expect(layout.scenePanelZone.top).toBe(SCENE_PANEL_TOP);
    expect(layout.objectPanelZone.top).toBe(OBJECT_PANEL_TOP);
    expect(layout.objectPanelZone.right).toBe(OBJECT_PANEL_RIGHT);
    expect(layout.timelineZone.left).toBe(TIMELINE_LEFT);
    expect(layout.timelineZone.right).toBe(TIMELINE_RIGHT);
    expect(layout.timelineZone.bottom).toBe(TIMELINE_BOTTOM);
    expect(validateSceneHudBoundaryAlignment(layout)).toBe(true);
  });

  it("logs NexoraHudInsets diagnostics and brakes on mismatch", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const layout = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      scenePanelVisible: true,
      timelineVisible: true,
      topBarVisible: false,
    });
    traceSceneHudInsets(layout);

    expect(log.mock.calls.some((call) => String(call[0]).includes("[NexoraHudInsets] edgeInset=4"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("boundaryAlignment=true"))).toBe(true);
    expect(warn.mock.calls.length).toBe(0);

    resetSceneHudInsetContractForTests();
    traceSceneHudInsets({
      ...layout,
      scenePanelZone: { ...layout.scenePanelZone, left: 12 },
    });
    expect(warn.mock.calls.some((call) => String(call[0]).includes("edge_alignment_mismatch"))).toBe(true);

    log.mockRestore();
    warn.mockRestore();
  });
});
