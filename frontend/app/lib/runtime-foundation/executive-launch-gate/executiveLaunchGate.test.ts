import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  aggregateLaunchEvidence,
  classifyLaunchGovernance,
  detectLaunchBlockers,
  evaluateExecutiveLaunchGate,
  generateLaunchRecommendation,
  prioritizeReadinessRisks,
  validateExecutiveLaunchGateResult,
} from "./index.ts";
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
import type { ExecutiveLaunchGateInput } from "./index.ts";
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

function cleanInput(now = 4_000_000): ExecutiveLaunchGateInput {
  const readinessRegistry = buildRuntimeReadinessRegistry({
    organizationId: "d10-launch-org",
    dimensions,
    features,
    runtimeChecks: [{ id: "runtime", label: "Runtime", health: "healthy", summary: "Runtime is healthy." }],
    now,
  });
  const readinessSnapshot = buildExecutiveReadinessSnapshot(readinessRegistry);
  const reliabilitySnapshot = buildExecutiveReliabilitySnapshot({
    organizationId: "d10-launch-org",
    readinessRegistry,
    artifacts: [
      {
        artifactId: "recommendation",
        sourceType: "decision_recommendation",
        title: "Decision recommendation",
        conclusion: "Ready and stable.",
        recommendation: "Proceed with controlled execution.",
        confidenceScore: 0.9,
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
    organizationId: "d10-launch-org",
    previousContext: context,
    nextContext: { activePanel: "executive", updatedAt: now },
    events: [],
    now,
  });
  const dashboard = buildExecutiveReadinessDashboard({
    organizationId: "d10-launch-org",
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    now,
  });
  const validationSuite = runExecutiveValidationSuite({
    context: {
      organizationId: "d10-launch-org",
      readinessRegistry,
      readinessSnapshot,
      reliabilitySnapshot,
      interactionSnapshot,
      dashboard,
    },
    now,
  });

  return {
    organizationId: "d10-launch-org",
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    dashboard,
    validationSuite,
    now,
  };
}

describe("D10 executive launch gate", () => {
  it("evaluates release candidate when all D10 evidence is clean", () => {
    const result = evaluateExecutiveLaunchGate(cleanInput());

    assert.equal(validateExecutiveLaunchGateResult(result), true);
    assert.equal(result.state, "release_candidate");
    assert.equal(result.recommendation, "MVP_release_candidate");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.blockers.length, 0);
    assert.equal(result.summary.isNexoraReady, true);
  });

  it("aggregates traceable evidence and scorecard values", () => {
    const input = cleanInput();
    const evidence = aggregateLaunchEvidence(input);
    const result = evaluateExecutiveLaunchGate(input);

    assert.equal(evidence.length >= 5, true);
    assert.equal(result.evidence.every((item) => item.signature.trim().length > 0), true);
    assert.equal(result.scorecard.readinessScore > 0.8, true);
    assert.equal(result.scorecard.trustScore > 0.8, true);
    assert.equal(result.scorecard.validationScore, 1);
  });

  it("detects launch blockers from failed validation", () => {
    const input = cleanInput(4_000_100);
    const failedValidation = {
      ...input.validationSuite!,
      state: "failed" as const,
      summary: {
        ...input.validationSuite!.summary,
        validationPassed: false,
        highestRisk: {
          classificationId: "risk",
          description: "Panel transition failed.",
          confidence: 0.92,
          severity: "critical" as const,
          recommendation: "Fix panel transition.",
        },
      },
    };
    const blockers = detectLaunchBlockers({ ...input, validationSuite: failedValidation });
    const result = evaluateExecutiveLaunchGate({ ...input, validationSuite: failedValidation });

    assert.equal(blockers.some((item) => item.affectedCapability === "validation"), true);
    assert.equal(result.state, "blocked");
    assert.equal(result.recommendation, "do_not_launch");
    assert.equal(result.classifications.some((item) => item.severity === "launch_blocker"), true);
  });

  it("prioritizes risks deterministically", () => {
    const input = cleanInput();
    const blockedDashboard = {
      ...input.dashboard!,
      gaps: [
        ...input.dashboard!.gaps,
        {
          gapId: "gap-major",
          description: "Trust concern remains.",
          severity: "major" as const,
          rationale: "Trust evidence is thin.",
          recommendedNextAction: "Review trust evidence.",
        },
      ],
    };
    const blockers = detectLaunchBlockers({ ...input, dashboard: blockedDashboard });
    const risks = prioritizeReadinessRisks({ ...input, dashboard: blockedDashboard }, blockers);

    assert.equal(risks.length > 0, true);
    assert.equal(risks[0]!.priorityScore >= risks[risks.length - 1]!.priorityScore, true);
  });

  it("generates governance classifications and executive summary for missing evidence", () => {
    const input = cleanInput();
    const partial = {
      ...input,
      dashboard: null,
      validationSuite: null,
    };
    const blockers = detectLaunchBlockers(partial);
    const risks = prioritizeReadinessRisks(partial, blockers);
    const classifications = classifyLaunchGovernance({ blockers, risks });
    const result = evaluateExecutiveLaunchGate(partial);

    assert.equal(classifications[0]?.severity, "launch_blocker");
    assert.equal(result.summary.launchBlockers.length > 0, true);
    assert.equal(result.summary.shouldHappenNext.length > 0, true);
    assert.equal(generateLaunchRecommendation("conditionally_ready", result.scorecard), "launch_after_remediation");
  });

  it("keeps launch gate outputs deterministic", () => {
    const input = cleanInput(4_000_300);
    const first = evaluateExecutiveLaunchGate(input);
    const second = evaluateExecutiveLaunchGate(input);

    assert.equal(first.signature, second.signature);
    assert.deepEqual(first.scorecard, second.scorecard);
    assert.equal(first.explainability.confidence, first.scorecard.launchConfidence);
  });
});

