import test from "node:test";
import assert from "node:assert/strict";

import { buildTypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCExecutionState } from "./typeCExecutionState.ts";
import type { TypeCMemoryState } from "./typeCMemory.ts";

const decision: TypeCDecisionRecommendation = {
  recommendedScenarioId: "scenario_a",
  reasoning: "Scenario A has lower structural risk.",
  tradeoff: "Moderate risk with enough structure to inspect.",
  riskWarning: "Validate assumptions.",
  nextAction: "Open War Room.",
  confidence: 0.72,
};

function execution(overrides: Partial<TypeCExecutionState> = {}): TypeCExecutionState {
  return {
    scenarioId: "scenario_a",
    status: "running",
    startedAt: 100,
    monitoredSignals: ["Supplier delay risk"],
    riskLevel: "medium",
    ...overrides,
  };
}

function memory(outcomes: Array<"stable" | "unstable" | "unknown">): TypeCMemoryState {
  return {
    entries: outcomes.map((outcome, index) => ({
      id: `memory_${index}`,
      scenarioId: `scenario_${index}`,
      decisionSummary: "Recorded execution.",
      riskLevel: outcome === "unstable" ? "high" : outcome === "stable" ? "low" : "medium",
      outcome,
      signalsObserved: ["Supplier delay risk"],
      timestamp: index,
    })),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("unstable memory triggers caution guidance", () => {
  const guidance = buildTypeCAdaptiveGuidance({
    decision,
    execution: null,
    memory: memory(["unstable", "unstable"]),
  });
  assert.equal(guidance?.contextFactors.includes("memory_pattern_unstable"), true);
  assert.match(guidance?.message ?? "", /instability/i);
});

test("high-risk execution triggers warning guidance", () => {
  const guidance = buildTypeCAdaptiveGuidance({
    decision,
    execution: execution({ riskLevel: "high" }),
    memory: memory([]),
  });
  assert.equal(guidance?.contextFactors.includes("execution_high_risk"), true);
  assert.match(guidance?.recommendedAdjustment ?? "", /Pause execution/i);
});

test("stable memory increases confidence guidance", () => {
  const guidance = buildTypeCAdaptiveGuidance({
    decision,
    execution: null,
    memory: memory(["stable", "stable"]),
  });
  assert.equal(guidance?.contextFactors.includes("memory_pattern_stable"), true);
  assert.match(guidance?.message ?? "", /previously stable/i);
  assert.ok((guidance?.confidence ?? 0) > decision.confidence);
});

test("low decision confidence is handled", () => {
  const guidance = buildTypeCAdaptiveGuidance({
    decision: { ...decision, confidence: 0.42 },
    execution: null,
    memory: memory([]),
  });
  assert.equal(guidance?.contextFactors.includes("low_confidence_decision"), true);
  assert.match(guidance?.message ?? "", /confidence is low/i);
});

test("no guidance when no inputs exist", () => {
  const guidance = buildTypeCAdaptiveGuidance({
    decision: null,
    execution: null,
    memory: memory([]),
  });
  assert.equal(guidance, null);
});

test("buildTypeCAdaptiveGuidance does not mutate inputs", () => {
  const currentDecision = { ...decision };
  const currentExecution = execution({ riskLevel: "high" });
  const currentMemory = memory(["unstable", "unstable"]);
  const before = clone({ currentDecision, currentExecution, currentMemory });
  buildTypeCAdaptiveGuidance({
    decision: currentDecision,
    execution: currentExecution,
    memory: currentMemory,
  });
  assert.deepEqual({ currentDecision, currentExecution, currentMemory }, before);
});
