import test from "node:test";
import assert from "node:assert/strict";

import { buildExecutiveSummaryLayerView } from "./executiveSummaryLayerRuntime.ts";
import { FUTURE_EXECUTIVE_SUMMARY_CARD_SLOTS } from "./executiveSummaryLayerContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "./executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "./executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceNavigationHistoryRuntimeForTests } from "./executiveWorkspaceNavigationHistoryRuntime.ts";
import { resetExecutiveWorkspaceNavigationHistoryForTests } from "./executiveWorkspaceNavigationHistoryContract.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
});

test("executive summary layer renders five cards", () => {
  const view = buildExecutiveSummaryLayerView({ dashboardMode: "overview" });
  assert.equal(view.cards.length, 5);
  assert.equal(view.source, "executive_summary_layer");
  assert.ok(view.cards.some((card) => card.id === "active_workspace"));
  assert.ok(view.cards.some((card) => card.id === "system_status"));
});

test("selected object empty state is professional without brakes", () => {
  const view = buildExecutiveSummaryLayerView({
    dashboardMode: "overview",
    selectedObjectId: null,
  });
  const objectCard = view.cards.find((card) => card.id === "selected_object");
  assert.equal(objectCard?.primaryValue, "No Object Selected");
  assert.equal(objectCard?.tone, "muted");
});

test("selected object card uses runtime metadata", () => {
  const view = buildExecutiveSummaryLayerView({
    dashboardMode: "overview",
    selectedObjectId: "line-3",
    selectedObjectLabel: "Line 3",
    selectedObjectType: "Production Line",
    selectedObjectStatus: "Monitoring",
  });
  const objectCard = view.cards.find((card) => card.id === "selected_object");
  assert.equal(objectCard?.primaryValue, "Line 3");
  assert.equal(objectCard?.secondaryValue, "Production Line");
  assert.match(objectCard?.detail ?? "", /Monitoring/);
});

test("active workspace card reflects dashboard mode", () => {
  const view = buildExecutiveSummaryLayerView({ dashboardMode: "analyze" });
  const workspaceCard = view.cards.find((card) => card.id === "active_workspace");
  assert.equal(workspaceCard?.primaryValue, "Analyze");
  assert.match(workspaceCard?.detail ?? "", /Analyze/);
});

test("future summary slots reserved for extension", () => {
  assert.ok(FUTURE_EXECUTIVE_SUMMARY_CARD_SLOTS.includes("risk_summary"));
  assert.ok(FUTURE_EXECUTIVE_SUMMARY_CARD_SLOTS.includes("executive_briefing_summary"));
});
