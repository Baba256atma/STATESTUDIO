import { test } from "node:test";
import * as assert from "node:assert/strict";

import { generateDomainRelationships } from "./domainRelationshipEngine.ts";
import type { SceneObject } from "../sceneTypes.ts";

const objects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "logistics", label: "Logistics", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
  { id: "risk", label: "Delivery Risk", role: "risk" },
  { id: "decision", label: "Decision Gate", role: "decision" },
];

test("generates valid relationships from domain role templates", () => {
  const result = generateDomainRelationships({ domainId: "supply_chain", objects });

  assert.equal(result.relationships.some((item) => item.sourceObjectId === "supplier" && item.targetObjectId === "inventory"), true);
  assert.equal(result.relationships.some((item) => item.sourceObjectId === "inventory" && item.targetObjectId === "delivery"), true);
  assert.equal(result.relationships.some((item) => item.sourceObjectId === "risk" && item.targetObjectId === "decision"), true);
});

test("relationship generation is deterministic", () => {
  const first = generateDomainRelationships({ domainId: "supply_chain", objects });
  const second = generateDomainRelationships({ domainId: "supply_chain", objects });

  assert.deepEqual(second, first);
});

test("relationship generation does not duplicate source target type triples", () => {
  const result = generateDomainRelationships({ domainId: "supply_chain", objects });
  const keys = result.relationships.map((item) => `${item.sourceObjectId}|${item.targetObjectId}|${item.relationshipType}`);

  assert.equal(new Set(keys).size, keys.length);
});

test("relationship role matching reads semantic metadata", () => {
  const result = generateDomainRelationships({
    domainId: "general",
    objects: [
      { id: "a", label: "External Signal", semantic: { role: "input" } },
      { id: "b", label: "Workflow", meta: { semanticRole: "process" } },
    ],
  });

  assert.equal(result.relationships.length, 1);
  assert.equal(result.relationships[0]?.sourceObjectId, "a");
  assert.equal(result.relationships[0]?.targetObjectId, "b");
});

test("unsupported domains fall back safely", () => {
  const result = generateDomainRelationships({ domainId: "missing", objects });

  assert.ok(Array.isArray(result.relationships));
});
