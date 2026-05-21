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
  beginCivilizationAdaptationEvaluation,
  endCivilizationAdaptationEvaluation,
  resetCivilizationAdaptationGuards,
} from "./civilizationAdaptationGuards";
import {
  getCivilizationAdaptationStore,
  resetCivilizationAdaptationStores,
} from "./civilizationAdaptationStore";
import { evaluateCivilizationAdaptationIntelligence } from "./civilizationAdaptationEngine";
import { integrateCivilizationAdaptationWithCognition } from "./integrateCivilizationAdaptationWithCognition";
import { selectLatestCivilizationAdaptationSnapshot } from "./civilizationAdaptationSelectors";
import { evaluateCivilizationContinuityIntelligence } from "./civilizationContinuityEngine";
import { resetCivilizationContinuityGuards } from "./civilizationContinuityGuards";
import { resetCivilizationContinuityStores } from "./civilizationContinuityStore";
import { selectLatestCivilizationContinuitySnapshot } from "./civilizationContinuitySelectors";
import { evaluateCivilizationFragilityPropagation } from "./civilizationFragilityEngine";
import { resetCivilizationFragilityGuards } from "./civilizationFragilityGuards";
import { resetCivilizationFragilityStores } from "./civilizationFragilityStore";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import { evaluateInstitutionalEcosystemSynchronization } from "./ecosystemSynchronizationEngine";
import { resetEcosystemSynchronizationGuards } from "./ecosystemSynchronizationGuards";
import { resetEcosystemSynchronizationStores } from "./ecosystemSynchronizationStore";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import { evaluateStrategicInstitutionalInfluence } from "./institutionalInfluenceEngine";
import { resetInstitutionalInfluenceGuards } from "./institutionalInfluenceGuards";
import { resetInstitutionalInfluenceStores } from "./institutionalInfluenceStore";
import { selectLatestInstitutionalInfluenceSnapshot } from "./institutionalInfluenceSelectors";
import {
  institutionalConsciousnessEvalInput,
  minimalCognition,
  resetInstitutionalConsciousnessTestStacks,
  seedInstitutionalConsciousnessRuntime,
} from "./institutionalConsciousness.test";
import { evaluateInstitutionalConsciousness } from "./institutionalConsciousnessEngine";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

function resetCivilizationAdaptationTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetEcosystemSynchronizationStores();
  resetEcosystemSynchronizationGuards();
  resetCivilizationFragilityStores();
  resetCivilizationFragilityGuards();
  resetInstitutionalInfluenceStores();
  resetInstitutionalInfluenceGuards();
  resetCivilizationContinuityStores();
  resetCivilizationContinuityGuards();
  resetCivilizationAdaptationStores();
  resetCivilizationAdaptationGuards();
}

function layerEvalInputs(
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

function seedCivilizationAdaptationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateInstitutionalConsciousness(
    institutionalConsciousnessEvalInput(organizationId, cognition, 190_000)
  );
  evaluateInstitutionalEcosystemSynchronization(layerEvalInputs(organizationId, cognition, 200_000));
  evaluateCivilizationFragilityPropagation({
    ...layerEvalInputs(organizationId, cognition, 210_000),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
  });
  evaluateStrategicInstitutionalInfluence({
    ...layerEvalInputs(organizationId, cognition, 220_000),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(organizationId),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
  });
  evaluateCivilizationContinuityIntelligence({
    ...layerEvalInputs(organizationId, cognition, 230_000),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(organizationId),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(organizationId),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
  });
}

function civilizationAdaptationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationAdaptationIntelligence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    civilizationContinuitySnapshot: selectLatestCivilizationContinuitySnapshot(org),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(org),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(org),
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

describe("civilization adaptation D9:8:6", () => {
  beforeEach(() => {
    resetCivilizationAdaptationTestStacks();
  });

  it("generates civilization adaptation snapshots when civilization continuity is present", () => {
    const org = "ca-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    const result = evaluateCivilizationAdaptationIntelligence(
      civilizationAdaptationEvalInput(org, cognition, 240_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationAdaptationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale evolution field with adaptation signals", () => {
    const org = "ca-evolution-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    const result = evaluateCivilizationAdaptationIntelligence(
      civilizationAdaptationEvalInput(org, cognition, 241_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationAdaptationStore(org).getState().observations.some(
        (o) =>
          o.adaptationSignals.includes("ecosystem_reorganization") ||
          o.adaptationSignals.includes("distributed_resilience_growth") ||
          o.adaptationSignals.includes("operational_topology_shift")
      )
    ).toBe(true);
  });

  it("detects systemic evolution transition under macro-adaptation stress", () => {
    const org = "ca-transition-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const result = evaluateCivilizationAdaptationIntelligence(
      civilizationAdaptationEvalInput(org, cognition, 242_000, {
        temporalSnapshot: temporal
          ? {
              ...temporal,
              summary: { ...temporal.summary, organizationalEvolutionState: "evolving" },
            }
          : null,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationAdaptationStore(org).getState().observations.some(
        (o) =>
          o.adaptationSignals.includes("systemic_evolution_transition") ||
          o.adaptationSignals.includes("ecosystem_adaptation_signal") ||
          o.adaptationSignals.includes("fragility_pattern_shift")
      )
    ).toBe(true);
  });

  it("skips when civilization continuity depth is insufficient", () => {
    const org = "ca-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateCivilizationAdaptationIntelligence(
      civilizationAdaptationEvalInput(org, cognition, 243_000, {
        civilizationContinuitySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_civilization_continuity_depth");
  });

  it("dedupes duplicate civilization adaptation evaluations on unchanged signature", () => {
    const org = "ca-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    const first = integrateCivilizationAdaptationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 244_000,
    });
    const second = integrateCivilizationAdaptationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 244_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization adaptation memory under caps", () => {
    const org = "ca-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationAdaptationIntelligence(
        civilizationAdaptationEvalInput(
          org,
          { ...cognition, signature: `ca-bounded-${i}` },
          245_000 + i * 600
        )
      );
    }

    const state = getCivilizationAdaptationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization adaptation evaluation", () => {
    expect(beginCivilizationAdaptationEvaluation()).toBe(true);
    expect(beginCivilizationAdaptationEvaluation()).toBe(true);
    expect(beginCivilizationAdaptationEvaluation()).toBe(false);
    endCivilizationAdaptationEvaluation();
    endCivilizationAdaptationEvaluation();
  });

  it("emits civilization adaptation contract fields", () => {
    const org = "ca-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationAdaptationRuntime(org, cognition);

    const result = evaluateCivilizationAdaptationIntelligence(
      civilizationAdaptationEvalInput(org, cognition, 246_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.adaptationId.length).toBeGreaterThan(0);
    expect(observation!.evolutionState.length).toBeGreaterThan(0);
    expect(observation!.adaptationStrength.length).toBeGreaterThan(0);
    expect(observation!.adaptationSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(246_000);
    expect(selectLatestCivilizationAdaptationSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
