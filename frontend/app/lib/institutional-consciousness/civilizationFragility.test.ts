import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import {
  beginCivilizationFragilityEvaluation,
  endCivilizationFragilityEvaluation,
  resetCivilizationFragilityGuards,
} from "./civilizationFragilityGuards";
import {
  getCivilizationFragilityStore,
  resetCivilizationFragilityStores,
} from "./civilizationFragilityStore";
import { evaluateCivilizationFragilityPropagation } from "./civilizationFragilityEngine";
import { integrateCivilizationFragilityWithCognition } from "./integrateCivilizationFragilityWithCognition";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import {
  institutionalConsciousnessEvalInput,
  minimalCognition,
  resetInstitutionalConsciousnessTestStacks,
  seedInstitutionalConsciousnessRuntime,
} from "./institutionalConsciousness.test";
import { evaluateInstitutionalConsciousness } from "./institutionalConsciousnessEngine";
import { evaluateInstitutionalEcosystemSynchronization } from "./ecosystemSynchronizationEngine";
import { resetEcosystemSynchronizationGuards } from "./ecosystemSynchronizationGuards";
import { resetEcosystemSynchronizationStores } from "./ecosystemSynchronizationStore";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

function resetCivilizationFragilityTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetEcosystemSynchronizationStores();
  resetEcosystemSynchronizationGuards();
  resetCivilizationFragilityStores();
  resetCivilizationFragilityGuards();
}

function ecosystemSyncEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(org),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    now,
  };
}

function seedCivilizationFragilityRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateInstitutionalConsciousness(
    institutionalConsciousnessEvalInput(organizationId, cognition, 190_000)
  );
  evaluateInstitutionalEcosystemSynchronization(
    ecosystemSyncEvalInput(organizationId, cognition, 200_000)
  );
}

function civilizationFragilityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationFragilityPropagation>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(org),
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(org),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("civilization fragility D9:8:3", () => {
  beforeEach(() => {
    resetCivilizationFragilityTestStacks();
  });

  it("generates civilization fragility snapshots when ecosystem synchronization is present", () => {
    const org = "cf-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    const result = evaluateCivilizationFragilityPropagation(
      civilizationFragilityEvalInput(org, cognition, 210_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationFragilityStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale fragility field with macro-resilience signals", () => {
    const org = "cf-field-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    const result = evaluateCivilizationFragilityPropagation(
      civilizationFragilityEvalInput(org, cognition, 211_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationFragilityStore(org).getState().observations.some(
        (o) =>
          o.propagationSignals.includes("cross_system_instability_diffusion") ||
          o.propagationSignals.includes("resilience_absorption_field") ||
          o.propagationSignals.includes("institutional_stabilization")
      )
    ).toBe(true);
  });

  it("detects cascading fragility propagation under macro-systemic stress", () => {
    const org = "cf-cascade-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    const consensus = selectLatestDistributedExecutiveCognitionSnapshot(org);
    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const result = evaluateCivilizationFragilityPropagation(
      civilizationFragilityEvalInput(org, cognition, 212_000, {
        unifiedConsensusSnapshot: consensus
          ? { ...consensus, runtimeStatus: "fragmented" }
          : null,
        temporalSnapshot: temporal
          ? {
              ...temporal,
              summary: { ...temporal.summary, organizationalEvolutionState: "fragmenting" },
            }
          : null,
        continuityPreserved: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationFragilityStore(org).getState().observations.some(
        (o) =>
          o.propagationSignals.includes("cascading_fragility_field") ||
          o.propagationSignals.includes("civilization_scale_propagation_warning") ||
          o.propagationSignals.includes("energy_logistics_propagation")
      )
    ).toBe(true);
  });

  it("skips when ecosystem synchronization depth is insufficient", () => {
    const org = "cf-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);
    evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 190_000)
    );

    const result = evaluateCivilizationFragilityPropagation(
      civilizationFragilityEvalInput(org, cognition, 213_000, {
        ecosystemSynchronizationSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_ecosystem_synchronization_depth");
  });

  it("dedupes duplicate civilization fragility evaluations on unchanged signature", () => {
    const org = "cf-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    const first = integrateCivilizationFragilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 214_000,
    });
    const second = integrateCivilizationFragilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 214_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization fragility memory under caps", () => {
    const org = "cf-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationFragilityPropagation(
        civilizationFragilityEvalInput(
          org,
          { ...cognition, signature: `cf-bounded-${i}` },
          215_000 + i * 600
        )
      );
    }

    const state = getCivilizationFragilityStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization fragility evaluation", () => {
    expect(beginCivilizationFragilityEvaluation()).toBe(true);
    expect(beginCivilizationFragilityEvaluation()).toBe(true);
    expect(beginCivilizationFragilityEvaluation()).toBe(false);
    endCivilizationFragilityEvaluation();
    endCivilizationFragilityEvaluation();
  });

  it("emits civilization fragility contract fields", () => {
    const org = "cf-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationFragilityRuntime(org, cognition);

    const result = evaluateCivilizationFragilityPropagation(
      civilizationFragilityEvalInput(org, cognition, 216_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.fragilityId.length).toBeGreaterThan(0);
    expect(observation!.resilienceState.length).toBeGreaterThan(0);
    expect(observation!.propagationStrength.length).toBeGreaterThan(0);
    expect(observation!.propagationSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(216_000);
    expect(selectLatestCivilizationFragilitySnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
