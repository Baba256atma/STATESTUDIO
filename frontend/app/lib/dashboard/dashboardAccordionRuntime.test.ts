import test from "node:test";
import assert from "node:assert/strict";

import {
  collapseAllAccordionPanels,
  expandAccordionPanel,
  expandAccordionPanels,
  initializeDashboardAccordionRuntime,
  resetDashboardAccordionRuntimeForTests,
  toggleAccordionPanel,
} from "./dashboardAccordionRuntime.ts";
import { listAccordionPanelTypesForContext } from "./dashboardAccordionContextPanels.ts";
import { resetDashboardAccordionRegistryForTests } from "./dashboardAccordionRegistry.ts";
import { resetDashboardAccordionLoggingForTests } from "./dashboardAccordionLogging.ts";
import {
  clearAccordionPersistenceForTests,
  loadAccordionPersistence,
} from "./dashboardAccordionPersistence.ts";
import { resetDashboardSurfaceRegistryForTests } from "./dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionPanelCacheForTests } from "./dashboardAccordionContextPanels.ts";
import { resetDashboardContextRouterForTests } from "./dashboardContextRouter.ts";
import { resetDashboardPerformanceMetricsForTests } from "./dashboardPerformanceMetrics.ts";
import { resetDashboardPerformanceRegressionForTests } from "./dashboardPerformanceRegression.ts";

test.beforeEach(() => {
  resetDashboardAccordionRuntimeForTests();
  resetDashboardAccordionRegistryForTests();
  resetDashboardAccordionLoggingForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardContextRouterForTests();
  resetDashboardPerformanceMetricsForTests();
  resetDashboardPerformanceRegressionForTests();
  clearAccordionPersistenceForTests();
});

test("war room context activates multiple accordion panels", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  assert.equal(runtime.panels.length, 14);
  assert.ok(runtime.panels.some((panel) => panel.panelType === "war_room"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "decision_guidance"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "governance"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "strategic_alignment"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "policy_constraint"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "stakeholder_intelligence"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "consensus_intelligence"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "institutional_alignment"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "decision"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "operational"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "risk"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "timeline"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "scenario"));
  assert.ok(runtime.panels.some((panel) => panel.panelType === "executive_summary"));
});

test("risk panel sorts above scenario by priority", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "scenario",
    normalizedContext: null,
  });
  const riskIndex = runtime.panels.findIndex((panel) => panel.panelType === "risk");
  const scenarioIndex = runtime.panels.findIndex((panel) => panel.panelType === "scenario");
  assert.ok(riskIndex >= 0);
  assert.ok(scenarioIndex >= 0);
  assert.ok(riskIndex < scenarioIndex);
});

test("multiple panels can remain expanded simultaneously", () => {
  const initial = initializeDashboardAccordionRuntime({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const panelIds = initial.panels.map((panel) => panel.panelId);
  const expanded = expandAccordionPanels(initial, panelIds);
  assert.equal(expanded.expandedPanelIds.length, panelIds.length);
});

test("collapse all keeps headers registered while collapsing bodies", () => {
  const initial = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const collapsed = collapseAllAccordionPanels(initial);
  assert.equal(collapsed.expandedPanelIds.length, 0);
  assert.equal(collapsed.panels.length, initial.panels.length);
  assert.ok(collapsed.panels.every((panel) => panel.expansionState === "collapsed"));
});

test("expansion state persists across runtime reinitialization", () => {
  const initial = initializeDashboardAccordionRuntime({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  const target = initial.panels.find((panel) => panel.panelType === "risk");
  assert.ok(target);
  const committed = expandAccordionPanel(initial, target.panelId);
  assert.equal(committed.expandedPanelIds.includes(target.panelId), true);
  const persisted = loadAccordionPersistence(initial.contextSignature);
  assert.equal(persisted[target.panelId], "expanded");

  const restored = initializeDashboardAccordionRuntime({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  const restoredPanel = restored.panels.find((panel) => panel.panelId === target.panelId);
  assert.equal(restoredPanel?.expansionState, "expanded");
});

test("toggle panel switches expansion state", () => {
  const initial = initializeDashboardAccordionRuntime({
    dashboardContext: "timeline",
    normalizedContext: null,
  });
  const target = initial.panels[0];
  const before = target.expansionState;
  const toggled = toggleAccordionPanel(initial, target.panelId);
  const after = toggled.panels.find((panel) => panel.panelId === target.panelId)?.expansionState;
  assert.notEqual(before, after);
});

test("accordion panel contract fields are standardized", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  for (const panel of runtime.panels) {
    assert.ok(panel.panelId.length > 0);
    assert.ok(panel.priority > 0);
    assert.ok(panel.header.title.length > 0);
    assert.ok(panel.header.status.length > 0);
    assert.ok(panel.header.summary.length > 0);
    assert.ok(panel.header.indicators.length > 0);
    assert.ok(panel.panelContext.dashboardContext === "overview");
  }
});

test("context preset lists match war room executive bundle", () => {
  const panelTypes = listAccordionPanelTypesForContext("war_room");
  assert.deepEqual(panelTypes, ["war_room", "decision_guidance", "governance", "strategic_alignment", "policy_constraint", "stakeholder_intelligence", "consensus_intelligence", "institutional_alignment", "decision", "operational", "risk", "timeline", "scenario", "executive_summary"]);
});
