import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_EXPLAINABILITY_LAYER_VERSION,
  CANONICAL_ADVISORY_EXPLAINABILITY_OWNER,
} from "./advisoryExplainabilityContract.ts";
import { generateAdvisoryExplanation } from "./advisoryExplainabilityGeneration.ts";
import { buildExplainabilityVisualSummary } from "./advisoryExplainabilityVisual.ts";
import {
  getAdvisoryExplanationForExecutiveAdvisory,
  getAdvisoryExplanationForExecutiveSummary,
  getAdvisoryExplanationForWarRoom,
  initializeAdvisoryExplainabilityRuntime,
  resetAdvisoryExplainabilityRuntimeForTests,
} from "./advisoryExplainabilityRuntime.ts";
import { resetAdvisoryExplainabilityLoggingForTests } from "./advisoryExplainabilityLogging.ts";
import { generateAdvisoryContext } from "../aggregation/advisoryContextGeneration.ts";
import { evaluateAdvisoryConfidence } from "../confidence/advisoryConfidenceEvaluation.ts";
import { aggregateExecutiveAdvisory } from "../executiveAdvisoryAggregation.ts";
import { aggregateExecutiveSummary } from "../../executiveSummary/executiveSummaryAggregation.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "../confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryConfidenceLoggingForTests } from "../confidence/advisoryConfidenceLogging.ts";
import { resetAdvisoryAggregationRuntimeForTests } from "../aggregation/advisoryAggregationRuntime.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../executiveAdvisoryRuntime.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../../executiveSummary/executiveSummaryRuntime.ts";
import { runArchitectureFreezeValidationPass, resetArchitectureFreezeRuntimeForTests } from "../../../architecture/nexoraArchitectureFreezeRuntime.ts";

const feedInput = {
  dashboardContext: "war_room" as const,
  normalizedContext: null,
  timelineActive: true,
};

test.beforeEach(() => {
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryExplainabilityLoggingForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryConfidenceLoggingForTests();
  resetAdvisoryAggregationRuntimeForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("explainability contract is canonical", () => {
  assert.equal(CANONICAL_ADVISORY_EXPLAINABILITY_OWNER, "advisoryExplainabilityRuntime");
  assert.equal(ADVISORY_EXPLAINABILITY_LAYER_VERSION, "5.4.0");
});

test("explainability generates six domains", () => {
  const context = generateAdvisoryContext(feedInput);
  const confidence = evaluateAdvisoryConfidence(
    { advisoryContext: context, dashboardContext: "war_room" },
    null
  );
  const bundle = generateAdvisoryExplanation({
    advisoryContext: context,
    confidenceEvaluation: confidence,
    dashboardContext: "war_room",
  });

  assert.ok(bundle.guidance.executiveSummary.length > 0);
  assert.equal(bundle.supportingEvidence.operational.length, 4);
  assert.equal(bundle.supportingEvidence.warRoom.length, 4);
  assert.ok(bundle.reasoningPath.pathLabel.includes("↓"));
  assert.ok(bundle.assumptionsAndUnknowns.entries.length >= 0);
});

test("executive advisory consumes explanation bundle", () => {
  const model = aggregateExecutiveAdvisory(feedInput);
  assert.ok(model.explanationBundle.guidance.whyThisGuidance.length > 0);
  assert.ok(model.explanationBundle.reasoningPath.steps.length >= 1);
});

test("executive summary consumes explainability feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "timeline",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("advisory_explainability"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("war room consumes explainability feed", () => {
  const bundle = getAdvisoryExplanationForWarRoom(feedInput);
  assert.ok(bundle.supportingEvidence.warRoom.length >= 1);
  assert.ok(bundle.reasoningPath.pathLabel.length > 0);
});

test("explainability visual summary exposes cards", () => {
  const bundle = getAdvisoryExplanationForExecutiveAdvisory(feedInput);
  const visual = buildExplainabilityVisualSummary(bundle);
  assert.equal(visual.guidanceCard.domain, "guidance_explanation");
  assert.equal(visual.evidenceCard.domain, "supporting_evidence");
  assert.equal(visual.reasoningCard.domain, "reasoning_path");
});

test("explainability logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeAdvisoryExplainabilityRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][AdvisoryExplainability]"));
    assert.ok(logs.includes("[Nexora][GuidanceExplanation]"));
    assert.ok(logs.includes("[Nexora][SupportingEvidence]"));
    assert.ok(logs.includes("[Nexora][ConfidenceDriver]"));
    assert.ok(logs.includes("[Nexora][ConfidenceLimiter]"));
    assert.ok(logs.includes("[Nexora][ReasoningPath]"));
    assert.ok(logs.includes("[Nexora][Assumption]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("approved getters share cached bundle", () => {
  const advisory = getAdvisoryExplanationForExecutiveAdvisory(feedInput);
  const summary = getAdvisoryExplanationForExecutiveSummary(feedInput);
  assert.equal(advisory.reasoningPath.pathLabel, summary.reasoningPath.pathLabel);
});

test("architecture freeze includes advisory explainability layer", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.advisory_explainability_layer");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
