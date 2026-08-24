/**
 * MVP-OUT:1-R3 — live Decision Outcome commitment and longitudinal Reality closure.
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
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  createInitialNexoraMVPFlowDecisionRecords,
  createInitialNexoraMVPFlowExecutionRecords,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "../conversational-control/executiveDecisionStatusProjection.ts";
import {
  DECISION_OUTCOME_COMMITMENT_BOUNDARY,
  isPostBoundaryObservation,
  listDecisionOutcomeCommitments,
  nexoraDecisionOutcomeCommitmentIdentity,
  nexoraDecisionOutcomeCommitmentVersion,
  resetDecisionOutcomeCommitmentForTests,
  resolveDecisionOutcomeCommitment,
} from "./nexoraDecisionOutcomeCommitment.ts";
import { resetPostDecisionCaptureForTests } from "./nexoraPostDecisionObservationCapture.ts";
import { coordinateNexoraOutcomeLearningRuntime } from "./nexoraOutcomeLearningRuntimeIntegration.ts";
import { classifyNexoraExiUtterance } from "./nexoraExecutiveIntelligenceExperience.ts";
import { applyNexoraMVPFlowDomainAction } from "./nexoraMVPExecutiveFlow.ts";
import { createInitialNexoraMVPFlowDomainState } from "./nexoraMVPExecutiveFlow.ts";

const workspaceId = "nexora-mvp-out1-r3";

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

describe("MVP-OUT:1-R3 live commitment and longitudinal closure", { concurrency: false }, () => {
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

  test("identity — R3 is integration only", () => {
    assert.equal(
      nexoraDecisionOutcomeCommitmentIdentity,
      "MVP-OUT:1-R3/DecisionOutcomeCommitment",
    );
    assert.equal(nexoraDecisionOutcomeCommitmentVersion, "1.0.0");
    assert.equal(DECISION_OUTCOME_COMMITMENT_BOUNDARY.inventsTargets, false);
    assert.equal(DECISION_OUTCOME_COMMITMENT_BOUNDARY.inventsTimestamps, false);
    assert.equal(DECISION_OUTCOME_COMMITMENT_BOUNDARY.usesLlm, false);
  });

  test("A/H/J/K/L/M — measurable commitment is stable and preserves metric fields", () => {
    const first = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      subjectId: "obj-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      explicitExpected: expected(),
    });
    const second = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      subjectId: "obj-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      explicitExpected: expected(),
    });
    assert.equal(first.status, "committed");
    assert.equal(first.commitmentId, second.commitmentId);
    assert.equal(first.metricId, "capacity-utilization");
    assert.equal(first.dimension, "capacity-utilization");
    assert.equal(first.unit, "%");
    assert.equal(first.evaluationRule, "lte");
    assert.equal(first.target, 80);
    assert.equal(listDecisionOutcomeCommitments().length, 1);
  });

  test("B/D/E/F/G — missing or forbidden sources do not invent a target", () => {
    const none = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
    });
    assert.equal(none.status, "incomplete");
    assert.equal(none.target, null);
    const prose = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      advisorProse: "This should improve things.",
      inheritedScenarioExpected: expected({
        unit: null,
        numericTarget: null,
        comparator: null,
        source: "scenario",
      }),
    });
    assert.ok(prose.unsupportedReasons.includes("advisor-prose-is-not-expected-outcome"));
    assert.ok(prose.unsupportedReasons.includes("scenario-prose-is-not-measurable-expectation"));
    const kpi = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      currentKpi: { statement: "Utilization 70%", numericValue: 70 },
    });
    assert.ok(kpi.unsupportedReasons.includes("current-kpi-is-not-expected-outcome"));
    const hindsight = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      laterActual: expected({ claimKind: "FACT" as never, numericTarget: 72 }),
    });
    assert.ok(hindsight.unsupportedReasons.includes("later-actual-cannot-create-expectation"));
  });

  test("C/I — measurable Scenario expectation can hand off; revision keeps history", () => {
    const inherited = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      inheritedScenarioExpected: expected({ source: "scenario" }),
    });
    assert.equal(inherited.status, "committed");
    const revised = resolveDecisionOutcomeCommitment({
      decisionId: "ctx-decision-capacity",
      decisionCommitted: true,
      committedAt: "2026-03-01T12:00:00.000Z",
      explicitExpected: expected({
        expectationId: canonicalExpectedOutcomeId("capacity-v2"),
        numericTarget: 75,
      }),
    });
    assert.notEqual(revised.commitmentId, inherited.commitmentId);
    assert.equal(listDecisionOutcomeCommitments().length, 2);
  });

  test("N/O/P — new Decision mutation can carry a genuine timestamp; fixtures stay null; render does not stamp", () => {
    const runtime = createNexoraCanonicalDecisionRuntime({
      initialDecisions: bootstrapCanonicalDecisionsFromFlowFixtures(
        createInitialNexoraMVPFlowDecisionRecords(),
      ),
    });
    const fixture = runtime.adapter.getDecision("ctx-decision-capacity");
    assert.equal(fixture?.status, "Under Review");
    assert.equal(fixture?.committedAt, undefined);
    const core = intelligence();
    const renderOne = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      causal: core.causal,
      constraint: core.constraint,
      decisionRuntime: runtime.adapter,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    const renderTwo = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      causal: core.causal,
      constraint: core.constraint,
      decisionRuntime: runtime.adapter,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(renderOne.decision?.committedAt, null);
    assert.equal(renderTwo.decision?.committedAt, null);
    const mutationAt = "2026-08-20T15:04:00.000Z";
    const applied = runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-capacity",
      action: "approve",
      title: "Expand Capacity",
      committedAt: mutationAt,
    });
    assert.equal(applied.status, "applied");
    assert.equal(applied.decision?.committedAt, mutationAt);
    const after = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      causal: core.causal,
      constraint: core.constraint,
      decisionRuntime: runtime.adapter,
      expected: expected(),
    });
    assert.equal(after.decision?.committedAt, mutationAt);
    assert.equal(after.outcomeCommitment.status, "committed");
    assert.equal(after.window?.status, "ready-for-observation");
  });

  test("Q/R/S/T — window from genuine boundary; no time stays incomplete; baseline is not a later KPI", () => {
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
    const ready = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      baselineObservationId: observationIdentity(baseline),
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
    });
    assert.equal(ready.window?.status, "ready-for-observation");
    assert.equal(ready.capture.baseline?.numericValue, 90);
    const incomplete = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(incomplete.window?.status, "timing-incomplete");
    assert.equal(isPostBoundaryObservation("2026-01-01T00:00:00.000Z", "2026-01-01T00:00:00.000Z"), false);
    assert.equal(isPostBoundaryObservation("2026-04-01T00:00:00.000Z", "2026-01-01T00:00:00.000Z"), true);
  });

  test("U/V/W/Y/Z — snapshot identity, refresh, pre-boundary, and missing time stay honest", () => {
    const core = intelligence();
    const pre = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [
        observation({
          observedAt: "2025-12-01T00:00:00.000Z",
          capturedAt: "2025-12-01T00:00:00.000Z",
        }),
      ],
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
    assert.equal(pre.assessment.actualOutcome, null);
    const untimed = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "obj-capacity",
      causal: core.causal,
      constraint: core.constraint,
      expected: expected(),
      observations: [observation({ observedAt: null, capturedAt: null })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
    });
    assert.equal(untimed.assessment.actualOutcome, null);
    assert.equal(isPostBoundaryObservation(null, "2026-01-01T00:00:00.000Z"), false);
  });

  test("AH/AL/AN/AO/AQ/BD — TEST-ONLY T0→T1→T2 can link and evaluate without causality or Learning", () => {
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
    });
    assert.equal(result.outcomeCommitment.status, "committed");
    assert.ok(result.capture.linkedActuals.length > 0);
    assert.notEqual(result.assessment.actualOutcome, null);
    assert.equal(result.assessment.identity, "CORE-OUT:1/LiveOutcomeIntelligence");
    assert.equal(result.learning.identity, "CORE-OUT:2/GroundedLearningIntelligence");
    assert.doesNotMatch(result.experience.didItWorkStatement, /caused/i);
    assert.equal(result.liveApp4Promotion, false);
    assert.equal(result.edges.dataRealityToOut1a, "TEST-ONLY");
  });

  test("safety/AI/BE/BF — later KPI without binding stays Reality; live fixtures stay pending", () => {
    const core = intelligence();
    const safety = coordinateNexoraOutcomeLearningRuntime({
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
    });
    assert.equal(safety.outcomeCommitment.status, "incomplete");
    assert.equal(safety.assessment.actualOutcome, null);
    assert.equal(safety.assessment.currentReality?.isOutcome, false);
    assert.doesNotMatch(safety.experience.didItWorkStatement, /succeeded|caused/i);
    const live = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(live.outcomeCommitment.status, "missing");
    assert.equal(live.liveActualExists, false);
    assert.equal(live.liveLearningCandidates, 0);
    assert.equal(classifyNexoraExiUtterance("Did it work?"), "didItWork");
    assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
    assert.equal(classifyNexoraExiUtterance("Why did it happen?"), "whyOutcome");
  });

  test("AZ/BA/BB/BC — observation does not mutate Decision, Execution, or Stage; no LLM", () => {
    const core = intelligence();
    const decisions = createInitialNexoraMVPFlowDecisionRecords();
    const executions = createInitialNexoraMVPFlowExecutionRecords();
    const beforeD = JSON.stringify(decisions);
    const beforeE = JSON.stringify(executions);
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId,
      subjectId: "ctx-decision-capacity",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: decisions,
      flowExecutions: executions,
    });
    assert.equal(JSON.stringify(decisions), beforeD);
    assert.equal(JSON.stringify(executions), beforeE);
    assert.equal(result.authorityState.redesignsStage, false);
    assert.equal(result.authorityState.usesLlm, false);
    assert.equal(createInitialNexoraMVPFlowDomainState !== undefined, true);
    assert.equal(typeof applyNexoraMVPFlowDomainAction, "function");
  });
});
