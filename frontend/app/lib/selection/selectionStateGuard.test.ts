import { describe, expect, it } from "vitest";
import {
  isAutomaticSelectionSource,
  hasRecentUserObjectClick,
  isSceneSelectionEchoSource,
  isSceneSelectionUserIntentSource,
  isUserSelectionLockActive,
  normalizeSelectedObjectId,
  shouldFocusOwnershipMirrorOnly,
  deriveObjectSelectionFromSelectedId,
  resolveCanonicalSceneVisualSelection,
  resolveCanonicalVisualSelection,
  shouldBlockAutomaticSelectionOverride,
  shouldCommitObjectSelection,
  shouldCommitSelectedObjectId,
  CANONICAL_VISUAL_SELECTION_SOURCE,
  isCanonicalObjectSelectionSelectSource,
  isCanonicalObjectSelectionClearSource,
  shouldBlockNonCanonicalSelectionWrite,
  logVisualSelectionLayerAudit,
  resetVisualSelectionLayerAuditLogsForTests,
  USER_SELECTION_LOCK_TTL_MS,
} from "./selectionStateGuard";
import { isExplicitUserSelectionSource } from "./nexoraSelectionBootstrap";
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

  it("blocks automatic focus override during a user selection lock", () => {
    expect(
      shouldBlockAutomaticSelectionOverride({
        lockedObjectId: "obj-a",
        nextObjectId: "obj-b",
        source: "focus_ownership",
      })
    ).toBe(true);
  });

  it("blocks pointer miss clears during a user selection lock", () => {
    expect(
      shouldBlockAutomaticSelectionOverride({
        lockedObjectId: "obj-a",
        nextObjectId: null,
        source: "SceneCanvas.onPointerMissed",
      })
    ).toBe(true);
  });

  it("allows same-object writes during a user selection lock", () => {
    expect(
      shouldBlockAutomaticSelectionOverride({
        lockedObjectId: "obj-a",
        nextObjectId: "obj-a",
        source: "focus_ownership",
      })
    ).toBe(false);
  });

  it("allows new explicit user clicks during a user selection lock", () => {
    expect(
      shouldBlockAutomaticSelectionOverride({
        lockedObjectId: "obj-a",
        nextObjectId: "obj-b",
        source: "object_click",
      })
    ).toBe(false);
  });

  it("classifies scene selection user intent vs echo sources", () => {
    expect(isSceneSelectionUserIntentSource("pointer_object_click")).toBe(true);
    expect(isSceneSelectionUserIntentSource("empty_canvas_click")).toBe(true);
    expect(isSceneSelectionUserIntentSource("keyboard_clear")).toBe(true);
    expect(isSceneSelectionEchoSource("prop_sync")).toBe(true);
    expect(isSceneSelectionEchoSource(undefined)).toBe(true);
    expect(isSceneSelectionUserIntentSource("prop_sync")).toBe(false);
  });

  it("classifies object clicks as explicit and interaction controller writes as automatic", () => {
    expect(isExplicitUserSelectionSource("object_click")).toBe(true);
    expect(isExplicitUserSelectionSource("object_click:pointer:1")).toBe(true);
    expect(isExplicitUserSelectionSource("SceneCanvas.onSelectedChange")).toBe(false);
    expect(isExplicitUserSelectionSource("interaction_controller:chat")).toBe(false);
    expect(isAutomaticSelectionSource("interaction_controller:chat")).toBe(true);
    expect(isAutomaticSelectionSource("object_click")).toBe(false);
  });

  it("requires focus ownership to mirror when canonical selection or user lock is active", () => {
    const lock = {
      objectId: "obj-a",
      clickEventId: "pointer:1",
      startedAt: 1000,
    };
    expect(
      shouldFocusOwnershipMirrorOnly({
        selectedObjectIdState: "obj-b",
        latestUserObjectClick: null,
        userSelectionLock: null,
      })
    ).toBe(true);
    expect(
      shouldFocusOwnershipMirrorOnly({
        selectedObjectIdState: null,
        latestUserObjectClick: null,
        userSelectionLock: lock,
        now: 1100,
      })
    ).toBe(true);
    expect(
      shouldFocusOwnershipMirrorOnly({
        selectedObjectIdState: null,
        latestUserObjectClick: { timestamp: 1000 },
        userSelectionLock: null,
        now: 1000 + USER_SELECTION_LOCK_TTL_MS,
      })
    ).toBe(true);
    expect(
      shouldFocusOwnershipMirrorOnly({
        selectedObjectIdState: null,
        latestUserObjectClick: null,
        userSelectionLock: null,
      })
    ).toBe(false);
  });

  it("detects recent user object clicks within the selection lock ttl", () => {
    expect(hasRecentUserObjectClick({ timestamp: 1000 }, 1000 + USER_SELECTION_LOCK_TTL_MS)).toBe(true);
    expect(hasRecentUserObjectClick({ timestamp: 1000 }, 1000 + USER_SELECTION_LOCK_TTL_MS + 1)).toBe(
      false
    );
  });

  it("allows empty canvas clear after the user selection lock expires", () => {
    const lock = {
      objectId: "obj-a",
      clickEventId: "pointer:1",
      startedAt: 1000,
    };
    expect(isUserSelectionLockActive(lock, 1000 + USER_SELECTION_LOCK_TTL_MS)).toBe(true);
    expect(isUserSelectionLockActive(lock, 1000 + USER_SELECTION_LOCK_TTL_MS + 1)).toBe(false);
  });

  it("resolveCanonicalSceneVisualSelection returns only selectedObjectIdState", () => {
    expect(resolveCanonicalSceneVisualSelection({ selectedObjectIdState: " obj-b " })).toBe("obj-b");
    expect(resolveCanonicalSceneVisualSelection({ selectedObjectIdState: null })).toBe(null);
  });

  it("resolves empty canonical visual selection when no object is selected", () => {
    expect(resolveCanonicalVisualSelection(null)).toEqual({
      selectedId: null,
      highlightedIds: [],
      labelIds: [],
      ringIds: [],
      haloIds: [],
      linkIds: [],
      labelObjectIds: [],
      ringObjectIds: [],
      linkObjectIds: [],
      layerObjectIds: [],
      relationshipObjectIds: [],
    });
  });

  it("resolves every selected visual layer to the canonical selected object only", () => {
    expect(resolveCanonicalVisualSelection(" obj-b ")).toEqual({
      selectedId: "obj-b",
      highlightedIds: ["obj-b"],
      labelIds: ["obj-b"],
      ringIds: ["obj-b"],
      haloIds: ["obj-b"],
      linkIds: ["obj-b"],
      labelObjectIds: ["obj-b"],
      ringObjectIds: ["obj-b"],
      linkObjectIds: ["obj-b"],
      layerObjectIds: ["obj-b"],
      relationshipObjectIds: ["obj-b"],
    });
  });

  it("derives objectSelection as a passive mirror from selectedObjectIdState", () => {
    expect(deriveObjectSelectionFromSelectedId({ selectedId: " obj-b " })).toEqual({
      highlighted_objects: ["obj-b"],
      dim_unrelated_objects: false,
    });
    expect(deriveObjectSelectionFromSelectedId({ selectedId: null })).toBe(null);
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

  it("allows only object_click to select and canonical sources to clear", () => {
    expect(isCanonicalObjectSelectionSelectSource("object_click")).toBe(true);
    expect(isCanonicalObjectSelectionSelectSource("object_click:evt-1")).toBe(true);
    expect(isCanonicalObjectSelectionSelectSource("focus_ownership")).toBe(false);
    expect(isCanonicalObjectSelectionClearSource("empty_canvas_click")).toBe(true);
    expect(
      shouldBlockNonCanonicalSelectionWrite({ source: "focus_ownership", nextObjectId: "obj-a" })
    ).toBe(true);
    expect(
      shouldBlockNonCanonicalSelectionWrite({ source: "object_click", nextObjectId: "obj-a" })
    ).toBe(false);
    expect(
      shouldBlockNonCanonicalSelectionWrite({ source: "investor_demo", nextObjectId: "obj-a" })
    ).toBe(true);
    expect(
      shouldBlockNonCanonicalSelectionWrite({ source: "empty_canvas_click", nextObjectId: null })
    ).toBe(false);
    expect(
      shouldBlockNonCanonicalSelectionWrite({ source: "right_panel_context", nextObjectId: null })
    ).toBe(true);
  });

  it("logs visual selection layer audit with canonical sources", () => {
    resetVisualSelectionLayerAuditLogsForTests();
    logVisualSelectionLayerAudit({
      objectId: "obj_demand_1",
      selectedVisual: true,
      selectedId: "obj_demand_1",
      ringSource: CANONICAL_VISUAL_SELECTION_SOURCE,
      labelSource: CANONICAL_VISUAL_SELECTION_SOURCE,
      boldSource: CANONICAL_VISUAL_SELECTION_SOURCE,
      glowSource: CANONICAL_VISUAL_SELECTION_SOURCE,
    });
    expect(CANONICAL_VISUAL_SELECTION_SOURCE).toBe("canonicalSelectedId");
  });
});
