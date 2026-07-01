import assert from "node:assert/strict";
import test from "node:test";

import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import {
  EXECUTIVE_COACHING_CAPABILITY_REGISTRY,
  EXECUTIVE_COACHING_CONTRACTS,
  ExecutiveCoachingEngine,
  buildExecutiveAssumptionChallenges,
  buildExecutiveClarifyingQuestions,
  buildExecutiveCoaching,
  buildExecutiveCoachingExplanation,
  buildExecutiveDecisionQualityPrompts,
  buildExecutivePlanReviewPrompts,
  buildExecutiveReflectionPrompts,
  detectExecutiveBlindSpots,
  listExecutiveCoachingCapabilities,
  normalizeExecutiveCoachingContext,
  validateExecutiveCoaching,
  type ExecutiveCoachingInput,
  type ExecutiveCoachingResult,
} from "./executiveCoachingEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:coaching:a",
    situation: "A neutral executive coaching context has assumptions, constraints, priorities, and planning dependencies.",
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

function coachingInput(): ExecutiveCoachingInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:coaching:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:coaching:a", judgment });

  return Object.freeze({
    sessionId: "coaching:session:a",
    reasoning,
    judgment,
    planning,
  });
}

function coaching(): ExecutiveCoachingResult {
  return buildExecutiveCoaching(coachingInput());
}

test("normalizes coaching context with LAY-2 through LAY-4 traceability", () => {
  const input = coachingInput();
  const context = normalizeExecutiveCoachingContext(input);

  assert.equal(context.session.phase, "LAY-5");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.judgmentSessionId, input.judgment.session.sessionId);
  assert.equal(context.session.planningSessionId, input.planning.session.sessionId);
  assert.deepEqual(context.assumptionIds, ["assumption:capacity"]);
});

test("generates deterministic clarifying questions", () => {
  const result = coaching();
  const questionIds = result.questions.map((question) => question.questionId);

  assert.equal(result.questions.some((question) => question.sourceType === "assumption"), true);
  assert.equal(result.questions.some((question) => question.sourceType === "constraint"), true);
  assert.equal(result.questions.some((question) => question.sourceType === "goal"), true);
  assert.deepEqual(questionIds, [...questionIds].sort());
});

test("builds clarifying questions from public helper", () => {
  const input = coachingInput();
  const context = normalizeExecutiveCoachingContext(input);
  const result = buildExecutiveCoaching(input);
  const questions = buildExecutiveClarifyingQuestions(input, context);

  assert.deepEqual(questions.map((question) => question.questionId), result.questions.map((question) => question.questionId));
});

test("generates assumption challenges", () => {
  const result = coaching();

  assert.equal(result.challenges.length, 1);
  assert.equal(result.challenges[0].challengedAssumptionId, "assumption:capacity");
  assert.equal(result.challenges[0].relatedRisk.startsWith("risk:"), true);
});

test("builds assumption challenges from public helper", () => {
  const input = coachingInput();
  const result = buildExecutiveCoaching(input);
  const challenges = buildExecutiveAssumptionChallenges(input);

  assert.deepEqual(challenges.map((challenge) => challenge.challengeId), result.challenges.map((challenge) => challenge.challengeId));
});

test("detects executive blind spots", () => {
  const result = coaching();
  const categories = result.blindSpots.map((blindSpot) => blindSpot.category);

  assert.equal(categories.includes("stakeholder"), true);
  assert.equal(categories.includes("confidence"), true);
  assert.equal(categories.includes("dependency"), true);
});

test("detects blind spots from public helper", () => {
  const input = coachingInput();
  const result = buildExecutiveCoaching(input);
  const blindSpots = detectExecutiveBlindSpots(input);

  assert.deepEqual(blindSpots.map((blindSpot) => blindSpot.blindSpotId), result.blindSpots.map((blindSpot) => blindSpot.blindSpotId));
});

test("builds reflection prompts", () => {
  const result = coaching();
  const prompts = buildExecutiveReflectionPrompts(result.context);

  assert.deepEqual(prompts.map((prompt) => prompt.promptId), result.reflectionPrompts.map((prompt) => prompt.promptId));
  assert.equal(result.reflectionPrompts[0].sourceId, "assumption:capacity");
});

test("builds decision quality prompts", () => {
  const input = coachingInput();
  const prompts = buildExecutiveDecisionQualityPrompts(input);

  assert.equal(prompts.length, input.judgment.judgment.priorities.length);
  assert.equal(prompts.every((prompt) => prompt.traceReference === input.judgment.session.sessionId), true);
});

test("builds plan review prompts", () => {
  const input = coachingInput();
  const prompts = buildExecutivePlanReviewPrompts(input);

  assert.equal(prompts.length, input.planning.goals.length);
  assert.equal(prompts.every((prompt) => prompt.traceReference === input.planning.session.sessionId), true);
});

test("builds coaching explanation", () => {
  const result = coaching();

  assert.equal(result.explanation.questionReasons.length, result.questions.length);
  assert.equal(result.explanation.challengeReasons.length, result.challenges.length);
  assert.equal(result.explanation.blindSpotReasons.length, result.blindSpots.length);
  assert.equal(result.explanation.narrative.length > 0, true);
});

test("builds coaching explanation from public helper", () => {
  const result = coaching();
  const explanation = buildExecutiveCoachingExplanation(result.session, result.questions, result.challenges, result.blindSpots);

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.deepEqual(explanation.traceReferences, result.explanation.traceReferences);
});

test("validates coaching results", () => {
  const result = coaching();
  const validation = validateExecutiveCoaching(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects incomplete coaching contracts", () => {
  const result = coaching();
  const invalid: ExecutiveCoachingResult = Object.freeze({
    ...result,
    questions: Object.freeze([
      Object.freeze({
        ...result.questions[0],
        prompt: "",
      }),
    ]),
  });
  const validation = validateExecutiveCoaching(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_question"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes coaching registry integrity", () => {
  const capabilities = listExecutiveCoachingCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_COACHING_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes coaching contract integrity", () => {
  assert.equal(EXECUTIVE_COACHING_CONTRACTS.length, 9);
  assert.equal(EXECUTIVE_COACHING_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public coaching APIs", () => {
  assert.equal(typeof ExecutiveCoachingEngine.buildExecutiveCoaching, "function");
  assert.equal(typeof ExecutiveCoachingEngine.buildExecutiveClarifyingQuestions, "function");
  assert.equal(typeof ExecutiveCoachingEngine.buildExecutiveAssumptionChallenges, "function");
  assert.equal(typeof ExecutiveCoachingEngine.detectExecutiveBlindSpots, "function");
  assert.equal(typeof ExecutiveCoachingEngine.buildExecutiveCoachingExplanation, "function");
  assert.equal(typeof ExecutiveCoachingEngine.validateExecutiveCoaching, "function");
  assert.equal(Object.isFrozen(ExecutiveCoachingEngine), true);
});

test("keeps coaching immutable and non-runtime", () => {
  const result = coaching();
  const text = [
    result.explanation.narrative,
    ...result.questions.map((question) => question.prompt),
    ...result.challenges.map((challenge) => challenge.coachingIntent),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.questions), true);
  assert.equal(text.includes("login"), false);
  assert.equal(text.includes("token"), false);
  assert.equal(text.includes("execute now"), false);
  assert.equal(text.includes("call llm"), false);
});
