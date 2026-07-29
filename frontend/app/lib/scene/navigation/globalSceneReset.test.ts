import type { SceneJson } from "../../sceneTypes";
import { describe, expect, it, beforeEach } from "vitest";

import {
  bumpGlobalResetGeneration,
  restoreSceneObjectsToGlobalLayout,
  resetGlobalSceneResetRuntimeForTests,
  sceneObjectsNeedGlobalReset,
  shouldApplyGlobalResetTransition,
} from "./globalSceneResetRuntime";

const sceneJson: SceneJson = {
  state_vector: {}, scene: { objects: [
      { id: "a", transform: { pos: [0, 0, 0] } },
      { id: "b", transform: { pos: [2, 0, 0] } },
    ],
  },
};

const layoutPositions = {
  a: [0, 0, 0] as [number, number, number],
  b: [1.8, 0, 0] as [number, number, number],
};

describe("globalSceneResetRuntime", () => {
  beforeEach(() => {
    resetGlobalSceneResetRuntimeForTests();
  });

  it("detects when objects drift from default layout", () => {
    expect(sceneObjectsNeedGlobalReset(sceneJson, layoutPositions)).toBe(true);
    expect(
      sceneObjectsNeedGlobalReset(restoreSceneObjectsToGlobalLayout(sceneJson, layoutPositions), layoutPositions)
    ).toBe(false);
  });

  it("detects drift when only the position field moved but transform.pos stayed default", () => {
    const movedPositionField = {
      state_vector: {}, scene: { objects: [
          { id: "a", transform: { pos: [0, 0, 0] }, position: [4, 0, 0] as [number, number, number] },
        ],
      },
    };
    expect(sceneObjectsNeedGlobalReset(movedPositionField, layoutPositions)).toBe(true);
  });

  it("no-ops when all channels already match default positions", () => {
    const atDefault = restoreSceneObjectsToGlobalLayout(sceneJson, layoutPositions);
    expect(
      shouldApplyGlobalResetTransition({
        resetGeneration: bumpGlobalResetGeneration(),
        needsReset: sceneObjectsNeedGlobalReset(atDefault, layoutPositions),
      })
    ).toBe(false);
  });

  it("applies reset when objects drift and generation is new", () => {
    const generation = bumpGlobalResetGeneration();
    expect(
      shouldApplyGlobalResetTransition({
        resetGeneration: generation,
        needsReset: sceneObjectsNeedGlobalReset(sceneJson, layoutPositions),
      })
    ).toBe(true);
  });

  it("supports repeated reset after objects move again", () => {
    const firstGeneration = bumpGlobalResetGeneration();
    expect(
      shouldApplyGlobalResetTransition({
        resetGeneration: firstGeneration,
        needsReset: sceneObjectsNeedGlobalReset(sceneJson, layoutPositions),
      })
    ).toBe(true);

    const restored = restoreSceneObjectsToGlobalLayout(sceneJson, layoutPositions);
    expect(
      shouldApplyGlobalResetTransition({
        resetGeneration: bumpGlobalResetGeneration(),
        needsReset: sceneObjectsNeedGlobalReset(restored, layoutPositions),
      })
    ).toBe(false);

    const restoredObjects = restored?.scene.objects ?? [];
    const movedAgain = {
      ...restored,
      state_vector: restored?.state_vector ?? {},
      scene: {
        ...restored!.scene,
        objects: restoredObjects.map((obj, index) =>
          index === 0
            ? { ...obj, transform: { pos: [5, 0, 0] }, position: [5, 0, 0] as [number, number, number] }
            : obj
        ),
      },
    };
    expect(sceneObjectsNeedGlobalReset(movedAgain, layoutPositions)).toBe(true);
    expect(
      shouldApplyGlobalResetTransition({
        resetGeneration: bumpGlobalResetGeneration(),
        needsReset: sceneObjectsNeedGlobalReset(movedAgain, layoutPositions),
      })
    ).toBe(true);
  });

  it("restores all scene position channels to layout defaults", () => {
    const restored = restoreSceneObjectsToGlobalLayout(sceneJson, layoutPositions);
    const objectB = restored?.scene.objects?.[1];
    const transform = objectB?.transform;
    const pos = transform && typeof transform === "object" && "pos" in transform ? transform.pos : undefined;
    expect(pos).toEqual([1.8, 0, 0]);
    expect(objectB?.position).toEqual([1.8, 0, 0]);
  });
});
