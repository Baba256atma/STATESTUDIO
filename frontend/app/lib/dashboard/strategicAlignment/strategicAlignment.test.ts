import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID,
  STRATEGIC_ALIGNMENT_SURFACE_VERSION,
} from "./strategicAlignmentContract.ts";
import { STRATEGIC_CONTEXT_CONTRACT_VERSION } from "./strategicContextContract.ts";
import { STRATEGIC_OBJECTIVE_REGISTRY_VERSION, listStrategicObjectives } from "./strategicObjectiveRegistry.ts";
import { aggregateStrategicAlignment } from "./strategicAlignmentAggregation.ts";
import { evaluateStrategicAlignment } from "./strategicAlignmentEvaluation.ts";
import {
  getStrategicAlignmentSnapshotForExecutiveSummary,
  getStrategicAlignmentSnapshotForGovernance,
  initializeStrategicAlignmentRuntime,
  resetStrategicAlignmentRuntimeForTests,
  resolveStrategicAlignmentSurface,
} from "./strategicAlignmentRuntime.ts";
import { resetStrategicAlignmentLoggingForTests } from "./strategicAlignmentLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetGovernanceIntelligenceRuntimeForTests } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resetGovernanceIntelligenceLoggingForTests } from "../governanceIntelligence/governanceIntelligenceLogging.ts";
import { resetDecisionGuidanceRuntimeForTests } from "../decisionGuidance/decisionGuidanceRuntime.ts";
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
import { resetAdvisoryWarRoomIntegrationRuntimeForTests } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";
import { resetAdvisoryWarRoomIntegrationLoggingForTests } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationLogging.ts";
import { resetAdvisoryWarRoomIntegrationProtectionForTests } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationProtection.ts";

const feedInput = {
  dashboardContext: "war_room" as const,
  normalizedContext: null,
  timelineActive: true,
};

test.beforeEach(() => {
  resetStrategicAlignmentRuntimeForTests();
  resetStrategicAlignmentLoggingForTests();
  resetGovernanceIntelligenceRuntimeForTests();
  resetGovernanceIntelligenceLoggingForTests();
  resetDecisionGuidanceRuntimeForTests();
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

test("strategic alignment contract is canonical", () => {
  assert.equal(CANONICAL_STRATEGIC_ALIGNMENT_OWNER, "strategicAlignmentRuntime");
  assert.equal(CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID, "strategic_alignment");
  assert.equal(STRATEGIC_ALIGNMENT_SURFACE_VERSION, "6.2.0");
  assert.equal(STRATEGIC_CONTEXT_CONTRACT_VERSION, "6.2.0");
  assert.equal(STRATEGIC_OBJECTIVE_REGISTRY_VERSION, "6.2.0");
});

test("strategic objective registry provides generic framework", () => {
  const objectives = listStrategicObjectives();
  assert.equal(objectives.length, 3);
  assert.ok(objectives.every((entry) => entry.label.startsWith("Strategic Objective")));
});

test("strategic alignment surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("strategic_alignment");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "StrategicAlignmentSurface");
});

test("aggregation produces seven strategic domains", () => {
  const model = aggregateStrategicAlignment(feedInput);
  assert.ok(
    ["strong_alignment", "moderate_alignment", "weak_alignment", "potential_misalignment"].includes(
      model.snapshot.alignmentScore.score
    )
  );
  assert.equal(model.snapshot.objectivesImpact.objectives.length, 3);
  assert.ok(
    ["advances_strategic_direction", "maintains_strategic_direction", "conflicts_with_strategic_direction"].includes(
      model.snapshot.strategicDirection.direction
    )
  );
  assert.equal(model.snapshot.strategicTradeoffs.tradeoffs.length, 4);
  assert.ok(
    ["no_significant_tension", "competing_priorities", "strategic_conflict"].includes(
      model.snapshot.strategicTension.level
    )
  );
  assert.ok(["low", "moderate", "high"].includes(model.snapshot.strategicConfidence.level));
  assert.ok(
    ["monitor", "review", "leadership_attention_recommended", "strategic_escalation"].includes(
      model.snapshot.strategicAttention.level
    )
  );
  assert.ok(model.strategicContext.sourceChain.includes("governance"));
  assert.ok(model.strategicContext.sourceChain.includes("decision_guidance"));
});

test("alignment evaluation layer maps objectives", () => {
  const model = resolveStrategicAlignmentSurface(feedInput);
  const evaluation = evaluateStrategicAlignment(model.strategicContext);
  assert.equal(evaluation.objectives.length, 3);
  assert.ok(evaluation.objectives.every((entry) => ["supported", "neutral", "at_risk"].includes(entry.impact)));
});

test("accordion strategic_alignment panel uses strategic_alignment_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "strategic_alignment");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "strategic_alignment_intelligence");
});

test("executive summary consumes strategic alignment feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("strategic_alignment"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("governance integration consumes governance context via approved getter", () => {
  const model = resolveStrategicAlignmentSurface(feedInput);
  assert.ok(model.strategicContext.governance.alignment.length > 0);
  assert.ok(model.strategicContext.decisionGuidance.focus.length > 0);
});

test("strategic alignment logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeStrategicAlignmentRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][StrategicAlignment]"));
    assert.ok(logs.includes("[Nexora][ObjectiveImpact]"));
    assert.ok(logs.includes("[Nexora][StrategicDirection]"));
    assert.ok(logs.includes("[Nexora][StrategicTradeoff]"));
    assert.ok(logs.includes("[Nexora][StrategicTension]"));
    assert.ok(logs.includes("[Nexora][StrategicConfidence]"));
    assert.ok(logs.includes("[Nexora][StrategicAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const surface = resolveStrategicAlignmentSurface(feedInput);
  const summary = getStrategicAlignmentSnapshotForExecutiveSummary(feedInput);
  const governance = getStrategicAlignmentSnapshotForGovernance(feedInput);
  assert.equal(surface.snapshot.alignmentScore.score, summary.alignmentScore.score);
  assert.equal(summary.alignmentScore.score, governance.alignmentScore.score);
});

test("architecture freeze includes strategic alignment surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.strategic_alignment_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
