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
import {
  beginStrategicIntentEvaluation,
  endStrategicIntentEvaluation,
  resetStrategicIntentGuards,
} from "./strategicIntentGuards";
import { getStrategicIntentStore, resetStrategicIntentStores } from "./strategicIntentStore";
import { evaluateUnifiedStrategicIntent } from "./strategicIntentEngine";
import { integrateStrategicIntentWithCognition } from "./integrateStrategicIntentWithCognition";
import { selectLatestUnifiedStrategicIntentSnapshot } from "./strategicIntentSelectors";

function resetStrategicIntentTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetCognitiveSingularityStores();
  resetCognitiveSingularityGuards();
  resetAwarenessSynchronizationStores();
  resetAwarenessSynchronizationGuards();
  resetStrategicIntentStores();
  resetStrategicIntentGuards();
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
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedStrategicIntent>[0]>
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
    ...overrides,
  };
}

function seedStrategicIntentRuntime(
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
}

describe("strategic intent D9:9:3", () => {
  beforeEach(() => {
    resetStrategicIntentTestStacks();
  });

  it("generates strategic intent snapshots when awareness synchronization is present", () => {
    const org = "si-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const result = evaluateUnifiedStrategicIntent(strategicIntentEvalInput(org, cognition, 310_000));

    expect(result.evaluated).toBe(true);
    expect(getStrategicIntentStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise purpose alignment with alignment signals", () => {
    const org = "si-align-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const result = evaluateUnifiedStrategicIntent(strategicIntentEvalInput(org, cognition, 311_000));

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIntentStore(org).getState().observations.some(
        (o) =>
          o.alignmentSignals.includes("cross_domain_directional_coherence") ||
          o.alignmentSignals.includes("resilience_intent_alignment") ||
          o.alignmentSignals.includes("executive_purpose_synchronization")
      )
    ).toBe(true);
  });

  it("detects strategic-purpose fragmentation under operational-continuity stress", () => {
    const org = "si-fragment-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const memory = selectLatestEnterpriseMemorySnapshot(org);
    const institutional = selectLatestCivilizationScaleEnterpriseSnapshot(org);
    const result = evaluateUnifiedStrategicIntent(
      strategicIntentEvalInput(org, cognition, 312_000, {
        memorySnapshot: memory
          ? {
              ...memory,
              runtimeStatus: "stable",
              summary: { ...memory.summary, strategicMemoryContinuity: "verified" },
            }
          : null,
        unifiedInstitutionalConsciousnessSnapshot: institutional
          ? {
              ...institutional,
              summary: { ...institutional.summary, continuityState: "pressured" },
            }
          : null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
        continuityPreserved: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIntentStore(org).getState().observations.some(
        (o) =>
          o.alignmentRisks.includes("localized_operational_speed_conflict") ||
          o.alignmentSignals.includes("strategic_purpose_fragmentation")
      )
    ).toBe(true);
  });

  it("detects executive alignment instability under meta-cognition drift", () => {
    const org = "si-meta-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const meta = selectLatestEnterpriseSelfReflectiveSnapshot(org);
    const result = evaluateUnifiedStrategicIntent(
      strategicIntentEvalInput(org, cognition, 313_000, {
        unifiedSelfReflectiveSnapshot: meta
          ? {
              ...meta,
              runtimeStatus: "degraded",
              summary: {
                ...meta.summary,
                governanceAlignment: "drifting",
                survivabilityState: "strained",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicIntentStore(org).getState().observations.some(
        (o) =>
          o.alignmentSignals.includes("executive_alignment_instability") ||
          o.alignmentRisks.includes("executive_objective_divergence")
      )
    ).toBe(true);
  });

  it("skips when awareness synchronization depth is insufficient", () => {
    const org = "si-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedStrategicIntent(
      strategicIntentEvalInput(org, cognition, 314_000, {
        awarenessSynchronizationSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_awareness_synchronization_depth");
  });

  it("dedupes duplicate strategic intent evaluations on unchanged signature", () => {
    const org = "si-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const first = integrateStrategicIntentWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 315_000,
    });
    const second = integrateStrategicIntentWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 315_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic intent memory under caps", () => {
    const org = "si-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedStrategicIntent(
        strategicIntentEvalInput(
          org,
          { ...cognition, signature: `si-bounded-${i}` },
          316_000 + i * 600
        )
      );
    }

    const state = getStrategicIntentStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic intent evaluation", () => {
    expect(beginStrategicIntentEvaluation()).toBe(true);
    expect(beginStrategicIntentEvaluation()).toBe(true);
    expect(beginStrategicIntentEvaluation()).toBe(false);
    endStrategicIntentEvaluation();
    endStrategicIntentEvaluation();
  });

  it("emits strategic intent contract fields", () => {
    const org = "si-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicIntentRuntime(org, cognition);

    const result = evaluateUnifiedStrategicIntent(strategicIntentEvalInput(org, cognition, 317_000));

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.intentId.length).toBeGreaterThan(0);
    expect(observation!.intentState.length).toBeGreaterThan(0);
    expect(observation!.alignmentStrength.length).toBeGreaterThan(0);
    expect(observation!.alignmentSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(317_000);
    expect(selectLatestUnifiedStrategicIntentSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
