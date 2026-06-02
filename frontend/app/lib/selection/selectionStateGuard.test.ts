import { describe, expect, it } from "vitest";
import {
  normalizeSelectedObjectId,
  shouldCommitObjectSelection,
  shouldCommitSelectedObjectId,
} from "./selectionStateGuard";
import {
  areVisibleUiStateSignaturesEqual,
  buildVisibleUiStateSignature,
} from "../ui/visibleUiStateSignature";

describe("selectionStateGuard", () => {
  it("treats identical selected object ids as a no-op", () => {
    expect(shouldCommitSelectedObjectId("obj-1", "obj-1")).toBe(false);
    expect(shouldCommitSelectedObjectId(" obj-1 ", "obj-1")).toBe(false);
    expect(shouldCommitSelectedObjectId(null, null)).toBe(false);
  });

  it("commits when selected object id changes", () => {
    expect(shouldCommitSelectedObjectId("obj-1", "obj-2")).toBe(true);
    expect(shouldCommitSelectedObjectId(null, "obj-1")).toBe(true);
  });

  it("normalizes empty selected object ids to null", () => {
    expect(normalizeSelectedObjectId("   ")).toBe(null);
  });

  it("treats identical object selection signatures as a no-op", () => {
    const prev = { focused_object: "obj-1", highlighted_objects: ["obj-1"] };
    const next = { focused_object: "obj-1", highlighted_objects: ["obj-1"] };
    expect(shouldCommitObjectSelection(prev, next)).toBe(false);
  });

  it("blocks null-to-null object selection writes", () => {
    expect(shouldCommitObjectSelection(null, null)).toBe(false);
  });
});

describe("visibleUiStateSignature", () => {
  it("matches semantically equal visible ui states with different object refs", () => {
    const prev = {
      sceneJson: { scene: { objects: [{ id: "a" }] } },
      responseData: { ok: true },
      objectSelection: null,
      selectedObjectId: "obj-1",
      focusedId: null,
      conflicts: [],
      memoryInsights: null,
      riskPropagation: null,
      strategicAdvice: null,
      decisionCockpit: null,
      opponentModel: null,
      strategicPatterns: null,
    };
    const next = {
      ...prev,
      sceneJson: { scene: { objects: [{ id: "a" }] } },
      responseData: { ok: true },
    };
    expect(areVisibleUiStateSignaturesEqual(prev, next)).toBe(true);
    expect(buildVisibleUiStateSignature(prev)).toBe(buildVisibleUiStateSignature(next));
  });

  it("distinguishes full scene object lists from collapsed scene object lists", () => {
    const base = {
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
    const fullScene = {
      ...base,
      sceneJson: { scene: { objects: [{ id: "b" }, { id: "a" }, { id: "c" }] } },
    };
    const collapsedScene = {
      ...base,
      sceneJson: { scene: { objects: [{ id: "a" }] } },
    };

    expect(buildVisibleUiStateSignature(fullScene)).toContain('"sceneObjectCount":3');
    expect(areVisibleUiStateSignaturesEqual(fullScene, collapsedScene)).toBe(false);
  });
});
