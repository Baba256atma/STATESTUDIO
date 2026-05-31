import { describe, expect, it, beforeEach } from "vitest";
import {
  computeChangedFields,
  getRuntimeLoopAuditCounters,
  resetRuntimeLoopTraceForTests,
  traceRuntimeParity,
  traceRuntimeSelection,
  traceRuntimeWrite,
} from "./runtimeLoopTrace";
import {
  getLoopRootCandidatesForTests,
  recordLoopObservation,
  resetRuntimeLoopDetectorForTests,
} from "./runtimeLoopDetector";
import { resetIdleRuntimeWriteGuardForTests } from "../runtime/idleRuntimeWriteGuard";

describe("runtimeLoopDetector", () => {
  beforeEach(() => {
    resetRuntimeLoopDetectorForTests();
  });

  it("emits loop root candidate after 3 repeats within 5 seconds", () => {
    const now = Date.now();
    recordLoopObservation("HomeScreen", "scene_parity", "sig-1", now);
    recordLoopObservation("HomeScreen", "scene_parity", "sig-1", now + 100);
    recordLoopObservation("HomeScreen", "scene_parity", "sig-1", now + 200);

    const candidates = getLoopRootCandidatesForTests();
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.count).toBe(3);
    expect(candidates[0]?.source).toBe("HomeScreen");
  });
});

describe("runtimeLoopTrace", () => {
  beforeEach(() => {
    resetRuntimeLoopTraceForTests();
    resetRuntimeLoopDetectorForTests();
    resetIdleRuntimeWriteGuardForTests();
  });

  it("computes changed fields between scene parity signatures", () => {
    const prev = JSON.stringify({ sceneJsonIds: ["a"], selectedObjectId: null });
    const next = JSON.stringify({ sceneJsonIds: ["a", "b"], selectedObjectId: null });
    expect(computeChangedFields(prev, next)).toEqual(["sceneJsonIds"]);
  });

  it("flags same-selection reapply traces", () => {
    const selectionSig = JSON.stringify({ highlighted: ["obj-1"] });
    const event = traceRuntimeSelection({
      caller: "HomeScreen.setObjectSelection",
      objectId: "obj-1",
      previousSelection: selectionSig,
      nextSelection: selectionSig,
    });
    expect(event.detail?.sameSelectionReapply).toBe(true);
  });

  it("includes changed fields in parity traces", () => {
    const prev = JSON.stringify({ mode: "type_c" });
    const next = JSON.stringify({ mode: "type_c", scenarioId: "s-1" });
    const event = traceRuntimeParity({
      source: "HomeScreen",
      action: "business_scene_parity",
      reason: "signature_changed",
      previousSceneSignature: prev,
      nextSceneSignature: next,
    });
    expect(event.detail?.changedFields).toEqual(["scenarioId"]);
  });

  it("does not bump audit counters when parity signature is unchanged", () => {
    const signature = JSON.stringify({ sceneJsonIds: ["a"], visibleSceneJsonIds: ["a"] });
    traceRuntimeParity({
      source: "HomeScreen",
      action: "SceneParity.HomeScreen",
      reason: "business_scene_parity_signature_changed",
      previousSceneSignature: signature,
      nextSceneSignature: signature,
    });
    traceRuntimeParity({
      source: "HomeScreen",
      action: "SceneParity.HomeScreen",
      reason: "business_scene_parity_signature_changed",
      previousSceneSignature: signature,
      nextSceneSignature: signature,
    });
    const parityEvents = getRuntimeLoopAuditCounters().parityEvents ?? [];
    const homeScreenEvents = parityEvents.filter((entry) => entry.key.includes("HomeScreen"));
    expect(homeScreenEvents.reduce((sum, entry) => sum + entry.count, 0)).toBe(0);
  });

  it("does not count stale payload previousSignature as a repeating writer", () => {
    traceRuntimeWrite({
      source: "HomeScreen.setVisibleUiState",
      action: "visible_ui_state_reconcile",
      signature: "sig-b",
      previousSignature: "sig-a",
      nextSignature: "sig-b",
    });
    traceRuntimeWrite({
      source: "HomeScreen.setVisibleUiState",
      action: "visible_ui_state_reconcile",
      signature: "sig-b",
      previousSignature: "sig-a",
      nextSignature: "sig-b",
    });
    const writers = getRuntimeLoopAuditCounters().writers ?? [];
    const entry = writers.find((row) => row.key.includes("setVisibleUiState"));
    expect(entry?.count).toBe(1);
  });
});
