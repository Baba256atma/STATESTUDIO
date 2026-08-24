/**
 * EXI:2 — Grounded cause, constraint, and trade-off invariants A–V.
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
  NEXORA_EXI2_ENRICHMENT_BOUNDARY,
  NEXORA_EXI_EXPERIENCE_BOUNDARY,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  nexoraExi2EnrichmentIdentity,
  nexoraExecutiveIntelligenceExperienceIdentity,
  phraseNexoraExiRelation,
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

test("EXI:2 reuses the EXI:1 contract", () => {
  assert.equal(
    nexoraExecutiveIntelligenceExperienceIdentity,
    "EXI:1/NexoraExecutiveIntelligenceExperience",
  );
  assert.equal(nexoraExi2EnrichmentIdentity, "EXI:2/GroundedCauseConstraintTradeoff");
  assert.equal(NEXORA_EXI2_ENRICHMENT_BOUNDARY.inventsCausation, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.ownsReasoning, false);
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.identity, nexoraExecutiveIntelligenceExperienceIdentity);
  assert.equal(pack.experience.enrichment, nexoraExi2EnrichmentIdentity);
});

test("A — Relationship is not presented as causation", () => {
  const pack = pipeline("obj-risk");
  const text = pack.experience.causes.statement ?? "";
  assert.doesNotMatch(text, /\bcaused\b|\bcauses\b|\bdriving\b/i);
  assert.match(text, /related|associated|does not establish a cause/i);
});

test("B — Supported contributor uses qualified wording", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(pack.experience.causeAssessment.contributors.length >= 1);
  assert.match(pack.experience.causes.statement ?? "", /may be contributing|possible contributor|recorded constraint/i);
  assert.doesNotMatch(pack.experience.causes.statement ?? "", /\bcaused\b/i);
});

test("C — Missing contributor produces an honest empty state", () => {
  const pack = pipeline("obj-inventory");
  assert.match(
    pack.experience.causes.statement ?? "",
    /enough evidence to identify a cause|does not establish a cause/i,
  );
  assert.doesNotMatch(pack.experience.causes.statement ?? "", /\bcaused\b|\bcauses\b/i);
});

test("D — Constraints come only from recorded constraint relationships", () => {
  const capacity = pipeline("obj-capacity");
  assert.ok(capacity.experience.constraintAssessment.constraints.length >= 1);
  assert.ok(
    capacity.experience.constraintAssessment.constraints.every(
      (entry) =>
        entry.constraintType === "recorded-limit" ||
        entry.constraintType === "recorded-blocker",
    ),
  );
  const inventory = pipeline("obj-inventory");
  assert.equal(inventory.experience.constraintAssessment.constraints.length, 0);
  assert.match(inventory.experience.constraints.statement ?? "", /No validated constraint/i);
});

test("E — Binding constraint is not invented when unranked", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.constraintAssessment.bindingConstraint, null);
  if (pack.experience.constraintAssessment.constraints.length > 1) {
    assert.match(pack.experience.constraints.statement ?? "", /cannot yet determine which one is binding/i);
  }
});

test("F — Trade-offs come from existing Scenario/Decision authority", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.ok(
    pack.experience.tradeoffs.authority === "scenario-fixture" ||
      pack.experience.tradeoffs.authority === "decision-brief" ||
      pack.experience.tradeoffs.authority === "professional-advisor" ||
      pack.experience.tradeoffs.authority === "missing",
  );
  assert.equal(pack.experience.tradeoffAssessment.options.length >= 1, true);
});

test("G — No synthetic quantitative trade-off", () => {
  const pack = pipeline("ctx-scenario-pricing");
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /\bROI\b|\bsavings\b|probability \d/i);
  const source = readFileSync(join(here, "nexoraExecutiveIntelligenceExperienceGrounding.ts"), "utf8");
  assert.doesNotMatch(source, /Math\.random|inventedRoi|syntheticTradeoff/);
});

test("H — One option is not a multi-option comparison", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.equal(pack.experience.tradeoffAssessment.options.length, 1);
  assert.match(pack.experience.tradeoffs.statement ?? "", /One evaluated option is currently available/i);
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /compared against|comparison of options/i);
});

test("I — No fabricated option", () => {
  const pack = pipeline("obj-inventory");
  assert.equal(pack.experience.tradeoffAssessment.options.length, 0);
  assert.match(
    pack.experience.options.statement ?? pack.experience.tradeoffs.statement ?? "",
    /No evaluated option is currently available/i,
  );
});

test("J — Existing recommendation remains authority", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(
    ["nba", "decision-brief", "data-reality", "advisor-intelligence", "none"].includes(
      pack.experience.recommendationAuthority,
    ),
  );
  assert.equal(NEXORA_EXI2_ENRICHMENT_BOUNDARY.inventsRecommendations, false);
});

test("K — Recommendation rationale is not invented", () => {
  const pack = pipeline("ctx-decision-capacity");
  if (!pack.narrative.recommendationRationale) {
    assert.equal(pack.experience.tradeoffAssessment.recommendationAlignment, null);
  } else {
    assert.equal(
      pack.experience.tradeoffAssessment.recommendationAlignment,
      pack.narrative.recommendationRationale,
    );
  }
});

test("L — Surfaced cause/constraint/trade-off has traceable evidence", () => {
  const pack = pipeline("obj-capacity");
  for (const contributor of pack.experience.causeAssessment.contributors) {
    assert.ok(contributor.evidence.length > 0);
  }
  for (const constraint of pack.experience.constraintAssessment.constraints) {
    assert.ok(constraint.evidence.length > 0);
  }
});

test("M — Advisor consumes EXI:2 assessment", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.causes.statement, pack.experience.causeAssessment.summary.statement);
  assert.equal(
    pack.experience.constraints.statement,
    pack.experience.constraintAssessment.summary.statement,
  );
});

test("N — Conversation returns the same meaning", () => {
  const pack = pipeline("obj-capacity");
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  const causing = ask(pack, "What is causing this?");
  assert.ok(
    causing.response.includes("contribut") ||
      causing.response.includes("constraint") ||
      causing.response.includes("evidence") ||
      causing.response.includes(answers.causes.slice(0, 40)),
  );
});

test("O — Follow-up continuity stays on the subject", () => {
  const pack = pipeline("ctx-problem-capacity");
  const subject = pack.experience.subjectId;
  const cause = ask(pack, "What is causing this?");
  const sure = ask(pack, "How sure are you?");
  const blocking = ask(pack, "What is blocking us?");
  const options = ask(pack, "What are my options?");
  const tradeoffs = ask(pack, "What are the trade-offs?");
  assert.equal(pack.experience.subjectId, subject);
  assert.ok(cause.response.length > 8);
  assert.match(sure.response, /Evidence limited|Not enough evidence/i);
  assert.ok(blocking.response.length > 8);
  assert.ok(options.response.length > 8);
  assert.ok(tradeoffs.response.length > 8);
});

test("P — Overview does not steal focus", () => {
  const pack = pipeline(null);
  assert.equal(pack.state.focusedSubject, null);
  assert.equal(pack.experience.subjectId, null);
  assert.equal(pack.experience.isOverview, true);
});

test("Q — Trade-off discussion does not commit", () => {
  assert.equal(NEXORA_EXI2_ENRICHMENT_BOUNDARY.commitsDecisions, false);
  const pack = pipeline("ctx-decision-capacity");
  assert.doesNotMatch(pack.experience.tradeoffs.statement ?? "", /committed|has decided/i);
});

test("R — Blocker explanation does not mutate execution", () => {
  const pack = pipeline("ctx-execution-capacity");
  assert.match(pack.experience.situation.statement ?? "", /not tracking live delivery/i);
  assert.equal(NEXORA_EXI2_ENRICHMENT_BOUNDARY.mutatesRuntime, false);
});

test("S — Outcome/Learning are not fabricated", () => {
  const pack = pipeline("obj-capacity");
  assert.match(
    pack.experience.outcome.statement ?? "",
    /No live Outcome|No validated actual outcome/i,
  );
  assert.match(pack.experience.learning.statement ?? "", /No promoted Learning/i);
});

test("T — Frozen Stage z=0 / fixed camera / focus preserved", () => {
  const pack = pipeline("obj-capacity");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
});

test("U — Navigation identity is preserved", () => {
  const pack = pipeline("obj-capacity");
  const back = stepBackNexoraMVPObjectInteraction(pack.state);
  assert.equal(back.focusedSubject, null);
});

test("V — Manager language has no architecture jargon", () => {
  const pack = pipeline("obj-capacity");
  const blob = [
    pack.experience.causes.statement,
    pack.experience.constraints.statement,
    pack.experience.tradeoffs.statement,
  ].join(" ");
  assert.doesNotMatch(blob, /RDI|PM:|EI:1|EXI:2|flowDomain|APP-4|CC:11|resolver|runtime/);
  assert.equal(phraseNexoraExiRelation("constrained-by"), "constrained by");
  assert.equal(phraseNexoraExiRelation("explored-by"), "evaluated through");
  assert.equal(phraseNexoraExiRelation("related-to"), "is related to");
  assert.equal(classifyNexoraExiUtterance("What may be contributing to this?"), "causes");
  assert.equal(classifyNexoraExiUtterance("How sure are you?"), "confidence");
  assert.equal(classifyNexoraExiUtterance("Why do you say that?"), "evidenceFollowup");
});
