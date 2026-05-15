import { test } from "node:test";
import * as assert from "node:assert/strict";

import { enrichDomainRelationships } from "./enrichDomainRelationships.ts";
import { matchDomainScenarioRules } from "./domainScenarioRules.ts";
import type { DomainFragilityScore } from "./domainFragilityScoring.ts";

const supplyObjects = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
];

const fragilityScores: DomainFragilityScore[] = [
  { objectId: "supplier", score: 78, level: "critical" },
  { objectId: "inventory", score: 56, level: "fragile" },
  { objectId: "delivery", score: 24, level: "stable" },
];

test("rules derive supply chain delay and bottleneck patterns", () => {
  const enrichedRelationships = enrichDomainRelationships({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: [
      { from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.82 },
      { from: "inventory", to: "delivery", kind: "domain_dependency", weight: 0.76 },
    ],
  });

  const matches = matchDomainScenarioRules({
    domainId: "supply_chain",
    objects: supplyObjects,
    enrichedRelationships,
    fragilityScores,
  });

  assert.equal(matches.some((match) => match.scenarioType === "delay"), true);
  assert.equal(matches.some((match) => match.scenarioType === "bottleneck" || match.scenarioType === "dependency_failure"), true);
});

test("rules are deterministic and confidence is clamped", () => {
  const enrichedRelationships = enrichDomainRelationships({
    domainId: "supply_chain",
    objects: supplyObjects,
    edges: [{ from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.82 }],
  });
  const first = matchDomainScenarioRules({ domainId: "supply_chain", objects: supplyObjects, enrichedRelationships, fragilityScores });
  const second = matchDomainScenarioRules({ domainId: "supply_chain", objects: supplyObjects, enrichedRelationships, fragilityScores });

  assert.deepEqual(second, first);
  assert.equal(first.every((match) => match.confidence >= 0 && match.confidence <= 1), true);
});
