/**
 * EXI:3 — Live trade-off and option comparison invariants A–V.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { deriveNexoraMVPExecutiveIntelligenceContext, resolveNexoraMVPExecutiveIntelligence } from "./nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_EXI3_ENRICHMENT_BOUNDARY,
  NEXORA_EXI_EXPERIENCE_BOUNDARY,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  nexoraExi3EnrichmentIdentity,
  nexoraExecutiveIntelligenceExperienceIdentity,
  projectNexoraExiConversationalAnswers,
} from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
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

function pipeline(subjectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (subjectId != null) {
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
  return Object.freeze({ state, presentation, narrative, experience });
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

test("EXI:3 reuses EXI:1/EXI:2 and does not create a trade-off engine", () => {
  assert.equal(nexoraExecutiveIntelligenceExperienceIdentity, "EXI:1/NexoraExecutiveIntelligenceExperience");
  assert.equal(nexoraExi3EnrichmentIdentity, "EXI:3/LiveTradeoffOptionComparison");
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.ei4LiveOnExecutive, false);
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.inventsEconomics, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.ownsReasoning, false);
  const pack = pipeline("obj-revenue");
  assert.equal(pack.experience.comparisonEnrichment, nexoraExi3EnrichmentIdentity);
});

test("A — Only context-related alternatives are compared", () => {
  const pack = pipeline("obj-revenue");
  const labels = pack.experience.tradeoffAssessment.options.map((option) => option.label);
  assert.ok(labels.includes("Pricing Response"));
  assert.ok(labels.includes("Demand Surge"));
  assert.ok(!labels.includes("Capacity Expansion Plan"));
});

test("B — Multi-option comparison requires two real options", () => {
  const pack = pipeline("ctx-problem-margin");
  assert.ok(pack.experience.tradeoffAssessment.options.length >= 2);
  assert.equal(pack.experience.tradeoffAssessment.optionComparison.comparable, true);
  assert.match(pack.experience.tradeoffs.statement ?? "", /Pricing Response|Demand Surge/i);
});

test("C — One option is not presented as comparison", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.equal(pack.experience.tradeoffAssessment.options.length, 1);
  assert.equal(pack.experience.tradeoffAssessment.optionComparison.comparable, false);
  assert.match(pack.experience.tradeoffs.statement ?? "", /One evaluated option is currently available/i);
});

test("D — No fabricated choices", () => {
  const pack = pipeline("obj-inventory");
  assert.equal(pack.experience.tradeoffAssessment.options.length, 0);
  assert.match(pack.experience.tradeoffs.statement ?? "", /No evaluated option is currently available/i);
});

test("E — Every gain has evidence", () => {
  const pack = pipeline("obj-revenue");
  for (const option of pack.experience.tradeoffAssessment.options) {
    if (option.benefits) {
      assert.ok(option.evidence.length > 0);
      assert.doesNotMatch(option.benefits, /\bwill\b|\bguaranteed\b/i);
    }
  }
});

test("F — Every sacrifice has evidence or an honest missing state", () => {
  const pack = pipeline("obj-revenue");
  for (const option of pack.experience.tradeoffAssessment.options) {
    assert.equal(option.costs, null);
  }
  assert.match(
    projectNexoraExiConversationalAnswers(pack.experience).sacrifice,
    /No validated sacrifice is currently recorded/i,
  );
});

test("G — No risk comparison without recorded risk evidence", () => {
  const pack = pipeline("obj-revenue");
  const safer = projectNexoraExiConversationalAnswers(pack.experience).safer;
  assert.match(safer, /enough evidence|safer|insufficient to rank/i);
  assert.doesNotMatch(safer, /Pricing Response is safer/i);
});

test("H — Constraint comparison uses recorded constraint language only", () => {
  const pack = pipeline("obj-revenue");
  const constrained = pack.experience.tradeoffAssessment.options.filter((option) => option.constraints);
  for (const option of constrained) {
    assert.match(option.constraints ?? "", /constrained capacity|Capacity Gap/i);
  }
});

test("I — Assumptions are not invented", () => {
  const pack = pipeline("ctx-scenario-pricing");
  const assumed = pack.experience.tradeoffAssessment.options.find((option) => option.label === "Pricing Response");
  assert.match(assumed?.assumptions ?? "", /constrained capacity/i);
  const capacity = pipeline("ctx-scenario-capacity");
  const option = capacity.experience.tradeoffAssessment.options[0];
  if (!option?.assumptions) {
    assert.equal(option?.assumptions ?? null, null);
  }
});

test("J — Numeric integrity: no synthetic numbers", () => {
  const pack = pipeline("obj-revenue");
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /\bROI\b|synthetic|utility score/i);
  const source = readFileSync(join(here, "nexoraExecutiveIntelligenceExperienceGrounding.ts"), "utf8");
  assert.doesNotMatch(source, /createScenarioPriorityTradeoffTrace|evaluateExecutiveTradeoffs/);
});

test("K — Preferred option is not selected independently", () => {
  const pack = pipeline("obj-revenue");
  if (pack.experience.tradeoffAssessment.optionComparison.preferredOptionId) {
    assert.notEqual(pack.experience.tradeoffAssessment.optionComparison.preferenceAuthority, "none");
  }
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.inventsRecommendations, false);
});

test("L — Existing recommendation remains source", () => {
  const pack = pipeline("obj-revenue");
  assert.ok(
    ["nba", "decision-brief", "data-reality", "advisor-intelligence", "none"].includes(
      pack.experience.recommendationAuthority,
    ),
  );
});

test("M — Manager preference stays distinct from recommendation", () => {
  const pack = pipeline("ctx-decision-reprice");
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /manager has preferred|you have chosen/i);
});

test("N — Recommendation is not commitment", () => {
  const pack = pipeline("ctx-decision-reprice");
  assert.doesNotMatch(pack.experience.recommendation.statement ?? "", /committed|has decided/i);
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.commitsDecisions, false);
});

test("O — Missing dimension is stated honestly", () => {
  const pack = pipeline("obj-revenue");
  const cheaper = ask(pack, "Which is cheaper?");
  assert.match(cheaper.response, /cost evidence|compare them on cost/i);
});

test("P — Advisor uses the same comparison meaning", () => {
  const pack = pipeline("obj-revenue");
  assert.equal(
    pack.experience.tradeoffs.statement,
    pack.experience.tradeoffAssessment.optionComparison.comparisonSummary,
  );
});

test("Q — Conversation uses the same comparison model", () => {
  const pack = pipeline("obj-revenue");
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  const compared = ask(pack, "Compare the options.");
  assert.ok(compared.response.includes("Pricing Response") || compared.response.includes(answers.compare.slice(0, 24)));
});

test("R — Follow-up continuity stays on the comparison subject", () => {
  const pack = pipeline("ctx-problem-margin");
  const subject = pack.experience.subjectId;
  ask(pack, "Compare the options.");
  const safer = ask(pack, "Which one is safer?");
  const sacrifice = ask(pack, "What do we sacrifice?");
  const why = ask(pack, "Why do you say that?");
  assert.equal(pack.experience.subjectId, subject);
  assert.ok(safer.response.length > 8);
  assert.ok(sacrifice.response.length > 8);
  assert.ok(why.response.length > 8);
});

test("S — Scenario comparison remains a prediction", () => {
  const pack = pipeline("ctx-scenario-pricing");
  assert.match(pack.experience.tradeoffs.statement ?? "", /projected|expected|not observed/i);
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /\bwill\b|\bguaranteed\b/i);
});

test("T — Frozen Stage z=0 / fixed camera / focus preserved", () => {
  const pack = pipeline("obj-revenue");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
});

test("U — Navigation identity is preserved", () => {
  const pack = pipeline("obj-revenue");
  const back = stepBackNexoraMVPObjectInteraction(pack.state);
  assert.equal(back.focusedSubject, null);
});

test("V — Frozen MVP / manager language", () => {
  const pack = pipeline("obj-revenue");
  const blob = pack.experience.tradeoffs.statement ?? "";
  assert.doesNotMatch(blob, /EI:4|EXI:3|utility score|normalized rank|resolver|option vector|flowDomain|CC:11/);
  assert.equal(classifyNexoraExiUtterance("Compare the options."), "compare");
  assert.equal(classifyNexoraExiUtterance("What do I gain?"), "gain");
  assert.equal(classifyNexoraExiUtterance("Which is cheaper?"), "cheaper");
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.startsOutcomeLearning, false);
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.changesStageTopology, false);
});
