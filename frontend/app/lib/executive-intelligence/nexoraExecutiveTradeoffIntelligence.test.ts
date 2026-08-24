/**
 * CORE-INT:5 — Live Trade-off Intelligence invariants A–Z.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
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
import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import {
  EXECUTIVE_TRADEOFF_BOUNDARY,
  nexoraExecutiveTradeoffIntelligenceIdentity,
  presentTradeoffCostComparison,
  presentTradeoffGains,
  presentTradeoffRiskComparison,
  presentTradeoffSacrifices,
  presentTradeoffTimeComparison,
  projectExecutiveTradeoffIntelligence,
  type ExecutiveTradeoffOptionSource,
} from "./nexoraExecutiveTradeoffIntelligence.ts";
import { nexoraSharedEpistemicFoundationIdentity } from "./nexoraSharedEpistemicFoundation.ts";
import { nexoraGroundedCausalConstraintIntelligenceIdentity } from "./nexoraGroundedCausalConstraintIntelligence.ts";
import { nexoraExecutivePriorityIntelligenceIdentity } from "./nexoraExecutivePriorityIntelligence.ts";

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

function ask(
  pack: ReturnType<typeof pipeline>,
  utterance: string,
  previousUtterance?: string,
) {
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
    previousUtterance,
  });
}

function source(
  optionId: string,
  title: string,
  scopeId: string,
  summary: string,
): ExecutiveTradeoffOptionSource {
  return {
    optionId,
    title,
    scopeId,
    sourceSummary: summary,
    kind: "scenario",
  };
}

test("CORE-INT:5 identity reuses EI:4 trade-off records without certification-trace wiring", () => {
  assert.equal(
    nexoraExecutiveTradeoffIntelligenceIdentity,
    "CORE-INT:5/LiveTradeoffIntelligence",
  );
  assert.equal(EXECUTIVE_TRADEOFF_BOUNDARY.wiresCreateScenarioPriorityTradeoffTrace, false);
  assert.equal(EXECUTIVE_TRADEOFF_BOUNDARY.choosesRecommendation, false);
  assert.equal(EXECUTIVE_TRADEOFF_BOUNDARY.inventsEconomics, false);
});

test("A — Real option identity", () => {
  const live = pipeline("ctx-problem-margin");
  for (const option of live.experience.coreTradeoffAssessment.options) {
    assert.match(option.optionId, /^ctx-scenario-/);
    assert.ok(option.provenanceRefs.length > 0);
  }
});

test("B — Same-scope comparability", () => {
  const live = pipeline("obj-revenue");
  const ids = live.experience.coreTradeoffAssessment.options.map((option) => option.optionId);
  assert.ok(ids.includes("ctx-scenario-pricing"));
  assert.ok(ids.includes("ctx-scenario-demand"));
  assert.ok(!ids.includes("ctx-scenario-capacity"));
  assert.equal(live.experience.coreTradeoffAssessment.comparable, true);
});

test("C — Multi-option", () => {
  const live = pipeline("ctx-problem-margin");
  assert.equal(live.experience.coreTradeoffAssessment.comparisonStatus, "multi-option");
  assert.ok(live.experience.coreTradeoffAssessment.options.length >= 2);
});

test("D — Single-option", () => {
  const live = pipeline("ctx-scenario-capacity");
  assert.equal(live.experience.coreTradeoffAssessment.comparisonStatus, "single-option");
  assert.equal(live.experience.coreTradeoffAssessment.comparable, false);
  assert.match(live.experience.tradeoffs.statement ?? "", /One evaluated option is currently available/i);
});

test("E — No-option", () => {
  const live = pipeline("obj-inventory");
  assert.equal(live.experience.coreTradeoffAssessment.comparisonStatus, "no-options");
  assert.equal(live.experience.coreTradeoffAssessment.options.length, 0);
  assert.match(live.experience.tradeoffs.statement ?? "", /No evaluated option is currently available/i);
});

test("F — Not-comparable", () => {
  const assessment = projectExecutiveTradeoffIntelligence({
    subjectId: "mixed",
    sources: [
      source("ctx-scenario-pricing", "Pricing Response", "ctx-problem-margin", "margin recovery"),
      source("ctx-scenario-capacity", "Capacity Expansion Plan", "ctx-problem-capacity", "Capacity Gap"),
    ],
  });
  assert.equal(assessment.comparisonStatus, "not-comparable");
  assert.equal(assessment.comparable, false);
  assert.match(assessment.comparisonSummary, /will not compare them/i);
});

test("G — Gain evidence", () => {
  const live = pipeline("obj-revenue");
  for (const option of live.experience.coreTradeoffAssessment.options) {
    for (const gain of option.gains) {
      assert.ok(gain.evidenceRefs.length > 0);
      assert.equal(gain.claimKind, "PREDICTION");
      assert.ok(gain.statement.length > 0);
    }
  }
});

test("H — Sacrifice evidence", () => {
  const live = pipeline("obj-revenue");
  for (const option of live.experience.coreTradeoffAssessment.options) {
    for (const sacrifice of option.sacrifices) {
      assert.ok(sacrifice.evidenceRefs.length > 0);
    }
  }
});

test("I — Unknown sacrifice", () => {
  const live = pipeline("obj-revenue");
  const copy = presentTradeoffSacrifices(live.experience.coreTradeoffAssessment);
  assert.match(copy, /No validated sacrifice is currently recorded/i);
  assert.doesNotMatch(copy, /no sacrifice\b|sacrifice is zero/i);
});

test("J — Cost evidence", () => {
  const live = pipeline("obj-revenue");
  assert.match(
    presentTradeoffCostComparison(live.experience.coreTradeoffAssessment),
    /cost evidence/i,
  );
  assert.ok(live.experience.coreTradeoffAssessment.missingDimensions.includes("cost"));
});

test("K — Time evidence", () => {
  const live = pipeline("obj-revenue");
  assert.match(
    presentTradeoffTimeComparison(live.experience.coreTradeoffAssessment),
    /time evidence/i,
  );
  assert.doesNotMatch(presentTradeoffGains(live.experience.coreTradeoffAssessment), /\bfaster\b|\bslower\b/i);
});

test("L — Risk evidence", () => {
  const live = pipeline("obj-revenue");
  const risk = presentTradeoffRiskComparison(live.experience.coreTradeoffAssessment);
  assert.match(risk, /insufficient to rank|delivery risk/i);
  assert.doesNotMatch(risk, /Pricing Response is safer/i);
});

test("M — Constraint evidence uses CORE-INT:3 language only", () => {
  const live = pipeline("ctx-scenario-pricing");
  const pricing = live.experience.coreTradeoffAssessment.options.find(
    (option) => option.optionId === "ctx-scenario-pricing",
  );
  assert.match(pricing?.constraints[0]?.statement ?? "", /constrained capacity/i);
  assert.equal(pricing?.constraints[0]?.claimKind, "ASSUMPTION");
});

test("N — Assumption evidence uses CORE-INT:2 kinds", () => {
  const live = pipeline("ctx-scenario-pricing");
  const pricing = live.experience.coreTradeoffAssessment.options.find(
    (option) => option.optionId === "ctx-scenario-pricing",
  );
  assert.equal(pricing?.assumptions[0]?.claimKind, "ASSUMPTION");
});

test("O — Prediction remains prediction", () => {
  const live = pipeline("ctx-problem-margin");
  for (const option of live.experience.coreTradeoffAssessment.options) {
    for (const gain of option.gains) {
      assert.equal(gain.claimKind, "PREDICTION");
    }
  }
  assert.match(live.experience.tradeoffs.statement ?? "", /projected/i);
});

test("P — Confidence bounded", () => {
  const live = pipeline("ctx-problem-margin");
  assert.notEqual(live.experience.coreTradeoffAssessment.confidence, "high");
});

test("Q — No invented number", () => {
  const live = pipeline("ctx-problem-margin");
  assert.doesNotMatch(live.experience.tradeoffs.statement ?? "", /\+8%|\$120k|utility/i);
  for (const option of live.experience.coreTradeoffAssessment.options) {
    for (const gain of option.gains) {
      assert.equal(gain.numericValue, null);
    }
  }
});

test("R — No synthetic score", () => {
  const live = pipeline("ctx-problem-margin");
  assert.equal(live.experience.coreTradeoffAssessment.numericalScore, null);
});

test("S — Preferred option authority", () => {
  const live = pipeline("obj-revenue");
  assert.equal(EXECUTIVE_TRADEOFF_BOUNDARY.choosesRecommendation, false);
  if (live.experience.coreTradeoffAssessment.preferredOptionId) {
    assert.notEqual(live.experience.coreTradeoffAssessment.preferenceAuthority, "none");
  }
});

test("T — Recommendation ≠ commitment", () => {
  const live = pipeline("ctx-decision-reprice");
  assert.equal(live.experience.coreTradeoffAssessment.mutatesDecision, false);
  const asked = ask(live, "Compare the options.");
  assert.equal(asked.shouldCommitRuntime, false);
  assert.doesNotMatch(asked.response, /committed|approved/i);
});

test("U — EXI reads Core", () => {
  const live = pipeline("ctx-problem-margin");
  assert.equal(
    live.experience.coreTradeoffAssessment.identity,
    nexoraExecutiveTradeoffIntelligenceIdentity,
  );
  assert.equal(
    live.experience.tradeoffs.statement,
    live.experience.coreTradeoffAssessment.comparisonSummary,
  );
});

test("V — EXI cannot override", () => {
  const grounding = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperienceGrounding.ts"),
    "utf8",
  );
  assert.doesNotMatch(grounding, /extractGroundedDimension|preferredFromNarrative/);
  assert.match(grounding, /presentTradeoffAssessment|core\?\.options/);
});

test("W — Advisor parity", () => {
  const live = pipeline("ctx-scenario-pricing");
  assert.ok(live.experience.tradeoffs.statement);
  assert.equal(
    live.experience.tradeoffAssessment.optionComparison.comparable,
    live.experience.coreTradeoffAssessment.comparable,
  );
});

test("X — Conversation parity", () => {
  const live = pipeline("ctx-problem-margin");
  const answers = projectNexoraExiConversationalAnswers(live.experience);
  const compared = ask(live, "Compare the options.");
  assert.match(compared.response, /Pricing Response|Demand Surge/i);
  assert.ok(answers.gain.includes("margin recovery") || answers.gain.includes("volume"));
});

test("Y — Follow-up continuity", () => {
  const live = pipeline("ctx-problem-margin");
  const focus = live.state.focusedSubject?.id ?? null;
  const compare = ask(live, "Compare the options.");
  const gain = ask(live, "What do we gain?", "Compare the options.");
  const sacrifice = ask(live, "What do we sacrifice?", "What do we gain?");
  const risk = ask(live, "Which one has more risk?", "What do we sacrifice?");
  const sure = ask(live, "How sure are you?", "Which one has more risk?");
  assert.equal(live.state.focusedSubject?.id ?? null, focus);
  assert.equal(compare.shouldCommitRuntime, false);
  assert.match(gain.response, /margin recovery|volume upside|gain/i);
  assert.match(sacrifice.response, /No validated sacrifice is currently recorded/i);
  assert.match(risk.response, /risk/i);
  assert.match(sure.response, /Evidence limited|projected/i);
});

test("Z — Frozen MVP", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
  assert.equal(
    pipeline(null).experience.identity,
    "EXI:1/NexoraExecutiveIntelligenceExperience",
  );
});

test("Live — ownership and EI:4 boundary", () => {
  assert.equal(nexoraSharedEpistemicFoundationIdentity, "CORE-INT:2/SharedEpistemicUncertaintyFoundation");
  assert.equal(
    nexoraGroundedCausalConstraintIntelligenceIdentity,
    "CORE-INT:3/GroundedCausalConstraintIntelligence",
  );
  assert.equal(nexoraExecutivePriorityIntelligenceIdentity, "CORE-INT:4/ExecutivePriorityIntelligence");
  const live = readFileSync(join(here, "../nex-mvp/nexoraLiveEpistemicProjection.ts"), "utf8");
  const composer = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  assert.doesNotMatch(live, /createScenarioPriorityTradeoffTrace/);
  assert.doesNotMatch(composer, /createScenarioPriorityTradeoffTrace/);
  assert.match(composer, /projectNexoraLiveExecutiveTradeoffIntelligence/);
});

test("Live conversation classifiers", () => {
  assert.equal(classifyNexoraExiUtterance("Compare the options."), "compare");
  assert.equal(classifyNexoraExiUtterance("Which is cheaper?"), "cheaper");
  assert.equal(classifyNexoraExiUtterance("Which is faster?"), "faster");
  assert.equal(classifyNexoraExiUtterance("What assumptions matter?"), "assumptions");
  assert.equal(
    classifyNexoraExiUtterance("Which option addresses the constraint?"),
    "constraintComparison",
  );
  assert.equal(
    classifyNexoraExiUtterance("Which option does Nexora recommend?"),
    "recommendation",
  );
});
