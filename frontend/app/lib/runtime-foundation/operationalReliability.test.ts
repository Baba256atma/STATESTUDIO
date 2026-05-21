import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestCivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessSelectors";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { minimalCognition } from "../institutional-consciousness/institutionalConsciousness.test";
import { selectLatestFinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeSelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationSelectors";
import {
  beginOperationalReliabilityEvaluation,
  endOperationalReliabilityEvaluation,
  resetOperationalReliabilityGuards,
} from "./operationalReliabilityGuards";
import {
  getOperationalReliabilityStore,
  resetOperationalReliabilityStores,
} from "./operationalReliabilityStore";
import { evaluateExecutiveOperationalReliability } from "./operationalReliabilityEngine";
import { integrateOperationalReliabilityWithCognition } from "./integrateOperationalReliabilityWithCognition";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "./operationalReliabilitySelectors";
import { evaluateEnterpriseRuntimeFoundation } from "./enterpriseRuntimeFoundationEngine";
import {
  resetRuntimeFoundationTestStacks,
  seedRuntimeFoundationPrerequisites,
} from "./enterpriseRuntimeFoundation.test";

export function resetOperationalReliabilityTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetOperationalReliabilityStores();
  resetOperationalReliabilityGuards();
}

export function seedOperationalReliabilityPrerequisites(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedRuntimeFoundationPrerequisites(organizationId, cognition);
  evaluateEnterpriseRuntimeFoundation({
    organizationId,
    cognitionSnapshot: cognition,
    finalStrategicIntelligenceSnapshot: selectLatestFinalStrategicIntelligenceSnapshot(organizationId),
    unifiedInstitutionalConsciousnessSnapshot:
      selectLatestCivilizationScaleEnterpriseSnapshot(organizationId),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    cognitionConverged: true,
    runtimeStable: true,
    now: 390_000,
  });
}

function operationalReliabilityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveOperationalReliability>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(org),
    finalStrategicIntelligenceSnapshot: selectLatestFinalStrategicIntelligenceSnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
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

describe("executive operational reliability D9:10:2", () => {
  beforeEach(() => {
    resetOperationalReliabilityTestStacks();
  });

  it("generates operational reliability snapshots when runtime foundation is present", () => {
    const org = "eor-verify-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveOperationalReliability(
      operationalReliabilityEvalInput(org, cognition, 400_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.activeReliabilityCategories.length).toBeGreaterThanOrEqual(5);
  });

  it("emits panel and scene reliability signals under stable runtime", () => {
    const org = "eor-signals-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveOperationalReliability(
      operationalReliabilityEvalInput(org, cognition, 401_000, {
        panelRuntimeHealth: {
          panelStable: true,
          panelFlashDetected: false,
          disappearingPanelSymptom: false,
          transitionLatencyElevated: false,
        },
        sceneStability: {
          sceneReactionStable: true,
          sceneContractConsistent: true,
          reactionWithoutContractReason: false,
        },
        operationalTopologyStressed: false,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.reliabilitySignals.some(
        (s) => s === "panel_stability" || s === "scene_contract_consistency"
      )
    ).toBe(true);
  });

  it("skips when runtime foundation depth is insufficient", () => {
    const org = "eor-no-foundation-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveOperationalReliability(
      operationalReliabilityEvalInput(org, cognition, 402_000, {
        mvpStrategicReadinessSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_runtime_foundation_depth");
  });

  it("lowers trust when panel flash and scene instability are detected", () => {
    const org = "eor-instability-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveOperationalReliability(
      operationalReliabilityEvalInput(org, cognition, 403_000, {
        panelRuntimeHealth: {
          panelStable: false,
          panelFlashDetected: true,
          disappearingPanelSymptom: true,
          transitionLatencyElevated: true,
        },
        sceneStability: {
          sceneReactionStable: false,
          sceneContractConsistent: false,
          reactionWithoutContractReason: true,
        },
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.trustRisks.some(
        (r) => r === "panel_reliability_warning" || r === "runtime_trust_degradation"
      ) || result.snapshot?.trustState === "untrusted" || result.snapshot?.trustState === "monitored"
    ).toBe(true);
    expect(result.snapshot?.reliabilityLevel).not.toBe("production_ready");
  });

  it("dedupes duplicate operational reliability evaluations on unchanged signature", () => {
    const org = "eor-dedupe-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    const first = integrateOperationalReliabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      sessionHydrated: true,
      now: 404_000,
    });
    const second = integrateOperationalReliabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      sessionHydrated: true,
      now: 404_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded operational reliability memory under caps", () => {
    const org = "eor-bounded-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveOperationalReliability(
        operationalReliabilityEvalInput(
          org,
          { ...cognition, signature: `eor-bounded-${i}` },
          405_000 + i * 600
        )
      );
    }

    const state = getOperationalReliabilityStore(org).getState();
    expect(state.reliabilitySnapshots.length).toBeLessThanOrEqual(8);
    expect(state.trustHistory.length).toBeLessThanOrEqual(10);
  });

  it("blocks recursive operational reliability evaluation", () => {
    expect(beginOperationalReliabilityEvaluation()).toBe(true);
    expect(beginOperationalReliabilityEvaluation()).toBe(true);
    expect(beginOperationalReliabilityEvaluation()).toBe(false);
    endOperationalReliabilityEvaluation();
    endOperationalReliabilityEvaluation();
  });

  it("emits executive operational reliability contract fields without AGI claims", () => {
    const org = "eor-contract-org";
    const cognition = minimalCognition(org);
    seedOperationalReliabilityPrerequisites(org, cognition);

    const result = evaluateExecutiveOperationalReliability(
      operationalReliabilityEvalInput(org, cognition, 406_000)
    );

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.reliabilityId.length).toBeGreaterThan(0);
    expect(snapshot!.trustState.length).toBeGreaterThan(0);
    expect(snapshot!.reliabilityLevel.length).toBeGreaterThan(0);
    expect(snapshot!.reliabilitySignals.length).toBeGreaterThan(0);
    expect(snapshot!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(snapshot!.confidence).toBeLessThanOrEqual(0.93);
    expect(snapshot!.summary).not.toMatch(/AGI|self-aware|conscious/i);
    expect(selectLatestExecutiveOperationalReliabilitySnapshot(org)?.reliabilityObservations.length).toBe(
      7
    );
  });
});
