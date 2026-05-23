import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EXECUTIVE_DEMO_SCENARIOS,
  buildExecutiveDemoModePresentation,
  buildExecutivePresentationSnapshot,
  buildGuidedExecutiveJourney,
  buildPilotPresentationPlan,
  evaluateDemoSafetyControls,
  evaluateDemoSuccess,
  getDemoScenarioById,
  listDemoScenariosForMode,
  requestDemoModeTransition,
  validateDemoHealth,
  validateExecutiveDemoModePresentation,
} from "./index.ts";
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
import type { ExecutiveDemoModeInput } from "./index.ts";
import type { ExecutiveLaunchGateInput } from "../executive-launch-gate/index.ts";
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

function cleanLaunchInput(now = 5_000_000): ExecutiveLaunchGateInput {
  const organizationId = "d10-demo-org";
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
        recommendation: "Proceed with controlled execution.",
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

  return {
    organizationId,
    readinessRegistry,
    readinessSnapshot,
    reliabilitySnapshot,
    interactionSnapshot,
    dashboard,
    validationSuite,
    now,
  };
}

function cleanDemoInput(now = 5_000_000): ExecutiveDemoModeInput {
  const launchInput = cleanLaunchInput(now);
  const launchGate = evaluateExecutiveLaunchGate(launchInput);

  return {
    organizationId: "d10-demo-org",
    mode: "pilot_mode",
    audience: "pilot_participant",
    activeJourneyId: "platform_overview",
    requestedJourneyIds: ["platform_overview", "object_intelligence", "scenario_simulation"],
    dashboard: launchInput.dashboard,
    validationSuite: launchInput.validationSuite,
    launchGate,
    now,
  };
}

describe("D10 executive demo mode", () => {
  it("enforces deterministic demo mode transitions", () => {
    const input = cleanDemoInput();
    const enterDemo = requestDemoModeTransition("disabled", "demo_mode", input);
    const enterPilot = requestDemoModeTransition("demo_mode", "pilot_mode", input);
    const blockedPilot = requestDemoModeTransition("disabled", "pilot_mode", { ...input, launchGate: null });

    assert.equal(enterDemo.allowed, true);
    assert.equal(enterPilot.allowed, true);
    assert.equal(blockedPilot.allowed, false);
    assert.equal(enterPilot.signature, requestDemoModeTransition("demo_mode", "pilot_mode", input).signature);
  });

  it("exposes an extensible scenario registry for guided presentation", () => {
    assert.equal(EXECUTIVE_DEMO_SCENARIOS.length >= 5, true);
    assert.equal(getDemoScenarioById("fragility_analysis")?.capability.includes("Fragility"), true);
    assert.equal(listDemoScenariosForMode("disabled").length, 0);
    assert.equal(listDemoScenariosForMode("demo_mode").some((scenario) => scenario.scenarioId === "scenario_simulation"), true);
  });

  it("generates guided executive journeys from registry entries", () => {
    const journeys = buildGuidedExecutiveJourney(cleanDemoInput());

    assert.equal(journeys.length, 3);
    assert.equal(journeys.every((journey) => !journey.blocked), true);
    assert.equal(journeys[0]!.steps.length > 0, true);
  });

  it("creates executive presentation snapshots and pilot plans", () => {
    const input = cleanDemoInput();
    const snapshot = buildExecutivePresentationSnapshot(input);
    const pilotPlan = buildPilotPresentationPlan(input);

    assert.equal(snapshot.capabilityDemonstrated.length > 0, true);
    assert.equal(snapshot.supportingEvidence.some((item) => item.includes("Launch gate")), true);
    assert.equal(pilotPlan.nonDestructive, true);
    assert.equal(pilotPlan.guidedExploration.includes("platform_overview"), true);
  });

  it("blocks unsafe presentation paths transparently", () => {
    const input = cleanDemoInput();
    const safety = evaluateDemoSafetyControls({
      ...input,
      requestedFeatureFlags: ["experimental_fragility_panel"],
      launchGate: { ...input.launchGate!, state: "blocked", blockers: input.launchGate!.blockers },
    });

    assert.equal(safety.safeToPresent, false);
    assert.equal(safety.controls.some((control) => control.source === "feature_flag"), true);
    assert.equal(safety.controls.some((control) => control.severity === "critical"), true);
  });

  it("validates demo health and success evaluation for pilot readiness", () => {
    const input = cleanDemoInput();
    const health = validateDemoHealth(input);
    const success = evaluateDemoSuccess(input);

    assert.equal(health.workflowAvailability, "available");
    assert.equal(health.scenarioIntegrity, "available");
    assert.equal(success.advisoryOnly, true);
    assert.equal(success.assessment, "pilot_ready");
  });

  it("builds the full executive demo mode presentation deterministically", () => {
    const input = cleanDemoInput(5_000_200);
    const first = buildExecutiveDemoModePresentation(input);
    const second = buildExecutiveDemoModePresentation(input);

    assert.equal(validateExecutiveDemoModePresentation(first), true);
    assert.equal(first.signature, second.signature);
    assert.deepEqual(first.successEvaluation, second.successEvaluation);
    assert.equal(first.safety.safeToPresent, true);
  });
});
