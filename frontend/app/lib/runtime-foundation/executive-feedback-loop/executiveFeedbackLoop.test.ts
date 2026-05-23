import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessFeedbackPriorities,
  classifyFeedbackItems,
  createFeedbackCaptureRegistry,
  detectLearningPatterns,
  evaluateExecutiveFeedbackLearningLoop,
  generatePilotInsightSummary,
  generateProductImprovementRecommendations,
  registerExecutiveFeedback,
  validateExecutiveFeedbackLearningResult,
  validateFeedbackCaptureRegistry,
} from "./index.ts";
import { buildExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import { evaluateExecutiveLaunchGate } from "../executive-launch-gate/index.ts";
import {
  buildExecutiveReadinessSnapshot,
  buildRuntimeReadinessRegistry,
} from "../strategic-readiness/index.ts";
import { buildExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import {
  buildExecutiveInteractionStabilitySnapshot,
  createExecutiveInteractionContext,
} from "../interaction-stability/index.ts";
import { buildExecutiveReadinessDashboard } from "../executive-readiness-dashboard/index.ts";
import { runExecutiveValidationSuite } from "../executive-validation/index.ts";
import type { ExecutiveFeedbackLearningInput, FeedbackCaptureRegistry } from "./index.ts";
import type { RuntimeReadinessInput } from "../strategic-readiness/index.ts";

const dimensions = Object.fromEntries(
  [
    "development_status",
    "test_status",
    "runtime_stability",
    "integration_status",
    "deployment_status",
    "ux_readiness",
    "executive_readiness",
    "operational_readiness",
  ].map((dimension) => [
    dimension,
    { state: "ready", confidence: 0.92, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["dimensions"];

const features = Object.fromEntries(
  [
    "ingestion",
    "mapping",
    "fragility",
    "simulation",
    "decision_intelligence",
    "executive_panels",
    "scenario_workflows",
    "connectors",
    "chat_intelligence",
  ].map((featureId) => [
    featureId,
    { readinessState: "ready", confidence: 0.9, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["features"];

function registry(now = 6_000_000): FeedbackCaptureRegistry {
  let current = createFeedbackCaptureRegistry("d10-feedback-org", now);
  current = registerExecutiveFeedback(current, {
    type: "usability_concern",
    source: "executive",
    authorRole: "COO",
    summary: "Dashboard navigation is confusing during the pilot walkthrough.",
    detail: "The executive could not tell which readiness score should be trusted first.",
    relatedWorkflow: "readiness_dashboard",
    tags: ["dashboard", "navigation"],
    dimensions: {
      usability: 0.82,
      clarity: 0.78,
      dashboardEffectiveness: 0.84,
      trustworthiness: 0.72,
      decisionUsefulness: 0.68,
    },
    now,
  });
  current = registerExecutiveFeedback(current, {
    type: "issue",
    source: "pilot_user",
    authorRole: "Operations lead",
    summary: "Dashboard navigation is confusing when moving from readiness to trust.",
    detail: "The same concern appeared in the second pilot review.",
    relatedWorkflow: "readiness_dashboard",
    tags: ["dashboard", "navigation"],
    dimensions: {
      usability: 0.76,
      clarity: 0.74,
      dashboardEffectiveness: 0.8,
      trustworthiness: 0.7,
      workflowQuality: 0.72,
    },
    now: now + 1,
  });
  current = registerExecutiveFeedback(current, {
    type: "strategic_insight",
    source: "stakeholder",
    authorRole: "VP Strategy",
    summary: "Recommendation rationale creates trust in executive decision support.",
    detail: "The explanation of alternatives was the most valuable part of the demo.",
    relatedWorkflow: "executive_decision_support",
    tags: ["recommendation", "trust"],
    dimensions: {
      trustworthiness: 0.92,
      explainability: 0.9,
      decisionUsefulness: 0.94,
      clarity: 0.86,
      workflowQuality: 0.82,
    },
    now: now + 2,
  });
  current = registerExecutiveFeedback(current, {
    type: "enhancement_request",
    source: "internal_reviewer",
    authorRole: "Product",
    summary: "Pilot users want a guided onboarding path before simulation.",
    detail: "Add a simple guided first-run path for scenario simulation.",
    relatedWorkflow: "scenario_simulation",
    tags: ["onboarding", "simulation"],
    dimensions: {
      usability: 0.8,
      simulationUsefulness: 0.88,
      workflowQuality: 0.82,
      clarity: 0.78,
    },
    now: now + 3,
  });
  return current;
}

function learningInput(now = 6_000_000): ExecutiveFeedbackLearningInput {
  const organizationId = "d10-feedback-org";
  const readinessRegistry = buildRuntimeReadinessRegistry({
    organizationId,
    dimensions,
    features,
    runtimeChecks: [{ id: "runtime", label: "Runtime", health: "healthy", summary: "Runtime is healthy." }],
    now,
  });
  const readinessSnapshot = buildExecutiveReadinessSnapshot(readinessRegistry);
  const reliabilitySnapshot = buildExecutiveReliabilitySnapshot({
    organizationId,
    readinessRegistry,
    artifacts: [
      {
        artifactId: "recommendation",
        sourceType: "decision_recommendation",
        title: "Decision recommendation",
        conclusion: "Ready and stable.",
        recommendation: "Proceed with controlled pilot learning.",
        confidenceScore: 0.91,
        validationState: "valid",
        generatedAt: now,
        supportingFactors: ["Readiness, trust, validation, and stability evidence align."],
        contractValid: true,
        executionChainComplete: true,
      },
    ],
    validationResults: [{ checkId: "trust", label: "Trust", state: "stable", confidence: 0.92, reason: "Trust is stable." }],
    confidenceSignals: [{ signalId: "confidence", confidenceScore: 0.9, label: "Confidence" }],
    panelContractValid: true,
    sceneSynchronized: true,
    now,
  });
  const context = createExecutiveInteractionContext({
    selectedObjectId: "obj-1",
    focusedObjectId: "obj-1",
    activePanel: "executive",
    activeWorkflow: "simulation",
    simulationContextId: "sim-1",
    decisionContextId: "decision-1",
    executiveInvestigationId: "investigation-1",
    updatedAt: now,
  });
  const interactionSnapshot = buildExecutiveInteractionStabilitySnapshot({
    organizationId,
    previousContext: context,
    nextContext: { activePanel: "executive", updatedAt: now },
    events: [],
    now,
  });
  const dashboard = buildExecutiveReadinessDashboard({
    organizationId,
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    now,
  });
  const validationSuite = runExecutiveValidationSuite({
    context: {
      organizationId,
      readinessRegistry,
      readinessSnapshot,
      reliabilitySnapshot,
      interactionSnapshot,
      dashboard,
    },
    now,
  });
  const launchGate = evaluateExecutiveLaunchGate({
    organizationId,
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    dashboard,
    validationSuite,
    now,
  });
  const demoPresentation = buildExecutiveDemoModePresentation({
    organizationId,
    mode: "pilot_mode",
    audience: "pilot_participant",
    activeJourneyId: "platform_overview",
    dashboard,
    validationSuite,
    launchGate,
    now,
  });

  return {
    organizationId,
    registry: registry(now),
    dashboard,
    validationSuite,
    launchGate,
    demoPresentation,
    now,
  };
}

describe("D10 executive feedback learning loop", () => {
  it("registers feedback deterministically and deduplicates repeated captures", () => {
    const first = registry();
    const duplicate = registerExecutiveFeedback(first, {
      type: "usability_concern",
      source: "executive",
      authorRole: "COO",
      summary: "Dashboard navigation is confusing during the pilot walkthrough.",
      detail: "The executive could not tell which readiness score should be trusted first.",
      relatedWorkflow: "readiness_dashboard",
      tags: ["dashboard", "navigation"],
      dimensions: { usability: 0.82, clarity: 0.78, dashboardEffectiveness: 0.84, trustworthiness: 0.72, decisionUsefulness: 0.68 },
      now: 6_000_000,
    });

    assert.equal(validateFeedbackCaptureRegistry(first), true);
    assert.equal(duplicate.feedback.length, first.feedback.length);
    assert.equal(first.signature, duplicate.signature);
  });

  it("classifies feedback by deterministic product learning category", () => {
    const current = registry();
    const classifications = classifyFeedbackItems(current.feedback);

    assert.equal(classifications.length, current.feedback.length);
    assert.equal(classifications.some((item) => item.category === "dashboard"), true);
    assert.equal(classifications.some((item) => item.category === "operational_intelligence" || item.category === "trust"), true);
  });

  it("calculates transparent feedback priorities", () => {
    const current = registry();
    const classifications = classifyFeedbackItems(current.feedback);
    const priorities = assessFeedbackPriorities(current.feedback, classifications);

    assert.equal(priorities.length, current.feedback.length);
    assert.equal(priorities[0]!.score >= priorities[priorities.length - 1]!.score, true);
    assert.equal(priorities.every((priority) => priority.recommendation.length > 0), true);
  });

  it("detects recurring learning patterns", () => {
    const current = registry();
    const classifications = classifyFeedbackItems(current.feedback);
    const patterns = detectLearningPatterns(current.feedback, classifications);

    assert.equal(patterns.length > 0, true);
    assert.equal(patterns.some((pattern) => pattern.occurrenceCount >= 2 || pattern.label.includes("dashboard")), true);
  });

  it("generates pilot insights and improvement recommendations", () => {
    const current = registry();
    const classifications = classifyFeedbackItems(current.feedback);
    const priorities = assessFeedbackPriorities(current.feedback, classifications);
    const patterns = detectLearningPatterns(current.feedback, classifications);
    const insights = generatePilotInsightSummary(patterns, priorities);
    const recommendations = generateProductImprovementRecommendations(patterns, priorities);

    assert.equal(insights.whatUsersTellUs.length > 0, true);
    assert.equal(insights.improveFirst.length > 0, true);
    assert.equal(recommendations.every((recommendation) => recommendation.advisoryOnly), true);
  });

  it("builds success evaluation and executive learning dashboard", () => {
    const result = evaluateExecutiveFeedbackLearningLoop(learningInput());

    assert.equal(validateExecutiveFeedbackLearningResult(result), true);
    assert.equal(["successful", "highly_successful"].includes(result.success.evaluation), true);
    assert.equal(result.dashboard.pilotRecommendations.length > 0, true);
    assert.equal(result.dashboard.highestPriorityIssues.length > 0, true);
  });

  it("tracks runtime feedback trends", () => {
    const input = learningInput();
    const result = evaluateExecutiveFeedbackLearningLoop({
      ...input,
      previousTrendPoints: [
        {
          generatedAt: 5_999_000,
          feedbackVolume: 1,
          recurringIssues: 0,
          recurringRequests: 0,
          trustObservations: 0,
          executiveSatisfaction: 0.5,
        },
      ],
    });

    assert.equal(result.dashboard.trend.points.length, 2);
    assert.equal(result.dashboard.trend.volumeTrend, "increasing");
  });

  it("keeps learning outputs deterministic", () => {
    const input = learningInput(6_000_500);
    const first = evaluateExecutiveFeedbackLearningLoop(input);
    const second = evaluateExecutiveFeedbackLearningLoop(input);

    assert.equal(first.signature, second.signature);
    assert.deepEqual(first.dashboard.insightSummary, second.dashboard.insightSummary);
    assert.deepEqual(first.recommendations, second.recommendations);
  });
});
