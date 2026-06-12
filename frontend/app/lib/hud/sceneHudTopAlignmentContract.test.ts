import { describe, expect, it, beforeEach } from "vitest";

import {
  isSceneHudTopRowAligned,
  resolveSceneHudTopAlignment,
  resetSceneHudTopAlignmentContractForTests,
} from "./sceneHudTopAlignmentContract.ts";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
} from "../scene/sceneHudZoneContract.ts";
import { SCENE_PANEL_TOP } from "../scene/sceneHudInsetContract.ts";

describe("sceneHudTopAlignmentContract", () => {
  beforeEach(() => {
    resetSceneHudTopAlignmentContractForTests();
    resetSceneHudZoneContractForTests();
  });

  it("resolveSceneHudTopAlignment keeps scene and object panels at unified top inset", () => {
    const alignment = resolveSceneHudTopAlignment({ layoutWidth: 1440 });
    expect(alignment.SCENE_PANEL_TOP_Y).toBe(SCENE_PANEL_TOP);
    expect(alignment.OBJECT_PANEL_TOP_Y).toBe(SCENE_PANEL_TOP);
  });

  it("scene hud zone contract aligns scene and object panel tops at 4px", () => {
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
    expect(layout.objectPanelZone.top).toBe(SCENE_PANEL_TOP);
    expect(isSceneHudTopRowAligned(layout)).toBe(true);
  });

  it("top alignment holds across MRP width changes", () => {
    resetSceneHudZoneContractForTests();
    const narrow = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 720,
      sceneHeight: 800,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
      topBarVisible: false,
    });
    resetSceneHudZoneContractForTests();
    const wide = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 1024,
      sceneHeight: 800,
      mainRightPanelWidth: 0,
      mainRightPanelVisible: false,
      topBarVisible: false,
    });

    expect(isSceneHudTopRowAligned(narrow)).toBe(true);
    expect(isSceneHudTopRowAligned(wide)).toBe(true);
  });
});
