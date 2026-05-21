import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import {
  beginCivilizationWisdomEvaluation,
  endCivilizationWisdomEvaluation,
  resetCivilizationWisdomGuards,
} from "./civilizationWisdomGuards";
import {
  getCivilizationWisdomStore,
  resetCivilizationWisdomStores,
} from "./civilizationWisdomStore";
import { evaluateCivilizationWisdomIntelligence } from "./civilizationWisdomEngine";
import { integrateCivilizationWisdomWithCognition } from "./integrateCivilizationWisdomWithCognition";
import { selectLatestCivilizationWisdomSnapshot } from "./civilizationWisdomSelectors";
import { evaluateCivilizationCoordinationIntelligence } from "./civilizationCoordinationEngine";
import { resetCivilizationCoordinationGuards } from "./civilizationCoordinationGuards";
import { resetCivilizationCoordinationStores } from "./civilizationCoordinationStore";
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

function resetCivilizationWisdomTestStacks(): void {
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
  resetCivilizationWisdomStores();
  resetCivilizationWisdomGuards();
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

function seedCivilizationWisdomRuntime(
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
  evaluateCivilizationCoordinationIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    civilizationAdaptationSnapshot: selectLatestCivilizationAdaptationSnapshot(organizationId),
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
    now: 250_000,
  });
}

function civilizationWisdomEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationWisdomIntelligence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    civilizationCoordinationSnapshot: selectLatestCivilizationCoordinationSnapshot(org),
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

describe("civilization wisdom D9:8:8", () => {
  beforeEach(() => {
    resetCivilizationWisdomTestStacks();
  });

  it("generates civilization wisdom snapshots when civilization coordination is present", () => {
    const org = "cw-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    const result = evaluateCivilizationWisdomIntelligence(
      civilizationWisdomEvalInput(org, cognition, 260_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationWisdomStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale learning convergence with wisdom signals", () => {
    const org = "cw-convergence-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    const result = evaluateCivilizationWisdomIntelligence(
      civilizationWisdomEvalInput(org, cognition, 261_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationWisdomStore(org).getState().observations.some(
        (o) =>
          o.wisdomSignals.includes("resilience_learning_reinforcement") ||
          o.wisdomSignals.includes("distributed_coordination_maturity") ||
          o.wisdomSignals.includes("long_horizon_operational_adaptation")
      )
    ).toBe(true);
  });

  it("detects fragility-learning accumulation under centralization stress", () => {
    const org = "cw-fragility-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    const sync = selectLatestEcosystemSynchronizationSnapshot(org);
    const governance = selectInstitutionalLearningGovernanceSnapshot(org);
    const result = evaluateCivilizationWisdomIntelligence(
      civilizationWisdomEvalInput(org, cognition, 262_000, {
        ecosystemSynchronizationSnapshot: sync
          ? {
              ...sync,
              synchronizationSummary: {
                ...sync.synchronizationSummary,
                dominantCoordinationState: "disconnected",
              },
            }
          : null,
        governanceSnapshot: governance
          ? { ...governance, governanceStatus: "degraded" }
          : null,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationWisdomStore(org).getState().observations.some(
        (o) =>
          o.wisdomSignals.includes("fragility_learning_accumulation") ||
          o.wisdomSignals.includes("over_centralization_instability_lesson")
      )
    ).toBe(true);
  });

  it("skips when civilization coordination depth is insufficient", () => {
    const org = "cw-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateCivilizationWisdomIntelligence(
      civilizationWisdomEvalInput(org, cognition, 263_000, {
        civilizationCoordinationSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_civilization_coordination_depth");
  });

  it("dedupes duplicate civilization wisdom evaluations on unchanged signature", () => {
    const org = "cw-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    const first = integrateCivilizationWisdomWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 264_000,
    });
    const second = integrateCivilizationWisdomWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 264_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization wisdom memory under caps", () => {
    const org = "cw-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationWisdomIntelligence(
        civilizationWisdomEvalInput(
          org,
          { ...cognition, signature: `cw-bounded-${i}` },
          265_000 + i * 600
        )
      );
    }

    const state = getCivilizationWisdomStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization wisdom evaluation", () => {
    expect(beginCivilizationWisdomEvaluation()).toBe(true);
    expect(beginCivilizationWisdomEvaluation()).toBe(true);
    expect(beginCivilizationWisdomEvaluation()).toBe(false);
    endCivilizationWisdomEvaluation();
    endCivilizationWisdomEvaluation();
  });

  it("emits civilization wisdom contract fields", () => {
    const org = "cw-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationWisdomRuntime(org, cognition);

    const result = evaluateCivilizationWisdomIntelligence(
      civilizationWisdomEvalInput(org, cognition, 266_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.wisdomId.length).toBeGreaterThan(0);
    expect(observation!.convergenceState.length).toBeGreaterThan(0);
    expect(observation!.wisdomStrength.length).toBeGreaterThan(0);
    expect(observation!.wisdomSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(266_000);
    expect(selectLatestCivilizationWisdomSnapshot(org)?.recentObservations.length).toBeGreaterThan(0);
  });
});
