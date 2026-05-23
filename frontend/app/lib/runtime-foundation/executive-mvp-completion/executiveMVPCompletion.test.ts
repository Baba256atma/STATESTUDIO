import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessPublishReadiness,
  buildCompletionEvidenceRegistry,
  buildMVPCompletionScorecard,
  certifyExecutiveIntelligence,
  evaluateExecutiveMVPCompletion,
  generatePublicationRecommendation,
  validateExecutiveMVPCompletionResult,
  verifyExecutiveCapabilities,
  verifyFinalGovernance,
} from "./index.ts";
import {
  createFeedbackCaptureRegistry,
  evaluateExecutiveFeedbackLearningLoop,
  registerExecutiveFeedback,
} from "../executive-feedback-loop/index.ts";
import { buildExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import { evaluateExecutiveFinalHardening } from "../executive-final-hardening/index.ts";
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
import type { ExecutiveMVPCompletionInput } from "./index.ts";
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

function completionInput(now = 8_000_000): ExecutiveMVPCompletionInput {
  const organizationId = "d10-completion-org";
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
        recommendation: "Proceed with final MVP completion review.",
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
  const finalHardening = evaluateExecutiveFinalHardening({
    organizationId,
    dashboard,
    validationSuite,
    launchGate,
    demoPresentation,
    feedbackLearning,
    now,
  });

  return {
    organizationId,
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    dashboard,
    validationSuite,
    launchGate,
    demoPresentation,
    feedbackLearning,
    finalHardening,
    now,
  };
}

describe("D10 final MVP completion", () => {
  it("builds traceable completion evidence and governance verification", () => {
    const input = completionInput();
    const evidence = buildCompletionEvidenceRegistry(input);
    const governance = verifyFinalGovernance(input);

    assert.equal(evidence.length >= 8, true);
    assert.equal(evidence.every((item) => item.signature.length > 0), true);
    assert.equal(governance.missingElements.length, 0);
  });

  it("verifies executive capabilities and scorecard", () => {
    const input = completionInput();
    const capabilities = verifyExecutiveCapabilities(input);
    const scorecard = buildMVPCompletionScorecard(input, capabilities);

    assert.equal(capabilities.length, 8);
    assert.equal(capabilities.every((capability) => capability.ready), true);
    assert.equal(scorecard.completionScore > 0.75, true);
    assert.equal(scorecard.publicationConfidence > 0.75, true);
  });

  it("generates publish assessments and recommendation", () => {
    const input = completionInput();
    const capabilities = verifyExecutiveCapabilities(input);
    const scorecard = buildMVPCompletionScorecard(input, capabilities);
    const result = evaluateExecutiveMVPCompletion(input);
    const assessments = assessPublishReadiness(scorecard, result.risks);
    const recommendation = generatePublicationRecommendation({ scorecard, assessments, risks: result.risks });

    assert.equal(assessments.length, 5);
    assert.equal(["publish_MVP", "controlled_release", "pilot_first"].includes(recommendation), true);
    assert.equal(result.advisoryOnly, true);
  });

  it("certifies executive intelligence behavior from evidence", () => {
    const input = completionInput();
    const capabilities = verifyExecutiveCapabilities(input);
    const scorecard = buildMVPCompletionScorecard(input, capabilities);
    const certification = certifyExecutiveIntelligence(input, scorecard);

    assert.equal(certification.reliability, true);
    assert.equal(certification.explainability, true);
    assert.equal(certification.certified, true);
  });

  it("creates final dashboard, risks, and executive publication summary", () => {
    const result = evaluateExecutiveMVPCompletion(completionInput());

    assert.equal(validateExecutiveMVPCompletionResult(result), true);
    assert.equal(["MVP_complete", "publish_ready", "feature_complete"].includes(result.state), true);
    assert.equal(result.dashboard.executiveRecommendations.length > 0, true);
    assert.equal(result.summary.verifiedStrengths.length > 0, true);
  });

  it("detects missing governance and blocks inflated publication claims", () => {
    const input = completionInput();
    const partial = {
      ...input,
      validationSuite: null,
      finalHardening: null,
    };
    const result = evaluateExecutiveMVPCompletion(partial);

    assert.equal(result.governance.missingElements.includes("validationEvaluationsExist"), true);
    assert.equal(result.governance.missingElements.includes("hardeningEvaluationsExist"), true);
    assert.notEqual(result.recommendation, "publish_MVP");
    assert.notEqual(result.state, "publish_ready");
  });

  it("tracks completion trend and keeps outputs deterministic", () => {
    const input = {
      ...completionInput(8_000_500),
      previousTrendPoints: [
        {
          generatedAt: 7_999_000,
          readinessScore: 0.55,
          trustScore: 0.55,
          validationScore: 0.55,
          stabilityScore: 0.55,
          completionScore: 0.55,
        },
      ],
    };
    const first = evaluateExecutiveMVPCompletion(input);
    const second = evaluateExecutiveMVPCompletion(input);

    assert.equal(first.trend.completionProgression, "improving");
    assert.equal(first.signature, second.signature);
    assert.deepEqual(first.dashboard, second.dashboard);
  });
});
