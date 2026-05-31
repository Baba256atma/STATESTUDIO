import { describe, expect, it, beforeEach } from "vitest";

import { resetAuditedResolveForTests } from "../../audit/auditedResolve";
import {
  createSceneHudRendererContract,
  DEFAULT_EXECUTIVE_TRANSPARENCY_MODE,
  resolveExecutiveTransparency,
  resolveHudEdgeIntegration,
  resolveSceneHudDepth,
  resolveSceneHudSpatialAlignment,
  resolveSceneHudTypography,
  resolveSceneNativeHudDesign,
  resetExecutiveTransparencyForTests,
  resetSceneNativeHudVisualInstrumentationForTests,
} from "./index";

describe("scene-native HUD visual system", () => {
  beforeEach(() => {
    resetAuditedResolveForTests();
    resetSceneNativeHudVisualInstrumentationForTests();
    resetExecutiveTransparencyForTests();
  });

  it("resolves instrument glass design for scene info", () => {
    const design = resolveSceneNativeHudDesign({
      surface: "sceneInfoHud",
      themeMode: "night",
    });
    expect(design.panelGlassLevel).toBe("instrument");
    expect(design.panelTransparency).toBeGreaterThan(0.6);
    expect(design.panelBlur).toBeGreaterThanOrEqual(6);
    expect(design.panelGlowProfile).toBe("none");
  });

  it("defaults transparency to balanced", () => {
    expect(DEFAULT_EXECUTIVE_TRANSPARENCY_MODE).toBe("BALANCED");
    const snapshot = resolveExecutiveTransparency();
    expect(snapshot.allowSceneVisibility).toBe(true);
    expect(snapshot.blurPx).toBe(10);
  });

  it("assigns depth layers by surface", () => {
    expect(resolveSceneHudDepth("sceneInfoHud").layer).toBe("HUD");
    expect(resolveSceneHudDepth("executiveStatusHud", true).layer).toBe("FOCUS_HUD");
  });

  it("integrates bottom timeline with structural edge attachment", () => {
    const edge = resolveHudEdgeIntegration("BOTTOM_CENTER");
    expect(edge.structuralAttachment).toBe(true);
    expect(edge.edgeFade).toBe(false);
  });

  it("limits spatial dominance for dense scenes", () => {
    const sparse = resolveSceneHudSpatialAlignment({ surface: "sceneInfoHud", objectCount: 8 });
    const dense = resolveSceneHudSpatialAlignment({ surface: "sceneInfoHud", objectCount: 48 });
    expect(dense.maxWidthRatio).toBeLessThan(sparse.maxWidthRatio);
  });

  it("defines typography hierarchy roles", () => {
    const header = resolveSceneHudTypography("executiveHeader");
    const metric = resolveSceneHudTypography("primaryMetric");
    expect(header.textTransform).toBe("uppercase");
    expect(metric.fontWeight).toBe(800);
  });

  it("caches repeated audit resolutions without duplicate work", () => {
    const first = resolveSceneHudDepth("sceneInfoHud");
    const second = resolveSceneHudDepth("sceneInfoHud");
    expect(second).toBe(first);
  });

  it("creates renderer contract for future three.js HUD", () => {
    const contract = createSceneHudRendererContract({
      surface: "objectInfoHud",
      rendererKind: "hybrid",
    });
    expect(contract.supportsNativeThreeMesh).toBe(true);
    expect(contract.rendererKind).toBe("hybrid");
  });
});
