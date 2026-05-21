import { describe, expect, it, beforeEach } from "vitest";

import { minimalCognition } from "../../institutional-consciousness/institutionalConsciousness.test";
import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { evaluateExecutiveInteractionStability } from "../executiveInteractionStabilityEngine";
import { seedExecutiveInteractionStabilityPrerequisites } from "../executiveInteractionStability.test";
import { evaluateMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateEngine";
import { resetProductionReadinessGateGuards } from "../launch-gate/productionReadinessGateGuards";
import { resetProductionReadinessGateStores } from "../launch-gate/productionReadinessGateStore";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import {
  mapLaunchDecisionToDemoState,
  preventDemoReadyWhileNoGo,
  resetDemoModeGuards,
} from "./demoModeGuards";
import { getDemoModeStore, resetDemoModeStores } from "./demoModeStore";
import { evaluateMVPDemoMode } from "./demoModeEngine";
import { integrateDemoModeWithCognition } from "./integrateDemoModeWithCognition";
import { selectLatestMVPDemoModeState } from "./demoModeSelectors";
import type { MVPDemoModeInput } from "./demoModeTypes";

function resetDemoModeTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetProductionReadinessGateStores();
  resetProductionReadinessGateGuards();
  resetDemoModeStores();
  resetDemoModeGuards();
}

function seedFullDemoRuntime(org: string) {
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
    now: 430_000,
  });
}

function demoInput(org: string, now: number, overrides?: Partial<MVPDemoModeInput>) {
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

  return {
    organizationId: org,
    productionReadinessGate: gate,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite,
    readinessDashboardStatus: "stable" as const,
    now,
    ...overrides,
  };
}

describe("mvp demo mode D9:10:7", () => {
  beforeEach(() => {
    resetDemoModeTestStacks();
  });

  it("skips when launch gate is missing", () => {
    const result = evaluateMVPDemoMode({ organizationId: "demo-skip-org", now: 1 });
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_launch_gate_depth");
  });

  it("no_go launch gate blocks demo mode", () => {
    const org = "demo-no-go-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 431_000);
    const blockedGate = {
      ...input.productionReadinessGate!,
      decision: "no_go" as const,
      blockers: [
        {
          blockerId: "b1",
          category: "smoke_test_status" as const,
          severity: "critical" as const,
          summary: "Smoke failed",
          remediation: "Fix smoke",
          generatedAt: 431_000,
        },
      ],
    };

    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: blockedGate });
    expect(result.demoMode?.demoState).toBe("blocked");
    expect(result.demoMode?.executiveDemoReadiness.headline).toMatch(/Critical issue blocks demo/i);
  });

  it("conditional_go maps to monitored demo state", () => {
    expect(mapLaunchDecisionToDemoState("conditional_go", false, true)).toBe("monitored");
    const org = "demo-monitored-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 432_000);
    const conditionalGate = {
      ...input.productionReadinessGate!,
      decision: "conditional_go" as const,
      readinessSummary: {
        ...input.productionReadinessGate!.readinessSummary,
        evidenceDepth: "full" as const,
      },
    };
    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: conditionalGate });
    expect(result.demoMode?.demoState).toBe("monitored");
    expect(result.demoMode?.executiveDemoReadiness.headline).toMatch(/Pilot readiness monitored/i);
  });

  it("go_for_demo maps to demo_ready", () => {
    const org = "demo-ready-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 433_000);
    const demoGate = {
      ...input.productionReadinessGate!,
      decision: "go_for_demo" as const,
      blockers: [],
      risks: [],
      readinessSummary: {
        ...input.productionReadinessGate!.readinessSummary,
        evidenceDepth: "full" as const,
      },
    };
    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: demoGate });
    expect(result.demoMode?.demoState).toBe("demo_ready");
    expect(result.demoMode?.executiveDemoReadiness.headline).toMatch(/Ready for controlled demo/i);
  });

  it("go_for_controlled_pilot maps to pilot_ready", () => {
    const org = "demo-pilot-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 434_000);
    const pilotGate = {
      ...input.productionReadinessGate!,
      decision: "go_for_controlled_pilot" as const,
      blockers: [],
      risks: [],
      readinessSummary: {
        ...input.productionReadinessGate!.readinessSummary,
        evidenceDepth: "full" as const,
      },
    };
    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: pilotGate });
    expect(result.demoMode?.demoState).toBe("pilot_ready");
  });

  it("critical smoke finding blocks demo", () => {
    const org = "demo-smoke-critical-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 435_000);
    const smoke = {
      ...input.smokeTestSuite!,
      status: "warn" as const,
      criticalFindings: [
        {
          findingId: "crit-1",
          scenarioId: "rapid_panel_switch",
          severity: "critical" as const,
          summary: "Panel instability",
          generatedAt: 435_000,
        },
      ],
    };
    const result = evaluateMVPDemoMode({ ...input, smokeTestSuite: smoke });
    expect(result.demoMode?.demoState).toBe("blocked");
  });

  it("missing evidence never becomes demo_ready", () => {
    const org = "demo-partial-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 436_000);
    const partialGate = {
      ...input.productionReadinessGate!,
      decision: "go_for_demo" as const,
      readinessSummary: {
        ...input.productionReadinessGate!.readinessSummary,
        evidenceDepth: "partial" as const,
      },
    };
    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: partialGate });
    expect(result.demoMode?.demoState).not.toBe("demo_ready");
    expect(result.demoMode?.demoState).toBe("monitored");
  });

  it("keeps critical risks visible to executive", () => {
    const org = "demo-visible-risk-org";
    seedFullDemoRuntime(org);
    const input = demoInput(org, 437_000);
    const blockedGate = {
      ...input.productionReadinessGate!,
      decision: "no_go" as const,
    };
    const result = evaluateMVPDemoMode({ ...input, productionReadinessGate: blockedGate });
    const critical = result.demoMode?.demoRisks.filter((r) => r.severity === "critical") ?? [];
    expect(critical.every((r) => r.visibleToExecutive)).toBe(true);
  });

  it("renders executive narrative without autonomous claims", () => {
    const org = "demo-narrative-org";
    seedFullDemoRuntime(org);
    const result = evaluateMVPDemoMode(demoInput(org, 438_000));
    const narrative = result.demoMode?.executiveNarrative;
    expect(narrative?.flow.length).toBeGreaterThan(0);
    expect(narrative?.caution).toMatch(/not autonomous/i);
    expect(narrative?.headline).not.toMatch(/\bAGI\b|self-aware/i);
    expect(narrative?.caution).not.toMatch(/production deployment|fully autonomous enterprise/i);
  });

  it("dedupes repeated demo evaluations", () => {
    const org = "demo-dedupe-org";
    seedFullDemoRuntime(org);
    const first = evaluateMVPDemoMode(demoInput(org, 439_000));
    const second = evaluateMVPDemoMode(demoInput(org, 439_050));
    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(getDemoModeStore(org).getState().demoModeSnapshots).toHaveLength(1);
  });

  it("preventDemoReadyWhileNoGo downgrades inflated demo posture", () => {
    const prevented = preventDemoReadyWhileNoGo("demo_ready", "no_go");
    expect(prevented.demoState).toBe("blocked");
    expect(prevented.downgraded).toBe(true);
  });

  it("integrates after launch gate without deployment side effects", () => {
    const org = "demo-integrate-org";
    seedFullDemoRuntime(org);
    const cognition = minimalCognition(org);
    demoInput(org, 440_000);
    const result = integrateDemoModeWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 440_100,
    });
    expect(result.evaluated).toBe(true);
    expect(selectLatestMVPDemoModeState(org)?.signature).toBe(result.demoMode?.signature);
  });
});
