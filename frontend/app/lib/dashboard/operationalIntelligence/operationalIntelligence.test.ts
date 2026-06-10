import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
  CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID,
  OPERATIONAL_INTELLIGENCE_SURFACE_VERSION,
} from "./operationalIntelligenceContract.ts";
import { aggregateOperationalIntelligence } from "./operationalIntelligenceAggregation.ts";
import {
  getOperationalIntelligenceSnapshotForExecutiveSummary,
  initializeOperationalIntelligenceRuntime,
  resetOperationalIntelligenceRuntimeForTests,
  resolveOperationalIntelligenceSurface,
} from "./operationalIntelligenceRuntime.ts";
import { resetOperationalIntelligenceLoggingForTests } from "./operationalIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../executiveSummary/executiveSummaryRuntime.ts";
import { resetExecutiveSummaryLoggingForTests } from "../executiveSummary/executiveSummaryLogging.ts";
import { getDashboardSurfaceEntry, resetDashboardSurfaceRegistryForTests } from "../dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboardAccordionContextPanels.ts";
import { initializeDashboardAccordionRuntime, resetDashboardAccordionRuntimeForTests } from "../dashboardAccordionRuntime.ts";
import { runArchitectureFreezeValidationPass } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";
import { resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetOperationalIntelligenceRuntimeForTests();
  resetOperationalIntelligenceLoggingForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetExecutiveSummaryLoggingForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("operational intelligence contract is canonical", () => {
  assert.equal(CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER, "operationalIntelligenceRuntime");
  assert.equal(CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID, "operational");
  assert.equal(OPERATIONAL_INTELLIGENCE_SURFACE_VERSION, "4.2.0");
});

test("operational surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("operational");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "OperationalIntelligenceSurface");
});

test("aggregation produces five operational domains", () => {
  const model = aggregateOperationalIntelligence({
    dashboardContext: "sources",
    normalizedContext: null,
    selectedObjectId: "obj-1",
    selectedObjectLabel: "Node A",
    objectsInScene: 5,
  });
  assert.equal(model.snapshot.health.status.length > 0, true);
  assert.equal(model.snapshot.activeObjects.objectsInScene, 5);
  assert.equal(model.snapshot.signals.signalCount >= 1, true);
  assert.ok(["low", "moderate", "high", "critical"].includes(model.snapshot.pressure.level));
  assert.ok(["growing", "stable", "declining"].includes(model.snapshot.demandImpact.direction));
  assert.ok(model.visualBundle.microCharts.length >= 1);
});

test("war room context elevates operational health and pressure", () => {
  const model = resolveOperationalIntelligenceSurface({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  assert.equal(model.snapshot.health.level, "critical");
  assert.equal(model.snapshot.pressure.level, "critical");
});

test("accordion operational panel uses operational_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "sources",
    normalizedContext: null,
  });
  const operational = runtime.panels.find((panel) => panel.panelType === "operational");
  assert.ok(operational);
  assert.equal(operational.bodySlot, "operational_intelligence");
});

test("executive summary consumes operational intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "sources",
    normalizedContext: null,
    selectedObjectId: "obj-7",
    selectedObjectLabel: "Sensor Hub",
  });
  assert.ok(summary.aggregationSources.includes("operational"));
  const systemCard = summary.cards.find((card) => card.kind === "system_status");
  assert.ok(systemCard?.secondaryValue.includes("Ops:"));
  const snapshot = getOperationalIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "sources",
    normalizedContext: null,
    selectedObjectId: "obj-7",
  });
  assert.equal(snapshot.activeObjects.requiringAttention, 1);
});

test("operational logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeOperationalIntelligenceRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][OperationalIntelligence]"));
    assert.ok(logs.includes("[Nexora][OperationalHealth]"));
    assert.ok(logs.includes("[Nexora][OperationalSignal]"));
    assert.ok(logs.includes("[Nexora][OperationalPressure]"));
    assert.ok(logs.includes("[Nexora][DemandImpact]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes operational intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.operational_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
