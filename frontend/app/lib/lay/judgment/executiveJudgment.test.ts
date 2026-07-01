import assert from "node:assert/strict";
import test from "node:test";

import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import {
  EXECUTIVE_JUDGMENT_CAPABILITY_REGISTRY,
  EXECUTIVE_JUDGMENT_CONTRACTS,
  ExecutiveJudgmentEngine,
  analyzeExecutiveJudgment,
  buildExecutiveRationale,
  evaluateExecutivePriorities,
  listExecutiveJudgmentCapabilities,
  validateExecutiveJudgment,
} from "./executiveJudgmentEngine.ts";
import type { ExecutiveJudgmentResult } from "./executiveJudgmentEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:judgment:a",
    situation: "A neutral executive context has alternatives, risks, opportunities, and trade-offs.",
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

function judgment(): ExecutiveJudgmentResult {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  return analyzeExecutiveJudgment({ sessionId: "judgment:session:a", reasoning });
}

test("evaluates alternatives", () => {
  const result = judgment();

  assert.equal(result.judgment.alternativeEvaluations.length, 2);
  assert.equal(result.judgment.alternativeEvaluations.every((evaluation) => evaluation.judgment === "moderate"), true);
});

test("evaluates trade-offs", () => {
  const result = judgment();

  assert.equal(result.judgment.tradeoffJudgments.length, 1);
  assert.equal(result.judgment.tradeoffJudgments[0].tradeoffId, "tradeoff:scope:quality");
  assert.equal(result.judgment.tradeoffJudgments[0].judgment, "high");
});

test("evaluates deterministic priorities", () => {
  const result = judgment();

  assert.deepEqual(result.judgment.priorities.map((priority) => priority.order), [1, 2, 3]);
  assert.equal(result.judgment.priorities[0].basis.includes("tradeoff"), true);
});

test("generates confidence metadata", () => {
  const result = judgment();

  assert.equal(result.judgment.confidence.level, "high");
  assert.equal(result.judgment.confidence.reasoningCompleteness, 1);
  assert.equal(result.judgment.confidence.evidenceCoverage, 1);
});

test("generates executive rationale", () => {
  const result = judgment();

  assert.equal(result.rationale.whyThisJudgment[0].startsWith("Why this judgment?"), true);
  assert.equal(result.rationale.evidence.length > 0, true);
  assert.equal(result.rationale.assumptions.length, 1);
  assert.equal(result.rationale.constraints.length, 1);
});

test("builds rationale from public helper", () => {
  const result = judgment();
  const rationale = buildExecutiveRationale(result.session.sessionId, result.input.reasoning, result.judgment);

  assert.equal(rationale.rationaleId, result.rationale.rationaleId);
  assert.equal(rationale.narrative.includes("recommend"), false);
});

test("validates judgment", () => {
  const result = judgment();
  const validation = validateExecutiveJudgment(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects incomplete rationale", () => {
  const result = judgment();
  const invalid = {
    ...result,
    rationale: Object.freeze({ ...result.rationale, assumptions: Object.freeze([]) }),
  };
  const validation = validateExecutiveJudgment(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_rationale"), true);
});

test("publishes registry integrity", () => {
  const capabilities = listExecutiveJudgmentCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_JUDGMENT_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes contract integrity", () => {
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACTS.length, 6);
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutiveJudgmentEngine.analyzeExecutiveJudgment, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.evaluateExecutivePriorities, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.buildExecutiveRationale, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.validateExecutiveJudgment, "function");
  assert.equal(Object.isFrozen(ExecutiveJudgmentEngine), true);
});

test("keeps judgment immutable", () => {
  const result = judgment();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.judgment.alternativeEvaluations), true);
  assert.equal(Object.isFrozen(result.judgment.priorities), true);
});

test("does not produce plans or recommendations", () => {
  const result = judgment();
  const text = `${result.rationale.narrative} ${result.judgment.priorities.map((priority) => priority.justification).join(" ")}`.toLowerCase();

  assert.equal(text.includes("schedule"), false);
  assert.equal(text.includes("recommend"), false);
});

test("priority helper remains deterministic", () => {
  const result = judgment();
  const rebuilt = evaluateExecutivePriorities(result.judgment.alternativeEvaluations, result.judgment.tradeoffJudgments);

  assert.deepEqual(rebuilt.map((priority) => priority.id), result.judgment.priorities.map((priority) => priority.id));
});
