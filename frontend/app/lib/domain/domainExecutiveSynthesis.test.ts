import { test } from "node:test";
import * as assert from "node:assert/strict";

import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { generateDomainScenarios } from "./domainScenarioGenerator.ts";
import { scoreDomainScenarios } from "./domainScenarioScoring.ts";
import { buildExecutiveInsights } from "./domainExecutiveSynthesis.ts";
import type { SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

const objects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input", semantic: { keywords: ["supplier delay"] } },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery_risk", label: "Delivery Risk", role: "risk", semantic: { keywords: ["delivery risk"] } },
];

const edges: SceneLoopEdge[] = [
  { from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.72 },
  { from: "supplier", to: "delivery_risk", kind: "domain_risk_path", weight: 0.82 },
  { from: "inventory", to: "delivery_risk", kind: "domain_risk_path", weight: 0.84 },
];

function fixture() {
  const riskSignals = evaluateDomainRiskSignals({ domainId: "supply_chain", objects, edges });
  const fragilityScores = calculateObjectFragilityScores({ objects, edges });
  const scenarios = generateDomainScenarios({ domainId: "supply_chain", objects, edges, riskSignals, fragilityScores });
  const scenarioScores = scoreDomainScenarios({ scenarios });
  return { riskSignals, fragilityScores, scenarios, scenarioScores };
}

test("executive insight generation is deterministic", () => {
  const data = fixture();
  const first = buildExecutiveInsights({ domainId: "supply_chain", ...data });
  const second = buildExecutiveInsights({ domainId: "supply_chain", ...data });

  assert.deepEqual(second, first);
});

test("posture generation is valid and confidence clamped", () => {
  const insights = buildExecutiveInsights({ domainId: "supply_chain", ...fixture() });

  assert.ok(insights.length > 0);
  for (const insight of insights) {
    assert.ok(["stable", "watch", "cautious", "fragile", "critical"].includes(insight.posture));
    assert.ok(insight.confidence >= 0 && insight.confidence <= 1);
  }
});

test("unsupported domain falls back safely", () => {
  const insights = buildExecutiveInsights({ domainId: "missing", ...fixture() });

  assert.ok(Array.isArray(insights));
  assert.equal(insights[0]?.domainId, "general");
});

test("executive synthesis does not mutate inputs", () => {
  const data = fixture();
  const copy = structuredClone(data);
  buildExecutiveInsights({ domainId: "supply_chain", ...data });

  assert.deepEqual(data, copy);
});

test("duplicate insights are prevented", () => {
  const data = fixture();
  const insights = buildExecutiveInsights({ domainId: "supply_chain", ...data });
  const keys = insights.map((insight) => `${insight.title}|${insight.relatedObjectIds.join(",")}|${insight.relatedScenarioIds?.join(",") ?? ""}`);

  assert.equal(new Set(keys).size, keys.length);
});
