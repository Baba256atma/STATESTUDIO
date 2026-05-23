import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  analyzeRuntimeConsistency,
  buildExecutiveReliabilitySnapshot,
  evaluateExecutiveTrustArtifact,
  reliabilityStateFromTrustScore,
  validateExecutiveReliabilitySnapshot,
} from "./index.ts";
import { buildRuntimeReadinessRegistry } from "../strategic-readiness/index.ts";
import type { ExecutiveTrustArtifact } from "./index.ts";
import type { RuntimeReadinessInput } from "../strategic-readiness/index.ts";

const readyDimensions = Object.fromEntries(
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
    { state: "ready", confidence: 0.9, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["dimensions"];

const readyFeatures = Object.fromEntries(
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
    { readinessState: "ready", confidence: 0.88, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["features"];

function readiness(now = 1_000_000) {
  return buildRuntimeReadinessRegistry({
    organizationId: "d10-reliability-org",
    dimensions: readyDimensions,
    features: readyFeatures,
    runtimeChecks: [{ id: "runtime", label: "Runtime", health: "healthy", summary: "Runtime is healthy." }],
    now,
  });
}

function artifact(overrides: Partial<ExecutiveTrustArtifact> = {}): ExecutiveTrustArtifact {
  return {
    artifactId: "decision-1",
    sourceType: "decision_recommendation",
    title: "Decision recommendation",
    conclusion: "Proceed with the recommended action.",
    recommendation: "Proceed with controlled execution.",
    confidenceScore: 0.86,
    validationState: "valid",
    generatedAt: 1_000_000,
    supportingFactors: ["Simulation and fragility evidence align."],
    warningIndicators: [],
    contractValid: true,
    executionChainComplete: true,
    ...overrides,
  };
}

describe("D10 executive reliability trust layer", () => {
  it("calculates trust score from confidence, support, and warnings", () => {
    const good = evaluateExecutiveTrustArtifact(artifact(), 1_000_100);
    const degraded = evaluateExecutiveTrustArtifact(
      artifact({
        artifactId: "decision-2",
        confidenceScore: 0.62,
        validationState: "warning",
        warningIndicators: ["Evidence is still developing."],
      }),
      1_000_100
    );

    assert.equal(good.reliabilityState, "stable");
    assert.equal(good.trustScore > degraded.trustScore, true);
    assert.equal(degraded.warningIndicators.includes("Evidence is still developing."), true);
  });

  it("detects conflicting conclusions and contradictory recommendations", () => {
    const analysis = analyzeRuntimeConsistency(
      [
        artifact({ artifactId: "simulation", sourceType: "simulation_output", title: "Simulation", conclusion: "Ready and stable.", recommendation: "Proceed." }),
        artifact({ artifactId: "fragility", sourceType: "fragility_assessment", title: "Fragility", conclusion: "Critical and unstable.", recommendation: "Avoid." }),
      ],
      1_000_100
    );

    assert.equal(analysis.consistent, false);
    assert.equal(analysis.issues.some((issue) => issue.issueType === "conflicting_conclusions"), true);
    assert.equal(analysis.issues.some((issue) => issue.issueType === "contradictory_recommendations"), true);
  });

  it("aggregates stable executive reliability snapshot", () => {
    const snapshot = buildExecutiveReliabilitySnapshot({
      organizationId: "d10-reliability-org",
      readinessRegistry: readiness(),
      artifacts: [
        artifact(),
        artifact({
          artifactId: "simulation-1",
          sourceType: "simulation_output",
          title: "Simulation output",
          conclusion: "Stable simulation output.",
          recommendation: "Proceed with controlled execution.",
          confidenceScore: 0.82,
        }),
      ],
      validationResults: [{ checkId: "panel", label: "Panel", state: "stable", confidence: 0.9, reason: "Panel state is stable." }],
      confidenceSignals: [{ signalId: "confidence", confidenceScore: 0.86, label: "Decision confidence" }],
      panelContractValid: true,
      sceneSynchronized: true,
      now: 1_000_200,
    });

    assert.equal(validateExecutiveReliabilitySnapshot(snapshot), true);
    assert.equal(snapshot.summary.reliabilityState, "stable");
    assert.equal(snapshot.canTrustResult, true);
    assert.equal(snapshot.platformBehavingNormally, true);
  });

  it("handles degraded and unstable runtime trust states", () => {
    const snapshot = buildExecutiveReliabilitySnapshot({
      organizationId: "d10-degraded-org",
      readinessRegistry: readiness(),
      artifacts: [
        artifact({
          artifactId: "summary-invalid",
          sourceType: "executive_summary",
          title: "Executive summary",
          conclusion: "Ready and stable.",
          confidenceScore: 0.48,
          validationState: "invalid",
          contractValid: false,
          executionChainComplete: false,
        }),
      ],
      panelContractValid: false,
      sceneSynchronized: false,
      now: 1_000_300,
    });

    assert.equal(snapshot.summary.reliabilityState, "unstable");
    assert.equal(snapshot.canTrustResult, false);
    assert.equal(snapshot.highestTrustRisk?.severity, "critical");
    assert.equal(snapshot.consistency.issues.some((issue) => issue.issueType === "invalid_state_propagation"), true);
  });

  it("tracks recovery and deterministic output", () => {
    const prior = buildExecutiveReliabilitySnapshot({
      organizationId: "d10-trend-org",
      readinessRegistry: readiness(1_000_000),
      artifacts: [artifact({ confidenceScore: 0.4, validationState: "warning", warningIndicators: ["Low evidence."] })],
      panelContractValid: true,
      sceneSynchronized: true,
      now: 1_000_000,
    });
    const input = {
      organizationId: "d10-trend-org",
      readinessRegistry: readiness(1_000_600),
      artifacts: [artifact({ confidenceScore: 0.7, validationState: "warning" })],
      validationResults: [{ checkId: "runtime", label: "Runtime", state: "recovering" as const, confidence: 0.68, reason: "Runtime is recovering." }],
      previousSnapshots: [prior],
      panelContractValid: true,
      sceneSynchronized: true,
      now: 1_000_600,
    };

    const first = buildExecutiveReliabilitySnapshot(input);
    const second = buildExecutiveReliabilitySnapshot(input);

    assert.equal(first.signature, second.signature);
    assert.equal(reliabilityStateFromTrustScore(0.64), "recovering");
    assert.equal(first.trend.direction, "recovering");
    assert.equal(first.trend.confidenceDrift, "up");
  });
});
