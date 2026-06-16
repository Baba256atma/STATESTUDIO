import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_RECOMMENDATION_VERSION,
  MRP_ADVISORY_RECOMMENDATION_TAG,
} from "./advisory/advisoryRecommendationContract.ts";
import {
  buildAdvisoryRecommendationIntake,
  deriveExecutiveRecommendationCard,
  deriveAdvisoryRecommendationLayer,
} from "./advisory/advisoryRecommendationResolver.ts";
import {
  resetAdvisoryExplainabilityRuntimeForTests,
} from "./advisory/advisoryExplainabilityRuntime.ts";
import {
  resetAdvisoryRecommendationRuntimeForTests,
  syncAdvisoryRecommendation,
  traceAdvisoryRecommendationOnce,
} from "./advisory/advisoryRecommendationRuntime.ts";
import { guardAdvisoryForbiddenAction } from "./advisory/advisoryBoundaryRuntime.ts";
import { resolveAdvisoryWorkspaceContext } from "./advisory/advisoryWorkspaceContextResolver.ts";
import {
  getAdvisoryWorkspaceState,
  hydrateAdvisoryWorkspaceStateOnMount,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisory/advisoryWorkspaceStateRuntime.ts";
import {
  syncAdvisoryWorkspaceContext,
  resetAdvisoryWorkspaceContextRuntimeForTests,
} from "./advisory/advisoryWorkspaceContextRuntime.ts";
import { resetAdvisoryWorkspaceRuntimeForTests } from "./advisory/advisoryWorkspaceRuntime.ts";
import { buildAdvisoryWorkspaceViewFromState } from "./advisory/advisoryWorkspaceStateViewMapper.ts";
import { publishRiskWorkspaceState } from "./risk/riskWorkspaceStateRuntime.ts";
import { resetRiskWorkspaceStateRuntimeForTests } from "./risk/riskWorkspaceStateRuntime.ts";
import { publishTimelineWorkspaceState } from "./timeline/timelineWorkspaceStateRuntime.ts";
import { resetTimelineWorkspaceStateRuntimeForTests } from "./timeline/timelineWorkspaceStateRuntime.ts";
import {
  publishScenarioWorkspaceState,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { publishWarRoomState } from "./warRoom/warRoomStateRuntime.ts";
import { resetWarRoomStateRuntimeForTests } from "./warRoom/warRoomStateRuntime.ts";
import {
  publishWarRoomWorkspaceState,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";

test.beforeEach(() => {
  resetAdvisoryWorkspaceRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryRecommendationRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
});

test("exports advisory recommendation freeze tag and version", () => {
  assert.equal(MRP_ADVISORY_RECOMMENDATION_TAG, "[MRP_ADVISORY_RECOMMENDATION]");
  assert.equal(ADVISORY_RECOMMENDATION_VERSION, "5A.3.0");
});

test("intake consumes intelligence from risk timeline scenario and war room", () => {
  publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    riskCount: 3,
    elevatedRiskCount: 1,
    criticalRiskCount: 1,
    dominantRiskCategory: "Operational",
  });
  publishTimelineWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    totalEvents: 8,
    recentEventCount: 2,
    decisionEventCount: 1,
    riskEventCount: 1,
  });
  publishScenarioWorkspaceState({
    phase: "ready",
    generatedScenarios: Object.freeze([
      Object.freeze({
        id: "expected_case",
        title: "Expected Case",
        probability: "55%",
        impact: "Medium",
        confidence: "Medium",
      }),
      Object.freeze({
        id: "worst_case",
        title: "Worst Case",
        probability: "20%",
        impact: "High",
        confidence: "Low",
      }),
    ]),
  });
  publishWarRoomWorkspaceState({
    phase: "ready",
    workspaceContext: Object.freeze({
      selectedObjectId: "factory-a",
      selectedObject: "Factory A",
      strategyFocus: "Operational resilience",
      activeDecision: "Capacity stabilization",
      commitmentStatus: "Planning",
      hasSelection: true,
    }),
  });
  publishWarRoomState({
    activeDecisionId: "decision:factory-a",
    selectedStrategy: "Capacity stabilization",
    status: "review",
  });

  const intake = buildAdvisoryRecommendationIntake();
  assert.equal(intake.risk.available, true);
  assert.equal(intake.timeline.available, true);
  assert.equal(intake.scenario.available, true);
  assert.equal(intake.warRoom.available, true);
});

test("deriveExecutiveRecommendationCard exposes five recommendation fields", () => {
  const context = resolveAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const layer = deriveAdvisoryRecommendationLayer({
    intake: buildAdvisoryRecommendationIntake(),
    workspaceContext: context,
  });

  assert.match(layer.card.recommendation, /recommend/i);
  assert.ok(layer.card.why.length > 0);
  assert.ok(layer.card.expectedBenefit.length > 0);
  assert.ok(layer.card.expectedRisk.length > 0);
  assert.notEqual(layer.card.confidence, "unknown");
  assert.equal(layer.consumesIntelligenceOnly, true);
  assert.equal(layer.createsRecommendation, true);
  assert.equal(layer.executesActions, false);
});

test("syncAdvisoryRecommendation publishes recommendation surface to workspace state", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a3");
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

  const layer = syncAdvisoryRecommendation();
  const state = getAdvisoryWorkspaceState();

  assert.equal(state.recommendationSurface.card.recommendation, layer.card.recommendation);
  assert.equal(state.recommendationLayer.executesActions, false);
  assert.match(state.recommendationDrivers.detail, /\[MRP_ADVISORY_EXPLAINABILITY\]/);
  assert.equal(state.explainabilitySurface.purpose, "Why do I recommend this?");

  const view = buildAdvisoryWorkspaceViewFromState(state);
  assert.equal(view.recommendation.card.recommendation, layer.card.recommendation);
  assert.equal(view.recommendation.createsRecommendation, true);
});

test("advisory creates recommendation but does not execute", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a3");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryRecommendation();

  const state = getAdvisoryWorkspaceState();
  assert.equal(state.recommendationLayer.executesActions, false);
  assert.equal(guardAdvisoryForbiddenAction({ action: "commit_decision" }).allowed, false);
});

test("traceAdvisoryRecommendationOnce is safe to call repeatedly", () => {
  traceAdvisoryRecommendationOnce("test");
  traceAdvisoryRecommendationOnce("test");
});

test("empty selection yields default recommendation card", () => {
  const card = deriveExecutiveRecommendationCard({
    intake: buildAdvisoryRecommendationIntake(),
    workspaceContext: resolveAdvisoryWorkspaceContext({}),
  });
  assert.equal(card.recommendation, "No executive recommendation available");
});
