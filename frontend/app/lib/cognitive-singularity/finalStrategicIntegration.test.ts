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
import { evaluateEnterpriseStrategicEquilibrium } from "./strategicEquilibriumEngine";
import { resetStrategicEquilibriumGuards } from "./strategicEquilibriumGuards";
import { resetStrategicEquilibriumStores } from "./strategicEquilibriumStore";
import { selectLatestEnterpriseStrategicEquilibriumSnapshot } from "./strategicEquilibriumSelectors";
import { evaluateUnifiedStrategicResonance } from "./strategicResonanceEngine";
import { resetStrategicResonanceGuards } from "./strategicResonanceGuards";
import { resetStrategicResonanceStores } from "./strategicResonanceStore";
import { selectLatestEnterpriseStrategicResonanceSnapshot } from "./strategicResonanceSelectors";
import {
  beginFinalStrategicIntegrationEvaluation,
  endFinalStrategicIntegrationEvaluation,
  resetFinalStrategicIntegrationGuards,
} from "./finalStrategicIntegrationGuards";
import {
  getFinalStrategicIntegrationStore,
  resetFinalStrategicIntegrationStores,
} from "./finalStrategicIntegrationStore";
import { evaluateFinalStrategicIntegration } from "./finalStrategicIntegrationEngine";
import { integrateFinalStrategicIntegrationWithCognition } from "./integrateFinalStrategicIntegrationWithCognition";
import { selectLatestFinalStrategicIntegrationSnapshot } from "./finalStrategicIntegrationSelectors";

function resetFinalStrategicIntegrationTestStacks(): void {
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
  resetStrategicResonanceStores();
  resetStrategicResonanceGuards();
  resetFinalStrategicIntegrationStores();
  resetFinalStrategicIntegrationGuards();
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

function finalStrategicIntegrationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateFinalStrategicIntegration>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    enterpriseStrategicResonanceSnapshot: selectLatestEnterpriseStrategicResonanceSnapshot(org),
    enterpriseStrategicEquilibriumSnapshot: selectLatestEnterpriseStrategicEquilibriumSnapshot(org),
    unifiedStrategicCoherenceSnapshot: selectLatestUnifiedStrategicCoherenceSnapshot(org),
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
    ...overrides,
  };
}

function strategicResonanceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    enterpriseStrategicEquilibriumSnapshot: selectLatestEnterpriseStrategicEquilibriumSnapshot(org),
    unifiedStrategicCoherenceSnapshot: selectLatestUnifiedStrategicCoherenceSnapshot(org),
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

function seedFinalStrategicIntegrationRuntime(
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
  evaluateEnterpriseStrategicEquilibrium(
    strategicEquilibriumEvalInput(organizationId, cognition, 350_000)
  );
  evaluateUnifiedStrategicResonance(strategicResonanceEvalInput(organizationId, cognition, 360_000));
}

describe("final strategic integration D9:9:9", () => {
  beforeEach(() => {
    resetFinalStrategicIntegrationTestStacks();
  });

  it("generates final integration snapshots when strategic resonance is present", () => {
    const org = "fsi-verify-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 370_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getFinalStrategicIntegrationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects total runtime convergence with integration signals", () => {
    const org = "fsi-convergence-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 371_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getFinalStrategicIntegrationStore(org).getState().observations.some(
        (o) =>
          o.integrationSignals.includes("runtime_convergence") ||
          o.integrationSignals.includes("foresight_action_integration") ||
          o.integrationSignals.includes("memory_identity_alignment")
      )
    ).toBe(true);
  });

  it("detects foresight-action disconnect under decision-runtime stress", () => {
    const org = "fsi-foresight-disconnect-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 372_000, {
        foresightSnapshot: foresight ? { ...foresight, runtimeStatus: "stable" } : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getFinalStrategicIntegrationStore(org).getState().observations.some(
        (o) =>
          o.integrationSignals.includes("foresight_action_disconnect") ||
          o.fragmentationRisks.includes("critical_strategic_disconnect")
      )
    ).toBe(true);
  });

  it("detects memory-identity disconnect under drifting identity", () => {
    const org = "fsi-memory-identity-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const identity = selectLatestEnterpriseStrategicIdentitySnapshot(org);
    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 373_000, {
        enterpriseStrategicIdentitySnapshot: identity
          ? {
              ...identity,
              strategicIdentitySummary: {
                ...identity.strategicIdentitySummary,
                dominantIdentityState: "drifting",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getFinalStrategicIntegrationStore(org).getState().observations.some(
        (o) =>
          o.integrationSignals.includes("memory_identity_disconnect") ||
          o.fragmentationRisks.includes("memory_identity_integration_gap")
      )
    ).toBe(true);
  });

  it("skips when strategic resonance depth is insufficient", () => {
    const org = "fsi-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 374_000, {
        enterpriseStrategicResonanceSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_resonance_depth");
  });

  it("dedupes duplicate final integration evaluations on unchanged signature", () => {
    const org = "fsi-dedupe-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const first = integrateFinalStrategicIntegrationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 375_000,
    });
    const second = integrateFinalStrategicIntegrationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 375_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded final integration memory under caps", () => {
    const org = "fsi-bounded-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateFinalStrategicIntegration(
        finalStrategicIntegrationEvalInput(
          org,
          { ...cognition, signature: `fsi-bounded-${i}` },
          376_000 + i * 600
        )
      );
    }

    const state = getFinalStrategicIntegrationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive final strategic integration evaluation", () => {
    expect(beginFinalStrategicIntegrationEvaluation()).toBe(true);
    expect(beginFinalStrategicIntegrationEvaluation()).toBe(true);
    expect(beginFinalStrategicIntegrationEvaluation()).toBe(false);
    endFinalStrategicIntegrationEvaluation();
    endFinalStrategicIntegrationEvaluation();
  });

  it("emits final strategic integration contract fields", () => {
    const org = "fsi-contract-org";
    const cognition = minimalCognition(org);
    seedFinalStrategicIntegrationRuntime(org, cognition);

    const result = evaluateFinalStrategicIntegration(
      finalStrategicIntegrationEvalInput(org, cognition, 377_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.integrationId.length).toBeGreaterThan(0);
    expect(observation!.integrationState.length).toBeGreaterThan(0);
    expect(observation!.integrationStrength.length).toBeGreaterThan(0);
    expect(observation!.integrationSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(377_000);
    expect(
      selectLatestFinalStrategicIntegrationSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
