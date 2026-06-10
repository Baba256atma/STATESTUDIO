import test from "node:test";
import assert from "node:assert/strict";

import {
  emitPhase4IntelligenceCertification,
  resetPhase4IntelligenceCertificationForTests,
  runPhase4IntelligenceCertification,
} from "./nexoraPhase4IntelligenceCertification.ts";
import { resetArchitectureFreezeRuntimeForTests } from "./nexoraArchitectureFreezeRuntime.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboard/dashboardAccordionContextPanels.ts";
import { resetDashboardAccordionRuntimeForTests } from "../dashboard/dashboardAccordionRuntime.ts";
import { resetDashboardContextRouterForTests } from "../dashboard/dashboardContextRouter.ts";
import { resetDashboardPerformanceMetricsForTests } from "../dashboard/dashboardPerformanceMetrics.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../dashboard/executiveSummary/executiveSummaryRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../dashboard/operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../dashboard/riskIntelligence/riskIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../dashboard/timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../dashboard/scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../dashboard/warRoomIntelligence/warRoomIntelligenceRuntime.ts";

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
  resetPhase4IntelligenceCertificationForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetDashboardContextRouterForTests();
  resetDashboardPerformanceMetricsForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
});

test("phase 4 intelligence certification passes static acceptance gates", () => {
  const result = runPhase4IntelligenceCertification({ force: true });
  assert.ok(result.result === "PASS" || result.result === "PASS WITH WARNINGS");
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.clearedForPhase5, true);
  assert.equal(result.intelligenceSurfaceCount, 6);
  assert.equal(result.gates.length, 11);
});

test("emitPhase4IntelligenceCertification logs certification tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    emitPhase4IntelligenceCertification({ force: true });
    emitPhase4IntelligenceCertification({ force: true });
    assert.equal(logs.filter((label) => label === "[Nexora][Phase4Smoke]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][IntelligenceSurfaceAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][SurfaceIntegrationAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][ExecutiveIntelligenceAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][Phase4Certification]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
