import { describe, expect, it, beforeEach } from "vitest";

import { minimalCognition } from "../../institutional-consciousness/institutionalConsciousness.test";
import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { resetDemoModeStores } from "../demo-mode/demoModeStore";
import { resetDemoModeGuards } from "../demo-mode/demoModeGuards";
import { resetProductionReadinessGateStores } from "../launch-gate/productionReadinessGateStore";
import { resetProductionReadinessGateGuards } from "../launch-gate/productionReadinessGateGuards";
import { resetPilotFeedbackStores } from "../feedback-loop/pilotFeedbackStore";
import { resetPilotFeedbackGuards } from "../feedback-loop/pilotFeedbackGuards";
import { resetFinalHardeningStores } from "../final-hardening/finalHardeningStore";
import { resetFinalHardeningGuards } from "../final-hardening/finalHardeningGuards";
import { evaluateMVPFinalHardening } from "../final-hardening/finalHardeningEngine";
import { evaluateMVPDemoMode } from "../demo-mode/demoModeEngine";
import { evaluateMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateEngine";
import { seedExecutiveInteractionStabilityPrerequisites } from "../executiveInteractionStability.test";
import { evaluateExecutiveInteractionStability } from "../executiveInteractionStabilityEngine";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluatePilotFeedbackLearningLoop } from "../feedback-loop/pilotFeedbackEngine";
import {
  preventFalsePublishReadyStatus,
  resetFinalMVPCompletionGuards,
} from "./finalMVPCompletionGuards";
import { getFinalMVPCompletionStore, resetFinalMVPCompletionStores } from "./finalMVPCompletionStore";
import { evaluateFinalMVPCompletion } from "./finalMVPCompletionEngine";
import { integrateFinalMVPCompletionWithCognition } from "./integrateFinalMVPCompletionWithCognition";
import { selectLatestFinalMVPCompletionSnapshot } from "./finalMVPCompletionSelectors";
import type { FinalMVPCompletionInput } from "./finalMVPCompletionTypes";

function resetCompletionTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetProductionReadinessGateStores();
  resetProductionReadinessGateGuards();
  resetDemoModeStores();
  resetDemoModeGuards();
  resetPilotFeedbackStores();
  resetPilotFeedbackGuards();
  resetFinalHardeningStores();
  resetFinalHardeningGuards();
  resetFinalMVPCompletionStores();
  resetFinalMVPCompletionGuards();
}

function seedFullCompletionRuntime(org: string) {
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
    now: 460_000,
  });
}

function completionInput(org: string, now: number, overrides?: Partial<FinalMVPCompletionInput>) {
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
    readinessDashboardStatus: "mvp_ready",
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
    readinessDashboardStatus: "mvp_ready",
    now,
  }).demoMode!;
  const learning = evaluatePilotFeedbackLearningLoop({
    organizationId: org,
    demoModeSnapshot: demo,
    smokeTestSuite,
    operationalReliabilitySnapshot: operational,
    readinessDashboardStatus: "mvp_ready",
    now,
  }).snapshot;
  const hardening = evaluateMVPFinalHardening({
    organizationId: org,
    readinessDashboardStatus: "mvp_ready",
    smokeTestSuite,
    productionReadinessGate: gate,
    demoModeSnapshot: demo,
    pilotLearningSnapshot: learning,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    explainabilityAvailable: true,
    manualValidation: { lintValidation: "pass", typeValidation: "pass" },
    now,
  }).snapshot!;

  return {
    organizationId: org,
    finalHardeningSnapshot: hardening,
    productionReadinessGate: gate,
    demoModeSnapshot: demo,
    smokeTestSuite,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    pilotLearningSnapshot: learning,
    now,
    ...overrides,
  };
}

describe("final mvp completion D9:10:10", () => {
  beforeEach(() => {
    resetCompletionTestStacks();
  });

  it("returns not_ready when validation depth is missing", () => {
    const result = evaluateFinalMVPCompletion({
      organizationId: "completion-empty-org",
      now: 900_001,
    });
    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.publishReadyStatus).toBe("not_ready");
  });

  it("blocks publish when launch gate is no_go", () => {
    const org = "completion-block-org";
    seedFullCompletionRuntime(org);
    const input = completionInput(org, 461_000);
    const blockedGate = {
      ...input.productionReadinessGate!,
      decision: "no_go" as const,
      blockers: [
        {
          blockerId: "b1",
          category: "smoke_test_status" as const,
          severity: "critical" as const,
          summary: "Smoke failed",
          remediation: "Fix",
          generatedAt: 461_000,
        },
      ],
    };
    const result = evaluateFinalMVPCompletion({
      ...input,
      productionReadinessGate: blockedGate,
    });
    expect(result.snapshot?.publishReadyStatus).toBe("blocked");
    expect(result.snapshot?.blockers.length).toBeGreaterThan(0);
  });

  it("maps demo_ready when launch gate allows demo", () => {
    const org = "completion-demo-org";
    seedFullCompletionRuntime(org);
    const input = completionInput(org, 462_000);
    const demoGate = { ...input.productionReadinessGate!, decision: "go_for_demo" as const, blockers: [] };
    const demoMode = { ...input.demoModeSnapshot!, demoState: "demo_ready" as const };
    const result = evaluateFinalMVPCompletion({
      ...input,
      productionReadinessGate: demoGate,
      demoModeSnapshot: demoMode,
    });
    expect(["demo_ready", "pilot_ready", "publish_candidate"]).toContain(
      result.snapshot?.publishReadyStatus
    );
  });

  it("can reach publish_candidate with clean validation stack", () => {
    const org = "completion-publish-org";
    seedFullCompletionRuntime(org);
    const input = completionInput(org, 463_000);
    const publishGate = {
      ...input.productionReadinessGate!,
      decision: "go_for_controlled_pilot" as const,
      blockers: [],
      risks: [],
      readinessSummary: {
        ...input.productionReadinessGate!.readinessSummary,
        evidenceDepth: "full" as const,
      },
    };
    const publishDemo = { ...input.demoModeSnapshot!, demoState: "pilot_ready" as const };
    const publishHardening = {
      ...input.finalHardeningSnapshot!,
      releaseCandidateStatus: "ready" as const,
      blockedChecks: [],
      failedChecks: [],
      hardeningSummary: {
        ...input.finalHardeningSnapshot!.hardeningSummary,
        evidenceComplete: true,
      },
    };
    const trustedOperational = {
      ...input.operationalReliabilitySnapshot!,
      trustState: "executive_grade" as const,
    };
    const result = evaluateFinalMVPCompletion({
      ...input,
      productionReadinessGate: publishGate,
      demoModeSnapshot: publishDemo,
      finalHardeningSnapshot: publishHardening,
      operationalReliabilitySnapshot: trustedOperational,
      smokeTestSuite: {
        ...input.smokeTestSuite!,
        status: "pass",
        failed: 0,
        criticalFindings: [],
      },
    });
    expect(result.snapshot?.publishReadyStatus).toBe("publish_candidate");
    expect(result.snapshot?.blockers).toHaveLength(0);
    expect(result.snapshot?.summary).toMatch(/controlled MVP publish candidate/i);
  });

  it("keeps risks visible instead of hiding them", () => {
    const org = "completion-risks-org";
    seedFullCompletionRuntime(org);
    const input = completionInput(org, 464_000);
    const demoWithRisk = {
      ...input.demoModeSnapshot!,
      demoRisks: [
        {
          riskId: "r1",
          category: "panel_readiness" as const,
          severity: "low" as const,
          summary: "Monitor panel transition latency during first pilot.",
          visibleToExecutive: true,
          generatedAt: 464_000,
        },
      ],
    };
    const result = evaluateFinalMVPCompletion({ ...input, demoModeSnapshot: demoWithRisk });
    expect(result.snapshot?.risks.length).toBeGreaterThan(0);
  });

  it("prevents false publish_candidate without evidence", () => {
    const prevented = preventFalsePublishReadyStatus("publish_candidate", false, false, false);
    expect(prevented.status).toBe("pilot_ready");
    expect(prevented.prevented).toBe(true);
  });

  it("dedupes repeated completion evaluations", () => {
    const org = "completion-dedupe-org";
    seedFullCompletionRuntime(org);
    const first = evaluateFinalMVPCompletion(completionInput(org, 465_000));
    const second = evaluateFinalMVPCompletion(completionInput(org, 465_050));
    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(getFinalMVPCompletionStore(org).getState().completionSnapshots).toHaveLength(1);
  });

  it("does not claim full production readiness", () => {
    const org = "completion-claims-org";
    seedFullCompletionRuntime(org);
    const result = evaluateFinalMVPCompletion(completionInput(org, 466_000));
    expect(JSON.stringify(result.snapshot)).not.toMatch(
      /full production|autonomous deployment|self-aware|AGI/i
    );
    expect(result.snapshot?.executivePublishReadiness.controlledMvpOnly).toBe(true);
  });

  it("integrates via cognition without deployment side effects", () => {
    const org = "completion-integrate-org";
    seedFullCompletionRuntime(org);
    completionInput(org, 467_000);
    const result = integrateFinalMVPCompletionWithCognition({
      organizationId: org,
      cognitionSnapshot: minimalCognition(org),
      now: 467_100,
    });
    expect(result.evaluated).toBe(true);
    expect(selectLatestFinalMVPCompletionSnapshot(org)?.signature).toBe(result.snapshot?.signature);
  });
});
