import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_RISK_INTELLIGENCE_OWNER,
  CANONICAL_RISK_INTELLIGENCE_SURFACE_ID,
  RISK_INTELLIGENCE_SURFACE_VERSION,
} from "./riskIntelligenceContract.ts";
import { aggregateRiskIntelligence } from "./riskIntelligenceAggregation.ts";
import {
  getRiskIntelligenceSnapshotForExecutiveSummary,
  initializeRiskIntelligenceRuntime,
  resetRiskIntelligenceRuntimeForTests,
  resolveRiskIntelligenceSurface,
} from "./riskIntelligenceRuntime.ts";
import { resetRiskIntelligenceLoggingForTests } from "./riskIntelligenceLogging.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../executiveSummary/executiveSummaryRuntime.ts";
import { resetExecutiveSummaryLoggingForTests } from "../executiveSummary/executiveSummaryLogging.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetOperationalIntelligenceLoggingForTests } from "../operationalIntelligence/operationalIntelligenceLogging.ts";
import { getDashboardSurfaceEntry, resetDashboardSurfaceRegistryForTests } from "../dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionPanelCacheForTests } from "../dashboardAccordionContextPanels.ts";
import { initializeDashboardAccordionRuntime, resetDashboardAccordionRuntimeForTests } from "../dashboardAccordionRuntime.ts";
import { runArchitectureFreezeValidationPass } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";
import { resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetRiskIntelligenceRuntimeForTests();
  resetRiskIntelligenceLoggingForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetOperationalIntelligenceLoggingForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetExecutiveSummaryLoggingForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("risk intelligence contract is canonical", () => {
  assert.equal(CANONICAL_RISK_INTELLIGENCE_OWNER, "riskIntelligenceRuntime");
  assert.equal(CANONICAL_RISK_INTELLIGENCE_SURFACE_ID, "risk");
  assert.equal(RISK_INTELLIGENCE_SURFACE_VERSION, "4.3.0");
});

test("risk surface is registered as active", () => {
  const entry = getDashboardSurfaceEntry("risk");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "RiskIntelligenceSurface");
});

test("aggregation produces five risk domains from operational feed", () => {
  const model = aggregateRiskIntelligence({
    dashboardContext: "sources",
    normalizedContext: null,
    selectedObjectId: "obj-1",
  });
  assert.ok(model.contextSources.includes("operational"));
  assert.ok(model.snapshot.activeRisks.count >= 0);
  assert.ok(["low", "moderate", "high", "critical"].includes(model.snapshot.exposure.level));
  assert.ok(["improving", "stable", "worsening"].includes(model.snapshot.momentum.momentum));
  assert.ok(["low", "moderate", "high"].includes(model.snapshot.confidence.level));
  assert.ok(
    ["monitor", "review", "investigate", "immediate_attention"].includes(
      model.snapshot.executiveAttention.status
    )
  );
});

test("risk context elevates exposure and active risks", () => {
  const model = resolveRiskIntelligenceSurface({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  assert.equal(model.snapshot.exposure.level, "high");
  assert.ok(model.snapshot.activeRisks.count >= 1);
  assert.equal(model.snapshot.momentum.momentum, "worsening");
});

test("war room triggers immediate executive attention", () => {
  const model = resolveRiskIntelligenceSurface({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  assert.equal(model.snapshot.exposure.level, "critical");
  assert.equal(model.snapshot.executiveAttention.status, "immediate_attention");
});

test("accordion risk panel uses risk_intelligence body slot", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  const risk = runtime.panels.find((panel) => panel.panelType === "risk");
  assert.ok(risk);
  assert.equal(risk.bodySlot, "risk_intelligence");
});

test("executive summary consumes risk intelligence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  assert.ok(summary.aggregationSources.includes("risk"));
  const systemCard = summary.cards.find((card) => card.kind === "system_status");
  assert.ok(systemCard?.secondaryValue.includes("Risk exposure"));
});

test("risk logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeRiskIntelligenceRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][RiskIntelligence]"));
    assert.ok(logs.includes("[Nexora][ActiveRisk]"));
    assert.ok(logs.includes("[Nexora][RiskExposure]"));
    assert.ok(logs.includes("[Nexora][RiskMomentum]"));
    assert.ok(logs.includes("[Nexora][RiskConfidence]"));
    assert.ok(logs.includes("[Nexora][ExecutiveAttentionRequired]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("risk snapshot feed is available for executive summary", () => {
  const snapshot = getRiskIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  assert.ok(snapshot.activeRisks.topRisk.length > 0);
});

test("architecture freeze includes risk intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.risk_intelligence_surface");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
