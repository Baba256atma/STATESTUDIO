import { beforeEach, describe, expect, it } from "vitest";

import type { NexoraRelationship } from "../relationshipTypes";
import {
  relationshipTouchesSelectedObject,
  resolveRelationshipFocusRole,
} from "./relationshipFocusRuntime";
import { resetExecutiveRelationshipInstrumentationForTests } from "./executiveRelationshipInstrumentation";

const baseRelationship = (overrides: Partial<NexoraRelationship> = {}): NexoraRelationship => ({
  id: "rel-1",
  sourceId: "scene_obj_operations_1",
  targetId: "scene_obj_warehouse_1",
  type: "dependency",
  direction: "uni",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("relationshipFocusRuntime", () => {
  beforeEach(() => {
    resetExecutiveRelationshipInstrumentationForTests();
  });

  it("matches selected scene id against relationship sourceId", () => {
    const relationship = baseRelationship();
    expect(relationshipTouchesSelectedObject(relationship, "scene_obj_operations_1")).toBe(true);
    const role = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: "scene_obj_operations_1",
    });
    expect(role).not.toBe("unrelated");
    expect(role).toBe("direct_dependency");
  });

  it("matches selected workspace id against metadata sourceObjectId", () => {
    const relationship = baseRelationship({
      metadata: {
        sourceObjectId: "obj_operations_1",
        targetObjectId: "obj_warehouse_1",
      },
    });
    expect(relationshipTouchesSelectedObject(relationship, "obj_operations_1")).toBe(true);
    const role = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: "obj_operations_1",
    });
    expect(role).not.toBe("unrelated");
    expect(role).toBe("direct_dependency");
  });

  it("matches selected workspace id against metadata targetObjectId", () => {
    const relationship = baseRelationship({
      metadata: {
        sourceObjectId: "obj_operations_1",
        targetObjectId: "obj_warehouse_1",
      },
    });
    expect(relationshipTouchesSelectedObject(relationship, "obj_warehouse_1")).toBe(true);
    const role = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: "obj_warehouse_1",
    });
    expect(role).not.toBe("unrelated");
    expect(role).toBe("direct_dependency");
  });

  it("returns unrelated for selected id with no endpoint match", () => {
    const relationship = baseRelationship({
      metadata: {
        sourceObjectId: "obj_operations_1",
        targetObjectId: "obj_warehouse_1",
      },
    });
    expect(relationshipTouchesSelectedObject(relationship, "obj_unrelated_1")).toBe(false);
    const role = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: "obj_unrelated_1",
    });
    expect(role).toBe("unrelated");
  });

  it("falls back to sourceId and targetId when metadata is missing", () => {
    const relationship = baseRelationship({
      sourceId: "obj-a",
      targetId: "obj-b",
      metadata: undefined,
    });
    expect(relationshipTouchesSelectedObject(relationship, "obj-a")).toBe(true);
    expect(relationshipTouchesSelectedObject(relationship, "obj-b")).toBe(true);
    const role = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: "obj-a",
    });
    expect(role).toBe("direct_dependency");
  });

  it("normalizes whitespace when matching endpoint ids", () => {
    const relationship = baseRelationship({
      sourceId: " scene_obj_operations_1 ",
      metadata: {
        sourceObjectId: " obj_operations_1 ",
        targetObjectId: " obj_warehouse_1 ",
      },
    });
    expect(relationshipTouchesSelectedObject(relationship, "scene_obj_operations_1")).toBe(true);
    expect(relationshipTouchesSelectedObject(relationship, " obj_operations_1 ")).toBe(true);
    expect(relationshipTouchesSelectedObject(relationship, "obj_warehouse_1")).toBe(true);
  });
});
