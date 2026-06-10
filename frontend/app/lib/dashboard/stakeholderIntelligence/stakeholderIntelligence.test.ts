import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID,
  STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION,
} from "./stakeholderIntelligenceContract.ts";
import { STAKEHOLDER_CONTEXT_CONTRACT_VERSION } from "./stakeholderContextContract.ts";
import { STAKEHOLDER_REGISTRY_VERSION, listStakeholderGroups } from "./stakeholderRegistry.ts";
import { aggregateStakeholderIntelligence } from "./stakeholderIntelligenceAggregation.ts";
import { evaluateStakeholders } from "./stakeholderEvaluation.ts";
import {
  getStakeholderIntelligenceSnapshotForExecutiveSummary,
  getStakeholderIntelligenceSnapshotForPolicyIntelligence,
  getStakeholderIntelligenceSnapshotForStrategicAlignment,
  initializeStakeholderIntelligenceRuntime,
  resetStakeholderIntelligenceRuntimeForTests,
  resolveStakeholderIntelligenceSurface,
} from "./stakeholderIntelligenceRuntime.ts";
import { resetStakeholderIntelligenceLoggingForTests } from "./stakeholderIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetPolicyConstraintIntelligenceRuntimeForTests } from "../policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { resetPolicyConstraintIntelligenceLoggingForTests } from "../policyConstraintIntelligence/policyConstraintIntelligenceLogging.ts";
import { resetStrategicAlignmentRuntimeForTests } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { resetStrategicAlignmentLoggingForTests } from "../strategicAlignment/strategicAlignmentLogging.ts";
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
  resetStakeholderIntelligenceRuntimeForTests();
  resetStakeholderIntelligenceLoggingForTests();
  resetPolicyConstraintIntelligenceRuntimeForTests();
  resetPolicyConstraintIntelligenceLoggingForTests();
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

test("stakeholder intelligence contract is canonical", () => {
  assert.equal(CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER, "stakeholderIntelligenceRuntime");
  assert.equal(CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID, "stakeholder_intelligence");
  assert.equal(STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION, "6.4.0");
  assert.equal(STAKEHOLDER_CONTEXT_CONTRACT_VERSION, "6.4.0");
  assert.equal(STAKEHOLDER_REGISTRY_VERSION, "6.4.0");
});

test("stakeholder registry provides generic framework", () => {
  const groups = listStakeholderGroups();
  assert.equal(groups.length, 7);
  assert.ok(groups.some((entry) => entry.label === "Executive Team"));
  assert.ok(groups.some((entry) => entry.label === "Customers"));
});

test("stakeholder intelligence surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("stakeholder_intelligence");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "StakeholderIntelligenceSurface");
});

test("aggregation produces eight stakeholder domains", () => {
  const model = aggregateStakeholderIntelligence(feedInput);
  assert.equal(model.snapshot.stakeholderVisibility.stakeholders.length, 7);
  assert.ok(["positive", "neutral", "negative", "mixed"].includes(model.snapshot.stakeholderImpact.impact));
  assert.ok(
    ["aligned", "partially_aligned", "conflicting_interests", "misaligned"].includes(
      model.snapshot.stakeholderAlignment.alignment
    )
  );
  assert.equal(model.snapshot.stakeholderInfluence.entries.length, 7);
  assert.ok(
    ["no_significant_tension", "competing_priorities", "resource_conflict", "strategic_conflict"].includes(
      model.snapshot.stakeholderTension.level
    )
  );
  assert.equal(model.snapshot.stakeholderSupport.entries.length, 7);
  assert.ok(["low", "moderate", "high"].includes(model.snapshot.stakeholderConfidence.level));
  assert.ok(
    ["monitor", "review", "leadership_discussion_recommended", "stakeholder_escalation"].includes(
      model.snapshot.stakeholderAttention.level
    )
  );
  assert.ok(model.stakeholderContext.sourceChain.includes("policy_constraint"));
  assert.ok(model.stakeholderContext.sourceChain.includes("strategic_alignment"));
});

test("stakeholder evaluation layer maps organizational groups", () => {
  const model = resolveStakeholderIntelligenceSurface(feedInput);
  const evaluation = evaluateStakeholders(model.stakeholderContext);
  assert.equal(evaluation.visibility.length, 7);
  assert.equal(evaluation.influenceEntries.length, 7);
  assert.equal(evaluation.supportEntries.length, 7);
});

test("accordion stakeholder_intelligence panel uses stakeholder_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "stakeholder_intelligence");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "stakeholder_intelligence");
});

test("executive summary consumes stakeholder intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("stakeholder_intelligence"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("policy and strategic alignment integration via approved getters", () => {
  const model = resolveStakeholderIntelligenceSurface(feedInput);
  assert.ok(model.stakeholderContext.policy.policyAlignment.length > 0);
  assert.ok(model.stakeholderContext.strategicAlignment.alignmentScore.length > 0);
  assert.ok(model.stakeholderContext.governance.alignment.length > 0);
});

test("stakeholder intelligence logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeStakeholderIntelligenceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][StakeholderIntelligence]"));
    assert.ok(logs.includes("[Nexora][StakeholderImpact]"));
    assert.ok(logs.includes("[Nexora][StakeholderAlignment]"));
    assert.ok(logs.includes("[Nexora][StakeholderInfluence]"));
    assert.ok(logs.includes("[Nexora][StakeholderTension]"));
    assert.ok(logs.includes("[Nexora][StakeholderSupport]"));
    assert.ok(logs.includes("[Nexora][StakeholderConfidence]"));
    assert.ok(logs.includes("[Nexora][StakeholderAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const surface = resolveStakeholderIntelligenceSurface(feedInput);
  const summary = getStakeholderIntelligenceSnapshotForExecutiveSummary(feedInput);
  const policy = getStakeholderIntelligenceSnapshotForPolicyIntelligence(feedInput);
  const strategic = getStakeholderIntelligenceSnapshotForStrategicAlignment(feedInput);
  assert.equal(surface.snapshot.stakeholderImpact.impact, summary.stakeholderImpact.impact);
  assert.equal(summary.stakeholderImpact.impact, policy.stakeholderImpact.impact);
  assert.equal(policy.stakeholderImpact.impact, strategic.stakeholderImpact.impact);
});

test("architecture freeze includes stakeholder intelligence surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.stakeholder_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
