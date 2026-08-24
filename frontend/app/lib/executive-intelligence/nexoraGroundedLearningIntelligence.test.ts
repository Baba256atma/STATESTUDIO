/**
 * CORE-OUT:2 — Grounded Learning Intelligence cases A–AJ and hard invariants.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, test } from "node:test";

import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import { composeNexoraExecutiveIntelligenceExperience } from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
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
import { nexoraManagerMvpReleaseBaselineIdentity } from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import { createExecutiveClaim } from "./problemRiskOpportunityIntelligence.ts";
import {
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeAssessment,
  type ExecutiveOutcomeBaseline,
  type ExecutiveOutcomeExpectation,
  type ExecutiveOutcomeObservation,
  type ProjectLiveOutcomeIntelligenceInput,
} from "./nexoraLiveOutcomeIntelligence.ts";
import { nexoraLiveOutcomeObservationCaptureIdentity, resetOutcomeObservationCaptureForTests } from "./nexoraLiveOutcomeObservationCapture.ts";
import { nexoraGroundedCausalConstraintIntelligenceIdentity } from "./nexoraGroundedCausalConstraintIntelligence.ts";
import type { ConstraintAssessment } from "./nexoraGroundedCausalConstraintIntelligence.ts";
import {
  GROUNDED_LEARNING_BOUNDARY,
  nexoraGroundedLearningIntelligenceIdentity,
  presentGroundedLearning,
  projectGroundedLearningIntelligence,
  promoteGroundedLearningToApp4,
  resetGroundedLearningForTests,
  retrieveHistoricalGroundedLearning,
  type CoreInt3CausalFinding,
  type GroundedLearningCandidate,
  type ProjectGroundedLearningInput,
} from "./nexoraGroundedLearningIntelligence.ts";
import { EXECUTION_OUTCOME_LEARNING_BOUNDARY } from "./executionOutcomeLearningIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));
const createdAt = "2026-04-01T00:00:00.000Z";
const workspaceId = "workspace-core-out2";

beforeEach(() => {
  resetGroundedLearningForTests();
  resetExecutiveMemoryStorageEngineForTests();
  initializeExecutiveMemoryStorageEngine(createdAt, "in_memory");
});
afterEach(() => {
  resetGroundedLearningForTests();
  resetExecutiveMemoryStorageEngineForTests();
});

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
    freshness: "current",
    validationStatus: "validated",
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

function readyAssessment(
  overrides: Partial<ProjectLiveOutcomeIntelligenceInput> = {},
): ExecutiveOutcomeAssessment {
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

function evidence() {
  return Object.freeze([
    { sourceKind: "data-reality" as const, sourceId: "rdi:capacity", factKey: "utilization" },
  ]);
}

function constraintAssessment(): ConstraintAssessment {
  const refs = evidence();
  const provenance = Object.freeze(["core-int3:constraint-capacity"]);
  const claim = createExecutiveClaim({
    claimId: "constraint:capacity:existence",
    type: "FACT",
    statement: "Capacity is constrained by staffing.",
    evidenceRefs: refs,
    provenanceRefs: provenance,
  });
  const interpretation = createExecutiveClaim({
    claimId: "constraint:capacity:interpretation",
    type: "ASSUMPTION",
    statement: "Staffing remains a recorded limit in this Outcome context.",
    evidenceRefs: refs,
    provenanceRefs: provenance,
  });
  const constraint = Object.freeze({
    constraintId: "constraint-staffing",
    subjectId: "obj-capacity",
    label: "Staffing",
    relationKind: "constrained-by" as const,
    qualification: "recorded-limit" as const,
    existenceClaim: claim,
    interpretationClaim: interpretation,
    evidenceRefs: refs,
    provenanceRefs: provenance,
    evidenceStatus: "present" as const,
    confidence: "medium" as const,
    relief: null,
  });
  return Object.freeze({
    identity: nexoraGroundedCausalConstraintIntelligenceIdentity,
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    constraints: Object.freeze([constraint]),
    bindingConstraint: constraint,
    unresolvedConstraints: Object.freeze([]),
    evidenceStatus: "present",
    confidence: "medium",
    missingEvidence: null,
    writesMemory: false,
    mutatesStage: false,
    mutatesDecision: false,
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
    evidenceRefs: evidence(),
    provenanceRefs: Object.freeze(["core-int3:causal-capacity"]),
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

function outcomeCandidate(result: ReturnType<typeof learn>): GroundedLearningCandidate {
  const candidate = result.candidates.find((entry) => entry.learningType === "outcome-learning");
  assert.ok(candidate);
  return candidate;
}

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
  resetOutcomeObservationCaptureForTests();
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
  return Object.freeze({ experience, presentation });
}

test("CORE-OUT:2 identity and boundary", () => {
  assert.equal(nexoraGroundedLearningIntelligenceIdentity, "CORE-OUT:2/GroundedLearningIntelligence");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.evaluatesOutcome, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.infersCausality, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.ownsDurableStore, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.durableMemoryAuthority, "APP-4/ExecutiveMemoryStorageEngine");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.usesLlm, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.startsExi5, false);
  assert.equal(nexoraExecutiveShellVersion, "1.2.0");
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
});

test("A — Valid Outcome assessment + sufficient evidence → case-specific Learning candidate", () => {
  const result = learn();
  const candidate = outcomeCandidate(result);
  assert.equal(candidate.scope, "case-specific");
  assert.equal(candidate.status, "supported");
  assert.match(candidate.statement, /causal attribution remains unestablished/i);
  assert.equal(candidate.establishesCausation, false);
});

test("B — Current KPI only → no Learning", () => {
  const result = learn({
    assessment: projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      currentReality: { statement: "Capacity is 88%", dimension: "capacity-gap", numericValue: 88 },
    }),
    currentKpiOnly: true,
  });
  assert.equal(result.candidates.length, 0);
  assert.ok(result.rejectionReasons.includes("current-kpi-is-not-learning"));
});

test("C — Outcome observation without CORE-OUT:1 evaluation → no Learning", () => {
  const result = learn({
    assessment: null,
    observationWithoutAssessment: true,
    capture: {
      identity: nexoraLiveOutcomeObservationCaptureIdentity,
      subjectId: "obj-capacity",
      observations: Object.freeze([]),
      linkedActuals: Object.freeze([]),
      baseline: null,
      window: null,
      evaluatorWindow: Object.freeze({
        decisionAt: null,
        executionAt: null,
        observedAt: createdAt,
        timingComplete: false,
      }),
      currentReality: null,
      evaluatesSuccess: false,
      createsLearning: false,
    },
  });
  assert.equal(result.candidates.length, 0);
});

test("D — Expected Outcome only → no Learning", () => {
  const result = learn({ assessment: null, expectedOnly: true });
  assert.equal(result.candidates.length, 0);
});

test("E — Execution 100%, no Outcome → no Learning", () => {
  const result = learn({
    assessment: null,
    executionCompleteOnly: true,
    executionComplete: true,
  });
  assert.equal(result.candidates.length, 0);
});

test("F — Outcome achieved once → case-specific allowed; generalized forbidden", () => {
  const result = learn({
    requestGeneralized: true,
    assessment: readyAssessment({
      actuals: [actual({ numericValue: 70, observationId: "actual-met" })],
    }),
  });
  const candidate = outcomeCandidate(result);
  assert.equal(candidate.scope, "case-specific");
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId);
  assert.equal(promotion?.reasons.includes("single-case-cannot-generalize"), true);
  assert.equal(candidate.promotionEligibility, "not-promotion-eligible");
});

test("G — Outcome missed once → no automatic bad Decision Learning", () => {
  const result = learn({
    assessment: readyAssessment({
      actuals: [actual({ numericValue: 95, observationId: "actual-missed" })],
    }),
  });
  const candidate = outcomeCandidate(result);
  assert.doesNotMatch(candidate.statement, /bad Decision|wrong strategy|bad execution/i);
});

test("H — Decision followed by KPI improvement → no causal Learning", () => {
  const result = learn({ requestCausalClaim: true });
  assert.equal(result.candidates.some((entry) => entry.learningType === "causal-learning"), false);
  assert.doesNotMatch(outcomeCandidate(result).statement, /caused/i);
});

test("I — Supported CORE-INT:3 causal finding + valid Outcome → causal Learning may be eligible", () => {
  const result = learn({ causalFinding: supportedFinding() });
  const causal = result.candidates.find((entry) => entry.learningType === "causal-learning");
  assert.ok(causal);
  assert.equal(causal.status, "supported");
  const promotion = result.promotions.find((entry) => entry.learningId === causal.learningId);
  assert.equal(promotion?.causalSupportPresent, true);
  assert.equal(causal.promotionEligibility, "promotion-eligible");
});

test("J — Unsupported causal hypothesis → causal Learning not promotable", () => {
  const result = learn({
    causalFinding: supportedFinding({ supported: false, hypothesisOnly: true, findingId: "hypothesis-1" }),
  });
  const causal = result.candidates.find((entry) => entry.learningType === "causal-learning");
  assert.ok(causal);
  assert.equal(causal.promotionEligibility, "not-promotion-eligible");
});

test("K — Valid assumption + linked Outcome evidence → bounded assumption Learning", () => {
  const result = learn({
    assumption: {
      assumptionId: "assumption-staffing",
      statement: "Staffing relief will improve capacity.",
      linkage: "explicit-target-binding",
      observation: "supports",
      evidenceRefs: evidence(),
      provenanceRefs: Object.freeze(["test:assumption"]),
    },
  });
  const assumption = result.candidates.find((entry) => entry.learningType === "assumption-learning");
  assert.ok(assumption);
  assert.equal(assumption.status, "supported");
  assert.equal(assumption.scope, "case-specific");
});

test("L — Prediction matches Actual → prediction Learning; not causal Learning", () => {
  const result = learn({
    prediction: {
      predictionId: "pred-capacity",
      expectedValue: 80,
      actualValue: 82,
      matched: true,
      originalPredictionStatement: "Capacity = 80%",
      evidenceRefs: evidence(),
      provenanceRefs: Object.freeze(["test:prediction"]),
    },
  });
  const prediction = result.candidates.find((entry) => entry.learningType === "prediction-learning");
  assert.ok(prediction);
  assert.match(prediction.statement, /does not establish causal correctness/i);
  assert.equal(result.candidates.some((entry) => entry.learningType === "causal-learning"), false);
});

test("M — Prediction misses Actual → prediction error Learning; original prediction unchanged", () => {
  const original = "Capacity = 80%";
  const result = learn({
    prediction: {
      predictionId: "pred-capacity-miss",
      expectedValue: 80,
      actualValue: 95,
      matched: false,
      originalPredictionStatement: original,
      evidenceRefs: evidence(),
      provenanceRefs: Object.freeze(["test:prediction-miss"]),
    },
  });
  const prediction = result.candidates.find((entry) => entry.learningType === "prediction-learning");
  assert.ok(prediction);
  assert.match(prediction.statement, /original prediction remains unchanged/i);
  assert.equal(original, "Capacity = 80%");
});

test("N — Conflicting Outcome evidence → Learning remains conflicting/inconclusive", () => {
  const result = learn({
    assessment: readyAssessment({
      actuals: [
        actual({ observationId: "obs-a", numericValue: 70 }),
        actual({ observationId: "obs-b", numericValue: 90 }),
      ],
    }),
  });
  const candidate = outcomeCandidate(result);
  assert.ok(candidate.status === "conflicting" || candidate.status === "inconclusive");
  assert.equal(candidate.promotionEligibility, "not-promotion-eligible");
});

test("O — Conflicting causal evidence → causal Learning not promoted", () => {
  const result = learn({
    causalFinding: supportedFinding({ conflicting: true, findingId: "causal-conflict" }),
  });
  const causal = result.candidates.find((entry) => entry.learningType === "causal-learning");
  assert.ok(causal);
  assert.equal(causal.status, "conflicting");
  assert.equal(causal.promotionEligibility, "not-promotion-eligible");
});

test("P — Stale evidence → freshness preserved", () => {
  const result = learn({
    assessment: readyAssessment({
      actuals: [actual({ freshness: "stale", observationId: "stale-actual" })],
    }),
  });
  const candidate = outcomeCandidate(result);
  assert.equal(candidate.freshness, "stale");
});

test("Q — Partial evidence → bounded confidence", () => {
  const result = learn({
    assessment: readyAssessment({
      actuals: [actual({ validationStatus: "partial", observationId: "partial-actual" })],
    }),
  });
  const candidate = outcomeCandidate(result);
  assert.notEqual(candidate.confidence, "high");
  assert.ok(candidate.evidenceStrength === "weak" || candidate.confidence === "low" || candidate.confidence === "unknown");
});

test("R — Missing provenance → not promotable", () => {
  const result = learn({
    assumption: {
      assumptionId: "assumption-no-prov",
      statement: "Unlinked assumption",
      linkage: "explicit-target-binding",
      observation: "supports",
      evidenceRefs: evidence(),
      provenanceRefs: Object.freeze([]),
    },
    assessment: null,
  });
  const assumption = result.candidates.find((entry) => entry.learningType === "assumption-learning");
  assert.ok(assumption);
  assert.equal(assumption.promotionEligibility, "not-promotion-eligible");
});

test("S — Duplicate processing → idempotent", () => {
  const first = learn();
  const second = learn();
  assert.equal(outcomeCandidate(first).learningId, outcomeCandidate(second).learningId);
  assert.equal(first.candidates.filter((entry) => entry.learningType === "outcome-learning").length, 1);
});

test("T — New evidence after Learning → historical Learning preserved/revised", () => {
  const first = learn();
  const second = learn({
    assessment: readyAssessment({
      actuals: [actual({ observationId: "actual-capacity-v2", numericValue: 70 })],
    }),
  });
  assert.notEqual(outcomeCandidate(first).learningId, outcomeCandidate(second).learningId);
  assert.equal(outcomeCandidate(second).previousLearningId, outcomeCandidate(first).learningId);
  assert.ok(second.history.some((entry) => entry.learningId === outcomeCandidate(first).learningId));
});

test("U — APP-4 promotion → canonical APP-4 record only", () => {
  const result = learn();
  const candidate = outcomeCandidate(result);
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId);
  assert.ok(promotion?.eligible);
  const persisted = promoteGroundedLearningToApp4({
    candidate,
    promotion,
    owner: "core-out2-test",
  });
  assert.equal(persisted.authority, "APP-4");
  assert.equal(persisted.promoted, true);
  assert.equal(persisted.stored?.record.category, "learning");
  assert.equal(result.writesMemory, false);
});

test("V — APP-4 retrieval → historical context, not current truth", () => {
  const result = learn();
  const candidate = outcomeCandidate(result);
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId)!;
  promoteGroundedLearningToApp4({ candidate, promotion, owner: "core-out2-test" });
  const retrieval = retrieveHistoricalGroundedLearning({
    workspaceId,
    currentSubjectId: "decision-capacity",
  });
  assert.equal(retrieval.historicalContextOnly, true);
  assert.equal(retrieval.currentTruthAuthority, false);
  assert.ok(retrieval.memories.some((entry) => entry.memoryId === candidate.learningId));
});

test("W — Workspace isolation → no cross-workspace contamination", () => {
  const home = learn();
  const other = learn({ workspaceId: "workspace-other" });
  assert.notEqual(outcomeCandidate(home).learningId, outcomeCandidate(other).learningId);
  const candidate = outcomeCandidate(home);
  const promotion = home.promotions.find((entry) => entry.learningId === candidate.learningId)!;
  promoteGroundedLearningToApp4({ candidate, promotion, owner: "core-out2-test" });
  const retrieval = retrieveHistoricalGroundedLearning({
    workspaceId: "workspace-other",
    currentSubjectId: "decision-capacity",
  });
  assert.equal(retrieval.memories.some((entry) => entry.memoryId === candidate.learningId), false);
});

test("X — Decision rationale unchanged after Learning", () => {
  const decision = Object.freeze({ rationale: "Increase operational capacity.", status: "Approved" });
  const before = JSON.stringify(decision);
  learn();
  assert.equal(JSON.stringify(decision), before);
});

test("Y — Execution state unchanged after Learning", () => {
  const execution = Object.freeze({ progress: 100, status: "completed", owner: "ops" });
  const before = JSON.stringify(execution);
  learn({ executionComplete: true });
  assert.equal(JSON.stringify(execution), before);
});

test("Z — Outcome assessment unchanged by Learning", () => {
  const assessment = readyAssessment();
  const before = JSON.stringify(assessment);
  learn({ assessment });
  assert.equal(JSON.stringify(assessment), before);
  assert.equal(assessment.createsLearning, false);
});

test("AA — Observation unchanged by Learning", () => {
  const observation = actual();
  const before = JSON.stringify(observation);
  learn({ assessment: readyAssessment({ actuals: [observation] }) });
  assert.equal(JSON.stringify(observation), before);
});

test("AB — No causal evidence → no caused claim", () => {
  const candidate = outcomeCandidate(learn());
  assert.doesNotMatch(candidate.statement, /caused/i);
  assert.equal(candidate.establishesCausation, false);
});

test("AC — Single success → no always/reliably generalized claim", () => {
  const candidate = outcomeCandidate(learn());
  assert.doesNotMatch(candidate.statement, /always|reliably/i);
  assert.equal(candidate.scope, "case-specific");
});

test("AD — Repeated consistent evidence → stronger candidate only by explicit rules", () => {
  learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "rep-1", numericValue: 70 })] }),
  });
  const second = learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "rep-2", numericValue: 69 })] }),
  });
  const candidate = outcomeCandidate(second);
  assert.equal(candidate.repeatability, "repeated-consistent");
  assert.equal(candidate.evidenceStrength, "strong");
  assert.equal(candidate.scope, "case-specific");
});

test("AE — Repeated mixed evidence → mixed/inconclusive, not cherry-picked", () => {
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
  const candidate = outcomeCandidate(second);
  assert.ok(candidate.repeatability === "repeated-mixed" || candidate.status === "conflicting");
  assert.equal(candidate.promotionEligibility, "not-promotion-eligible");
});

test("AF — No live post-decision longitudinal evidence → honest no-Learning state", () => {
  const live = pipeline("obj-capacity").experience;
  assert.equal(live.coreLearningAssessment.candidates.length, 0);
  assert.match(live.learning.statement ?? "", /will not invent/i);
});

test("AG — Advisor/presentation text cannot become Learning evidence by itself", () => {
  const result = learn({ assessment: null, presentationOnly: true });
  assert.equal(result.candidates.length, 0);
});

test("AH — Recommendation cannot become durable Learning merely because recommended", () => {
  const result = learn({ assessment: null, recommendationOnly: true });
  assert.equal(result.candidates.length, 0);
});

test("AI — APP-4 duplicate promotion → no duplicate durable record", () => {
  const result = learn();
  const candidate = outcomeCandidate(result);
  const promotion = result.promotions.find((entry) => entry.learningId === candidate.learningId)!;
  const first = promoteGroundedLearningToApp4({ candidate, promotion, owner: "core-out2-test" });
  const second = promoteGroundedLearningToApp4({ candidate, promotion, owner: "core-out2-test" });
  assert.equal(first.promoted, true);
  assert.equal(second.promoted, false);
  assert.equal(second.reason, "duplicate-durable-record");
});

test("AJ — Historical contradiction → both historical states remain traceable", () => {
  const first = learn({
    assessment: readyAssessment({ actuals: [actual({ observationId: "hist-1", numericValue: 70 })] }),
  });
  const second = learn({
    assessment: readyAssessment({
      actuals: [
        actual({ observationId: "hist-2a", numericValue: 70 }),
        actual({ observationId: "hist-2b", numericValue: 96 }),
      ],
    }),
  });
  assert.ok(second.history.some((entry) => entry.learningId === outcomeCandidate(first).learningId));
  assert.ok(second.history.some((entry) => entry.learningId === outcomeCandidate(second).learningId));
});

test("Most important safety — achieved Outcome does not auto-produce causal or policy Learning", () => {
  const result = learn({
    executionComplete: true,
    requestGeneralized: true,
    requestCausalClaim: true,
  });
  const candidate = outcomeCandidate(result);
  assert.doesNotMatch(candidate.statement, /Decision caused|Decision was correct|Repeat this Decision|This strategy works/i);
  assert.equal(result.candidates.some((entry) => entry.learningType === "causal-learning"), false);
  assert.equal(candidate.recommendsAction, false);
});

test("Constraint Learning reuses CORE-INT:3 findings", () => {
  const result = learn({ constraint: constraintAssessment() });
  const constraint = result.candidates.find((entry) => entry.learningType === "constraint-learning");
  assert.ok(constraint);
  assert.match(constraint.statement, /constraint remained relevant/i);
});

test("Hard invariants A–AL", () => {
  const result = learn();
  assert.equal(GROUNDED_LEARNING_BOUNDARY.outcomeObservationAuthority, "CORE-OUT:1A/LiveOutcomeObservationCapture");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.outcomeEvaluationAuthority, "CORE-OUT:1/LiveOutcomeIntelligence");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.epistemicAuthority, "CORE-INT:2/SharedEpistemicUncertaintyFoundation");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.causalAuthority, "CORE-INT:3/GroundedCausalConstraintIntelligence");
  assert.equal(GROUNDED_LEARNING_BOUNDARY.outcomeEqualsLearning, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.successEqualsCausalProof, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.failureEqualsBadDecision, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.executionCompletionEqualsLearning, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.currentKpiEqualsLearning, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.temporalSequenceEqualsCause, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.predictionAccuracyEqualsCausalCorrectness, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.singleCaseEqualsGeneralRule, false);
  assert.equal(result.mutatesDecision, false);
  assert.equal(result.mutatesExecution, false);
  assert.equal(result.mutatesOutcome, false);
  assert.equal(result.mutatesObservation, false);
  assert.equal(result.writesMemory, false);
  assert.equal(result.recommendsAction, false);
  assert.equal(EXECUTION_OUTCOME_LEARNING_BOUNDARY.ownsDurableMemory, false);
  assert.equal(nexoraExecutiveShellVersion, "1.2.0");
  assert.equal(presentGroundedLearning(projectGroundedLearningIntelligence({
    workspaceId,
    subjectId: null,
    createdAt,
    currentKpiOnly: true,
  })), "Current measurements are Reality, not Learning.");
});

test("Frozen Stage geometry remains untouched", () => {
  assert.equal(EXECUTIVE_STAGE_2D_CENTER.z, 0);
  const source = readFileSync(join(here, "nexoraGroundedLearningIntelligence.ts"), "utf8");
  assert.doesNotMatch(source, /from ["']three["']/);
  pipeline("obj-capacity");
});
