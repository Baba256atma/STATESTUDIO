import { describe, expect, it } from "vitest";

import {
  buildExecutiveOrbitConfigSignature,
  resolveExecutiveOrbitDistanceLimits,
  resolveExecutiveOrbitRuntimeConfig,
  sanitizeExecutiveOrbitTarget,
} from "./executiveOrbitRuntime";
import {
  handleExecutiveKeyboardNavigation,
  resolveExecutiveKeyboardNavigationAction,
} from "./executiveKeyboardNavigationRuntime";
import {
  buildExecutiveRelationshipExploration,
  resolveExecutiveHoverAffordance,
} from "./executiveRelationshipExplorationRuntime";
import {
  buildExecutiveInteractionSignature,
  getExecutiveInteractionState,
  patchExecutiveInteractionState,
  resetExecutiveInteractionStateForTests,
} from "./executiveInteractionStateRuntime";

describe("executiveOrbitRuntime", () => {
  it("provides stable distance limits for empty scenes", () => {
    const limits = resolveExecutiveOrbitDistanceLimits(null);
    expect(limits.objectCount).toBe(0);
    expect(limits.target).toEqual([0, 0, 0]);
    expect(limits.minDistance).toBeGreaterThan(0);
    expect(limits.maxDistance).toBeGreaterThan(limits.minDistance);
  });

  it("enables rotate only in 3D mode", () => {
    const twoD = resolveExecutiveOrbitRuntimeConfig({ viewMode: "2D", sceneJson: null });
    const threeD = resolveExecutiveOrbitRuntimeConfig({ viewMode: "3D", sceneJson: null });
    expect(twoD.enableRotate).toBe(false);
    expect(threeD.enableRotate).toBe(true);
    expect(twoD.enableDamping).toBe(true);
    expect(threeD.maxPolarAngle).toBeGreaterThan(threeD.minPolarAngle);
  });

  it("builds stable orbit config signatures", () => {
    const signature = buildExecutiveOrbitConfigSignature({ viewMode: "3D", sceneJson: null });
    expect(signature).toContain('"viewMode":"3D"');
    expect(sanitizeExecutiveOrbitTarget([NaN, 1, 2])).toEqual([0, 1, 2]);
  });
});

function typingTarget(tagName: string, extras?: Record<string, unknown>): EventTarget {
  return {
    tagName,
    isContentEditable: false,
    closest: () => null,
    ...extras,
  } as EventTarget;
}

describe("executiveKeyboardNavigationRuntime", () => {
  it("ignores shortcuts while typing in chat input", () => {
    const event = {
      key: "f",
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      target: typingTarget("INPUT", { id: "nexora-chat-input" }),
    } as KeyboardEvent;
    expect(resolveExecutiveKeyboardNavigationAction(event)).toBeNull();
  });

  it("maps keyboard shortcuts when not typing", () => {
    const event = {
      key: "g",
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      target: typingTarget("DIV"),
    } as KeyboardEvent;
    expect(resolveExecutiveKeyboardNavigationAction(event)).toBe("global_view");
  });
});

describe("executiveRelationshipExplorationRuntime", () => {
  it("highlights connected nodes for selected object", () => {
    const exploration = buildExecutiveRelationshipExploration({
      selectedObjectId: "a",
      relationships: [
        { sourceId: "a", targetId: "b" },
        { sourceId: "c", targetId: "a" },
      ],
    });
    expect(exploration.active).toBe(true);
    expect(exploration.outgoingObjectIds).toEqual(["b"]);
    expect(exploration.incomingObjectIds).toEqual(["c"]);
    expect(exploration.connectedObjectIds.sort()).toEqual(["b", "c"]);
  });

  it("provides executive hover affordance in calm mode", () => {
    const hovered = resolveExecutiveHoverAffordance({
      hovered: true,
      selected: false,
      focused: false,
      connectedToSelected: false,
      relationshipExplorationActive: false,
    });
    expect(hovered.showGlow).toBe(true);
    expect(hovered.emissiveBoost).toBeGreaterThan(0);
  });
});

describe("executiveInteractionStateRuntime", () => {
  it("dedupes interaction state patches", () => {
    resetExecutiveInteractionStateForTests();
    patchExecutiveInteractionState({ hoveredObjectId: "a" });
    const signature = buildExecutiveInteractionSignature(getExecutiveInteractionState());
    patchExecutiveInteractionState({ hoveredObjectId: "a" });
    expect(buildExecutiveInteractionSignature(getExecutiveInteractionState())).toBe(signature);
  });
});
