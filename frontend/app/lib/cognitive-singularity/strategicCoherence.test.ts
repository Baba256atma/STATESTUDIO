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
import {
  beginStrategicCoherenceEvaluation,
  endStrategicCoherenceEvaluation,
  resetStrategicCoherenceGuards,
} from "./strategicCoherenceGuards";
import { getStrategicCoherenceStore, resetStrategicCoherenceStores } from "./strategicCoherenceStore";
import { evaluateUnifiedStrategicCoherence } from "./strategicCoherenceEngine";
import { integrateStrategicCoherenceWithCognition } from "./integrateStrategicCoherenceWithCognition";
import { selectLatestUnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceSelectors";

function resetStrategicCoherenceTestStacks(): void {
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
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedStrategicCoherence>[0]>
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
    ...overrides,
  };
}

function seedStrategicCoherenceRuntime(
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
}

describe("strategic coherence D9:9:6", () => {
  beforeEach(() => {
    resetStrategicCoherenceTestStacks();
  });

  it("generates strategic coherence snapshots when strategic will is present", () => {
    const org = "sc-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 340_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getStrategicCoherenceStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects total-system coherence with alignment signals", () => {
    const org = "sc-align-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 341_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicCoherenceStore(org).getState().observations.some(
        (o) =>
          o.coherenceSignals.includes("cross_runtime_alignment") ||
          o.coherenceSignals.includes("foresight_decision_consistency") ||
          o.coherenceSignals.includes("intent_identity_will_coherence")
      )
    ).toBe(true);
  });

  it("detects foresight-decision misalignment under decision-runtime stress", () => {
    const org = "sc-misalign-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 342_000, {
        foresightSnapshot: foresight ? { ...foresight, runtimeStatus: "stable" } : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicCoherenceStore(org).getState().observations.some(
        (o) =>
          o.coherenceSignals.includes("foresight_decision_misalignment") ||
          o.misalignmentRisks.includes("foresight_decision_runtime_divergence")
      )
    ).toBe(true);
  });

  it("detects intent-identity-will mismatch under partial strategic layers", () => {
    const org = "sc-mismatch-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const intent = selectLatestUnifiedStrategicIntentSnapshot(org);
    const identity = selectLatestEnterpriseStrategicIdentitySnapshot(org);
    const will = selectLatestEnterpriseStrategicWillSnapshot(org);
    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 343_000, {
        unifiedStrategicIntentSnapshot: intent
          ? {
              ...intent,
              strategicIntentSummary: {
                ...intent.strategicIntentSummary,
                dominantIntentState: "partially_aligned",
              },
            }
          : null,
        enterpriseStrategicIdentitySnapshot: identity
          ? {
              ...identity,
              strategicIdentitySummary: {
                ...identity.strategicIdentitySummary,
                dominantIdentityState: "partially_consistent",
              },
            }
          : null,
        enterpriseStrategicWillSnapshot: will
          ? {
              ...will,
              strategicWillSummary: {
                ...will.strategicWillSummary,
                dominantWillState: "hesitant",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicCoherenceStore(org).getState().observations.some(
        (o) =>
          o.coherenceSignals.includes("intent_identity_will_mismatch") ||
          o.misalignmentRisks.includes("strategic_coherence_fragmentation_risk")
      )
    ).toBe(true);
  });

  it("skips when strategic will depth is insufficient", () => {
    const org = "sc-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 344_000, {
        enterpriseStrategicWillSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_will_depth");
  });

  it("dedupes duplicate strategic coherence evaluations on unchanged signature", () => {
    const org = "sc-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const first = integrateStrategicCoherenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 345_000,
    });
    const second = integrateStrategicCoherenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 345_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic coherence memory under caps", () => {
    const org = "sc-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedStrategicCoherence(
        strategicCoherenceEvalInput(
          org,
          { ...cognition, signature: `sc-bounded-${i}` },
          346_000 + i * 600
        )
      );
    }

    const state = getStrategicCoherenceStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic coherence evaluation", () => {
    expect(beginStrategicCoherenceEvaluation()).toBe(true);
    expect(beginStrategicCoherenceEvaluation()).toBe(true);
    expect(beginStrategicCoherenceEvaluation()).toBe(false);
    endStrategicCoherenceEvaluation();
    endStrategicCoherenceEvaluation();
  });

  it("emits strategic coherence contract fields", () => {
    const org = "sc-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicCoherenceRuntime(org, cognition);

    const result = evaluateUnifiedStrategicCoherence(
      strategicCoherenceEvalInput(org, cognition, 347_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.coherenceId.length).toBeGreaterThan(0);
    expect(observation!.coherenceState.length).toBeGreaterThan(0);
    expect(observation!.coherenceStrength.length).toBeGreaterThan(0);
    expect(observation!.coherenceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(347_000);
    expect(
      selectLatestUnifiedStrategicCoherenceSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
