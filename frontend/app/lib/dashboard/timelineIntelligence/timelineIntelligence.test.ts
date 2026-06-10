import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
  CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID,
  TIMELINE_INTELLIGENCE_SURFACE_VERSION,
} from "./timelineIntelligenceContract.ts";
import { aggregateTimelineIntelligence } from "./timelineIntelligenceAggregation.ts";
import {
  getTimelineIntelligenceSnapshotForExecutiveSummary,
  initializeTimelineIntelligenceRuntime,
  resetTimelineIntelligenceRuntimeForTests,
  resolveTimelineIntelligenceSurface,
} from "./timelineIntelligenceRuntime.ts";
import { resetTimelineIntelligenceLoggingForTests } from "./timelineIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resolveRiskIntelligenceSurface, resetRiskIntelligenceRuntimeForTests } from "../riskIntelligence/riskIntelligenceRuntime.ts";
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

test("timeline intelligence contract is canonical", () => {
  assert.equal(CANONICAL_TIMELINE_INTELLIGENCE_OWNER, "timelineIntelligenceRuntime");
  assert.equal(CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID, "timeline");
  assert.equal(TIMELINE_INTELLIGENCE_SURFACE_VERSION, "4.4.0");
});

test("timeline surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("timeline");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "TimelineIntelligenceSurface");
});

test("aggregation produces five timeline domains", () => {
  const model = aggregateTimelineIntelligence({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(model.contextSources.includes("operational"));
  assert.ok(["accelerating", "stable", "slowing", "blocked"].includes(model.snapshot.momentum.level));
  assert.ok(["low", "moderate", "high", "critical"].includes(model.snapshot.milestonePressure.level));
  assert.ok(["on_track", "minor_drift", "moderate_drift", "major_drift"].includes(model.snapshot.scheduleDrift.level));
  assert.ok(["sparse", "normal", "heavy", "overloaded"].includes(model.snapshot.eventDensity.level));
  assert.ok(
    ["upcoming", "active", "missed", "none"].includes(model.snapshot.decisionWindows.status)
  );
  assert.ok(model.snapshot.graphicalContract.baseline.length > 0);
});

test("timeline context activates decision window and momentum", () => {
  const model = resolveTimelineIntelligenceSurface({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(model.snapshot.momentum.level, "accelerating");
  assert.equal(model.snapshot.decisionWindows.status, "active");
});

test("accordion timeline panel uses timeline_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "timeline",
    normalizedContext: null,
  });
  const timeline = runtime.panels.find((panel) => panel.panelType === "timeline");
  assert.ok(timeline);
  assert.equal(timeline.bodySlot, "timeline_intelligence");
});

test("executive summary consumes timeline intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("timeline"));
  const signalsCard = summary.cards.find((card) => card.kind === "active_signals");
  assert.ok(signalsCard?.secondaryValue.includes("Why:"));
});

test("risk intelligence consumes timeline feed for momentum enrichment", () => {
  const risk = resolveRiskIntelligenceSurface({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(risk.snapshot.momentum.momentum, "worsening");
});

test("timeline logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeTimelineIntelligenceRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][TimelineIntelligence]"));
    assert.ok(logs.includes("[Nexora][TimelineMomentum]"));
    assert.ok(logs.includes("[Nexora][MilestonePressure]"));
    assert.ok(logs.includes("[Nexora][ScheduleDrift]"));
    assert.ok(logs.includes("[Nexora][EventDensity]"));
    assert.ok(logs.includes("[Nexora][DecisionWindow]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("timeline snapshot feed is available for executive summary", () => {
  const snapshot = getTimelineIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(snapshot.momentum.label.length > 0);
});

test("architecture freeze includes timeline intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.timeline_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
