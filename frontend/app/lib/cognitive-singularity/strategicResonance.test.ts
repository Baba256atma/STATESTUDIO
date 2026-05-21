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
import {
  beginStrategicResonanceEvaluation,
  endStrategicResonanceEvaluation,
  resetStrategicResonanceGuards,
} from "./strategicResonanceGuards";
import { getStrategicResonanceStore, resetStrategicResonanceStores } from "./strategicResonanceStore";
import { evaluateUnifiedStrategicResonance } from "./strategicResonanceEngine";
import { integrateStrategicResonanceWithCognition } from "./integrateStrategicResonanceWithCognition";
import { selectLatestEnterpriseStrategicResonanceSnapshot } from "./strategicResonanceSelectors";

function resetStrategicResonanceTestStacks(): void {
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

function strategicResonanceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedStrategicResonance>[0]>
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
    ...overrides,
  };
}

function seedStrategicResonanceRuntime(
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
}

describe("strategic resonance D9:9:8", () => {
  beforeEach(() => {
    resetStrategicResonanceTestStacks();
  });

  it("generates strategic resonance snapshots when strategic equilibrium is present", () => {
    const org = "sr-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 360_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getStrategicResonanceStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects cross-system resonance with harmonic signals", () => {
    const org = "sr-harmonic-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 361_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicResonanceStore(org).getState().observations.some(
        (o) =>
          o.resonanceSignals.includes("memory_foresight_resonance") ||
          o.resonanceSignals.includes("foresight_decision_alignment") ||
          o.resonanceSignals.includes("consensus_meta_stability")
      )
    ).toBe(true);
  });

  it("detects unsafe overconfidence amplification under elevated trust calibration", () => {
    const org = "sr-overconfidence-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const meta = selectLatestEnterpriseSelfReflectiveSnapshot(org);
    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 362_000, {
        unifiedSelfReflectiveSnapshot: meta
          ? {
              ...meta,
              summary: {
                ...meta.summary,
                trustCalibration: "elevated",
                uncertaintyPosture: "suppressed",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicResonanceStore(org).getState().observations.some(
        (o) =>
          o.resonanceSignals.includes("unsafe_overconfidence_amplification") ||
          o.amplificationRisks.includes("overconfidence_spread_risk")
      )
    ).toBe(true);
  });

  it("detects strategic dissonance under equilibrium and coherence strain", () => {
    const org = "sr-dissonance-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const equilibrium = selectLatestEnterpriseStrategicEquilibriumSnapshot(org);
    const coherence = selectLatestUnifiedStrategicCoherenceSnapshot(org);
    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 363_000, {
        enterpriseStrategicEquilibriumSnapshot: equilibrium
          ? {
              ...equilibrium,
              strategicEquilibriumSummary: {
                ...equilibrium.strategicEquilibriumSummary,
                dominantEquilibriumState: "imbalanced",
              },
            }
          : null,
        unifiedStrategicCoherenceSnapshot: coherence
          ? {
              ...coherence,
              totalSystemAlignmentSummary: {
                ...coherence.totalSystemAlignmentSummary,
                dominantCoherenceState: "drifting",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicResonanceStore(org).getState().observations.some(
        (o) =>
          o.resonanceSignals.includes("strategic_dissonance") ||
          o.amplificationRisks.includes("cross_system_reinforcement_strain")
      )
    ).toBe(true);
  });

  it("skips when strategic equilibrium depth is insufficient", () => {
    const org = "sr-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 364_000, {
        enterpriseStrategicEquilibriumSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_equilibrium_depth");
  });

  it("dedupes duplicate strategic resonance evaluations on unchanged signature", () => {
    const org = "sr-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const first = integrateStrategicResonanceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 365_000,
    });
    const second = integrateStrategicResonanceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 365_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic resonance memory under caps", () => {
    const org = "sr-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedStrategicResonance(
        strategicResonanceEvalInput(
          org,
          { ...cognition, signature: `sr-bounded-${i}` },
          366_000 + i * 600
        )
      );
    }

    const state = getStrategicResonanceStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic resonance evaluation", () => {
    expect(beginStrategicResonanceEvaluation()).toBe(true);
    expect(beginStrategicResonanceEvaluation()).toBe(true);
    expect(beginStrategicResonanceEvaluation()).toBe(false);
    endStrategicResonanceEvaluation();
    endStrategicResonanceEvaluation();
  });

  it("emits strategic resonance contract fields", () => {
    const org = "sr-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicResonanceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicResonance(
      strategicResonanceEvalInput(org, cognition, 367_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.resonanceId.length).toBeGreaterThan(0);
    expect(observation!.resonanceState.length).toBeGreaterThan(0);
    expect(observation!.resonanceStrength.length).toBeGreaterThan(0);
    expect(observation!.resonanceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(367_000);
    expect(
      selectLatestEnterpriseStrategicResonanceSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
