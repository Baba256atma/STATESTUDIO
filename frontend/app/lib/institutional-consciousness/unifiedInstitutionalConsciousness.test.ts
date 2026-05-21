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
  beginUnifiedInstitutionalConsciousnessEvaluation,
  endUnifiedInstitutionalConsciousnessEvaluation,
  resetUnifiedInstitutionalConsciousnessGuards,
} from "./unifiedInstitutionalConsciousnessGuards";
import {
  getUnifiedInstitutionalConsciousnessStore,
  resetUnifiedInstitutionalConsciousnessStores,
} from "./unifiedInstitutionalConsciousnessStore";
import { evaluateUnifiedInstitutionalConsciousnessRuntime } from "./unifiedInstitutionalConsciousnessEngine";
import { integrateUnifiedInstitutionalConsciousnessRuntimeWithCognition } from "./integrateUnifiedInstitutionalConsciousnessRuntimeWithCognition";
import { selectLatestCivilizationScaleEnterpriseSnapshot } from "./unifiedInstitutionalConsciousnessSelectors";
import { evaluateCivilizationStewardshipIntelligence } from "./civilizationStewardshipEngine";
import { resetCivilizationStewardshipGuards } from "./civilizationStewardshipGuards";
import { resetCivilizationStewardshipStores } from "./civilizationStewardshipStore";
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

function resetUnifiedInstitutionalConsciousnessTestStacks(): void {
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
  resetUnifiedInstitutionalConsciousnessStores();
  resetUnifiedInstitutionalConsciousnessGuards();
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

export function seedUnifiedInstitutionalConsciousnessRuntime(
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
  evaluateCivilizationStewardshipIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    civilizationWisdomSnapshot: selectLatestCivilizationWisdomSnapshot(organizationId),
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
    now: 270_000,
  });
}

export function unifiedRuntimeEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedInstitutionalConsciousnessRuntime>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(org),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(org),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(org),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(org),
    civilizationContinuitySnapshot: selectLatestCivilizationContinuitySnapshot(org),
    civilizationAdaptationSnapshot: selectLatestCivilizationAdaptationSnapshot(org),
    civilizationCoordinationSnapshot: selectLatestCivilizationCoordinationSnapshot(org),
    civilizationWisdomSnapshot: selectLatestCivilizationWisdomSnapshot(org),
    civilizationStewardshipSnapshot: selectLatestCivilizationStewardshipSnapshot(org),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    operationalTopologyStressed: true,
    now,
    ...overrides,
  };
}

describe("unified institutional consciousness D9:8:10", () => {
  beforeEach(() => {
    resetUnifiedInstitutionalConsciousnessTestStacks();
  });

  it("generates unified civilization-scale enterprise snapshots when stewardship is present", () => {
    const org = "uic-verify-org";
    const cognition = minimalCognition(org);
    seedUnifiedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateUnifiedInstitutionalConsciousnessRuntime(
      unifiedRuntimeEvalInput(org, cognition, 280_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.activeSubsystemCount).toBeGreaterThanOrEqual(5);
    expect(result.snapshot?.activeSubsystems.length).toBeGreaterThan(0);
    expect(
      getUnifiedInstitutionalConsciousnessStore(org).getState().enterpriseSnapshots.length
    ).toBeGreaterThan(0);
  });

  it("synthesizes macro-system awareness summary with executive contract fields", () => {
    const org = "uic-summary-org";
    const cognition = minimalCognition(org);
    seedUnifiedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateUnifiedInstitutionalConsciousnessRuntime(
      unifiedRuntimeEvalInput(org, cognition, 281_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.summary.ecosystemState.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary.continuityState.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary.coordinationState.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary.stewardshipState.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary.primaryMacroRisk.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary.primaryMacroOpportunity.length).toBeGreaterThan(0);
    expect(result.snapshot?.activeSubsystems).toContain("civilization_stewardship");
  });

  it("skips when civilization stewardship depth is insufficient", () => {
    const org = "uic-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateUnifiedInstitutionalConsciousnessRuntime(
      unifiedRuntimeEvalInput(org, cognition, 282_000, {
        civilizationStewardshipSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_stewardship_depth");
  });

  it("dedupes duplicate unified runtime evaluations on unchanged signature", () => {
    const org = "uic-dedupe-org";
    const cognition = minimalCognition(org);
    seedUnifiedInstitutionalConsciousnessRuntime(org, cognition);

    const first = integrateUnifiedInstitutionalConsciousnessRuntimeWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 283_000,
    });
    const second = integrateUnifiedInstitutionalConsciousnessRuntimeWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 283_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded unified institutional-consciousness memory under caps", () => {
    const org = "uic-bounded-org";
    const cognition = minimalCognition(org);
    seedUnifiedInstitutionalConsciousnessRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedInstitutionalConsciousnessRuntime(
        unifiedRuntimeEvalInput(
          org,
          { ...cognition, signature: `uic-bounded-${i}` },
          284_000 + i * 600
        )
      );
    }

    const state = getUnifiedInstitutionalConsciousnessStore(org).getState();
    expect(state.enterpriseSnapshots.length).toBeLessThanOrEqual(8);
    expect(state.runtimeHistory.length).toBeLessThanOrEqual(10);
    expect(state.subsystemStates.length).toBeLessThanOrEqual(9);
  });

  it("blocks recursive unified institutional-consciousness evaluation", () => {
    expect(beginUnifiedInstitutionalConsciousnessEvaluation()).toBe(true);
    expect(beginUnifiedInstitutionalConsciousnessEvaluation()).toBe(true);
    expect(beginUnifiedInstitutionalConsciousnessEvaluation()).toBe(false);
    endUnifiedInstitutionalConsciousnessEvaluation();
    endUnifiedInstitutionalConsciousnessEvaluation();
  });

  it("emits civilization-scale enterprise snapshot contract fields", () => {
    const org = "uic-contract-org";
    const cognition = minimalCognition(org);
    seedUnifiedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateUnifiedInstitutionalConsciousnessRuntime(
      unifiedRuntimeEvalInput(org, cognition, 285_000)
    );

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.runtimeStatus.length).toBeGreaterThan(0);
    expect(snapshot!.awarenessLevel.length).toBeGreaterThan(0);
    expect(snapshot!.subsystemStates.length).toBeGreaterThan(0);
    expect(snapshot!.generatedAt).toBe(285_000);
    expect(
      selectLatestCivilizationScaleEnterpriseSnapshot(org)?.institutionalConsciousnessHealth
        .macroHeadline.length
    ).toBeGreaterThan(0);
  });
});
