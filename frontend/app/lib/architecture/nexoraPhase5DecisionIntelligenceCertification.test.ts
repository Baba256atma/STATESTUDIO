import test from "node:test";
import assert from "node:assert/strict";

import {
  emitPhase5DecisionIntelligenceCertification,
  resetPhase5DecisionIntelligenceCertificationForTests,
  runPhase5DecisionIntelligenceCertification,
} from "./nexoraPhase5DecisionIntelligenceCertification.ts";
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

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
  resetPhase5DecisionIntelligenceCertificationForTests();
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
});

test("phase 5 decision intelligence certification passes static acceptance gates", () => {
  const result = runPhase5DecisionIntelligenceCertification({ force: true });
  assert.ok(result.result === "PASS" || result.result === "PASS WITH WARNINGS");
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.clearedForPhase6, true);
  assert.equal(result.advisoryLayerCount, 6);
  assert.equal(result.gates.length, 12);
  assert.ok(result.dashboardContractCount >= 22);
});

test("emitPhase5DecisionIntelligenceCertification logs certification tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    emitPhase5DecisionIntelligenceCertification({ force: true });
    emitPhase5DecisionIntelligenceCertification({ force: true });
    assert.equal(logs.filter((label) => label === "[Nexora][Phase5Smoke]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][ExecutiveAdvisoryAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DecisionIntelligenceAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][AdvisoryIntegrationAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][Phase5Certification]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
