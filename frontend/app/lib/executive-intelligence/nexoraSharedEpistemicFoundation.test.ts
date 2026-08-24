/**
 * CORE-INT:2 — Shared Epistemic & Uncertainty Foundation invariants A–V.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { deriveNexoraMVPExecutiveIntelligenceContext, resolveNexoraMVPExecutiveIntelligence } from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  applyNexoraExecutiveIntelligenceExperienceToAdvisor,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  nexoraExecutiveIntelligenceExperienceIdentity,
  projectNexoraExiConversationalAnswers,
} from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPObjectInteractionState,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "../nex-mvp/nexoraMVPPresentationState.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import { createExecutiveClaim } from "./problemRiskOpportunityIntelligence.ts";
import {
  SHARED_EPISTEMIC_BOUNDARY,
  bindDownstreamPresentationConfidence,
  classifyRecordedRelationInterpretation,
  nexoraSharedEpistemicFoundationIdentity,
  projectSharedEpistemicFoundation,
} from "./nexoraSharedEpistemicFoundation.ts";

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
  if (subjectId != null) state = selectSubject(state, subjectId);
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
  return Object.freeze({ state, presentation, advisorBridge, narrative, experience });
}

function ask(
  pack: ReturnType<typeof pipeline>,
  utterance: string,
  previousUtterance?: string,
) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: pack.state,
    previousUtterance,
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

test("CORE-INT:2 identity reuses EI:3 and is not a parallel engine", () => {
  assert.equal(
    nexoraSharedEpistemicFoundationIdentity,
    "CORE-INT:2/SharedEpistemicUncertaintyFoundation",
  );
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.claimAuthority, "EI:3/createExecutiveClaim");
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.classifiesFromProse, false);
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.isExiWriter, false);
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.wiresEi4, false);
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.startsExi4, false);
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.usesLlm, false);
  assert.equal(nexoraExecutiveIntelligenceExperienceIdentity, "EXI:1/NexoraExecutiveIntelligenceExperience");
});

test("A — FACT requires evidence", () => {
  assert.throws(
    () =>
      createExecutiveClaim({
        claimId: "unsupported",
        type: "FACT",
        statement: "Capacity is high.",
      }),
    /evidence-and-provenance/,
  );
  const unknown = projectSharedEpistemicFoundation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    observation: {
      statement: "Capacity is high.",
      kpiId: "kpi-capacity",
      value: "88%",
      sourceKind: "mvp-presentation-fixture",
      sourceId: "fixture:obj-capacity",
      validated: false,
      freshness: "current",
      provenanceRefs: [],
      evidenceRefs: [],
    },
    relationships: [],
    scenario: null,
  });
  assert.equal(unknown.observation?.claim.type, "UNKNOWN");
});

test("B — ASSUMPTION is not FACT", () => {
  assert.equal(classifyRecordedRelationInterpretation("constrained-by"), "ASSUMPTION");
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.epistemicFoundation.interpretation?.claim.type, "ASSUMPTION");
  assert.notEqual(pack.experience.epistemicFoundation.interpretation?.claim.type, "FACT");
});

test("C — PREDICTION remains prediction", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.equal(pack.experience.epistemicFoundation.prediction?.claim.type, "PREDICTION");
  assert.equal(pack.experience.options.epistemic, "prediction");
  assert.notEqual(pack.experience.options.epistemic, "fact");
});

test("D — UNKNOWN is valid", () => {
  const pack = projectSharedEpistemicFoundation({
    subjectId: "obj-inventory",
    subjectLabel: "Inventory",
    subjectKind: "object",
    isOverview: false,
    observation: null,
    relationships: [
      {
        relationshipId: "rel-generic",
        otherId: "obj-risk",
        otherLabel: "Risk",
        relationKind: "related",
      },
    ],
    scenario: null,
  });
  assert.equal(pack.interpretation?.claim.type, "UNKNOWN");
  assert.equal(pack.interpretation?.claim.unresolved, true);
});

test("E — Confidence bounded", () => {
  assert.equal(bindDownstreamPresentationConfidence("limited", "strong"), "limited");
  assert.equal(bindDownstreamPresentationConfidence("strong", "limited"), "limited");
  const pack = pipeline("obj-capacity");
  const core = pack.experience.epistemicFoundation.observation;
  assert.ok(core);
  assert.notEqual(core.presentationConfidence, "strong");
  assert.ok(
    pack.experience.situation.confidence === core.presentationConfidence ||
      ["limited", "incomplete", "stale", "none"].includes(pack.experience.situation.confidence),
  );
});

test("F — Evidence preserved", () => {
  const pack = pipeline("obj-capacity");
  assert.ok((pack.experience.epistemicFoundation.observation?.claim.evidenceRefs.length ?? 0) > 0);
});

test("G — Provenance preserved", () => {
  const pack = pipeline("obj-capacity");
  assert.ok((pack.experience.epistemicFoundation.observation?.claim.provenanceRefs.length ?? 0) > 0);
});

test("H — Data Reality fact", () => {
  const pack = projectSharedEpistemicFoundation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    observation: {
      statement: "Utilization is 21.3%.",
      kpiId: "kpi-capacity",
      value: "21.3%",
      sourceKind: "data-reality",
      sourceId: "dataset-capacity",
      validated: true,
      freshness: "current",
      confidenceState: "verified",
      observedAt: "2026-08-18T12:00:00.000Z",
      provenanceRefs: ["data-reality:dataset-capacity:kpi-capacity"],
      evidenceRefs: [
        {
          sourceKind: "data-reality",
          sourceId: "dataset-capacity",
          subjectId: "obj-capacity",
          factKey: "kpi-capacity",
        },
      ],
      realityEvidence: [
        {
          sourceKind: "data-reality",
          sourceId: "dataset-capacity",
          subjectId: "obj-capacity",
          factKey: "kpi-capacity",
          observedAt: "2026-08-18T12:00:00.000Z",
          confidence: null,
          confidenceState: "verified",
        },
      ],
    },
    relationships: [],
    scenario: null,
  });
  assert.equal(pack.observation?.claim.type, "FACT");
  assert.equal(pack.observation?.writer, "data-reality-projection");
  assert.equal(pack.observation?.claim.confidence, "high");
});

test("I — Interpretation distinction", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.epistemicFoundation.observation?.claim.type, "FACT");
  assert.equal(pack.experience.epistemicFoundation.interpretation?.claim.type, "ASSUMPTION");
  assert.notEqual(
    pack.experience.epistemicFoundation.observation?.claim.claimId,
    pack.experience.epistemicFoundation.interpretation?.claim.claimId,
  );
});

test("J — Relationship distinction", () => {
  const pack = pipeline("obj-capacity");
  const existence = pack.experience.epistemicFoundation.claims.find(
    (entry) => entry.role === "relationship-existence",
  );
  assert.equal(existence?.claim.type, "FACT");
  assert.equal(pack.experience.epistemicFoundation.interpretation?.claim.type, "ASSUMPTION");
});

test("K — Stale evidence", () => {
  const pack = projectSharedEpistemicFoundation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    observation: {
      statement: "Utilization is 88%.",
      kpiId: "kpi-capacity",
      value: "88%",
      sourceKind: "data-reality",
      sourceId: "dataset-capacity",
      validated: true,
      freshness: "stale",
      provenanceRefs: ["data-reality:dataset-capacity:kpi-capacity"],
      evidenceRefs: [
        {
          sourceKind: "data-reality",
          sourceId: "dataset-capacity",
          subjectId: "obj-capacity",
          factKey: "kpi-capacity",
        },
      ],
    },
    relationships: [],
    scenario: null,
  });
  assert.equal(pack.observation?.claim.type, "FACT");
  assert.equal(pack.observation?.freshness, "stale");
  assert.equal(pack.observation?.presentationConfidence, "stale");
  assert.match(pack.observation?.managerStatement ?? "", /no longer current/i);
});

test("L — Missing evidence", () => {
  const pack = projectSharedEpistemicFoundation({
    subjectId: "obj-customer",
    subjectLabel: "Customer",
    subjectKind: "object",
    isOverview: false,
    observation: null,
    relationships: [],
    scenario: null,
  });
  assert.equal(pack.unknown?.evidenceStatus, "missing");
  assert.equal(pack.unknown?.claim.type, "UNKNOWN");
});

test("M — EXI reads Core", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(pack.experience.epistemicFoundation);
  assert.equal(pack.experience.situation.epistemic, "fact");
  assert.equal(pack.experience.causes.epistemic, "assumption");
});

test("N — EXI does not override", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.equal(pack.experience.epistemicFoundation.prediction?.claim.type, "PREDICTION");
  assert.equal(pack.experience.options.epistemic, "prediction");
  assert.notEqual(pack.experience.options.epistemic, "fact");
});

test("O — Conversation parity", () => {
  const pack = pipeline("obj-capacity");
  const result = ask(pack, "Is that a fact?");
  assert.match(result.response, /possible explanation|current data confirms/i);
  assert.doesNotMatch(result.response, /FACT|ASSUMPTION|CORE-INT/i);
});

test("P — Follow-up continuity", () => {
  const pack = pipeline("obj-capacity");
  const why = ask(pack, "What may be causing this?");
  const fact = ask(pack, "Is that a fact or an assumption?", "What may be causing this?");
  const sure = ask(pack, "How sure are you?", "Is that a fact or an assumption?");
  const evidence = ask(pack, "What evidence supports that?", "How sure are you?");
  assert.match(why.response, /contributor|constraint|recorded/i);
  assert.match(fact.response, /possible explanation|not observed/i);
  assert.match(sure.response, /evidence|current/i);
  assert.match(evidence.response, /supported|validated evidence|relationship/i);
  assert.equal(sure.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("Q — Claim ≠ subject", () => {
  const pack = pipeline("obj-capacity");
  const before = pack.state.focusedSubject?.id;
  const result = ask(pack, "How sure are you?");
  assert.equal(pack.state.focusedSubject?.id, before);
  assert.equal(result.shouldCommitRuntime, false);
});

test("R — Decision safety", () => {
  const pack = pipeline("ctx-decision-capacity");
  const result = ask(pack, "Is that a fact?");
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.mutatesDecision, false);
  assert.doesNotMatch(result.response, /committed|approved/i);
});

test("S — APP-4 safety", () => {
  assert.equal(SHARED_EPISTEMIC_BOUNDARY.writesMemory, false);
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.epistemicFoundation.writesMemory, false);
});

test("T — Frozen Stage", () => {
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

test("U — EXI:1–3 regression identity", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.identity, "EXI:1/NexoraExecutiveIntelligenceExperience");
  assert.equal(pack.experience.enrichment, "EXI:2/GroundedCauseConstraintTradeoff");
  assert.equal(pack.experience.comparisonEnrichment, "EXI:3/LiveTradeoffOptionComparison");
  applyNexoraExecutiveIntelligenceExperienceToAdvisor(pack.narrative, pack.experience);
});

test("V — Frozen MVP regression", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
});

test("CORE-INT:2 EXI is a reader, not a writer", () => {
  const grounding = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperienceGrounding.ts"),
    "utf8",
  );
  const composer = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  assert.doesNotMatch(grounding, /createExecutiveClaim\(/);
  assert.doesNotMatch(composer, /createExecutiveClaim\(/);
  assert.match(composer, /projectNexoraLiveSharedEpistemicFoundation/);
});

test("CORE-INT:2 conversation classifiers", () => {
  assert.equal(classifyNexoraExiUtterance("Is that a fact?"), "factOrAssumption");
  assert.equal(classifyNexoraExiUtterance("How sure are you?"), "confidence");
  assert.equal(classifyNexoraExiUtterance("What evidence supports that?"), "evidenceFollowup");
  assert.equal(classifyNexoraExiUtterance("What are you assuming?"), "whatAssuming");
  assert.equal(classifyNexoraExiUtterance("What is predicted?"), "whatPredicted");
  assert.equal(classifyNexoraExiUtterance("What don't we know?"), "whatUnknown");
});
