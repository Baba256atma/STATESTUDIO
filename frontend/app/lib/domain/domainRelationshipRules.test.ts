import { test } from "node:test";
import * as assert from "node:assert/strict";

import { inferDomainRelationshipMeta } from "./domainRelationshipRules.ts";

test("infers supply chain supplier to inventory as operating flow", () => {
  const meta = inferDomainRelationshipMeta({
    domainId: "supply_chain",
    sourceObject: { id: "supplier", label: "Supplier", role: "input" },
    targetObject: { id: "inventory", label: "Inventory", role: "process" },
    relationshipType: "flow",
  });

  assert.equal(meta.semantic, "flow");
  assert.equal(meta.executiveLabel, "Supply Flow");
  assert.equal(meta.directional, true);
});

test("infers DevOps service to database as dependency", () => {
  const meta = inferDomainRelationshipMeta({
    domainId: "saas_devops",
    sourceObject: { id: "service", label: "Service" },
    targetObject: { id: "database", label: "Database" },
  });

  assert.equal(meta.semantic, "dependency");
  assert.equal(meta.executiveLabel, "Service Dependency");
});

test("infers database to alerting as monitoring", () => {
  const meta = inferDomainRelationshipMeta({
    domainId: "saas_devops",
    sourceObject: { id: "database", label: "Database" },
    targetObject: { id: "alerting", label: "Alerting" },
  });

  assert.equal(meta.semantic, "monitoring");
});

test("falls back to relationship type semantics", () => {
  const meta = inferDomainRelationshipMeta({
    domainId: "unknown",
    sourceObject: { id: "a", label: "A" },
    targetObject: { id: "b", label: "B" },
    relationshipType: "risk_path",
  });

  assert.equal(meta.semantic, "risk");
  assert.ok((meta.strength ?? 0) > 0);
});
