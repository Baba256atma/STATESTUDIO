/**
 * DTH:11 — Outcome Observation Theatre tests.
 * Presentation only. Does not write Outcome, Learning, or Decisions.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  evaluateNexoraDecisionTheatreInvariants,
  formatOutcomePercentagePointDelta,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreOutcomeObservationIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
import type { NexoraDecisionTheatreAuthoritativeOutcomeObservation } from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();
const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function committedDecision() {
  return Object.freeze({
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Demand Surge",
    status: "Approved",
    scenarioId: "ctx-scenario-demand",
    committedBy: "manager" as const,
  });
}

function startedExecution(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeExecution>,
): NexoraDecisionTheatreAuthoritativeExecution {
  return Object.freeze({
    executionId: "execution-cc10:decision:ctx-scenario-demand",
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Implement Demand Surge",
    status: "in-progress",
    ownerIds: Object.freeze([]),
    blockers: Object.freeze([]),
    risks: Object.freeze([]),
    milestones: Object.freeze([]),
    ...extra,
  });
}

function deliveryObservation(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeOutcomeObservation>,
): NexoraDecisionTheatreAuthoritativeOutcomeObservation {
  return Object.freeze({
    observationId: "outcome:delivery:94",
    executionId: "execution-cc10:decision:ctx-scenario-demand",
    decisionId: "cc10:decision:ctx-scenario-demand",
    goalId: "goal:delivery",
    measure: "Delivery",
    observedNumeric: 94,
    observedLabel: "94%",
    unit: "%",
    baselineNumeric: 91,
    baselineLabel: "91%",
    targetNumeric: 96,
    targetLabel: "96%",
    source: "kpi-observation",
    phase: "unknown",
    causalSupport: false,
    financialKnown: false,
    ...extra,
  });
}

function project(
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    authoritativeDecisions: [committedDecision()],
    executionStarted: true,
    executionRuntimeAvailable: true,
    ...extra,
  });
}

function startDemandSurge() {
  resetOutcomeObservationCaptureForTests();
  const decisionRuntime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth11-dec" });
  executeNexoraConversationalExperience({
    utterance: "Approve Demand Surge",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: decisionRuntime.adapter,
    messageIdSeed: "dth11-approve",
  });
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    authorityId: "dth11-exec",
  });
  executeNexoraConversationalExperience({
    utterance: "Start it.",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: decisionRuntime.adapter,
    executionRuntime,
    messageIdSeed: "dth11-start",
  });
  return { decisionRuntime, executionRuntime };
}

function ask(utterance: string, run: ReturnType<typeof startDemandSurge>, seed: string) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: run.decisionRuntime.adapter,
    executionRuntime: run.executionRuntime,
    messageIdSeed: seed,
  });
}

test("DTH:11 contract, capability, and reserved length", () => {
  assert.equal(nexoraDecisionTheatreOutcomeObservationIdentity, "DTH:11/OutcomeObservation");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("outcome-observation"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.outcomeObservationImplemented, true);
});

test("A: completion is not Outcome", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
  });
  assert.equal(theatre.outcomeObservation?.state, "OUTCOME_PENDING");
  assert.equal(theatre.outcomeObservation?.observedLabel, null);
  assert.equal(theatre.outcomeObservation?.derivationMetadata.completionMeansSuccess, false);
  assert.doesNotMatch(theatre.outcomeObservation?.advisorReadable.result ?? "", /success|failure|failed/i);
  assert.equal(theatre.writes.outcome, false);
});

test("B: authoritative Outcome is projected exactly", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.outcomeObservation?.state, "OUTCOME_OBSERVED");
  assert.equal(theatre.outcomeObservation?.observedLabel, "94%");
  assert.equal(theatre.outcomeObservation?.observedNumeric, 94);
  assert.equal(theatre.outcomeObservation?.outcomeId, "outcome:delivery:94");
  assert.match(theatre.outcomeObservation?.advisorReadable.result ?? "", /94%/);
  assert.doesNotMatch(theatre.outcomeObservation?.advisorReadable.result ?? "", /95%|93%/);
  assert.equal(theatre.outcomeObservation?.derivationMetadata.inventedOutcome, false);
});

test("C: baseline delta uses percentage points", () => {
  const delta = formatOutcomePercentagePointDelta(91, 94);
  assert.equal(delta.label, "+3 percentage points");
  assert.doesNotMatch(delta.label, /\+3%/);
  const floatSafe = formatOutcomePercentagePointDelta(84, 84.00000000000001);
  assert.doesNotMatch(floatSafe.label, /84\.00000000000001/);
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.outcomeObservation?.deltaLabel, "+3 percentage points");
});

test("D: below target is not a failed Decision", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.outcomeObservation?.belowTarget, true);
  assert.match(theatre.outcomeObservation?.advisorReadable.goal ?? "", /below the stated 96%/);
  assert.match(theatre.outcomeObservation?.advisorReadable.success ?? "", /not the same as declaring/);
  assert.doesNotMatch(theatre.outcomeObservation?.advisorReadable.goal ?? "", /the decision failed/i);
});

test("E: no causality invention", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.outcomeObservation?.causalSupport, false);
  assert.equal(theatre.outcomeObservation?.derivationMetadata.inventedCausality, false);
  assert.match(theatre.outcomeObservation?.advisorReadable.causality ?? "", /does not establish that this execution alone caused/);
});

test("F: unknown financial impact stays unknown", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.outcomeObservation?.financialKnown, false);
  assert.ok(theatre.outcomeObservation?.unknowns.includes("financial impact"));
  assert.doesNotMatch(theatre.outcomeObservation?.advisorReadable.result ?? "", /ROI|savings|\$/);
  assert.doesNotMatch(theatre.outcomeObservation?.advisorReadable.unknown ?? "", /ROI|\$/);
});

test("G: click remains inspection", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
    investigationLevel: "investigate",
  });
  assert.equal(theatre.writes.outcome, false);
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.outcomeObservation?.derivationMetadata.clickMutatedOutcome, false);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});

test("H: show outcomes remains a read-only collection query", () => {
  const run = startDemandSurge();
  const beforeDecisions = run.decisionRuntime.adapter.listDecisions().length;
  const beforeStatus = run.executionRuntime.listExecutions()[0]?.status;
  const shown = ask("show outcomes", run, "dth11-show-outcomes");
  assert.equal(run.decisionRuntime.adapter.listDecisions().length, beforeDecisions);
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, beforeStatus);
  assert.equal(shown.decisionTheatre?.writes.outcome, false);
  assert.equal(shown.decisionTheatre?.writes.learning, false);
  assert.doesNotMatch(shown.response, /created a new Outcome|marked complete|Learning/i);
});

test("I: reference continuity stays on the same Outcome and Execution", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth11-report");
  const result = ask("What was the result?", run, "dth11-result");
  const goal = ask("Did we reach the goal?", run, "dth11-goal");
  const success = ask("Was it successful?", run, "dth11-success");
  const evidence = ask("What evidence supports that?", run, "dth11-evidence");
  const executionId = "execution-cc10:decision:ctx-scenario-demand";
  assert.equal(result.decisionTheatre?.outcomeObservation?.executionId, executionId);
  assert.equal(goal.decisionTheatre?.outcomeObservation?.executionId, executionId);
  assert.equal(success.decisionTheatre?.outcomeObservation?.executionId, executionId);
  assert.equal(evidence.decisionTheatre?.outcomeObservation?.executionId, executionId);
  assert.match(result.response, /94%/);
  assert.match(goal.response, /96%/);
  assert.match(evidence.response, /observation/i);
});

test("J: Decision traceability recovers the committed Decision", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth11-report-j");
  const why = ask("Why did we choose this?", run, "dth11-why");
  assert.match(why.response, /Demand Surge/);
  assert.equal(why.decisionTheatre?.outcomeObservation?.decisionId, "cc10:decision:ctx-scenario-demand");
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.ok((theatre.outcomeObservation?.comparisonMemberIds.length ?? 0) >= 2);
});

test("K: early observation stays partial", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution()],
    authoritativeOutcomeObservations: [deliveryObservation({ phase: "early" })],
  });
  assert.equal(theatre.outcomeObservation?.state, "OUTCOME_PARTIAL");
  assert.match(theatre.outcomeObservation?.advisorReadable.early ?? "", /not a final Outcome/);
});

test("L: What was the result? does not complete Execution", () => {
  const run = startDemandSurge();
  const asked = ask("What was the result?", run, "dth11-result-no-complete");
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, "in-progress");
  assert.doesNotMatch(asked.response, /marked complete/i);
});

test("M: Outcome observation does not write Learning", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(theatre.writes.learning, false);
  assert.equal(theatre.outcomeObservation?.derivationMetadata.inventedLearning, false);
  assert.ok(theatre.outcomeObservation?.unknowns.includes("learning"));
});

test("N: below-target Outcome does not create a new Decision", () => {
  const run = startDemandSurge();
  const before = run.decisionRuntime.adapter.listDecisions().map((item) => item.decisionId);
  ask("Delivery improved from 91% to 94%.", run, "dth11-report-n");
  ask("Was it successful?", run, "dth11-success-n");
  const after = run.decisionRuntime.adapter.listDecisions().map((item) => item.decisionId);
  assert.deepEqual(after, before);
  assert.equal(run.decisionRuntime.adapter.listDecisions()[0]?.status, "Approved");
});

test("O: missing observations are not invented after reconstruction", () => {
  const pending = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
  });
  assert.equal(pending.outcomeObservation?.state, "OUTCOME_PENDING");
  assert.equal(pending.outcomeObservation?.derivationMetadata.inventedOutcome, false);
  const reconstructed = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
  });
  assert.equal(reconstructed.outcomeObservation?.observedNumeric, 94);
  assert.equal(reconstructed.sceneIntent.intentKind, "REVIEW_OUTCOME");
});

test("diagnostics expose Outcome Theatre without manager architecture terms", () => {
  const input = Object.freeze({
    stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  const theatre = projectNexoraDecisionTheatreFoundation(input);
  const diagnostics = inspectNexoraDecisionTheatreProjection({ theatre, projectionInput: input });
  assert.equal(diagnostics.outcomeObservationState, "OUTCOME_OBSERVED");
  assert.equal(diagnostics.outcomeId, "outcome:delivery:94");
  assert.equal(diagnostics.outcomeDeltaLabel, "+3 percentage points");
  assert.equal(diagnostics.outcomeBelowTarget, true);
  assert.equal(diagnostics.outcomeCausalSupport, false);
  assert.doesNotMatch(theatre.advisorReadable.outcomeObservation?.scene ?? "", /DTH:11|CORE-OUT|CC:11/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});
