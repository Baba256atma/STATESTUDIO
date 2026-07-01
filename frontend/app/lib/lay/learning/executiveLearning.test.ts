import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { buildExecutiveCommunication } from "../communication/executiveCommunicationEngine.ts";
import { buildExecutiveCreativity } from "../creativity/executiveCreativityEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutiveNegotiation } from "../negotiation/executiveNegotiationEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveThoughtPartner } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import { buildExecutiveVisualReasoning } from "../visual-reasoning/executiveVisualReasoningEngine.ts";
import {
  EXECUTIVE_LEARNING_CAPABILITY_REGISTRY,
  EXECUTIVE_LEARNING_CONTRACTS,
  ExecutiveLearningEngine,
  buildExecutiveCoachingReflection,
  buildExecutiveJudgmentReflection,
  buildExecutiveLearning,
  buildExecutiveLearningExplanation,
  buildExecutiveLessons,
  buildExecutivePlanReflection,
  detectExecutiveAssumptionPatterns,
  extractExecutivePatterns,
  listExecutiveLearningCapabilities,
  normalizeExecutiveLearningContext,
  validateExecutiveLearning,
  type ExecutiveLearningInput,
  type ExecutiveLearningResult,
} from "./executiveLearningEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:learning:a",
    situation: "A neutral executive learning context has reusable metadata patterns across prior LAY outputs.",
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

function learningInput(): ExecutiveLearningInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:learning:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:learning:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:learning:a", reasoning, judgment, planning });
  const thoughtPartner = buildExecutiveThoughtPartner({ sessionId: "thought-partner:learning:a", reasoning, judgment, planning, coaching });
  const visualReasoning = buildExecutiveVisualReasoning({ sessionId: "visual:learning:a", reasoning, judgment, planning, coaching, thoughtPartner });
  const communication = buildExecutiveCommunication({ sessionId: "communication:learning:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning });
  const negotiation = buildExecutiveNegotiation({ sessionId: "negotiation:learning:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication });
  const creativity = buildExecutiveCreativity({ sessionId: "creativity:learning:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication, negotiation });

  return Object.freeze({ sessionId: "learning:session:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication, negotiation, creativity });
}

function learning(): ExecutiveLearningResult {
  return buildExecutiveLearning(learningInput());
}

test("normalizes learning context with LAY-2 through LAY-10 traceability", () => {
  const input = learningInput();
  const context = normalizeExecutiveLearningContext(input);

  assert.equal(context.session.phase, "LAY-11");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.creativitySessionId, input.creativity.session.sessionId);
  assert.equal(context.traceReferences.includes(input.creativity.session.sessionId), true);
});

test("extracts reusable learning patterns", () => {
  const result = learning();
  const types = new Set(result.patterns.map((pattern) => pattern.patternType));

  assert.equal(types.has("assumption"), true);
  assert.equal(types.has("constraint"), true);
  assert.equal(types.has("risk"), true);
  assert.equal(types.has("reframe"), true);
});

test("extracts patterns from public helper", () => {
  const input = learningInput();
  const context = normalizeExecutiveLearningContext(input);
  const result = buildExecutiveLearning(input);
  const patterns = extractExecutivePatterns(context);

  assert.deepEqual(patterns.map((pattern) => pattern.patternId), result.patterns.map((pattern) => pattern.patternId));
});

test("detects repeated assumption patterns", () => {
  const result = learning();

  assert.equal(result.assumptionPatterns.length, result.input.reasoning.components.assumptions.length);
  assert.equal(result.assumptionPatterns.every((pattern) => pattern.occurrenceCount === pattern.sourceReferences.length), true);
});

test("detects assumption patterns from public helper", () => {
  const input = learningInput();
  const result = buildExecutiveLearning(input);
  const patterns = detectExecutiveAssumptionPatterns(input);

  assert.deepEqual(patterns.map((pattern) => pattern.assumptionPatternId), result.assumptionPatterns.map((pattern) => pattern.assumptionPatternId));
});

test("builds judgment reflection", () => {
  const result = learning();

  assert.equal(result.judgmentReflection.priorityCount, result.input.judgment.judgment.priorities.length);
  assert.equal(result.judgmentReflection.sourceReferences.includes(result.input.judgment.session.sessionId), true);
});

test("builds judgment reflection from public helper", () => {
  const input = learningInput();
  const result = buildExecutiveLearning(input);
  const reflection = buildExecutiveJudgmentReflection(input);

  assert.equal(reflection.reflectionId, result.judgmentReflection.reflectionId);
});

test("builds plan reflection", () => {
  const result = learning();

  assert.equal(result.planReflection.goalCount, result.input.planning.goals.length);
  assert.equal(result.planReflection.dependencyCount, result.input.planning.dependencies.length);
});

test("builds plan reflection from public helper", () => {
  const input = learningInput();
  const result = buildExecutiveLearning(input);
  const reflection = buildExecutivePlanReflection(input);

  assert.equal(reflection.reflectionId, result.planReflection.reflectionId);
});

test("builds coaching reflection", () => {
  const result = learning();

  assert.equal(result.coachingReflection.questionCount, result.input.coaching.questions.length);
  assert.equal(result.coachingReflection.blindSpotCount, result.input.coaching.blindSpots.length);
});

test("builds coaching reflection from public helper", () => {
  const input = learningInput();
  const result = buildExecutiveLearning(input);
  const reflection = buildExecutiveCoachingReflection(input);

  assert.equal(reflection.reflectionId, result.coachingReflection.reflectionId);
});

test("builds reusable lessons without memory mutation", () => {
  const result = learning();

  assert.equal(result.lessons.length > result.patterns.length, true);
  assert.equal(result.lessons.every((lesson) => lesson.memoryMutation === false), true);
});

test("builds lessons from public helper", () => {
  const result = learning();
  const lessons = buildExecutiveLessons(result.patterns, result.assumptionPatterns, result.judgmentReflection, result.planReflection, result.coachingReflection);

  assert.deepEqual(lessons.map((lesson) => lesson.lessonId), result.lessons.map((lesson) => lesson.lessonId));
});

test("builds learning explanation", () => {
  const result = learning();

  assert.equal(result.explanation.patternReasons.length, result.patterns.length);
  assert.equal(result.explanation.lessonReasons.length, result.lessons.length);
  assert.equal(result.explanation.traceReferences.includes(result.session.creativitySessionId), true);
});

test("builds learning explanation from public helper", () => {
  const result = learning();
  const explanation = buildExecutiveLearningExplanation(
    result.session,
    result.patterns,
    result.assumptionPatterns,
    result.judgmentReflection,
    result.planReflection,
    result.coachingReflection,
    result.lessons
  );

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.deepEqual(explanation.lessonReasons, result.explanation.lessonReasons);
});

test("preserves full source traceability", () => {
  const result = learning();

  assert.equal(result.context.traceReferences.includes(result.session.reasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.judgmentSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.planningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.coachingSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.thoughtPartnerSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.visualReasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.communicationSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.negotiationSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.creativitySessionId), true);
});

test("validates learning result", () => {
  const result = learning();
  const validation = validateExecutiveLearning(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("detects invalid learning contracts", () => {
  const result = learning();
  const invalid: ExecutiveLearningResult = Object.freeze({
    ...result,
    lessons: Object.freeze([Object.freeze({ ...result.lessons[0], memoryMutation: true as false })]),
  });
  const validation = validateExecutiveLearning(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_lesson"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes learning registry and contracts", () => {
  const capabilities = listExecutiveLearningCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_LEARNING_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(EXECUTIVE_LEARNING_CONTRACTS.length, 11);
  assert.equal(EXECUTIVE_LEARNING_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public learning APIs", () => {
  assert.equal(typeof ExecutiveLearningEngine.buildExecutiveLearning, "function");
  assert.equal(typeof ExecutiveLearningEngine.extractExecutivePatterns, "function");
  assert.equal(typeof ExecutiveLearningEngine.detectExecutiveAssumptionPatterns, "function");
  assert.equal(typeof ExecutiveLearningEngine.buildExecutiveJudgmentReflection, "function");
  assert.equal(typeof ExecutiveLearningEngine.buildExecutivePlanReflection, "function");
  assert.equal(typeof ExecutiveLearningEngine.buildExecutiveCoachingReflection, "function");
  assert.equal(typeof ExecutiveLearningEngine.buildExecutiveLessons, "function");
  assert.equal(typeof ExecutiveLearningEngine.validateExecutiveLearning, "function");
  assert.equal(Object.isFrozen(ExecutiveLearningEngine), true);
});

test("keeps learning immutable and metadata-only", () => {
  const result = learning();
  const text = [
    result.explanation.narrative,
    ...result.lessons.map((lesson) => lesson.explanation),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.lessons), true);
  assert.equal(text.includes("memory mutation"), false);
  assert.equal(text.includes("train model"), false);
  assert.equal(text.includes("user profile"), false);
  assert.equal(text.includes("recommendation"), false);
});
