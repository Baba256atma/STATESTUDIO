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
  beginCivilizationCoordinationEvaluation,
  endCivilizationCoordinationEvaluation,
  resetCivilizationCoordinationGuards,
} from "./civilizationCoordinationGuards";
import {
  getCivilizationCoordinationStore,
  resetCivilizationCoordinationStores,
} from "./civilizationCoordinationStore";
import { evaluateCivilizationCoordinationIntelligence } from "./civilizationCoordinationEngine";
import { integrateCivilizationCoordinationWithCognition } from "./integrateCivilizationCoordinationWithCognition";
import { selectLatestCivilizationCoordinationSnapshot } from "./civilizationCoordinationSelectors";
import { evaluateCivilizationAdaptationIntelligence } from "./civilizationAdaptationEngine";
import { resetCivilizationAdaptationGuards } from "./civilizationAdaptationGuards";
import { resetCivilizationAdaptationStores } from "./civilizationAdaptationStore";
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

function resetCivilizationCoordinationTestStacks(): void {
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
  resetCivilizationCoordinationStores();
  resetCivilizationCoordinationGuards();
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

function seedCivilizationCoordinationRuntime(
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
  evaluateCivilizationAdaptationIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    civilizationContinuitySnapshot: selectLatestCivilizationContinuitySnapshot(organizationId),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(organizationId),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(organizationId),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(organizationId),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 240_000,
  });
}

function civilizationCoordinationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationCoordinationIntelligence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    civilizationAdaptationSnapshot: selectLatestCivilizationAdaptationSnapshot(org),
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

describe("civilization coordination D9:8:7", () => {
  beforeEach(() => {
    resetCivilizationCoordinationTestStacks();
  });

  it("generates civilization coordination snapshots when civilization adaptation is present", () => {
    const org = "cc-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    const result = evaluateCivilizationCoordinationIntelligence(
      civilizationCoordinationEvalInput(org, cognition, 250_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationCoordinationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale harmony field with coordination signals", () => {
    const org = "cc-harmony-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    const result = evaluateCivilizationCoordinationIntelligence(
      civilizationCoordinationEvalInput(org, cognition, 251_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationCoordinationStore(org).getState().observations.some(
        (o) =>
          o.coordinationId === "civilization_scale_harmony_field_01" ||
          o.coordinationSignals.includes("ecosystem_harmony_reinforcement") ||
          o.coordinationSignals.includes("macro_operational_coherence")
      )
    ).toBe(true);
  });

  it("detects macro-coherence degradation under infrastructure fragmentation stress", () => {
    const org = "cc-degradation-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    const reflective = selectLatestEnterpriseSelfReflectiveSnapshot(org);
    const sync = selectLatestEcosystemSynchronizationSnapshot(org);
    const result = evaluateCivilizationCoordinationIntelligence(
      civilizationCoordinationEvalInput(org, cognition, 252_000, {
        unifiedSelfReflectiveSnapshot: reflective
          ? {
              ...reflective,
              summary: { ...reflective.summary, survivabilityState: "degraded" },
            }
          : null,
        ecosystemSynchronizationSnapshot: sync
          ? {
              ...sync,
              synchronizationSummary: {
                ...sync.synchronizationSummary,
                dominantCoordinationState: "disconnected",
              },
            }
          : null,
        operationalTopologyStressed: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationCoordinationStore(org).getState().observations.some(
        (o) =>
          o.coordinationId === "macro_coherence_degradation_warning" ||
          o.coordinationSignals.includes("macro_coherence_degradation_warning")
      )
    ).toBe(true);
  });

  it("skips when civilization adaptation depth is insufficient", () => {
    const org = "cc-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateCivilizationCoordinationIntelligence(
      civilizationCoordinationEvalInput(org, cognition, 253_000, {
        civilizationAdaptationSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_civilization_adaptation_depth");
  });

  it("dedupes duplicate civilization coordination evaluations on unchanged signature", () => {
    const org = "cc-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    const first = integrateCivilizationCoordinationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 254_000,
    });
    const second = integrateCivilizationCoordinationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 254_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization coordination memory under caps", () => {
    const org = "cc-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationCoordinationIntelligence(
        civilizationCoordinationEvalInput(
          org,
          { ...cognition, signature: `cc-bounded-${i}` },
          255_000 + i * 600
        )
      );
    }

    const state = getCivilizationCoordinationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization coordination evaluation", () => {
    expect(beginCivilizationCoordinationEvaluation()).toBe(true);
    expect(beginCivilizationCoordinationEvaluation()).toBe(true);
    expect(beginCivilizationCoordinationEvaluation()).toBe(false);
    endCivilizationCoordinationEvaluation();
    endCivilizationCoordinationEvaluation();
  });

  it("emits civilization coordination contract fields", () => {
    const org = "cc-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationCoordinationRuntime(org, cognition);

    const result = evaluateCivilizationCoordinationIntelligence(
      civilizationCoordinationEvalInput(org, cognition, 256_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.coordinationId.length).toBeGreaterThan(0);
    expect(observation!.harmonyState.length).toBeGreaterThan(0);
    expect(observation!.coordinationStrength.length).toBeGreaterThan(0);
    expect(observation!.coordinationSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(256_000);
    expect(selectLatestCivilizationCoordinationSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
