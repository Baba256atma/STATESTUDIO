import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import {
  resolveNexoraConversationalActionInvocation,
  type NexoraConversationalActionDescriptor,
} from "../conversational-control/conversationalActionDescriptor.ts";
import type {
  NexoraConversationalAdvisorGrounding,
} from "../conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { createNexoraPendingTurnExpectation } from "../conversational-control/conversationalTurnExpectation.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  executeNexoraMVPNextBestAction,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";

type State = ReturnType<typeof createInitialNexoraMVPObjectInteractionState>;
type Result = ReturnType<typeof executeNexoraConversationalExperience>;

const subjects = projectDefaultNexoraMvpConversationalSubjects();
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial(): State {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function focus(subjectId: string): State {
  return selectNexoraMVPInteractionSubject(initial(), subjectId);
}

function run(
  utterance: string,
  options?: {
    readonly state?: State;
    readonly previous?: Result;
    readonly grounding?: NexoraConversationalAdvisorGrounding | null;
    readonly pending?: ReturnType<typeof createNexoraPendingTurnExpectation> | null;
  },
): Result {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: {},
    executiveSubjects: subjects,
    runtimeState:
      options?.state ?? options?.previous?.nextRuntimeState ?? initial(),
    catalog,
    executiveContext: options?.previous?.nextExecutiveContext,
    pendingTurnExpectation:
      options?.pending ??
      options?.previous?.nextPendingTurnExpectation ??
      null,
    advisorGrounding: options?.grounding ?? null,
    messageIdSeed: `ux4-fix3-${utterance}`,
  });
}

function riskAction() {
  const risk = focus("obj-risk");
  const action =
    deriveNexoraMVPStageInteractionPresentation(risk).nextBestAction
      ?.recommendedAction;
  assert.ok(action);
  assert.equal(action.label, "Review Margin Pressure");
  const intent = executeNexoraMVPNextBestAction(action);
  assert.equal(intent.type, "select-subject");
  if (intent.type !== "select-subject") throw new Error("Expected subject action");
  const descriptor: NexoraConversationalActionDescriptor = Object.freeze({
    actionId: action.id,
    label: action.label,
    actionKind: "navigate-subject",
    targetSubjectId: intent.subjectId,
    targetCollection: null,
    sourceCapability: "next-best-action",
    consequenceLevel: "none",
  });
  const grounding: NexoraConversationalAdvisorGrounding = Object.freeze({
    isOverview: false,
    currentSubjectId: "obj-risk",
    currentSubjectLabel: "Risk",
    attentionSubjectId: null,
    attentionSubjectLabel: null,
    attentionReason: null,
    situation: "Risk requires review.",
    whyItMatters: "Validated risk exposure is material.",
    recommendation: action.label,
    noRecommendationReason: null,
    primaryActionLabel: action.label,
    evidenceState: "strong",
    evidenceSummary: "Validated evidence is available.",
    recommendationAuthority: "nba",
    primaryAction: descriptor,
    availableActions: Object.freeze([descriptor]),
  });
  return { risk, action, intent, descriptor, grounding };
}

test("A–F — Review Margin Pressure uses the canonical safe action target", () => {
  const { risk, intent, grounding } = riskAction();
  const conversation = run("Review Margin Pressure", {
    state: risk,
    grounding,
  });
  assert.equal(conversation.status, "applied");
  assert.equal(conversation.intentResult.intent.kind, "focus");
  assert.equal(conversation.nextRuntimeState.focusedSubject?.id, intent.subjectId);
  assert.equal(
    conversation.contextResult.context.primarySubject?.subjectId,
    intent.subjectId,
  );
  assert.doesNotMatch(conversation.response, /not sure how that relates/i);

  const button = selectNexoraMVPInteractionSubject(risk, intent.subjectId);
  assert.equal(
    conversation.nextRuntimeState.focusedSubject?.id,
    button.focusedSubject?.id,
  );
  assert.deepEqual(conversation.nextRuntimeState.trail, button.trail);

  const stage = deriveNexoraMVPStageInteractionPresentation(
    conversation.nextRuntimeState,
  );
  assert.equal(stage.focusedSubjectId, intent.subjectId);
  assert.equal(stage.scene.focusedObjectId, intent.subjectId);
  const advisor = buildNexoraMVPAdvisorContextBridge(
    conversation.nextRuntimeState,
    stage,
  );
  assert.equal(advisor.focusedSubject?.id, intent.subjectId);
});

test("G — Explain Margin Pressure remains informational", () => {
  const result = run("Explain Margin Pressure", { state: focus("obj-risk") });
  assert.equal(result.intentResult.intent.kind, "explain");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-risk");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "ctx-problem-margin",
  );
});

test("H — review it invokes the one structured current recommendation", () => {
  const { risk, descriptor, grounding } = riskAction();
  const result = run("review it", { state: risk, grounding });
  assert.equal(result.nextRuntimeState.focusedSubject?.id, descriptor.targetSubjectId);
  assert.equal(
    result.nextExecutiveContext.currentRecommendedAction?.actionId,
    descriptor.actionId,
  );
});

test("I — ambiguous contextual action reference asks instead of guessing", () => {
  const one = riskAction().descriptor;
  const two: NexoraConversationalActionDescriptor = Object.freeze({
    ...one,
    actionId: "other",
    label: "Review Capacity Gap",
    targetSubjectId: "ctx-problem-capacity",
  });
  const resolution = resolveNexoraConversationalActionInvocation({
    utterance: "review it",
    primaryAction: null,
    availableActions: [one, two],
    subjectNameById: Object.fromEntries(
      subjects.map((subject) => [subject.subjectId, subject.canonicalName]),
    ),
  });
  assert.equal(resolution.status, "ambiguous");
  assert.equal(resolution.semanticUtterance, null);
});

test("J–M — real problem, scenario, decision, and execution reviews navigate only", () => {
  const cases = [
    ["Review Capacity Gap", "ctx-problem-capacity"],
    ["Review Capacity Expansion Plan", "ctx-scenario-capacity"],
    ["Review Expand Capacity", "ctx-decision-capacity"],
    ["Review Capacity Expansion", "ctx-execution-capacity"],
  ] as const;
  for (const [utterance, subjectId] of cases) {
    const result = run(utterance);
    assert.equal(result.nextRuntimeState.focusedSubject?.id, subjectId);
    assert.equal(result.contextResult.context.primarySubject?.subjectId, subjectId);
    assert.equal(result.decisionCommitmentResult, null);
    assert.equal(result.nextDecisionSession?.pendingConfirmation ?? null, null);
  }
});

test("N — explicit safe action supersedes an unrelated pending question", () => {
  const { risk, descriptor, grounding } = riskAction();
  const pending = createNexoraPendingTurnExpectation({
    expectationId: "ux4-fix3-evidence",
    questionKind: "show-evidence",
    expectedAnswerKind: "confirmation",
    subjectId: "obj-risk",
    sourceCapability: "CC:5",
    consequential: false,
    confirmationLevel: "none",
  });
  const result = run("Review Margin Pressure", {
    state: risk,
    grounding,
    pending,
  });
  assert.equal(result.nextRuntimeState.focusedSubject?.id, descriptor.targetSubjectId);
  assert.equal(result.pendingTurnResolution?.status, "interrupted");
});

test("O — FIX2 greeting confirmation remains review, never commitment", () => {
  const capacity = run("Focus on Capacity");
  const greeting = run("Hi", { previous: capacity });
  const yes = run("yes", { previous: greeting });
  assert.notEqual(yes.intentResult.intent.kind, "commit-decision");
  assert.equal(yes.decisionCommitmentResult, null);
});

test("P–R — Stage, Professional Advisor, and contextual fallback regressions remain intact", () => {
  const reviewed = run("Review Capacity Gap");
  const base = deriveNexoraMVPStageInteractionPresentation(
    reviewed.nextRuntimeState,
  );
  const grammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const network = applyExecutiveNetworkTopologyToStagePresentation(grammar);
  const plane = applyExecutivePresentationPlaneToStagePresentation(network);
  const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(plane);
  const recomposed =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(flat);
  const stage = applyExecutiveStageFixedCameraToStagePresentation(recomposed);
  const focused = stage.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.deepEqual(focused.targetPosition, [
    EXECUTIVE_STAGE_2D_CENTER.x,
    EXECUTIVE_STAGE_2D_CENTER.y,
    0,
  ]);
  assert.ok(
    stage.scene.objects.every((object) => object.targetPosition[2] === 0),
  );

  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-ux3="professional-advisor"/);
  assert.match(html, /Situation/);
  assert.match(html, /Next Action/);

  const explanation = run("explain", { state: focus("obj-capacity") });
  assert.equal(explanation.intentResult.intent.kind, "situation");
  assert.doesNotMatch(explanation.response, /map.*command/i);
});
