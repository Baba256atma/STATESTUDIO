import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_HANDOFF_CONTEXT,
  ADVISORY_HANDOFF_QUESTION,
  MRP_ADVISORY_HANDOFF_TAG,
} from "./advisory/advisoryHandoffContract.ts";
import {
  buildRecommendationPackage,
  buildRecommendationPackageSignature,
} from "./advisory/advisoryHandoffResolver.ts";
import {
  commitRecommendationToGovernance,
  guardRecommendationPackageExecution,
  resetAdvisoryHandoffRuntimeForTests,
} from "./advisory/advisoryHandoffRuntime.ts";
import {
  guardAdvisoryForbiddenAction,
  guardAdvisoryHandoffBoundary,
} from "./advisory/advisoryBoundaryRuntime.ts";
import {
  syncAdvisoryRecommendation,
  resetAdvisoryRecommendationRuntimeForTests,
} from "./advisory/advisoryRecommendationRuntime.ts";
import {
  syncAdvisoryWorkspaceContext,
  resetAdvisoryWorkspaceContextRuntimeForTests,
} from "./advisory/advisoryWorkspaceContextRuntime.ts";
import {
  getAdvisoryWorkspaceState,
  hydrateAdvisoryWorkspaceStateOnMount,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisory/advisoryWorkspaceStateRuntime.ts";
import { buildAdvisoryWorkspaceViewFromState } from "./advisory/advisoryWorkspaceStateViewMapper.ts";
import { resetAdvisoryWorkspaceRuntimeForTests } from "./advisory/advisoryWorkspaceRuntime.ts";
import {
  resetGovernanceRecommendationHandoffRuntimeForTests,
  consumeGovernanceRecommendationPackage,
  getGovernanceRecommendationHandoffState,
} from "./governance/governanceRecommendationHandoffRuntime.ts";
import {
  resetGovernanceRecommendationIntakeRuntimeForTests,
} from "./governance/governanceRecommendationIntakeRuntime.ts";
import { resetGovernanceBoundaryRuntimeForTests } from "./governance/governanceBoundaryRuntime.ts";
import { publishRiskWorkspaceState } from "./risk/riskWorkspaceStateRuntime.ts";
import { resetRiskWorkspaceStateRuntimeForTests } from "./risk/riskWorkspaceStateRuntime.ts";

test.beforeEach(() => {
  resetAdvisoryWorkspaceRuntimeForTests();
  resetAdvisoryHandoffRuntimeForTests();
  resetAdvisoryRecommendationRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
  resetGovernanceRecommendationHandoffRuntimeForTests();
  resetGovernanceRecommendationIntakeRuntimeForTests();
  resetGovernanceBoundaryRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
});

test("exports advisory handoff tag and question", () => {
  assert.equal(MRP_ADVISORY_HANDOFF_TAG, "[MRP_ADVISORY_HANDOFF]");
  assert.equal(ADVISORY_HANDOFF_CONTEXT, "advisory");
  assert.equal(ADVISORY_HANDOFF_QUESTION, "What recommendation should governance review?");
});

test("buildRecommendationPackage includes all required fields", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a5");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 0,
    dominantRiskCategory: "Operational",
  });
  syncAdvisoryRecommendation();

  const recommendationPackage = buildRecommendationPackage(getAdvisoryWorkspaceState(), {
    createdAt: "2026-06-13T12:00:00.000Z",
  });

  assert.ok(recommendationPackage);
  assert.match(recommendationPackage!.recommendationId, /recommendation:factory-a/);
  assert.ok(recommendationPackage!.recommendationTitle.length > 0);
  assert.notEqual(recommendationPackage!.confidence, "unknown");
  assert.ok(recommendationPackage!.rationale.length > 0);
  assert.ok(Array.isArray(recommendationPackage!.supportingDrivers));
  assert.equal(recommendationPackage!.createdAt, "2026-06-13T12:00:00.000Z");
});

test("commitRecommendationToGovernance transfers package to governance runtime", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a5");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 0,
    dominantRiskCategory: "Operational",
  });
  syncAdvisoryRecommendation();

  const result = commitRecommendationToGovernance({
    createdAt: "2026-06-13T12:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.ok(result.recommendationPackage);

  const advisoryState = getAdvisoryWorkspaceState();
  assert.equal(advisoryState.handoffReady, true);
  assert.ok(advisoryState.pendingRecommendationPackage);
  assert.match(advisoryState.assumptions.detail, /MRP_ADVISORY_HANDOFF/);

  const governanceState = getGovernanceRecommendationHandoffState();
  assert.equal(
    governanceState.recommendationPackage?.recommendationId,
    result.recommendationPackage?.recommendationId
  );
  assert.equal(governanceState.approvalBlocked, true);
  assert.equal(governanceState.executionBlocked, true);
});

test("governance may consume recommendation package", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a5");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryRecommendation();
  commitRecommendationToGovernance({ createdAt: "2026-06-13T12:00:00.000Z" });

  const consumed = consumeGovernanceRecommendationPackage();
  assert.ok(consumed);
  assert.match(consumed!.recommendationId, /recommendation:/);
});

test("handoff does not approve or execute from advisory", () => {
  assert.equal(
    guardAdvisoryForbiddenAction({ action: "approve_decision", source: "handoff" }).allowed,
    false
  );
  assert.equal(
    guardAdvisoryForbiddenAction({ action: "commit_decision", source: "handoff" }).allowed,
    false
  );
  assert.equal(
    guardAdvisoryHandoffBoundary({ action: "handoff_to_governance", source: "prepare_for_governance" })
      .allowed,
    true
  );
  assert.equal(
    guardAdvisoryHandoffBoundary({
      action: "open_governance_automatically",
      source: "handoff",
    }).allowed,
    false
  );
});

test("advisory may not execute recommendation package", () => {
  const blocked = guardRecommendationPackageExecution("advisory_workspace");
  assert.equal(blocked.allowed, false);
});

test("handoff view exposes dashboardContext advisory", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a5");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryRecommendation();
  commitRecommendationToGovernance({ createdAt: "2026-06-13T12:00:00.000Z" });

  const view = buildAdvisoryWorkspaceViewFromState(getAdvisoryWorkspaceState());
  assert.equal(view.handoff.dashboardContext, "advisory");
  assert.equal(view.handoff.question, ADVISORY_HANDOFF_QUESTION);
  assert.equal(view.handoff.handoffReady, true);
  assert.equal(view.handoff.preparesOnly, true);
  assert.equal(view.handoff.approvesDecisions, false);
  assert.equal(view.handoff.executesActions, false);
});

test("recommendation package signature is stable", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a5");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryRecommendation();
  const recommendationPackage = buildRecommendationPackage(getAdvisoryWorkspaceState(), {
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  assert.ok(recommendationPackage);
  assert.equal(
    buildRecommendationPackageSignature(recommendationPackage!),
    buildRecommendationPackageSignature(recommendationPackage!)
  );
});
