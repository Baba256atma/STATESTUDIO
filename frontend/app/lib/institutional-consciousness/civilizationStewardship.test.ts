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
  beginCivilizationStewardshipEvaluation,
  endCivilizationStewardshipEvaluation,
  resetCivilizationStewardshipGuards,
} from "./civilizationStewardshipGuards";
import {
  getCivilizationStewardshipStore,
  resetCivilizationStewardshipStores,
} from "./civilizationStewardshipStore";
import { evaluateCivilizationStewardshipIntelligence } from "./civilizationStewardshipEngine";
import { integrateCivilizationStewardshipWithCognition } from "./integrateCivilizationStewardshipWithCognition";
import { selectLatestCivilizationStewardshipSnapshot } from "./civilizationStewardshipSelectors";
import { evaluateCivilizationWisdomIntelligence } from "./civilizationWisdomEngine";
import { resetCivilizationWisdomGuards } from "./civilizationWisdomGuards";
import { resetCivilizationWisdomStores } from "./civilizationWisdomStore";
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

function resetCivilizationStewardshipTestStacks(): void {
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
  resetCivilizationStewardshipStores();
  resetCivilizationStewardshipGuards();
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

function seedCivilizationStewardshipRuntime(
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
  evaluateCivilizationWisdomIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    civilizationCoordinationSnapshot: selectLatestCivilizationCoordinationSnapshot(organizationId),
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
    now: 260_000,
  });
}

function civilizationStewardshipEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateCivilizationStewardshipIntelligence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    civilizationWisdomSnapshot: selectLatestCivilizationWisdomSnapshot(org),
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

describe("civilization stewardship D9:8:9", () => {
  beforeEach(() => {
    resetCivilizationStewardshipTestStacks();
  });

  it("generates civilization stewardship snapshots when civilization wisdom is present", () => {
    const org = "cs-verify-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    const result = evaluateCivilizationStewardshipIntelligence(
      civilizationStewardshipEvalInput(org, cognition, 270_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getCivilizationStewardshipStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale survivability preservation with stewardship signals", () => {
    const org = "cs-preservation-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    const result = evaluateCivilizationStewardshipIntelligence(
      civilizationStewardshipEvalInput(org, cognition, 271_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationStewardshipStore(org).getState().observations.some(
        (o) =>
          o.stewardshipSignals.includes("long_horizon_resilience_protection") ||
          o.stewardshipSignals.includes("ecosystem_survivability_reinforcement") ||
          o.stewardshipSignals.includes("institutional_continuity_preservation")
      )
    ).toBe(true);
  });

  it("detects preservation-risk warning under sustainability degradation stress", () => {
    const org = "cs-risk-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    const continuity = selectLatestCivilizationContinuitySnapshot(org);
    const result = evaluateCivilizationStewardshipIntelligence(
      civilizationStewardshipEvalInput(org, cognition, 272_000, {
        civilizationContinuitySnapshot: continuity
          ? {
              ...continuity,
              continuitySummary: {
                ...continuity.continuitySummary,
                dominantSustainabilityState: "fragile",
              },
            }
          : null,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCivilizationStewardshipStore(org).getState().observations.some(
        (o) =>
          o.stewardshipSignals.includes("preservation_risk_warning") ||
          o.stewardshipSignals.includes("sustainability_degradation_fragility")
      )
    ).toBe(true);
  });

  it("skips when civilization wisdom depth is insufficient", () => {
    const org = "cs-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateCivilizationStewardshipIntelligence(
      civilizationStewardshipEvalInput(org, cognition, 273_000, {
        civilizationWisdomSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_civilization_wisdom_depth");
  });

  it("dedupes duplicate civilization stewardship evaluations on unchanged signature", () => {
    const org = "cs-dedupe-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    const first = integrateCivilizationStewardshipWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 274_000,
    });
    const second = integrateCivilizationStewardshipWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 274_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded civilization stewardship memory under caps", () => {
    const org = "cs-bounded-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateCivilizationStewardshipIntelligence(
        civilizationStewardshipEvalInput(
          org,
          { ...cognition, signature: `cs-bounded-${i}` },
          275_000 + i * 600
        )
      );
    }

    const state = getCivilizationStewardshipStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive civilization stewardship evaluation", () => {
    expect(beginCivilizationStewardshipEvaluation()).toBe(true);
    expect(beginCivilizationStewardshipEvaluation()).toBe(true);
    expect(beginCivilizationStewardshipEvaluation()).toBe(false);
    endCivilizationStewardshipEvaluation();
    endCivilizationStewardshipEvaluation();
  });

  it("emits civilization stewardship contract fields", () => {
    const org = "cs-contract-org";
    const cognition = minimalCognition(org);
    seedCivilizationStewardshipRuntime(org, cognition);

    const result = evaluateCivilizationStewardshipIntelligence(
      civilizationStewardshipEvalInput(org, cognition, 276_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.stewardshipId.length).toBeGreaterThan(0);
    expect(observation!.preservationState.length).toBeGreaterThan(0);
    expect(observation!.stewardshipStrength.length).toBeGreaterThan(0);
    expect(observation!.stewardshipSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(276_000);
    expect(
      selectLatestCivilizationStewardshipSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
