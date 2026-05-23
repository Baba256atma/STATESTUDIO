import { describe, expect, it, vi, beforeEach } from "vitest";

import { getCatalogObjectDefinition } from "../objectCatalog/objectCatalogRegistry";
import { resetObjectCatalogInstrumentationForTests } from "../objectCatalog/objectCatalogInstrumentation";
import {
  createCatalogSceneObject,
  insertCatalogObjectIntoScene,
  resolveCatalogPlacementPosition,
} from "./scenePlacementRuntime";
import type { SceneJson } from "../sceneTypes";

const baseScene: SceneJson = {
  state_vector: {},
  scene: { objects: [], loops: [] },
};

describe("scenePlacementRuntime", () => {
  beforeEach(() => {
    resetObjectCatalogInstrumentationForTests();
    vi.spyOn(globalThis.console, "info").mockImplementation(() => undefined);
  });

  it("resolves non-overlapping orbit placement", () => {
    const placement = resolveCatalogPlacementPosition([], 0);
    expect(placement.valid).toBe(true);
    expect(placement.position).toEqual([0, 0, 0]);
  });

  it("creates catalog scene objects with metadata foundation", () => {
    const definition = getCatalogObjectDefinition("ops_supplier");
    expect(definition).toBeTruthy();
    const { object, metadata } = createCatalogSceneObject(definition!, [2, 0, 1]);
    expect(metadata).toMatchObject({
      label: "Supplier",
      category: "operations",
      source: "catalog",
    });
    expect(object.meta).toMatchObject({
      source: "catalog",
      catalogId: "ops_supplier",
    });
  });

  it("inserts catalog objects into scene without mutation before confirm path", () => {
    const definition = getCatalogObjectDefinition("strat_risk");
    const result = insertCatalogObjectIntoScene({
      currentScene: baseScene,
      definition: definition!,
    });
    expect(result.success).toBe(true);
    expect(result.createdObjectId).toBeTruthy();
    expect(result.nextScene?.scene.objects?.length).toBe(1);
    expect(result.position).toBeTruthy();
  });
});
