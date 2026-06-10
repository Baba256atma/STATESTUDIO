import test from "node:test";
import assert from "node:assert/strict";

import {
  emitPhase3DashboardCertification,
  resetPhase3DashboardCertificationForTests,
  runPhase3DashboardCertification,
} from "./nexoraPhase3DashboardCertification.ts";
import { resetArchitectureFreezeRuntimeForTests } from "./nexoraArchitectureFreezeRuntime.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboard/dashboardAccordionContextPanels.ts";
import { resetDashboardAccordionRuntimeForTests } from "../dashboard/dashboardAccordionRuntime.ts";
import { resetDashboardContextRouterForTests } from "../dashboard/dashboardContextRouter.ts";
import { resetDashboardPerformanceMetricsForTests } from "../dashboard/dashboardPerformanceMetrics.ts";

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
  resetPhase3DashboardCertificationForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetDashboardContextRouterForTests();
  resetDashboardPerformanceMetricsForTests();
});

test("phase 3 dashboard certification passes static acceptance gates", () => {
  const result = runPhase3DashboardCertification({ force: true });
  assert.ok(result.result === "PASS" || result.result === "PASS WITH WARNINGS");
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.clearedForPhase4, true);
});

test("emitPhase3DashboardCertification logs certification tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    emitPhase3DashboardCertification({ force: true });
    emitPhase3DashboardCertification({ force: true });
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardSmoke]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardSurfaceAudit]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardCertification]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][Phase3Certification]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
