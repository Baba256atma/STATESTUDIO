import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
  CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID,
  SCENARIO_INTELLIGENCE_SURFACE_VERSION,
} from "./scenarioIntelligenceContract.ts";
import { aggregateScenarioIntelligence } from "./scenarioIntelligenceAggregation.ts";
import {
  getScenarioIntelligenceSnapshotForExecutiveSummary,
  initializeScenarioIntelligenceRuntime,
  resetScenarioIntelligenceRuntimeForTests,
  resolveScenarioIntelligenceSurface,
} from "./scenarioIntelligenceRuntime.ts";
import { resetScenarioIntelligenceLoggingForTests } from "./scenarioIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetTimelineIntelligenceLoggingForTests } from "../timelineIntelligence/timelineIntelligenceLogging.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetRiskIntelligenceLoggingForTests } from "../riskIntelligence/riskIntelligenceLogging.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetOperationalIntelligenceLoggingForTests } from "../operationalIntelligence/operationalIntelligenceLogging.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../executiveSummary/executiveSummaryRuntime.ts";
import { resetExecutiveSummaryLoggingForTests } from "../executiveSummary/executiveSummaryLogging.ts";
import { getDashboardSurfaceEntry, resetDashboardSurfaceRegistryForTests } from "../dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboardAccordionContextPanels.ts";
import { initializeDashboardAccordionRuntime, resetDashboardAccordionRuntimeForTests } from "../dashboardAccordionRuntime.ts";
import { runArchitectureFreezeValidationPass } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";
import { resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetScenarioIntelligenceRuntimeForTests();
  resetScenarioIntelligenceLoggingForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetTimelineIntelligenceLoggingForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetRiskIntelligenceLoggingForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetOperationalIntelligenceLoggingForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetExecutiveSummaryLoggingForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("scenario intelligence contract is canonical", () => {
  assert.equal(CANONICAL_SCENARIO_INTELLIGENCE_OWNER, "scenarioIntelligenceRuntime");
  assert.equal(CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID, "scenario");
  assert.equal(SCENARIO_INTELLIGENCE_SURFACE_VERSION, "4.5.0");
});

test("scenario surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("scenario");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "ScenarioIntelligenceSurface");
});

test("aggregation produces five scenario domains", () => {
  const model = aggregateScenarioIntelligence({
    dashboardContext: "scenario",
    normalizedContext: null,
  });
  assert.ok(model.contextSources.includes("operational"));
  assert.ok(model.contextSources.includes("risk"));
  assert.ok(model.contextSources.includes("timeline"));
  assert.equal(model.snapshot.portfolio.scenarios.length, 4);
  assert.ok(["low", "moderate", "high"].includes(model.snapshot.confidence.level));
  assert.ok(
    ["low", "moderate", "high", "transformational"].includes(model.snapshot.expectedImpact.level)
  );
  assert.equal(model.snapshot.tradeoffs.tradeoffs.length, 4);
  assert.ok(model.snapshot.investigationPaths.paths.length >= 2);
});

test("scenario context activates triple comparison", () => {
  const model = resolveScenarioIntelligenceSurface({
    dashboardContext: "scenario",
    normalizedContext: null,
  });
  assert.equal(model.snapshot.comparisonContract.mode, "triple");
  assert.equal(model.snapshot.comparisonContract.scenarioIds.length, 3);
  assert.ok(model.snapshot.portfolio.activeCount >= 2);
});

test("accordion scenario panel uses scenario_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "scenario",
    normalizedContext: null,
  });
  const scenario = runtime.panels.find((panel) => panel.panelType === "scenario");
  assert.ok(scenario);
  assert.equal(scenario.bodySlot, "scenario_intelligence");
});

test("executive summary consumes scenario intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "scenario",
    normalizedContext: null,
  });
  assert.ok(summary.aggregationSources.includes("scenario"));
  const signalsCard = summary.cards.find((card) => card.kind === "active_signals");
  assert.ok(signalsCard?.secondaryValue.includes("Scenario:"));
});

test("scenario consumes risk and timeline intelligence feeds", () => {
  const model = resolveScenarioIntelligenceSurface({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(model.snapshot.confidence.level, "low");
  assert.equal(model.snapshot.warRoomEscalation.targetContext, "war_room");
});

test("war room escalation contract exists", () => {
  const snapshot = getScenarioIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  assert.equal(snapshot.warRoomEscalation.escalationId, "escalate_scenario_to_war_room");
  assert.ok(["ready", "pending_review", "not_ready"].includes(snapshot.warRoomEscalation.readiness));
});

test("scenario logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeScenarioIntelligenceRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][ScenarioIntelligence]"));
    assert.ok(logs.includes("[Nexora][ScenarioPortfolio]"));
    assert.ok(logs.includes("[Nexora][ScenarioConfidence]"));
    assert.ok(logs.includes("[Nexora][ExpectedImpact]"));
    assert.ok(logs.includes("[Nexora][TradeoffAnalysis]"));
    assert.ok(logs.includes("[Nexora][InvestigationPath]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes scenario intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.scenario_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
