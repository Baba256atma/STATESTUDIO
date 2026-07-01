import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { buildExecutiveCommunication } from "../communication/executiveCommunicationEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveThoughtPartner } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import { buildExecutiveVisualReasoning } from "../visual-reasoning/executiveVisualReasoningEngine.ts";
import {
  EXECUTIVE_NEGOTIATION_CAPABILITY_REGISTRY,
  EXECUTIVE_NEGOTIATION_CONTRACTS,
  ExecutiveNegotiationEngine,
  analyzeExecutiveInterests,
  analyzeExecutiveLeverage,
  buildExecutiveNegotiation,
  buildExecutiveNegotiationExplanation,
  buildExecutiveNegotiationPaths,
  detectExecutiveConflictZones,
  listExecutiveNegotiationCapabilities,
  mapExecutiveConcessions,
  mapExecutiveStakeholderPositions,
  normalizeExecutiveNegotiationContext,
  validateExecutiveNegotiation,
  type ExecutiveNegotiationInput,
  type ExecutiveNegotiationResult,
} from "./executiveNegotiationEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:negotiation:a",
    situation: "A neutral executive negotiation context has stakeholders, risks, opportunities, constraints, and plan goals.",
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

function negotiationInput(): ExecutiveNegotiationInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:negotiation:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:negotiation:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:negotiation:a", reasoning, judgment, planning });
  const thoughtPartner = buildExecutiveThoughtPartner({ sessionId: "thought-partner:negotiation:a", reasoning, judgment, planning, coaching });
  const visualReasoning = buildExecutiveVisualReasoning({ sessionId: "visual:negotiation:a", reasoning, judgment, planning, coaching, thoughtPartner });
  const communication = buildExecutiveCommunication({ sessionId: "communication:negotiation:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning });

  return Object.freeze({ sessionId: "negotiation:session:a", reasoning, judgment, planning, coaching, thoughtPartner, visualReasoning, communication });
}

function negotiation(): ExecutiveNegotiationResult {
  return buildExecutiveNegotiation(negotiationInput());
}

test("normalizes negotiation context with LAY-2 through LAY-8 traceability", () => {
  const input = negotiationInput();
  const context = normalizeExecutiveNegotiationContext(input);

  assert.equal(context.session.phase, "LAY-9");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.communicationSessionId, input.communication.session.sessionId);
  assert.equal(context.stakeholderIds.length, input.communication.audienceFrames.length);
  assert.equal(context.traceReferences.includes(input.communication.session.sessionId), true);
});

test("maps stakeholder positions without real identities", () => {
  const result = negotiation();

  assert.equal(result.stakeholderPositions.length, result.input.communication.audienceFrames.length);
  assert.equal(result.stakeholderPositions.every((position) => position.stakeholderId.startsWith("stakeholder:")), true);
});

test("maps stakeholder positions from public helper", () => {
  const input = negotiationInput();
  const context = normalizeExecutiveNegotiationContext(input);
  const result = buildExecutiveNegotiation(input);
  const positions = mapExecutiveStakeholderPositions(input, context);

  assert.deepEqual(positions.map((position) => position.stakeholderId), result.stakeholderPositions.map((position) => position.stakeholderId));
});

test("analyzes interests separately from positions", () => {
  const result = negotiation();

  assert.equal(result.interests.length, result.stakeholderPositions.length);
  assert.equal(result.interests.every((interest) => interest.contrastedPosition.length > 0), true);
});

test("analyzes interests from public helper", () => {
  const result = negotiation();
  const interests = analyzeExecutiveInterests(result.stakeholderPositions);

  assert.deepEqual(interests.map((interest) => interest.interestId), result.interests.map((interest) => interest.interestId));
});

test("analyzes leverage from multiple source types", () => {
  const result = negotiation();
  const types = new Set(result.leveragePoints.map((leverage) => leverage.leverageType));

  assert.equal(types.has("risk"), true);
  assert.equal(types.has("opportunity"), true);
  assert.equal(types.has("constraint"), true);
  assert.equal(types.has("communication"), true);
});

test("analyzes leverage from public helper", () => {
  const input = negotiationInput();
  const context = normalizeExecutiveNegotiationContext(input);
  const result = buildExecutiveNegotiation(input);
  const leverage = analyzeExecutiveLeverage(input, context);

  assert.deepEqual(leverage.map((point) => point.leverageId), result.leveragePoints.map((point) => point.leverageId));
});

test("maps concession candidates without recommendations", () => {
  const result = negotiation();

  assert.equal(result.concessionCandidates.length >= 3, true);
  assert.equal(result.concessionCandidates.every((candidate) => candidate.explanation.includes("not a recommendation")), true);
});

test("maps concessions from public helper", () => {
  const result = negotiation();
  const concessions = mapExecutiveConcessions(result.leveragePoints, result.context);

  assert.deepEqual(concessions.map((candidate) => candidate.concessionId), result.concessionCandidates.map((candidate) => candidate.concessionId));
});

test("detects conflict zones", () => {
  const result = negotiation();

  assert.equal(result.conflictZones.length, result.stakeholderPositions.length - 1);
  assert.equal(result.conflictZones.every((zone) => zone.sourceReferences.length === 2), true);
});

test("detects conflict zones from public helper", () => {
  const result = negotiation();
  const zones = detectExecutiveConflictZones(result.stakeholderPositions);

  assert.deepEqual(zones.map((zone) => zone.conflictZoneId), result.conflictZones.map((zone) => zone.conflictZoneId));
});

test("generates possible negotiation paths without choosing a final path", () => {
  const result = negotiation();

  assert.equal(result.negotiationPaths.length, result.conflictZones.length);
  assert.equal(result.negotiationPaths.every((path) => path.explanation.includes("does not choose")), true);
});

test("builds negotiation paths from public helper", () => {
  const result = negotiation();
  const paths = buildExecutiveNegotiationPaths(result.leveragePoints, result.concessionCandidates, result.conflictZones);

  assert.deepEqual(paths.map((path) => path.pathId), result.negotiationPaths.map((path) => path.pathId));
});

test("builds negotiation explanation", () => {
  const result = negotiation();

  assert.equal(result.explanation.positionReasons.length, result.stakeholderPositions.length);
  assert.equal(result.explanation.pathReasons.length, result.negotiationPaths.length);
  assert.equal(result.explanation.traceReferences.includes(result.session.communicationSessionId), true);
});

test("builds negotiation explanation from public helper", () => {
  const result = negotiation();
  const explanation = buildExecutiveNegotiationExplanation(
    result.session,
    result.stakeholderPositions,
    result.interests,
    result.leveragePoints,
    result.concessionCandidates,
    result.conflictZones,
    result.negotiationPaths
  );

  assert.equal(explanation.explanationId, result.explanation.explanationId);
  assert.deepEqual(explanation.pathReasons, result.explanation.pathReasons);
});

test("preserves full source traceability", () => {
  const result = negotiation();

  assert.equal(result.context.traceReferences.includes(result.session.reasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.judgmentSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.planningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.coachingSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.thoughtPartnerSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.visualReasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.communicationSessionId), true);
});

test("validates negotiation result", () => {
  const result = negotiation();
  const validation = validateExecutiveNegotiation(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("detects invalid negotiation contracts", () => {
  const result = negotiation();
  const invalid: ExecutiveNegotiationResult = Object.freeze({
    ...result,
    stakeholderPositions: Object.freeze([Object.freeze({ ...result.stakeholderPositions[0], statedPosition: "" })]),
  });
  const validation = validateExecutiveNegotiation(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_position"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_explanation"), true);
});

test("publishes negotiation registry and contracts", () => {
  const capabilities = listExecutiveNegotiationCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_NEGOTIATION_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(EXECUTIVE_NEGOTIATION_CONTRACTS.length, 11);
  assert.equal(EXECUTIVE_NEGOTIATION_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public negotiation APIs", () => {
  assert.equal(typeof ExecutiveNegotiationEngine.buildExecutiveNegotiation, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.mapExecutiveStakeholderPositions, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.analyzeExecutiveInterests, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.analyzeExecutiveLeverage, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.mapExecutiveConcessions, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.detectExecutiveConflictZones, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.buildExecutiveNegotiationPaths, "function");
  assert.equal(typeof ExecutiveNegotiationEngine.validateExecutiveNegotiation, "function");
  assert.equal(Object.isFrozen(ExecutiveNegotiationEngine), true);
});

test("keeps negotiation immutable and non-autonomous", () => {
  const result = negotiation();
  const text = [
    result.explanation.narrative,
    ...result.negotiationPaths.map((path) => path.explanation),
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.negotiationPaths), true);
  assert.equal(text.includes("send message"), false);
  assert.equal(text.includes("autonomous negotiation"), false);
  assert.equal(text.includes("legal advice"), false);
  assert.equal(text.includes("final recommendation"), false);
});
