/**
 * MVP-OUT:1-R2 — live expected Outcome binding and post-decision capture.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import { projectGroundedCausalConstraintIntelligence } from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  canonicalExpectedOutcomeId,
  captureOutcomeObservation,
  observationIdentity,
  resetOutcomeObservationCaptureForTests,
  type OutcomeObservationInput,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import type { ExecutiveOutcomeExpectation } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { resetGroundedLearningForTests } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import {
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import {
  resolveDecisionExpectedOutcomeBinding,
  DECISION_EXPECTED_OUTCOME_BINDING_BOUNDARY,
  nexoraDecisionExpectedOutcomeBindingIdentity,
  nexoraDecisionExpectedOutcomeBindingVersion,
} from "./nexoraDecisionExpectedOutcomeBinding.ts";
import {
  getPostDecisionCaptureIngestCount,
  ingestDataRealityKpisForOutcomeCapture,
  resetPostDecisionCaptureForTests,
} from "./nexoraPostDecisionObservationCapture.ts";
import {
  coordinateNexoraOutcomeLearningRuntime,
} from "./nexoraOutcomeLearningRuntimeIntegration.ts";
import { resetDecisionOutcomeCommitmentForTests } from "./nexoraDecisionOutcomeCommitment.ts";
import {
  createInitialNexoraMVPFlowDecisionRecords,
  createInitialNexoraMVPFlowExecutionRecords,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import { classifyNexoraExiUtterance } from "./nexoraExecutiveIntelligenceExperience.ts";

const workspaceId = "nexora-mvp-out1-r2";

function intelligence() {
  return projectGroundedCausalConstraintIntelligence({
    subjectId: "ctx-decision-capacity",
    subjectLabel: "Expand Capacity",
    subjectKind: "decision",
    isOverview: false,
    relationships: [],
  });
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
    validationState: "valid" as const,
    freshnessState: "current" as const,
    decisionId: "ctx-decision-capacity",
    executionId: "ctx-execution-capacity",
    expectedOutcomeId: canonicalExpectedOutcomeId("capacity"),
    ...overrides,
  });
}

describe("MVP-OUT:1-R2 live expected binding and capture", { concurrency: false }, () => {
  beforeEach(() => {
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    resetPostDecisionCaptureForTests();
    resetDecisionOutcomeCommitmentForTests();
    resetExecutiveMemoryStorageEngineForTests();
    initializeExecutiveMemoryStorageEngine("2026-01-01T00:00:00.000Z", "in_memory");
  });
  afterEach(() => {
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    resetPostDecisionCaptureForTests();
    resetDecisionOutcomeCommitmentForTests();
    resetExecutiveMemoryStorageEngineForTests();
  });

  test("A/E — stable measurable binding identity survives recomposition", () => {
    const first = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      subjectId: "obj-capacity",
      explicitExpected: expected(),
    });
    const second = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      subjectId: "obj-capacity",
      explicitExpected: expected(),
    });
    assert.equal(first.status, "bound");
    assert.equal(first.bindingId, second.bindingId);
    assert.equal(first.expectedOutcomeId, canonicalExpectedOutcomeId("capacity"));
    assert.equal(first.metricId, "capacity-utilization");
    assert.equal(first.unit, "%");
    assert.equal(first.evaluationRule, "lte");
  });

  test("B/C — live Decision and Advisor prose cannot invent a measurable expectation", () => {
    const live = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      subjectId: "obj-capacity",
    });
    assert.equal(live.status, "missing");
    const prose = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      advisorProse: "This should improve things.",
    });
    assert.equal(prose.status, "missing");
    assert.ok(prose.unsupportedReasons.includes("advisor-prose-is-not-expected-outcome"));
    const kpiTarget = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      currentKpiTarget: "80%",
    });
    assert.equal(kpiTarget.status, "missing");
    const core = intelligence();
    const coordinated = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(coordinated.expectedBinding.status, "missing");
    assert.equal(coordinated.expected, null);
    assert.equal(coordinated.edges.decisionToExpected, "MISSING");
  });

  test("F — revised expectation identity does not overwrite the prior binding id", () => {
    const original = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      explicitExpected: expected(),
    });
    const revised = resolveDecisionExpectedOutcomeBinding({
      decisionId: "ctx-decision-capacity",
      explicitExpected: expected({
        expectationId: canonicalExpectedOutcomeId("capacity-v2"),
        numericTarget: 75,
      }),
    });
    assert.notEqual(original.bindingId, revised.bindingId);
    assert.notEqual(original.expectedOutcomeId, revised.expectedOutcomeId);
  });

  test("H — no genuine time remains timing-incomplete", () => {
    const core = intelligence();
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(result.window?.status, "timing-incomplete");
    assert.equal(result.decision?.committedAt, null);
  });

  test("G/W/AA — genuine window + binding + later observation can link Actual", () => {
    const core = intelligence();
    const baseline = observation({
      value: 90,
      observedAt: "2026-01-01T00:00:00.000Z",
      capturedAt: "2026-01-01T00:00:00.000Z",
      sourceId: "rdi:capacity-baseline",
      datasetId: "ds:capacity-baseline",
      expectedOutcomeId: null,
    });
    captureOutcomeObservation({ observation: baseline });
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation()],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      executionStartedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
      baselineObservationId: observationIdentity(baseline),
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
      execution: {
        executionId: "ctx-execution-capacity",
        status: "complete",
        progress: "100%",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-03-01T00:00:00.000Z",
        sourceDecisionId: "ctx-decision-capacity",
        complete: true,
        source: "explicit",
      },
    });
    assert.equal(result.edges.dataRealityToOut1a, "TEST-ONLY");
    assert.equal(result.expectedBinding.status, "bound");
    assert.equal(result.window?.status, "ready-for-observation");
    assert.ok(result.capture.linkedActuals.length > 0);
    assert.notEqual(result.assessment.actualOutcome, null);
    assert.equal(result.assessment.identity, "CORE-OUT:1/LiveOutcomeIntelligence");
    assert.equal(result.learning.identity, "CORE-OUT:2/GroundedLearningIntelligence");
  });

  test("K/L/M/N — Data Reality KPI ingest is the capture writer; render is not", () => {
    const core = intelligence();
    coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(getPostDecisionCaptureIngestCount(), 0);
    coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(getPostDecisionCaptureIngestCount(), 0);

    const first = ingestDataRealityKpisForOutcomeCapture({
      kpis: [
        {
          kpiId: "kpi-capacity",
          objectKey: "capacity",
          nexoraObjectId: "obj-capacity",
          value: 78,
          unit: "%",
          calculatedAt: "2026-04-01T00:00:00.000Z",
        },
      ],
      sourceId: "rdi:capacity",
      datasetId: "ds:capacity-snapshot",
      observedAt: "2026-04-01T00:00:00.000Z",
      capturedAt: "2026-04-01T00:00:00.000Z",
      provenanceRefs: Object.freeze(["rdi:capacity:ds:capacity-snapshot"]),
      validationState: "valid",
    });
    const duplicate = ingestDataRealityKpisForOutcomeCapture({
      kpis: [
        {
          kpiId: "kpi-capacity",
          objectKey: "capacity",
          nexoraObjectId: "obj-capacity",
          value: 78,
          unit: "%",
          calculatedAt: "2026-04-01T00:00:00.000Z",
        },
      ],
      sourceId: "rdi:capacity",
      datasetId: "ds:capacity-snapshot",
      observedAt: "2026-04-01T00:00:00.000Z",
      capturedAt: "2026-04-01T00:00:00.000Z",
      provenanceRefs: Object.freeze(["rdi:capacity:ds:capacity-snapshot"]),
      validationState: "valid",
    });
    const later = ingestDataRealityKpisForOutcomeCapture({
      kpis: [
        {
          kpiId: "kpi-capacity",
          objectKey: "capacity",
          nexoraObjectId: "obj-capacity",
          value: 76,
          unit: "%",
          calculatedAt: "2026-05-01T00:00:00.000Z",
        },
      ],
      sourceId: "rdi:capacity",
      datasetId: "ds:capacity-snapshot",
      observedAt: "2026-05-01T00:00:00.000Z",
      capturedAt: "2026-05-01T00:00:00.000Z",
      provenanceRefs: Object.freeze(["rdi:capacity:ds:capacity-snapshot"]),
      validationState: "valid",
    });
    assert.equal(first[0]?.duplicateOf, null);
    assert.equal(duplicate[0]?.duplicateOf, first[0]?.observationId);
    assert.notEqual(later[0]?.observationId, first[0]?.observationId);
    assert.equal(getPostDecisionCaptureIngestCount(), 3);
  });

  test("O/P/S/X — missing provenance, invalid, wrong metric, and unbound KPI stay Reality-only", () => {
    const core = intelligence();
    const missingProv = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation({ provenanceRefs: [], sourceId: null, datasetId: null })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(missingProv.assessment.actualOutcome, null);

    const invalid = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation({ validationState: "invalid" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(invalid.assessment.actualOutcome, null);

    const wrongMetric = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation({ metricId: "kpi-revenue", dimension: "kpi-revenue" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongMetric.assessment.actualOutcome, null);

    const unboundKpi = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      currentKpi: {
        statement: "Capacity utilization is 70%.",
        dimension: "kpi-capacity",
        numericValue: 70,
      },
    });
    assert.equal(unboundKpi.expectedBinding.status, "missing");
    assert.equal(unboundKpi.assessment.currentReality?.isOutcome, false);
    assert.equal(unboundKpi.assessment.actualOutcome, null);
    assert.equal(unboundKpi.learning.candidates.length, 0);
  });

  test("AE/AJ/AP — no automatic APP-4; conversation keys remain CORE authorities; no LLM", () => {
    const core = intelligence();
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(result.liveApp4Promotion, false);
    assert.equal(result.app4.length, 0);
    assert.equal(classifyNexoraExiUtterance("Did it work?"), "didItWork");
    assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
    assert.equal(result.authorityState.usesLlm, false);
    assert.equal(result.cc11Live, false);
  });

  test("AR — live chain classifies unavailable edges honestly", () => {
    const core = intelligence();
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(result.edges.decisionToExpected, "MISSING");
    assert.equal(result.edges.decisionToExecution, "CONNECTED");
    assert.equal(result.edges.dataRealityToOut1a, "PARTIAL");
    assert.equal(result.liveActualExists, false);
    assert.equal(result.liveLearningCandidates, 0);
  });

  test("identity — R2 binds and captures without owning Outcome or Learning", () => {
    assert.equal(
      nexoraDecisionExpectedOutcomeBindingIdentity,
      "MVP-OUT:1-R2/DecisionExpectedOutcomeBinding",
    );
    assert.equal(nexoraDecisionExpectedOutcomeBindingVersion, "1.0.0");
    assert.equal(DECISION_EXPECTED_OUTCOME_BINDING_BOUNDARY.inventsTargets, false);
    assert.equal(DECISION_EXPECTED_OUTCOME_BINDING_BOUNDARY.usesLlm, false);
  });

  test("I/J — baseline is at-or-before the boundary; current KPI is not retroactive", () => {
    const core = intelligence();
    const baseline = observation({
      value: 90,
      observedAt: "2026-01-01T00:00:00.000Z",
      capturedAt: "2026-01-01T00:00:00.000Z",
      sourceId: "rdi:capacity-baseline",
      datasetId: "ds:capacity-baseline",
      expectedOutcomeId: null,
    });
    captureOutcomeObservation({ observation: baseline });
    const withBaseline = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
      baselineObservationId: observationIdentity(baseline),
    });
    assert.equal(withBaseline.capture.baseline?.numericValue, 90);
    assert.equal(withBaseline.capture.baseline?.measuredAt, "2026-01-01T00:00:00.000Z");

    resetOutcomeObservationCaptureForTests();
    resetPostDecisionCaptureForTests();
    const currentOnly = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      currentKpi: {
        statement: "Capacity utilization is 70%.",
        dimension: "capacity-utilization",
        numericValue: 70,
      },
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(currentOnly.capture.baseline, null);
    assert.equal(currentOnly.assessment.currentReality?.numericValue, 70);
    assert.equal(currentOnly.assessment.currentReality?.isOutcome, false);
    assert.equal(currentOnly.assessment.actualOutcome, null);
  });

  test("Q/R/T/U/V/Y/Z — bounded, stale, incompatible, recent-change, and execution-complete stay honest", () => {
    const core = intelligence();
    const partial = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          validationState: "partial",
          observedAt: "2026-04-03T00:00:00.000Z",
          capturedAt: "2026-04-03T00:00:00.000Z",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(partial.assessment.actualOutcome?.validationStatus, "partial");

    resetOutcomeObservationCaptureForTests();
    resetPostDecisionCaptureForTests();
    const stale = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          validationState: "stale",
          freshnessState: "stale",
          observedAt: "2026-04-02T00:00:00.000Z",
          capturedAt: "2026-04-02T00:00:00.000Z",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(stale.assessment.actualOutcome?.freshness, "stale");

    resetOutcomeObservationCaptureForTests();
    resetPostDecisionCaptureForTests();
    const wrongDim = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          dimension: "revenue",
          observedAt: "2026-04-04T00:00:00.000Z",
          capturedAt: "2026-04-04T00:00:00.000Z",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongDim.assessment.actualOutcome, null);

    const wrongUnit = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          unit: "hours",
          observedAt: "2026-04-05T00:00:00.000Z",
          capturedAt: "2026-04-05T00:00:00.000Z",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongUnit.assessment.actualOutcome, null);

    const wrongWindow = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          observedAt: "2027-01-01T00:00:00.000Z",
          capturedAt: "2027-01-01T00:00:00.000Z",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongWindow.assessment.actualOutcome, null);
    assert.ok(wrongWindow.capture.observations.some((entry) =>
      entry.rejections.includes("window-mismatch"),
    ));

    const recent = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      recentChangePresent: true,
      committedAt: "2026-01-01T00:00:00.000Z",
    });
    assert.equal(recent.assessment.actualOutcome, null);

    const executionOnly = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      execution: {
        executionId: "ctx-execution-capacity",
        status: "complete",
        progress: "100%",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-03-01T00:00:00.000Z",
        sourceDecisionId: "ctx-decision-capacity",
        complete: true,
        source: "explicit",
      },
    });
    assert.equal(executionOnly.assessment.actualOutcome, null);
  });

  test("safety — later KPI without binding/window/provenance/linkage remains Reality only", () => {
    const core = intelligence();
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      currentKpi: {
        statement: "Capacity utilization improved to 72%.",
        dimension: "capacity-utilization",
        numericValue: 72,
      },
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
      recentChangePresent: true,
    });
    assert.equal(result.expectedBinding.status, "missing");
    assert.equal(result.assessment.actualOutcome, null);
    assert.equal(result.assessment.currentReality?.isOutcome, false);
    assert.equal(result.learning.candidates.length, 0);
    assert.doesNotMatch(result.experience.didItWorkStatement, /succeeded|causal/i);
  });

  test("AB–AO/AQ — CORE-OUT authorities, zero Learning, no mutation, no causal overclaim", () => {
    const core = intelligence();
    const decisions = createInitialNexoraMVPFlowDecisionRecords();
    const executions = createInitialNexoraMVPFlowExecutionRecords();
    const beforeDecisions = JSON.stringify(decisions);
    const beforeExecutions = JSON.stringify(executions);
    const linked = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation()],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
    });
    assert.equal(linked.assessment.identity, "CORE-OUT:1/LiveOutcomeIntelligence");
    assert.equal(linked.learning.identity, "CORE-OUT:2/GroundedLearningIntelligence");
    assert.equal(linked.capture.identity, "CORE-OUT:1A/LiveOutcomeObservationCapture");
    assert.ok(Array.isArray(linked.learning.candidates));
    assert.match(linked.experience.didItWorkStatement, /./);
    assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
    assert.equal(JSON.stringify(decisions), beforeDecisions);
    assert.equal(JSON.stringify(executions), beforeExecutions);
    assert.equal(linked.authorityState.redesignsStage, false);
    assert.equal(linked.authorityState.usesLlm, false);
    assert.doesNotMatch(linked.experience.didItWorkStatement ?? "", /because we decided/i);
  });
});
