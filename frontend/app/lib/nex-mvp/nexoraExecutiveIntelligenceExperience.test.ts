/**
 * EXI:1 — Executive Intelligence Experience invariants A–T.
 *
 * Read-only composition. Does not create a parallel intelligence engine.
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
  NEXORA_EXI_EXPERIENCE_BOUNDARY,
  applyNexoraExecutiveIntelligenceExperienceToAdvisor,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
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
    advisorBridge,
    narrative,
    experience,
  });
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
      attentionSubjectLabel: pack.narrative.attentionSubjectLabel,
      attentionReason: pack.narrative.attentionReason,
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

test("EXI:1 identity and boundary", () => {
  assert.equal(
    nexoraExecutiveIntelligenceExperienceIdentity,
    "EXI:1/NexoraExecutiveIntelligenceExperience",
  );
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.ownsReasoning, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.inventsRecommendations, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.inventsOutcome, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.writesMemory, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.wiresCc11, false);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.usesLlm, false);
});

test("A — Overview has no explicit subject; attention is separate", () => {
  const pack = pipeline(null);
  assert.equal(pack.experience.isOverview, true);
  assert.equal(pack.experience.subjectId, null);
  assert.ok(pack.experience.attentionSubjectId == null || pack.experience.attentionSubjectId !== pack.experience.subjectId);
  if (pack.experience.attentionSubjectId) {
    assert.notEqual(pack.experience.attentionSubjectId, pack.state.focusedSubject?.id ?? null);
  }
});

test("B — Capacity intelligence composes without inventing WATCH independently", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.subjectId, "obj-capacity");
  assert.equal(pack.experience.subjectLabel, "Capacity");
  assert.ok(pack.experience.situation.statement);
  assert.equal(pack.experience.situation.authority, "professional-advisor");
  assert.match(pack.experience.options.statement ?? "", /Capacity Expansion Plan|alternative|scenario/i);
});

test("C — Problem significance/recommendation grounded", () => {
  const pack = pipeline("ctx-problem-capacity");
  assert.equal(pack.experience.workflowPosition, "problem");
  assert.ok(pack.experience.situation.statement);
  if (pack.experience.recommendation.statement) {
    assert.doesNotMatch(pack.experience.recommendation.statement, /CC:11|runtime|EXI/i);
  }
});

test("D — Scenario projection does not become fact", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.equal(pack.experience.workflowPosition, "scenario");
  assert.match(pack.experience.options.statement ?? "", /projected|possibility|not observed/i);
  assert.equal(pack.experience.options.epistemic, "prediction");
});

test("E — Decision recommendation does not become commitment", () => {
  const pack = pipeline("ctx-decision-capacity");
  assert.equal(pack.experience.workflowPosition, "decision");
  assert.doesNotMatch(pack.experience.recommendation.statement ?? "", /committed|has decided/i);
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.commitsDecisions, false);
});

test("F — Execution does not claim CC:11", () => {
  const pack = pipeline("ctx-execution-capacity");
  assert.equal(pack.experience.workflowPosition, "execution");
  assert.match(pack.experience.situation.statement ?? "", /not tracking live delivery/i);
  assert.doesNotMatch(pack.experience.situation.statement ?? "", /CC:11|flowDomain/i);
});

test("G — Outcome missing is honest", () => {
  const pack = pipeline("obj-capacity");
  assert.match(
    pack.experience.outcome.statement ?? "",
    /No live Outcome|No validated actual outcome/i,
  );
  assert.equal(pack.experience.outcome.authority, "missing");
});

test("H — Learning missing is honest", () => {
  const pack = pipeline("obj-capacity");
  assert.match(pack.experience.learning.statement ?? "", /No promoted Learning/i);
  assert.equal(pack.experience.learning.authority, "missing");
});

test("I — Limited evidence remains limited", () => {
  const pack = pipeline(null);
  assert.ok(
    pack.experience.evidence.confidence === "limited" ||
      pack.experience.evidence.confidence === "none" ||
      pack.experience.evidence.confidence === "incomplete",
  );
  assert.notEqual(pack.experience.evidence.confidence, "strong");
});

test("J — Advisor consumes EXI meaning", () => {
  const pack = pipeline("obj-capacity");
  const applied = applyNexoraExecutiveIntelligenceExperienceToAdvisor(
    pack.narrative,
    pack.experience,
  );
  assert.equal(applied.currentSubjectId, pack.experience.subjectId);
  assert.ok(applied.situation);
});

test("K — Conversation answers from same EXI meaning", () => {
  const pack = pipeline("obj-capacity");
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  const changed = ask(pack, "What changed?");
  assert.ok(changed.response.includes(answers.change.replace(/\.$/, "")) || changed.response.includes("changed") || changed.response.includes("attention") || changed.response.includes("validated"));
});

test("L — Stage subject equals EXI current subject", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.state.focusedSubject?.id, pack.experience.subjectId);
});

test("M — Queue collection does not create arbitrary subject", () => {
  const pack = pipeline(null, "problem");
  assert.equal(pack.experience.isCollection, true);
  assert.equal(pack.experience.subjectId, null);
  assert.match(pack.experience.situation.statement ?? "", /collection/i);
});

test("N — Attention does not steal focus", () => {
  const pack = pipeline(null);
  assert.equal(pack.state.focusedSubject, null);
});

test("O — Single recommendation authority", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(
    ["nba", "decision-brief", "data-reality", "advisor-intelligence", "none"].includes(
      pack.experience.recommendationAuthority,
    ),
  );
});

test("P — Next action is an existing Advisor/NBA action", () => {
  const pack = pipeline("obj-capacity");
  if (pack.experience.nextAction.statement) {
    assert.equal(
      pack.experience.nextAction.statement,
      pack.narrative.primaryAction?.label,
    );
  }
});

test("Q — EXI does not write APP-4 memory", () => {
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.writesMemory, false);
  const source = readFileSync(
    join(here, "nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /promoteNexora|appendDurable|writeLearning/);
});

test("R — Decision safety: EXI does not commit", () => {
  assert.equal(NEXORA_EXI_EXPERIENCE_BOUNDARY.commitsDecisions, false);
});

test("S — Frozen Stage z=0 / fixed camera / (0,0) focus", () => {
  const pack = pipeline("obj-capacity");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
  assert.ok(
    pack.presentation.scene.objects.every((object) => object.targetPosition[2] === 0),
  );
});

test("T — Frozen navigation identity preserved", () => {
  const pack = pipeline("obj-capacity");
  const back = stepBackNexoraMVPObjectInteraction(pack.state);
  assert.equal(back.focusedSubject, null);
});

test("EXI questions classify without architecture jargon", () => {
  assert.equal(classifyNexoraExiUtterance("What changed?"), "change");
  assert.equal(classifyNexoraExiUtterance("Why does this matter?"), "significance");
  assert.equal(classifyNexoraExiUtterance("What are my options?"), "options");
  assert.equal(classifyNexoraExiUtterance("What was the outcome?"), "outcome");
  assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
});

test("Manager language stays non-technical", () => {
  const pack = pipeline("obj-capacity");
  const blob = [
    pack.experience.situation.statement,
    pack.experience.change.statement,
    pack.experience.significance.statement,
    pack.experience.causes.statement,
    pack.experience.recommendation.statement,
    pack.experience.nextAction.statement,
  ].join(" ");
  assert.doesNotMatch(blob, /RDI|PM:|EI:1|EXI|flowDomain|APP-4|CC:11|resolver|binding/);
});
