import { test } from "node:test";
import * as assert from "node:assert/strict";

import { createDomainEdges } from "./domainEdgeFactory.ts";
import type { DomainRelationshipMatch } from "./domainRelationshipEngine.ts";

const relationships: DomainRelationshipMatch[] = [
  {
    templateId: "input_to_process",
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    relationshipType: "flow",
    confidence: 0.76,
  },
  {
    templateId: "risk_to_decision",
    sourceObjectId: "risk",
    targetObjectId: "decision",
    relationshipType: "risk_path",
    confidence: 0.92,
  },
];

test("creates stable normalized domain edges", () => {
  const result = createDomainEdges({ domainId: "supply_chain", relationships });

  assert.equal(result.success, true);
  assert.equal(result.edges.length, 2);
  assert.equal((result.edges[0] as { id: string }).id, "domain_edge_supply_chain_supplier_inventory_flow");
  assert.equal((result.edges[0] as { kind: string }).kind, "domain_flow");
});

test("edge metadata is preserved for future overlays", () => {
  const result = createDomainEdges({ domainId: "supply_chain", relationships });
  const metadata = (result.edges[1] as { metadata: Record<string, unknown> }).metadata;

  assert.equal(metadata.domainId, "supply_chain");
  assert.equal(metadata.relationshipType, "risk_path");
  assert.equal(metadata.generatedBy, "domain_relationship_engine");
});

test("does not duplicate existing source target relationship type", () => {
  const result = createDomainEdges({
    domainId: "supply_chain",
    relationships,
    existingEdges: [{ from: "supplier", to: "inventory", kind: "domain_flow" }],
  });

  assert.equal(result.edges.length, 1);
  assert.equal((result.edges[0] as { from: string }).from, "risk");
});

test("does not mutate input arrays", () => {
  const copy = [...relationships];
  createDomainEdges({ domainId: "supply_chain", relationships });

  assert.deepEqual(relationships, copy);
});
