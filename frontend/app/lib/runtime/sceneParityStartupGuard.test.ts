import { beforeEach, describe, expect, it } from "vitest";
import {
  buildSceneParityStableSignature,
  hasSceneParityIdMismatch,
  isVisibleSceneBootstrapCatchUp,
  markSceneParityStabilized,
  resetSceneParityStartupGuardForTests,
  shouldEmitSceneParityHomeScreenLog,
  shouldEmitStableSceneParity,
} from "./sceneParityStartupGuard";
import { markStartupCompleted, resetStartupPhaseForTests } from "./startupPhase";
import { resetStartupNoiseAuditForTests } from "../debug/startupNoiseAudit";

describe("sceneParityStartupGuard", () => {
  beforeEach(() => {
    resetSceneParityStartupGuardForTests();
    resetStartupPhaseForTests();
    resetStartupNoiseAuditForTests();
  });

  it("builds a stable signature from snapshot fields", () => {
    const signature = buildSceneParityStableSignature({
      sceneCount: 2,
      visibleSceneCount: 2,
      selectedObjectId: null,
      relationshipCount: 0,
      scenarioId: "scenario-1",
    });
    expect(signature).toContain('"sceneCount":2');
    expect(signature).toContain('"selectedObjectId":null');
  });

  it("emits parity once per stable signature", () => {
    const signature = buildSceneParityStableSignature({
      sceneCount: 0,
      visibleSceneCount: 0,
      selectedObjectId: null,
      relationshipCount: 0,
      scenarioId: null,
    });
    expect(shouldEmitStableSceneParity(signature)).toBe(true);
    expect(shouldEmitStableSceneParity(signature)).toBe(false);
  });

  it("detects visible scene bootstrap catch-up", () => {
    expect(isVisibleSceneBootstrapCatchUp(["a", "b", "c"], [])).toBe(true);
    expect(isVisibleSceneBootstrapCatchUp(["a", "b", "c"], ["a"])).toBe(true);
    expect(isVisibleSceneBootstrapCatchUp(["a", "b"], ["a", "b"])).toBe(false);
  });

  it("suppresses HomeScreen parity during bootstrap catch-up and in-sync states", () => {
    const signature = JSON.stringify({ sceneJsonIds: ["a", "b"], visibleSceneJsonIds: ["a"] });
    expect(
      shouldEmitSceneParityHomeScreenLog({
        businessSignature: signature,
        sceneJsonIds: ["a", "b"],
        visibleSceneJsonIds: ["a"],
      })
    ).toBe(false);
    expect(
      shouldEmitSceneParityHomeScreenLog({
        businessSignature: "in-sync",
        sceneJsonIds: ["a", "b"],
        visibleSceneJsonIds: ["a", "b"],
      })
    ).toBe(false);
  });

  it("emits HomeScreen parity once for a real runtime mismatch after stabilization", () => {
    markStartupCompleted();
    markSceneParityStabilized();
    const input = {
      businessSignature: "mismatch-1",
      sceneJsonIds: ["a", "b"],
      visibleSceneJsonIds: ["a", "c"],
    };
    expect(shouldEmitSceneParityHomeScreenLog(input)).toBe(true);
    expect(shouldEmitSceneParityHomeScreenLog(input)).toBe(false);
  });

  it("reports mismatch when id sets differ", () => {
    expect(hasSceneParityIdMismatch(["a"], ["b"])).toBe(true);
    expect(hasSceneParityIdMismatch(["a", "b"], ["a", "b"])).toBe(false);
  });
});
