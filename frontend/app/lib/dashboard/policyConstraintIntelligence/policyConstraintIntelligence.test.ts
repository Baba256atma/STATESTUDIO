import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID,
  POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION,
} from "./policyConstraintIntelligenceContract.ts";
import { POLICY_CONTEXT_CONTRACT_VERSION } from "./policyContextContract.ts";
import { POLICY_REGISTRY_VERSION, listPolicies } from "./policyRegistry.ts";
import { aggregatePolicyConstraintIntelligence } from "./policyConstraintIntelligenceAggregation.ts";
import { evaluatePolicies } from "./policyEvaluation.ts";
import { evaluateConstraints } from "./constraintEvaluation.ts";
import {
  getPolicyConstraintIntelligenceSnapshotForExecutiveSummary,
  getPolicyConstraintIntelligenceSnapshotForGovernance,
  getPolicyConstraintIntelligenceSnapshotForStrategicAlignment,
  initializePolicyConstraintIntelligenceRuntime,
  resetPolicyConstraintIntelligenceRuntimeForTests,
  resolvePolicyConstraintIntelligenceSurface,
} from "./policyConstraintIntelligenceRuntime.ts";
import { resetPolicyConstraintIntelligenceLoggingForTests } from "./policyConstraintIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
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

test("policy constraint intelligence contract is canonical", () => {
  assert.equal(CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER, "policyConstraintIntelligenceRuntime");
  assert.equal(CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID, "policy_constraint");
  assert.equal(POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION, "6.3.0");
  assert.equal(POLICY_CONTEXT_CONTRACT_VERSION, "6.3.0");
  assert.equal(POLICY_REGISTRY_VERSION, "6.3.0");
});

test("policy registry provides generic framework", () => {
  const policies = listPolicies();
  assert.equal(policies.length, 3);
  assert.ok(policies.every((entry) => entry.label.startsWith("Institutional Policy")));
});

test("policy constraint surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("policy_constraint");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "PolicyConstraintIntelligenceSurface");
});

test("aggregation produces seven policy domains", () => {
  const model = aggregatePolicyConstraintIntelligence(feedInput);
  assert.ok(
    ["aligned", "partially_aligned", "requires_review", "potential_conflict"].includes(
      model.snapshot.policyAlignment.alignment
    )
  );
  assert.ok(["low", "moderate", "high", "critical"].includes(model.snapshot.policyImpact.level));
  assert.equal(model.snapshot.resourceConstraints.constraints.length, 4);
  assert.equal(model.snapshot.operationalConstraints.constraints.length, 4);
  assert.equal(model.snapshot.governanceConstraints.constraints.length, 4);
  assert.ok(
    ["informational", "moderate", "significant", "critical"].includes(
      model.snapshot.constraintSeverity.level
    )
  );
  assert.ok(
    ["monitor", "review", "leadership_attention_recommended", "policy_escalation"].includes(
      model.snapshot.policyAttention.level
    )
  );
  assert.ok(model.policyContext.sourceChain.includes("governance"));
  assert.ok(model.policyContext.sourceChain.includes("strategic_alignment"));
});

test("policy and constraint evaluation layers produce classifications", () => {
  const model = resolvePolicyConstraintIntelligenceSurface(feedInput);
  const policyEval = evaluatePolicies(model.policyContext);
  const constraintEval = evaluateConstraints(model.policyContext);
  assert.ok(policyEval.affectedPolicies.length === 3);
  assert.ok(constraintEval.resourceConstraints.constraints.length === 4);
  assert.ok(constraintEval.governanceConstraints.constraints.length === 4);
});

test("accordion policy_constraint panel uses policy_constraint_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "policy_constraint");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "policy_constraint_intelligence");
});

test("executive summary consumes policy constraint intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("policy_constraint_intelligence"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("governance and strategic alignment integration via approved getters", () => {
  const model = resolvePolicyConstraintIntelligenceSurface(feedInput);
  assert.ok(model.policyContext.governance.alignment.length > 0);
  assert.ok(model.policyContext.strategicAlignment.alignmentScore.length > 0);
  assert.ok(model.policyContext.decisionGuidance.focus.length > 0);
});

test("policy constraint intelligence logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializePolicyConstraintIntelligenceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][PolicyIntelligence]"));
    assert.ok(logs.includes("[Nexora][PolicyAlignment]"));
    assert.ok(logs.includes("[Nexora][PolicyImpact]"));
    assert.ok(logs.includes("[Nexora][ResourceConstraint]"));
    assert.ok(logs.includes("[Nexora][OperationalConstraint]"));
    assert.ok(logs.includes("[Nexora][GovernanceConstraint]"));
    assert.ok(logs.includes("[Nexora][ConstraintSeverity]"));
    assert.ok(logs.includes("[Nexora][PolicyAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const surface = resolvePolicyConstraintIntelligenceSurface(feedInput);
  const summary = getPolicyConstraintIntelligenceSnapshotForExecutiveSummary(feedInput);
  const governance = getPolicyConstraintIntelligenceSnapshotForGovernance(feedInput);
  const strategic = getPolicyConstraintIntelligenceSnapshotForStrategicAlignment(feedInput);
  assert.equal(surface.snapshot.policyAlignment.alignment, summary.policyAlignment.alignment);
  assert.equal(summary.policyAlignment.alignment, governance.policyAlignment.alignment);
  assert.equal(governance.policyAlignment.alignment, strategic.policyAlignment.alignment);
});

test("architecture freeze includes policy constraint intelligence surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find(
    (item) => item.id === "dashboard.policy_constraint_intelligence_surface"
  );
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
