import test from "node:test";
import assert from "node:assert/strict";

import {
  EXECUTIVE_BRIEFING_MAX_DISPLAY,
  FUTURE_EXECUTIVE_BRIEFING_SOURCE_SLOTS,
  resetExecutiveBriefingBrakesForTests,
} from "./executiveBriefingContract.ts";
import {
  EXECUTIVE_BRIEFING_APPROVED_DESTINATIONS,
  EXECUTIVE_BRIEFING_LEGACY_ISOLATION,
} from "./executiveBriefingLegacyFindings.ts";
import {
  buildExecutiveBriefingView,
  resolveExecutiveRecommendationAction,
} from "./executiveBriefingRuntime.ts";
import { resetWorkspaceRecommendationForTests } from "../../workspaces/workspaceRecommendationContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../executiveWorkspaceNavigationHistoryContract.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";

test.beforeEach(() => {
  resetExecutiveBriefingBrakesForTests();
  resetWorkspaceRecommendationForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

test("briefing view uses executive briefing source", () => {
  const view = buildExecutiveBriefingView({});
  assert.equal(view.source, "executive_briefing_layer");
  assert.ok(view.briefing);
  assert.ok(Array.isArray(view.recommendations));
});

test("nominal empty state uses executive-friendly narrative", () => {
  const view = buildExecutiveBriefingView({});
  assert.equal(view.briefing.isNominal, true);
  assert.equal(view.recommendations.length, 0);
  assert.match(view.briefing.narrative, /System operating normally/i);
  assert.match(view.briefing.narrative, /No recommendations require attention/i);
});

test("risk object projects risk type with high confidence action", () => {
  const view = buildExecutiveBriefingView({
    selectedObjectId: "line-1",
    selectedObjectLabel: "Line 1",
    objectSignal: "risk",
    objectImpact: "critical",
  });

  assert.ok(view.recommendations.length > 0);
  const riskCard = view.recommendations.find((entry) => entry.recommendationType === "risk");
  assert.ok(riskCard);
  assert.equal(riskCard.confidence, "high");
  assert.match(riskCard.suggestedActionLabel, /War Room|Analyze/i);

  const action = resolveExecutiveRecommendationAction(riskCard);
  assert.equal(action.actionKind, "workspace_launch");
  assert.ok(action.workspaceId);
});

test("object selected projects insight cards with workspace actions", () => {
  const view = buildExecutiveBriefingView({
    selectedObjectId: "line-3",
    selectedObjectLabel: "Line 3",
    objectSignal: "general",
  });

  assert.ok(view.recommendations.length >= 1);
  assert.ok(view.recommendations.length <= EXECUTIVE_BRIEFING_MAX_DISPLAY);
  assert.ok(view.recommendations.some((entry) => entry.suggestedActionLabel.includes("Analyze")));
  assert.equal(view.briefing.isNominal, false);
  assert.match(view.briefing.narrative, /require attention today/i);
});

test("recommendation types stay within approved set", () => {
  const view = buildExecutiveBriefingView({
    selectedObjectId: "line-1",
    kpiDecline: true,
    scenarioConflict: true,
    timelineAnomaly: true,
  });

  const allowed = new Set(["attention", "opportunity", "risk", "insight", "follow_up"]);
  for (const card of view.recommendations) {
    assert.ok(allowed.has(card.recommendationType));
    assert.ok(["low", "medium", "high"].includes(card.confidence));
  }
});

test("legacy isolation documents approved sources only", () => {
  assert.equal(EXECUTIVE_BRIEFING_LEGACY_ISOLATION.approvedSource.status, "approved");
  assert.equal(
    EXECUTIVE_BRIEFING_LEGACY_ISOLATION.deprecatedSurfaces.executiveDashboardPanel.status,
    "legacy_isolated"
  );
  assert.ok(EXECUTIVE_BRIEFING_APPROVED_DESTINATIONS.includes("analyze"));
  assert.ok(EXECUTIVE_BRIEFING_APPROVED_DESTINATIONS.includes("dashboard_home_recommendations_section"));
});

test("future briefing source slots reserved for engine integration", () => {
  assert.ok(FUTURE_EXECUTIVE_BRIEFING_SOURCE_SLOTS.includes("risk_engine"));
  assert.ok(FUTURE_EXECUTIVE_BRIEFING_SOURCE_SLOTS.includes("advisory_engine"));
});
