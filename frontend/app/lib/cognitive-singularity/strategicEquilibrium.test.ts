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
import { evaluateEnterpriseAwarenessSynchronization } from "./awarenessSynchronizationEngine";
import { resetAwarenessSynchronizationGuards } from "./awarenessSynchronizationGuards";
import { resetAwarenessSynchronizationStores } from "./awarenessSynchronizationStore";
import { selectLatestEnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationSelectors";
import { evaluateUnifiedStrategicIntent } from "./strategicIntentEngine";
import { resetStrategicIntentGuards } from "./strategicIntentGuards";
import { resetStrategicIntentStores } from "./strategicIntentStore";
import { selectLatestUnifiedStrategicIntentSnapshot } from "./strategicIntentSelectors";
import { evaluateEnterpriseStrategicIdentity } from "./strategicIdentityEngine";
import { resetStrategicIdentityGuards } from "./strategicIdentityGuards";
import { resetStrategicIdentityStores } from "./strategicIdentityStore";
import { selectLatestEnterpriseStrategicIdentitySnapshot } from "./strategicIdentitySelectors";
import { evaluateUnifiedStrategicWill } from "./strategicWillEngine";
import { resetStrategicWillGuards } from "./strategicWillGuards";
import { resetStrategicWillStores } from "./strategicWillStore";
import { selectLatestEnterpriseStrategicWillSnapshot } from "./strategicWillSelectors";
import { evaluateUnifiedStrategicCoherence } from "./strategicCoherenceEngine";
import { resetStrategicCoherenceGuards } from "./strategicCoherenceGuards";
import { resetStrategicCoherenceStores } from "./strategicCoherenceStore";
import { selectLatestUnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceSelectors";
import {
  beginStrategicEquilibriumEvaluation,
  endStrategicEquilibriumEvaluation,
  resetStrategicEquilibriumGuards,
} from "./strategicEquilibriumGuards";
import { getStrategicEquilibriumStore, resetStrategicEquilibriumStores } from "./strategicEquilibriumStore";
import { evaluateEnterpriseStrategicEquilibrium } from "./strategicEquilibriumEngine";
import { integrateStrategicEquilibriumWithCognition } from "./integrateStrategicEquilibriumWithCognition";
import { selectLatestEnterpriseStrategicEquilibriumSnapshot } from "./strategicEquilibriumSelectors";

function resetStrategicEquilibriumTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetCognitiveSingularityStores();
  resetCognitiveSingularityGuards();
  resetAwarenessSynchronizationStores();
  resetAwarenessSynchronizationGuards();
  resetStrategicIntentStores();
  resetStrategicIntentGuards();
  resetStrategicIdentityStores();
  resetStrategicIdentityGuards();
  resetStrategicWillStores();
  resetStrategicWillGuards();
  resetStrategicCoherenceStores();
  resetStrategicCoherenceGuards();
  resetStrategicEquilibriumStores();
  resetStrategicEquilibriumGuards();
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
  now: number
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
  };
}

function strategicIntentEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
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
  };
}

function strategicIdentityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(org),
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
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
  };
}

function strategicWillEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    enterpriseStrategicIdentitySnapshot: selectLatestEnterpriseStrategicIdentitySnapshot(org),
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(org),
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
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
  };
}

function strategicCoherenceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    enterpriseStrategicWillSnapshot: selectLatestEnterpriseStrategicWillSnapshot(org),
    enterpriseStrategicIdentitySnapshot: selectLatestEnterpriseStrategicIdentitySnapshot(org),
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(org),
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
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
  };
}

function strategicEquilibriumEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateEnterpriseStrategicEquilibrium>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    unifiedStrategicCoherenceSnapshot: selectLatestUnifiedStrategicCoherenceSnapshot(org),
    enterpriseStrategicWillSnapshot: selectLatestEnterpriseStrategicWillSnapshot(org),
    enterpriseStrategicIdentitySnapshot: selectLatestEnterpriseStrategicIdentitySnapshot(org),
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(org),
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
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

function seedStrategicEquilibriumRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedUnifiedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateUnifiedInstitutionalConsciousnessRuntime(
    unifiedRuntimeEvalInput(organizationId, cognition, 279_000)
  );
  evaluateEnterpriseCognitiveSingularity(singularityEvalInput(organizationId, cognition, 290_000));
  evaluateEnterpriseAwarenessSynchronization(
    awarenessSyncEvalInput(organizationId, cognition, 300_000)
  );
  evaluateUnifiedStrategicIntent(strategicIntentEvalInput(organizationId, cognition, 310_000));
  evaluateEnterpriseStrategicIdentity(strategicIdentityEvalInput(organizationId, cognition, 320_000));
  evaluateUnifiedStrategicWill(strategicWillEvalInput(organizationId, cognition, 330_000));
  evaluateUnifiedStrategicCoherence(strategicCoherenceEvalInput(organizationId, cognition, 340_000));
}

describe("strategic equilibrium D9:9:7", () => {
  beforeEach(() => {
    resetStrategicEquilibriumTestStacks();
  });

  it("generates strategic equilibrium snapshots when strategic coherence is present", () => {
    const org = "se-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 350_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getStrategicEquilibriumStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects total-system balance with equilibrium signals", () => {
    const org = "se-balance-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 351_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicEquilibriumStore(org).getState().observations.some(
        (o) =>
          o.balanceSignals.includes("resilience_speed_balance") ||
          o.balanceSignals.includes("governance_adaptability_balance") ||
          o.balanceSignals.includes("consensus_diversity_balance")
      )
    ).toBe(true);
  });

  it("detects governance-execution imbalance under decision-runtime stress", () => {
    const org = "se-gov-slow-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const meta = selectLatestEnterpriseSelfReflectiveSnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 352_000, {
        unifiedSelfReflectiveSnapshot: meta
          ? {
              ...meta,
              summary: { ...meta.summary, governanceAlignment: "aligned" },
            }
          : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicEquilibriumStore(org).getState().observations.some(
        (o) =>
          o.balanceSignals.includes("over_governance_concentration") ||
          o.imbalanceRisks.includes("governance_execution_imbalance")
      )
    ).toBe(true);
  });

  it("detects consensus groupthink risk under weak diversity posture", () => {
    const org = "se-groupthink-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const consensus = selectLatestDistributedExecutiveCognitionSnapshot(org);
    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 353_000, {
        unifiedConsensusSnapshot: consensus
          ? {
              ...consensus,
              summary: { ...consensus.summary, diversityState: "weak_diversity_posture" },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicEquilibriumStore(org).getState().observations.some(
        (o) =>
          o.balanceSignals.includes("consensus_groupthink_risk") ||
          o.imbalanceRisks.includes("consensus_diversity_imbalance")
      )
    ).toBe(true);
  });

  it("skips when strategic coherence depth is insufficient", () => {
    const org = "se-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 354_000, {
        unifiedStrategicCoherenceSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_coherence_depth");
  });

  it("dedupes duplicate strategic equilibrium evaluations on unchanged signature", () => {
    const org = "se-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const first = integrateStrategicEquilibriumWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 355_000,
    });
    const second = integrateStrategicEquilibriumWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 355_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic equilibrium memory under caps", () => {
    const org = "se-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateEnterpriseStrategicEquilibrium(
        strategicEquilibriumEvalInput(
          org,
          { ...cognition, signature: `se-bounded-${i}` },
          356_000 + i * 600
        )
      );
    }

    const state = getStrategicEquilibriumStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic equilibrium evaluation", () => {
    expect(beginStrategicEquilibriumEvaluation()).toBe(true);
    expect(beginStrategicEquilibriumEvaluation()).toBe(true);
    expect(beginStrategicEquilibriumEvaluation()).toBe(false);
    endStrategicEquilibriumEvaluation();
    endStrategicEquilibriumEvaluation();
  });

  it("emits strategic equilibrium contract fields", () => {
    const org = "se-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicEquilibriumRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicEquilibrium(
      strategicEquilibriumEvalInput(org, cognition, 357_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.equilibriumId.length).toBeGreaterThan(0);
    expect(observation!.equilibriumState.length).toBeGreaterThan(0);
    expect(observation!.balanceStrength.length).toBeGreaterThan(0);
    expect(observation!.balanceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(357_000);
    expect(
      selectLatestEnterpriseStrategicEquilibriumSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
