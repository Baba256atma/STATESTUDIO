import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
  CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID,
  WAR_ROOM_INTELLIGENCE_SURFACE_VERSION,
} from "./warRoomIntelligenceContract.ts";
import { aggregateWarRoomIntelligence } from "./warRoomIntelligenceAggregation.ts";
import {
  getWarRoomIntelligenceSnapshotForExecutiveSummary,
  initializeWarRoomIntelligenceRuntime,
  resetWarRoomIntelligenceRuntimeForTests,
  resolveWarRoomIntelligenceSurface,
} from "./warRoomIntelligenceRuntime.ts";
import { resetWarRoomIntelligenceLoggingForTests } from "./warRoomIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetScenarioIntelligenceLoggingForTests } from "../scenarioIntelligence/scenarioIntelligenceLogging.ts";
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
  resetWarRoomIntelligenceRuntimeForTests();
  resetWarRoomIntelligenceLoggingForTests();
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

test("war room intelligence contract is canonical", () => {
  assert.equal(CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER, "warRoomIntelligenceRuntime");
  assert.equal(CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID, "war_room");
  assert.equal(WAR_ROOM_INTELLIGENCE_SURFACE_VERSION, "4.6.0");
});

test("war room surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("war_room");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "WarRoomIntelligenceSurface");
});

test("aggregation produces six war room domains", () => {
  const model = aggregateWarRoomIntelligence({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(model.contextSources.includes("operational"));
  assert.ok(model.contextSources.includes("risk"));
  assert.ok(model.contextSources.includes("timeline"));
  assert.ok(model.contextSources.includes("scenario"));
  assert.equal(model.domainOrder.length, 6);
  assert.ok(model.snapshot.situationOverview.briefing.length > 0);
  assert.ok(model.snapshot.criticalRisks.topRisks.length >= 1);
  assert.ok(model.snapshot.timelinePressure.decisionWindow.length > 0);
  assert.equal(model.snapshot.scenarioComparison.scenarios.length, 3);
  assert.ok(model.snapshot.tradeoffAnalysis.tradeoffs.length >= 1);
  assert.ok(
    ["monitor", "review", "investigate", "decision_required"].includes(model.snapshot.decisionFocus.focus)
  );
});

test("war room context activates decision required focus", () => {
  const model = resolveWarRoomIntelligenceSurface({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(model.snapshot.situationOverview.currentState, "War Room Active");
  assert.equal(model.snapshot.decisionFocus.focus, "decision_required");
});

test("accordion war room panel uses war_room_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const warRoom = runtime.panels.find((panel) => panel.panelType === "war_room");
  assert.ok(warRoom);
  assert.equal(warRoom.bodySlot, "war_room_intelligence");
});

test("executive summary consumes war room intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("war_room"));
  const signalsCard = summary.cards.find((card) => card.kind === "active_signals");
  assert.ok(signalsCard?.secondaryValue.includes("War Room:"));
});

test("war room consumes all intelligence surface feeds", () => {
  const snapshot = getWarRoomIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(snapshot.criticalRisks.exposure.length > 0);
  assert.ok(snapshot.scenarioComparison.comparisonSummary.length > 0);
  assert.equal(snapshot.timelinePressure.timelineMomentum, "Blocked");
});

test("advisory integration contract exists", () => {
  const snapshot = getWarRoomIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(snapshot.advisoryIntegration.bridgeId, "war_room_to_executive_advisory");
  assert.equal(snapshot.advisoryIntegration.targetEngine, "executive_advisory");
  assert.equal(snapshot.advisoryIntegration.readiness, "ready");
});

test("war room logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeWarRoomIntelligenceRuntime({ dashboardContext: "war_room", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][WarRoomIntelligence]"));
    assert.ok(logs.includes("[Nexora][SituationOverview]"));
    assert.ok(logs.includes("[Nexora][CriticalRisk]"));
    assert.ok(logs.includes("[Nexora][TimelinePressure]"));
    assert.ok(logs.includes("[Nexora][ScenarioComparison]"));
    assert.ok(logs.includes("[Nexora][TradeoffAnalysis]"));
    assert.ok(logs.includes("[Nexora][DecisionFocus]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes war room intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.war_room_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
