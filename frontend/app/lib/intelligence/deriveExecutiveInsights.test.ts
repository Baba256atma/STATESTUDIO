import { test } from "node:test";
import * as assert from "node:assert/strict";

import { deriveExecutiveInsights } from "./deriveExecutiveInsights.ts";
import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainRiskSignalResult } from "../domain/domainRiskSignals.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

const objects = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
];

const scenarios: DomainScenario[] = [
  {
    id: "scenario_supplier_delay",
    domainId: "supply_chain",
    title: "Supplier Delay Scenario",
    description: "Supplier delay can reach delivery.",
    type: "delay",
    confidence: 0.84,
    severity: "critical",
    relatedObjectIds: ["supplier", "inventory"],
    affectedObjectIds: ["supplier", "inventory", "delivery"],
    impacts: [],
    recommendedActions: ["Reduce supplier dependency"],
    executiveSummary: "Delivery may slow if Supplier continues to carry fragile upstream flow.",
    recommendedFocus: "Reduce delay exposure around Supplier.",
    createdAt: 0,
  },
  {
    id: "scenario_weak",
    domainId: "supply_chain",
    title: "Weak Watch",
    description: "Low confidence watch.",
    type: "bottleneck",
    confidence: 0.2,
    severity: "low",
    relatedObjectIds: ["delivery"],
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Weak watch.",
  },
];

const riskSignals: DomainRiskSignalResult[] = [
  {
    id: "risk_supplier_dependency",
    domainId: "supply_chain",
    signalType: "dependency",
    label: "Supplier dependency",
    severity: "high",
    confidence: 0.82,
    relatedObjectIds: ["supplier", "inventory"],
    explanation: "Supplier dependency is concentrated around inventory flow.",
  },
];

const fragilityScores: DomainFragilityScore[] = [
  { objectId: "supplier", score: 86, level: "critical" },
  { objectId: "delivery", score: 12, level: "stable" },
];

const relationships: EnrichedDomainRelationship[] = [
  {
    edgeId: "e1",
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    relationshipType: "flow",
    meta: {
      semantic: "dependency",
      strength: 0.88,
      directional: true,
      executiveLabel: "Operational Dependency",
    },
    executiveExplanation: "Inventory depends on Supplier stability.",
  },
];

const propagationHints: DomainPropagationHint[] = [
  {
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    propagationStrength: 0.9,
    propagationType: "dependency",
  },
  {
    sourceObjectId: "inventory",
    targetObjectId: "delivery",
    propagationStrength: 0.74,
    propagationType: "delay",
  },
];

test("executive insights rank consistently and surface top pressure", () => {
  const first = deriveExecutiveInsights({
    domainId: "supply_chain",
    objects,
    scenarios,
    riskSignals,
    fragilityScores,
    relationships,
    propagationHints,
  });
  const second = deriveExecutiveInsights({
    domainId: "supply_chain",
    objects,
    scenarios,
    riskSignals,
    fragilityScores,
    relationships,
    propagationHints,
  });

  assert.deepEqual(second, first);
  assert.ok(first.insights.length > 0);
  assert.equal(first.topInsight?.priorityScore, Math.max(...first.insights.map((insight) => insight.priorityScore)));
  assert.equal(first.topInsight?.severity, "critical");
});

test("executive insights reduce weak low-confidence noise", () => {
  const result = deriveExecutiveInsights({
    domainId: "supply_chain",
    objects,
    scenarios: [scenarios[1]],
  });

  assert.equal(result.insights.length, 0);
  assert.equal(result.topInsight, null);
});

test("executive insights do not mutate inputs", () => {
  const objectCopy = structuredClone(objects);
  const scenarioCopy = structuredClone(scenarios);
  const riskCopy = structuredClone(riskSignals);
  const fragilityCopy = structuredClone(fragilityScores);
  const relationshipCopy = structuredClone(relationships);
  const propagationCopy = structuredClone(propagationHints);

  deriveExecutiveInsights({
    domainId: "supply_chain",
    objects,
    scenarios,
    riskSignals,
    fragilityScores,
    relationships,
    propagationHints,
  });

  assert.deepEqual(objects, objectCopy);
  assert.deepEqual(scenarios, scenarioCopy);
  assert.deepEqual(riskSignals, riskCopy);
  assert.deepEqual(fragilityScores, fragilityCopy);
  assert.deepEqual(relationships, relationshipCopy);
  assert.deepEqual(propagationHints, propagationCopy);
});

test("executive insights group by priority tier", () => {
  const result = deriveExecutiveInsights({
    domainId: "supply_chain",
    objects,
    scenarios,
    riskSignals,
    fragilityScores,
    relationships,
    propagationHints,
  });

  const tierCount = Object.values(result.tiers).reduce((sum, items) => sum + items.length, 0);
  assert.equal(tierCount, result.insights.length);
  assert.ok(result.tiers.critical.length > 0);
});
