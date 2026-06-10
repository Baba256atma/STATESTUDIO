import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_EXECUTIVE_ADVISORY_OWNER,
  CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID,
  EXECUTIVE_ADVISORY_SURFACE_VERSION,
} from "./executiveAdvisoryContract.ts";
import { aggregateExecutiveAdvisory } from "./executiveAdvisoryAggregation.ts";
import {
  getExecutiveAdvisorySnapshotForExecutiveSummary,
  initializeExecutiveAdvisoryRuntime,
  resetExecutiveAdvisoryRuntimeForTests,
  resolveExecutiveAdvisorySurface,
} from "./executiveAdvisoryRuntime.ts";
import { resetExecutiveAdvisoryLoggingForTests } from "./executiveAdvisoryLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetWarRoomIntelligenceLoggingForTests } from "../warRoomIntelligence/warRoomIntelligenceLogging.ts";
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
import { resetAdvisoryAggregationRuntimeForTests } from "./aggregation/advisoryAggregationRuntime.ts";
import { resetAdvisoryAggregationLoggingForTests } from "./aggregation/advisoryAggregationLogging.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "./confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryConfidenceLoggingForTests } from "./confidence/advisoryConfidenceLogging.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "./explainability/advisoryExplainabilityRuntime.ts";
import { resetAdvisoryExplainabilityLoggingForTests } from "./explainability/advisoryExplainabilityLogging.ts";
import { resetDecisionGuidanceRuntimeForTests } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resetDecisionGuidanceLoggingForTests } from "../decisionGuidance/decisionGuidanceLogging.ts";

test.beforeEach(() => {
  resetAdvisoryAggregationRuntimeForTests();
  resetAdvisoryAggregationLoggingForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryConfidenceLoggingForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryExplainabilityLoggingForTests();
  resetDecisionGuidanceRuntimeForTests();
  resetDecisionGuidanceLoggingForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetExecutiveAdvisoryLoggingForTests();
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

test("executive advisory contract is canonical", () => {
  assert.equal(CANONICAL_EXECUTIVE_ADVISORY_OWNER, "executiveAdvisoryRuntime");
  assert.equal(CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID, "decision");
  assert.equal(EXECUTIVE_ADVISORY_SURFACE_VERSION, "5.4.0");
});

test("executive advisory surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("decision");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "ExecutiveAdvisorySurface");
});

test("aggregation produces five advisory domains", () => {
  const model = aggregateExecutiveAdvisory({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(model.contextSources.includes("operational"));
  assert.ok(model.contextSources.includes("war_room"));
  assert.ok(
    ["monitor", "review", "investigate", "decision_recommended"].includes(model.snapshot.focus.focus)
  );
  assert.equal(model.snapshot.prioritySignals.signals.length, 4);
  assert.ok(model.snapshot.narrative.situationSummary.length > 0);
  assert.ok(model.snapshot.guidanceCandidates.candidates.length >= 1);
  assert.ok(["low", "moderate", "high", "very_high"].includes(model.snapshot.confidence.level));
  assert.ok(model.confidenceEvaluation.overall.level);
  assert.ok(model.explanationBundle.guidance.executiveSummary.length > 0);
});

test("war room context activates decision recommended focus", () => {
  const model = resolveExecutiveAdvisorySurface({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(model.snapshot.focus.focus, "decision_recommended");
  assert.ok(model.snapshot.warRoomContextBridge.includes("War Room"));
});

test("accordion decision panel uses executive_advisory body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "timeline",
    normalizedContext: null,
  });
  const decision = runtime.panels.find((panel) => panel.panelType === "decision");
  assert.ok(decision);
  assert.equal(decision.bodySlot, "executive_advisory");
});

test("executive summary consumes executive advisory feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("advisory"));
  const signalsCard = summary.cards.find((card) => card.kind === "active_signals");
  assert.ok(signalsCard?.secondaryValue.includes("Why:"));
});

test("advisory consumes war room and intelligence feeds", () => {
  const snapshot = getExecutiveAdvisorySnapshotForExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(snapshot.focus.focus, "decision_recommended");
  assert.ok(snapshot.prioritySignals.signals.some((entry) => entry.domain === "risk"));
  assert.ok(snapshot.guidanceCandidates.candidates.some((entry) => entry.kind === "compare_alternatives"));
});

test("executive advisory logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeExecutiveAdvisoryRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][ExecutiveAdvisory]"));
    assert.ok(logs.includes("[Nexora][AdvisoryFocus]"));
    assert.ok(logs.includes("[Nexora][PrioritySignal]"));
    assert.ok(logs.includes("[Nexora][AdvisoryNarrative]"));
    assert.ok(logs.includes("[Nexora][GuidanceCandidate]"));
    assert.ok(logs.includes("[Nexora][AdvisoryConfidence]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes executive advisory contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.executive_advisory_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
