import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_CONTEXT_AGGREGATION_VERSION,
  CANONICAL_ADVISORY_AGGREGATION_OWNER,
} from "./advisoryContextContract.ts";
import { ADVISORY_AGGREGATION_REGISTRY, listRegisteredAdvisorySources } from "./advisoryAggregationRegistry.ts";
import { generateAdvisoryContext } from "./advisoryContextGeneration.ts";
import {
  getAdvisoryContextForExecutiveSummary,
  initializeAdvisoryAggregationRuntime,
  resetAdvisoryAggregationRuntimeForTests,
  resolveAdvisoryContext,
} from "./advisoryAggregationRuntime.ts";
import { resetAdvisoryAggregationLoggingForTests } from "./advisoryAggregationLogging.ts";
import { aggregateExecutiveSummary } from "../../executiveSummary/executiveSummaryAggregation.ts";
import { aggregateExecutiveAdvisory } from "../executiveAdvisoryAggregation.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../../executiveSummary/executiveSummaryRuntime.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../executiveAdvisoryRuntime.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "../confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "../explainability/advisoryExplainabilityRuntime.ts";
import { runArchitectureFreezeValidationPass, resetArchitectureFreezeRuntimeForTests } from "../../../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetAdvisoryAggregationRuntimeForTests();
  resetAdvisoryAggregationLoggingForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("advisory aggregation contract is canonical", () => {
  assert.equal(CANONICAL_ADVISORY_AGGREGATION_OWNER, "advisoryAggregationRuntime");
  assert.equal(ADVISORY_CONTEXT_AGGREGATION_VERSION, "5.2.0");
});

test("aggregation registry lists five approved sources", () => {
  const sources = listRegisteredAdvisorySources();
  assert.equal(sources.length, 5);
  assert.equal(ADVISORY_AGGREGATION_REGISTRY.length, 5);
  assert.ok(sources.includes("operational"));
  assert.ok(sources.includes("war_room"));
});

test("context generation produces six advisory domains", () => {
  const context = generateAdvisoryContext({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(context.operational.health);
  assert.ok(context.risk.exposure);
  assert.ok(context.timeline.momentum);
  assert.ok(context.scenario.expectedImpact);
  assert.ok(context.warRoom.decisionFocus);
  assert.ok(context.metadata.reasoningTrace.sourceChain.length >= 5);
  assert.ok(context.metadata.auditTrail.chain.length >= 5);
  assert.equal(context.rankedInputs.length, 20);
  assert.ok(context.topPriority);
});

test("normalized inputs follow standardized contract", () => {
  const context = resolveAdvisoryContext({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const sample = context.operational.health;
  assert.ok(sample.source);
  assert.ok(sample.priority);
  assert.ok(sample.confidence);
  assert.ok(sample.impact);
  assert.ok(sample.timestamp);
  assert.ok(sample.explanation);
  assert.ok(typeof sample.score === "number");
});

test("executive advisory consumes advisory context not raw intelligence", () => {
  const model = aggregateExecutiveAdvisory({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(model.advisoryContext);
  assert.equal(model.advisoryContext.rankedInputs.length, 20);
  assert.ok(model.advisoryContext.metadata.auditTrail.summary.includes("Advisory Context"));
});

test("executive summary consumes advisory context feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("advisory_context"));
});

test("aggregation logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeAdvisoryAggregationRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][AdvisoryAggregation]"));
    assert.ok(logs.includes("[Nexora][AdvisoryNormalization]"));
    assert.ok(logs.includes("[Nexora][AdvisoryPriority]"));
    assert.ok(logs.includes("[Nexora][AdvisoryContext]"));
    assert.ok(logs.includes("[Nexora][ReasoningTrace]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes advisory context aggregation contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.advisory_context_aggregation");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
