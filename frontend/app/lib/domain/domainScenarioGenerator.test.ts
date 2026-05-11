import { test } from "node:test";
import * as assert from "node:assert/strict";

import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { generateDomainScenarios } from "./domainScenarioGenerator.ts";
import type { SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

const objects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input", semantic: { keywords: ["supplier delay"] } },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery_risk", label: "Delivery Risk", role: "risk", semantic: { keywords: ["delivery risk", "late shipment"] } },
  { id: "decision", label: "Decision Gate", role: "decision" },
];

const edges: SceneLoopEdge[] = [
  { from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.72 },
  { from: "inventory", to: "delivery_risk", kind: "domain_risk_path", weight: 0.84 },
  { from: "supplier", to: "delivery_risk", kind: "domain_risk_path", weight: 0.8 },
  { from: "delivery_risk", to: "decision", kind: "domain_risk_path", weight: 0.74 },
];

test("scenario generation is deterministic", () => {
  const first = generateDomainScenarios({ domainId: "supply_chain", objects, edges });
  const second = generateDomainScenarios({ domainId: "supply_chain", objects, edges });

  assert.deepEqual(second, first);
});

test("supply chain risk generates executive scenarios", () => {
  const scenarios = generateDomainScenarios({ domainId: "supply_chain", objects, edges });

  assert.ok(scenarios.length > 0);
  assert.equal(scenarios.some((scenario) => scenario.title.includes("backup") || scenario.title.includes("buffer")), true);
  assert.equal(scenarios.every((scenario) => scenario.domainId === "supply_chain"), true);
});

test("unsupported domain falls back safely", () => {
  const scenarios = generateDomainScenarios({ domainId: "missing", objects, edges });

  assert.ok(Array.isArray(scenarios));
  assert.equal(scenarios[0]?.domainId, "general");
});

test("confidence is clamped and duplicate scenarios are prevented", () => {
  const riskSignals = evaluateDomainRiskSignals({ domainId: "supply_chain", objects, edges });
  const fragilityScores = calculateObjectFragilityScores({ objects, edges });
  const scenarios = generateDomainScenarios({
    domainId: "supply_chain",
    objects,
    edges,
    riskSignals,
    fragilityScores,
  });
  const keys = scenarios.map((scenario) => `${scenario.title}|${scenario.relatedObjectIds.join(",")}|${scenario.type}`);

  assert.equal(new Set(keys).size, keys.length);
  for (const scenario of scenarios) {
    assert.ok(scenario.confidence >= 0 && scenario.confidence <= 1);
  }
});

test("scenario generation does not mutate inputs", () => {
  const objectCopy = structuredClone(objects);
  const edgeCopy = structuredClone(edges);
  generateDomainScenarios({ domainId: "supply_chain", objects, edges });

  assert.deepEqual(objects, objectCopy);
  assert.deepEqual(edges, edgeCopy);
});
