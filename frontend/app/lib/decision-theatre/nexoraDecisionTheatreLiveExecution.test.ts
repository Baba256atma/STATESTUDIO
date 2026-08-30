/**
 * DTH:10 — Live Execution Theatre tests.
 * Presentation only. CC:11 remains the Execution writer.
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
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreLiveExecutionIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";

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

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    ...extra,
  });
}

function startedTheatre(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeExecution>,
    investigationLevel?: "glance" | "understand" | "investigate",
) {
  return project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution(extra)],
    executionStarted: true,
    executionRuntimeAvailable: true,
    investigationLevel,
  });
}

function startDemandSurge() {
  resetOutcomeObservationCaptureForTests();
  const decisionRuntime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth10-dec" });
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
    messageIdSeed: "dth10-approve",
  });
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    authorityId: "dth10-exec",
  });
  const start = executeNexoraConversationalExperience({
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
    messageIdSeed: "dth10-start",
  });
  return { decisionRuntime, executionRuntime, start };
}

function ask(
  utterance: string,
  run: ReturnType<typeof startDemandSurge>,
  seed: string,
) {
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

test("DTH:10 contract, capability, and stable live ids", () => {
  assert.equal(nexoraDecisionTheatreLiveExecutionIdentity, "DTH:10/LiveExecution");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("live-execution"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.liveExecutionImplemented, true);
  const awaiting = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(awaiting.liveExecution, null);
  const first = startedTheatre();
  const second = startedTheatre();
  assert.equal(first.liveExecution?.liveExecutionId, second.liveExecution?.liveExecutionId);
  assert.match(first.liveExecution?.liveExecutionId ?? "", /^dth10-live:/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(first).ok, true);
});

test("A: DTH:9 start handoff becomes REVIEW_EXECUTION live Theatre with one CC:11 Execution", () => {
  const run = startDemandSurge();
  assert.equal(run.executionRuntime.listExecutions().length, 1);
  assert.match(run.start.response, /Execution has started/i);
  const theatre = project(run.start.nextRuntimeState, {
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: run.executionRuntime.listExecutions().map((item) =>
      Object.freeze({
        executionId: item.executionId,
        decisionId: item.decisionId,
        title: item.title,
        status: item.status,
        ownerIds: item.ownerIds,
        blockers: item.blockers,
        risks: item.risks,
        milestones: item.milestones,
        progress: item.progress,
      }),
    ),
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_EXECUTION");
  assert.equal(theatre.liveExecution?.state, "EXECUTION_ACTIVE");
  assert.equal(theatre.liveExecution?.executionId, run.executionRuntime.listExecutions()[0]?.executionId);
  assert.equal(theatre.executionReadiness?.readiness, "EXECUTION_STARTED");
});

test("B: live projection does not create another Execution", () => {
  const run = startDemandSurge();
  const before = run.executionRuntime.listExecutions().length;
  startedTheatre({
    executionId: run.executionRuntime.listExecutions()[0]?.executionId ?? "execution-cc10:decision:ctx-scenario-demand",
  });
  startedTheatre({
    executionId: run.executionRuntime.listExecutions()[0]?.executionId ?? "execution-cc10:decision:ctx-scenario-demand",
  });
  assert.equal(run.executionRuntime.listExecutions().length, before);
  assert.equal(startedTheatre().writes.executionState, false);
});

test("C: active Execution is the live primary presentation, not comparison", () => {
  const theatre = startedTheatre();
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_EXECUTION");
  assert.notEqual(theatre.sceneIntent.intentKind, "COMPARE_CANDIDATES");
  assert.equal(theatre.liveExecution?.open, true);
  assert.equal(theatre.liveExecution?.executionId, "execution-cc10:decision:ctx-scenario-demand");
});

test("D: no fabricated progress", () => {
  const run = startDemandSurge();
  const asked = ask("How is it going?", run, "dth10-progress");
  assert.match(asked.response, /no authoritative progress observation/i);
  assert.doesNotMatch(asked.response, /0%|50%|on track|behind schedule/i);
  const theatre = startedTheatre();
  assert.equal(theatre.liveExecution?.progressObservation.status, "unknown");
  assert.equal(theatre.liveExecution?.derivationMetadata.inventedProgress, false);
});

test("E: unknown is not blocked, delayed, or failed", () => {
  const theatre = startedTheatre();
  assert.equal(theatre.liveExecution?.ownerObservation.status, "unknown");
  assert.equal(theatre.liveExecution?.timingObservation.status, "unknown");
  assert.equal(theatre.liveExecution?.state, "EXECUTION_ACTIVE");
  assert.equal(theatre.liveExecution?.blockers.length, 0);
  assert.equal(theatre.liveExecution?.attentionSignals.length, 0);
  assert.equal(theatre.liveExecution?.derivationMetadata.unknownPromotedToBlocked, false);
  assert.equal(theatre.liveExecution?.derivationMetadata.unknownPromotedToAttention, false);
  assert.match(theatre.liveExecution?.advisorReadable.mustNotInfer.join(" ") ?? "", /Missing progress is not 0%/);
});

test("F: click / investigate does not mutate Execution", () => {
  const theatre = startedTheatre(undefined, "understand");
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-scenario-demand");
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.liveExecution?.derivationMetadata.clickMutatedExecution, false);
});

test("G: show executions is a collection, not a lifecycle command", () => {
  const run = startDemandSurge();
  const before = run.executionRuntime.listExecutions().map((item) => item.status);
  const asked = ask("show executions", run, "dth10-show");
  assert.deepEqual(
    run.executionRuntime.listExecutions().map((item) => item.status),
    before,
  );
  assert.doesNotMatch(asked.response, /Execution has started/);
});

test("H: follow-ups stay on the started Execution", () => {
  const run = startDemandSurge();
  const going = ask("How is it going?", run, "dth10-h1");
  const why = ask("Why are we doing this?", run, "dth10-h2");
  const risk = ask("Any risk?", run, "dth10-h3");
  const watch = ask("What should I watch?", run, "dth10-h4");
  assert.match(going.response, /no authoritative progress observation/i);
  assert.match(why.response, /Demand Surge/i);
  assert.match(risk.response, /No related Risk/i);
  assert.match(watch.response, /No supported attention signal/i);
  assert.equal(run.executionRuntime.listExecutions().length, 1);
});

test("I: decision history remains traceable", () => {
  const run = startDemandSurge();
  const why = ask("Why did we choose this?", run, "dth10-choose");
  const theatre = startedTheatre();
  assert.equal(theatre.liveExecution?.comparisonMemberIds.length, 2);
  assert.ok(why.response.length > 0);
  assert.doesNotMatch(why.response, /I don't have a Decision/i);
});

test("J: attention is not invented when no signal exists", () => {
  const run = startDemandSurge();
  const asked = ask("Does anything need my attention?", run, "dth10-att");
  assert.match(asked.response, /No supported attention signal/i);
});

test("K: related Risk is attention, not blocked", () => {
  const theatre = startedTheatre({
    risks: Object.freeze([{ riskId: "risk-capacity", label: "Capacity risk" }]),
  });
  assert.equal(theatre.liveExecution?.state, "EXECUTION_ATTENTION");
  assert.equal(theatre.liveExecution?.blockers.length, 0);
  assert.equal(theatre.liveExecution?.attentionSignals[0]?.blocked, false);
});

test("L: related Constraint is not automatically causal or blocked", () => {
  const theatre = startedTheatre({
    blockers: Object.freeze([{ blockerId: "constraint-capacity", label: "Capacity constraint" }]),
  });
  assert.equal(theatre.liveExecution?.state, "EXECUTION_ATTENTION");
  assert.equal(theatre.liveExecution?.constraints[0]?.causal, false);
  assert.equal(theatre.liveExecution?.blockers.length, 0);
  assert.match(theatre.liveExecution?.advisorReadable.association ?? "", /does not by itself mean it has stopped/);
});

test("M: Outcome stays outside DTH:10 authority", () => {
  const run = startDemandSurge();
  const asked = ask("What was the result?", run, "dth10-outcome");
  assert.match(asked.response, /No authoritative Outcome/i);
  assert.doesNotMatch(asked.response, /unsuccessful|successful|failed/i);
  const theatre = startedTheatre();
  assert.equal(theatre.liveExecution?.outcomeId, null);
  assert.equal(theatre.liveExecution?.derivationMetadata.inventedOutcome, false);
});

test("N: complete question does not mutate; complete command uses CC:11 confirmation", () => {
  const run = startDemandSurge();
  const question = ask("Is it complete?", run, "dth10-q-complete");
  assert.match(question.response, /not marked complete/i);
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, "in-progress");
  const command = ask("Mark it complete.", run, "dth10-cmd-complete");
  assert.match(command.response, /explicit confirmation/i);
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, "in-progress");
});

test("O: reconstruction from canonical started Execution does not fall back to comparison", () => {
  const theatre = project(initial(), {
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution()],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_EXECUTION");
  assert.equal(theatre.liveExecution?.state, "EXECUTION_ACTIVE");
  assert.notEqual(theatre.sceneIntent.intentKind, "COMPARE_CANDIDATES");
  assert.equal(theatre.executionReadiness?.readiness, "EXECUTION_STARTED");
});

test("diagnostics expose live Execution without manager architecture terms", () => {
  const theatre = startedTheatre();
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: {
      stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
      catalog,
    },
  });
  assert.equal(diagnostics.liveExecutionState, "EXECUTION_ACTIVE");
  assert.equal(diagnostics.liveExecutionCanonicalStatus, "in-progress");
  assert.doesNotMatch(theatre.advisorReadable.liveExecution?.scene ?? "", /CC:11|DTH:10|runtime/);
});
