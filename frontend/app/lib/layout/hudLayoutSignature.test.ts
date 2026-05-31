import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  areHudLayoutNumbersStable,
  bucketViewportWidth,
  buildHudPanelLayoutSignature,
  buildHudZoneLayoutSignature,
  HUD_LAYOUT_PIXEL_TOLERANCE,
  normalizeHudLayoutNumber,
} from "./hudLayoutSignature";
import {
  emitHudLayoutLog,
  resetHudLayoutLogGuardForTests,
  shouldEmitHudLayoutLog,
} from "./hudLayoutLogGuard";

describe("hudLayoutSignature", () => {
  it("buckets viewport widths for stable layout signatures", () => {
    expect(bucketViewportWidth(390)).toBe(390);
    expect(bucketViewportWidth(800)).toBe(820);
    expect(bucketViewportWidth(1440)).toBe(1440);
  });

  it("treats sub-pixel differences within tolerance as stable", () => {
    expect(areHudLayoutNumbersStable(12, 13.5, HUD_LAYOUT_PIXEL_TOLERANCE)).toBe(true);
    expect(areHudLayoutNumbersStable(12, 15, HUD_LAYOUT_PIXEL_TOLERANCE)).toBe(false);
  });

  it("builds stable panel layout signatures", () => {
    const signature = buildHudPanelLayoutSignature({
      panelId: "sceneInfoHud",
      anchor: "top-left",
      top: 12.04,
      left: 8,
      visible: true,
      collapsed: false,
      viewportWidth: 1440,
    });
    expect(signature).toContain("sceneInfoHud");
    expect(normalizeHudLayoutNumber(12.04)).toBe(12);
  });

  it("builds zone signatures with viewport bucket", () => {
    const signature = buildHudZoneLayoutSignature(
      "ToolbarSafeZone",
      { top: 12, left: 240, right: 240 },
      1440
    );
    expect(signature).toContain("ToolbarSafeZone");
    expect(signature).toContain("1440");
  });
});

describe("hudLayoutLogGuard", () => {
  beforeEach(() => {
    resetHudLayoutLogGuardForTests();
  });

  it("emits the same layout log only once per signature", () => {
    expect(shouldEmitHudLayoutLog("TopAlignment", "sig-a")).toBe(true);
    expect(shouldEmitHudLayoutLog("TopAlignment", "sig-a")).toBe(false);
    expect(shouldEmitHudLayoutLog("TopAlignment", "sig-b")).toBe(true);
  });

  it("does not log duplicate zone diagnostics", () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    emitHudLayoutLog("[Nexora][SafeZone]", "SafeZone", "zone-1", { top: 12 });
    emitHudLayoutLog("[Nexora][SafeZone]", "SafeZone", "zone-1", { top: 12 });
    expect(debug).toHaveBeenCalledTimes(1);
    debug.mockRestore();
  });
});
