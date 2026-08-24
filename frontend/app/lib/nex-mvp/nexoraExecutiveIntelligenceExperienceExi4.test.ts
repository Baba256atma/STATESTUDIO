/**
 * EXI:4 — Executive Intelligence Presentation Consolidation invariants A–T.
 *
 * Presentation-only. Does not create Core intelligence.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { NexoraAdvisorView } from "../../executive/nex-mvp/intelligence/NexoraAdvisorView.tsx";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_EXI4_PRESENTATION_BOUNDARY,
  NEXORA_EXI_EXPERIENCE_BOUNDARY,
  applyNexoraExecutiveIntelligenceExperienceToAdvisor,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  nexoraExi4PresentationIdentity,
  nexoraExecutiveIntelligenceExperienceIdentity,
  projectNexoraExiConversationalAnswers,
} from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPObjectInteractionState,
} from "./nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "./nexoraMVPPresentationState.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { nexoraManagerMvpReleaseBaselineIdentity } from "./nexoraManagerMvpReleaseBaseline.ts";

const here = dirname(fileURLToPath(import.meta.url));

function selectSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
): NexoraMVPObjectInteractionState {
  const next = selectNexoraMVPInteractionSubject(state, subjectId);
  return syncNexoraMVPObjectInteractionShellContext(next, {
    workspace: next.workspace,
    presentationState: "minimum",
    environmentIntent: next.environmentIntent,
  });
}

function pipeline(subjectId: string | null, collection?: "problem") {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (collection === "problem") {
    state = openNexoraMVPExecutiveQueueCollection(state, "problem");
  } else if (subjectId != null) {
    state = selectSubject(state, subjectId);
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomposition =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  const presentation =
    applyExecutiveStageFixedCameraToStagePresentation(withRecomposition);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
  const intelligenceContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge,
    presentationViewModel,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
    breadcrumb: advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(intelligenceContext);
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolution.advisor,
    insight: resolution.insight,
    intelligence: intelligenceContext,
    advisorBridge,
    nextBestAction: advisorBridge.nextBestAction,
    decisionBrief: advisorBridge.decisionBrief,
    decisionMemory: advisorBridge.decisionMemory,
  });
  const experience = composeNexoraExecutiveIntelligenceExperience({
    narrative,
    presentationMode: advisorBridge.presentationMode,
    liveOutcomeAvailable: false,
    liveLearningAvailable: false,
    cc11Live: false,
  });
  return Object.freeze({
    state,
    presentation,
    narrative,
    experience,
    resolution,
    advisorBridge,
  });
}

function renderAdvisor(subjectId: string | null) {
  const pack = pipeline(subjectId);
  const narrative = applyNexoraExecutiveIntelligenceExperienceToAdvisor(
    pack.narrative,
    pack.experience,
  );
  const html = renderToStaticMarkup(
    React.createElement(NexoraAdvisorView, {
      viewModel: pack.resolution.advisor,
      onAction: () => undefined,
      narrative,
      intelligenceExperience: pack.experience,
    }),
  );
  return Object.freeze({ ...pack, narrative, html });
}

function visible(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

function ask(pack: ReturnType<typeof pipeline>, utterance: string) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: pack.state,
    advisorGrounding: Object.freeze({
      isOverview: pack.experience.isOverview,
      currentSubjectId: pack.experience.subjectId,
      currentSubjectLabel: pack.experience.subjectLabel,
      attentionSubjectId: pack.experience.attentionSubjectId,
      attentionReason: pack.narrative.attentionReason,
      attentionSubjectLabel: pack.narrative.attentionSubjectLabel,
      situation: pack.experience.situation.statement,
      whyItMatters: pack.experience.significance.statement,
      recommendation: pack.narrative.recommendation,
      noRecommendationReason: pack.narrative.noRecommendationReason,
      primaryActionLabel: pack.narrative.primaryAction?.label ?? null,
      evidenceState: pack.narrative.evidenceState,
      evidenceSummary: pack.narrative.evidenceSummary,
      recommendationAuthority: pack.narrative.recommendationAuthority,
      experienceAnswers: projectNexoraExiConversationalAnswers(pack.experience),
    }),
  });
}

test("EXI:4 is a presentation layer over EXI:1", () => {
  assert.equal(
    nexoraExecutiveIntelligenceExperienceIdentity,
    "EXI:1/NexoraExecutiveIntelligenceExperience",
  );
  assert.equal(
    nexoraExi4PresentationIdentity,
    "EXI:4/ExecutiveIntelligencePresentation",
  );
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.presentationOnly, true);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.ownsReasoning, false);
  const pack = pipeline(null);
  assert.equal(pack.experience.presentation.identity, nexoraExi4PresentationIdentity);
});

test("A — Presentation-only: EXI:4 creates no new intelligence claims", () => {
  const source = readFileSync(
    join(here, "nexoraExecutiveIntelligenceExperienceExi4.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /projectGroundedCausalConstraintIntelligence|rankExecutivePriority|compareExecutiveTradeoffs/);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.inventsClaims, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.ownsReasoning, false);
  const pack = pipeline("ctx-problem-capacity");
  assert.equal(
    pack.experience.presentation.contributorStatement,
    pack.experience.causes.statement,
  );
  assert.equal(
    pack.experience.presentation.constraintStatement,
    pack.experience.constraints.statement,
  );
});

test("B — Core priority parity: Top Priority matches CORE-INT:4", () => {
  const { experience, html } = renderAdvisor(null);
  const top = experience.corePriorityAssessment.topPriority;
  assert.ok(top);
  assert.equal(experience.presentation.topPriorityLabel, top.subjectLabel);
  assert.match(html, /data-testid="nexora-advisor-top-priority"/);
  assert.match(visible(html), new RegExp(top.subjectLabel));
});

test("C — Attention parity: Needs Attention remains separate", () => {
  const { experience, html, narrative } = renderAdvisor(null);
  assert.match(html, /data-testid="nexora-advisor-attention"/);
  assert.match(visible(html), /Needs Attention/);
  assert.notEqual(
    experience.corePriorityAssessment.topPriority?.subjectId,
    experience.attentionSubjectId,
  );
  assert.ok(narrative.attentionSubjectLabel);
  assert.notEqual(
    experience.presentation.topPriorityLabel,
    narrative.attentionSubjectLabel,
  );
});

test("D — Cause wording: generic relation is never displayed as proven cause", () => {
  const { html, experience } = renderAdvisor("obj-risk");
  const text = visible(html);
  assert.doesNotMatch(text, /\bcaused\b|\bcauses\b|\bdriving\b/i);
  assert.doesNotMatch(experience.presentation.contributorStatement ?? "", /\bcaused\b/i);
  assert.match(html, /Possible contributors/);
});

test("E — Root cause: no Root Cause section when Core has none", () => {
  const { html, experience } = renderAdvisor("ctx-problem-capacity");
  assert.equal(experience.coreCausalAssessment.rootCause, null);
  assert.equal(experience.presentation.showRootCause, false);
  assert.doesNotMatch(visible(html), /Root Cause/);
  assert.match(visible(html), /Root cause has not been established/);
});

test("F — Constraint wording: recorded ≠ binding", () => {
  const { html, experience } = renderAdvisor("ctx-problem-capacity");
  assert.equal(experience.coreConstraintAssessment.bindingConstraint, null);
  assert.equal(experience.presentation.constraintTitle, "Recorded Constraints");
  assert.match(visible(html), /Recorded Constraints/);
  assert.doesNotMatch(visible(html), /Binding Constraint/);
  assert.match(
    visible(html),
    /Nexora has not established which constraint is binding/,
  );
});

test("G — Epistemic parity: FACT / ASSUMPTION / PREDICTION / UNKNOWN meaning preserved", () => {
  const problem = pipeline("ctx-problem-capacity");
  const scenario = pipeline("ctx-scenario-pricing");
  const observation =
    problem.experience.epistemicFoundation.observation ??
    problem.experience.epistemicFoundation.interpretation;
  assert.ok(observation);
  assert.equal(
    problem.experience.presentation.observed ??
      problem.experience.presentation.interpretation,
    observation.managerStatement,
  );
  assert.ok(
    ["FACT", "ASSUMPTION", "PREDICTION", "UNKNOWN"].includes(
      observation.claim.type,
    ),
  );
  assert.equal(scenario.experience.presentation.situationTitle, "Projected Effect");
  const { html } = renderAdvisor("ctx-scenario-pricing");
  assert.match(visible(html), /Projected Effect/);
});

test("H — Confidence parity: no confidence upgrade", () => {
  const pack = pipeline("ctx-problem-capacity");
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.upgradesConfidence, false);
  assert.match(pack.experience.presentation.confidenceLabel, /Evidence limited|Unknown|Evidence strong/);
  assert.doesNotMatch(pack.experience.presentation.confidenceLabel, /%/);
  assert.notEqual(pack.experience.evidence.confidence, "strong");
});

test("I — Trade-off parity: option cards match CORE-INT:5", () => {
  const pack = pipeline("obj-revenue");
  const cards = pack.experience.presentation.optionCards;
  const core = pack.experience.coreTradeoffAssessment.options;
  assert.equal(cards.length, core.length);
  assert.ok(cards.some((card) => card.title === "Pricing Response"));
  assert.ok(cards.some((card) => card.title === "Demand Surge"));
  const { html } = renderAdvisor("obj-revenue");
  assert.match(html, /data-exi4="option-cards"/);
  assert.match(html, /data-option-count="2"/);
});

test("J — Missing dimensions remain visible", () => {
  const { html, experience } = renderAdvisor("obj-revenue");
  assert.ok(experience.presentation.missingNotes.includes("Cost unknown"));
  assert.ok(experience.presentation.missingNotes.includes("Time unknown"));
  assert.match(visible(html), /Cost unknown/);
  assert.match(visible(html), /Time unknown/);
  assert.doesNotMatch(visible(html), /No downside/);
});

test("K — Recommendation authority is unchanged", () => {
  const pack = pipeline("obj-revenue");
  assert.ok(
    ["nba", "decision-brief", "data-reality", "advisor-intelligence", "none"].includes(
      pack.experience.recommendationAuthority,
    ),
  );
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.inventsRecommendations, false);
});

test("L — Recommendation is not a decision", () => {
  const { html } = renderAdvisor("ctx-decision-reprice");
  const text = visible(html);
  assert.match(text, /Nexora Recommendation/);
  assert.doesNotMatch(text, /\bWinner\b|\bSelected\b|\bApproved\b|\bChosen\b/);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.commitsDecisions, false);
});

test("M — Advisor and conversation share meaning", () => {
  const pack = pipeline("ctx-problem-capacity");
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  assert.equal(answers.causes, pack.experience.presentation.contributorStatement);
  assert.equal(answers.constraints, pack.experience.presentation.constraintStatement);
  const causing = ask(pack, "What may be causing this?");
  assert.ok(
    causing.response.includes(
      pack.experience.presentation.contributorStatement?.slice(0, 24) ?? "sentinel",
    ),
  );
  assert.doesNotMatch(causing.response, /Capacity Gap caused this/i);
});

test("N — No duplicated primary intelligence sections", () => {
  const { html } = renderAdvisor("obj-revenue");
  assert.equal((html.match(/data-testid="nexora-advisor-recommendation"/g) ?? []).length, 1);
  assert.equal((html.match(/data-testid="nexora-advisor-contributors"/g) ?? []).length, 1);
  assert.equal((html.match(/data-testid="nexora-advisor-tradeoffs"/g) ?? []).length, 1);
  const overview = renderAdvisor(null);
  assert.doesNotMatch(overview.html, /data-testid="nexora-advisor-contributors"/);
  assert.doesNotMatch(overview.html, /data-testid="nexora-advisor-tradeoffs"/);
});

test("O — Stage topology and focus are unchanged", () => {
  const pack = pipeline("obj-revenue");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.changesStageTopology, false);
});

test("P — Queue is not independently re-ranked", () => {
  const pack = pipeline(null, "problem");
  const overlay = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx"),
    "utf8",
  );
  assert.doesNotMatch(overlay, /Top Priority|numericalScore|re-?rank/);
  assert.ok(pack.advisorBridge != null);
});

test("Q — Decision safety: no mutation", () => {
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.commitsDecisions, false);
  const source = readFileSync(
    join(here, "nexoraExecutiveIntelligenceExperienceExi4.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /confirmDecision|commitDecision|applyDecision/);
});

test("R — Execution safety: no mutation", () => {
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.mutatesExecution, false);
  const { experience } = renderAdvisor("ctx-execution-capacity");
  assert.equal(experience.presentation.defaultDisclosure, "calm");
});

test("S — APP-4 safety: no writes", () => {
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.writesMemory, false);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.writesFocus, false);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.usesLlm, false);
  assert.equal(NEXORA_EXI4_PRESENTATION_BOUNDARY.startsOutcomeLearning, false);
});

test("T — Frozen MVP identity and manager language", () => {
  assert.equal(
    nexoraManagerMvpReleaseBaselineIdentity,
    "MVP:1/NexoraManagerMVPReleaseBaseline",
  );
  const { html } = renderAdvisor("obj-revenue");
  const text = visible(html);
  assert.doesNotMatch(
    text,
    /CORE-INT|EXI:|SemanticConfidence|EvidenceBoundedRelationship|comparisonStatus|numericalScore|provenance ID|claim ID/,
  );
  assert.equal(classifyNexoraExiUtterance("Compare the options."), "compare");
  const back = stepBackNexoraMVPObjectInteraction(pipeline("obj-revenue").state);
  assert.equal(back.focusedSubject, null);
});

test("Single option is not a multi-column comparison", () => {
  const { html, experience } = renderAdvisor("ctx-scenario-capacity");
  assert.equal(experience.presentation.optionCards.length, 1);
  assert.equal(experience.presentation.comparable, false);
  assert.match(visible(html), /One evaluated option is currently available/);
  assert.match(html, /data-exi3="single-option"/);
  assert.doesNotMatch(html, /data-option-count="2"/);
});
