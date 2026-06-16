import test from "node:test";
import assert from "node:assert/strict";

import type { RecommendationPackage } from "./advisory/advisoryHandoffContract.ts";
import {
  GOVERNANCE_RECOMMENDATION_INTAKE_TAG,
  GOVERNANCE_RECOMMENDATION_INTAKE_VERSION,
} from "./governance/governanceRecommendationIntakeContract.ts";
import {
  guardGovernanceForbiddenAction,
  guardGovernanceHandoffBoundary,
  resetGovernanceBoundaryRuntimeForTests,
} from "./governance/governanceBoundaryRuntime.ts";
import {
  intakeRecommendationPackage,
  resetGovernanceRecommendationIntakeRuntimeForTests,
  traceGovernanceRecommendationIntakeOnce,
} from "./governance/governanceRecommendationIntakeRuntime.ts";
import { validateRecommendationPackage } from "./governance/governanceRecommendationIntakeResolver.ts";
import {
  getGovernanceRecommendationHandoffState,
  resetGovernanceRecommendationHandoffRuntimeForTests,
} from "./governance/governanceRecommendationHandoffRuntime.ts";

const samplePackage: RecommendationPackage = Object.freeze({
  recommendationId: "recommendation:factory-a",
  recommendationTitle: "Recommend capacity stabilization for Factory A.",
  confidence: "moderate",
  rationale: "Grounded in advisory object context.",
  supportingDrivers: Object.freeze([
    "Risk Drivers: Risk signal volume — 2 total risk signals tracked.",
  ]),
  sourceScenarioId: "scenario:factory-a:expected_case",
  sourceDecisionId: null,
  createdAt: "2026-06-13T12:00:00.000Z",
});

test.beforeEach(() => {
  resetGovernanceRecommendationHandoffRuntimeForTests();
  resetGovernanceRecommendationIntakeRuntimeForTests();
  resetGovernanceBoundaryRuntimeForTests();
});

test("exports governance recommendation intake tag and version", () => {
  assert.equal(GOVERNANCE_RECOMMENDATION_INTAKE_TAG, "[GOVERNANCE_RECOMMENDATION_INTAKE]");
  assert.equal(GOVERNANCE_RECOMMENDATION_INTAKE_VERSION, "5A.5.0");
});

test("validateRecommendationPackage requires all package fields", () => {
  const validation = validateRecommendationPackage(samplePackage);
  assert.equal(validation.valid, true);
});

test("intakeRecommendationPackage stores package without approval or execution", () => {
  const result = intakeRecommendationPackage(samplePackage, "advisory_handoff");

  assert.equal(result.ok, true);
  assert.equal(result.approvedDecision, false);
  assert.equal(result.executedAction, false);

  const handoffState = getGovernanceRecommendationHandoffState();
  assert.equal(handoffState.recommendationPackage?.recommendationId, samplePackage.recommendationId);
  assert.equal(handoffState.approvalBlocked, true);
  assert.equal(handoffState.executionBlocked, true);
});

test("governance intake blocks issuing recommendations and committing decisions", () => {
  assert.equal(
    guardGovernanceForbiddenAction({ action: "issue_recommendation", source: "intake" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceForbiddenAction({ action: "commit_decision", source: "intake" }).allowed,
    false
  );
});

test("governance intake blocks approval during intake", () => {
  const blocked = guardGovernanceHandoffBoundary({
    action: "approve_during_intake",
    source: "recommendation_intake",
  });
  assert.equal(blocked.allowed, false);
});

test("traceGovernanceRecommendationIntakeOnce is safe to call repeatedly", () => {
  traceGovernanceRecommendationIntakeOnce("test");
  traceGovernanceRecommendationIntakeOnce("test");
});
