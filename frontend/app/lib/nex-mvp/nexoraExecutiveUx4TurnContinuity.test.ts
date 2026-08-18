/**
 * UX:4-FIX2 — conversational turn continuity invariants A–P.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import type { NexoraConversationalAdvisorGrounding } from "../conversational-control/conversationalExperience.ts";
import type { NexoraPendingTurnExpectation } from "../conversational-control/conversationalTurnExpectation.ts";
import { createNexoraPendingTurnExpectation } from "../conversational-control/conversationalTurnExpectation.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createEmptyNexoraExecutiveDecisionSession,
  setPendingDecisionConfirmation,
  type NexoraExecutiveDecisionSession,
} from "../conversational-control/executiveDecisionAuthority.ts";
import { buildPendingDecisionConfirmation } from "../conversational-control/executiveDecisionConfirmation.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "./nexoraMVPObjectInteraction.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

type Result = ReturnType<typeof executeNexoraConversationalExperience>;

function run(
  utterance: string,
  options?: {
    readonly previous?: Result;
    readonly pending?: NexoraPendingTurnExpectation | null;
    readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
    readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext,
    conversationContext: previous?.nextConversationContext ?? Object.freeze({}),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    pendingTurnExpectation:
      options?.pending !== undefined
        ? options.pending
        : (previous?.nextPendingTurnExpectation ?? null),
    scenarioSession: previous?.nextScenarioSession,
    decisionSession:
      options?.decisionSession !== undefined
        ? options.decisionSession
        : previous?.nextDecisionSession,
    advisorGrounding: options?.advisorGrounding ?? null,
    messageIdSeed: `ux4-fix2-${utterance}`,
  });
}

function pending(
  questionKind:
    | "show-evidence"
    | "compare-scenarios"
    | "select-subject"
    | "select-scenario"
    | "decision-commitment",
  expectedAnswerKind:
    | "confirmation"
    | "subject-selection"
    | "scenario-selection"
    | "decision-option",
  subjectId: string | null,
  optionIds: readonly string[] = [],
) {
  return createNexoraPendingTurnExpectation({
    expectationId: `test-${questionKind}`,
    questionKind,
    expectedAnswerKind,
    subjectId,
    optionIds,
    sourceCapability:
      questionKind === "compare-scenarios" ||
      questionKind === "select-scenario"
        ? "CC:9"
        : questionKind === "decision-commitment"
          ? "CC:10"
          : "CC:5",
    consequential: questionKind === "decision-commitment",
    confirmationLevel:
      questionKind === "decision-commitment" ? "consequential" : "review",
  });
}

test("A — greeting review confirmation routes yes to review, not commitment", () => {
  const greeting = run("Hi");
  assert.equal(greeting.nextPendingTurnExpectation?.questionKind, "review-subject");
  const subjectId = greeting.nextPendingTurnExpectation!.subjectId;
  const yes = run("yes", { previous: greeting });
  assert.equal(yes.pendingTurnResolution?.answerKind, "affirmative");
  assert.equal(yes.commandResult?.command?.kind, "focus-subject");
  assert.equal(yes.nextRuntimeState.focusedSubject?.id, subjectId);
  assert.equal(yes.decisionCommitmentResult, null);
  assert.doesNotMatch(yes.response, /commit/i);
});

test("A2 — review confirmation does not refocus an already-current subject", () => {
  const capacity = run("Focus on Capacity");
  const greeting = run("Hi", { previous: capacity, pending: null });
  assert.equal(greeting.nextPendingTurnExpectation?.subjectId, "obj-capacity");
  const yes = run("yes", { previous: greeting });
  assert.equal(yes.nextRuntimeState, greeting.nextRuntimeState);
  assert.equal(yes.shouldCommitRuntime, false);
  assert.equal(yes.commandResult, null);
  assert.match(yes.response, /Capacity/);
});

test("B — no declines review without touching Decision authority", () => {
  const greeting = run("Hi");
  const no = run("no", { previous: greeting });
  assert.equal(no.status, "applied");
  assert.equal(no.pendingTurnResolution?.status, "declined");
  assert.equal(no.decisionCommitmentResult, null);
  assert.equal(no.nextPendingTurnExpectation, null);
  assert.match(no.response, /Understood/);
});

test("C — bare current entity is recognized", () => {
  const capacity = run("Focus on Capacity");
  const reference = run("capacity", { previous: capacity, pending: null });
  assert.equal(reference.status, "no-op");
  assert.equal(reference.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.match(reference.response, /already the current subject/i);
  assert.doesNotMatch(reference.response, /not sure how that relates/i);
});

test("D — bare entity switches through canonical focus", () => {
  const customer = run("Focus on Customer");
  const capacity = run("capacity", { previous: customer, pending: null });
  assert.equal(capacity.commandResult?.command?.kind, "focus-subject");
  assert.equal(capacity.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(capacity.shouldCommitRuntime, true);
});

test("E — evidence confirmation routes yes to evidence", () => {
  const capacity = run("Focus on Capacity");
  const evidence = run("yes", {
    previous: capacity,
    pending: pending("show-evidence", "confirmation", "obj-capacity"),
  });
  assert.equal(evidence.intentResult.intent.kind, "evidence");
  assert.ok(evidence.recommendationResult);
  assert.equal(evidence.decisionCommitmentResult, null);
});

test("F — scenario confirmation routes yes to CC:9, never CC:10", () => {
  const capacity = run("Focus on Capacity");
  const scenario = run("yes", {
    previous: capacity,
    pending: pending("compare-scenarios", "confirmation", "obj-capacity"),
  });
  assert.equal(scenario.intentResult.intent.kind, "compare-scenarios");
  assert.ok(scenario.scenarioResult);
  assert.equal(scenario.decisionCommitmentResult, null);
});

test("G — generic yes without a pending expectation cannot commit", () => {
  const yes = run("yes", { pending: null });
  assert.equal(yes.intentResult.intent.kind, "unknown");
  assert.equal(yes.decisionCommitmentResult, null);
  assert.equal(yes.status, "unsupported");
});

test("H — explicit interruption wins over pending review", () => {
  const greeting = run("Hi");
  const customer = run("Show Customer instead", { previous: greeting });
  assert.equal(customer.intentResult.intent.kind, "focus");
  assert.equal(customer.nextRuntimeState.focusedSubject?.id, "obj-customer");
  assert.equal(customer.pendingTurnResolution?.status, "interrupted");
  assert.equal(customer.nextPendingTurnExpectation, null);
});

test("I — answered or interrupted expectation cannot influence later yes", () => {
  const greeting = run("Hi");
  const customer = run("Show Customer instead", { previous: greeting });
  const yes = run("yes", { previous: customer });
  assert.equal(yes.intentResult.intent.kind, "unknown");
  assert.equal(yes.decisionCommitmentResult, null);
});

test("I2 — explicit subject change clears stale CC:10 confirmation", () => {
  const decisionSession = setPendingDecisionConfirmation(
    createEmptyNexoraExecutiveDecisionSession(),
    buildPendingDecisionConfirmation({
      candidateId: "candidate-b",
      requestedAction: "approve",
      commandId: "pending-command",
      workspaceId: "overview",
    }),
  );
  const customer = run("Show Customer", {
    pending: null,
    decisionSession,
  });
  assert.equal(customer.pendingTurnResolution?.status, "interrupted");
  assert.equal(customer.nextDecisionSession?.pendingConfirmation, null);
  const yes = run("yes", { previous: customer });
  assert.equal(yes.intentResult.intent.kind, "unknown");
  assert.equal(yes.decisionCommitmentResult, null);
});

test("J — explain it resolves the current conversational subject", () => {
  const customer = run("Focus on Customer");
  const explanation = run("explain it", {
    previous: customer,
    pending: null,
    advisorGrounding: Object.freeze({
      isOverview: false,
      currentSubjectId: "obj-customer",
      currentSubjectLabel: "Customer",
      attentionSubjectId: null,
      attentionSubjectLabel: null,
      attentionReason: null,
      situation: "Customer requires review.",
      whyItMatters: "Customer is related to Revenue.",
      recommendation: "Review Customer Retention",
      noRecommendationReason: null,
      primaryActionLabel: "Review Customer Retention",
      evidenceState: "strong",
      evidenceSummary: "Evidence strong.",
      recommendationAuthority: "decision-brief",
    }),
  });
  assert.equal(
    explanation.contextResult.context.primarySubject?.subjectId,
    "obj-customer",
  );
  assert.match(explanation.response, /Customer/i);
});

test("K — ambiguous short scenario selection asks instead of guessing", () => {
  const capacity = run("Focus on Capacity");
  const ambiguous = run("that one", {
    previous: capacity,
    pending: pending(
      "select-scenario",
      "scenario-selection",
      "obj-capacity",
      ["ctx-capacity-expansion-plan", "ctx-pricing-response"],
    ),
  });
  assert.equal(ambiguous.status, "clarification-required");
  assert.equal(ambiguous.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.match(ambiguous.response, /Which scenario/);
});

test("L — conversational subject and CC:7 subject remain synchronized", () => {
  const customer = run("customer", { pending: null });
  assert.equal(customer.nextRuntimeState.focusedSubject?.id, "obj-customer");
  assert.equal(
    customer.nextExecutiveContext.currentSubject?.subjectId,
    "obj-customer",
  );
});

test("M — resolved entity becomes the Stage focus and anchor", () => {
  const customer = run("customer", { pending: null });
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    customer.nextRuntimeState,
  );
  assert.equal(presentation.focusedSubjectId, "obj-customer");
  assert.equal(presentation.scene.focusedObjectId, "obj-customer");
});

test("N — turn continuity preserves center, z=0, and fixed camera", () => {
  const customer = run("customer", { pending: null });
  const base = deriveNexoraMVPStageInteractionPresentation(
    customer.nextRuntimeState,
  );
  const grammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const network = applyExecutiveNetworkTopologyToStagePresentation(grammar);
  const plane = applyExecutivePresentationPlaneToStagePresentation(network);
  const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(plane);
  const recomposed =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(flat);
  const presentation =
    applyExecutiveStageFixedCameraToStagePresentation(recomposed);
  const focused = presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.deepEqual(focused!.targetPosition, [
    EXECUTIVE_STAGE_2D_CENTER.x,
    EXECUTIVE_STAGE_2D_CENTER.y,
    0,
  ]);
  assert.ok(
    presentation.scene.objects.every((object) => object.targetPosition[2] === 0),
  );
});

test("O — Professional Advisor remains intact", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-ux3="professional-advisor"/);
  assert.match(html, /Situation/);
  assert.match(html, /Next Action/);
});

test("P — UX:4-FIX explain fallback remains functional", () => {
  const capacity = run("Focus on Capacity");
  const explain = run("explain", { previous: capacity, pending: null });
  assert.equal(explain.status, "applied");
  assert.equal(explain.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.doesNotMatch(explain.response, /map.*command|not sure how that relates/i);
});

test("scenario selection answer resolves through the existing subject registry", () => {
  const capacity = run("Focus on Capacity");
  const scenario = run("Capacity Expansion Plan", {
    previous: capacity,
    pending: pending(
      "select-scenario",
      "scenario-selection",
      "obj-capacity",
      ["ctx-scenario-capacity"],
    ),
  });
  assert.equal(scenario.pendingTurnResolution?.answerKind, "entity");
  assert.equal(
    scenario.nextRuntimeState.focusedSubject?.id,
    "ctx-scenario-capacity",
  );
});

test("pending-turn mechanics are session-only and never enter executive memory", () => {
  const greeting = run("Hi");
  assert.ok(greeting.nextPendingTurnExpectation);
  assert.deepEqual(
    greeting.nextExecutiveContext.pendingTurnExpectation,
    greeting.nextPendingTurnExpectation,
  );
  assert.equal("durableMemory" in greeting, false);
});
