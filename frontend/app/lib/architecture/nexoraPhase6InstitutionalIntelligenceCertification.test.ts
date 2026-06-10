import test from "node:test";
import assert from "node:assert/strict";

import {
  emitPhase6InstitutionalIntelligenceCertification,
  resetPhase6InstitutionalIntelligenceCertificationForTests,
  runPhase6InstitutionalIntelligenceCertification,
} from "./nexoraPhase6InstitutionalIntelligenceCertification.ts";
import { resetArchitectureFreezeRuntimeForTests } from "./nexoraArchitectureFreezeRuntime.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboard/dashboardAccordionContextPanels.ts";
import { resetDashboardAccordionRuntimeForTests } from "../dashboard/dashboardAccordionRuntime.ts";
import { resetDashboardPerformanceMetricsForTests } from "../dashboard/dashboardPerformanceMetrics.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../dashboard/executiveSummary/executiveSummaryRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../dashboard/operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../dashboard/riskIntelligence/riskIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../dashboard/timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../dashboard/scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../dashboard/warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetAdvisoryAggregationRuntimeForTests } from "../dashboard/executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "../dashboard/executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "../dashboard/executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../dashboard/executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resetDecisionGuidanceRuntimeForTests } from "../dashboard/decisionGuidance/decisionGuidanceRuntime.ts";
import { resetAdvisoryWarRoomIntegrationRuntimeForTests } from "../dashboard/advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";
import { resetGovernanceIntelligenceRuntimeForTests } from "../dashboard/governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resetStrategicAlignmentRuntimeForTests } from "../dashboard/strategicAlignment/strategicAlignmentRuntime.ts";
import { resetPolicyConstraintIntelligenceRuntimeForTests } from "../dashboard/policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { resetStakeholderIntelligenceRuntimeForTests } from "../dashboard/stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { resetConsensusIntelligenceRuntimeForTests } from "../dashboard/consensusIntelligence/consensusIntelligenceRuntime.ts";
import { resetInstitutionalAlignmentRuntimeForTests } from "../dashboard/institutionalAlignment/institutionalAlignmentRuntime.ts";

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
  resetPhase6InstitutionalIntelligenceCertificationForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetDashboardPerformanceMetricsForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetAdvisoryAggregationRuntimeForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetDecisionGuidanceRuntimeForTests();
  resetAdvisoryWarRoomIntegrationRuntimeForTests();
  resetGovernanceIntelligenceRuntimeForTests();
  resetStrategicAlignmentRuntimeForTests();
  resetPolicyConstraintIntelligenceRuntimeForTests();
  resetStakeholderIntelligenceRuntimeForTests();
  resetConsensusIntelligenceRuntimeForTests();
  resetInstitutionalAlignmentRuntimeForTests();
});

test("phase 6 institutional intelligence certification passes static acceptance gates", () => {
  const result = runPhase6InstitutionalIntelligenceCertification({ force: true });
  assert.ok(result.result === "PASS" || result.result === "PASS WITH WARNINGS");
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.clearedForPhase7, true);
  assert.equal(result.institutionalLayerCount, 6);
  assert.equal(result.gates.length, 12);
  assert.ok(result.dashboardContractCount >= 28);
});

test("emitPhase6InstitutionalIntelligenceCertification logs certification tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    emitPhase6InstitutionalIntelligenceCertification({ force: true });
    emitPhase6InstitutionalIntelligenceCertification({ force: true });
    assert.equal(logs.filter((label) => label === "[Nexora][Phase6Smoke]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][InstitutionalAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][StrategicAlignmentAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][ConsensusAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][InstitutionalSurfaceAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][Phase6Certification]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
