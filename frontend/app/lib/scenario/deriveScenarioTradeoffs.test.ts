import { test } from "node:test";
import * as assert from "node:assert/strict";

import { deriveScenarioTradeoffs } from "./deriveScenarioTradeoffs.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

const baseScenario: DomainScenario = {
  id: "a",
  domainId: "pmo",
  title: "Compress timeline",
  description: "Move fast",
  type: "overload",
  confidence: 0.5,
  severity: "high",
  relatedObjectIds: ["timeline"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Move fast.",
};

const saferScenario: DomainScenario = {
  ...baseScenario,
  id: "b",
  title: "Rebalance resources",
  type: "resource_constraint",
  confidence: 0.7,
};

test("tradeoffs are specific and capped", () => {
  const tradeoffs = deriveScenarioTradeoffs({
    scenarioA: baseScenario,
    scenarioB: saferScenario,
    stabilityDelta: 14,
    fragilityDelta: -20,
    propagationDelta: -12,
    confidenceDelta: 10,
  });

  assert.ok(tradeoffs.length > 0);
  assert.ok(tradeoffs.length <= 4);
  assert.equal(tradeoffs.some((item) => item.includes("Rebalance resources")), true);
});
