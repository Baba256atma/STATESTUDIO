import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_DECISION_GUIDANCE_OWNER,
  CANONICAL_DECISION_GUIDANCE_SURFACE_ID,
  DECISION_GUIDANCE_SURFACE_VERSION,
} from "./decisionGuidanceContract.ts";
import { aggregateDecisionGuidance } from "./decisionGuidanceAggregation.ts";
import {
  getDecisionGuidanceSnapshotForExecutiveSummary,
  getDecisionGuidanceSnapshotForWarRoom,
  initializeDecisionGuidanceRuntime,
  resetDecisionGuidanceRuntimeForTests,
  resolveDecisionGuidanceSurface,
} from "./decisionGuidanceRuntime.ts";
import { resetDecisionGuidanceLoggingForTests } from "./decisionGuidanceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "../executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "../executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryAggregationRuntimeForTests } from "../executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../executiveSummary/executiveSummaryRuntime.ts";
import { getDashboardSurfaceEntry, resetDashboardSurfaceRegistryForTests } from "../dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboardAccordionContextPanels.ts";
import { initializeDashboardAccordionRuntime, resetDashboardAccordionRuntimeForTests } from "../dashboardAccordionRuntime.ts";
import { runArchitectureFreezeValidationPass, resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";
import {
  resetAdvisoryWarRoomIntegrationRuntimeForTests,
} from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";
import { resetAdvisoryWarRoomIntegrationLoggingForTests } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationLogging.ts";
import { resetAdvisoryWarRoomIntegrationProtectionForTests } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationProtection.ts";

const feedInput = {
  dashboardContext: "war_room" as const,
  normalizedContext: null,
  timelineActive: true,
};

test.beforeEach(() => {
  resetDecisionGuidanceRuntimeForTests();
  resetDecisionGuidanceLoggingForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryAggregationRuntimeForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
  resetAdvisoryWarRoomIntegrationRuntimeForTests();
  resetAdvisoryWarRoomIntegrationLoggingForTests();
  resetAdvisoryWarRoomIntegrationProtectionForTests();
});

test("decision guidance contract is canonical", () => {
  assert.equal(CANONICAL_DECISION_GUIDANCE_OWNER, "decisionGuidanceRuntime");
  assert.equal(CANONICAL_DECISION_GUIDANCE_SURFACE_ID, "decision_guidance");
  assert.equal(DECISION_GUIDANCE_SURFACE_VERSION, "5.5.0");
});

test("decision guidance surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("decision_guidance");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "DecisionGuidanceSurface");
});

test("aggregation produces six guidance domains", () => {
  const model = aggregateDecisionGuidance(feedInput);
  assert.ok(
    ["monitor", "review", "investigate", "decision_recommended", "decision_required"].includes(
      model.snapshot.decisionFocus.focus
    )
  );
  assert.ok(model.snapshot.executiveGuidance.entries.length >= 1);
  assert.ok(model.snapshot.confidenceSummary.label.length > 0);
  assert.ok(model.snapshot.explanationSummary.reasoningPath.includes("↓"));
  assert.ok(model.snapshot.tradeoffSummary.tradeoffs.length >= 0);
  assert.equal(model.snapshot.decisionContext.highlights.length, 5);
});

test("war room context activates decision required focus", () => {
  const model = resolveDecisionGuidanceSurface(feedInput);
  assert.equal(model.snapshot.decisionFocus.focus, "decision_required");
});

test("accordion decision_guidance panel uses decision_guidance body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "decision_guidance");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "decision_guidance");
});

test("executive summary consumes decision guidance feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("decision_guidance"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("war room consumes decision guidance feed", () => {
  const snapshot = getDecisionGuidanceSnapshotForWarRoom(feedInput);
  assert.equal(snapshot.decisionFocus.focus, "decision_required");
  assert.ok(snapshot.tradeoffSummary.summary.length > 0);
});

test("decision guidance logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeDecisionGuidanceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][DecisionGuidance]"));
    assert.ok(logs.includes("[Nexora][DecisionFocus]"));
    assert.ok(logs.includes("[Nexora][ExecutiveGuidance]"));
    assert.ok(logs.includes("[Nexora][ConfidenceSummary]"));
    assert.ok(logs.includes("[Nexora][ExplanationSummary]"));
    assert.ok(logs.includes("[Nexora][TradeoffSummary]"));
    assert.ok(logs.includes("[Nexora][DecisionContext]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const warRoom = getDecisionGuidanceSnapshotForWarRoom(feedInput);
  const summary = getDecisionGuidanceSnapshotForExecutiveSummary(feedInput);
  assert.equal(warRoom.decisionFocus.focus, summary.decisionFocus.focus);
});

test("architecture freeze includes decision guidance surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.decision_guidance_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
