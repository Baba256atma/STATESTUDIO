import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID,
  INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION,
} from "./institutionalAlignmentContract.ts";
import { INSTITUTIONAL_CONTEXT_CONTRACT_VERSION } from "./institutionalContextContract.ts";
import { BOARD_INTELLIGENCE_CONTRACT_VERSION } from "./boardIntelligenceContract.ts";
import { aggregateInstitutionalAlignment } from "./institutionalAlignmentAggregation.ts";
import { evaluateInstitutionalAlignment } from "./institutionalEvaluation.ts";
import {
  getInstitutionalAlignmentFeedForBoardIntelligence,
  getInstitutionalAlignmentSnapshotForExecutiveSummary,
  initializeInstitutionalAlignmentRuntime,
  resetInstitutionalAlignmentRuntimeForTests,
  resolveInstitutionalAlignmentSurface,
} from "./institutionalAlignmentRuntime.ts";
import { resetInstitutionalAlignmentLoggingForTests } from "./institutionalAlignmentLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetConsensusIntelligenceRuntimeForTests } from "../consensusIntelligence/consensusIntelligenceRuntime.ts";
import { resetConsensusIntelligenceLoggingForTests } from "../consensusIntelligence/consensusIntelligenceLogging.ts";
import { resetStakeholderIntelligenceRuntimeForTests } from "../stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { resetStakeholderIntelligenceLoggingForTests } from "../stakeholderIntelligence/stakeholderIntelligenceLogging.ts";
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
  resetInstitutionalAlignmentRuntimeForTests();
  resetInstitutionalAlignmentLoggingForTests();
  resetConsensusIntelligenceRuntimeForTests();
  resetConsensusIntelligenceLoggingForTests();
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

test("institutional alignment contract is canonical", () => {
  assert.equal(CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER, "institutionalAlignmentRuntime");
  assert.equal(CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID, "institutional_alignment");
  assert.equal(INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION, "6.6.0");
  assert.equal(INSTITUTIONAL_CONTEXT_CONTRACT_VERSION, "6.6.0");
  assert.equal(BOARD_INTELLIGENCE_CONTRACT_VERSION, "6.6.0");
});

test("institutional alignment surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("institutional_alignment");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "InstitutionalAlignmentSurface");
});

test("aggregation produces seven institutional domains", () => {
  const model = aggregateInstitutionalAlignment(feedInput);
  assert.ok(
    ["strong_alignment", "moderate_alignment", "fragmented_alignment", "institutional_risk"].includes(
      model.snapshot.institutionalHealth.level
    )
  );
  assert.ok(
    ["governance_aligned", "governance_review_required", "governance_escalation"].includes(
      model.snapshot.governanceStatus.level
    )
  );
  assert.ok(
    ["strategic_objectives_supported", "mixed_strategic_signals", "strategic_misalignment"].includes(
      model.snapshot.strategicAlignmentStatus.level
    )
  );
  assert.ok(
    ["policy_aligned", "constraint_pressure", "policy_conflict"].includes(model.snapshot.policyStatus.level)
  );
  assert.ok(
    ["strong_support", "mixed_support", "stakeholder_resistance"].includes(
      model.snapshot.stakeholderStatus.level
    )
  );
  assert.ok(
    ["strong_consensus", "partial_consensus", "institutional_tension"].includes(
      model.snapshot.consensusStatus.level
    )
  );
  assert.ok(
    ["monitor", "review", "leadership_discussion_recommended", "institutional_escalation"].includes(
      model.snapshot.institutionalAttention.level
    )
  );
  assert.ok(model.institutionalContext.sourceChain.includes("governance"));
  assert.ok(model.institutionalContext.sourceChain.includes("consensus_intelligence"));
});

test("institutional evaluation layer maps institutional signals", () => {
  const model = resolveInstitutionalAlignmentSurface(feedInput);
  const evaluation = evaluateInstitutionalAlignment(model.institutionalContext);
  assert.ok(evaluation.health.length > 0);
  assert.ok(evaluation.governanceStatus.length > 0);
  assert.ok(evaluation.attention.length > 0);
});

test("accordion institutional_alignment panel uses institutional_alignment body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "institutional_alignment");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "institutional_alignment");
});

test("executive summary consumes institutional alignment feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("institutional_alignment"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("board intelligence contract is preparatory only", () => {
  const feed = getInstitutionalAlignmentFeedForBoardIntelligence(feedInput);
  assert.equal(feed.status, "pending_implementation");
  assert.equal(feed.source, "institutional_alignment");
  assert.equal(feed.targetOwner, "boardIntelligenceRuntime");
});

test("institutional alignment logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeInstitutionalAlignmentRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][InstitutionalAlignment]"));
    assert.ok(logs.includes("[Nexora][InstitutionalHealth]"));
    assert.ok(logs.includes("[Nexora][GovernanceStatus]"));
    assert.ok(logs.includes("[Nexora][StrategicAlignmentStatus]"));
    assert.ok(logs.includes("[Nexora][PolicyStatus]"));
    assert.ok(logs.includes("[Nexora][StakeholderStatus]"));
    assert.ok(logs.includes("[Nexora][ConsensusStatus]"));
    assert.ok(logs.includes("[Nexora][InstitutionalAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const surface = resolveInstitutionalAlignmentSurface(feedInput);
  const summary = getInstitutionalAlignmentSnapshotForExecutiveSummary(feedInput);
  assert.equal(surface.snapshot.institutionalHealth.level, summary.institutionalHealth.level);
});

test("architecture freeze includes institutional alignment surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.institutional_alignment_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
