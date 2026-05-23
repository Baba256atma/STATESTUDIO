import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  analyzeExecutiveReadinessGaps,
  buildExecutiveReadinessDashboard,
  healthFromScore,
  validateExecutiveReadinessDashboard,
} from "./index.ts";
import {
  buildExecutiveReadinessSnapshot,
  buildRuntimeReadinessRegistry,
} from "../strategic-readiness/index.ts";
import {
  buildExecutiveReliabilitySnapshot,
} from "../executive-reliability/index.ts";
import {
  buildExecutiveInteractionStabilitySnapshot,
  createExecutiveInteractionContext,
} from "../interaction-stability/index.ts";
import type { ExecutiveReadinessDashboardInput } from "./index.ts";
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

function cleanInput(now = 2_000_000): ExecutiveReadinessDashboardInput {
  const readinessRegistry = buildRuntimeReadinessRegistry({
    organizationId: "d10-dashboard-org",
    dimensions,
    features,
    runtimeChecks: [{ id: "runtime", label: "Runtime", health: "healthy", summary: "Runtime is healthy." }],
    now,
  });
  const readinessSnapshot = buildExecutiveReadinessSnapshot(readinessRegistry);
  const reliabilitySnapshot = buildExecutiveReliabilitySnapshot({
    organizationId: "d10-dashboard-org",
    readinessRegistry,
    artifacts: [
      {
        artifactId: "decision",
        sourceType: "decision_recommendation",
        title: "Decision recommendation",
        conclusion: "Ready and stable.",
        recommendation: "Proceed with controlled execution.",
        confidenceScore: 0.9,
        validationState: "valid",
        generatedAt: now,
        supportingFactors: ["Readiness and trust evidence align."],
        contractValid: true,
        executionChainComplete: true,
      },
    ],
    validationResults: [{ checkId: "trust", label: "Trust", state: "stable", confidence: 0.9, reason: "Trust is stable." }],
    confidenceSignals: [{ signalId: "confidence", confidenceScore: 0.9, label: "Confidence" }],
    panelContractValid: true,
    sceneSynchronized: true,
    now,
  });
  const context = createExecutiveInteractionContext({
    selectedObjectId: "obj-1",
    focusedObjectId: "obj-1",
    activePanel: "executive",
    activeWorkflow: "decision",
    updatedAt: now,
  });
  const interactionSnapshot = buildExecutiveInteractionStabilitySnapshot({
    organizationId: "d10-dashboard-org",
    previousContext: context,
    nextContext: { activePanel: "executive", updatedAt: now },
    events: [],
    now,
  });
  return {
    organizationId: "d10-dashboard-org",
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    now,
  };
}

describe("D10 executive readiness dashboard", () => {
  it("aggregates D10 readiness, trust, and stability into one dashboard", () => {
    const dashboard = buildExecutiveReadinessDashboard(cleanInput());

    assert.equal(validateExecutiveReadinessDashboard(dashboard), true);
    assert.equal(dashboard.healthSurface.status, "healthy");
    assert.equal(dashboard.launchAssessment, "production_candidate");
    assert.equal(dashboard.executiveSummary.isNexoraReady, true);
    assert.equal(dashboard.gaps.length, 0);
  });

  it("calculates readiness, trust, stability, validation, and risk indicators", () => {
    const dashboard = buildExecutiveReadinessDashboard(cleanInput());
    const ids = dashboard.indicators.map((item) => item.indicatorId);

    assert.equal(ids.includes("readiness_score"), true);
    assert.equal(ids.includes("trust_score"), true);
    assert.equal(ids.includes("stability_score"), true);
    assert.equal(ids.includes("validation_coverage"), true);
    assert.equal(ids.includes("risk_exposure"), true);
    assert.equal(dashboard.indicators.every((item) => item.score >= 0 && item.score <= 1), true);
    assert.equal(healthFromScore(0.9), "healthy");
  });

  it("generates gap analysis and classifications for blocked readiness", () => {
    const input = cleanInput();
    const blockedRegistry = buildRuntimeReadinessRegistry({
      organizationId: "d10-dashboard-org",
      dimensions: {
        ...dimensions,
        deployment_status: {
          state: "blocked",
          confidence: 0.5,
          validationStatus: "blocked",
          blockers: ["Deployment checklist requires executive signoff."],
        },
      },
      features,
      runtimeChecks: [{ id: "runtime", label: "Runtime", health: "warning", summary: "Runtime warning." }],
      now: 2_000_100,
    });
    const dashboard = buildExecutiveReadinessDashboard({
      ...input,
      readinessRegistry: blockedRegistry,
      readinessSnapshot: buildExecutiveReadinessSnapshot(blockedRegistry),
      now: 2_000_100,
    });

    assert.equal(analyzeExecutiveReadinessGaps({ readinessRegistry: blockedRegistry }).length > 0, true);
    assert.equal(dashboard.launchAssessment, "not_ready");
    assert.equal(dashboard.classifications.some((item) => item.severity === "critical"), true);
    assert.equal(dashboard.executiveSummary.blockingReadiness.length > 0, true);
  });

  it("downgrades launch assessment when trust or stability is weak", () => {
    const input = cleanInput();
    const weakReliability = buildExecutiveReliabilitySnapshot({
      organizationId: "d10-dashboard-org",
      readinessRegistry: input.readinessRegistry,
      artifacts: [
        {
          artifactId: "summary",
          sourceType: "executive_summary",
          title: "Executive summary",
          conclusion: "Critical and unstable.",
          confidenceScore: 0.35,
          validationState: "invalid",
          generatedAt: 2_000_200,
          contractValid: false,
          executionChainComplete: false,
        },
      ],
      panelContractValid: false,
      sceneSynchronized: false,
      now: 2_000_200,
    });
    const dashboard = buildExecutiveReadinessDashboard({
      ...input,
      reliabilitySnapshot: weakReliability,
      now: 2_000_200,
    });

    assert.equal(dashboard.launchAssessment, "not_ready");
    assert.equal(dashboard.runtimeTrust, "critical");
    assert.equal(dashboard.executiveSummary.isNexoraReady, false);
  });

  it("tracks dashboard progression deterministically", () => {
    const priorInput = cleanInput(2_000_000);
    const prior = buildExecutiveReadinessDashboard(priorInput);
    const currentInput = cleanInput(2_001_000);
    const first = buildExecutiveReadinessDashboard({
      ...currentInput,
      previousDashboards: [prior],
    });
    const second = buildExecutiveReadinessDashboard({
      ...currentInput,
      previousDashboards: [prior],
    });

    assert.equal(first.signature, second.signature);
    assert.equal(first.trend.readinessProgression, "flat");
    assert.equal(first.trend.points.length, 2);
  });
});

