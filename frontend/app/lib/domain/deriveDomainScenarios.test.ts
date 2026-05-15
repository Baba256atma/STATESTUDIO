import { test } from "node:test";
import * as assert from "node:assert/strict";

import { deriveDomainScenarios } from "./deriveDomainScenarios.ts";
import { enrichDomainRelationships } from "./enrichDomainRelationships.ts";
import type { DomainFragilityScore } from "./domainFragilityScoring.ts";

const supplyObjects = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
];

const supplyEdges = [
  { id: "e1", from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.86 },
  { id: "e2", from: "inventory", to: "delivery", kind: "domain_dependency", weight: 0.8 },
];

const fragilityScores: DomainFragilityScore[] = [
  { objectId: "supplier", score: 82, level: "critical" },
  { objectId: "inventory", score: 62, level: "fragile" },
  { objectId: "delivery", score: 32, level: "watch" },
];

test("derives deterministic executive scenarios from relationships and fragility", () => {
  const first = deriveDomainScenarios({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: supplyEdges,
    fragilityScores,
  });
  const second = deriveDomainScenarios({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: supplyEdges,
    fragilityScores,
  });

  assert.deepEqual(second, first);
  assert.ok(first.length > 0);
  assert.equal(first[0]?.domainId, "supply_chain");
  assert.equal(first[0]?.createdAt, 0);
});

test("derived scenarios include executive overlay fields without scene mutation", () => {
  const objectsCopy = structuredClone(supplyObjects);
  const edgesCopy = structuredClone(supplyEdges);
  const scenarios = deriveDomainScenarios({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: supplyEdges,
    fragilityScores,
  });

  assert.deepEqual(supplyObjects, objectsCopy);
  assert.deepEqual(supplyEdges, edgesCopy);
  assert.equal(scenarios.every((scenario) => Array.isArray(scenario.affectedObjectIds)), true);
  assert.equal(scenarios.every((scenario) => typeof scenario.probableImpact === "string"), true);
  assert.equal(scenarios.every((scenario) => typeof scenario.recommendedFocus === "string"), true);
});

test("derived scenarios avoid duplicates and stay capped", () => {
  const enrichedRelationships = enrichDomainRelationships({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: [...supplyEdges, supplyEdges[0]],
  });
  const scenarios = deriveDomainScenarios({
    domainId: "supply_chain",
    objects: supplyObjects,
    enrichedRelationships,
    fragilityScores,
  });
  const keys = scenarios.map((scenario) => `${scenario.title}|${scenario.relatedObjectIds.join("|")}|${scenario.type}`);

  assert.equal(new Set(keys).size, keys.length);
  assert.ok(scenarios.length <= 5);
});

test("DevOps database dependency creates dependency failure scenario", () => {
  const scenarios = deriveDomainScenarios({
    domainId: "saas_devops",
    objects: [
      { id: "service", label: "Service", role: "process" },
      { id: "database", label: "Database", role: "constraint" },
    ],
    edges: [{ from: "service", to: "database", kind: "domain_dependency", weight: 0.88 }],
    fragilityScores: [
      { objectId: "service", score: 52, level: "fragile" },
      { objectId: "database", score: 78, level: "critical" },
    ],
  });

  assert.equal(scenarios.some((scenario) => scenario.type === "dependency_failure"), true);
});
