import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessProductionHardening,
  auditUXConsistency,
  buildProductionReviewRegistry,
  classifyProductionCandidate,
  evaluateExecutiveFinalHardening,
  generateHardeningRecommendations,
  validateExecutiveFinalHardeningResult,
  verifyRuntimeReliability,
} from "./index.ts";
import {
  createFeedbackCaptureRegistry,
  evaluateExecutiveFeedbackLearningLoop,
  registerExecutiveFeedback,
} from "../executive-feedback-loop/index.ts";
import { buildExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import { evaluateExecutiveLaunchGate } from "../executive-launch-gate/index.ts";
import { buildExecutiveReadinessDashboard } from "../executive-readiness-dashboard/index.ts";
import { runExecutiveValidationSuite } from "../executive-validation/index.ts";
import { buildExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import {
  buildExecutiveReadinessSnapshot,
  buildRuntimeReadinessRegistry,
} from "../strategic-readiness/index.ts";
import {
  buildExecutiveInteractionStabilitySnapshot,
  createExecutiveInteractionContext,
} from "../interaction-stability/index.ts";
import type { ExecutiveFinalHardeningInput } from "./index.ts";
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

function cleanInput(now = 7_000_000): ExecutiveFinalHardeningInput {
  const organizationId = "d10-hardening-org";
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
        recommendation: "Proceed with final hardening review.",
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
    context: { organizationId, readinessRegistry, readinessSnapshot, reliabilitySnapshot, interactionSnapshot, dashboard },
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
    requestedJourneyIds: ["platform_overview", "fragility_analysis", "scenario_simulation", "executive_decision_support"],
    activeJourneyId: "platform_overview",
    dashboard,
    validationSuite,
    launchGate,
    now,
  });
  let registry = createFeedbackCaptureRegistry(organizationId, now);
  registry = registerExecutiveFeedback(registry, {
    type: "strategic_insight",
    source: "executive",
    authorRole: "COO",
    summary: "Recommendation rationale creates trust in executive decision support.",
    relatedWorkflow: "executive_decision_support",
    tags: ["trust", "recommendation"],
    dimensions: { trustworthiness: 0.92, explainability: 0.91, decisionUsefulness: 0.9, clarity: 0.86 },
    now,
  });
  const feedbackLearning = evaluateExecutiveFeedbackLearningLoop({
    organizationId,
    registry,
    dashboard,
    validationSuite,
    launchGate,
    demoPresentation,
    now,
  });

  return { organizationId, dashboard, validationSuite, launchGate, demoPresentation, feedbackLearning, now };
}

describe("D10 executive final hardening", () => {
  it("generates the production review registry and checklist", () => {
    const input = cleanInput();
    const registry = buildProductionReviewRegistry(input);
    const result = evaluateExecutiveFinalHardening(input);

    assert.equal(registry.items.length, 9);
    assert.equal(result.checklist.length, 9);
    assert.equal(result.checklist.every((item) => item.signature.length > 0), true);
  });

  it("verifies runtime reliability and audits UX consistency", () => {
    const input = cleanInput();
    const reliability = verifyRuntimeReliability(input);
    const audit = auditUXConsistency(input);

    assert.equal(reliability.workflowContinuity, "verified");
    assert.equal(reliability.recommendationConsistency, "verified");
    assert.equal(audit.workflowConsistency, "verified");
    assert.equal(audit.findings.length >= 0, true);
  });

  it("creates hardening assessment, risk inventory, and recommendations", () => {
    const input = cleanInput();
    const degraded = {
      ...input,
      demoPresentation: {
        ...input.demoPresentation!,
        safety: { ...input.demoPresentation!.safety, safeToPresent: false },
      },
    };
    const assessment = assessProductionHardening(degraded);
    const result = evaluateExecutiveFinalHardening(degraded);
    const recommendations = generateHardeningRecommendations(result.riskInventory);

    assert.equal(assessment.unstablePaths.includes("executive_demo_path"), true);
    assert.equal(result.riskInventory.length > 0, true);
    assert.equal(recommendations.every((rec) => rec.advisoryOnly), true);
  });

  it("classifies production candidate posture deterministically", () => {
    const result = evaluateExecutiveFinalHardening(cleanInput());
    const classification = classifyProductionCandidate({
      checklist: result.checklist,
      risks: result.riskInventory,
      verifiedExecutiveCount: result.executiveVerification.verifiedCount,
    });

    assert.equal(classification, result.classification);
    assert.equal(["production_candidate", "publication_ready", "nearly_ready"].includes(result.classification), true);
  });

  it("generates executive summary and hardening trends", () => {
    const result = evaluateExecutiveFinalHardening({
      ...cleanInput(),
      previousTrendPoints: [
        {
          generatedAt: 6_999_000,
          stabilityScore: 0.5,
          readinessScore: 0.6,
          trustScore: 0.5,
          validationScore: 0.6,
          issueCount: 4,
        },
      ],
    });

    assert.equal(result.summary.headline.length > 0, true);
    assert.equal(result.summary.verified.length > 0, true);
    assert.equal(result.trend.points.length, 2);
    assert.equal(result.trend.issueReduction, "improving");
  });

  it("keeps final hardening outputs deterministic", () => {
    const input = cleanInput(7_000_500);
    const first = evaluateExecutiveFinalHardening(input);
    const second = evaluateExecutiveFinalHardening(input);

    assert.equal(validateExecutiveFinalHardeningResult(first), true);
    assert.equal(first.signature, second.signature);
    assert.deepEqual(first.summary, second.summary);
  });
});
