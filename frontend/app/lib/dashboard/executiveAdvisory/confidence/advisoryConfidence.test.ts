import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_CONFIDENCE_FRAMEWORK_VERSION,
  CANONICAL_ADVISORY_CONFIDENCE_OWNER,
} from "./advisoryConfidenceContract.ts";
import {
  evaluateAdvisoryConfidence,
  evaluateEvidenceCoverage,
  evaluateSourceDiversity,
} from "./advisoryConfidenceEvaluation.ts";
import { buildConfidenceVisualSummary } from "./advisoryConfidenceVisual.ts";
import {
  getAdvisoryConfidenceForExecutiveAdvisory,
  getAdvisoryConfidenceForExecutiveSummary,
  initializeAdvisoryConfidenceRuntime,
  resetAdvisoryConfidenceRuntimeForTests,
} from "./advisoryConfidenceRuntime.ts";
import { resetAdvisoryConfidenceLoggingForTests } from "./advisoryConfidenceLogging.ts";
import { generateAdvisoryContext } from "../aggregation/advisoryContextGeneration.ts";
import { aggregateExecutiveAdvisory } from "../executiveAdvisoryAggregation.ts";
import { aggregateExecutiveSummary } from "../../executiveSummary/executiveSummaryAggregation.ts";
import { resetAdvisoryAggregationRuntimeForTests } from "../aggregation/advisoryAggregationRuntime.ts";
import { resetAdvisoryAggregationLoggingForTests } from "../aggregation/advisoryAggregationLogging.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "../explainability/advisoryExplainabilityRuntime.ts";
import { resetAdvisoryExplainabilityLoggingForTests } from "../explainability/advisoryExplainabilityLogging.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../executiveAdvisoryRuntime.ts";
import { resetExecutiveAdvisoryLoggingForTests } from "../executiveAdvisoryLogging.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../../executiveSummary/executiveSummaryRuntime.ts";
import { runArchitectureFreezeValidationPass, resetArchitectureFreezeRuntimeForTests } from "../../../architecture/nexoraArchitectureFreezeRuntime.ts";

const feedInput = {
  dashboardContext: "timeline" as const,
  normalizedContext: null,
  timelineActive: true,
};

test.beforeEach(() => {
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryConfidenceLoggingForTests();
  resetAdvisoryAggregationRuntimeForTests();
  resetAdvisoryAggregationLoggingForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryExplainabilityLoggingForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetExecutiveAdvisoryLoggingForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("confidence framework contract is canonical", () => {
  assert.equal(CANONICAL_ADVISORY_CONFIDENCE_OWNER, "advisoryConfidenceRuntime");
  assert.equal(ADVISORY_CONFIDENCE_FRAMEWORK_VERSION, "5.3.0");
});

test("confidence evaluation produces six domains", () => {
  const context = generateAdvisoryContext({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  const evaluation = evaluateAdvisoryConfidence(
    { advisoryContext: context, dashboardContext: "war_room" },
    null
  );

  assert.ok(["sparse", "partial", "strong"].includes(evaluation.coverage.level));
  assert.ok(["conflicting", "mixed", "consistent"].includes(evaluation.consistency.level));
  assert.ok(["stale", "recent", "current"].includes(evaluation.freshness.level));
  assert.ok(["single_source", "few_sources", "multiple_sources"].includes(evaluation.diversity.level));
  assert.ok(["unstable", "moderately_stable", "stable"].includes(evaluation.stability.level));
  assert.ok(["low", "moderate", "high", "very_high"].includes(evaluation.overall.level));
  assert.ok(evaluation.explanation.confidenceDrivers.length >= 0);
  assert.ok(evaluation.explanation.supportingEvidence.length >= 1);
});

test("source diversity increases with cross-surface inputs", () => {
  const context = generateAdvisoryContext({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const diversity = evaluateSourceDiversity(context);
  assert.ok(diversity.supportingDomains.length >= 4);
  assert.equal(diversity.level, "multiple_sources");
});

test("coverage evaluation classifies evidence strength", () => {
  const context = generateAdvisoryContext({
    dashboardContext: "risk",
    normalizedContext: null,
  });
  const coverage = evaluateEvidenceCoverage(context);
  assert.ok(coverage.signalCount > 0);
  assert.ok(coverage.summary.includes("advisory inputs"));
});

test("executive advisory consumes confidence framework", () => {
  const model = aggregateExecutiveAdvisory({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.equal(model.confidenceEvaluation.overall.label, model.snapshot.confidence.label);
  assert.ok(model.confidenceEvaluation.explanation.summary.length > 0);
});

test("executive summary consumes advisory confidence feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("advisory_confidence"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("confidence visual summary exposes executive indicators", () => {
  const evaluation = getAdvisoryConfidenceForExecutiveAdvisory(feedInput);
  const visual = buildConfidenceVisualSummary(evaluation);
  assert.ok(visual.badge.label.length > 0);
  assert.equal(visual.domainIndicators.length, 5);
});

test("confidence logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeAdvisoryConfidenceRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][AdvisoryConfidence]"));
    assert.ok(logs.includes("[Nexora][EvidenceCoverage]"));
    assert.ok(logs.includes("[Nexora][EvidenceConsistency]"));
    assert.ok(logs.includes("[Nexora][EvidenceFreshness]"));
    assert.ok(logs.includes("[Nexora][SourceDiversity]"));
    assert.ok(logs.includes("[Nexora][ReasoningStability]"));
    assert.ok(logs.includes("[Nexora][ConfidenceAggregation]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached evaluation", () => {
  const advisory = getAdvisoryConfidenceForExecutiveAdvisory(feedInput);
  const summary = getAdvisoryConfidenceForExecutiveSummary(feedInput);
  assert.equal(advisory.overall.level, summary.overall.level);
});

test("architecture freeze includes advisory confidence framework", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.advisory_confidence_framework");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
