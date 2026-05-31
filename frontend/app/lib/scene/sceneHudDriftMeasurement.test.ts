import { describe, expect, it, beforeEach } from "vitest";

import {
  areHudLayoutRectsStable,
  buildSceneHudLayoutSignature,
  HUD_DRIFT_PIXEL_TOLERANCE,
  inferSceneHudDriftReason,
  normalizeHudLayoutRect,
  normalizeHudLayoutValue,
  type SceneHudLayoutSnapshot,
} from "./sceneHudLayoutSignature";
import { buildSceneHudDriftSignature, resetSceneHudDriftGuardForTests } from "./sceneHudDriftGuard";
import {
  getSceneHudDriftWarningCountForTests,
  resetSceneHudDriftWarningDeduperForTests,
  shouldEmitSceneHudDriftWarning,
} from "./sceneHudDriftWarningDeduper";

describe("sceneHudLayoutSignature", () => {
  it("normalizes sub-pixel values to stable precision", () => {
    expect(normalizeHudLayoutValue(12.04)).toBe(12);
    expect(normalizeHudLayoutValue(12.06)).toBe(12);
    expect(normalizeHudLayoutRect({ top: 12.04, left: 8.02, width: 220.06, height: 44.01 })).toEqual({
      top: 12,
      left: 8,
      width: 220,
      height: 44,
    });
  });

  it("treats differences within pixel tolerance as stable", () => {
    const before = { top: 12, left: 8, width: 220, height: 44 };
    const after = { top: 13.5, left: 9, width: 221.5, height: 45.5 };
    expect(areHudLayoutRectsStable(before, after)).toBe(true);
    expect(areHudLayoutRectsStable(before, after, HUD_DRIFT_PIXEL_TOLERANCE)).toBe(true);
    expect(inferSceneHudDriftReason(before, after)).toBe("subpixel_variance");
  });

  it("detects real layout movement beyond tolerance", () => {
    const before = { top: 12, left: 8, width: 220, height: 44 };
    const after = { top: 52, left: 8, width: 220, height: 44 };
    expect(areHudLayoutRectsStable(before, after)).toBe(false);
    expect(inferSceneHudDriftReason(before, after)).toBe("position_shift");
  });

  it("detects layout_measurement for large size changes", () => {
    const before = { top: 12, left: 8, width: 220, height: 44 };
    const after = { top: 12, left: 8, width: 280, height: 44 };
    expect(inferSceneHudDriftReason(before, after)).toBe("layout_measurement");
  });

  it("builds stable layout signatures for harmless sub-pixel changes", () => {
    const snapshot: SceneHudLayoutSnapshot = {
      panelId: "sceneInfoHud",
      top: 12,
      left: 8,
      width: 220,
      height: 44,
      visible: true,
      collapsed: false,
    };
    const signature = buildSceneHudLayoutSignature(snapshot);
    expect(signature).toContain("sceneInfoHud");
    expect(buildSceneHudLayoutSignature({ ...snapshot, top: 12.04 })).toBe(signature);
  });
});

describe("sceneHudDriftWarningDeduper", () => {
  beforeEach(() => {
    resetSceneHudDriftWarningDeduperForTests();
  });

  it("emits the same drift warning only once", () => {
    expect(shouldEmitSceneHudDriftWarning("sig-a")).toBe(true);
    expect(shouldEmitSceneHudDriftWarning("sig-a")).toBe(false);
    expect(getSceneHudDriftWarningCountForTests()).toBe(1);
  });
});

describe("sceneHudDriftGuard signatures", () => {
  beforeEach(() => {
    resetSceneHudDriftGuardForTests();
    resetSceneHudDriftWarningDeduperForTests();
  });

  it("builds drift signatures with reason metadata", () => {
    const before = { top: 12, left: 8, width: 220, height: 44 };
    const after = { top: 52, left: 8, width: 220, height: 44 };
    const signature = buildSceneHudDriftSignature("sceneInfoHud", before, after, "scene-activity");
    expect(signature).toContain("position_shift");
    expect(signature).toContain("sceneInfoHud");
  });
});
