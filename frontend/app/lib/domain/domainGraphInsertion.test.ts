import { test } from "node:test";
import * as assert from "node:assert/strict";

import { insertDomainRelationshipsIntoScene } from "./domainGraphInsertion.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "supplier", label: "Supplier", role: "input" },
        { id: "inventory", label: "Inventory", role: "process" },
        { id: "delivery", label: "Delivery", role: "output" },
        { id: "risk", label: "Risk", role: "risk" },
        { id: "decision", label: "Decision", role: "decision" },
      ],
      loops: [
        {
          id: "existing_loop",
          type: "stability_balance",
          label: "Existing Loop",
          edges: [{ from: "existing_a", to: "existing_b", weight: 0.4, kind: "manual" }],
        },
      ],
    },
  };
}

test("graph insertion preserves existing edges", () => {
  const base = scene();
  const result = insertDomainRelationshipsIntoScene({ currentScene: base, domainId: "supply_chain" });

  assert.equal(result.success, true);
  assert.equal(result.nextScene?.scene.loops?.[0]?.id, "existing_loop");
  assert.equal(result.nextScene?.scene.loops?.[0]?.edges?.[0]?.from, "existing_a");
});

test("graph insertion preserves objects by reference", () => {
  const base = scene();
  const originalObjects = base.scene.objects;
  const result = insertDomainRelationshipsIntoScene({ currentScene: base, domainId: "supply_chain" });

  assert.equal(base.scene.objects, originalObjects);
  assert.equal(result.nextScene?.scene.objects, originalObjects);
});

test("graph insertion creates stable edge ids", () => {
  const result = insertDomainRelationshipsIntoScene({ currentScene: scene(), domainId: "supply_chain" });

  assert.ok(result.createdEdgeIds?.includes("domain_edge_supply_chain_supplier_inventory_flow"));
});

test("graph insertion prevents duplicate edges on second pass", () => {
  const once = insertDomainRelationshipsIntoScene({ currentScene: scene(), domainId: "supply_chain" });
  const twice = insertDomainRelationshipsIntoScene({ currentScene: once.nextScene, domainId: "supply_chain" });

  assert.equal(twice.success, false);
  assert.ok(twice.warnings?.includes("no_new_edges"));
});

test("graph insertion does not mutate original scene loops", () => {
  const base = scene();
  const originalLoops = base.scene.loops;
  insertDomainRelationshipsIntoScene({ currentScene: base, domainId: "supply_chain" });

  assert.equal(base.scene.loops, originalLoops);
  assert.equal(base.scene.loops?.length, 1);
});

test("invalid scene returns safe failure", () => {
  const result = insertDomainRelationshipsIntoScene({ currentScene: null, domainId: "general" });

  assert.equal(result.success, false);
  assert.ok(result.warnings?.includes("invalid_scene"));
});
