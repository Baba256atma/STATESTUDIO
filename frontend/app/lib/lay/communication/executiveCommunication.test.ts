import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveCoaching } from "../coaching/executiveCoachingEngine.ts";
import { analyzeExecutiveJudgment } from "../judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "../planning/executivePlanningEngine.ts";
import { analyzeExecutiveReasoning, type ExecutiveReasoningInput } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveThoughtPartner } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import { buildExecutiveVisualReasoning } from "../visual-reasoning/executiveVisualReasoningEngine.ts";
import {
  EXECUTIVE_COMMUNICATION_AUDIENCES,
  EXECUTIVE_COMMUNICATION_CAPABILITY_REGISTRY,
  EXECUTIVE_COMMUNICATION_CONTRACTS,
  ExecutiveCommunicationEngine,
  buildExecutiveAudienceFrame,
  buildExecutiveBriefing,
  buildExecutiveCommunication,
  buildExecutivePlanCommunication,
  buildExecutiveRiskCommunication,
  buildExecutiveSummary,
  listExecutiveCommunicationCapabilities,
  normalizeExecutiveCommunicationContext,
  validateExecutiveCommunication,
  type ExecutiveCommunicationInput,
  type ExecutiveCommunicationResult,
} from "./executiveCommunicationEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:communication:a",
    situation: "A neutral executive communication context has upstream reasoning and plan metadata.",
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

function communicationInput(): ExecutiveCommunicationInput {
  const reasoning = analyzeExecutiveReasoning(reasoningInput());
  const judgment = analyzeExecutiveJudgment({ sessionId: "judgment:communication:a", reasoning });
  const planning = buildExecutivePlan({ sessionId: "planning:communication:a", judgment });
  const coaching = buildExecutiveCoaching({ sessionId: "coaching:communication:a", reasoning, judgment, planning });
  const thoughtPartner = buildExecutiveThoughtPartner({ sessionId: "thought-partner:communication:a", reasoning, judgment, planning, coaching });
  const visualReasoning = buildExecutiveVisualReasoning({ sessionId: "visual:communication:a", reasoning, judgment, planning, coaching, thoughtPartner });

  return Object.freeze({
    sessionId: "communication:session:a",
    reasoning,
    judgment,
    planning,
    coaching,
    thoughtPartner,
    visualReasoning,
  });
}

function communication(): ExecutiveCommunicationResult {
  return buildExecutiveCommunication(communicationInput());
}

test("normalizes communication context with LAY-2 through LAY-7 traceability", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);

  assert.equal(context.session.phase, "LAY-8");
  assert.equal(context.session.reasoningSessionId, input.reasoning.session.sessionId);
  assert.equal(context.session.visualReasoningSessionId, input.visualReasoning.session.sessionId);
  assert.deepEqual(context.audienceIds, EXECUTIVE_COMMUNICATION_AUDIENCES);
  assert.equal(context.traceReferences.includes(input.visualReasoning.session.sessionId), true);
});

test("generates executive briefing", () => {
  const result = communication();

  assert.equal(result.briefing.title, "Executive briefing");
  assert.equal(result.briefing.situation, result.input.reasoning.session.input.situation);
  assert.equal(result.briefing.sourceReferences.length, 6);
});

test("builds briefing from public helper", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);
  const result = buildExecutiveCommunication(input);
  const briefing = buildExecutiveBriefing(input, context);

  assert.equal(briefing.briefingId, result.briefing.briefingId);
  assert.deepEqual(briefing.sourceReferences, result.briefing.sourceReferences);
});

test("generates executive summary", () => {
  const result = communication();

  assert.equal(result.summary.headline, "Board-style executive summary");
  assert.equal(result.summary.keyPoints.length > 0, true);
  assert.equal(result.summary.traceReferences.includes(result.session.reasoningSessionId), true);
});

test("builds summary from public helper", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);
  const result = buildExecutiveCommunication(input);
  const summary = buildExecutiveSummary(input, context);

  assert.equal(summary.summaryId, result.summary.summaryId);
  assert.deepEqual(summary.keyPoints, result.summary.keyPoints);
});

test("builds audience frames for all canonical audiences", () => {
  const result = communication();

  assert.equal(result.audienceFrames.length, 6);
  assert.deepEqual(result.audienceFrames.map((frame) => frame.audience).sort(), [...EXECUTIVE_COMMUNICATION_AUDIENCES].sort());
  assert.equal(result.audienceFrames.every((frame) => frame.sourceReferences.length >= 4), true);
});

test("builds audience frames from public helper", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);
  const result = buildExecutiveCommunication(input);
  const frames = buildExecutiveAudienceFrame(context);

  assert.deepEqual(frames.map((frame) => frame.frameId), result.audienceFrames.map((frame) => frame.frameId));
});

test("generates risk communication", () => {
  const result = communication();

  assert.equal(result.riskCommunication.riskStatements.length > 0, true);
  assert.equal(result.riskCommunication.opportunityBalance.length > 0, true);
  assert.equal(result.riskCommunication.blindSpotNotes.length > 0, true);
});

test("builds risk communication from public helper", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);
  const result = buildExecutiveCommunication(input);
  const riskCommunication = buildExecutiveRiskCommunication(input, context);

  assert.deepEqual(riskCommunication.sourceReferences, result.riskCommunication.sourceReferences);
});

test("generates plan communication", () => {
  const result = communication();

  assert.equal(result.planCommunication.goalMessages.length, result.input.planning.goals.length);
  assert.equal(result.planCommunication.milestoneMessages.length, result.input.planning.milestones.length);
  assert.equal(result.planCommunication.dependencyMessages.length, result.input.planning.dependencies.length);
});

test("builds plan communication from public helper", () => {
  const input = communicationInput();
  const context = normalizeExecutiveCommunicationContext(input);
  const result = buildExecutiveCommunication(input);
  const planCommunication = buildExecutivePlanCommunication(input, context);

  assert.deepEqual(planCommunication.goalMessages, result.planCommunication.goalMessages);
});

test("preserves full source traceability", () => {
  const result = communication();

  assert.equal(result.context.traceReferences.includes(result.session.reasoningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.judgmentSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.planningSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.coachingSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.thoughtPartnerSessionId), true);
  assert.equal(result.context.traceReferences.includes(result.session.visualReasoningSessionId), true);
});

test("validates communication result", () => {
  const result = communication();
  const validation = validateExecutiveCommunication(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(result.validation.valid, true);
});

test("detects invalid communication contracts", () => {
  const result = communication();
  const invalid: ExecutiveCommunicationResult = Object.freeze({
    ...result,
    briefing: Object.freeze({
      ...result.briefing,
      situation: "",
    }),
  });
  const validation = validateExecutiveCommunication(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_briefing"), true);
});

test("publishes communication registry integrity", () => {
  const capabilities = listExecutiveCommunicationCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_COMMUNICATION_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("publishes communication contract integrity", () => {
  assert.equal(EXECUTIVE_COMMUNICATION_CONTRACTS.length, 9);
  assert.equal(EXECUTIVE_COMMUNICATION_CONTRACTS.every((contract) => contract.immutable), true);
});

test("exports public communication APIs", () => {
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutiveCommunication, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutiveBriefing, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutiveSummary, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutiveAudienceFrame, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutiveRiskCommunication, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.buildExecutivePlanCommunication, "function");
  assert.equal(typeof ExecutiveCommunicationEngine.validateExecutiveCommunication, "function");
  assert.equal(Object.isFrozen(ExecutiveCommunicationEngine), true);
});

test("keeps communication immutable and delivery-free", () => {
  const result = communication();
  const text = [
    result.briefing.explanation,
    result.summary.explanation,
    result.planCommunication.explanation,
  ].join(" ").toLowerCase();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.audienceFrames), true);
  assert.equal(text.includes("send email"), false);
  assert.equal(text.includes("chat runtime"), false);
  assert.equal(text.includes("render ui"), false);
  assert.equal(text.includes("call llm"), false);
});
