/**
 * CORE-OUT:1A — Live Outcome Observation & Capture.
 * Cases A–T and hard invariants A–Z.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, test } from "node:test";

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
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import { presentOutcomeAssessment, projectLiveOutcomeIntelligence } from "./nexoraLiveOutcomeIntelligence.ts";
import type { ExecutiveOutcomeExpectation } from "./nexoraLiveOutcomeIntelligence.ts";
import {
  LIVE_OUTCOME_OBSERVATION_BOUNDARY,
  bindOutcomeObservation,
  canonicalExpectedOutcomeId,
  captureOutcomeObservation,
  dimensionsCompatible,
  evaluateOutcomeLink,
  listCapturedObservations,
  nexoraLiveOutcomeObservationCaptureIdentity,
  nexoraLiveOutcomeObservationCaptureVersion,
  observationIdentity,
  observationInputFromKpi,
  openOutcomeObservationWindow,
  projectOutcomeObservationCapture,
  resetOutcomeObservationCaptureForTests,
  unitsCompatible,
  type OutcomeObservationInput,
} from "./nexoraLiveOutcomeObservationCapture.ts";

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
    expectationId: canonicalExpectedOutcomeId("capacity"),
    statement: "Capacity utilization target = 80%.",
    claimKind: "PREDICTION",
    dimension: "capacity-utilization",
    source: "decision",
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

function observation(
  overrides: Partial<OutcomeObservationInput> = {},
): OutcomeObservationInput {
  return Object.freeze({
    subjectId: "obj-capacity",
    metricId: "capacity-utilization",
    dimension: "capacity-utilization",
    unit: "%",
    value: 78,
    qualitativeState: null,
    observedAt: "2026-04-01T00:00:00.000Z",
    capturedAt: "2026-04-01T00:00:00.000Z",
    sourceId: "rdi:capacity",
    datasetId: "ds:capacity-snapshot",
    evidenceRefs: Object.freeze([
      {
        sourceKind: "data-reality" as const,
        sourceId: "rdi:capacity",
        factKey: "utilization",
      },
    ]),
    provenanceRefs: Object.freeze(["rdi:capacity:ds:capacity-snapshot"]),
    validationState: "valid",
    freshnessState: "current",
    decisionId: "ctx-decision-capacity",
    executionId: "ctx-execution-capacity",
    expectedOutcomeId: canonicalExpectedOutcomeId("capacity"),
    ...overrides,
  });
}

function openWindow(
  overrides: Partial<Parameters<typeof openOutcomeObservationWindow>[0]> = {},
) {
  return openOutcomeObservationWindow({
    subjectId: "obj-capacity",
    decisionId: "ctx-decision-capacity",
    executionId: "ctx-execution-capacity",
    openedAt: "2026-01-01T00:00:00.000Z",
    expectedStartAt: "2026-01-01T00:00:00.000Z",
    expectedEndAt: "2026-12-31T23:59:59.000Z",
    expectedOutcomeIds: [canonicalExpectedOutcomeId("capacity")],
    ...overrides,
  });
}

function linkedCapture(
  observationOverrides: Partial<OutcomeObservationInput> = {},
  windowOverrides?: Parameters<typeof openOutcomeObservationWindow>[0],
) {
  const window = openWindow(windowOverrides);
  return captureOutcomeObservation({
    observation: observation(observationOverrides),
    expected: expected(),
    window,
    linkBasis: "metric-binding",
  });
}

describe("CORE-OUT:1A Live Outcome Observation Capture", { concurrency: false }, () => {
  beforeEach(() => {
    resetOutcomeObservationCaptureForTests();
  });
  afterEach(() => {
    resetOutcomeObservationCaptureForTests();
  });

  test("identity and boundary", () => {
    assert.equal(
      nexoraLiveOutcomeObservationCaptureIdentity,
      "CORE-OUT:1A/LiveOutcomeObservationCapture",
    );
    assert.equal(nexoraLiveOutcomeObservationCaptureVersion, "1.0.0");
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluatesSuccess, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.createsLearning, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.writesApp4Learning, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.usesLlm, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.wiresCc11, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.storageLifetime, "session");
  });

  test("A — Valid linked post-decision observation is eligible Actual Outcome evidence", () => {
    const captured = linkedCapture();
    assert.equal(captured.eligibleAsActualOutcome, true);
    assert.equal(captured.isOutcome, true);
    assert.equal(captured.outcomeLink?.linkBasis, "metric-binding");
    const assessment = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      expected: expected(),
      window: openWindow(),
    });
    assert.equal(assessment.linkedActuals.length, 1);
    assert.equal(assessment.evaluatesSuccess, false);
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture: assessment,
    });
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.actualOutcome?.claimKind, "FACT");
    assert.equal(evaluated.establishesCausation, false);
  });

  test("B — Valid current KPI without Outcome link remains Reality only", () => {
    const captured = captureOutcomeObservation({
      observation: observation({ expectedOutcomeId: null }),
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("missing-outcome-link"));
    assert.ok(captured.rejections.includes("current-kpi-unlinked"));
    const assessment = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      currentKpi: {
        statement: "Capacity utilization is 78%.",
        dimension: "capacity-utilization",
        numericValue: 78,
      },
    });
    assert.equal(assessment.linkedActuals.length, 0);
    assert.equal(assessment.currentReality?.isOutcome, false);
  });

  test("C — Observation after Decision without explicit binding is not Outcome evidence", () => {
    const window = openWindow();
    const captured = captureOutcomeObservation({
      observation: observation({
        observedAt: "2026-06-01T00:00:00.000Z",
        expectedOutcomeId: null,
      }),
      window,
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("missing-outcome-link"));
  });

  test("D — Same metric, wrong observation window is not eligible", () => {
    const window = openWindow({
      openedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-03-01T00:00:00.000Z",
    });
    const captured = captureOutcomeObservation({
      observation: observation({ observedAt: "2026-06-01T00:00:00.000Z" }),
      expected: expected(),
      window,
      linkBasis: "metric-binding",
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("window-mismatch"));
  });

  test("E — Same metric, incompatible unit is not comparable", () => {
    const captured = linkedCapture({ unit: "USD" });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("unit-mismatch"));
    assert.equal(unitsCompatible("%", "USD"), false);
  });

  test("F — Invalid observation is rejected as validated Actual Outcome", () => {
    const captured = linkedCapture({ validationState: "invalid" });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("invalid-observation"));
  });

  test("G — Partial observation is eligible only with bounded confidence", () => {
    const captured = linkedCapture({ validationState: "partial" });
    assert.equal(captured.eligibleAsActualOutcome, true);
    assert.equal(captured.outcomeLink?.confidence, "low");
    const assessment = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      expected: expected(),
      window: openWindow(),
    });
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture: assessment,
      baseline: {
        measured: "capacity-utilization",
        measuredAt: "2026-01-01T00:00:00.000Z",
        source: "data-reality",
        numericValue: 88,
        unit: "%",
        confidence: "medium",
        provenanceRefs: Object.freeze(["test:baseline"]),
      },
    });
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.confidence, "low");
  });

  test("H — Stale observation is retained but remains stale", () => {
    const captured = linkedCapture({
      validationState: "stale",
      freshnessState: "current",
    });
    assert.equal(captured.eligibleAsActualOutcome, true);
    assert.equal(captured.freshnessState, "stale");
    const assessed = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture: projectOutcomeObservationCapture({
        subjectId: "obj-capacity",
        expected: expected(),
        window: openWindow(),
      }),
    });
    assert.equal(assessed.status, "stale");
    assert.notEqual(assessed.comparison.result, "met");
  });

  test("I — Conflicting linked observations are both preserved", () => {
    linkedCapture({
      sourceId: "rdi:capacity-a",
      datasetId: "ds:a",
      value: 70,
    });
    linkedCapture({
      sourceId: "rdi:capacity-b",
      datasetId: "ds:b",
      value: 90,
      observedAt: "2026-04-02T00:00:00.000Z",
      capturedAt: "2026-04-02T00:00:00.000Z",
    });
    const assessment = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      expected: expected(),
      window: openWindow(),
    });
    assert.equal(assessment.linkedActuals.length, 2);
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture: assessment,
    });
    assert.equal(evaluated.status, "conflicting");
    assert.equal(evaluated.conflictingObservations.length, 2);
    assert.notEqual(evaluated.comparison.result, "met");
    assert.notEqual(evaluated.comparison.result, "not-met");
  });

  test("J — Duplicate source observation is idempotent", () => {
    const first = linkedCapture();
    const second = linkedCapture();
    assert.equal(second.duplicateOf, first.observationId);
    assert.equal(listCapturedObservations("obj-capacity").length, 1);
    assert.equal(first.value, second.value);
  });

  test("K — Repeated real observations keep separate stable identities", () => {
    const t1 = linkedCapture({ observedAt: "2026-04-01T00:00:00.000Z", value: 78 });
    const t2 = linkedCapture({
      observedAt: "2026-05-01T00:00:00.000Z",
      capturedAt: "2026-05-01T00:00:00.000Z",
      value: 78,
    });
    assert.notEqual(t1.observationId, t2.observationId);
    assert.equal(listCapturedObservations("obj-capacity").length, 2);
    assert.equal(
      observationIdentity({
        sourceId: "rdi:capacity",
        datasetId: "ds:capacity-snapshot",
        metricId: "capacity-utilization",
        observedAt: "2026-04-01T00:00:00.000Z",
      }),
      t1.observationId,
    );
  });

  test("L — Execution 100% without business observation leaves Actual Outcome unknown", () => {
    const captured = captureOutcomeObservation({
      observation: observation({
        metricId: "execution-progress",
        dimension: "execution-progress",
        unit: "%",
        value: 100,
        executionProgressOnly: true,
        expectedOutcomeId: null,
      }),
      window: openWindow(),
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("execution-progress-only"));
    const live = pipeline("ctx-execution-capacity").experience.coreOutcomeAssessment;
    assert.equal(live.actualOutcome, null);
  });

  test("M — Scenario prediction is expected only, not actual", () => {
    const live = pipeline("ctx-scenario-capacity").experience.coreOutcomeAssessment;
    assert.equal(live.expectedOutcome?.claimKind, "PREDICTION");
    assert.equal(live.actualOutcome, null);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluatesSuccess, false);
  });

  test("N — Recent Change without Outcome link is not Outcome", () => {
    const captured = captureOutcomeObservation({
      observation: observation({
        recentChangeOnly: true,
        expectedOutcomeId: null,
      }),
      window: openWindow(),
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("recent-change-only"));
  });

  test("O — Valid baseline + expected + linked actual is comparison-ready for CORE-OUT:1", () => {
    const baselineObs = captureOutcomeObservation({
      observation: observation({
        observedAt: "2026-01-01T00:00:00.000Z",
        capturedAt: "2026-01-01T00:00:00.000Z",
        value: 88,
        expectedOutcomeId: null,
      }),
    });
    const window = openWindow({
      baselineObservationId: baselineObs.observationId,
    });
    captureOutcomeObservation({
      observation: observation({ value: 80 }),
      expected: expected(),
      window,
      linkBasis: "metric-binding",
    });
    const capture = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      expected: expected(),
      window,
    });
    assert.ok(capture.baseline);
    assert.equal(capture.baseline?.numericValue, 88);
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture,
    });
    assert.equal(evaluated.status, "comparison-ready");
    assert.equal(evaluated.comparison.result, "met");
    assert.equal(evaluated.establishesCausation, false);
  });

  test("P — Missing baseline + linked actual is observed with comparison incomplete", () => {
    linkedCapture({ value: 80 });
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      expected: expected(),
      capture: projectOutcomeObservationCapture({
        subjectId: "obj-capacity",
        expected: expected(),
        window: openWindow(),
      }),
    });
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.status, "comparison-incomplete");
    assert.equal(evaluated.comparison.incompatibilityReason, "baseline-missing");
  });

  test("Q — Different dimension is not outcome-linked", () => {
    const captured = captureOutcomeObservation({
      observation: observation({
        metricId: "revenue",
        dimension: "revenue",
        unit: "USD",
        value: 100,
      }),
      expected: expected(),
      window: openWindow(),
      linkBasis: "metric-binding",
    });
    assert.equal(captured.outcomeLink, null);
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.equal(dimensionsCompatible("revenue", "capacity-utilization"), false);
  });

  test("R — Missing timestamp is timing incomplete", () => {
    const captured = captureOutcomeObservation({
      observation: observation({ observedAt: null }),
      expected: expected(),
      window: openWindow(),
      linkBasis: "metric-binding",
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("missing-timestamp"));
  });

  test("S — Missing provenance cannot become validated Outcome evidence", () => {
    const captured = captureOutcomeObservation({
      observation: observation({
        sourceId: null,
        datasetId: null,
        provenanceRefs: Object.freeze([]),
      }),
      expected: expected(),
      window: openWindow(),
      linkBasis: "metric-binding",
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("missing-provenance"));
  });

  test("T — No live post-decision data remains honest pending Outcome", () => {
    const live = pipeline("ctx-scenario-capacity").experience.coreOutcomeAssessment;
    assert.equal(live.actualOutcome, null);
    assert.match(
      presentOutcomeAssessment(live),
      /No validated actual outcome is available yet|No live Outcome is available yet/,
    );
  });

  test("Safety — Decision + time + KPI improve does not automatically produce success", () => {
    openWindow();
    captureOutcomeObservation({
      observation: observation({
        value: 70,
        observedAt: "2026-06-01T00:00:00.000Z",
        expectedOutcomeId: null,
      }),
    });
    const capture = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      expected: expected(),
      currentKpi: {
        statement: "Capacity improved to 70%.",
        dimension: "capacity-utilization",
        numericValue: 70,
      },
    });
    const evaluated = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      decisionId: "ctx-decision-capacity",
      expected: expected(),
      capture,
      decisionCommitted: true,
    });
    assert.equal(capture.linkedActuals.length, 0);
    assert.equal(evaluated.actualOutcome, null);
    assert.notEqual(evaluated.comparison.result, "met");
    assert.equal(evaluated.establishesCausation, false);
  });

  test("Window without real timestamps is timing-incomplete", () => {
    const window = openOutcomeObservationWindow({
      subjectId: "obj-capacity",
      decisionId: "ctx-decision-capacity",
    });
    assert.equal(window.status, "timing-incomplete");
    const captured = captureOutcomeObservation({
      observation: observation(),
      expected: expected(),
      window,
      linkBasis: "metric-binding",
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("timing-incomplete"));
  });

  test("Unsupported observation cannot become validated Actual", () => {
    const captured = linkedCapture({ validationState: "unsupported" });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.ok(captured.rejections.includes("unsupported-observation"));
  });

  test("Forbidden link bases never become Outcome linkage", () => {
    for (const basis of ["temporal-proximity", "semantic-guess", "llm-inferred"]) {
      assert.equal(
        evaluateOutcomeLink({
          observation: observation(),
          expected: expected(),
          basis,
        }),
        null,
      );
    }
  });

  test("Latest KPI cannot be used retroactively as decision-time baseline", () => {
    const later = captureOutcomeObservation({
      observation: observation({
        observedAt: "2026-06-01T00:00:00.000Z",
        value: 60,
        expectedOutcomeId: null,
      }),
    });
    const window = openWindow({
      openedAt: "2026-01-01T00:00:00.000Z",
      baselineObservationId: later.observationId,
    });
    const capture = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
      window,
    });
    assert.equal(capture.baseline, null);
  });

  test("KPI helper does not mark current KPI as Outcome", () => {
    const input = observationInputFromKpi({
      kpi: {
        kpiId: "capacity-utilization",
        objectKey: "capacity",
        nexoraObjectId: "obj-capacity",
        value: 78,
        unit: "%",
        calculatedAt: "2026-04-01T00:00:00.000Z",
      },
      subjectId: "obj-capacity",
      dimension: "capacity-utilization",
      sourceId: "rdi:capacity",
      datasetId: "ds:capacity-snapshot",
      validationState: "valid",
      provenanceRefs: ["rdi:capacity"],
    });
    const captured = captureOutcomeObservation({ observation: input });
    assert.equal(captured.eligibleAsActualOutcome, false);
    assert.equal(captured.isOutcome, false);
  });

  test("Manual binding is an explicit validated action", () => {
    const captured = captureOutcomeObservation({
      observation: observation({ expectedOutcomeId: null }),
      window: openWindow(),
    });
    assert.equal(captured.eligibleAsActualOutcome, false);
    const bound = bindOutcomeObservation({
      observationId: captured.observationId,
      expected: expected(),
      basis: "manual-validated-binding",
      window: openWindow(),
    });
    assert.ok(bound);
    assert.equal(bound?.outcomeLink?.linkBasis, "manual-validated-binding");
    assert.equal(bound?.eligibleAsActualOutcome, true);
  });

  test("Same source snapshot with a different value does not overwrite history", () => {
    const first = linkedCapture({ value: 78 });
    const second = captureOutcomeObservation({
      observation: observation({ value: 10 }),
      expected: expected(),
      window: openWindow(),
      linkBasis: "metric-binding",
    });
    assert.equal(second.duplicateOf, first.observationId);
    assert.equal(listCapturedObservations("obj-capacity")[0]?.value, 78);
  });

  test("A Data Reality observation remains Reality until linked", () => {
    assert.equal(
      LIVE_OUTCOME_OBSERVATION_BOUNDARY.dataRealityAuthority,
      "P0:1/NexoraDataRealityFoundation",
    );
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.currentKpiEqualsOutcome, false);
  });

  test("Hard invariants A–Z", () => {
    const source = readFileSync(
      join(here, "nexoraLiveOutcomeObservationCapture.ts"),
      "utf8",
    );
    const projector = readFileSync(
      join(here, "../nex-mvp/nexoraLiveEpistemicProjection.ts"),
      "utf8",
    );
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.dataRealityAuthority, "P0:1/NexoraDataRealityFoundation");
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluatesSuccess, false);
    assert.equal(
      LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluationAuthority,
      "CORE-OUT:1/LiveOutcomeIntelligence",
    );
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.currentKpiEqualsOutcome, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.changeEqualsOutcome, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.progressEqualsOutcome, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.temporalSequenceEqualsCausation, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.temporalSequenceEqualsLinkage, false);
    assert.doesNotMatch(source, /claimKind:\s*"PREDICTION"/);
    assert.doesNotMatch(source, /persistDurableExecutiveMemory|promoteEligibleLearningToApp4/);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.createsLearning, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.writesApp4Learning, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.mutatesDecision, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.mutatesExecution, false);
    assert.doesNotMatch(source, /openai|anthropic|ChatCompletion|generateText/);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.usesLlm, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.wiresCc11, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.mutatesStage, false);
    assert.doesNotMatch(source, /createScenarioPriorityTradeoffTrace|resolveExplainablePriority/);
    assert.equal(
      nexoraManagerMvpReleaseBaselineIdentity,
      "MVP:1/NexoraManagerMVPReleaseBaseline",
    );
    assert.equal(getNexoraManagerMvpReleaseBaselineIdentity().version, "1.2.0");
    assert.doesNotMatch(source, /executionOutcomeLearningIntelligence/);
    assert.doesNotMatch(projector, /persistDurableExecutiveMemory|promoteEligibleLearningToApp4/);
  });

  test("CORE-OUT:1A does not evaluate success or create Learning", () => {
    const captured = linkedCapture({ value: 80 });
    assert.equal("comparison" in captured, false);
    const assessment = projectOutcomeObservationCapture({
      subjectId: "obj-capacity",
    });
    assert.equal(assessment.evaluatesSuccess, false);
    assert.equal(assessment.createsLearning, false);
  });

  test("Live /executive path does not fabricate Outcome observations", () => {
    const pack = pipeline("obj-capacity");
    assert.equal(pack.experience.coreOutcomeAssessment.actualOutcome, null);
    assert.equal(pack.experience.coreOutcomeAssessment.createsLearning, false);
    const focused = pack.presentation.scene.objects.find((object) => object.focused);
    assert.ok(focused);
    assert.equal(focused.targetPosition[2], 0);
    assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  });
});
