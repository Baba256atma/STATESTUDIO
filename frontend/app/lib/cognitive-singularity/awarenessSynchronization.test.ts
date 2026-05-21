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
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { minimalCognition, resetInstitutionalConsciousnessTestStacks } from "../institutional-consciousness/institutionalConsciousness.test";
import { evaluateEnterpriseCognitiveSingularity } from "./cognitiveSingularityEngine";
import { resetCognitiveSingularityGuards } from "./cognitiveSingularityGuards";
import { resetCognitiveSingularityStores } from "./cognitiveSingularityStore";
import { selectLatestEnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularitySelectors";
import {
  beginAwarenessSynchronizationEvaluation,
  endAwarenessSynchronizationEvaluation,
  resetAwarenessSynchronizationGuards,
} from "./awarenessSynchronizationGuards";
import {
  getAwarenessSynchronizationStore,
  resetAwarenessSynchronizationStores,
} from "./awarenessSynchronizationStore";
import { evaluateEnterpriseAwarenessSynchronization } from "./awarenessSynchronizationEngine";
import { integrateAwarenessSynchronizationWithCognition } from "./integrateAwarenessSynchronizationWithCognition";
import { selectLatestEnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationSelectors";

function resetAwarenessSynchronizationTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetCognitiveSingularityStores();
  resetCognitiveSingularityGuards();
  resetAwarenessSynchronizationStores();
  resetAwarenessSynchronizationGuards();
}

function singularityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
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
  };
}

function awarenessSyncEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateEnterpriseAwarenessSynchronization>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    cognitiveSingularitySnapshot: selectLatestEnterpriseCognitiveSingularitySnapshot(org),
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

function seedAwarenessSynchronizationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedUnifiedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateUnifiedInstitutionalConsciousnessRuntime(
    unifiedRuntimeEvalInput(organizationId, cognition, 279_000)
  );
  evaluateEnterpriseCognitiveSingularity(singularityEvalInput(organizationId, cognition, 290_000));
}

describe("awareness synchronization D9:9:2", () => {
  beforeEach(() => {
    resetAwarenessSynchronizationTestStacks();
  });

  it("generates awareness synchronization snapshots when cognitive singularity is present", () => {
    const org = "as-verify-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 300_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getAwarenessSynchronizationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise awareness synchronization with synchronized domains", () => {
    const org = "as-sync-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 301_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getAwarenessSynchronizationStore(org).getState().observations.some(
        (o) =>
          o.synchronizedDomains.includes("operational") ||
          o.synchronizedDomains.includes("foresight") ||
          o.synchronizedDomains.includes("decision_orchestration")
      )
    ).toBe(true);
  });

  it("detects awareness fragmentation under memory-operational stress", () => {
    const org = "as-fragment-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const memory = selectLatestEnterpriseMemorySnapshot(org);
    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 302_000, {
        memorySnapshot: memory
          ? {
              ...memory,
              runtimeStatus: "stable",
              summary: { ...memory.summary, cognitiveIntegrity: "verified" },
            }
          : null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getAwarenessSynchronizationStore(org).getState().observations.some(
        (o) =>
          o.fragmentationRisks.includes("memory_operational_interpretation_drift") ||
          o.synchronizedDomains.includes("institutional_memory")
      )
    ).toBe(true);
  });

  it("detects cross-domain synchronization warning under foresight-decision drift", () => {
    const org = "as-drift-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 303_000, {
        foresightSnapshot: foresight ? { ...foresight, runtimeStatus: "stable" } : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getAwarenessSynchronizationStore(org).getState().observations.some(
        (o) =>
          o.fragmentationRisks.includes("foresight_decision_runtime_divergence") ||
          o.synchronizedDomains.includes("decision_orchestration")
      )
    ).toBe(true);
  });

  it("skips when cognitive singularity depth is insufficient", () => {
    const org = "as-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 304_000, {
        cognitiveSingularitySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_cognitive_singularity_depth");
  });

  it("dedupes duplicate awareness synchronization evaluations on unchanged signature", () => {
    const org = "as-dedupe-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const first = integrateAwarenessSynchronizationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 305_000,
    });
    const second = integrateAwarenessSynchronizationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 305_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded awareness synchronization memory under caps", () => {
    const org = "as-bounded-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateEnterpriseAwarenessSynchronization(
        awarenessSyncEvalInput(
          org,
          { ...cognition, signature: `as-bounded-${i}` },
          306_000 + i * 600
        )
      );
    }

    const state = getAwarenessSynchronizationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive awareness synchronization evaluation", () => {
    expect(beginAwarenessSynchronizationEvaluation()).toBe(true);
    expect(beginAwarenessSynchronizationEvaluation()).toBe(true);
    expect(beginAwarenessSynchronizationEvaluation()).toBe(false);
    endAwarenessSynchronizationEvaluation();
    endAwarenessSynchronizationEvaluation();
  });

  it("emits awareness synchronization contract fields", () => {
    const org = "as-contract-org";
    const cognition = minimalCognition(org);
    seedAwarenessSynchronizationRuntime(org, cognition);

    const result = evaluateEnterpriseAwarenessSynchronization(
      awarenessSyncEvalInput(org, cognition, 307_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.synchronizationId.length).toBeGreaterThan(0);
    expect(observation!.awarenessState.length).toBeGreaterThan(0);
    expect(observation!.synchronizationStrength.length).toBeGreaterThan(0);
    expect(observation!.synchronizedDomains.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(307_000);
    expect(
      selectLatestEnterpriseAwarenessSynchronizationSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
