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
import {
  minimalCognition,
  resetInstitutionalConsciousnessTestStacks,
} from "../institutional-consciousness/institutionalConsciousness.test";
import { evaluateEnterpriseCognitiveSingularity } from "../cognitive-singularity/cognitiveSingularityEngine";
import { resetCognitiveSingularityGuards } from "../cognitive-singularity/cognitiveSingularityGuards";
import { resetCognitiveSingularityStores } from "../cognitive-singularity/cognitiveSingularityStore";
import { evaluateEnterpriseAwarenessSynchronization } from "../cognitive-singularity/awarenessSynchronizationEngine";
import { resetAwarenessSynchronizationGuards } from "../cognitive-singularity/awarenessSynchronizationGuards";
import { resetAwarenessSynchronizationStores } from "../cognitive-singularity/awarenessSynchronizationStore";
import { evaluateUnifiedStrategicIntent } from "../cognitive-singularity/strategicIntentEngine";
import { resetStrategicIntentGuards } from "../cognitive-singularity/strategicIntentGuards";
import { resetStrategicIntentStores } from "../cognitive-singularity/strategicIntentStore";
import { evaluateEnterpriseStrategicIdentity } from "../cognitive-singularity/strategicIdentityEngine";
import { resetStrategicIdentityGuards } from "../cognitive-singularity/strategicIdentityGuards";
import { resetStrategicIdentityStores } from "../cognitive-singularity/strategicIdentityStore";
import { evaluateUnifiedStrategicWill } from "../cognitive-singularity/strategicWillEngine";
import { resetStrategicWillGuards } from "../cognitive-singularity/strategicWillGuards";
import { resetStrategicWillStores } from "../cognitive-singularity/strategicWillStore";
import { evaluateUnifiedStrategicCoherence } from "../cognitive-singularity/strategicCoherenceEngine";
import { resetStrategicCoherenceGuards } from "../cognitive-singularity/strategicCoherenceGuards";
import { resetStrategicCoherenceStores } from "../cognitive-singularity/strategicCoherenceStore";
import { evaluateEnterpriseStrategicEquilibrium } from "../cognitive-singularity/strategicEquilibriumEngine";
import { resetStrategicEquilibriumGuards } from "../cognitive-singularity/strategicEquilibriumGuards";
import { resetStrategicEquilibriumStores } from "../cognitive-singularity/strategicEquilibriumStore";
import { evaluateUnifiedStrategicResonance } from "../cognitive-singularity/strategicResonanceEngine";
import { resetStrategicResonanceGuards } from "../cognitive-singularity/strategicResonanceGuards";
import { resetStrategicResonanceStores } from "../cognitive-singularity/strategicResonanceStore";
import { evaluateFinalStrategicIntegration } from "../cognitive-singularity/finalStrategicIntegrationEngine";
import { resetFinalStrategicIntegrationGuards } from "../cognitive-singularity/finalStrategicIntegrationGuards";
import { resetFinalStrategicIntegrationStores } from "../cognitive-singularity/finalStrategicIntegrationStore";
import { selectLatestFinalStrategicIntegrationSnapshot } from "../cognitive-singularity/finalStrategicIntegrationSelectors";
import { selectLatestEnterpriseStrategicResonanceSnapshot } from "../cognitive-singularity/strategicResonanceSelectors";
import { selectLatestEnterpriseStrategicEquilibriumSnapshot } from "../cognitive-singularity/strategicEquilibriumSelectors";
import { selectLatestUnifiedStrategicCoherenceSnapshot } from "../cognitive-singularity/strategicCoherenceSelectors";
import { selectLatestEnterpriseStrategicWillSnapshot } from "../cognitive-singularity/strategicWillSelectors";
import { selectLatestEnterpriseStrategicIdentitySnapshot } from "../cognitive-singularity/strategicIdentitySelectors";
import { selectLatestUnifiedStrategicIntentSnapshot } from "../cognitive-singularity/strategicIntentSelectors";
import { selectLatestEnterpriseAwarenessSynchronizationSnapshot } from "../cognitive-singularity/awarenessSynchronizationSelectors";
import { selectLatestEnterpriseCognitiveSingularitySnapshot } from "../cognitive-singularity/cognitiveSingularitySelectors";
import { evaluateUnifiedCognitiveSingularityRuntime } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeEngine";
import { resetUnifiedCognitiveSingularityRuntimeGuards } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeGuards";
import { resetUnifiedCognitiveSingularityRuntimeStores } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeStore";
import { selectLatestFinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeSelectors";
import {
  beginEnterpriseRuntimeFoundationEvaluation,
  endEnterpriseRuntimeFoundationEvaluation,
  resetEnterpriseRuntimeFoundationGuards,
} from "./enterpriseRuntimeFoundationGuards";
import {
  getEnterpriseRuntimeFoundationStore,
  resetEnterpriseRuntimeFoundationStores,
} from "./enterpriseRuntimeFoundationStore";
import { evaluateEnterpriseRuntimeFoundation } from "./enterpriseRuntimeFoundationEngine";
import { integrateEnterpriseRuntimeFoundationWithCognition } from "./integrateEnterpriseRuntimeFoundationWithCognition";
import { selectLatestMVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationSelectors";

export function resetRuntimeFoundationTestStacks(): void {
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
  resetStrategicCoherenceStores();
  resetStrategicCoherenceGuards();
  resetStrategicEquilibriumStores();
  resetStrategicEquilibriumGuards();
  resetStrategicResonanceStores();
  resetStrategicResonanceGuards();
  resetFinalStrategicIntegrationStores();
  resetFinalStrategicIntegrationGuards();
  resetUnifiedCognitiveSingularityRuntimeStores();
  resetUnifiedCognitiveSingularityRuntimeGuards();
  resetEnterpriseRuntimeFoundationStores();
  resetEnterpriseRuntimeFoundationGuards();
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
    ...singularityEvalInput(org, cognition, now),
    cognitiveSingularitySnapshot: selectLatestEnterpriseCognitiveSingularitySnapshot(org),
  };
}

function strategicIntentEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...awarenessSyncEvalInput(org, cognition, now),
    awarenessSynchronizationSnapshot: selectLatestEnterpriseAwarenessSynchronizationSnapshot(org),
  };
}

function strategicIdentityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicIntentEvalInput(org, cognition, now),
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(org),
  };
}

function strategicWillEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicIdentityEvalInput(org, cognition, now),
    enterpriseStrategicIdentitySnapshot: selectLatestEnterpriseStrategicIdentitySnapshot(org),
  };
}

function strategicCoherenceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicWillEvalInput(org, cognition, now),
    enterpriseStrategicWillSnapshot: selectLatestEnterpriseStrategicWillSnapshot(org),
  };
}

function strategicEquilibriumEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicCoherenceEvalInput(org, cognition, now),
    unifiedStrategicCoherenceSnapshot: selectLatestUnifiedStrategicCoherenceSnapshot(org),
  };
}

function strategicResonanceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicEquilibriumEvalInput(org, cognition, now),
    enterpriseStrategicEquilibriumSnapshot: selectLatestEnterpriseStrategicEquilibriumSnapshot(org),
  };
}

function finalIntegrationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...strategicResonanceEvalInput(org, cognition, now),
    enterpriseStrategicResonanceSnapshot: selectLatestEnterpriseStrategicResonanceSnapshot(org),
  };
}

function unifiedSingularityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number
) {
  return {
    ...finalIntegrationEvalInput(org, cognition, now),
    finalStrategicIntegrationSnapshot: selectLatestFinalStrategicIntegrationSnapshot(org),
  };
}

export function seedRuntimeFoundationPrerequisites(
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
  evaluateUnifiedStrategicWill(strategicWillEvalInput(organizationId, cognition, 330_000));
  evaluateUnifiedStrategicCoherence(strategicCoherenceEvalInput(organizationId, cognition, 340_000));
  evaluateEnterpriseStrategicEquilibrium(
    strategicEquilibriumEvalInput(organizationId, cognition, 350_000)
  );
  evaluateUnifiedStrategicResonance(strategicResonanceEvalInput(organizationId, cognition, 360_000));
  evaluateFinalStrategicIntegration(finalIntegrationEvalInput(organizationId, cognition, 370_000));
  evaluateUnifiedCognitiveSingularityRuntime(
    unifiedSingularityEvalInput(organizationId, cognition, 380_000)
  );
}

function runtimeFoundationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateEnterpriseRuntimeFoundation>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    finalStrategicIntelligenceSnapshot: selectLatestFinalStrategicIntelligenceSnapshot(org),
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
    runtimeStable: true,
    now,
    ...overrides,
  };
}

describe("enterprise runtime foundation D9:10:1", () => {
  beforeEach(() => {
    resetRuntimeFoundationTestStacks();
  });

  it("generates MVP strategic readiness snapshots when unified singularity is present", () => {
    const org = "erf-verify-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    const result = evaluateEnterpriseRuntimeFoundation(
      runtimeFoundationEvalInput(org, cognition, 390_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.activeFoundationCategories.length).toBeGreaterThanOrEqual(5);
    expect(result.activeFoundationCategoryCount).toBeGreaterThanOrEqual(5);
  });

  it("emits bounded cognition and orchestration readiness signals", () => {
    const org = "erf-readiness-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    const result = evaluateEnterpriseRuntimeFoundation(
      runtimeFoundationEvalInput(org, cognition, 391_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.readinessSignals.some(
        (s) =>
          s === "bounded_cognition" ||
          s === "stable_orchestration" ||
          s === "deterministic_runtime_behavior"
      )
    ).toBe(true);
  });

  it("skips when unified cognitive singularity depth is insufficient", () => {
    const org = "erf-no-singularity-org";
    const cognition = minimalCognition(org);

    const result = evaluateEnterpriseRuntimeFoundation(
      runtimeFoundationEvalInput(org, cognition, 392_000, {
        finalStrategicIntelligenceSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_unified_cognitive_singularity_depth");
  });

  it("detects orchestration reliability weakness under topology pressure", () => {
    const org = "erf-pressure-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    const result = evaluateEnterpriseRuntimeFoundation(
      runtimeFoundationEvalInput(org, cognition, 393_000, {
        decisionSnapshot: null,
        operationalTopologyStressed: true,
        fragilityElevated: true,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.operationalRisks.some(
        (r) =>
          r === "localized_runtime_amplification_pressure" ||
          r === "orchestration_reliability_weakness"
      )
    ).toBe(true);
  });

  it("dedupes duplicate runtime foundation evaluations on unchanged signature", () => {
    const org = "erf-dedupe-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    const first = integrateEnterpriseRuntimeFoundationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      now: 394_000,
    });
    const second = integrateEnterpriseRuntimeFoundationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      cognitionConverged: true,
      runtimeStable: true,
      now: 394_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded runtime foundation memory under caps", () => {
    const org = "erf-bounded-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateEnterpriseRuntimeFoundation(
        runtimeFoundationEvalInput(
          org,
          { ...cognition, signature: `erf-bounded-${i}` },
          395_000 + i * 600
        )
      );
    }

    const state = getEnterpriseRuntimeFoundationStore(org).getState();
    expect(state.readinessSnapshots.length).toBeLessThanOrEqual(8);
    expect(state.foundationHistory.length).toBeLessThanOrEqual(10);
  });

  it("blocks recursive enterprise runtime foundation evaluation", () => {
    expect(beginEnterpriseRuntimeFoundationEvaluation()).toBe(true);
    expect(beginEnterpriseRuntimeFoundationEvaluation()).toBe(true);
    expect(beginEnterpriseRuntimeFoundationEvaluation()).toBe(false);
    endEnterpriseRuntimeFoundationEvaluation();
    endEnterpriseRuntimeFoundationEvaluation();
  });

  it("emits enterprise runtime foundation contract fields", () => {
    const org = "erf-contract-org";
    const cognition = minimalCognition(org);
    seedRuntimeFoundationPrerequisites(org, cognition);

    const result = evaluateEnterpriseRuntimeFoundation(
      runtimeFoundationEvalInput(org, cognition, 396_000)
    );

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.runtimeFoundationId.length).toBeGreaterThan(0);
    expect(snapshot!.runtimeStatus.length).toBeGreaterThan(0);
    expect(snapshot!.reliabilityLevel.length).toBeGreaterThan(0);
    expect(snapshot!.readinessSignals.length).toBeGreaterThan(0);
    expect(snapshot!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(snapshot!.confidence).toBeLessThanOrEqual(0.95);
    expect(snapshot!.generatedAt).toBe(396_000);
    expect(snapshot!.summary).not.toMatch(/AGI|self-aware|conscious/i);
    expect(selectLatestMVPStrategicReadinessSnapshot(org)?.reliabilityObservations.length).toBe(7);
  });
});
