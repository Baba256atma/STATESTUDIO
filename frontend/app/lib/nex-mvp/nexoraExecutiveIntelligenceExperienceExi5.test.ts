/**
 * EXI:5 — Outcome & Learning Experience Integration cases A–Z.
 *
 * Presentation only. Does not create Outcome, Learning, or causality.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { NexoraAdvisorView } from "../../executive/nex-mvp/intelligence/NexoraAdvisorView.tsx";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_EXI5_EXPERIENCE_BOUNDARY,
  applyNexoraExecutiveIntelligenceExperienceToAdvisor,
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  composeNexoraExi5OutcomeLearningExperience,
  nexoraExi5ExperienceIdentity,
  projectNexoraExiConversationalAnswers,
} from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
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
import { nexoraManagerMvpReleaseBaselineIdentity } from "./nexoraManagerMvpReleaseBaseline.ts";
import { nexoraExecutiveShellVersion } from "./nexoraExecutiveShell.ts";
import {
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import {
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeBaseline,
  type ExecutiveOutcomeExpectation,
  type ExecutiveOutcomeObservation,
  type ProjectLiveOutcomeIntelligenceInput,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  projectGroundedLearningIntelligence,
  promoteGroundedLearningToApp4,
  resetGroundedLearningForTests,
  type CoreInt3CausalFinding,
  type ProjectGroundedLearningInput,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));
const createdAt = "2026-04-01T00:00:00.000Z";
const workspaceId = "nexora-mvp";

beforeEach(() => {
  resetGroundedLearningForTests();
  resetExecutiveMemoryStorageEngineForTests();
  initializeExecutiveMemoryStorageEngine(createdAt, "in_memory");
});
afterEach(() => {
  resetGroundedLearningForTests();
  resetExecutiveMemoryStorageEngineForTests();
});

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
  const presentation = applyExecutiveStageFixedCameraToStagePresentation(
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(
      applyExecutiveStage2DTopologyPlaneToStagePresentation(
        applyExecutivePresentationPlaneToStagePresentation(
          applyExecutiveNetworkTopologyToStagePresentation(
            applyExecutiveFocusVisualGrammarToStagePresentation(base, {
              presentationDepth: "minimum",
            }),
          ),
        ),
      ),
    ),
  );
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

function ask(pack: ReturnType<typeof pipeline>, utterance: string, previous?: string) {
  return executeNexoraConversationalExperience({
    utterance,
    previousUtterance: previous,
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

function expected(
  overrides: Partial<ExecutiveOutcomeExpectation> = {},
): ExecutiveOutcomeExpectation {
  return Object.freeze({
    expectationId: "expected-capacity",
    statement: "Capacity should improve to 80%.",
    claimKind: "PREDICTION",
    dimension: "capacity-gap",
    source: "decision",
    numericTarget: 80,
    comparator: "lte",
    unit: "%",
    expectedDirection: null,
    capturedAt: "2026-01-01T00:00:00.000Z",
    evidenceRefs: Object.freeze([
      { sourceKind: "scenario" as const, sourceId: "ctx-scenario-capacity", factKey: "expected-effect" },
    ]),
    provenanceRefs: Object.freeze(["test:expected-capacity"]),
    ...overrides,
  });
}

function actual(
  overrides: Partial<ExecutiveOutcomeObservation> = {},
): ExecutiveOutcomeObservation {
  return Object.freeze({
    observationId: "actual-capacity",
    statement: "Validated capacity utilization is 84%.",
    claimKind: "FACT",
    dimension: "capacity-gap",
    source: "data-reality",
    numericValue: 84,
    unit: "%",
    observedDirection: null,
    observedAt: createdAt,
    freshness: "current" as const,
    validationStatus: "validated" as const,
    outcomeLinked: true,
    evidenceRefs: Object.freeze([
      { sourceKind: "data-reality" as const, sourceId: "rdi:capacity", factKey: "utilization" },
    ]),
    provenanceRefs: Object.freeze(["test:actual-capacity"]),
    ...overrides,
  });
}

function baseline(
  overrides: Partial<ExecutiveOutcomeBaseline> = {},
): ExecutiveOutcomeBaseline {
  return Object.freeze({
    measured: "Capacity utilization at decision time",
    measuredAt: "2026-01-01T00:00:00.000Z",
    source: "data-reality",
    numericValue: 88,
    unit: "%",
    confidence: "medium" as const,
    provenanceRefs: Object.freeze(["test:baseline-capacity"]),
    ...overrides,
  });
}

function readyAssessment(overrides: Partial<ProjectLiveOutcomeIntelligenceInput> = {}) {
  return projectLiveOutcomeIntelligence({
    subjectId: "obj-capacity",
    decisionId: "decision-capacity",
    executionId: "execution-capacity",
    expected: expected(),
    actuals: [actual()],
    baseline: baseline(),
    window: {
      decisionAt: "2026-01-01T00:00:00.000Z",
      executionAt: "2026-02-01T00:00:00.000Z",
      observedAt: createdAt,
      timingComplete: true,
    },
    ...overrides,
  });
}

function learn(overrides: Partial<ProjectGroundedLearningInput> = {}) {
  return projectGroundedLearningIntelligence({
    workspaceId,
    subjectId: "obj-capacity",
    createdAt,
    decisionId: "decision-capacity",
    executionId: "execution-capacity",
    scenarioId: "scenario-capacity",
    issueId: "issue-capacity",
    realityId: "reality-capacity",
    assessment: readyAssessment(),
    ...overrides,
  });
}

function supportedFinding(
  overrides: Partial<CoreInt3CausalFinding> = {},
): CoreInt3CausalFinding {
  return Object.freeze({
    findingId: "causal-capacity-staffing",
    supported: true,
    hypothesisOnly: false,
    conflicting: false,
    evidenceRefs: Object.freeze([
      { sourceKind: "data-reality" as const, sourceId: "rdi:capacity", factKey: "utilization" },
    ]),
    provenanceRefs: Object.freeze(["core-int3:causal-capacity"]),
    ...overrides,
  });
}

function experienceFrom(
  learning = learn(),
  assessment = readyAssessment(),
) {
  const live = pipeline("obj-capacity").experience;
  return composeNexoraExi5OutcomeLearningExperience({
    workspaceId,
    subjectId: "obj-capacity",
    assessment,
    learning,
    causal: live.coreCausalAssessment,
  });
}

test("EXI:5 identity is presentation-only", () => {
  assert.equal(nexoraExi5ExperienceIdentity, "EXI:5/OutcomeLearningExperience");
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.presentationOnly, true);
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.createsOutcome, false);
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.createsLearning, false);
  const source = readFileSync(join(here, "nexoraExecutiveIntelligenceExperienceExi5.ts"), "utf8");
  assert.doesNotMatch(source, /persistDurableExecutiveMemory/);
  assert.doesNotMatch(source, /\bany\b|@ts-ignore|ignoreBuildErrors/);
});

test("A — Expected + Actual + ready Outcome → correct Outcome experience", () => {
  const view = experienceFrom();
  assert.match(view.expectedOutcome, /Capacity should improve/);
  assert.match(view.actualOutcome, /84%/);
  assert.match(view.outcomeAssessment, /met|exceeded|partially/i);
  assert.equal(view.observationStatus, "observed");
});

test("B — Expected only → pending Actual", () => {
  const pack = pipeline("ctx-scenario-capacity");
  assert.match(pack.experience.outcomeLearning.actualOutcome, /No validated actual outcome/i);
  assert.ok(
    pack.experience.outcomeLearning.observationStatus === "pending-actual" ||
      pack.experience.outcomeLearning.observationStatus === "unknown",
  );
});

test("C — Actual observation without Outcome linkage → Reality only", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "obj-capacity",
    currentReality: { statement: "Capacity is 88%", dimension: "capacity-gap", numericValue: 88 },
  });
  const learning = learn({ assessment, currentKpiOnly: true });
  const view = composeNexoraExi5OutcomeLearningExperience({
    workspaceId,
    subjectId: "obj-capacity",
    assessment,
    learning,
    causal: pipeline("obj-capacity").experience.coreCausalAssessment,
    observationLinked: false,
  });
  assert.equal(view.observationStatus, "reality-only");
  assert.match(view.actualOutcome, /Reality, not a Decision Outcome/);
});

test("D — Execution completed without business Outcome → Outcome unknown", () => {
  const pack = pipeline("ctx-execution-capacity");
  assert.equal(pack.experience.outcomeLearning.observationStatus, "execution-complete-outcome-unknown");
  assert.match(pack.experience.outcomeLearning.actualOutcome, /business outcome is still unknown/i);
});

test("E — Ready Outcome + supported case-specific Learning → visible as case-specific", () => {
  const view = experienceFrom();
  const candidate = view.learningCandidates.find((entry) => entry.scope === "case-specific");
  assert.ok(candidate);
  assert.match(view.learningStatement, /case-specific/i);
  assert.doesNotMatch(view.learningStatement, /always|reliably/i);
});

test("F — Single successful Outcome → no generalized rule", () => {
  const view = experienceFrom(learn({ requestGeneralized: true }));
  assert.equal(view.promotedLearning.some((entry) => entry.scope === "generalized"), false);
  assert.doesNotMatch(view.learningStatement, /always|reliably/i);
});

test("G — Conflicting Learning → conflict visible; no promoted certainty", () => {
  const assessment = readyAssessment({
    actuals: [
      actual({ observationId: "c1", numericValue: 70 }),
      actual({ observationId: "c2", numericValue: 95 }),
    ],
  });
  const view = experienceFrom(learn({ assessment }), assessment);
  assert.match(view.learningStatement, /conflicting/i);
  assert.equal(view.promotedLearning.length, 0);
});

test("H — Stale evidence → stale state preserved", () => {
  const assessment = readyAssessment({
    actuals: [actual({ freshness: "stale", observationId: "stale-1" })],
  });
  const view = experienceFrom(learn({ assessment }), assessment);
  assert.ok(
    view.observationStatus === "stale" ||
      view.learningCandidates.some((entry) => entry.freshness === "stale") ||
      /stale/i.test(view.confidenceStatement),
  );
});

test("I — Partial evidence → bounded confidence", () => {
  const assessment = readyAssessment({
    actuals: [actual({ validationStatus: "partial", observationId: "partial-1" })],
  });
  const view = experienceFrom(learn({ assessment }), assessment);
  assert.match(view.confidenceStatement, /partial|weak|unknown/i);
});

test("J — Missing provenance → no authoritative Learning presentation", () => {
  const assessment = readyAssessment({
    expected: expected({ provenanceRefs: Object.freeze([]) }),
    actuals: [actual({ provenanceRefs: Object.freeze([]), evidenceRefs: Object.freeze([]) })],
    baseline: baseline({ provenanceRefs: Object.freeze([]) }),
  });
  const view = experienceFrom(learn({ assessment }), assessment);
  assert.equal(
    view.promotedLearning.length === 0 ||
      /provenance/i.test(view.learningStatement),
    true,
  );
});

test("K — Outcome success without causal evidence → no causal language", () => {
  const view = experienceFrom();
  assert.equal(view.causalStatus, "unestablished");
  assert.doesNotMatch(view.didItWorkStatement, /Decision caused|caused the improvement/i);
  assert.match(view.didItWorkStatement, /Causal attribution has not been established/);
});

test("L — Supported CORE-INT:3 causal finding → causal explanation allowed", () => {
  const view = experienceFrom(learn({ causalFinding: supportedFinding() }));
  assert.equal(view.causalStatus, "supported");
  assert.match(view.causalStatement, /causal finding|CORE-INT:3/i);
});

test("M — Historical APP-4 Learning → historical context only", () => {
  const result = learn();
  const candidate = result.candidates.find((entry) => entry.learningType === "outcome-learning")!;
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId)!;
  promoteGroundedLearningToApp4({ candidate, promotion, owner: "exi5-test" });
  const view = experienceFrom(result);
  assert.ok(view.historicalLearning.length >= 1);
  assert.equal(view.historicalLearning[0]?.currentTruth, false);
  assert.match(view.historicalStatement, /past context|historical/i);
});

test("N — Historical Learning conflicts with current Reality → current Reality wins", () => {
  const result = learn();
  const candidate = result.candidates.find((entry) => entry.learningType === "outcome-learning")!;
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId)!;
  promoteGroundedLearningToApp4({ candidate, promotion, owner: "exi5-test" });
  const view = composeNexoraExi5OutcomeLearningExperience({
    workspaceId,
    subjectId: "obj-capacity",
    assessment: readyAssessment(),
    learning: result,
    causal: pipeline("obj-capacity").experience.coreCausalAssessment,
    currentRealityStatement: "Capacity utilization is now 92% and rising.",
  });
  assert.equal(view.currentRealityWins, true);
  assert.match(view.historicalStatement, /Current Reality remains the live business truth/);
});

test("O — Advisor explanation is projection only", () => {
  const { html, experience } = renderAdvisor("obj-capacity");
  assert.match(html, /data-exi5="outcome-learning"/);
  assert.match(html, /No validated actual outcome|No live Outcome|No promoted Learning/i);
  assert.equal(experience.outcomeLearning.authorityState.createsLearning, false);
  assert.equal(experience.outcomeLearning.authorityState.advisorTextIsEvidence, false);
});

test("P — Conversation 'Did it work?' answers Outcome without causal overclaim", () => {
  assert.equal(classifyNexoraExiUtterance("Did the decision work?"), "didItWork");
  const pack = pipeline("obj-capacity");
  const answered = ask(pack, "Did the decision work?");
  assert.doesNotMatch(answered.response, /Decision caused|caused the improvement/i);
  assert.match(answered.response, /No validated actual outcome is available yet/i);
});

test("Q — Conversation 'Why?' respects CORE-INT:3 boundary", () => {
  assert.equal(classifyNexoraExiUtterance("Why did this happen?"), "whyOutcome");
  const pack = pipeline("obj-capacity");
  const answered = ask(pack, "Why did this happen?");
  assert.match(answered.response, /not proven|not been established|not currently have enough evidence/i);
  assert.doesNotMatch(answered.response, /The Decision caused/i);
});

test("R — No live Learning → honest empty state", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.coreLearningAssessment.candidates.length, 0);
  assert.match(pack.experience.outcomeLearning.learningStatement, /will not invent|No promoted Learning/i);
});

test("S — Repeated-consistent evidence strengthens only per CORE-OUT:2", () => {
  learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "rep-1" })] }),
  });
  const second = learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "rep-1" })] }),
  });
  const view = experienceFrom(second);
  const outcome = view.learningCandidates.find((entry) => /Outcome/i.test(entry.statement) || entry.status === "supported");
  assert.ok(outcome);
  assert.notEqual(outcome.scope, "generalized");
});

test("T — Repeated-mixed evidence is not cherry-picked", () => {
  learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "mix-1", numericValue: 70 })] }),
  });
  const second = learn({
    assessment: readyAssessment({
      actuals: [
        actual({ observationId: "mix-2a", numericValue: 70 }),
        actual({ observationId: "mix-2b", numericValue: 95 }),
      ],
    }),
  });
  const view = experienceFrom(second);
  assert.equal(view.promotedLearning.length, 0);
  assert.match(view.learningStatement, /conflicting|inconclusive|not enough evidence|will not invent/i);
});

test("U — Decision remains immutable", () => {
  const source = readFileSync(join(here, "nexoraExecutiveIntelligenceExperienceExi5.ts"), "utf8");
  assert.doesNotMatch(source, /status:\s*"approved"|rationale:/);
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.mutatesDecision, false);
});

test("V — Execution remains immutable", () => {
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.mutatesExecution, false);
});

test("W — Outcome remains immutable", () => {
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.mutatesOutcomeAssessment, false);
});

test("X — Learning remains Core-owned", () => {
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.createsLearning, false);
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.mutatesLearning, false);
});

test("Y — APP-4 remains memory authority", () => {
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.writesMemory, false);
  assert.equal(NEXORA_EXI5_EXPERIENCE_BOUNDARY.promotesToApp4, false);
});

test("Z — Stage remains unchanged", () => {
  const pack = pipeline("obj-capacity");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
  assert.ok(pack.presentation.scene.objects.every((object) => object.targetPosition[2] === 0));
  assert.equal(nexoraExecutiveShellVersion, "1.2.0");
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
});

test("Hard invariants A–Z", () => {
  const b = NEXORA_EXI5_EXPERIENCE_BOUNDARY;
  assert.equal(b.createsOutcome, false);
  assert.equal(b.createsLearning, false);
  assert.equal(b.createsCausalFinding, false);
  assert.equal(b.createsRecommendation, false);
  assert.equal(b.mutatesDecision, false);
  assert.equal(b.mutatesExecution, false);
  assert.equal(b.mutatesObservation, false);
  assert.equal(b.mutatesOutcomeAssessment, false);
  assert.equal(b.mutatesLearning, false);
  assert.equal(b.writesMemory, false);
  assert.equal(b.historicalMemoryIsCurrentTruth, false);
  assert.equal(b.executionCompletionEqualsOutcome, false);
  assert.equal(b.outcomeSuccessEqualsCausalProof, false);
  assert.equal(b.singleSuccessEqualsGeneralRule, false);
  assert.equal(b.advisorTextIsEvidence, false);
  assert.equal(b.conversationTextIsEvidence, false);
  assert.equal(b.currentKpiEqualsOutcome, false);
  assert.equal(b.usesLlm, false);
  assert.equal(b.redesignsStage, false);
  assert.equal(nexoraExecutiveShellVersion, "1.2.0");
});

test("Safety — met Outcome does not display Decision caused improvement", () => {
  const view = experienceFrom();
  assert.match(view.didItWorkStatement, /Causal attribution has not been established/);
  assert.doesNotMatch(
    [view.didItWorkStatement, view.causalStatement, view.learningStatement].join(" "),
    /The Decision caused the improvement/,
  );
});
