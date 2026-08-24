/**
 * CORE-OUT:1 — Live Outcome Intelligence invariants A–T and cases A–J.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

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
import {
  LIVE_OUTCOME_BOUNDARY,
  nexoraLiveOutcomeIntelligenceIdentity,
  presentOutcomeAssessment,
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeBaseline,
  type ExecutiveOutcomeExpectation,
  type ExecutiveOutcomeObservation,
} from "./nexoraLiveOutcomeIntelligence.ts";
import { resetOutcomeObservationCaptureForTests } from "./nexoraLiveOutcomeObservationCapture.ts";

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
  return Object.freeze({ state, presentation, narrative, experience });
}

function expected(
  overrides: Partial<ExecutiveOutcomeExpectation> = {},
): ExecutiveOutcomeExpectation {
  return Object.freeze({
    expectationId: "expected-capacity",
    statement: "Capacity expansion is expected to relieve Capacity Gap.",
    claimKind: "PREDICTION",
    dimension: "capacity-gap",
    source: "scenario",
    numericTarget: 80,
    comparator: "lte",
    unit: "%",
    expectedDirection: null,
    capturedAt: "2026-01-01T00:00:00.000Z",
    evidenceRefs: Object.freeze([
      {
        sourceKind: "scenario" as const,
        sourceId: "ctx-scenario-capacity",
        factKey: "expected-effect",
      },
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
    observedAt: "2026-04-01T00:00:00.000Z",
    freshness: "current",
    validationStatus: "validated",
    outcomeLinked: true,
    evidenceRefs: Object.freeze([
      {
        sourceKind: "data-reality" as const,
        sourceId: "rdi:capacity",
        factKey: "utilization",
      },
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
    confidence: "medium",
    provenanceRefs: Object.freeze(["test:baseline-capacity"]),
    ...overrides,
  });
}

test("CORE-OUT:1 identity and boundary", () => {
  assert.equal(
    nexoraLiveOutcomeIntelligenceIdentity,
    "CORE-OUT:1/LiveOutcomeIntelligence",
  );
  assert.equal(LIVE_OUTCOME_BOUNDARY.writesMemory, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.usesLlm, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.wiresCc11, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.infersCausality, false);
});

test("A — Prediction never becomes actual FACT automatically", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-scenario-capacity",
    expected: expected(),
  });
  assert.equal(assessment.expectedOutcome?.claimKind, "PREDICTION");
  assert.equal(assessment.actualOutcome, null);
});

test("B — Current KPI does not automatically become Outcome", () => {
  const live = pipeline("obj-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.actualOutcome, null);
  if (live.currentReality) assert.equal(live.currentReality.isOutcome, false);
});

test("C — Execution progress does not equal Outcome", () => {
  const live = pipeline("ctx-execution-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.actualOutcome, null);
  assert.match(presentOutcomeAssessment(live), /No validated actual outcome|No live Outcome/i);
});

test("D — Recommendation does not equal Outcome", () => {
  const live = pipeline("ctx-decision-capacity").experience;
  assert.ok(live.recommendation.statement);
  assert.equal(live.coreOutcomeAssessment.actualOutcome, null);
  assert.notEqual(live.recommendation.statement, live.outcome.statement);
});

test("E — Decision commitment does not equal Outcome", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    decisionId: "ctx-decision-capacity",
    expected: expected({ source: "decision" }),
    decisionCommitted: true,
  });
  assert.equal(assessment.actualOutcome, null);
  assert.equal(LIVE_OUTCOME_BOUNDARY.decisionEqualsOutcome, false);
});

test("F — Recent Change does not automatically equal Outcome", () => {
  assert.equal(LIVE_OUTCOME_BOUNDARY.changeEqualsOutcome, false);
  const live = pipeline("obj-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.actualOutcome, null);
});

test("G — Actual Outcome requires evidence and provenance", () => {
  const rejected = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [
      actual({
        evidenceRefs: Object.freeze([]),
        provenanceRefs: Object.freeze([]),
      }),
    ],
  });
  assert.equal(rejected.actualOutcome, null);
  const accepted = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual()],
    baseline: baseline(),
  });
  assert.ok(accepted.actualOutcome);
  assert.ok(accepted.actualOutcome.provenanceRefs.length > 0);
});

test("H — Expected and actual retain separate claim identities", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual()],
    baseline: baseline(),
  });
  assert.equal(assessment.expectedOutcome?.claimKind, "PREDICTION");
  assert.equal(assessment.actualOutcome?.claimKind, "FACT");
  assert.notEqual(
    assessment.expectedOutcome?.expectationId,
    assessment.actualOutcome?.observationId,
  );
});

test("I — Comparison requires semantic compatibility", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ dimension: "revenue", statement: "Revenue changed." })],
    baseline: baseline(),
  });
  assert.equal(assessment.comparison.result, "insufficient-comparable-evidence");
});

test("J — Numeric comparison uses only canonical numeric evidence", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ numericValue: 80 })],
    baseline: baseline(),
  });
  assert.equal(assessment.comparison.comparable, true);
  assert.equal(assessment.comparison.numericDelta, 0);
  assert.equal(assessment.comparison.result, "met");
  assert.doesNotMatch(assessment.comparison.statement, /ROI|savings|probability/i);
});

test("K — Missing baseline prevents unsupported evaluation", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual()],
  });
  assert.equal(assessment.comparison.incompatibilityReason, "baseline-missing");
  assert.equal(assessment.status, "comparison-incomplete");
});

test("L — Stale evidence cannot produce confident success", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ freshness: "stale", numericValue: 70 })],
    baseline: baseline(),
  });
  assert.equal(assessment.status, "stale");
  assert.notEqual(assessment.comparison.result, "met");
});

test("M — Conflicting evidence cannot produce confident success/failure", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [
      actual({ observationId: "a1", numericValue: 70 }),
      actual({ observationId: "a2", numericValue: 90, provenanceRefs: Object.freeze(["test:a2"]) }),
    ],
    baseline: baseline(),
  });
  assert.equal(assessment.status, "conflicting");
  assert.notEqual(assessment.comparison.result, "met");
  assert.notEqual(assessment.comparison.result, "not-met");
});

test("N — Outcome does not establish causation", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ numericValue: 80 })],
    baseline: baseline(),
  });
  assert.equal(assessment.establishesCausation, false);
});

test("O — Outcome does not create Learning", () => {
  const assessment = pipeline("ctx-decision-capacity").experience.coreOutcomeAssessment;
  assert.equal(assessment.createsLearning, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
});

test("P — No APP-4 promotion", () => {
  const source = readFileSync(join(here, "nexoraLiveOutcomeIntelligence.ts"), "utf8");
  assert.doesNotMatch(source, /persistDurableExecutiveMemory|promoteEligibleLearningToApp4/);
  assert.equal(LIVE_OUTCOME_BOUNDARY.writesMemory, false);
});

test("Q — No Decision mutation", () => {
  assert.equal(LIVE_OUTCOME_BOUNDARY.mutatesDecision, false);
});

test("R — No Execution mutation", () => {
  assert.equal(LIVE_OUTCOME_BOUNDARY.mutatesExecution, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.wiresCc11, false);
});

test("S — No Stage focus change", () => {
  const pack = pipeline("obj-capacity");
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(LIVE_OUTCOME_BOUNDARY.mutatesStage, false);
});

test("T — Frozen MVP identity remains unchanged", () => {
  assert.equal(
    nexoraManagerMvpReleaseBaselineIdentity,
    "MVP:1/NexoraManagerMVPReleaseBaseline",
  );
});

test("Live case A — expected present, actual missing", () => {
  const live = pipeline("ctx-scenario-capacity").experience.coreOutcomeAssessment;
  assert.ok(live.expectedOutcome);
  assert.equal(live.expectedOutcome.claimKind, "PREDICTION");
  assert.equal(live.actualOutcome, null);
  assert.match(presentOutcomeAssessment(live), /No validated actual outcome is available yet/);
});

test("Live case B — actual without baseline is incomplete", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual()],
  });
  assert.ok(assessment.actualOutcome);
  assert.equal(assessment.status, "comparison-incomplete");
});

test("Live case C — expected + actual + baseline compare deterministically", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ numericValue: 80 })],
    baseline: baseline(),
  });
  assert.equal(assessment.status, "comparison-ready");
  assert.equal(assessment.comparison.result, "met");
});

test("Live case D — different dimensions are not comparable", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ dimension: "revenue" })],
    baseline: baseline(),
  });
  assert.equal(assessment.comparison.result, "insufficient-comparable-evidence");
});

test("Live case E — stale actual", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ freshness: "stale" })],
    baseline: baseline(),
  });
  assert.equal(assessment.status, "stale");
});

test("Live case F — conflicting observations", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [
      actual({ observationId: "one", numericValue: 70 }),
      actual({
        observationId: "two",
        numericValue: 90,
        provenanceRefs: Object.freeze(["test:two"]),
      }),
    ],
    baseline: baseline(),
  });
  assert.equal(assessment.status, "conflicting");
});

test("Live case G — scenario prediction is not actual Outcome", () => {
  const live = pipeline("ctx-scenario-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.expectedOutcome?.source, "scenario");
  assert.equal(live.actualOutcome, null);
});

test("Live case H — execution progress is not actual Outcome", () => {
  const live = pipeline("ctx-execution-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.actualOutcome, null);
});

test("Live case I — current Data Reality KPI is not automatically Outcome", () => {
  const live = pipeline("obj-capacity").experience.coreOutcomeAssessment;
  assert.equal(live.actualOutcome, null);
});

test("Live case J — missing everything", () => {
  const live = pipeline(null).experience.coreOutcomeAssessment;
  assert.equal(live.expectedOutcome, null);
  assert.equal(live.actualOutcome, null);
  assert.match(presentOutcomeAssessment(live), /No live Outcome is available yet/);
});

test("CORE-OUT:1 uses CORE-OUT:1A capture instead of ad-hoc outcomeLinked", () => {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "ctx-decision-capacity",
    expected: expected(),
    actuals: [actual({ numericValue: 80 })],
    baseline: baseline(),
    capture: {
      linkedActuals: [],
      baseline: null,
      evaluatorWindow: {
        decisionAt: null,
        executionAt: null,
        observedAt: null,
        timingComplete: false,
      },
    },
  });
  assert.equal(assessment.actualOutcome, null);
  assert.equal(assessment.comparison.result, "unknown");
});
