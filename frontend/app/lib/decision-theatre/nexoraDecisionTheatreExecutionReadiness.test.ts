/**
 * DTH:9 — Decision → Execution Readiness tests.
 * Presentation only. CC:11 remains the Execution writer.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreExecutionReadinessIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";

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

function compareInput(memberIds: readonly string[]) {
  return emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `compare:${memberIds.join(",")}`,
    canonicalOperation: "COMPARE",
    conversationIntentKind: "compare-scenarios",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...memberIds]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
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

test("DTH:9 contract, capability, and stable readiness ids", () => {
  assert.equal(nexoraDecisionTheatreExecutionReadinessIdentity, "DTH:9/ExecutionReadiness");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("execution-readiness"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.executionReadinessImplemented, true);
  const reviewing = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-demand",
  });
  assert.equal(reviewing.executionReadiness, null);
  const first = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const second = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(first.executionReadiness?.readinessId, second.executionReadiness?.readinessId);
  assert.match(first.executionReadiness?.readinessId ?? "", /^dth9-readiness:/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(first).ok, true);
});

test("A: approved Decision does not start Execution", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.decisionCommitment?.state, "COMMITTED");
  assert.equal(theatre.executionReadiness?.readiness, "COMMITTED_AWAITING_EXECUTION");
  assert.equal(theatre.executionReadiness?.executionId, null);
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.executionReadiness?.derivationMetadata.approvalStartedExecution, false);
});

test("B: click / inspect does not start Execution", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog);
  const theatre = project(focused, {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    investigationLevel: "understand",
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-scenario-demand");
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.executionReadiness?.derivationMetadata.clickStartedExecution, false);
});

test("C: committed scene leaves active comparison overlay mode", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    authoritativeDecisions: [committedDecision()],
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_COMMITMENT");
  assert.notEqual(theatre.sceneIntent.intentKind, "COMPARE_CANDIDATES");
  assert.equal(theatre.executionReadiness?.comparisonMemberIds.length, 2);
});

test("D: related Execution is reused, not duplicated", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [
      {
        executionId: "execution-cc10:decision:ctx-scenario-demand",
        decisionId: "cc10:decision:ctx-scenario-demand",
        title: "Implement Demand Surge",
        status: "planned",
        ownerIds: Object.freeze([]),
        blockers: Object.freeze([]),
        risks: Object.freeze([]),
        milestones: Object.freeze([]),
      },
    ],
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.executionReadiness?.relatedExecutionExists, true);
  assert.equal(theatre.executionReadiness?.executionId, "execution-cc10:decision:ctx-scenario-demand");
  assert.equal(theatre.executionReadiness?.derivationMetadata.inventedExecution, false);
});

test("E: unknown owner is not a blocker", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(theatre.executionReadiness?.supportedDimensions.owner.status, "unknown");
  assert.equal(theatre.executionReadiness?.blockers.length, 0);
  assert.equal(theatre.executionReadiness?.readiness, "COMMITTED_AWAITING_EXECUTION");
  assert.equal(theatre.executionReadiness?.derivationMetadata.unknownPromotedToBlocked, false);
  assert.match(theatre.executionReadiness?.advisorReadable.mustNotInfer.join(" ") ?? "", /Unknown readiness is not a blocker/);
});

test("F/G: Advisor has-started and Start it without CC:11 do not fake start", () => {
  const decisionRuntime = createNexoraCanonicalDecisionRuntime({
    authorityId: "dth9-committed",
    initialDecisions: [
      Object.freeze({
        decisionId: "cc10:decision:ctx-scenario-demand",
        title: "Demand Surge",
        status: "Approved" as const,
        locked: true,
        subjectIds: Object.freeze(["ctx-scenario-demand"]),
        scenarioId: "ctx-scenario-demand",
        evidenceRefs: Object.freeze([]),
        uncertaintyRefs: Object.freeze([]),
        committedBy: "manager" as const,
        source: "conversation" as const,
      }),
    ],
  });
  const asked = executeNexoraConversationalExperience({
    utterance: "Has execution started?",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: decisionRuntime.adapter,
    messageIdSeed: "dth9-started",
  });
  assert.match(asked.response, /not started|has not started/i);
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
    messageIdSeed: "dth9-start-none",
  });
  assert.match(start.response, /approved, but execution has not been started yet/i);
  assert.doesNotMatch(start.response, /Execution has started/);
});

test("G2: Start it through CC:11 starts exactly once", () => {
  const decisionRuntime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth9-dec" });
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
    messageIdSeed: "dth9-approve",
  });
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    authorityId: "dth9-exec",
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
    messageIdSeed: "dth9-start",
  });
  const executions = executionRuntime.listExecutions();
  assert.equal(executions.length, 1);
  assert.equal(executions[0]?.decisionId, "cc10:decision:ctx-scenario-demand");
  assert.equal(executions[0]?.status, "in-progress");
  assert.match(start.response, /Execution has started/i);
});

test("I: show executions is a collection, not start", () => {
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: createNexoraCanonicalDecisionRuntime({ authorityId: "dth9-empty" }).adapter,
    authorityId: "dth9-list",
  });
  const asked = executeNexoraConversationalExperience({
    utterance: "show executions",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: initial(),
    catalog,
    executionRuntime,
    messageIdSeed: "dth9-show-exec",
  });
  assert.equal(executionRuntime.listExecutions().length, 0);
  assert.doesNotMatch(asked.response, /Execution has started/);
});

test("J/H: comparison history remains after commitment", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.deepEqual([...(theatre.executionReadiness?.comparisonMemberIds ?? [])], [...two]);
  assert.equal(theatre.decisionCommitment?.state, "COMMITTED");
});

test("R: Stage JSON is unchanged by readiness projection", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog);
  const before = JSON.stringify(focused);
  project(focused, {
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(JSON.stringify(focused), before);
});

test("diagnostics expose readiness without manager architecture terms", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: { stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), catalog },
  });
  assert.equal(diagnostics.executionReadinessState, "COMMITTED_AWAITING_EXECUTION");
  assert.doesNotMatch(theatre.advisorReadable.executionReadiness?.scene ?? "", /CC:11|DTH:9|runtime/);
});
