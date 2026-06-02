import { describe, expect, it } from "vitest";
import type { SceneJson } from "../sceneTypes";
import {
  preserveFullSceneObjects,
  resolveNextVisibleUiState,
} from "./resolveNextVisibleUiState";
import type { VisibleUiStateLike } from "./visibleUiStateSignature";

function sceneWithIds(ids: string[]): SceneJson {
  return {
    scene: {
      objects: ids.map((id) => ({ id, type: "node" })),
    },
  } as SceneJson;
}

function visibleState(sceneJson: SceneJson | null): VisibleUiStateLike {
  return {
    sceneJson,
    responseData: null,
    objectSelection: null,
    selectedObjectId: null,
    focusedId: null,
    conflicts: [],
    memoryInsights: null,
    riskPropagation: null,
    strategicAdvice: null,
    decisionCockpit: null,
    opponentModel: null,
    strategicPatterns: null,
  };
}

describe("preserveFullSceneObjects", () => {
  it("accepts incoming scenes with multiple objects unchanged", () => {
    const incoming = sceneWithIds(["a", "b", "c"]);
    const previous = sceneWithIds(["a"]);

    expect(preserveFullSceneObjects(incoming, previous)).toBe(incoming);
  });

  it("keeps the fuller previous visible scene when incoming scene has one object", () => {
    const incoming = sceneWithIds(["a"]);
    const previous = sceneWithIds(["a", "b", "c"]);

    expect(preserveFullSceneObjects(incoming, previous)).toBe(previous);
  });
});

describe("resolveNextVisibleUiState", () => {
  it("does not collapse a full visible scene to a one-object panel update", () => {
    const previousScene = sceneWithIds(["a", "b", "c"]);
    const next = resolveNextVisibleUiState({
      prev: visibleState(previousScene),
      sceneJson: sceneWithIds(["a"]),
      guardedResponseData: { strategic_advice: { summary: "updated" } },
      objectSelection: { highlighted_objects: ["a"] },
      selectedObjectIdState: "a",
      focusedId: null,
      conflicts: [],
      memoryInsights: null,
      riskPropagation: null,
      strategicAdvice: { summary: "updated" },
      decisionCockpit: null,
      opponentModel: null,
      strategicPatterns: null,
      submitActive: false,
    });

    expect(next.sceneJson).toBe(previousScene);
    expect((next.sceneJson as SceneJson).scene.objects).toHaveLength(3);
    expect(next.strategicAdvice).toEqual({ summary: "updated" });
  });
});
