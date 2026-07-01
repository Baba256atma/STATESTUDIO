import assert from "node:assert/strict";
import test from "node:test";

import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import {
  EXECUTIVE_PLANNING_CAPABILITY_REGISTRY,
  EXECUTIVE_PLANNING_CONTRACTS,
  ExecutivePlanningEngine,
  buildExecutiveGoals,
  buildExecutivePlan,
  buildExecutivePlanExplanation,
  buildExecutiveTimeline,
  listExecutivePlanningCapabilities,
  validateExecutivePlanning,
} from "./executivePlanningEngine.ts";
import type { ExecutivePlanningResult } from "./executivePlanningEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:planning:a",
    situation: "A neutral executive planning context has judgment priorities and trade-offs.",
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

function plan(): ExecutivePlanningResult {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:planning:a", reasoning });
  return buildExecutivePlan({ sessionId: "planning:session:a", judgment });
}

test("decomposes judgment priorities into goals", () => {
  const result = plan();

  assert.equal(result.goals.length, result.input.judgment.judgment.priorities.length);
  assert.equal(result.goals.every((goal) => goal.sourceJudgmentId.startsWith("priority:")), true);
});

test("builds goals from public helper", () => {
  const result = plan();
  const goals = buildExecutiveGoals(result.input.judgment);

  assert.deepEqual(goals.map((goal) => goal.goalId), result.goals.map((goal) => goal.goalId));
});

test("generates deterministic milestones", () => {
  const result = plan();

  assert.equal(result.milestones.length, result.goals.length * 2);
  assert.deepEqual(result.milestones.map((milestone) => milestone.logicalOrder), [1, 2, 3, 4, 5, 6]);
});

test("plans dependencies between goals milestones and phases", () => {
  const result = plan();

  assert.equal(result.dependencies.some((dependency) => dependency.dependencyType === "goal-to-milestone"), true);
  assert.equal(result.dependencies.some((dependency) => dependency.dependencyType === "milestone-to-milestone"), true);
  assert.equal(result.dependencies.some((dependency) => dependency.dependencyType === "phase-to-phase"), true);
});

test("creates logical execution phases", () => {
  const result = plan();

  assert.equal(result.phases.length, result.goals.length);
  assert.deepEqual(result.phases.map((phase) => phase.logicalOrder), [1, 2, 3]);
});

test("creates logical resources without real allocation", () => {
  const result = plan();

  assert.equal(result.resources.length, result.goals.length * 2);
  assert.equal(result.resources.every((resource) => resource.allocationMode === "logical-only"), true);
});

test("generates logical timeline with no dates or durations", () => {
  const result = plan();

  assert.equal(result.timeline.mode, "logical-only");
  assert.equal(result.timeline.realDatesAssigned, false);
  assert.equal(result.timeline.durationsAssigned, false);
  assert.equal(result.timeline.sequence[0].startsWith("phase:"), true);
});

test("builds timeline from public helper", () => {
  const result = plan();
  const timeline = buildExecutiveTimeline(result.session.sessionId, result.phases, result.milestones);

  assert.deepEqual(timeline.sequence, result.timeline.sequence);
});

test("builds plan explanation", () => {
  const result = plan();

  assert.equal(result.explanation.whyThisPlan[0].startsWith("Why this plan?"), true);
  assert.equal(result.explanation.whyTheseMilestones.length, result.milestones.length);
  assert.equal(result.explanation.judgmentTrace.length, result.goals.length);
});

test("builds explanation from public helper", () => {
  const result = plan();
  const explanation = buildExecutivePlanExplanation(result.session, result.goals, result.milestones, result.phases);

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.equal(explanation.narrative.includes(result.input.judgment.session.sessionId), true);
});

test("validates planning result", () => {
  const result = plan();
  const validation = validateExecutivePlanning(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects invalid timeline scheduling", () => {
  const result = plan();
  const invalid = {
    ...result,
    timeline: Object.freeze({ ...result.timeline, realDatesAssigned: true as false }),
  };
  const validation = validateExecutivePlanning(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_timeline"), true);
});

test("publishes registry integrity", () => {
  const capabilities = listExecutivePlanningCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_PLANNING_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes contract integrity", () => {
  assert.equal(EXECUTIVE_PLANNING_CONTRACTS.length, 7);
  assert.equal(EXECUTIVE_PLANNING_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutivePlanningEngine.buildExecutivePlan, "function");
  assert.equal(typeof ExecutivePlanningEngine.buildExecutiveGoals, "function");
  assert.equal(typeof ExecutivePlanningEngine.buildExecutiveTimeline, "function");
  assert.equal(typeof ExecutivePlanningEngine.buildExecutivePlanExplanation, "function");
  assert.equal(typeof ExecutivePlanningEngine.validateExecutivePlanning, "function");
  assert.equal(Object.isFrozen(ExecutivePlanningEngine), true);
});

test("keeps planning immutable and non-executing", () => {
  const result = plan();
  const text = `${result.explanation.narrative} ${result.dependencies.map((dependency) => dependency.explanation).join(" ")}`.toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.goals), true);
  assert.equal(text.includes("execute now"), false);
  assert.equal(text.includes("calendar"), false);
});
