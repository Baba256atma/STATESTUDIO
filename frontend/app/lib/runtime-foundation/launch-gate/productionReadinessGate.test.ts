import { describe, expect, it, beforeEach } from "vitest";

import { minimalCognition } from "../../institutional-consciousness/institutionalConsciousness.test";
import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { evaluateExecutiveInteractionStability } from "../executiveInteractionStabilityEngine";
import { seedExecutiveInteractionStabilityPrerequisites } from "../executiveInteractionStability.test";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import {
  beginProductionReadinessGateEvaluation,
  endProductionReadinessGateEvaluation,
  preventFalseProductionReadyClaim,
  resetProductionReadinessGateGuards,
  stabilizeLaunchDecisionOscillation,
} from "./productionReadinessGateGuards";
import {
  getProductionReadinessGateStore,
  resetProductionReadinessGateStores,
} from "./productionReadinessGateStore";
import { evaluateMVPProductionReadinessGate } from "./productionReadinessGateEngine";
import { integrateProductionReadinessGateWithCognition } from "./integrateProductionReadinessGateWithCognition";
import { selectLatestMVPProductionReadinessGate } from "./productionReadinessGateSelectors";
import type { MVPProductionReadinessGateInput } from "./productionReadinessGateTypes";

function resetLaunchGateTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetProductionReadinessGateStores();
  resetProductionReadinessGateGuards();
}

function seedFullLaunchRuntime(org: string) {
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
    now: 420_000,
  });
}

function gateInput(org: string, now: number, overrides?: Partial<MVPProductionReadinessGateInput>) {
  const foundation = selectLatestMVPStrategicReadinessSnapshot(org);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(org);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(org);
  return {
    organizationId: org,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite: runMVPSmokeTestSuite({ organizationId: org, now }),
    readinessDashboardStatus: "stable" as const,
    explainabilityAvailable: true,
    now,
    ...overrides,
  };
}

describe("mvp production readiness gate D9:10:6", () => {
  beforeEach(() => {
    resetLaunchGateTestStacks();
  });

  it("skips when interaction depth is missing", () => {
    const org = "launch-gate-skip-org";
    const result = evaluateMVPProductionReadinessGate({ organizationId: org, now: 1 });
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_interaction_depth");
  });

  it("failed critical smoke test creates no_go", () => {
    const org = "launch-gate-smoke-fail-org";
    seedFullLaunchRuntime(org);
    const smoke = runMVPSmokeTestSuite({ organizationId: org, now: 421_000 });
    const failedSmoke = {
      ...smoke,
      status: "fail" as const,
      failed: 2,
      criticalFindings: [
        {
          findingId: "critical-1",
          scenarioId: "rapid_panel_switch",
          severity: "critical" as const,
          summary: "Panel instability",
          generatedAt: 421_000,
        },
      ],
    };

    const result = evaluateMVPProductionReadinessGate(
      gateInput(org, 421_100, { smokeTestSuite: failedSmoke })
    );
    expect(result.evaluated).toBe(true);
    expect(result.gate?.decision).toBe("no_go");
    expect(result.gate?.blockers.some((b) => b.category === "smoke_test_status")).toBe(true);
  });

  it("missing evidence prevents controlled pilot recommendation", () => {
    const org = "launch-gate-partial-org";
    seedFullLaunchRuntime(org);
    const interaction = selectLatestExecutiveInteractionStabilitySnapshot(org)!;

    const result = evaluateMVPProductionReadinessGate({
      organizationId: org,
      executiveInteractionStabilitySnapshot: interaction,
      smokeTestSuite: null,
      readinessDashboardStatus: "stable",
      now: 422_000,
    });

    expect(result.gate?.readinessSummary.evidenceDepth).toBe("partial");
    expect(result.gate?.decision).not.toBe("go_for_controlled_pilot");
    expect(["conditional_go", "no_go"]).toContain(result.gate?.decision);
  });

  it("minor risks allow demo readiness when smoke is clean", () => {
    const org = "launch-gate-demo-org";
    seedFullLaunchRuntime(org);
    const smoke = runMVPSmokeTestSuite({ organizationId: org, now: 423_000 });
    const operational = selectLatestExecutiveOperationalReliabilitySnapshot(org)!;

    const result = evaluateMVPProductionReadinessGate(
      gateInput(org, 423_100, {
        smokeTestSuite: { ...smoke, status: "pass", warned: 0, failed: 0, criticalFindings: [] },
        operationalReliabilitySnapshot: {
          ...operational,
          trustState: "trusted",
        },
        readinessDashboardStatus: "stable",
      })
    );

    expect(["go_for_demo", "go_for_controlled_pilot", "conditional_go"]).toContain(
      result.gate?.decision
    );
    expect(result.gate?.decision).not.toBe("no_go");
  });

  it("clean validation can recommend controlled pilot", () => {
    const org = "launch-gate-pilot-org";
    seedFullLaunchRuntime(org);
    const smoke = runMVPSmokeTestSuite({ organizationId: org, now: 424_000 });
    const operational = selectLatestExecutiveOperationalReliabilitySnapshot(org)!;
    const interaction = selectLatestExecutiveInteractionStabilitySnapshot(org)!;

    const result = evaluateMVPProductionReadinessGate(
      gateInput(org, 424_100, {
        smokeTestSuite: {
          ...smoke,
          status: "pass",
          passed: 8,
          warned: 0,
          failed: 0,
          skipped: 0,
          criticalFindings: [],
        },
        operationalReliabilitySnapshot: {
          ...operational,
          trustState: "executive_grade",
        },
        executiveInteractionStabilitySnapshot: {
          ...interaction,
          uiState: "mvp_ready",
        },
        readinessDashboardStatus: "mvp_ready",
      })
    );

    expect(result.gate?.decision).toBe("go_for_controlled_pilot");
    expect(result.gate?.blockers).toHaveLength(0);
  });

  it("dedupes repeated evaluations with same signature", () => {
    const org = "launch-gate-dedupe-org";
    seedFullLaunchRuntime(org);
    const first = evaluateMVPProductionReadinessGate(gateInput(org, 425_000));
    const second = evaluateMVPProductionReadinessGate(gateInput(org, 425_050));
    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("deduped_or_paced");
    expect(getProductionReadinessGateStore(org).getState().readinessGates).toHaveLength(1);
  });

  it("integrates via cognition without deployment side effects", () => {
    const org = "launch-gate-integrate-org";
    seedFullLaunchRuntime(org);
    const cognition = minimalCognition(org);
    const result = integrateProductionReadinessGateWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 426_000,
    });
    expect(result.evaluated).toBe(true);
    expect(result.gate).not.toBeNull();
    expect(selectLatestMVPProductionReadinessGate(org)?.signature).toBe(result.gate?.signature);
    expect(result.gate?.summary).not.toMatch(/AGI|self-aware|conscious|production-ready deployment/i);
  });

  it("false-ready prevention downgrades inflated pilot posture", () => {
    const prevented = preventFalseProductionReadyClaim("go_for_controlled_pilot", false, 0, false);
    expect(prevented.decision).toBe("conditional_go");
    expect(prevented.falseReadyPrevented).toBe(true);
  });

  it("stabilizes launch decision oscillation", () => {
    expect(stabilizeLaunchDecisionOscillation("go_for_controlled_pilot", "no_go")).toBe(
      "conditional_go"
    );
  });

  it("guards recursion depth", () => {
    beginProductionReadinessGateEvaluation();
    beginProductionReadinessGateEvaluation();
    const blocked = beginProductionReadinessGateEvaluation();
    expect(blocked).toBe(false);
    endProductionReadinessGateEvaluation();
    endProductionReadinessGateEvaluation();
    endProductionReadinessGateEvaluation();
  });
});
