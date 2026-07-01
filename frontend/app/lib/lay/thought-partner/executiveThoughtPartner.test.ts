import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import {
  EXECUTIVE_THOUGHT_PARTNER_CAPABILITY_REGISTRY,
  EXECUTIVE_THOUGHT_PARTNER_CONTRACTS,
  ExecutiveThoughtPartnerEngine,
  buildExecutiveAlternativeViewpoints,
  buildExecutiveCounterpoints,
  buildExecutiveDebatePaths,
  buildExecutivePerspectiveFrames,
  buildExecutiveStrategicReflections,
  buildExecutiveTensionMap,
  buildExecutiveThoughtPartner,
  buildExecutiveThoughtPartnerExplanation,
  listExecutiveThoughtPartnerCapabilities,
  normalizeExecutiveThoughtPartnerContext,
  validateExecutiveThoughtPartner,
  type ExecutiveThoughtPartnerInput,
  type ExecutiveThoughtPartnerResult,
} from "./executiveThoughtPartnerEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:thought-partner:a",
    situation: "A neutral executive thought-partner context has reasoning, judgment, planning, and coaching signals.",
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

function thoughtPartnerInput(): ExecutiveThoughtPartnerInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:thought-partner:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:thought-partner:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:thought-partner:a", reasoning, judgment, planning });

  return Object.freeze({
    sessionId: "thought-partner:session:a",
    reasoning,
    judgment,
    planning,
    coaching,
  });
}

function thoughtPartner(): ExecutiveThoughtPartnerResult {
  return buildExecutiveThoughtPartner(thoughtPartnerInput());
}

test("normalizes thought partner context with LAY-2 through LAY-5 traceability", () => {
  const input = thoughtPartnerInput();
  const context = normalizeExecutiveThoughtPartnerContext(input);

  assert.equal(context.session.phase, "LAY-6");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.judgmentSessionId, input.judgment.session.sessionId);
  assert.equal(context.session.planningSessionId, input.planning.session.sessionId);
  assert.equal(context.session.coachingSessionId, input.coaching.session.sessionId);
  assert.equal(context.traceReferences.includes(input.coaching.session.sessionId), true);
});

test("builds executive perspective frames", () => {
  const result = thoughtPartner();

  assert.equal(result.perspectives.length, 6);
  assert.equal(result.perspectives.some((perspective) => perspective.perspectiveId === "perspective:risk"), true);
  assert.equal(result.perspectives.every((perspective) => perspective.linkedReferences.length >= 4), true);
});

test("builds perspective frames from public helper", () => {
  const input = thoughtPartnerInput();
  const context = normalizeExecutiveThoughtPartnerContext(input);
  const result = buildExecutiveThoughtPartner(input);
  const frames = buildExecutivePerspectiveFrames(input, context);

  assert.deepEqual(frames.map((frame) => frame.perspectiveId), result.perspectives.map((frame) => frame.perspectiveId));
});

test("generates counterpoints", () => {
  const result = thoughtPartner();
  const counterpointIds = result.counterpoints.map((counterpoint) => counterpoint.counterpointId);

  assert.equal(counterpointIds.some((id) => id.startsWith("counterpoint:assumption:")), true);
  assert.equal(counterpointIds.some((id) => id.startsWith("counterpoint:challenge:")), true);
  assert.deepEqual(counterpointIds, [...counterpointIds].sort());
});

test("builds counterpoints from public helper", () => {
  const input = thoughtPartnerInput();
  const context = normalizeExecutiveThoughtPartnerContext(input);
  const result = buildExecutiveThoughtPartner(input);
  const counterpoints = buildExecutiveCounterpoints(input, context);

  assert.deepEqual(counterpoints.map((counterpoint) => counterpoint.counterpointId), result.counterpoints.map((counterpoint) => counterpoint.counterpointId));
});

test("generates alternative viewpoints", () => {
  const result = thoughtPartner();

  assert.equal(result.alternativeViewpoints.some((viewpoint) => viewpoint.viewpointId.startsWith("viewpoint:reasoning:")), true);
  assert.equal(result.alternativeViewpoints.some((viewpoint) => viewpoint.viewpointId.startsWith("viewpoint:priority:")), true);
  assert.equal(result.alternativeViewpoints.every((viewpoint) => viewpoint.uncertaintyNote.includes("recommendations") || viewpoint.uncertaintyNote.length > 0), true);
});

test("builds alternative viewpoints from public helper", () => {
  const input = thoughtPartnerInput();
  const result = buildExecutiveThoughtPartner(input);
  const viewpoints = buildExecutiveAlternativeViewpoints(input);

  assert.deepEqual(viewpoints.map((viewpoint) => viewpoint.viewpointId), result.alternativeViewpoints.map((viewpoint) => viewpoint.viewpointId));
});

test("builds strategic reflections", () => {
  const input = thoughtPartnerInput();
  const reflections = buildExecutiveStrategicReflections(input);

  assert.equal(reflections.length, input.coaching.reflectionPrompts.length + input.coaching.decisionQualityPrompts.length + input.coaching.planReviewPrompts.length);
  assert.equal(reflections.every((reflection) => reflection.traceReference.trim().length > 0), true);
});

test("builds debate paths", () => {
  const result = thoughtPartner();
  const debatePaths = buildExecutiveDebatePaths(result.counterpoints);

  assert.equal(debatePaths.length, result.counterpoints.length);
  assert.equal(debatePaths.every((path) => path.possibleSynthesis.includes("unresolved")), true);
});

test("maps executive tensions", () => {
  const result = thoughtPartner();

  assert.equal(result.tensionMap.length, 6);
  assert.equal(result.tensionMap.some((tension) => tension.tensionName === "speed-vs-accuracy"), true);
  assert.equal(result.tensionMap.every((tension) => tension.traceReferences.length > 0), true);
});

test("builds tension map from public helper", () => {
  const input = thoughtPartnerInput();
  const result = buildExecutiveThoughtPartner(input);
  const tensionMap = buildExecutiveTensionMap(input);

  assert.deepEqual(tensionMap.map((tension) => tension.tensionId), result.tensionMap.map((tension) => tension.tensionId));
});

test("builds thought partner explanation", () => {
  const result = thoughtPartner();

  assert.equal(result.explanation.perspectiveReasons.length, result.perspectives.length);
  assert.equal(result.explanation.counterpointReasons.length, result.counterpoints.length);
  assert.equal(result.explanation.tensionReasons.length, result.tensionMap.length);
  assert.equal(result.explanation.traceReferences.includes(result.session.coachingSessionId), true);
});

test("builds thought partner explanation from public helper", () => {
  const result = thoughtPartner();
  const explanation = buildExecutiveThoughtPartnerExplanation(result.session, result.perspectives, result.counterpoints, result.tensionMap);

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.deepEqual(explanation.tensionReasons, result.explanation.tensionReasons);
});

test("validates thought partner result", () => {
  const result = thoughtPartner();
  const validation = validateExecutiveThoughtPartner(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects invalid thought partner contracts", () => {
  const result = thoughtPartner();
  const invalid: ExecutiveThoughtPartnerResult = Object.freeze({
    ...result,
    counterpoints: Object.freeze([
      Object.freeze({
        ...result.counterpoints[0],
        statement: "",
      }),
    ]),
  });
  const validation = validateExecutiveThoughtPartner(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_counterpoint"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes thought partner registry integrity", () => {
  const capabilities = listExecutiveThoughtPartnerCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_THOUGHT_PARTNER_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes thought partner contract integrity", () => {
  assert.equal(EXECUTIVE_THOUGHT_PARTNER_CONTRACTS.length, 11);
  assert.equal(EXECUTIVE_THOUGHT_PARTNER_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public thought partner APIs", () => {
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutiveThoughtPartner, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutivePerspectiveFrames, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutiveCounterpoints, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutiveAlternativeViewpoints, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutiveTensionMap, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.buildExecutiveThoughtPartnerExplanation, "function");
  assert.equal(typeof ExecutiveThoughtPartnerEngine.validateExecutiveThoughtPartner, "function");
  assert.equal(Object.isFrozen(ExecutiveThoughtPartnerEngine), true);
});

test("keeps thought partner immutable and non-runtime", () => {
  const result = thoughtPartner();
  const text = [
    result.explanation.narrative,
    ...result.debatePaths.map((path) => path.possibleSynthesis),
    ...result.alternativeViewpoints.map((viewpoint) => viewpoint.uncertaintyNote),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.perspectives), true);
  assert.equal(text.includes("chat runtime"), false);
  assert.equal(text.includes("call llm"), false);
  assert.equal(text.includes("final recommendation"), false);
  assert.equal(text.includes("execute now"), false);
});
