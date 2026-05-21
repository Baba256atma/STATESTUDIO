import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestCivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessSelectors";
import {
  seedUnifiedInstitutionalConsciousnessRuntime,
  unifiedRuntimeEvalInput,
} from "../institutional-consciousness/unifiedInstitutionalConsciousness.test";
import { evaluateUnifiedInstitutionalConsciousnessRuntime } from "../institutional-consciousness/unifiedInstitutionalConsciousnessEngine";
import {
  beginCognitiveSingularityEvaluation,
  endCognitiveSingularityEvaluation,
  resetCognitiveSingularityGuards,
} from "./cognitiveSingularityGuards";
import {
  getCognitiveSingularityStore,
  resetCognitiveSingularityStores,
} from "./cognitiveSingularityStore";
import { evaluateEnterpriseCognitiveSingularity } from "./cognitiveSingularityEngine";
import { integrateCognitiveSingularityWithCognition } from "./integrateCognitiveSingularityWithCognition";
import { selectLatestEnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularitySelectors";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { minimalCognition, resetInstitutionalConsciousnessTestStacks } from "../institutional-consciousness/institutionalConsciousness.test";

function resetCognitiveSingularityTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetCognitiveSingularityStores();
  resetCognitiveSingularityGuards();
}

function singularityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateEnterpriseCognitiveSingularity>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    unifiedInstitutionalConsciousnessSnapshot: selectLatestCivilizationScaleEnterpriseSnapshot(org),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    cognitionConverged: true,
    now,
    ...overrides,
  };
}

function seedCognitiveSingularityRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedUnifiedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateUnifiedInstitutionalConsciousnessRuntime(
    unifiedRuntimeEvalInput(organizationId, cognition, 279_000)
  );
}

describe("cognitive singularity D9:9:1", () => {
  beforeEach(() => {
    resetCognitiveSingularityTestStacks();
  });

  it("generates cognitive singularity snapshots when unified institutional consciousness is present", () => {
    const org = "cs-verify-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    const result = evaluateEnterpriseCognitiveSingularity(
      singularityEvalInput(org, cognition, 290_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCognitiveSingularityStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise strategic convergence with convergence signals", () => {
    const org = "cs-convergence-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    const result = evaluateEnterpriseCognitiveSingularity(
      singularityEvalInput(org, cognition, 291_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveSingularityStore(org).getState().observations.some(
        (o) =>
          o.convergenceSignals.includes("cross_domain_alignment") ||
          o.convergenceSignals.includes("strategic_awareness_synchronization") ||
          o.convergenceSignals.includes("enterprise_cognition_unification")
      )
    ).toBe(true);
  });

  it("detects convergence instability under temporal-decision drift stress", () => {
    const org = "cs-drift-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateEnterpriseCognitiveSingularity(
      singularityEvalInput(org, cognition, 292_000, {
        temporalSnapshot: temporal
          ? { ...temporal, runtimeStatus: "unstable" }
          : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveSingularityStore(org).getState().observations.some(
        (o) =>
          o.convergenceSignals.includes("convergence_instability_warning") ||
          o.convergenceSignals.includes("temporal_decision_divergence")
      )
    ).toBe(true);
  });

  it("skips when institutional consciousness depth is insufficient", () => {
    const org = "cs-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateEnterpriseCognitiveSingularity(
      singularityEvalInput(org, cognition, 293_000, {
        unifiedInstitutionalConsciousnessSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_institutional_consciousness_depth");
  });

  it("dedupes duplicate cognitive singularity evaluations on unchanged signature", () => {
    const org = "cs-dedupe-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    const first = integrateCognitiveSingularityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 294_000,
    });
    const second = integrateCognitiveSingularityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 294_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded cognitive singularity memory under caps", () => {
    const org = "cs-bounded-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateEnterpriseCognitiveSingularity(
        singularityEvalInput(
          org,
          { ...cognition, signature: `cs-bounded-${i}` },
          295_000 + i * 600
        )
      );
    }

    const state = getCognitiveSingularityStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive cognitive singularity evaluation", () => {
    expect(beginCognitiveSingularityEvaluation()).toBe(true);
    expect(beginCognitiveSingularityEvaluation()).toBe(true);
    expect(beginCognitiveSingularityEvaluation()).toBe(false);
    endCognitiveSingularityEvaluation();
    endCognitiveSingularityEvaluation();
  });

  it("emits cognitive singularity contract fields", () => {
    const org = "cs-contract-org";
    const cognition = minimalCognition(org);
    seedCognitiveSingularityRuntime(org, cognition);

    const result = evaluateEnterpriseCognitiveSingularity(
      singularityEvalInput(org, cognition, 296_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.convergenceId.length).toBeGreaterThan(0);
    expect(observation!.cognitionState.length).toBeGreaterThan(0);
    expect(observation!.convergenceStrength.length).toBeGreaterThan(0);
    expect(observation!.convergenceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(296_000);
    expect(
      selectLatestEnterpriseCognitiveSingularitySnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
