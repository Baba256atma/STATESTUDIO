/**
 * MVP-OUT:1 — End-to-end Outcome/Learning runtime integration cases A–AP.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { projectGroundedCausalConstraintIntelligence } from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  canonicalExpectedOutcomeId,
  captureOutcomeObservation,
  observationIdentity,
  resetOutcomeObservationCaptureForTests,
  type OutcomeObservationInput,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import type { ExecutiveOutcomeExpectation } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { resetPostDecisionCaptureForTests } from "./nexoraPostDecisionObservationCapture.ts";
import { resetDecisionOutcomeCommitmentForTests } from "./nexoraDecisionOutcomeCommitment.ts";
import {
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import { getExecutiveMemoryById } from "../executiveMemory/executiveMemoryStorageEngine.ts";
import {
  createInitialNexoraMVPFlowDecisionRecords,
  createInitialNexoraMVPFlowExecutionRecords,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import {
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
} from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  integrateNexoraOutcomeLearningRuntime,
  MVP_OUT1_INTEGRATION_BOUNDARY,
  nexoraOutcomeLearningRuntimeIntegrationIdentity,
  nexoraOutcomeLearningRuntimeIntegrationVersion,
} from "./nexoraOutcomeLearningRuntimeIntegration.ts";
import { nexoraExecutiveShellVersion } from "./nexoraExecutiveShell.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "./nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "./nexoraMVPPresentationState.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";

const workspaceId = "nexora-mvp-out1";

function intelligence() {
  return projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
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

function integrate(
  overrides: Partial<Parameters<typeof integrateNexoraOutcomeLearningRuntime>[0]> = {},
) {
  const core = intelligence();
  return integrateNexoraOutcomeLearningRuntime({
    workspaceId,
    subjectId: "obj-capacity",
    subjectKind: "object",
    causal: core.causal,
    constraint: core.constraint,
    collectLiveExpected: false,
    ...overrides,
  });
}

function linkedReady(overrides: Partial<OutcomeObservationInput> = {}) {
  const baseline = observation({
    value: 90,
    observedAt: "2026-01-01T00:00:00.000Z",
    capturedAt: "2026-01-01T00:00:00.000Z",
    sourceId: "rdi:capacity-baseline",
    datasetId: "ds:capacity-baseline",
    expectedOutcomeId: null,
  });
  captureOutcomeObservation({ observation: baseline });
  return integrate({
    expected: expected(),
    observations: [observation(overrides)],
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
}

describe("MVP-OUT:1 Outcome/Learning runtime integration", { concurrency: false }, () => {
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

  test("identity and boundary", () => {
    assert.equal(
      nexoraOutcomeLearningRuntimeIntegrationIdentity,
      "MVP-OUT:1/OutcomeLearningRuntimeIntegration",
    );
    assert.equal(nexoraOutcomeLearningRuntimeIntegrationVersion, "1.0.0");
    assert.equal(MVP_OUT1_INTEGRATION_BOUNDARY.ownsOutcomeEvaluation, false);
    assert.equal(MVP_OUT1_INTEGRATION_BOUNDARY.ownsLearning, false);
    assert.equal(MVP_OUT1_INTEGRATION_BOUNDARY.wiresCc11, false);
    assert.equal(MVP_OUT1_INTEGRATION_BOUNDARY.autoPromotesApp4, false);
    assert.equal(MVP_OUT1_INTEGRATION_BOUNDARY.usesLlm, false);
    assert.equal(nexoraExecutiveShellVersion, "1.2.0");
  });

  test("A — Decision → expected Outcome preserves stable identity", () => {
    const result = integrate({
      expected: expected(),
      decision: {
        decisionId: "ctx-decision-capacity",
        status: "approved",
        committed: true,
        committedAt: "2026-01-01T00:00:00.000Z",
        source: "explicit",
      },
    });
    assert.equal(result.decision?.decisionId, "ctx-decision-capacity");
    assert.equal(result.expected?.expectationId, canonicalExpectedOutcomeId("capacity"));
    assert.equal(result.expected?.claimKind, "PREDICTION");
  });

  test("B — Decision → Execution preserves NEX-MVP:8 reference", () => {
    const result = integrate({
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
      expected: null,
    });
    assert.equal(result.decision?.decisionId, "ctx-decision-capacity");
    assert.equal(result.execution?.executionId, "ctx-execution-capacity");
    assert.equal(result.execution?.sourceDecisionId, "ctx-decision-capacity");
    assert.equal(result.cc11Live, false);
  });

  test("C/AH — Execution complete without observation → Outcome unknown", () => {
    const result = integrate({
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
    assert.equal(result.execution?.complete, true);
    assert.equal(result.assessment.actualOutcome, null);
    assert.match(result.experience.didItWorkStatement, /still unknown|No validated actual outcome/i);
    assert.doesNotMatch(result.experience.didItWorkStatement, /succeeded|achieved/i);
  });

  test("D/K/L/M/N — Current KPI and invalid captures remain Reality, not Actual", () => {
    const reality = integrate({
      currentKpi: {
        statement: "Capacity utilization is 78%.",
        dimension: "capacity-utilization",
        numericValue: 78,
      },
    });
    assert.equal(reality.assessment.currentReality?.isOutcome, false);
    assert.equal(reality.assessment.actualOutcome, null);

    const missingProv = integrate({
      expected: expected(),
      observations: [observation({ provenanceRefs: [], sourceId: null, datasetId: null })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(missingProv.assessment.actualOutcome, null);
    assert.ok(missingProv.capture.observations[0]?.rejections.includes("missing-provenance"));

    const wrongDim = integrate({
      expected: expected(),
      observations: [observation({ dimension: "revenue" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongDim.assessment.actualOutcome, null);

    const wrongUnit = integrate({
      expected: expected(),
      observations: [observation({ unit: "hours" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(wrongUnit.assessment.actualOutcome, null);

    const invalid = integrate({
      expected: expected(),
      observations: [observation({ validationState: "invalid" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(invalid.assessment.actualOutcome, null);
  });

  test("E/safety — Decision + later KPI without linkage is not Actual or Learning", () => {
    const result = integrate({
      expected: expected(),
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
      execution: {
        executionId: "ctx-execution-capacity",
        status: "complete",
        progress: "100%",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        sourceDecisionId: "ctx-decision-capacity",
        complete: true,
        source: "explicit",
      },
      observations: [
        observation({
          expectedOutcomeId: null,
          value: 72,
          observedAt: "2026-06-01T00:00:00.000Z",
        }),
      ],
    });
    assert.equal(result.assessment.actualOutcome, null);
    assert.equal(result.assessment.currentReality?.isOutcome, false);
    assert.equal(result.assessment.establishesCausation, false);
    assert.equal(result.learning.candidates.length, 0);
    assert.equal(result.app4.length, 0);
    assert.doesNotMatch(
      [result.experience.didItWorkStatement, result.experience.whyStatement].join(" "),
      /Decision succeeded|caused the improvement/i,
    );
  });

  test("F/G/H — Valid linked observation reaches CORE-OUT:1; baseline enables comparison", () => {
    const result = linkedReady();
    assert.equal(result.capture.linkedActuals.length >= 1, true);
    assert.ok(result.assessment.actualOutcome);
    assert.equal(result.assessment.actualOutcome?.outcomeLinked, true);
    assert.equal(result.assessment.expectedOutcome?.expectationId, canonicalExpectedOutcomeId("capacity"));
    assert.ok(result.capture.baseline != null);
    assert.equal(result.assessment.status, "comparison-ready");
    assert.equal(result.assessment.establishesCausation, false);
  });

  test("I — Missing baseline preserves comparison limitation", () => {
    const result = integrate({
      expected: expected(),
      observations: [observation()],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(result.capture.baseline, null);
    assert.ok(result.assessment.actualOutcome);
    assert.ok(result.assessment.missingEvidence.includes("baseline"));
    assert.equal(result.assessment.status, "comparison-incomplete");
  });

  test("J — Wrong observation window is not eligible Actual", () => {
    const result = integrate({
      expected: expected(),
      observations: [observation({ observedAt: "2026-06-01T00:00:00.000Z" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-03-01T00:00:00.000Z",
    });
    assert.equal(result.assessment.actualOutcome, null);
    assert.ok(result.capture.observations[0]?.rejections.includes("window-mismatch"));
  });

  test("O/P — Partial and stale evidence remain bounded", () => {
    const partial = linkedReady({ validationState: "partial", observedAt: "2026-04-04T00:00:00.000Z", capturedAt: "2026-04-04T00:00:00.000Z" });
    assert.equal(partial.assessment.actualOutcome?.validationStatus, "partial");
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    const stale = linkedReady({
      validationState: "stale",
      freshnessState: "stale",
      observedAt: "2026-04-05T00:00:00.000Z",
      capturedAt: "2026-04-05T00:00:00.000Z",
    });
    assert.equal(stale.assessment.actualOutcome?.freshness, "stale");
    assert.equal(stale.assessment.status, "stale");
  });

  test("Q — Conflicting observations are preserved without cherry-picking", () => {
    const result = integrate({
      expected: expected(),
      observations: [
        observation({ value: 78, observedAt: "2026-04-01T00:00:00.000Z" }),
        observation({
          value: 90,
          observedAt: "2026-04-02T00:00:00.000Z",
          sourceId: "rdi:capacity-b",
          datasetId: "ds:capacity-b",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.ok(result.capture.linkedActuals.length >= 2);
    assert.equal(result.assessment.status, "conflicting");
    assert.equal(result.assessment.actualOutcome, null);
    assert.ok(result.experience.observationStatus === "conflicting" || result.assessment.conflictingObservations.length >= 2);
  });

  test("R/S/AM — Repeated observation identities stay stable and idempotent", () => {
    const first = observation();
    const once = integrate({
      expected: expected(),
      observations: [first],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    const twice = integrate({
      expected: expected(),
      observations: [first],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(once.capture.observations.length, 1);
    assert.equal(twice.capture.observations.length, 1);
    assert.equal(once.capture.observations[0]?.observationId, twice.capture.observations[0]?.observationId);
    const distinct = integrate({
      expected: expected(),
      observations: [observation({ observedAt: "2026-04-03T00:00:00.000Z" })],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.notEqual(
      distinct.capture.observations.at(-1)?.observationId,
      once.capture.observations[0]?.observationId,
    );
  });

  test("T/U/AG — Outcome met/missed does not imply causality or Decision quality", () => {
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    const met = linkedReady({ value: 78, observedAt: "2026-04-06T00:00:00.000Z", capturedAt: "2026-04-06T00:00:00.000Z" });
    assert.equal(met.assessment.comparison.result, "met");
    assert.equal(met.assessment.establishesCausation, false);
    assert.match(met.experience.didItWorkStatement, /Causal attribution has not been established/);
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    const missed = linkedReady({ value: 95, observedAt: "2026-04-07T00:00:00.000Z", capturedAt: "2026-04-07T00:00:00.000Z" });
    assert.equal(missed.assessment.comparison.result, "not-met");
    assert.match(
      missed.experience.didItWorkStatement,
      /does not by itself mean the Decision was wrong/,
    );
    assert.equal(classifyNexoraExiUtterance("Why did it happen?"), "whyOutcome");
    assert.doesNotMatch(met.experience.whyStatement, /the decision caused/i);
  });

  test("V/W/X — CORE-OUT:2 receives assessment; no Outcome means zero Learning", () => {
    const ready = linkedReady();
    assert.ok(ready.learning.candidates.length >= 1);
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    const none = integrate({ expected: expected() });
    assert.equal(none.assessment.actualOutcome, null);
    assert.equal(none.learning.candidates.length, 0);
  });

  test("Y/Z/AA — Conflicting Outcome is not promoted; default live APP-4 remains off", () => {
    const conflict = integrate({
      expected: expected(),
      observations: [
        observation({ value: 70, observedAt: "2026-04-01T00:00:00.000Z" }),
        observation({
          value: 95,
          observedAt: "2026-04-02T00:00:00.000Z",
          sourceId: "rdi:capacity-b",
          datasetId: "ds:capacity-b",
        }),
      ],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
    });
    assert.equal(
      conflict.learning.candidates.some((entry) => entry.promotionEligibility === "promotion-eligible"),
      false,
    );
    const ready = linkedReady();
    assert.equal(ready.liveApp4Promotion, false);
    assert.equal(ready.app4.length, 0);
  });

  test("AB/AC — Authorized seam promotes once; duplicate promotion is idempotent", () => {
    const first = linkedReady();
    const authorized = integrate({
      expected: expected(),
      observations: [observation()],
      linkBasis: "metric-binding",
      committedAt: "2026-01-01T00:00:00.000Z",
      executionStartedAt: "2026-01-01T00:00:00.000Z",
      expectedStartAt: "2026-01-01T00:00:00.000Z",
      expectedEndAt: "2026-12-31T23:59:59.000Z",
      authorizeApp4Promotion: true,
      decision: first.decision,
      execution: first.execution,
    });
    const promoted = authorized.app4.filter((entry) => entry.promoted);
    if (promoted.length > 0) {
      const id = promoted[0]?.record?.id ?? promoted[0]?.stored?.record.id;
      assert.ok(id);
      assert.ok(getExecutiveMemoryById(id));
      const again = integrate({
        expected: expected(),
        observations: [observation()],
        linkBasis: "metric-binding",
        committedAt: "2026-01-01T00:00:00.000Z",
        executionStartedAt: "2026-01-01T00:00:00.000Z",
        expectedStartAt: "2026-01-01T00:00:00.000Z",
        expectedEndAt: "2026-12-31T23:59:59.000Z",
        authorizeApp4Promotion: true,
        decision: first.decision,
        execution: first.execution,
      });
      const secondWrites = again.app4.filter((entry) => entry.promoted);
      assert.equal(secondWrites.length, 0);
    } else {
      assert.equal(authorized.liveApp4Promotion, "authorized-seam");
      assert.ok(authorized.learning.promotions.every((entry) => entry.eligible === false || entry.learningId));
    }
  });

  test("AD — Historical APP-4 Learning is labeled historical, not current truth", () => {
    linkedReady();
    const withHistory = integrate({
      expected: expected(),
      currentKpi: {
        statement: "Capacity utilization is 78%.",
        dimension: "capacity-utilization",
        numericValue: 78,
      },
      authorizeApp4Promotion: true,
    });
    assert.ok(
      withHistory.experience.historicalLearning.every(
        (entry) => entry.historical && entry.currentTruth === false,
      ),
    );
    if (withHistory.experience.historicalLearning.length > 0) {
      assert.match(withHistory.experience.historicalStatement, /past context|Historical Learning/i);
    }
  });

  test("AE/AF — Advisor/Conversation keys resolve through EXI:5", () => {
    const result = linkedReady();
    assert.equal(classifyNexoraExiUtterance("Did it work?"), "didItWork");
    assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
    assert.equal(classifyNexoraExiUtterance("What have we learned before?"), "historicalLearning");
    assert.ok(result.experience.didItWorkStatement.length > 0);
    assert.ok(result.experience.learningStatement.length > 0);
  });

  test("AI/AJ/AK/AL — Recommendation, Advisor prose, scenario, Recent Change are not Outcome/Learning evidence", () => {
    const result = integrate({
      expected: expected({ source: "scenario" }),
      recommendationPresent: true,
      recentChangePresent: true,
    });
    assert.equal(result.assessment.actualOutcome, null);
    assert.equal(result.learning.candidates.length, 0);
    assert.equal(result.expected?.source, "scenario");
  });

  test("AN/AP — Live /executive chain without post-decision Actual stays pending", () => {
    const result = integrate({
      collectLiveExpected: true,
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(result.decision?.committed, false);
    assert.equal(result.assessment.actualOutcome, null);
    assert.match(result.experience.didItWorkStatement, /No validated actual outcome|not available/i);
    assert.equal(result.learning.candidates.length, 0);
    assert.equal(result.app4.length, 0);
  });

  test("AO — Full deterministic test chain Decision→1A→1→2→EXI:5", () => {
    const result = linkedReady();
    assert.equal(result.assessment.identity, "CORE-OUT:1/LiveOutcomeIntelligence");
    assert.equal(result.capture.identity, "CORE-OUT:1A/LiveOutcomeObservationCapture");
    assert.equal(result.learning.identity, "CORE-OUT:2/GroundedLearningIntelligence");
    assert.equal(result.experience.identity, "EXI:5/OutcomeLearningExperience");
    assert.equal(result.edges.out1aToOut1, "CONNECTED");
    assert.equal(result.edges.out1ToOut2, "CONNECTED");
    assert.equal(result.edges.out2ToExi5, "CONNECTED");
    assert.equal(result.edges.exi5ToAdvisorConversation, "CONNECTED");
    assert.equal(result.edges.out2ToApp4, "TEST-ONLY");
  });

  test("compose path uses the integration seam without CC:11", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    state = syncNexoraMVPObjectInteractionShellContext(
      selectNexoraMVPInteractionSubject(state, "ctx-decision-capacity"),
      {
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: state.environmentIntent,
      },
    );
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
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge,
      presentationViewModel,
      focusedSubject: state.focusedSubject,
      selectedSubject: state.selectedSubject,
      breadcrumb: advisorBridge.breadcrumb,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(context);
    const narrative = composeNexoraProfessionalAdvisorPresentation({
      advisor: resolution.advisor,
      insight: resolution.insight,
      intelligence: context,
      advisorBridge,
      nextBestAction: advisorBridge.nextBestAction,
      decisionBrief: advisorBridge.decisionBrief,
      decisionMemory: advisorBridge.decisionMemory,
    });
    const experience = composeNexoraExecutiveIntelligenceExperience({
      narrative,
      presentationMode: advisorBridge.presentationMode,
      cc11Live: false,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(experience.coreOutcomeAssessment.actualOutcome, null);
    assert.equal(experience.coreLearningAssessment.candidates.length, 0);
    assert.match(experience.outcomeLearning.didItWorkStatement, /No validated actual outcome|not available/i);
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "nexoraOutcomeLearningRuntimeIntegration.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /@ts-ignore|ignoreBuildErrors/);
    assert.doesNotMatch(source, /wiresCc11:\s*true/);
  });
});
