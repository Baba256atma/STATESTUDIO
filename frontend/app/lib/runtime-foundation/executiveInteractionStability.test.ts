import { describe, expect, it, beforeEach } from "vitest";

import { minimalCognition } from "../institutional-consciousness/institutionalConsciousness.test";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestFinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeSelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "./operationalReliabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationSelectors";
import {
  beginExecutiveInteractionStabilityEvaluation,
  endExecutiveInteractionStabilityEvaluation,
  resetExecutiveInteractionStabilityGuards,
} from "./executiveInteractionStabilityGuards";
import {
  getExecutiveInteractionStabilityStore,
  resetExecutiveInteractionStabilityStores,
} from "./executiveInteractionStabilityStore";
import { evaluateExecutiveInteractionStability } from "./executiveInteractionStabilityEngine";
import { integrateExecutiveInteractionStabilityWithCognition } from "./integrateExecutiveInteractionStabilityWithCognition";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "./executiveInteractionStabilitySelectors";
import { evaluateExecutiveOperationalReliability } from "./operationalReliabilityEngine";
import {
  resetOperationalReliabilityTestStacks,
  seedOperationalReliabilityPrerequisites,
} from "./operationalReliability.test";

function resetExecutiveInteractionStabilityTestStacks(): void {
  resetOperationalReliabilityTestStacks();
  resetExecutiveInteractionStabilityStores();
  resetExecutiveInteractionStabilityGuards();
}

export function seedExecutiveInteractionStabilityPrerequisites(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedOperationalReliabilityPrerequisites(organizationId, cognition);
  evaluateExecutiveOperationalReliability({
    organizationId,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(organizationId),
    finalStrategicIntelligenceSnapshot:
      selectLatestFinalStrategicIntelligenceSnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    cognitionConverged: true,
    runtimeStable: true,
    sessionHydrated: true,
    now: 400_000,
  });
}

function interactionStabilityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveInteractionStability>[0]>
) {
  return {
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
    now,
    ...overrides,
  };
}

describe("executive interaction stability D9:10:3", () => {
  beforeEach(() => {
    resetExecutiveInteractionStabilityTestStacks();
  });

  it("generates UI stability snapshots when operational reliability is present", () => {
    const org = "eis-verify-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveInteractionStability(
      interactionStabilityEvalInput(org, cognition, 410_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.activeStabilityCategories.length).toBeGreaterThanOrEqual(5);
  });

  it("emits panel and scene stability signals under stable UI runtime", () => {
    const org = "eis-signals-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveInteractionStability(
      interactionStabilityEvalInput(org, cognition, 411_000, {
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
        operationalTopologyStressed: false,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.stabilitySignals.some(
        (s) => s === "panel_state_stable" || s === "scene_signature_consistent"
      )
    ).toBe(true);
  });

  it("skips when operational reliability depth is insufficient", () => {
    const org = "eis-no-operational-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveInteractionStability(
      interactionStabilityEvalInput(org, cognition, 412_000, {
        operationalReliabilitySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_operational_reliability_depth");
  });

  it("detects panel flash and lowers UI reliability", () => {
    const org = "eis-flash-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveInteractionStability(
      interactionStabilityEvalInput(org, cognition, 413_000, {
        panelRuntimeReliability: {
          panelStable: false,
          panelFlashDetected: true,
          panelOscillationDetected: true,
          rightRailViewStable: false,
          panelViewSignature: "oscillating-panel",
        },
        sceneInteractionReliability: {
          sceneSignature: "unstable-scene",
          sceneContractValid: false,
          duplicateSceneReaction: true,
          reactionWithoutContract: true,
        },
        chatInteractionReliability: {
          chatPipelineSignature: "loop-chat",
          chatPipelineDeduped: false,
          duplicatePanelUpdateForSameInput: true,
          chatPanelSceneLoopRisk: true,
        },
        selectionInteraction: {
          selectionContextPreserved: false,
          selectedObjectId: "obj-1",
          selectionLostDuringAnalysis: true,
        },
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.uiRisks.some(
        (r) =>
          r === "panel_flash_warning" ||
          r === "scene_instability_signal" ||
          r === "duplicate_interaction_warning"
      ) || result.snapshot?.uiState === "unstable" || result.snapshot?.uiState === "monitored"
    ).toBe(true);
    expect(result.snapshot?.reliabilityLevel).not.toBe("executive_grade");
  });

  it("dedupes duplicate interaction stability evaluations on unchanged signature", () => {
    const org = "eis-dedupe-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    const first = integrateExecutiveInteractionStabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      sessionHydrated: true,
      now: 414_000,
    });
    const second = integrateExecutiveInteractionStabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      sessionHydrated: true,
      now: 414_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded interaction stability memory under caps", () => {
    const org = "eis-bounded-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveInteractionStability(
        interactionStabilityEvalInput(
          org,
          { ...cognition, signature: `eis-bounded-${i}` },
          415_000 + i * 600
        )
      );
    }

    const state = getExecutiveInteractionStabilityStore(org).getState();
    expect(state.stabilitySnapshots.length).toBeLessThanOrEqual(8);
    expect(state.interactionHistory.length).toBeLessThanOrEqual(10);
  });

  it("blocks recursive executive interaction stability evaluation", () => {
    expect(beginExecutiveInteractionStabilityEvaluation()).toBe(true);
    expect(beginExecutiveInteractionStabilityEvaluation()).toBe(true);
    expect(beginExecutiveInteractionStabilityEvaluation()).toBe(false);
    endExecutiveInteractionStabilityEvaluation();
    endExecutiveInteractionStabilityEvaluation();
  });

  it("emits executive interaction stability contract fields", () => {
    const org = "eis-contract-org";
    const cognition = minimalCognition(org);
    seedExecutiveInteractionStabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveInteractionStability(
      interactionStabilityEvalInput(org, cognition, 416_000)
    );

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.interactionStabilityId.length).toBeGreaterThan(0);
    expect(snapshot!.uiState.length).toBeGreaterThan(0);
    expect(snapshot!.reliabilityLevel.length).toBeGreaterThan(0);
    expect(snapshot!.stabilitySignals.length).toBeGreaterThan(0);
    expect(snapshot!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(snapshot!.confidence).toBeLessThanOrEqual(0.93);
    expect(snapshot!.summary).not.toMatch(/AGI|self-aware|conscious/i);
    expect(selectLatestExecutiveInteractionStabilitySnapshot(org)?.stabilityObservations.length).toBe(
      7
    );
  });
});
