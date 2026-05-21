import { describe, expect, it, beforeEach } from "vitest";

import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { evaluateExecutiveInteractionStability } from "../executiveInteractionStabilityEngine";
import { seedExecutiveInteractionStabilityPrerequisites } from "../executiveInteractionStability.test";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { minimalCognition } from "../../institutional-consciousness/institutionalConsciousness.test";
import type { MVPSmokeTestRuntimeContext } from "./mvpSmokeTestTypes";
import { MVP_SMOKE_TEST_SCENARIOS } from "./mvpSmokeTestScenarios";
import {
  deriveMVPValidationStatus,
  getCriticalSmokeFindings,
  summarizeMVPSmokeTestResults,
} from "./mvpSmokeTestSummary";
import { buildMVPSmokeTestRuntimeContext, runMVPSmokeTestSuite } from "./mvpSmokeTestRunner";

function resetSmokeTestStores(): void {
  resetRuntimeFoundationTestStacks();
}

function seedFullMvpRuntime(org: string) {
  const cognition = minimalCognition(org);
  seedExecutiveInteractionStabilityPrerequisites(org, cognition);
  evaluateExecutiveInteractionStability({
    organizationId: org,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(org),
    operationalReliabilitySnapshot: selectLatestExecutiveOperationalReliabilitySnapshot(org),
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    cognitionConverged: true,
    runtimeStable: true,
    sessionHydrated: true,
    now: 410_000,
  });
}

function unstableContext(org: string): MVPSmokeTestRuntimeContext {
  const ctx = buildMVPSmokeTestRuntimeContext(org);
  if (!ctx.interaction || !ctx.operational) return ctx;
  return {
    ...ctx,
    operational: {
      ...ctx.operational,
      trustState: "untrusted",
      reliabilityLevel: "weak",
    },
    interaction: {
      ...ctx.interaction,
      panelRuntimeReliability: {
        ...ctx.interaction.panelRuntimeReliability,
        panelStable: false,
        panelFlashDetected: true,
        panelOscillationDetected: true,
      },
      sceneInteractionReliability: {
        ...ctx.interaction.sceneInteractionReliability,
        sceneContractValid: false,
        reactionWithoutContract: true,
        duplicateSceneReaction: true,
      },
      chatInteractionReliability: {
        ...ctx.interaction.chatInteractionReliability,
        chatPipelineDeduped: false,
        duplicatePanelUpdateForSameInput: true,
        chatPanelSceneLoopRisk: true,
      },
      productionSafeUISummary: {
        ...ctx.interaction.productionSafeUISummary,
        selectionState: "at_risk",
      },
      uiRisks: ["context_persistence_risk", "panel_flash_warning"],
    },
  };
}

describe("mvp smoke test harness D9:10:5", () => {
  beforeEach(() => {
    resetSmokeTestStores();
  });

  it("defines eight deterministic smoke scenarios", () => {
    expect(MVP_SMOKE_TEST_SCENARIOS.length).toBe(8);
    expect(MVP_SMOKE_TEST_SCENARIOS.map((s) => s.id)).toContain("runtime_trust_stability");
  });

  it("runs smoke suite deterministically with stable context", () => {
    const org = "smoke-stable-org";
    seedFullMvpRuntime(org);

    const first = runMVPSmokeTestSuite({ organizationId: org, now: 500_000 });
    const second = runMVPSmokeTestSuite({ organizationId: org, now: 500_000 });

    expect(first.suiteId).toBe("mvp_runtime_smoke_suite");
    expect(first.results.length).toBe(8);
    expect(first.signature).toBe(second.signature);
    expect(first.passed + first.warned + first.failed + first.skipped).toBe(8);
  });

  it("falls back safely when runtime signals are missing", () => {
    const suite = runMVPSmokeTestSuite({ organizationId: "smoke-empty-org", now: 501_000 });
    expect(suite.skipped).toBeGreaterThan(0);
    expect(suite.results.find((r) => r.scenarioId === "readiness_dashboard_fallback")?.status).toBe(
      "pass"
    );
  });

  it("detects panel flash and scene instability failures", () => {
    const org = "smoke-unstable-org";
    seedFullMvpRuntime(org);
    const suite = runMVPSmokeTestSuite({
      organizationId: org,
      context: unstableContext(org),
      now: 502_000,
    });

    expect(suite.failed).toBeGreaterThan(0);
    expect(suite.criticalFindings.length).toBeGreaterThan(0);
    expect(
      suite.results.some(
        (r) => r.status === "fail" && r.scenarioId === "rapid_panel_switch"
      )
    ).toBe(true);
  });

  it("dedupes critical findings in summary", () => {
    const results = [
      {
        scenarioId: "a",
        status: "fail" as const,
        headline: "fail",
        detail: "d",
        findings: [
          {
            findingId: "dup-1",
            scenarioId: "a",
            severity: "critical" as const,
            summary: "same",
            generatedAt: 1,
          },
          {
            findingId: "dup-1",
            scenarioId: "a",
            severity: "critical" as const,
            summary: "same",
            generatedAt: 1,
          },
        ],
        evaluatedAt: 1,
      },
    ];
    const critical = getCriticalSmokeFindings(results);
    expect(critical.length).toBe(1);
  });

  it("derives validation status from result counts", () => {
    expect(deriveMVPValidationStatus(6, 2, 0, 0)).toBe("warn");
    expect(deriveMVPValidationStatus(8, 0, 0, 0)).toBe("pass");
    expect(deriveMVPValidationStatus(0, 0, 1, 7)).toBe("fail");
  });

  it("produces recommendations without false production-ready claims", () => {
    const org = "smoke-rec-org";
    seedFullMvpRuntime(org);
    const suite = runMVPSmokeTestSuite({ organizationId: org, now: 503_000 });
    const summary = summarizeMVPSmokeTestResults(org, suite.results);
    expect(summary.recommendations.length).toBeGreaterThan(0);
    expect(suite.recommendations.join(" ")).not.toMatch(/AGI|self-aware|conscious/i);
  });
});
