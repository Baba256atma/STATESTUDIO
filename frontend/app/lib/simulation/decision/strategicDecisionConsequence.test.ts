/**
 * D7:1:7 — Strategic decision consequence simulation tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import { createOperationalTimeline } from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  buildDecisionSimulationFingerprint,
  freezeDecisionSimulationOutcome,
  simulateStrategicDecision,
} from "./strategicDecisionConsequenceEngine.ts";
import { analyzeDecisionConsequenceTradeoffs } from "./decisionConsequenceTradeoffs.ts";
import { buildExecutiveDecisionNarrative } from "./executiveDecisionNarratives.ts";
import { modelStrategicDecisionImpact, extractMetricsRecord } from "./decisionEffectModel.ts";
import type { StrategicDecisionInput } from "./strategicDecisionTypes.ts";

function snap(tick: number, fragility = 0.25) {
  return createSimulationStateSnapshot({
    simulationId: "sim-dec",
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: {
      supply: { operationalState: "stable" },
      logistics: { operationalState: "stable" },
      production: { operationalState: "stable" },
    },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.35 },
  });
}

function decision(
  partial: Partial<StrategicDecisionInput> & Pick<StrategicDecisionInput, "decisionId" | "type">
): StrategicDecisionInput {
  return {
    targetObjectIds: ["supply", "logistics"],
    createdAt: "2026-01-01T00:00:00.000Z",
    intensity: 0.6,
    ...partial,
  };
}

test("deterministic consequence simulation fingerprints", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-dec", initialSnapshot: snap(0) });
  const input = {
    decision: decision({ decisionId: "dec-1", type: "stabilization" }),
    activeTimeline: timeline,
  };
  const r1 = simulateStrategicDecision(input);
  const r2 = simulateStrategicDecision(input);
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.outcome.consequenceSnapshot.fingerprint, r2.outcome.consequenceSnapshot.fingerprint);
});

test("simulation does not mutate source timeline", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-immut", initialSnapshot: snap(0) });
  const frozen = JSON.stringify(timeline);
  const result = simulateStrategicDecision({
    decision: decision({ decisionId: "dec-immut", type: "risk_mitigation" }),
    activeTimeline: timeline,
  });
  assert.ok(result.ok);
  assert.equal(JSON.stringify(timeline), frozen);
  assert.equal(timeline.currentTick, 0);
  if (!result.ok) return;
  assert.equal(result.outcome.projectedTimeline.currentTick, 1);
});

test("propagation-triggered consequences with downstream targets", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-prop", initialSnapshot: snap(0) });
  const result = simulateStrategicDecision({
    decision: decision({ decisionId: "dec-prop", type: "expansion" }),
    activeTimeline: timeline,
    resourceAvailability: { supply: 0.6, logistics: 0.5 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.outcome.propagationResults.length === 1);
  assert.ok(result.outcome.consequenceSnapshot.propagationEventCount >= 0);
});

test("tradeoff analysis exposes benefits and costs", () => {
  const modeled = modelStrategicDecisionImpact(
    decision({ decisionId: "dec-to", type: "cost_reduction" }),
    0.7
  );
  const before = { fragility: 0.25, operationalLoad: 0.35, confidence: 0.75 };
  const after = {
    fragility: before.fragility + 0.12,
    operationalLoad: before.operationalLoad - 0.08,
    confidence: before.confidence - 0.04,
  };
  const tradeoffs = analyzeDecisionConsequenceTradeoffs({
    modeled,
    effects: modeled.effects,
    metricsBefore: before,
    metricsAfter: after,
  });
  assert.ok(tradeoffs.length > 0);
  assert.ok(tradeoffs.some((t) => t.dimension === "risk_exposure" || t.dimension === "efficiency"));
});

test("rejects missing targets for resource reallocation", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-guard", initialSnapshot: snap(0) });
  const result = simulateStrategicDecision({
    decision: decision({
      decisionId: "dec-bad",
      type: "resource_reallocation",
      targetObjectIds: [],
    }),
    activeTimeline: timeline,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "missing_targets");
});

test("rejects capacity increase without resource availability", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-res", initialSnapshot: snap(0) });
  const result = simulateStrategicDecision({
    decision: decision({ decisionId: "dec-cap", type: "capacity_increase" }),
    activeTimeline: timeline,
    resourceAvailability: { production: 0.1 },
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "insufficient_resources");
});

test("rejects duplicate simulation fingerprint", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-dup", initialSnapshot: snap(0) });
  const dec = decision({ decisionId: "dec-dup", type: "stabilization" });
  const fp = buildDecisionSimulationFingerprint({
    decisionId: dec.decisionId,
    decisionType: dec.type,
    timelineId: timeline.timelineId,
    appliedAtTick: timeline.currentTick,
    intensity: dec.intensity ?? 0.5,
    targetObjectIds: dec.targetObjectIds,
  });
  const first = simulateStrategicDecision({ decision: dec, activeTimeline: timeline });
  assert.ok(first.ok);
  const second = simulateStrategicDecision({
    decision: dec,
    activeTimeline: timeline,
    priorSimulationFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_simulation");
});

test("rejects recursive decision loop", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-loop", initialSnapshot: snap(0) });
  const result = simulateStrategicDecision({
    decision: decision({ decisionId: "dec-loop", type: "stabilization" }),
    activeTimeline: timeline,
    decisionChain: ["dec-loop"],
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "recursive_decision_loop");
});

test("executive narrative for cost reduction is strategic", () => {
  const modeled = modelStrategicDecisionImpact(
    decision({ decisionId: "dec-nar", type: "cost_reduction" }),
    0.65
  );
  const narrative = buildExecutiveDecisionNarrative({
    decision: decision({ decisionId: "dec-nar", type: "cost_reduction" }),
    modeled,
    tradeoffs: [],
    metricsBefore: extractMetricsRecord({ fragility: 0.25, operationalLoad: 0.35, confidence: 0.75 }),
    metricsAfter: extractMetricsRecord({ fragility: 0.38, operationalLoad: 0.28, confidence: 0.7 }),
  });
  assert.match(narrative.headline, /spending|efficiency|fragility/i);
  assert.ok(!narrative.headline.includes("delta index"));
  assert.ok(narrative.costs.length > 0);
});

test("replay-safe frozen decision outcome", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-freeze", initialSnapshot: snap(0) });
  const result = simulateStrategicDecision({
    decision: decision({ decisionId: "dec-freeze", type: "risk_mitigation" }),
    activeTimeline: timeline,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeDecisionSimulationOutcome(result.outcome);
  assert.throws(() => {
    (frozen.consequenceSnapshot as { simulationId: string }).simulationId = "mutated";
  });
  assert.equal(
    frozen.consequenceSnapshot.fingerprint,
    result.outcome.consequenceSnapshot.fingerprint
  );
});
