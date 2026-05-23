import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  insertRelationshipIntoScene,
  readSceneRelationships,
  relationshipsToSceneEdges,
  requestOpenRelationshipBuilder,
} from "./relationshipRuntime";
import { resetRelationshipInstrumentationForTests } from "./relationshipInstrumentation";
import { validateRelationshipCreateRequest } from "./relationshipValidation";
import type { SceneJson } from "../sceneTypes";

const baseScene: SceneJson = {
  state_vector: {},
  scene: {
    objects: [
      { id: "supplier_a", label: "Supplier A" },
      { id: "warehouse_b", label: "Warehouse B" },
    ],
    loops: [],
    relationships: [],
  },
};

describe("relationshipRuntime", () => {
  beforeEach(() => {
    resetRelationshipInstrumentationForTests();
    vi.spyOn(globalThis.console, "info").mockImplementation(() => undefined);
    if (typeof globalThis.window === "undefined") {
      (globalThis as typeof globalThis & { window: Window }).window = {
        dispatchEvent: () => true,
      } as unknown as Window;
    }
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });

  it("validates and rejects self-links and duplicates", () => {
    const validIds = new Set(["supplier_a", "warehouse_b"]);
    const invalid = validateRelationshipCreateRequest(
      { sourceId: "supplier_a", targetId: "supplier_a", type: "dependency" },
      [],
      validIds
    );
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain("self_link");

    const duplicate = validateRelationshipCreateRequest(
      { sourceId: "supplier_a", targetId: "warehouse_b", type: "supplies", direction: "uni" },
      [
        {
          id: "rel_1",
          sourceId: "supplier_a",
          targetId: "warehouse_b",
          type: "supplies",
          direction: "uni",
          createdAt: new Date().toISOString(),
        },
      ],
      validIds
    );
    expect(duplicate.valid).toBe(false);
    expect(duplicate.errors).toContain("duplicate_link");
  });

  it("inserts relationships into scene contracts", () => {
    const result = insertRelationshipIntoScene(baseScene, {
      sourceId: "supplier_a",
      targetId: "warehouse_b",
      type: "supplies",
      direction: "uni",
    });
    expect(result.success).toBe(true);
    expect(result.relationship?.type).toBe("supplies");
    expect(readSceneRelationships(result.nextScene).length).toBe(1);
  });

  it("exports overlay-compatible relationship edges", () => {
    const scene: SceneJson = {
      ...baseScene,
      scene: {
        ...baseScene.scene,
        relationships: [
          {
            id: "rel_test",
            sourceId: "supplier_a",
            targetId: "warehouse_b",
            type: "dependency",
            direction: "bi",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    };
    const edges = relationshipsToSceneEdges(scene);
    expect(edges.length).toBe(2);
  });

  it("dispatches relationship builder open events", () => {
    requestOpenRelationshipBuilder("object_info_hud", "supplier_a");
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
