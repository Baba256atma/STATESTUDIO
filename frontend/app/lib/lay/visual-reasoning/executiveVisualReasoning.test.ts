import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveThoughtPartner } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import {
  EXECUTIVE_VISUAL_REASONING_CAPABILITY_REGISTRY,
  EXECUTIVE_VISUAL_REASONING_CONTRACTS,
  ExecutiveVisualReasoningEngine,
  buildExecutiveCauseEffectMap,
  buildExecutiveDecisionMap,
  buildExecutivePlanMap,
  buildExecutiveTradeoffMap,
  buildExecutiveVisualExplanation,
  buildExecutiveVisualMap,
  buildExecutiveVisualReasoning,
  listExecutiveVisualReasoningCapabilities,
  normalizeExecutiveVisualReasoningContext,
  validateExecutiveVisualReasoning,
  type ExecutiveVisualReasoningInput,
  type ExecutiveVisualReasoningResult,
} from "./executiveVisualReasoningEngine.ts";
import type { ExecutiveVisualEdge, ExecutiveVisualNode } from "./executiveVisualReasoningEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:visual:a",
    situation: "A neutral executive visual reasoning context has upstream LAY outputs ready for visual metadata.",
    objects: Object.freeze([
      Object.freeze({ id: "capacity", label: "Capacity", description: "Available capacity.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "delivery", label: "Delivery", description: "Delivery throughput.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "quality", label: "Quality", description: "Quality posture.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "scope", label: "Scope", description: "Scope boundary.", attributes: Object.freeze({}) }),
    ]),
    relationships: Object.freeze([
      Object.freeze({ id: "rel:cause", fromId: "capacity", toId: "delivery", kind: "causes", evidence: "Capacity influences delivery." }),
      Object.freeze({ id: "rel:dependency", fromId: "delivery", toId: "quality", kind: "dependsOn", evidence: "Quality depends on stable delivery." }),
      Object.freeze({ id: "rel:tradeoff", fromId: "scope", toId: "quality", kind: "tradesOffWith", evidence: "Scope breadth creates quality tension." }),
    ]),
    assumptions: Object.freeze([
      Object.freeze({ id: "assumption:capacity", statement: "Capacity remains fixed.", appliesTo: Object.freeze(["capacity"]), impact: "Fixed capacity affects delivery confidence." }),
    ]),
    constraints: Object.freeze([
      Object.freeze({ id: "constraint:scope", statement: "Scope cannot expand without capacity.", appliesTo: Object.freeze(["scope"]), consequence: "Scope expansion is constrained by capacity." }),
    ]),
  });
}

function visualInput(): ExecutiveVisualReasoningInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:visual:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:visual:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:visual:a", reasoning, judgment, planning });
  const thoughtPartner = buildExecutiveThoughtPartner({ sessionId: "thought-partner:visual:a", reasoning, judgment, planning, coaching });

  return Object.freeze({
    sessionId: "visual:session:a",
    reasoning,
    judgment,
    planning,
    coaching,
    thoughtPartner,
  });
}

function visualReasoning(): ExecutiveVisualReasoningResult {
  return buildExecutiveVisualReasoning(visualInput());
}

function hasNoDanglingEdges(nodes: readonly ExecutiveVisualNode[], edges: readonly ExecutiveVisualEdge[]): boolean {
  const nodeIds = new Set(nodes.map((node) => node.id));
  return edges.every((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to));
}

test("normalizes visual reasoning context with LAY-2 through LAY-6 traceability", () => {
  const input = visualInput();
  const context = normalizeExecutiveVisualReasoningContext(input);

  assert.equal(context.session.phase, "LAY-7");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.judgmentSessionId, input.judgment.session.sessionId);
  assert.equal(context.session.planningSessionId, input.planning.session.sessionId);
  assert.equal(context.session.coachingSessionId, input.coaching.session.sessionId);
  assert.equal(context.session.thoughtPartnerSessionId, input.thoughtPartner.session.sessionId);
});

test("builds aggregate executive visual map", () => {
  const result = visualReasoning();

  assert.equal(result.executiveMap.mapType, "executive");
  assert.equal(result.executiveMap.nodes.some((node) => node.sourceLayer === "LAY-6"), true);
  assert.equal(result.executiveMap.edges.length > 0, true);
});

test("builds aggregate visual map from public helper", () => {
  const input = visualInput();
  const context = normalizeExecutiveVisualReasoningContext(input);
  const result = buildExecutiveVisualReasoning(input);
  const map = buildExecutiveVisualMap(input, context);

  assert.deepEqual(map.nodes.map((node) => node.id), result.executiveMap.nodes.map((node) => node.id));
});

test("builds cause-effect map from reasoning chain", () => {
  const result = visualReasoning();

  assert.equal(result.causeEffectMap.mapType, "cause-effect");
  assert.equal(result.causeEffectMap.nodes.length, result.input.reasoning.chain.nodes.length);
  assert.equal(result.causeEffectMap.edges.every((edge) => edge.relationshipType === "causes"), true);
});

test("builds cause-effect map from public helper", () => {
  const input = visualInput();
  const result = buildExecutiveVisualReasoning(input);
  const map = buildExecutiveCauseEffectMap(input);

  assert.deepEqual(map.edges.map((edge) => edge.id), result.causeEffectMap.edges.map((edge) => edge.id));
});

test("builds decision map from judgment metadata", () => {
  const result = visualReasoning();

  assert.equal(result.decisionMap.mapType, "decision");
  assert.equal(result.decisionMap.nodes.some((node) => node.category === "confidence"), true);
  assert.equal(result.decisionMap.nodes.some((node) => node.category === "priority"), true);
});

test("builds decision map from public helper", () => {
  const input = visualInput();
  const result = buildExecutiveVisualReasoning(input);
  const map = buildExecutiveDecisionMap(input);

  assert.deepEqual(map.nodes.map((node) => node.id), result.decisionMap.nodes.map((node) => node.id));
});

test("builds tradeoff map from trade-offs tensions risks and opportunities", () => {
  const result = visualReasoning();

  assert.equal(result.tradeoffMap.mapType, "tradeoff");
  assert.equal(result.tradeoffMap.nodes.some((node) => node.category === "tradeoff"), true);
  assert.equal(result.tradeoffMap.nodes.some((node) => node.category === "tension"), true);
});

test("builds tradeoff map from public helper", () => {
  const input = visualInput();
  const result = buildExecutiveVisualReasoning(input);
  const map = buildExecutiveTradeoffMap(input);

  assert.deepEqual(map.edges.map((edge) => edge.id), result.tradeoffMap.edges.map((edge) => edge.id));
});

test("builds plan map without scheduling or workflow execution", () => {
  const result = visualReasoning();

  assert.equal(result.planMap.mapType, "plan");
  assert.equal(result.planMap.nodes.some((node) => node.category === "goal"), true);
  assert.equal(result.planMap.nodes.some((node) => node.category === "phase"), true);
  assert.equal(result.planMap.edges.some((edge) => edge.relationshipType === "sequences"), true);
});

test("builds plan map from public helper", () => {
  const input = visualInput();
  const result = buildExecutiveVisualReasoning(input);
  const map = buildExecutivePlanMap(input);

  assert.deepEqual(map.nodes.map((node) => node.id), result.planMap.nodes.map((node) => node.id));
});

test("prevents dangling edges in every visual map", () => {
  const result = visualReasoning();

  assert.equal(hasNoDanglingEdges(result.executiveMap.nodes, result.executiveMap.edges), true);
  assert.equal(hasNoDanglingEdges(result.causeEffectMap.nodes, result.causeEffectMap.edges), true);
  assert.equal(hasNoDanglingEdges(result.decisionMap.nodes, result.decisionMap.edges), true);
  assert.equal(hasNoDanglingEdges(result.tradeoffMap.nodes, result.tradeoffMap.edges), true);
  assert.equal(hasNoDanglingEdges(result.planMap.nodes, result.planMap.edges), true);
});

test("builds visual explanation", () => {
  const result = visualReasoning();

  assert.equal(result.visualExplanation.mapReasons.length, 5);
  assert.equal(result.visualExplanation.nodeReasons.length > result.visualExplanation.mapReasons.length, true);
  assert.equal(result.visualExplanation.traceReferences.includes(result.session.thoughtPartnerSessionId), true);
});

test("builds visual explanation from public helper", () => {
  const result = visualReasoning();
  const explanation = buildExecutiveVisualExplanation(
    result.session,
    result.executiveMap,
    result.causeEffectMap,
    result.decisionMap,
    result.tradeoffMap,
    result.planMap
  );

  assert.equal(explanation.explanationId, result.visualExplanation.explanationId);
  assert.deepEqual(explanation.mapReasons, result.visualExplanation.mapReasons);
});

test("validates visual reasoning result", () => {
  const result = visualReasoning();
  const validation = validateExecutiveVisualReasoning(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects dangling visual edges", () => {
  const result = visualReasoning();
  const invalid: ExecutiveVisualReasoningResult = Object.freeze({
    ...result,
    executiveMap: Object.freeze({
      ...result.executiveMap,
      edges: Object.freeze([
        Object.freeze({
          ...result.executiveMap.edges[0],
          to: "visual:missing",
        }),
      ]),
    }),
  });
  const validation = validateExecutiveVisualReasoning(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "dangling_edge"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes visual reasoning registry integrity", () => {
  const capabilities = listExecutiveVisualReasoningCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_VISUAL_REASONING_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes visual reasoning contract integrity", () => {
  assert.equal(EXECUTIVE_VISUAL_REASONING_CONTRACTS.length, 8);
  assert.equal(EXECUTIVE_VISUAL_REASONING_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public visual reasoning APIs", () => {
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveVisualReasoning, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveVisualMap, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveCauseEffectMap, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveDecisionMap, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveTradeoffMap, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutivePlanMap, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.buildExecutiveVisualExplanation, "function");
  assert.equal(typeof ExecutiveVisualReasoningEngine.validateExecutiveVisualReasoning, "function");
  assert.equal(Object.isFrozen(ExecutiveVisualReasoningEngine), true);
});

test("keeps visual reasoning immutable and render-free", () => {
  const result = visualReasoning();
  const text = [
    result.visualExplanation.narrative,
    ...result.executiveMap.nodes.map((node) => node.explanation),
    ...result.planMap.edges.map((edge) => edge.explanation),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.executiveMap.nodes), true);
  assert.equal(text.includes("render ui"), false);
  assert.equal(text.includes("animate"), false);
  assert.equal(text.includes("mutate scene"), false);
  assert.equal(text.includes("execute workflow"), false);
});
