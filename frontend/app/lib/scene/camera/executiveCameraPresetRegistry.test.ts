import { describe, expect, it, beforeEach } from "vitest";

import {
  buildExecutiveCameraContextSignature,
  mapToolbarPresetToExecutivePreset,
  resolveExecutiveCameraPresetFromContext,
} from "./executiveCameraContextRuntime";
import {
  armExecutiveCameraMemory,
  consumeExecutiveCameraMemory,
  resetExecutiveCameraMemoryForTests,
  saveExecutiveCameraMemory,
} from "./executiveCameraMemoryRuntime";
import {
  classifyExecutiveViewport,
  resolveExecutiveViewportFramingAdjustments,
} from "./executiveCameraFramingRuntime";
import {
  buildExecutiveSceneObjectSignature,
  getExecutiveCameraPresetDefinition,
  normalizeExecutiveCameraPresetId,
  resolveExecutiveCameraPresetFrame,
  resetExecutiveCameraPresetRegistryForTests,
} from "./executiveCameraPresetRegistry";
import {
  easeExecutiveCameraProgress,
  resetExecutiveCameraTransitionGuardForTests,
  shouldApplyExecutiveCameraTransition,
} from "./executiveCameraTransitionRuntime";

describe("executive camera preset registry", () => {
  beforeEach(() => {
    resetExecutiveCameraPresetRegistryForTests();
    resetExecutiveCameraTransitionGuardForTests();
  });

  it("lists executive presets with professional framing intent", () => {
    expect(getExecutiveCameraPresetDefinition("EXECUTIVE").purpose).toContain("Default Nexora landing");
    expect(getExecutiveCameraPresetDefinition("OPERATIONS").radiusMultiplier).toBeLessThan(
      getExecutiveCameraPresetDefinition("GLOBAL").radiusMultiplier
    );
    expect(getExecutiveCameraPresetDefinition("RISK").radiusMultiplier).toBeGreaterThan(
      getExecutiveCameraPresetDefinition("EXECUTIVE").radiusMultiplier
    );
  });

  it("normalizes legacy preset ids", () => {
    expect(normalizeExecutiveCameraPresetId("GLOBAL_VIEW")).toBe("GLOBAL");
    expect(normalizeExecutiveCameraPresetId("VIEW_2D")).toBe("VIEW_2D");
    expect(normalizeExecutiveCameraPresetId("VIEW_3D")).toBe("VIEW_3D");
  });

  it("resolves stable preset frames for the same scene signature", () => {
    const sceneJson = {
      scene: {
        objects: [
          { id: "a", transform: { pos: [0, 0, 0] } },
          { id: "b", transform: { pos: [2, 0, 1] } },
        ],
      },
    };
    const signature = buildExecutiveSceneObjectSignature(sceneJson);
    const first = resolveExecutiveCameraPresetFrame({
      preset: "EXECUTIVE",
      mode: "3D",
      sceneJson,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    const second = resolveExecutiveCameraPresetFrame({
      preset: "EXECUTIVE",
      mode: "3D",
      sceneJson,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(signature).toContain("a:");
    expect(first).toEqual(second);
  });
});

describe("executive camera context runtime", () => {
  it("selects presets from executive context", () => {
    expect(resolveExecutiveCameraPresetFromContext({})).toBe("EXECUTIVE");
    expect(
      resolveExecutiveCameraPresetFromContext({ selectedObjectId: "obj-1" })
    ).toBe("FOCUS");
    expect(
      resolveExecutiveCameraPresetFromContext({ simulationRunning: true })
    ).toBe("SCENARIO");
    expect(
      resolveExecutiveCameraPresetFromContext({ riskViewActive: true })
    ).toBe("RISK");
    expect(
      resolveExecutiveCameraPresetFromContext({ operationalAnalysisActive: true })
    ).toBe("OPERATIONS");
    expect(mapToolbarPresetToExecutivePreset("risk")).toBe("RISK");
  });

  it("builds stable context signatures", () => {
    const signature = buildExecutiveCameraContextSignature({
      selectedObjectId: "a",
      workspaceViewMode: "3D",
    });
    expect(signature).toContain('"selectedObjectId":"a"');
  });
});

describe("executive camera memory runtime", () => {
  beforeEach(() => {
    resetExecutiveCameraMemoryForTests();
  });

  it("saves and restores user camera context", () => {
    armExecutiveCameraMemory("test");
    saveExecutiveCameraMemory({
      position: [1, 2, 3],
      target: [0, 0, 0],
      fov: 42,
      reason: "before_focus",
    });
    const restored = consumeExecutiveCameraMemory("focus_cleared");
    expect(restored?.position).toEqual([1, 2, 3]);
    expect(restored?.target).toEqual([0, 0, 0]);
  });
});

describe("executive camera transition runtime", () => {
  beforeEach(() => {
    resetExecutiveCameraTransitionGuardForTests();
  });

  it("eases with cinematic acceleration and deceleration", () => {
    expect(easeExecutiveCameraProgress(0)).toBe(0);
    expect(easeExecutiveCameraProgress(1)).toBe(1);
    expect(easeExecutiveCameraProgress(0.5)).toBeGreaterThan(0.4);
    expect(easeExecutiveCameraProgress(0.5)).toBeLessThan(0.6);
  });

  it("signature-gates repeated preset transitions", () => {
    expect(shouldApplyExecutiveCameraTransition("a", "sig-1")).toBe(true);
    expect(shouldApplyExecutiveCameraTransition("b", "sig-1")).toBe(false);
    expect(shouldApplyExecutiveCameraTransition("b", "sig-2")).toBe(true);
  });

  it("allows repeated global transitions when reset generation changes", () => {
    const signature = "global-preset:same-scene";
    expect(
      shouldApplyExecutiveCameraTransition("toolbar-preset:global", signature, {
        globalResetGeneration: 1,
      })
    ).toBe(true);
    expect(
      shouldApplyExecutiveCameraTransition("toolbar-preset:global", signature, {
        globalResetGeneration: 1,
      })
    ).toBe(false);
    expect(
      shouldApplyExecutiveCameraTransition("toolbar-preset:global", signature, {
        globalResetGeneration: 2,
      })
    ).toBe(true);
  });
});

describe("executive camera framing runtime", () => {
  it("adapts framing by viewport class", () => {
    expect(classifyExecutiveViewport(1100, 800)).toBe("laptop");
    expect(classifyExecutiveViewport(1440, 900)).toBe("desktop");
    expect(classifyExecutiveViewport(3440, 1440)).toBe("ultrawide");
    expect(classifyExecutiveViewport(2560, 1440)).toBe("large");
    expect(
      resolveExecutiveViewportFramingAdjustments(3440, 1440).radiusScale
    ).toBeGreaterThan(resolveExecutiveViewportFramingAdjustments(1440, 900).radiusScale);
  });
});
