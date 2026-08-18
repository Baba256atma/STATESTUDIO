/**
 * UX:5 — Executive Workflow Integration invariants A–Z.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalActionInvocation } from "../conversational-control/conversationalActionDescriptor.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  NEXORA_MVP_FLOW_BOUNDARY,
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowContext,
  deriveNexoraMVPExecutiveWorkflowPresentation,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
} from "./nexoraMVPExecutiveFlow.ts";
import { createNexoraMVPFlowSeededDecisionRuntime } from "./nexoraMVPExecutiveDecisionCommitment.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  executeNexoraMVPNextBestAction,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "./nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function focused(subjectId: string) {
  return selectNexoraMVPInteractionSubject(initial(), subjectId, catalog);
}

function workflow(
  subjectId: string | null,
  evidenceReadiness: "supported" | "limited" | "unknown" = "supported",
  flowState = createInitialNexoraMVPFlowDomainState(),
) {
  const state = subjectId ? focused(subjectId) : initial();
  const context = deriveNexoraMVPExecutiveFlowContext({
    workspace: state.workspace,
    presentationState: state.presentationState,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
  });
  return deriveNexoraMVPExecutiveWorkflowPresentation({
    context,
    flowState,
    evidenceReadiness,
    attentionSubjectId: subjectId == null ? "obj-capacity" : null,
    outcomeAvailable: false,
    learningAvailable: false,
  });
}

function converse(utterance: string, state = initial()) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: {},
    executiveSubjects: subjects,
    runtimeState: state,
    catalog,
    messageIdSeed: `ux5-${utterance}`,
  });
}

test("A–C — Attention enters investigation; weak evidence does not force Decision", () => {
  const attention = workflow(null);
  assert.equal(attention.phase, "attention");
  assert.equal(attention.currentSubjectId, null);
  assert.equal(attention.attentionSubject?.id, "obj-capacity");

  const investigate = workflow("obj-capacity");
  assert.equal(investigate.phase, "investigate");
  assert.equal(investigate.readiness, "needs-investigation");

  const limited = workflow("ctx-problem-capacity", "limited");
  assert.equal(limited.phase, "understand");
  assert.equal(limited.readiness, "evidence-limited");
  assert.notEqual(limited.nextAvailableSubject?.kind, "decision");
});

test("D–G — Problem, multiple Scenarios, projection truth, and Decision linkage", () => {
  const capacity = deriveNexoraMVPExecutiveFlowContext({
    workspace: "problem",
    presentationState: "report",
    focusedSubject: focused("ctx-problem-capacity").focusedSubject,
    selectedSubject: focused("ctx-problem-capacity").selectedSubject,
  });
  assert.equal(capacity.linkedScenarios[0]?.id, "ctx-scenario-capacity");

  const margin = deriveNexoraMVPExecutiveFlowContext({
    workspace: "problem",
    presentationState: "report",
    focusedSubject: focused("ctx-problem-margin").focusedSubject,
    selectedSubject: focused("ctx-problem-margin").selectedSubject,
  });
  assert.equal(margin.linkedScenarios.length, 2);

  const scenario = workflow("ctx-scenario-capacity");
  assert.equal(scenario.phase, "scenario");
  assert.equal(scenario.readiness, "scenario-projection");
  assert.match(scenario.reason, /projections, not observed reality/i);
  assert.equal(scenario.nextAvailableSubject?.id, "ctx-decision-capacity");
});

test("H–J — Recommendation and preference do not commit; explicit action uses Decision Runtime", () => {
  const recommendation = converse(
    "What should I do?",
    focused("ctx-scenario-capacity"),
  );
  assert.equal(recommendation.decisionCommitmentResult, null);

  const preference = converse(
    "I prefer Capacity Expansion Plan",
    focused("ctx-scenario-capacity"),
  );
  assert.notEqual(preference.decisionCommitmentResult?.status, "applied");

  const flowState = createInitialNexoraMVPFlowDomainState();
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const committed = applyNexoraMVPFlowDomainAction(
    flowState,
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    },
    { decisionRuntime: decisionRuntime.adapter },
  );
  assert.equal(committed.ok, true);
  assert.equal(
    decisionRuntime.adapter.getDecision("ctx-decision-reprice")?.status,
    "Approved",
  );

  const conversationalRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const decisionReview = executeNexoraConversationalExperience({
    utterance: "Review Expand Capacity",
    conversationContext: {},
    executiveSubjects: subjects,
    runtimeState: initial(),
    catalog,
    decisionRuntime: conversationalRuntime.adapter,
    messageIdSeed: "ux5-review-existing-decision",
  });
  const decisionState = decisionReview.nextRuntimeState;
  const softCommitment = executeNexoraConversationalExperience({
    utterance: "I think we should probably choose this",
    executiveContext: decisionReview.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: decisionState,
    catalog,
    decisionRuntime: conversationalRuntime.adapter,
    messageIdSeed: "ux5-soft-existing-decision",
  });
  assert.equal(softCommitment.status, "confirmation-required");
  const confirmed = executeNexoraConversationalExperience({
    utterance: "Yes",
    executiveContext: softCommitment.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: decisionState,
    catalog,
    decisionRuntime: conversationalRuntime.adapter,
    decisionSession: softCommitment.nextDecisionSession,
    messageIdSeed: "ux5-confirm-existing-decision",
  });
  assert.equal(confirmed.decisionCommitmentResult?.status, "applied");
  assert.equal(
    conversationalRuntime.adapter.getDecision("ctx-decision-capacity")?.status,
    "Approved",
  );
});

test("K–O — Decision, Execution, truthful Outcome, and Learning boundaries", () => {
  const flowState = createInitialNexoraMVPFlowDomainState();
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const applied = applyNexoraMVPFlowDomainAction(
    flowState,
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    },
    { decisionRuntime: decisionRuntime.adapter },
  );
  assert.equal(applied.ok, true);
  if (!applied.ok) return;

  const decision = workflow(
    "ctx-decision-reprice",
    "supported",
    applied.state,
  );
  assert.equal(decision.readiness, "decision-complete");
  assert.equal(decision.nextAvailableSubject?.id, "ctx-execution-rollout");

  const execution = workflow(
    "ctx-execution-rollout",
    "supported",
    applied.state,
  );
  assert.equal(execution.phase, "execution");
  assert.equal(execution.outcomeAvailability, "unavailable");
  assert.match(execution.outcomeMessage, /No validated outcome/i);
  assert.equal(execution.learningAvailability, "unavailable");
  assert.match(execution.learningMessage, /No validated learning/i);

  const projectedCatalog =
    projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(
      catalog,
      applied.state,
    );
  const executionStage = deriveNexoraMVPStageInteractionPresentation(
    focused("ctx-execution-rollout"),
    projectedCatalog,
  );
  assert.doesNotMatch(
    executionStage.nextBestAction?.recommendedAction?.reason ?? "",
    /needs review/i,
  );
});

test("L and dead-end policy — missing links remain truthful", () => {
  const state = createInitialNexoraMVPFlowDomainState();
  const baseContext = deriveNexoraMVPExecutiveFlowContext({
    workspace: "decision",
    presentationState: "report",
    focusedSubject: focused("ctx-decision-capacity").focusedSubject,
    selectedSubject: focused("ctx-decision-capacity").selectedSubject,
  });
  const noExecutionContext = Object.freeze({
    ...baseContext,
    execution: null,
    linkedExecutions: Object.freeze([]),
    chain: Object.freeze({
      ...baseContext.chain,
      execution: null,
      links: Object.freeze(
        baseContext.chain.links.filter((link) => link.kind !== "execution"),
      ),
    }),
  });
  const presentation = deriveNexoraMVPExecutiveWorkflowPresentation({
    context: noExecutionContext,
    flowState: Object.freeze({
      ...state,
      decisions: Object.freeze(
        state.decisions.map((decision) =>
          decision.id === "ctx-decision-capacity"
            ? Object.freeze({ ...decision, status: "approved" as const })
            : decision,
        ),
      ),
    }),
    evidenceReadiness: "supported",
  });
  assert.match(presentation.readinessLabel, /no execution linked/i);
  assert.equal(presentation.nextAvailableSubject, null);
});

test("P–W — Stage, Advisor, Conversation, Queue, history, Overview, and parity converge", () => {
  let state = focused("obj-capacity");
  const stageBefore = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  const action = stageBefore.nextBestAction?.recommendedAction;
  assert.ok(action);
  const actionIntent = executeNexoraMVPNextBestAction(action, catalog);
  assert.equal(actionIntent.type, "select-subject");
  if (actionIntent.type !== "select-subject") return;

  const button = selectNexoraMVPInteractionSubject(
    state,
    actionIntent.subjectId,
    catalog,
  );
  const conversation = converse("Review Capacity Gap", state);
  assert.equal(
    conversation.nextRuntimeState.focusedSubject?.id,
    "ctx-problem-capacity",
  );
  assert.deepEqual(
    conversation.nextRuntimeState.stage2dNavigationTrail,
    button.stage2dNavigationTrail,
  );

  const stage = deriveNexoraMVPStageInteractionPresentation(
    conversation.nextRuntimeState,
    catalog,
  );
  assert.equal(stage.focusedSubjectId, "ctx-problem-capacity");
  const advisor = buildNexoraMVPAdvisorContextBridge(
    conversation.nextRuntimeState,
    stage,
  );
  assert.equal(advisor.advisorSubjectId, stage.focusedSubjectId);
  assert.equal(
    new Set(stage.stage2dNavigationTrail?.trailEntryIds).size,
    stage.stage2dNavigationTrail?.trailEntryIds.length,
  );

  state = openNexoraMVPExecutiveQueueCollection(initial(), "problem", catalog);
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    catalog,
  );
  assert.equal(state.focusedSubject?.id, button.focusedSubject?.id);

  const back = stepBackNexoraMVPObjectInteraction(button, catalog);
  const forward = stepForwardNexoraMVPObjectInteraction(back, catalog);
  assert.equal(forward.focusedSubject?.id, button.focusedSubject?.id);

  const overview = converse("Show overview", button);
  assert.equal(overview.nextRuntimeState.focusedSubject, null);
});

test("R — manager workflow nouns select the matching canonical Advisor action", () => {
  const scenarioAction = Object.freeze({
    actionId: "review-scenario",
    label: "Review Capacity Expansion Plan",
    actionKind: "navigate-subject" as const,
    targetSubjectId: "ctx-scenario-capacity",
    targetCollection: null,
    sourceCapability: "advisor-intelligence" as const,
    consequenceLevel: "none" as const,
  });
  const decisionAction = Object.freeze({
    actionId: "review-decision",
    label: "Review Expand Capacity",
    actionKind: "navigate-subject" as const,
    targetSubjectId: "ctx-decision-capacity",
    targetCollection: null,
    sourceCapability: "advisor-intelligence" as const,
    consequenceLevel: "none" as const,
  });
  const resolution = resolveNexoraConversationalActionInvocation({
    utterance: "Review the decision",
    primaryAction: scenarioAction,
    availableActions: [scenarioAction, decisionAction],
    subjectNameById: {
      "ctx-scenario-capacity": "Capacity Expansion Plan",
      "ctx-decision-capacity": "Expand Capacity",
    },
    subjectKindById: {
      "ctx-scenario-capacity": "scenario",
      "ctx-decision-capacity": "decision",
    },
  });
  assert.equal(resolution.status, "resolved");
  assert.equal(resolution.descriptor?.actionId, "review-decision");
  assert.equal(resolution.semanticUtterance, "Focus on Expand Capacity");
});

test("X–Z — safe review cannot mutate Decision/Execution or create parallel authority", () => {
  const decisionReview = converse("Review Expand Capacity");
  assert.equal(decisionReview.nextRuntimeState.focusedSubject?.id, "ctx-decision-capacity");
  assert.equal(decisionReview.decisionCommitmentResult, null);

  const executionReview = converse("Review Capacity Expansion");
  assert.equal(
    executionReview.nextRuntimeState.focusedSubject?.id,
    "ctx-execution-capacity",
  );
  assert.equal(executionReview.decisionCommitmentResult, null);
  assert.equal("durableMemory" in executionReview, false);

  assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsWorkflowEngine, false);
  assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsWorkflowProgression, false);
  assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsRecommendationTruth, false);
  assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsOutcomeTruth, false);
  assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsLearningTruth, false);

  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-ux5="executive-workflow"/);
  assert.match(html, /data-ux3="professional-advisor"/);
});
