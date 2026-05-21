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
import {
  beginStrategicIdentityEvaluation,
  endStrategicIdentityEvaluation,
  resetStrategicIdentityGuards,
} from "./strategicIdentityGuards";
import { getStrategicIdentityStore, resetStrategicIdentityStores } from "./strategicIdentityStore";
import { evaluateEnterpriseStrategicIdentity } from "./strategicIdentityEngine";
import { integrateStrategicIdentityWithCognition } from "./integrateStrategicIdentityWithCognition";
import { selectLatestEnterpriseStrategicIdentitySnapshot } from "./strategicIdentitySelectors";

function resetStrategicIdentityTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetCognitiveSingularityStores();
  resetCognitiveSingularityGuards();
  resetAwarenessSynchronizationStores();
  resetAwarenessSynchronizationGuards();
  resetStrategicIntentStores();
  resetStrategicIntentGuards();
  resetStrategicIdentityStores();
  resetStrategicIdentityGuards();
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
  now: number,
  overrides?: Partial<Parameters<typeof evaluateEnterpriseStrategicIdentity>[0]>
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
    ...overrides,
  };
}

function seedStrategicIdentityRuntime(
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
}

describe("strategic identity D9:9:4", () => {
  beforeEach(() => {
    resetStrategicIdentityTestStacks();
  });

  it("generates strategic identity snapshots when strategic intent is present", () => {
    const org = "sid-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 320_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getStrategicIdentityStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise strategic identity with consistency signals", () => {
    const org = "sid-identity-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 321_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIdentityStore(org).getState().observations.some(
        (o) =>
          o.consistencySignals.includes("purpose_alignment") ||
          o.consistencySignals.includes("governance_consistency") ||
          o.consistencySignals.includes("resilience_identity_continuity")
      )
    ).toBe(true);
  });

  it("detects decision identity drift under decision-runtime stress", () => {
    const org = "sid-drift-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 322_000, {
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "degraded" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIdentityStore(org).getState().observations.some(
        (o) =>
          o.consistencySignals.includes("decision_identity_drift") ||
          o.driftRisks.includes("decision_runtime_identity_drift")
      )
    ).toBe(true);
  });

  it("detects purpose-behavior mismatch under partial strategic intent", () => {
    const org = "sid-mismatch-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const intent = selectLatestUnifiedStrategicIntentSnapshot(org);
    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 323_000, {
        unifiedStrategicIntentSnapshot: intent
          ? {
              ...intent,
              strategicIntentSummary: {
                ...intent.strategicIntentSummary,
                dominantIntentState: "partially_aligned",
              },
            }
          : null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIdentityStore(org).getState().observations.some(
        (o) =>
          o.consistencySignals.includes("purpose_behavior_mismatch") ||
          o.driftRisks.includes("strategic_identity_fragmentation_risk")
      )
    ).toBe(true);
  });

  it("skips when strategic intent depth is insufficient", () => {
    const org = "sid-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 324_000, {
        unifiedStrategicIntentSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_intent_depth");
  });

  it("dedupes duplicate strategic identity evaluations on unchanged signature", () => {
    const org = "sid-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const first = integrateStrategicIdentityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 325_000,
    });
    const second = integrateStrategicIdentityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 325_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic identity memory under caps", () => {
    const org = "sid-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateEnterpriseStrategicIdentity(
        strategicIdentityEvalInput(
          org,
          { ...cognition, signature: `sid-bounded-${i}` },
          326_000 + i * 600
        )
      );
    }

    const state = getStrategicIdentityStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic identity evaluation", () => {
    expect(beginStrategicIdentityEvaluation()).toBe(true);
    expect(beginStrategicIdentityEvaluation()).toBe(true);
    expect(beginStrategicIdentityEvaluation()).toBe(false);
    endStrategicIdentityEvaluation();
    endStrategicIdentityEvaluation();
  });

  it("emits strategic identity contract fields", () => {
    const org = "sid-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicIdentityRuntime(org, cognition);

    const result = evaluateEnterpriseStrategicIdentity(
      strategicIdentityEvalInput(org, cognition, 327_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.identityId.length).toBeGreaterThan(0);
    expect(observation!.identityState.length).toBeGreaterThan(0);
    expect(observation!.consistencyLevel.length).toBeGreaterThan(0);
    expect(observation!.consistencySignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(327_000);
    expect(
      selectLatestEnterpriseStrategicIdentitySnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
