import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_FOUNDATION_TAG,
  ADVISORY_WORKSPACE_SECTION_ORDER,
  ADVISORY_WORKSPACE_VERSION,
  CANONICAL_ADVISORY_WORKSPACE_OWNER,
} from "./advisory/advisoryWorkspaceContract.ts";
import {
  ADVISORY_WORKSPACE_CONTEXT_VERSION,
} from "./advisory/advisoryWorkspaceContextContract.ts";
import { RECOMMENDATION_OWNERSHIP_QUESTIONS } from "./governance/nexoraRule14RecommendationOwnershipContract.ts";
import { getMrpWorkspaceRegistryEntry } from "./mrpWorkspaceRegistry.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import {
  guardAdvisoryForbiddenAction,
  guardAdvisoryRecommendationBoundary,
  resetAdvisoryBoundaryRuntimeForTests,
  traceAdvisoryFoundationBoundaryOnce,
} from "./advisory/advisoryBoundaryRuntime.ts";
import {
  buildAdvisoryWorkspaceView,
  resetAdvisoryWorkspaceRuntimeForTests,
  traceAdvisoryFoundationOnce,
} from "./advisory/advisoryWorkspaceRuntime.ts";
import {
  hydrateAdvisoryWorkspaceStateOnMount,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisory/advisoryWorkspaceStateRuntime.ts";
import {
  resetAdvisoryStateRuntimeForTests,
} from "./advisory/advisoryStateRuntime.ts";
import {
  syncAdvisoryRecommendation,
  resetAdvisoryRecommendationRuntimeForTests,
} from "./advisory/advisoryRecommendationRuntime.ts";
import {
  syncAdvisoryWorkspaceContext,
  resetAdvisoryWorkspaceContextRuntimeForTests,
} from "./advisory/advisoryWorkspaceContextRuntime.ts";

test.beforeEach(() => {
  resetAdvisoryWorkspaceRuntimeForTests();
  resetAdvisoryBoundaryRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
  resetAdvisoryStateRuntimeForTests();
  resetAdvisoryRecommendationRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
});

test("exports advisory foundation tag version and canonical owner", () => {
  assert.equal(ADVISORY_FOUNDATION_TAG, "[MRP_ADVISORY_FOUNDATION]");
  assert.equal(ADVISORY_WORKSPACE_VERSION, "5A.6.0");
  assert.equal(CANONICAL_ADVISORY_WORKSPACE_OWNER, "AdvisoryWorkspace");
});

test("registry entry uses advisory foundation mount", () => {
  const entry = getMrpWorkspaceRegistryEntry("advisory");
  assert.equal(entry.loaderStatus, "foundation");
  assert.equal(entry.mountTarget, "advisory_workspace");
});

test("dashboardContext advisory resolves to advisory_workspace mount target", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "advisory",
    dashboardContext: "advisory",
    subWorkspaceMode: null,
  });
  assert.equal(plan.workspaceId, "advisory");
  assert.equal(plan.mountTarget, "advisory_workspace");
  assert.notEqual(plan.mountTarget, "loader_shell");
});

test("subWorkspaceMode advisory resolves to advisory_workspace mount target", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "overview",
    subWorkspaceMode: "advisory",
  });
  assert.equal(plan.workspaceId, "advisory");
  assert.equal(plan.mountTarget, "advisory_workspace");
  assert.notEqual(plan.mountTarget, "loader_shell");
});

test("foundation view exposes five recommendation display areas", () => {
  hydrateAdvisoryWorkspaceStateOnMount("test");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryRecommendation();
  const view = buildAdvisoryWorkspaceView({ mountKey: "test" });
  assert.equal(view.recommendation.createsRecommendation, true);
  assert.equal(view.explainability.purpose, "Why do I recommend this?");
  assert.equal(view.handoff.preparesOnly, true);
  assert.equal(view.handoff.approvesDecisions, false);
  assert.equal(view.workspaceId, "advisory");
  assert.equal(view.ownsRecommendationsOnly, true);
  assert.equal(view.cards.length, 5);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...ADVISORY_WORKSPACE_SECTION_ORDER]
  );
});

test("context sync preserves selected object", () => {
  const context = syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(context.hasSelection, true);
  assert.equal(context.selectedObject, "Factory A");
});

test("Rule #14 blocks advisory from commitment and approval", () => {
  assert.equal(guardAdvisoryForbiddenAction({ action: "commit_decision" }).allowed, false);
  assert.equal(guardAdvisoryForbiddenAction({ action: "approve_decision" }).allowed, false);
});

test("Rule #14 allows advisory recommendation actions", () => {
  assert.equal(
    guardAdvisoryRecommendationBoundary({ action: "generate_recommendation" }).allowed,
    true
  );
  assert.equal(
    guardAdvisoryRecommendationBoundary({ action: "rank_alternatives" }).allowed,
    true
  );
});

test("foundation boundary and trace hooks are safe", () => {
  traceAdvisoryFoundationOnce("test");
  traceAdvisoryFoundationOnce("test");
  traceAdvisoryFoundationBoundaryOnce("test");
  traceAdvisoryFoundationBoundaryOnce("test");
});

test("advisory question encodes recommendation ownership", () => {
  assert.equal(RECOMMENDATION_OWNERSHIP_QUESTIONS.advisory, "What do I recommend?");
  assert.equal(ADVISORY_WORKSPACE_CONTEXT_VERSION, "5A.1.0");
});
