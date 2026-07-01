import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { buildExecutiveCommunication } from "../communication/executiveCommunicationEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutiveNegotiation } from "../negotiation/executiveNegotiationEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveThoughtPartner } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import { buildExecutiveVisualReasoning } from "../visual-reasoning/executiveVisualReasoningEngine.ts";
import {
  EXECUTIVE_CREATIVITY_CAPABILITY_REGISTRY,
  EXECUTIVE_CREATIVITY_CONTRACTS,
  ExecutiveCreativityEngine,
  buildExecutiveCreativity,
  buildExecutiveCreativityExplanation,
  buildExecutiveInnovationPaths,
  buildExecutiveReframes,
  buildExecutiveStrategicAngles,
  discoverExecutiveOpportunities,
  generateExecutiveAlternatives,
  listExecutiveCreativityCapabilities,
  normalizeExecutiveCreativityContext,
  reframeExecutiveConstraints,
  validateExecutiveCreativity,
  type ExecutiveCreativityInput,
  type ExecutiveCreativityResult,
} from "./executiveCreativityEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:creativity:a",
    situation: "A neutral executive creativity context has assumptions, constraints, tensions, risks, opportunities, and negotiation conflicts.",
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

function creativityInput(): ExecutiveCreativityInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:creativity:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:creativity:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:creativity:a", reasoning, judgment, planning });
  const thoughtPartner = buildExecutiveThoughtPartner({ sessionId: "thought-partner:creativity:a", reasoning, judgment, planning, coaching });
  const visualReasoning = buildExecutiveVisualReasoning({ sessionId: "visual:creativity:a", reasoning, judgment, planning, coaching, thoughtPartner });
  const communication = buildExecutiveCommunication({ sessionId: "communication:creativity:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning });
  const negotiation = buildExecutiveNegotiation({ sessionId: "negotiation:creativity:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication });

  return Object.freeze({ sessionId: "creativity:session:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication, negotiation });
}

function creativity(): ExecutiveCreativityResult {
  return buildExecutiveCreativity(creativityInput());
}

test("normalizes creativity context with LAY-2 through LAY-9 traceability", () => {
  const input = creativityInput();
  const context = normalizeExecutiveCreativityContext(input);

  assert.equal(context.session.phase, "LAY-10");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.negotiationSessionId, input.negotiation.session.sessionId);
  assert.equal(context.traceReferences.includes(input.negotiation.session.sessionId), true);
});

test("generates reframes from source categories", () => {
  const result = creativity();
  const types = new Set(result.reframes.map((reframe) => reframe.sourceType));

  assert.equal(types.has("assumption"), true);
  assert.equal(types.has("constraint"), true);
  assert.equal(types.has("tension"), true);
  assert.equal(types.has("conflict"), true);
});

test("builds reframes from public helper", () => {
  const input = creativityInput();
  const context = normalizeExecutiveCreativityContext(input);
  const result = buildExecutiveCreativity(input);
  const reframes = buildExecutiveReframes(context);

  assert.deepEqual(reframes.map((reframe) => reframe.reframeId), result.reframes.map((reframe) => reframe.reframeId));
});

test("generates creative alternatives without selection", () => {
  const result = creativity();

  assert.equal(result.alternatives.length >= 4, true);
  assert.equal(result.alternatives.every((alternative) => alternative.selectionState === "not-selected"), true);
});

test("generates alternatives from public helper", () => {
  const result = creativity();
  const alternatives = generateExecutiveAlternatives(result.reframes);

  assert.deepEqual(alternatives.map((alternative) => alternative.alternativeId), result.alternatives.map((alternative) => alternative.alternativeId));
});

test("discovers generic opportunities", () => {
  const result = creativity();

  assert.equal(result.opportunities.length >= 3, true);
  assert.equal(result.opportunities.every((opportunity) => opportunity.domainSpecific === false), true);
});

test("discovers opportunities from public helper", () => {
  const input = creativityInput();
  const context = normalizeExecutiveCreativityContext(input);
  const result = buildExecutiveCreativity(input);
  const opportunities = discoverExecutiveOpportunities(context);

  assert.deepEqual(opportunities.map((opportunity) => opportunity.opportunityIdeaId), result.opportunities.map((opportunity) => opportunity.opportunityIdeaId));
});

test("reframes constraints as design inputs", () => {
  const result = creativity();

  assert.equal(result.constraintReframes.length, result.context.constraintIds.length);
  assert.equal(result.constraintReframes.every((constraint) => constraint.blockerState === "reframed-as-input"), true);
});

test("reframes constraints from public helper", () => {
  const result = creativity();
  const constraints = reframeExecutiveConstraints(result.context);

  assert.deepEqual(constraints.map((constraint) => constraint.constraintReframeId), result.constraintReframes.map((constraint) => constraint.constraintReframeId));
});

test("builds strategic angles", () => {
  const result = creativity();

  assert.equal(result.strategicAngles.length, result.alternatives.length);
  assert.equal(result.strategicAngles.every((angle) => angle.explanation.includes("without recommending")), true);
});

test("builds strategic angles from public helper", () => {
  const result = creativity();
  const angles = buildExecutiveStrategicAngles(result.alternatives, result.opportunities);

  assert.deepEqual(angles.map((angle) => angle.angleId), result.strategicAngles.map((angle) => angle.angleId));
});

test("builds conceptual innovation paths", () => {
  const result = creativity();

  assert.equal(result.innovationPaths.length, result.alternatives.length);
  assert.equal(result.innovationPaths.every((path) => path.conceptualOnly), true);
});

test("builds innovation paths from public helper", () => {
  const result = creativity();
  const paths = buildExecutiveInnovationPaths(result.reframes, result.alternatives, result.opportunities, result.constraintReframes);

  assert.deepEqual(paths.map((path) => path.pathId), result.innovationPaths.map((path) => path.pathId));
});

test("builds creativity explanation", () => {
  const result = creativity();

  assert.equal(result.explanation.reframeReasons.length, result.reframes.length);
  assert.equal(result.explanation.pathReasons.length, result.innovationPaths.length);
  assert.equal(result.explanation.traceReferences.includes(result.session.negotiationSessionId), true);
});

test("builds creativity explanation from public helper", () => {
  const result = creativity();
  const explanation = buildExecutiveCreativityExplanation(
    result.session,
    result.reframes,
    result.alternatives,
    result.opportunities,
    result.constraintReframes,
    result.strategicAngles,
    result.innovationPaths
  );

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.deepEqual(explanation.pathReasons, result.explanation.pathReasons);
});

test("preserves full source traceability", () => {
  const result = creativity();

  assert.equal(result.context.traceReferences.includes(result.session.reasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.judgmentSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.planningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.coachingSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.thoughtPartnerSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.visualReasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.communicationSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.negotiationSessionId), true);
});

test("validates creativity result", () => {
  const result = creativity();
  const validation = validateExecutiveCreativity(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("detects invalid creativity contracts", () => {
  const result = creativity();
  const invalid: ExecutiveCreativityResult = Object.freeze({
    ...result,
    alternatives: Object.freeze([Object.freeze({ ...result.alternatives[0], selectionState: "selected" as "not-selected" })]),
  });
  const validation = validateExecutiveCreativity(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_alternative"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes creativity registry and contracts", () => {
  const capabilities = listExecutiveCreativityCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_CREATIVITY_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(EXECUTIVE_CREATIVITY_CONTRACTS.length, 11);
  assert.equal(EXECUTIVE_CREATIVITY_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public creativity APIs", () => {
  assert.equal(typeof ExecutiveCreativityEngine.buildExecutiveCreativity, "function");
  assert.equal(typeof ExecutiveCreativityEngine.buildExecutiveReframes, "function");
  assert.equal(typeof ExecutiveCreativityEngine.generateExecutiveAlternatives, "function");
  assert.equal(typeof ExecutiveCreativityEngine.discoverExecutiveOpportunities, "function");
  assert.equal(typeof ExecutiveCreativityEngine.reframeExecutiveConstraints, "function");
  assert.equal(typeof ExecutiveCreativityEngine.buildExecutiveStrategicAngles, "function");
  assert.equal(typeof ExecutiveCreativityEngine.buildExecutiveInnovationPaths, "function");
  assert.equal(typeof ExecutiveCreativityEngine.validateExecutiveCreativity, "function");
  assert.equal(Object.isFrozen(ExecutiveCreativityEngine), true);
});

test("keeps creativity immutable and metadata-only", () => {
  const result = creativity();
  const text = [
    result.explanation.narrative,
    ...result.innovationPaths.map((path) => path.explanation),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.reframes), true);
  assert.equal(text.includes("final recommendation"), false);
  assert.equal(text.includes("execute"), false);
  assert.equal(text.includes("call llm"), false);
  assert.equal(text.includes("learning update"), false);
});
