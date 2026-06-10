import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID,
  GOVERNANCE_INTELLIGENCE_SURFACE_VERSION,
} from "./governanceIntelligenceContract.ts";
import { GOVERNANCE_CONTEXT_CONTRACT_VERSION } from "./governanceContextContract.ts";
import { aggregateGovernanceIntelligence } from "./governanceIntelligenceAggregation.ts";
import {
  getGovernanceIntelligenceSnapshotForExecutiveSummary,
  initializeGovernanceIntelligenceRuntime,
  resetGovernanceIntelligenceRuntimeForTests,
  resolveGovernanceIntelligenceSurface,
} from "./governanceIntelligenceRuntime.ts";
import { resetGovernanceIntelligenceLoggingForTests } from "./governanceIntelligenceLogging.ts";
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
import { resetDecisionGuidanceRuntimeForTests } from "../decisionGuidance/decisionGuidanceRuntime.ts";
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

test("governance intelligence contract is canonical", () => {
  assert.equal(CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER, "governanceIntelligenceRuntime");
  assert.equal(CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID, "governance");
  assert.equal(GOVERNANCE_INTELLIGENCE_SURFACE_VERSION, "6.1.0");
  assert.equal(GOVERNANCE_CONTEXT_CONTRACT_VERSION, "6.1.0");
});

test("governance intelligence surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("governance");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "GovernanceIntelligenceSurface");
});

test("aggregation produces six governance domains", () => {
  const model = aggregateGovernanceIntelligence(feedInput);
  assert.ok(
    ["aligned", "partially_aligned", "requires_review", "potential_misalignment"].includes(
      model.snapshot.governanceAlignment.alignment
    )
  );
  assert.ok(model.snapshot.policyAwareness.considerations.length >= 1);
  assert.ok(model.snapshot.constraintAwareness.constraints.length >= 2);
  assert.equal(model.snapshot.stakeholderImpact.stakeholders.length, 4);
  assert.equal(model.snapshot.accountabilityContext.entries.length, 4);
  assert.ok(
    ["monitor", "review", "approval_recommended", "governance_escalation"].includes(
      model.snapshot.governanceAttention.level
    )
  );
  assert.ok(model.governanceContext.sourceChain.includes("decision_guidance"));
});

test("war room context activates governance review posture", () => {
  const model = resolveGovernanceIntelligenceSurface(feedInput);
  assert.ok(
    model.snapshot.governanceAlignment.alignment === "requires_review" ||
      model.snapshot.governanceAlignment.alignment === "potential_misalignment"
  );
});

test("accordion governance panel uses governance_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "governance");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "governance_intelligence");
});

test("executive summary consumes governance intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("governance_intelligence"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("governance intelligence logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeGovernanceIntelligenceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][GovernanceIntelligence]"));
    assert.ok(logs.includes("[Nexora][GovernanceAlignment]"));
    assert.ok(logs.includes("[Nexora][PolicyAwareness]"));
    assert.ok(logs.includes("[Nexora][ConstraintAwareness]"));
    assert.ok(logs.includes("[Nexora][StakeholderImpact]"));
    assert.ok(logs.includes("[Nexora][AccountabilityContext]"));
    assert.ok(logs.includes("[Nexora][GovernanceAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("executive summary getter shares cached snapshot", () => {
  const surface = resolveGovernanceIntelligenceSurface(feedInput);
  const summary = getGovernanceIntelligenceSnapshotForExecutiveSummary(feedInput);
  assert.equal(surface.snapshot.governanceAlignment.alignment, summary.governanceAlignment.alignment);
});

test("architecture freeze includes governance intelligence surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.governance_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
