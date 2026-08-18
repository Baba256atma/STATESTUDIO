/**
 * UX:4-FIX — contextual conversational fallback invariants A–M.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import type { NexoraConversationalAdvisorGrounding } from "../conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
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

function grounding(
  subject: "overview" | "capacity" | "customer",
): NexoraConversationalAdvisorGrounding {
  if (subject === "overview") {
    return Object.freeze({
      isOverview: true,
      currentSubjectId: null,
      currentSubjectLabel: null,
      attentionSubjectId: "obj-risk",
      attentionSubjectLabel: "Risk",
      attentionReason:
        "Risk currently has the strongest validated attention signal.",
      situation:
        "There is no explicit subject. Nexora is showing the executive overview.",
      whyItMatters: null,
      recommendation: null,
      noRecommendationReason: null,
      primaryActionLabel: "Investigate Risk",
      evidenceState: "limited",
      evidenceSummary:
        "Evidence limited. Nexora does not yet have enough validated data to assess the executive overview confidently.",
      recommendationAuthority: "none",
    });
  }
  const capacity = subject === "capacity";
  return Object.freeze({
    isOverview: false,
    currentSubjectId: capacity ? "obj-capacity" : "obj-customer",
    currentSubjectLabel: capacity ? "Capacity" : "Customer",
    attentionSubjectId: null,
    attentionSubjectLabel: null,
    attentionReason: null,
    situation: capacity
      ? "Capacity is currently in a state that needs attention."
      : "Customer is currently in a state that needs attention.",
    whyItMatters: capacity
      ? "Capacity is related to Budget."
      : "Customer is related to Revenue.",
    recommendation: capacity
      ? "Review Capacity Gap"
      : "Review Customer Retention",
    noRecommendationReason: null,
    primaryActionLabel: capacity
      ? "Review Capacity Gap"
      : "Review Customer Retention",
    evidenceState: "strong",
    evidenceSummary: "Evidence strong.",
    recommendationAuthority: "decision-brief",
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
    readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
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
    messageIdSeed: `ux4-fix-${utterance}`,
    advisorGrounding: options?.advisorGrounding ?? null,
  });
}

function focus(subject: "Capacity" | "Customer") {
  return run(`Focus on ${subject}`);
}

test("A — Capacity focused + explain uses grounded Advisor narrative", () => {
  const capacity = focus("Capacity");
  const result = run("explain", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
    advisorGrounding: grounding("capacity"),
  });
  assert.equal(result.intentResult.intent.kind, "situation");
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.match(result.response, /Capacity is currently/);
  assert.match(result.response, /related to Budget/);
  assert.match(result.response, /Recommendation: Review Capacity Gap/);
});

test("B — Customer focused + explain this resolves Customer", () => {
  const customer = focus("Customer");
  const result = run("explain this", {
    state: customer.nextRuntimeState,
    context: customer.nextConversationContext,
    advisorGrounding: grounding("customer"),
  });
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-customer");
  assert.match(result.response, /Customer/);
  assert.doesNotMatch(result.response, /Capacity/);
});

test("C — Overview + what's going on explains attention without focusing it", () => {
  const result = run("what's going on?", {
    advisorGrounding: grounding("overview"),
  });
  assert.equal(result.status, "applied");
  assert.equal(result.nextRuntimeState.focusedSubject, null);
  assert.match(result.response, /Executive Overview/);
  assert.match(result.response, /No explicit subject is selected/);
  assert.match(result.response, /Risk currently has the strongest validated attention signal/);
});

test("D — tell me more uses the current subject", () => {
  const customer = focus("Customer");
  const result = run("tell me more", {
    state: customer.nextRuntimeState,
    context: customer.nextConversationContext,
    advisorGrounding: grounding("customer"),
  });
  assert.equal(result.intentResult.intent.kind, "situation");
  assert.match(result.response, /Customer is currently/);
});

test("E — explain then Why preserves subject continuity", () => {
  const capacity = focus("Capacity");
  const explanation = run("explain", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
    advisorGrounding: grounding("capacity"),
  });
  const why = run("Why?", {
    state: explanation.nextRuntimeState,
    context: explanation.nextConversationContext,
    advisorGrounding: grounding("capacity"),
  });
  assert.equal(why.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.match(why.response, /Capacity/);
});

test("F — explain then recommendation uses existing Advisor authority", () => {
  const capacity = focus("Capacity");
  const explanation = run("explain", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
    advisorGrounding: grounding("capacity"),
  });
  const recommendation = run("What should I do?", {
    state: explanation.nextRuntimeState,
    context: explanation.nextConversationContext,
    advisorGrounding: grounding("capacity"),
  });
  assert.match(recommendation.response, /Recommendation: Review Capacity Gap/);
  assert.equal(grounding("capacity").recommendationAuthority, "decision-brief");
});

test("G — explicit focus remains a canonical Runtime command", () => {
  const result = focus("Customer");
  assert.equal(result.commandResult?.command?.kind, "focus-subject");
  assert.equal(result.shouldCommitRuntime, true);
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-customer");
});

test("H — greeting still works", () => {
  const result = run("Hi");
  assert.equal(result.intentResult.intent.kind, "greet");
  assert.match(result.response, /^Hi\. I’m ready\./);
});

test("I — unrelated input receives safe fallback without invented intelligence", () => {
  const result = run("purple elephant protocol", {
    advisorGrounding: grounding("capacity"),
  });
  assert.equal(result.intentResult.intent.kind, "unknown");
  assert.equal(result.status, "unsupported");
  assert.match(result.response, /not sure how that relates/i);
  assert.doesNotMatch(result.response, /Capacity|Customer|Risk/i);
});

test("J — manager-facing conversation contains no parser leakage", () => {
  const source = readFileSync(
    new URL(
      "../conversational-control/conversationalExperienceResponse.ts",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(source, /I couldn't map that to a Nexora command/);
  for (const utterance of ["explain", "tell me more", "purple elephant protocol"]) {
    assert.doesNotMatch(run(utterance).response, /map.*command|unsupported intent|resolver/i);
  }
});

test("K — substantive fallback without grounding remains evidence-limited", () => {
  const result = run("explain");
  assert.equal(result.status, "applied");
  assert.ok(result.recommendationResult);
  assert.ok(
    result.recommendationResult!.assessment.issues.length > 0 ||
      /Evidence is currently limited|validated situation/i.test(result.response),
  );
  assert.doesNotMatch(result.response, /definitely|guaranteed/i);
});

test("L — conversational focus preserves center, z=0, and fixed camera", () => {
  const customer = focus("Customer");
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

test("M — Professional Advisor hierarchy remains primary and unchanged", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-ux3="professional-advisor"/);
  assert.match(html, /Situation/);
  assert.match(html, /Next Action/);
  assert.match(html, /data-advisor-grammar="overview"/);
  assert.match(html, /data-testid="nexora-advisor-ask"/);
});
