import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EXECUTIVE_VALIDATION_SCENARIOS,
  buildValidationCoverageReport,
  classifyValidationAssertions,
  evaluateProductionCandidateVerification,
  runExecutiveValidationSuite,
  validateExecutiveValidationSuiteResult,
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
import type { ExecutiveValidationContext, ValidationAssertionResult } from "./index.ts";
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

function cleanContext(now = 3_000_000): ExecutiveValidationContext {
  const readinessRegistry = buildRuntimeReadinessRegistry({
    organizationId: "d10-validation-org",
    dimensions,
    features,
    runtimeChecks: [{ id: "runtime", label: "Runtime", health: "healthy", summary: "Runtime is healthy." }],
    now,
  });
  const readinessSnapshot = buildExecutiveReadinessSnapshot(readinessRegistry);
  const reliabilitySnapshot = buildExecutiveReliabilitySnapshot({
    organizationId: "d10-validation-org",
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
        supportingFactors: ["Recommendation, readiness, and simulation evidence align."],
        contractValid: true,
        executionChainComplete: true,
      },
      {
        artifactId: "simulation",
        sourceType: "simulation_output",
        title: "Simulation",
        conclusion: "Stable simulation output.",
        recommendation: "Proceed with controlled execution.",
        confidenceScore: 0.86,
        validationState: "valid",
        generatedAt: now,
        supportingFactors: ["Simulation context preserved."],
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
    organizationId: "d10-validation-org",
    previousContext: context,
    nextContext: { activePanel: "executive", updatedAt: now },
    events: [],
    now,
  });
  const dashboard = buildExecutiveReadinessDashboard({
    organizationId: "d10-validation-org",
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    now,
  });

  return {
    organizationId: "d10-validation-org",
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    dashboard,
  };
}

describe("D10 executive validation smoke harness", () => {
  it("executes the executive validation scenario registry", () => {
    const suite = runExecutiveValidationSuite({ context: cleanContext(), now: 3_000_100 });

    assert.equal(validateExecutiveValidationSuiteResult(suite), true);
    assert.equal(suite.results.length, EXECUTIVE_VALIDATION_SCENARIOS.length);
    assert.equal(suite.state, "passed");
    assert.equal(suite.summary.validationPassed, true);
    assert.equal(suite.summary.mvpDemoReady, true);
    assert.equal(suite.advisory, "production_candidate");
  });

  it("calculates coverage for partial scenario execution", () => {
    const suite = runExecutiveValidationSuite({
      context: cleanContext(),
      scenarioIds: ["journey_a_platform_entry", "journey_b_object_selection"],
      now: 3_000_200,
    });

    assert.equal(suite.coverage.executedScenarios, 2);
    assert.equal(suite.coverage.scenarioCount, EXECUTIVE_VALIDATION_SCENARIOS.length);
    assert.equal(suite.advisory, "validation_incomplete");
  });

  it("classifies validation failures with executive recommendations", () => {
    const assertions: ValidationAssertionResult[] = [
      {
        assertionId: "a",
        component: "panel",
        passed: false,
        description: "Panel transition failed.",
        severity: "critical",
        confidence: 0.92,
        recommendation: "Fix panel transition.",
        likelyCause: "Missing context.",
      },
    ];
    const classifications = classifyValidationAssertions(assertions);

    assert.equal(classifications.length, 1);
    assert.equal(classifications[0]?.severity, "critical");
    assert.equal(classifications[0]?.recommendation, "Fix panel transition.");
  });

  it("fails runtime integrity when dashboard and trust are unhealthy", () => {
    const context = cleanContext();
    const weakReliability = buildExecutiveReliabilitySnapshot({
      organizationId: "d10-validation-org",
      readinessRegistry: context.readinessRegistry,
      artifacts: [
        {
          artifactId: "bad-summary",
          sourceType: "executive_summary",
          title: "Executive summary",
          conclusion: "Critical and unstable.",
          confidenceScore: 0.3,
          validationState: "invalid",
          generatedAt: 3_000_300,
          contractValid: false,
          executionChainComplete: false,
        },
      ],
      panelContractValid: false,
      sceneSynchronized: false,
      now: 3_000_300,
    });
    const dashboard = buildExecutiveReadinessDashboard({
      ...context,
      reliabilitySnapshot: weakReliability,
      now: 3_000_300,
    });
    const suite = runExecutiveValidationSuite({
      context: {
        ...context,
        reliabilitySnapshot: weakReliability,
        dashboard,
      },
      now: 3_000_300,
    });

    assert.equal(suite.state, "failed");
    assert.equal(suite.summary.validationPassed, false);
    assert.equal(suite.summary.highestRisk?.severity, "critical");
    assert.equal(suite.advisory, "validation_passed_with_warnings");
  });

  it("keeps outputs deterministic", () => {
    const context = cleanContext(3_000_400);
    const first = runExecutiveValidationSuite({ context, now: 3_000_500 });
    const second = runExecutiveValidationSuite({ context, now: 3_000_500 });
    const coverage = buildValidationCoverageReport(first.results, EXECUTIVE_VALIDATION_SCENARIOS.length);

    assert.equal(first.signature, second.signature);
    assert.equal(coverage.coverageScore, 1);
    assert.equal(evaluateProductionCandidateVerification(first.results, first.coverage, context.dashboard?.launchAssessment ?? "not_ready"), "production_candidate");
  });
});

