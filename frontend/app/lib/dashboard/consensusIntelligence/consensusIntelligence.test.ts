import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID,
  CONSENSUS_INTELLIGENCE_SURFACE_VERSION,
} from "./consensusIntelligenceContract.ts";
import { CONSENSUS_CONTEXT_CONTRACT_VERSION } from "./consensusContextContract.ts";
import { CONSENSUS_REGISTRY_VERSION, listAlignmentGroups, listConflictGroups, listConsensusDomains } from "./consensusRegistry.ts";
import { aggregateConsensusIntelligence } from "./consensusIntelligenceAggregation.ts";
import { evaluateConsensus } from "./consensusEvaluation.ts";
import {
  getConsensusIntelligenceSnapshotForExecutiveSummary,
  getConsensusIntelligenceSnapshotForPolicyIntelligence,
  getConsensusIntelligenceSnapshotForStakeholderIntelligence,
  getConsensusIntelligenceSnapshotForStrategicAlignment,
  initializeConsensusIntelligenceRuntime,
  resetConsensusIntelligenceRuntimeForTests,
  resolveConsensusIntelligenceSurface,
} from "./consensusIntelligenceRuntime.ts";
import { resetConsensusIntelligenceLoggingForTests } from "./consensusIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
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

test("consensus intelligence contract is canonical", () => {
  assert.equal(CANONICAL_CONSENSUS_INTELLIGENCE_OWNER, "consensusIntelligenceRuntime");
  assert.equal(CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID, "consensus_intelligence");
  assert.equal(CONSENSUS_INTELLIGENCE_SURFACE_VERSION, "6.5.0");
  assert.equal(CONSENSUS_CONTEXT_CONTRACT_VERSION, "6.5.0");
  assert.equal(CONSENSUS_REGISTRY_VERSION, "6.5.0");
});

test("consensus registry provides generic framework", () => {
  const domains = listConsensusDomains();
  const alignment = listAlignmentGroups();
  const conflicts = listConflictGroups();
  assert.equal(domains.length, 4);
  assert.equal(alignment.length, 4);
  assert.equal(conflicts.length, 4);
  assert.ok(alignment.some((entry) => entry.label === "Executive Alignment"));
  assert.ok(conflicts.some((entry) => entry.label === "Governance Conflict"));
});

test("consensus intelligence surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("consensus_intelligence");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "ConsensusIntelligenceSurface");
});

test("aggregation produces eight consensus domains", () => {
  const model = aggregateConsensusIntelligence(feedInput);
  assert.ok(
    ["strong_consensus", "moderate_consensus", "mixed_alignment", "low_consensus"].includes(
      model.snapshot.consensusLevel.level
    )
  );
  assert.equal(model.snapshot.alignmentZones.zones.length, 4);
  assert.equal(model.snapshot.disagreementZones.zones.length, 4);
  assert.ok(
    ["growing_convergence", "stable_convergence", "weak_convergence"].includes(
      model.snapshot.convergence.level
    )
  );
  assert.ok(
    ["emerging_divergence", "increasing_divergence", "critical_divergence"].includes(
      model.snapshot.divergence.level
    )
  );
  assert.ok(["low", "moderate", "high", "critical"].includes(model.snapshot.institutionalTension.level));
  assert.ok(["low", "moderate", "high"].includes(model.snapshot.consensusConfidence.level));
  assert.ok(
    ["monitor", "review", "leadership_discussion_recommended", "consensus_escalation"].includes(
      model.snapshot.consensusAttention.level
    )
  );
  assert.ok(model.consensusContext.sourceChain.includes("stakeholder_intelligence"));
  assert.ok(model.consensusContext.sourceChain.includes("policy_constraint"));
  assert.ok(model.consensusContext.sourceChain.includes("strategic_alignment"));
});

test("consensus evaluation layer maps alignment and conflict zones", () => {
  const model = resolveConsensusIntelligenceSurface(feedInput);
  const evaluation = evaluateConsensus(model.consensusContext);
  assert.equal(evaluation.alignmentZones.length, 4);
  assert.equal(evaluation.disagreementZones.length, 4);
});

test("accordion consensus_intelligence panel uses consensus_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const panel = runtime.panels.find((entry) => entry.panelType === "consensus_intelligence");
  assert.ok(panel);
  assert.equal(panel.bodySlot, "consensus_intelligence");
});

test("executive summary consumes consensus intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("consensus_intelligence"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("stakeholder, strategic, and policy integration via approved getters", () => {
  const model = resolveConsensusIntelligenceSurface(feedInput);
  assert.ok(model.consensusContext.stakeholder.impact.length > 0);
  assert.ok(model.consensusContext.policy.policyAlignment.length > 0);
  assert.ok(model.consensusContext.strategicAlignment.alignmentScore.length > 0);
  assert.ok(model.consensusContext.governance.governanceAlignment.length > 0);
});

test("consensus intelligence logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeConsensusIntelligenceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][ConsensusIntelligence]"));
    assert.ok(logs.includes("[Nexora][ConsensusLevel]"));
    assert.ok(logs.includes("[Nexora][AlignmentZone]"));
    assert.ok(logs.includes("[Nexora][DisagreementZone]"));
    assert.ok(logs.includes("[Nexora][Convergence]"));
    assert.ok(logs.includes("[Nexora][Divergence]"));
    assert.ok(logs.includes("[Nexora][InstitutionalTension]"));
    assert.ok(logs.includes("[Nexora][ConsensusConfidence]"));
    assert.ok(logs.includes("[Nexora][ConsensusAttention]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached snapshot", () => {
  const surface = resolveConsensusIntelligenceSurface(feedInput);
  const summary = getConsensusIntelligenceSnapshotForExecutiveSummary(feedInput);
  const stakeholder = getConsensusIntelligenceSnapshotForStakeholderIntelligence(feedInput);
  const strategic = getConsensusIntelligenceSnapshotForStrategicAlignment(feedInput);
  const policy = getConsensusIntelligenceSnapshotForPolicyIntelligence(feedInput);
  assert.equal(surface.snapshot.consensusLevel.level, summary.consensusLevel.level);
  assert.equal(summary.consensusLevel.level, stakeholder.consensusLevel.level);
  assert.equal(stakeholder.consensusLevel.level, strategic.consensusLevel.level);
  assert.equal(strategic.consensusLevel.level, policy.consensusLevel.level);
});

test("architecture freeze includes consensus intelligence surface", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.consensus_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
