import { describe, expect, it, beforeEach } from "vitest";

import { auditedResolve, resetAuditedResolveForTests } from "./auditedResolve";
import { getAuditInspectorStats } from "./auditRenderInspector";
import { resolveSceneHudDepth } from "../hud/visual/sceneHudDepthRuntime";
import { resetSceneNativeHudVisualInstrumentationForTests } from "../hud/visual/sceneNativeHudVisualInstrumentation";

describe("audit runtime stabilization", () => {
  beforeEach(() => {
    resetAuditedResolveForTests();
    resetSceneNativeHudVisualInstrumentationForTests();
  });

  it("returns cached reference for repeated identical audit inputs", () => {
    const first = resolveSceneHudDepth("sceneInfoHud");
    const second = resolveSceneHudDepth("sceneInfoHud");
    expect(second).toBe(first);
  });

  it("records cache hits after the first execution", () => {
    resolveSceneHudDepth("timelineHud");
    resolveSceneHudDepth("timelineHud");
    resolveSceneHudDepth("timelineHud");

    const stat = getAuditInspectorStats().find((entry) => entry.auditName === "HudDepth");
    expect(stat?.executionCount).toBe(1);
    expect(stat?.cacheHitCount).toBe(2);
  });

  it("recomputes when meaningful audit inputs change", () => {
    const collapsed = auditedResolve({
      auditName: "HudDepth",
      inputs: { surface: "sceneInfoHud", focused: false },
      compute: () => ({ layer: "HUD" }),
    });
    const focused = auditedResolve({
      auditName: "HudDepth",
      inputs: { surface: "sceneInfoHud", focused: true },
      compute: () => ({ layer: "FOCUS_HUD" }),
    });
    expect(focused).not.toBe(collapsed);
  });
});
