import { describe, expect, it, beforeEach } from "vitest";

import { minimalCognition } from "../../institutional-consciousness/institutionalConsciousness.test";
import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { resetDemoModeStores } from "../demo-mode/demoModeStore";
import { resetDemoModeGuards } from "../demo-mode/demoModeGuards";
import { resetProductionReadinessGateStores } from "../launch-gate/productionReadinessGateStore";
import { resetProductionReadinessGateGuards } from "../launch-gate/productionReadinessGateGuards";
import { resetPilotFeedbackStores } from "../feedback-loop/pilotFeedbackStore";
import { resetPilotFeedbackGuards } from "../feedback-loop/pilotFeedbackGuards";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { evaluateExecutiveInteractionStability } from "../executiveInteractionStabilityEngine";
import { seedExecutiveInteractionStabilityPrerequisites } from "../executiveInteractionStability.test";
import { evaluateMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateEngine";
import { evaluateMVPDemoMode } from "../demo-mode/demoModeEngine";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluatePilotFeedbackLearningLoop } from "../feedback-loop/pilotFeedbackEngine";
import {
  preventFalseReleaseCandidateStatus,
  resetFinalHardeningGuards,
} from "./finalHardeningGuards";
import { getFinalHardeningStore, resetFinalHardeningStores } from "./finalHardeningStore";
import { evaluateMVPFinalHardening } from "./finalHardeningEngine";
import { integrateMVPFinalHardeningWithCognition } from "./integrateMVPFinalHardeningWithCognition";
import { selectLatestMVPFinalHardeningSnapshot } from "./finalHardeningSelectors";
import type { MVPFinalHardeningInput } from "./finalStabilizationChecklistTypes";

function resetFinalHardeningTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetProductionReadinessGateStores();
  resetProductionReadinessGateGuards();
  resetDemoModeStores();
  resetDemoModeGuards();
  resetPilotFeedbackStores();
  resetPilotFeedbackGuards();
  resetFinalHardeningStores();
  resetFinalHardeningGuards();
}

function seedFullHardeningRuntime(org: string) {
  const cognition = minimalCognition(org);
  seedExecutiveInteractionStabilityPrerequisites(org, cognition);
  evaluateExecutiveInteractionStability({
    organizationId: org,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(org),
    operationalReliabilitySnapshot: selectLatestExecutiveOperationalReliabilitySnapshot(org),
    panelRuntimeReliability: {
      panelStable: true,
      panelFlashDetected: false,
      panelOscillationDetected: false,
      rightRailViewStable: true,
      panelViewSignature: "stable-panel",
    },
    sceneInteractionReliability: {
      sceneSignature: "stable-scene",
      sceneContractValid: true,
      duplicateSceneReaction: false,
      reactionWithoutContract: false,
    },
    chatInteractionReliability: {
      chatPipelineSignature: "stable-chat",
      chatPipelineDeduped: true,
      duplicatePanelUpdateForSameInput: false,
      chatPanelSceneLoopRisk: false,
    },
    operationalTopologyStressed: false,
    fragilityElevated: false,
    continuityPreserved: true,
    cognitionConverged: true,
    runtimeStable: true,
    sessionHydrated: true,
    now: 450_000,
  });
}

function hardeningInput(org: string, now: number, overrides?: Partial<MVPFinalHardeningInput>) {
  const foundation = selectLatestMVPStrategicReadinessSnapshot(org);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(org);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(org);
  const smokeTestSuite = runMVPSmokeTestSuite({ organizationId: org, now });
  const gate = evaluateMVPProductionReadinessGate({
    organizationId: org,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite,
    readinessDashboardStatus: "stable",
    explainabilityAvailable: true,
    now,
  }).gate!;
  const demo = evaluateMVPDemoMode({
    organizationId: org,
    productionReadinessGate: gate,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite,
    readinessDashboardStatus: "stable",
    now,
  }).demoMode!;
  const learning = evaluatePilotFeedbackLearningLoop({
    organizationId: org,
    demoModeSnapshot: demo,
    smokeTestSuite,
    operationalReliabilitySnapshot: operational,
    readinessDashboardStatus: "stable",
    now,
  }).snapshot;

  return {
    organizationId: org,
    readinessDashboardStatus: "stable" as const,
    smokeTestSuite,
    productionReadinessGate: gate,
    demoModeSnapshot: demo,
    pilotLearningSnapshot: learning,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    explainabilityAvailable: true,
    manualValidation: {
      lintValidation: "pass" as const,
      typeValidation: "pass" as const,
    },
    now,
    ...overrides,
  };
}

describe("mvp final hardening D9:10:9", () => {
  beforeEach(() => {
    resetFinalHardeningTestStacks();
  });

  it("evaluates stabilization checklist with runtime signals", () => {
    const org = "hardening-eval-org";
    seedFullHardeningRuntime(org);
    const result = evaluateMVPFinalHardening(hardeningInput(org, 451_000));
    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.checklist.checks.length).toBeGreaterThan(10);
    expect(result.snapshot?.passedChecks.length).toBeGreaterThan(0);
  });

  it("blocks release candidate when smoke tests fail critically", () => {
    const org = "hardening-smoke-block-org";
    seedFullHardeningRuntime(org);
    const input = hardeningInput(org, 452_000);
    const failedSmoke = {
      ...input.smokeTestSuite!,
      status: "fail" as const,
      failed: 2,
      criticalFindings: [
        {
          findingId: "crit-1",
          scenarioId: "rapid_panel_switch",
          severity: "critical" as const,
          summary: "Panel instability",
          generatedAt: 452_000,
        },
      ],
    };
    const result = evaluateMVPFinalHardening({ ...input, smokeTestSuite: failedSmoke });
    expect(result.snapshot?.releaseCandidateStatus).toBe("blocked");
    expect(result.snapshot?.blockedChecks.length).toBeGreaterThan(0);
  });

  it("warns when manual lint/type checks are not confirmed", () => {
    const org = "hardening-manual-org";
    seedFullHardeningRuntime(org);
    const result = evaluateMVPFinalHardening(
      hardeningInput(org, 453_000, { manualValidation: {} })
    );
    expect(result.snapshot?.releaseCandidateStatus).toBe("warn");
    expect(result.snapshot?.recommendedNextChecks.some((r) => r.includes("lint"))).toBe(true);
    expect(result.snapshot?.recommendedNextChecks.some((r) => r.includes("tsc"))).toBe(true);
  });

  it("fails panel flash and scene contract checks", () => {
    const org = "hardening-panel-org";
    seedFullHardeningRuntime(org);
    const input = hardeningInput(org, 454_000);
    const interaction = {
      ...input.executiveInteractionStabilitySnapshot!,
      panelRuntimeReliability: {
        ...input.executiveInteractionStabilitySnapshot!.panelRuntimeReliability,
        panelFlashDetected: true,
      },
      sceneInteractionReliability: {
        ...input.executiveInteractionStabilitySnapshot!.sceneInteractionReliability,
        reactionWithoutContract: true,
        sceneContractValid: false,
      },
    };
    const result = evaluateMVPFinalHardening({
      ...input,
      executiveInteractionStabilitySnapshot: interaction,
    });
    expect(result.snapshot?.failedChecks).toContain("no_panel_flash");
    expect(result.snapshot?.failedChecks).toContain("scene_contract_aligned");
  });

  it("prevents false release-candidate ready status", () => {
    const prevented = preventFalseReleaseCandidateStatus("ready", true, false, 0);
    expect(prevented.status).toBe("blocked");
    expect(prevented.prevented).toBe(true);
  });

  it("dedupes repeated hardening evaluations", () => {
    const org = "hardening-dedupe-org";
    seedFullHardeningRuntime(org);
    const first = evaluateMVPFinalHardening(hardeningInput(org, 455_000));
    const second = evaluateMVPFinalHardening(hardeningInput(org, 455_050));
    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(getFinalHardeningStore(org).getState().hardeningSnapshots).toHaveLength(1);
  });

  it("does not claim full production readiness in summary", () => {
    const org = "hardening-summary-org";
    seedFullHardeningRuntime(org);
    const result = evaluateMVPFinalHardening(hardeningInput(org, 456_000));
    expect(result.snapshot?.summary).not.toMatch(/full production|deploy now|autonomous/i);
  });

  it("integrates via cognition without deployment side effects", () => {
    const org = "hardening-integrate-org";
    seedFullHardeningRuntime(org);
    evaluateMVPProductionReadinessGate(hardeningInput(org, 457_000) as Parameters<typeof evaluateMVPProductionReadinessGate>[0]);
    evaluateMVPDemoMode(hardeningInput(org, 457_000) as Parameters<typeof evaluateMVPDemoMode>[0]);
    const result = integrateMVPFinalHardeningWithCognition({
      organizationId: org,
      cognitionSnapshot: minimalCognition(org),
      now: 457_100,
    });
    expect(result.evaluated).toBe(true);
    expect(selectLatestMVPFinalHardeningSnapshot(org)?.signature).toBe(result.snapshot?.signature);
  });
});
