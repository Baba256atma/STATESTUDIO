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
import {
  beginStrategicWillEvaluation,
  endStrategicWillEvaluation,
  resetStrategicWillGuards,
} from "./strategicWillGuards";
import { getStrategicWillStore, resetStrategicWillStores } from "./strategicWillStore";
import { evaluateUnifiedStrategicWill } from "./strategicWillEngine";
import { integrateStrategicWillWithCognition } from "./integrateStrategicWillWithCognition";
import { selectLatestEnterpriseStrategicWillSnapshot } from "./strategicWillSelectors";

function resetStrategicWillTestStacks(): void {
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
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedStrategicWill>[0]>
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
    ...overrides,
  };
}

function seedStrategicWillRuntime(
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
}

describe("strategic will D9:9:5", () => {
  beforeEach(() => {
    resetStrategicWillTestStacks();
  });

  it("generates strategic will snapshots when strategic identity is present", () => {
    const org = "sw-verify-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const result = evaluateUnifiedStrategicWill(strategicWillEvalInput(org, cognition, 330_000));

    expect(result.evaluated).toBe(true);
    expect(getStrategicWillStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise strategic will with commitment signals", () => {
    const org = "sw-commit-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const result = evaluateUnifiedStrategicWill(strategicWillEvalInput(org, cognition, 331_000));

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicWillStore(org).getState().observations.some(
        (o) =>
          o.commitmentSignals.includes("resilience_commitment") ||
          o.commitmentSignals.includes("governance_follow_through") ||
          o.commitmentSignals.includes("continuity_reinforcement")
      )
    ).toBe(true);
  });

  it("detects commitment fragmentation under governance-speed pressure", () => {
    const org = "sw-fragment-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const identity = selectLatestEnterpriseStrategicIdentitySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const result = evaluateUnifiedStrategicWill(
      strategicWillEvalInput(org, cognition, 332_000, {
        enterpriseStrategicIdentitySnapshot: identity
          ? {
              ...identity,
              strategicIdentitySummary: {
                ...identity.strategicIdentitySummary,
                dominantIdentityState: "self_consistent",
              },
            }
          : null,
        decisionSnapshot: decision
          ? { ...decision, summary: { ...decision.summary, dominantPriority: "speed" } }
          : null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicWillStore(org).getState().observations.some(
        (o) =>
          o.commitmentSignals.includes("governance_speed_fragmentation") ||
          o.fragmentationRisks.includes("localized_growth_speed_pressure")
      )
    ).toBe(true);
  });

  it("detects stewardship will conflict under operational resistance", () => {
    const org = "sw-conflict-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const institutional = selectLatestCivilizationScaleEnterpriseSnapshot(org);
    const result = evaluateUnifiedStrategicWill(
      strategicWillEvalInput(org, cognition, 333_000, {
        unifiedInstitutionalConsciousnessSnapshot: institutional
          ? {
              ...institutional,
              summary: { ...institutional.summary, stewardshipState: "reinforced" },
            }
          : null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getStrategicWillStore(org).getState().observations.some(
        (o) =>
          o.commitmentSignals.includes("stewardship_will_conflict") ||
          o.fragmentationRisks.includes("operational_priority_resistance")
      )
    ).toBe(true);
  });

  it("skips when strategic identity depth is insufficient", () => {
    const org = "sw-isolated-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedStrategicWill(
      strategicWillEvalInput(org, cognition, 334_000, {
        enterpriseStrategicIdentitySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_strategic_identity_depth");
  });

  it("dedupes duplicate strategic will evaluations on unchanged signature", () => {
    const org = "sw-dedupe-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const first = integrateStrategicWillWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 335_000,
    });
    const second = integrateStrategicWillWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      now: 335_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded strategic will memory under caps", () => {
    const org = "sw-bounded-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedStrategicWill(
        strategicWillEvalInput(
          org,
          { ...cognition, signature: `sw-bounded-${i}` },
          336_000 + i * 600
        )
      );
    }

    const state = getStrategicWillStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive strategic will evaluation", () => {
    expect(beginStrategicWillEvaluation()).toBe(true);
    expect(beginStrategicWillEvaluation()).toBe(true);
    expect(beginStrategicWillEvaluation()).toBe(false);
    endStrategicWillEvaluation();
    endStrategicWillEvaluation();
  });

  it("emits strategic will contract fields", () => {
    const org = "sw-contract-org";
    const cognition = minimalCognition(org);
    seedStrategicWillRuntime(org, cognition);

    const result = evaluateUnifiedStrategicWill(strategicWillEvalInput(org, cognition, 337_000));

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.willId.length).toBeGreaterThan(0);
    expect(observation!.willState.length).toBeGreaterThan(0);
    expect(observation!.commitmentStrength.length).toBeGreaterThan(0);
    expect(observation!.commitmentSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(337_000);
    expect(
      selectLatestEnterpriseStrategicWillSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
