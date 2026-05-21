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
  beginEcosystemSynchronizationEvaluation,
  endEcosystemSynchronizationEvaluation,
  resetEcosystemSynchronizationGuards,
} from "./ecosystemSynchronizationGuards";
import {
  getEcosystemSynchronizationStore,
  resetEcosystemSynchronizationStores,
} from "./ecosystemSynchronizationStore";
import { evaluateInstitutionalEcosystemSynchronization } from "./ecosystemSynchronizationEngine";
import { integrateEcosystemSynchronizationWithCognition } from "./integrateEcosystemSynchronizationWithCognition";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import {
  institutionalConsciousnessEvalInput,
  minimalCognition,
  resetInstitutionalConsciousnessTestStacks,
  seedInstitutionalConsciousnessRuntime,
} from "./institutionalConsciousness.test";
import { evaluateInstitutionalConsciousness } from "./institutionalConsciousnessEngine";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

export function resetEcosystemSynchronizationTestStacks(): void {
  resetInstitutionalConsciousnessTestStacks();
  resetEcosystemSynchronizationStores();
  resetEcosystemSynchronizationGuards();
}

function seedEcosystemSynchronizationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  seedInstitutionalConsciousnessRuntime(organizationId, cognition);
  evaluateInstitutionalConsciousness(
    institutionalConsciousnessEvalInput(organizationId, cognition, 190_000)
  );
}

export function ecosystemSynchronizationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateInstitutionalEcosystemSynchronization>[0]>
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
    ...overrides,
  };
}

describe("ecosystem synchronization D9:8:2", () => {
  beforeEach(() => {
    resetEcosystemSynchronizationTestStacks();
  });

  it("generates ecosystem synchronization snapshots when institutional consciousness is present", () => {
    const org = "es-verify-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    const result = evaluateInstitutionalEcosystemSynchronization(
      ecosystemSynchronizationEvalInput(org, cognition, 200_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getEcosystemSynchronizationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects civilization-scale dependency field with macro-coordination signals", () => {
    const org = "es-dependency-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    const result = evaluateInstitutionalEcosystemSynchronization(
      ecosystemSynchronizationEvalInput(org, cognition, 201_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getEcosystemSynchronizationStore(org).getState().observations.some(
        (o) =>
          o.synchronizationSignals.includes("cross_system_dependency_alignment") ||
          o.synchronizationSignals.includes("macro_operational_coordination") ||
          o.synchronizationSignals.includes("institutional_interconnectivity")
      )
    ).toBe(true);
  });

  it("detects cascading fragility propagation under ecosystem interdependency stress", () => {
    const org = "es-fragility-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    const consensus = selectLatestDistributedExecutiveCognitionSnapshot(org);
    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const result = evaluateInstitutionalEcosystemSynchronization(
      ecosystemSynchronizationEvalInput(org, cognition, 202_000, {
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
      getEcosystemSynchronizationStore(org).getState().observations.some(
        (o) =>
          o.synchronizationSignals.includes("cascading_fragility_propagation") ||
          o.synchronizationSignals.includes("interdependency_amplification_warning") ||
          o.synchronizationSignals.includes("macro_fragility_propagation")
      )
    ).toBe(true);
  });

  it("skips when institutional consciousness depth is insufficient", () => {
    const org = "es-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateInstitutionalEcosystemSynchronization(
      ecosystemSynchronizationEvalInput(org, cognition, 203_000, {
        institutionalConsciousnessSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_institutional_consciousness_depth");
  });

  it("dedupes duplicate ecosystem synchronization evaluations on unchanged signature", () => {
    const org = "es-dedupe-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    const first = integrateEcosystemSynchronizationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 204_000,
    });
    const second = integrateEcosystemSynchronizationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 204_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded ecosystem synchronization memory under caps", () => {
    const org = "es-bounded-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateInstitutionalEcosystemSynchronization(
        ecosystemSynchronizationEvalInput(
          org,
          { ...cognition, signature: `es-bounded-${i}` },
          205_000 + i * 600
        )
      );
    }

    const state = getEcosystemSynchronizationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive ecosystem synchronization evaluation", () => {
    expect(beginEcosystemSynchronizationEvaluation()).toBe(true);
    expect(beginEcosystemSynchronizationEvaluation()).toBe(true);
    expect(beginEcosystemSynchronizationEvaluation()).toBe(false);
    endEcosystemSynchronizationEvaluation();
    endEcosystemSynchronizationEvaluation();
  });

  it("emits ecosystem synchronization contract fields", () => {
    const org = "es-contract-org";
    const cognition = minimalCognition(org);
    seedEcosystemSynchronizationRuntime(org, cognition);

    const result = evaluateInstitutionalEcosystemSynchronization(
      ecosystemSynchronizationEvalInput(org, cognition, 206_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.synchronizationId.length).toBeGreaterThan(0);
    expect(observation!.coordinationState.length).toBeGreaterThan(0);
    expect(observation!.synchronizationStrength.length).toBeGreaterThan(0);
    expect(observation!.synchronizationSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(206_000);
    expect(selectLatestEcosystemSynchronizationSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
