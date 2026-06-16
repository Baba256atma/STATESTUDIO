import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_EXPLAINABILITY_PURPOSE,
  ADVISORY_EXPLAINABILITY_VERSION,
  MRP_ADVISORY_EXPLAINABILITY_TAG,
  RECOMMENDATION_DRIVER_SECTION_ORDER,
} from "./advisory/advisoryExplainabilityContract.ts";
import {
  deriveAdvisoryExplainabilityLayer,
  deriveRecommendationDriversSurface,
} from "./advisory/advisoryExplainabilityResolver.ts";
import {
  resetAdvisoryExplainabilityRuntimeForTests,
  traceAdvisoryExplainabilityOnce,
} from "./advisory/advisoryExplainabilityRuntime.ts";
import {
  buildAdvisoryRecommendationIntake,
  deriveAdvisoryRecommendationLayer,
} from "./advisory/advisoryRecommendationResolver.ts";
import {
  resetAdvisoryRecommendationRuntimeForTests,
  syncAdvisoryRecommendation,
} from "./advisory/advisoryRecommendationRuntime.ts";
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
import { publishOperationalWorkspaceState } from "./operational/operationalWorkspaceStateRuntime.ts";
import { resetOperationalWorkspaceStateRuntimeForTests } from "./operational/operationalWorkspaceStateRuntime.ts";
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
  resetOperationalWorkspaceStateRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
});

test("exports advisory explainability freeze tag version and purpose", () => {
  assert.equal(MRP_ADVISORY_EXPLAINABILITY_TAG, "[MRP_ADVISORY_EXPLAINABILITY]");
  assert.equal(ADVISORY_EXPLAINABILITY_VERSION, "5A.4.0");
  assert.equal(ADVISORY_EXPLAINABILITY_PURPOSE, "Why do I recommend this?");
});

test("deriveRecommendationDriversSurface exposes four driver sections", () => {
  publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: "warning",
    activityLevel: "high",
    operationalFocus: Object.freeze({
      headline: "Throughput recovery",
      detail: "Line 3 backlog elevated.",
    }),
  });
  publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 0,
    dominantRiskCategory: "Operational",
  });

  const context = resolveAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const drivers = deriveRecommendationDriversSurface({
    intake: buildAdvisoryRecommendationIntake(),
    workspaceContext: context,
  });

  assert.deepEqual(
    drivers.sections.map((section) => section.id),
    [...RECOMMENDATION_DRIVER_SECTION_ORDER]
  );
  assert.equal(drivers.sections.find((section) => section.id === "operational_drivers")?.drivers.length, 3);
  assert.equal(drivers.explainsRecommendationOnly, true);
});

test("deriveAdvisoryExplainabilityLayer exposes confidence analysis fields", () => {
  const context = resolveAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const intake = buildAdvisoryRecommendationIntake();
  const recommendationLayer = deriveAdvisoryRecommendationLayer({ intake, workspaceContext: context });
  const layer = deriveAdvisoryExplainabilityLayer({
    intake,
    workspaceContext: context,
    recommendationLayer,
  });

  assert.ok(layer.confidenceAnalysis.confidenceScore >= 20);
  assert.ok(layer.confidenceAnalysis.supportingEvidence.length > 0);
  assert.ok(layer.confidenceAnalysis.uncertaintyIndicators.length > 0);
  assert.equal(layer.explainsRecommendationOnly, true);
});

test("syncAdvisoryRecommendation publishes explainability surface to workspace state", () => {
  hydrateAdvisoryWorkspaceStateOnMount("5a4");
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
  const state = getAdvisoryWorkspaceState();

  assert.equal(state.explainabilitySurface.purpose, ADVISORY_EXPLAINABILITY_PURPOSE);
  assert.equal(state.explainabilityLayer.explainsRecommendationOnly, true);
  assert.match(state.recommendationDrivers.detail, /\[MRP_ADVISORY_EXPLAINABILITY\]/);
  assert.match(state.confidenceSummary.headline, /confidence/i);

  const view = buildAdvisoryWorkspaceViewFromState(state);
  assert.equal(view.explainability.drivers.sections.length, 4);
  assert.ok(view.explainability.confidenceAnalysis.confidenceScore > 0);
});

test("traceAdvisoryExplainabilityOnce is safe to call repeatedly", () => {
  traceAdvisoryExplainabilityOnce("test");
  traceAdvisoryExplainabilityOnce("test");
});
