/**
 * UX:4 — Working Nexora Chat invariants A–O.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraConversationalExperience } from "../../executive/nex-mvp/NexoraConversationalExperience.tsx";
import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import {
  CONVERSATIONAL_EXPERIENCE_BOUNDARY,
  type NexoraConversationalMessage,
} from "../conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { EXECUTIVE_DECISION_COMMITMENT_BOUNDARY } from "../conversational-control/executiveDecisionCommitment.ts";
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

function run(
  utterance: string,
  options?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly context?: {
      readonly currentSubjectId?: string | null;
      readonly previousSubjectIds?: readonly string[];
    };
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: options?.context?.currentSubjectId ?? null,
      previousSubjectIds: Object.freeze(
        options?.context?.previousSubjectIds ?? [],
      ),
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: options?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: `ux4-${utterance}`,
  });
}

test("A — greeting produces a visible professional Nexora response", () => {
  const result = run("Hi");
  assert.equal(result.status, "applied");
  assert.equal(result.intentResult.intent.kind, "greet");
  assert.equal(result.nexoraMessage.role, "nexora");
  assert.match(result.response, /^Hi\. I’m ready\./);
  assert.doesNotMatch(result.response, /map that to a Nexora command/i);
});

test("B — Capacity + Why resolves the implicit current subject", () => {
  const capacity = run("Focus on Capacity");
  const why = run("Why?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(why.intentResult.intent.kind, "explain");
  assert.equal(why.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.match(why.response, /Capacity/i);
});

test("C — recommendation response comes from CC:8 authority", () => {
  const capacity = run("Focus on Capacity");
  const recommendation = run("What should I do?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.ok(recommendation.recommendationResult);
  assert.equal(
    recommendation.response.includes(
      recommendation.recommendationResult!.primaryRecommendation?.summary ?? "",
    ),
    true,
  );
});

test("D — evidence response only presents structured CC:8 evidence", () => {
  const capacity = run("Focus on Capacity");
  const evidence = run("What evidence do we have?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(evidence.intentResult.intent.kind, "evidence");
  assert.ok(evidence.recommendationResult);
  if (evidence.recommendationResult!.trace.evidenceFactIds.length === 0) {
    assert.match(evidence.response, /Evidence is currently limited/);
  } else {
    assert.match(evidence.response, /Evidence:/);
  }
  assert.doesNotMatch(evidence.response, /\b(?:fact|runtime):[a-z0-9:-]+\b/i);
});

test("E — conversational focus uses canonical Stage interaction", () => {
  const customer = run("Focus on Customer");
  assert.equal(customer.shouldCommitRuntime, true);
  assert.equal(customer.commandResult?.command?.kind, "focus-subject");
  assert.equal(customer.nextRuntimeState.focusedSubject?.id, "obj-customer");
});

test("F — Show overview uses the canonical overview reset", () => {
  const capacity = run("Focus on Capacity");
  const overview = run("Show overview", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(overview.commandResult?.command?.kind, "open-overview");
  assert.equal(overview.nextRuntimeState.focusedSubject, null);
  assert.equal(overview.nextRuntimeState.mode, "overview");
});

test("G — scenario questions preserve structured scenario authority", () => {
  const capacity = run("Focus on Capacity");
  const scenario = run("What happens if we do nothing for 3 months?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(scenario.intentResult.intent.kind, "explore-scenario");
  assert.ok(scenario.scenarioResult);
  assert.equal(scenario.scenarioResult!.scenario?.source, "conversation");
  assert.equal(scenario.scenarioResult!.scenario?.kind, "do-nothing");
  assert.deepEqual(scenario.scenarioResult!.scenario?.horizon, {
    amount: 3,
    unit: "month",
  });
  assert.match(scenario.response, /scenario|assumption|project/i);
});

test("H — preference remains distinct from commitment", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "I prefer Scenario B",
  });
  assert.equal(intent.intent.kind, "prefer-option");
  assert.equal(intent.intent.decisionCommitmentPayload?.strength, "preference");
  assert.equal(
    EXECUTIVE_DECISION_COMMITMENT_BOUNDARY.preferenceNeverEqualsCommitment,
    true,
  );
});

test("I — missing evidence is explicit and never fabricated", () => {
  const result = run("What needs my attention?");
  if (result.recommendationResult?.status === "insufficient-evidence") {
    assert.match(result.response, /don't have enough evidence/i);
  }
  assert.doesNotMatch(result.response, /definitely|guaranteed/i);
});

test("J — sending and technical failure states are manager-safe", () => {
  const messages: readonly NexoraConversationalMessage[] = Object.freeze([
    Object.freeze({
      id: "manager",
      role: "manager",
      text: "Why?",
    }),
    Object.freeze({
      id: "failure",
      role: "nexora",
      text: "Nexora couldn’t complete that request. Please try again.",
      status: "failed",
    }),
  ]);
  const html = renderToStaticMarkup(
    React.createElement(NexoraConversationalExperience, {
      messages,
      processing: true,
      onSubmitUtterance: () => undefined,
    }),
  );
  assert.match(html, /Nexora is thinking/);
  assert.match(html, /couldn’t complete that request/);
  assert.doesNotMatch(html, /stack|provider|exception/i);
});

test("K — empty input cannot create a conversational turn", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraConversationalExperience, {
      messages: Object.freeze([]),
      processing: false,
      onSubmitUtterance: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-conversational-submit"/);
  assert.match(html, /disabled=""/);
  assert.equal(resolveNexoraConversationalIntent({ utterance: "   " }).intent.kind, "unknown");
});

test("L — Stage subject changes update the next implicit question", () => {
  const capacity = run("Focus on Capacity");
  const customer = run("Focus on Customer", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  const followUp = run("Why does this matter?", {
    state: customer.nextRuntimeState,
    context: customer.nextConversationContext,
  });
  assert.equal(followUp.contextResult.context.primarySubject?.subjectId, "obj-customer");
  assert.notEqual(followUp.contextResult.context.primarySubject?.subjectId, "obj-capacity");
});

test("M — conversation remains session-scoped and does not create durable memory", () => {
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.durableConversationMemory, false);
  const result = run("Hi");
  assert.equal("durableMemory" in result, false);
});

test("N — conversational focus preserves center, z=0, and fixed camera", () => {
  const customer = run("Focus on Customer");
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

test("O — Professional Advisor remains primary and Chat stays integrated", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-ux3="professional-advisor"/);
  assert.match(html, /data-testid="nexora-advisor-ask"/);
  assert.match(html, /Situation/);
  assert.match(html, /Ask Nexora/);
});
