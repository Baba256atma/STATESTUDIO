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
import { evaluateInstitutionalEcosystemSynchronization } from "./ecosystemSynchronizationEngine";
import { resetEcosystemSynchronizationGuards } from "./ecosystemSynchronizationGuards";
import { resetEcosystemSynchronizationStores } from "./ecosystemSynchronizationStore";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import {
  beginInstitutionalInfluenceEvaluation,
  endInstitutionalInfluenceEvaluation,
  resetInstitutionalInfluenceGuards,
} from "./institutionalInfluenceGuards";
import {
  getInstitutionalInfluenceStore,
  resetInstitutionalInfluenceStores,
} from "./institutionalInfluenceStore";
import { evaluateStrategicInstitutionalInfluence } from "./institutionalInfluenceEngine";
import { integrateInstitutionalInfluenceWithCognition } from "./integrateInstitutionalInfluenceWithCognition";
import { selectLatestInstitutionalInfluenceSnapshot } from "./institutionalInfluenceSelectors";
import {
  institutionalConsciousnessEvalInput,
  minimalCognition,
  resetInstitutionalConsciousnessTestStacks,
  seedInstitutionalConsciousnessRuntime,
} from "./institutionalConsciousness.test";
import { evaluateInstitutionalConsciousness } from "./institutionalConsciousnessEngine";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

function resetInstitutionalInfluenceTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetEcosystemSynchronizationStores();
  resetEcosystemSynchronizationGuards();
  resetCivilizationFragilityStores();
  resetCivilizationFragilityGuards();
  resetInstitutionalInfluenceStores();
  resetInstitutionalInfluenceGuards();
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

function civilizationFragilityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
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
  };
}

function seedInstitutionalInfluenceRuntime(
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
  evaluateCivilizationFragilityPropagation(
    civilizationFragilityEvalInput(organizationId, cognition, 210_000)
  );
}

function institutionalInfluenceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateStrategicInstitutionalInfluence>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
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

describe("institutional influence D9:8:4", () => {
  beforeEach(() => {
    resetInstitutionalInfluenceTestStacks();
  });

  it("generates institutional influence snapshots when civilization fragility is present", () => {
    const org = "ii-verify-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    const result = evaluateStrategicInstitutionalInfluence(
      institutionalInfluenceEvalInput(org, cognition, 220_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getInstitutionalInfluenceStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise ecosystem impact with macro-influence signals", () => {
    const org = "ii-impact-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    const result = evaluateStrategicInstitutionalInfluence(
      institutionalInfluenceEvalInput(org, cognition, 221_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getInstitutionalInfluenceStore(org).getState().observations.some(
        (o) =>
          o.influenceSignals.includes("cross_system_impact_diffusion") ||
          o.influenceSignals.includes("resilience_propagation") ||
          o.influenceSignals.includes("ecosystem_stabilization")
      )
    ).toBe(true);
  });

  it("detects distributed consequence amplification under macro-impact stress", () => {
    const org = "ii-amplify-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    const consensus = selectLatestDistributedExecutiveCognitionSnapshot(org);
    const result = evaluateStrategicInstitutionalInfluence(
      institutionalInfluenceEvalInput(org, cognition, 222_000, {
        unifiedConsensusSnapshot: consensus
          ? { ...consensus, runtimeStatus: "fragmented" }
          : null,
        continuityPreserved: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getInstitutionalInfluenceStore(org).getState().observations.some(
        (o) =>
          o.influenceSignals.includes("civilization_scale_impact_warning") ||
          o.influenceSignals.includes("institutional_fragility_influence_signal") ||
          o.influenceSignals.includes("distributed_failure_amplification")
      )
    ).toBe(true);
  });

  it("skips when civilization fragility depth is insufficient", () => {
    const org = "ii-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);
    evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 190_000)
    );
    evaluateInstitutionalEcosystemSynchronization(
      ecosystemSyncEvalInput(org, cognition, 200_000)
    );

    const result = evaluateStrategicInstitutionalInfluence(
      institutionalInfluenceEvalInput(org, cognition, 223_000, {
        civilizationFragilitySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_civilization_fragility_depth");
  });

  it("dedupes duplicate institutional influence evaluations on unchanged signature", () => {
    const org = "ii-dedupe-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    const first = integrateInstitutionalInfluenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 224_000,
    });
    const second = integrateInstitutionalInfluenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 224_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded institutional influence memory under caps", () => {
    const org = "ii-bounded-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicInstitutionalInfluence(
        institutionalInfluenceEvalInput(
          org,
          { ...cognition, signature: `ii-bounded-${i}` },
          225_000 + i * 600
        )
      );
    }

    const state = getInstitutionalInfluenceStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive institutional influence evaluation", () => {
    expect(beginInstitutionalInfluenceEvaluation()).toBe(true);
    expect(beginInstitutionalInfluenceEvaluation()).toBe(true);
    expect(beginInstitutionalInfluenceEvaluation()).toBe(false);
    endInstitutionalInfluenceEvaluation();
    endInstitutionalInfluenceEvaluation();
  });

  it("emits institutional influence contract fields", () => {
    const org = "ii-contract-org";
    const cognition = minimalCognition(org);
    seedInstitutionalInfluenceRuntime(org, cognition);

    const result = evaluateStrategicInstitutionalInfluence(
      institutionalInfluenceEvalInput(org, cognition, 226_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.influenceId.length).toBeGreaterThan(0);
    expect(observation!.impactState.length).toBeGreaterThan(0);
    expect(observation!.influenceStrength.length).toBeGreaterThan(0);
    expect(observation!.influenceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(226_000);
    expect(selectLatestInstitutionalInfluenceSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
