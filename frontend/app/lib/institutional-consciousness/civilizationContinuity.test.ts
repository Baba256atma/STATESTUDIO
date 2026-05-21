import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateCivilizationFragilityPropagation } from "./civilizationFragilityEngine";
import { resetCivilizationFragilityGuards } from "./civilizationFragilityGuards";
import { resetCivilizationFragilityStores } from "./civilizationFragilityStore";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import {
  beginCivilizationContinuityEvaluation,
  endCivilizationContinuityEvaluation,
  resetCivilizationContinuityGuards,
} from "./civilizationContinuityGuards";
import {
  getCivilizationContinuityStore,
  resetCivilizationContinuityStores,
} from "./civilizationContinuityStore";
import { evaluateCivilizationContinuityIntelligence } from "./civilizationContinuityEngine";
import { integrateCivilizationContinuityWithCognition } from "./integrateCivilizationContinuityWithCognition";
import { selectLatestCivilizationContinuitySnapshot } from "./civilizationContinuitySelectors";
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

function resetCivilizationContinuityTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetEcosystemSynchronizationStores();
  resetEcosystemSynchronizationGuards();
  resetCivilizationFragilityStores();
  resetCivilizationFragilityGuards();
  resetInstitutionalInfluenceStores();
  resetInstitutionalInfluenceGuards();
  resetCivilizationContinuityStores();
  resetCivilizationContinuityGuards();
}

function layerEvalInputs(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  const base = {
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
  return base;
}

function seedCivilizationContinuityRuntime(
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
}

function civilizationContinuityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationContinuityIntelligence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
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

describe("civilization continuity D9:8:5", () => {
  beforeEach(() => {
    resetCivilizationContinuityTestStacks();
  });

  it("generates civilization continuity snapshots when institutional influence is present", () => {
    const org = "cc-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    const result = evaluateCivilizationContinuityIntelligence(
      civilizationContinuityEvalInput(org, cognition, 230_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationContinuityStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale operational survivability with continuity signals", () => {
    const org = "cc-survivability-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    const result = evaluateCivilizationContinuityIntelligence(
      civilizationContinuityEvalInput(org, cognition, 231_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationContinuityStore(org).getState().observations.some(
        (o) =>
          o.continuitySignals.includes("long_horizon_resilience_reinforcement") ||
          o.continuitySignals.includes("ecosystem_sustainability_alignment") ||
          o.continuitySignals.includes("distributed_operational_continuity")
      )
    ).toBe(true);
  });

  it("detects long-horizon continuity degradation under macro-impact stress", () => {
    const org = "cc-degrade-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    const influence = selectLatestInstitutionalInfluenceSnapshot(org);
    const result = evaluateCivilizationContinuityIntelligence(
      civilizationContinuityEvalInput(org, cognition, 232_000, {
        institutionalInfluenceSnapshot: influence
          ? {
              ...influence,
              impactSummary: {
                ...influence.impactSummary,
                dominantImpactState: "civilization_scale_impact",
              },
            }
          : null,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationContinuityStore(org).getState().observations.some(
        (o) =>
          o.continuitySignals.includes("long_horizon_continuity_degradation") ||
          o.continuitySignals.includes("continuity_fragility_warning") ||
          o.continuitySignals.includes("fragility_accumulation_pressure")
      )
    ).toBe(true);
  });

  it("skips when institutional influence depth is insufficient", () => {
    const org = "cc-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);
    evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 190_000)
    );

    const result = evaluateCivilizationContinuityIntelligence(
      civilizationContinuityEvalInput(org, cognition, 233_000, {
        institutionalInfluenceSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_institutional_influence_depth");
  });

  it("dedupes duplicate civilization continuity evaluations on unchanged signature", () => {
    const org = "cc-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    const first = integrateCivilizationContinuityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 234_000,
    });
    const second = integrateCivilizationContinuityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 234_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization continuity memory under caps", () => {
    const org = "cc-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationContinuityIntelligence(
        civilizationContinuityEvalInput(
          org,
          { ...cognition, signature: `cc-bounded-${i}` },
          235_000 + i * 600
        )
      );
    }

    const state = getCivilizationContinuityStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization continuity evaluation", () => {
    expect(beginCivilizationContinuityEvaluation()).toBe(true);
    expect(beginCivilizationContinuityEvaluation()).toBe(true);
    expect(beginCivilizationContinuityEvaluation()).toBe(false);
    endCivilizationContinuityEvaluation();
    endCivilizationContinuityEvaluation();
  });

  it("emits civilization continuity contract fields", () => {
    const org = "cc-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationContinuityRuntime(org, cognition);

    const result = evaluateCivilizationContinuityIntelligence(
      civilizationContinuityEvalInput(org, cognition, 236_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.continuityId.length).toBeGreaterThan(0);
    expect(observation!.sustainabilityState.length).toBeGreaterThan(0);
    expect(observation!.continuityStrength.length).toBeGreaterThan(0);
    expect(observation!.continuitySignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(236_000);
    expect(selectLatestCivilizationContinuitySnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
