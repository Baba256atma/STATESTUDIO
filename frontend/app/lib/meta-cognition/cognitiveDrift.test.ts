import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateUnifiedExecutiveDecisionRuntime } from "../decision-orchestration/unifiedDecisionRuntimeEngine";
import { evaluateStrategicStabilityOptimization } from "../decision-orchestration/stabilityOptimizationEngine";
import { evaluateStrategicInterventionProjection } from "../decision-orchestration/interventionProjectionEngine";
import { evaluateInstitutionalAlignmentIntelligence } from "../decision-orchestration/institutionalAlignmentEngine";
import { evaluateExecutiveDecisionConfidence } from "../decision-orchestration/decisionConfidenceEngine";
import { evaluateAdaptiveDecisionSequencing } from "../decision-orchestration/adaptiveSequencingEngine";
import { evaluateExecutiveScenarioCoordination } from "../decision-orchestration/scenarioCoordinationEngine";
import { evaluateStrategicPriorityArbitration } from "../decision-orchestration/priorityArbitrationEngine";
import { evaluateStrategicActionDependencies } from "../decision-orchestration/actionDependencyEngine";
import { evaluateExecutiveDecisionOrchestration } from "../decision-orchestration/decisionOrchestrationEngine";
import { selectLatestAdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { evaluateUnifiedExecutiveForesightRuntime } from "../foresight-cognition/unifiedForesightRuntimeEngine";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { evaluateUnifiedTemporalCognition } from "../temporal-cognition/unifiedTemporalCognitionEngine";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { evaluateExecutiveMetaCognition } from "./metaCognitionEngine";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { resetMetaCognitionGuards } from "./metaCognitionGuards";
import { resetMetaCognitionStores } from "./metaCognitionStore";
import { resetReasoningIntegrityGuards } from "./reasoningIntegrityGuards";
import { resetReasoningIntegrityStores } from "./reasoningIntegrityStore";
import { evaluateStrategicReasoningIntegrity } from "./reasoningIntegrityEngine";
import { selectLatestStrategicReasoningIntegritySnapshot } from "./reasoningIntegritySelectors";
import {
  beginCognitiveDriftEvaluation,
  endCognitiveDriftEvaluation,
  resetCognitiveDriftGuards,
} from "./cognitiveDriftGuards";
import {
  getCognitiveDriftStore,
  resetCognitiveDriftStores,
} from "./cognitiveDriftStore";
import { evaluateExecutiveCognitiveDrift } from "./cognitiveDriftEngine";
import { integrateCognitiveDriftWithCognition } from "./integrateCognitiveDriftWithCognition";
import { resetCognitiveUncertaintyGuards } from "./cognitiveUncertaintyGuards";
import { resetCognitiveUncertaintyStores } from "./cognitiveUncertaintyStore";
import { resetExplainabilityGuards } from "./explainabilityGuards";
import { resetExplainabilityStores } from "./explainabilityStore";
import { resetTrustCalibrationGuards } from "./trustCalibrationGuards";
import { resetTrustCalibrationStores } from "./trustCalibrationStore";
import { resetCognitiveResilienceGuards } from "./cognitiveResilienceGuards";
import { resetCognitiveResilienceStores } from "./cognitiveResilienceStore";
import { resetCognitiveAdaptationGuards } from "./cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "./cognitiveAdaptationStore";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { resetUnifiedMetaCognitionGuards } from "./unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "./unifiedMetaCognitionStore";

function resetCognitiveDriftTestStacks(): void {
  resetMetaCognitionStores();
  resetMetaCognitionGuards();
  resetReasoningIntegrityStores();
  resetReasoningIntegrityGuards();
  resetCognitiveDriftStores();
  resetCognitiveDriftGuards();
  resetCognitiveUncertaintyStores();
  resetCognitiveUncertaintyGuards();
  resetExplainabilityStores();
  resetExplainabilityGuards();
  resetTrustCalibrationStores();
  resetTrustCalibrationGuards();
  resetCognitiveResilienceStores();
  resetCognitiveResilienceGuards();
  resetCognitiveAdaptationStores();
  resetCognitiveAdaptationGuards();
  resetCognitiveGovernanceStores();
  resetCognitiveGovernanceGuards();
  resetUnifiedMetaCognitionStores();
  resetUnifiedMetaCognitionGuards();
}

function minimalCognition(org = "cognitive-drift-org"): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: org,
      institutional: null,
      cognitionConverged: true,
      fragilityElevated: true,
    }),
    pressurePosture: "attention",
    timelineStrategicEvolutionLine:
      "Strategic evolution shift shows governance delay growth under rising operational load.",
    organizationalLearningLine:
      "Organizational learning detects coordination strain and pattern recurrence under intensified pressure.",
    resilienceForecastLine:
      "Resilience trajectory may strengthen with intervention before fatigue accumulates.",
  };
}

function seedCognitiveDriftRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `cd-seed-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: true },
      fragilityElevated: true,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 5_000,
  });
  evaluateUnifiedTemporalCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 12_000,
  });
  evaluateUnifiedExecutiveForesightRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    pressureTopologyStressed: true,
    now: 19_000,
  });
  evaluateExecutiveDecisionOrchestration({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 19_500,
  });
  evaluateStrategicActionDependencies({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 20_000,
  });
  evaluateStrategicPriorityArbitration({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 20_500,
  });
  evaluateExecutiveScenarioCoordination({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 21_000,
  });
  evaluateAdaptiveDecisionSequencing({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 21_500,
  });
  evaluateExecutiveDecisionConfidence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 22_000,
  });
  evaluateInstitutionalAlignmentIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 23_500,
  });
  evaluateStrategicInterventionProjection({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 24_000,
  });
  evaluateStrategicStabilityOptimization({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 25_000,
  });
  evaluateUnifiedExecutiveDecisionRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    pressureTopologyStressed: true,
    now: 31_000,
  });
  evaluateExecutiveMetaCognition({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 32_000,
  });
  evaluateStrategicReasoningIntegrity({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 38_000,
  });
}

function driftEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveCognitiveDrift>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(org),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive cognitive drift D9:6:3", () => {
  beforeEach(() => {
    resetCognitiveDriftTestStacks();
  });

  it("forms drift awareness when reasoning integrity is present", () => {
    const org = "cd-verify-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveDrift(driftEvalInput(org, cognition, 45_000));

    expect(result.evaluated).toBe(true);
    expect(getCognitiveDriftStore(org).getState().reasoningStabilities.length).toBeGreaterThan(0);
    expect(result.snapshot?.stabilityCount).toBeGreaterThan(0);
  });

  it("reduces drift severity when aligned runtimes are stable", () => {
    const org = "cd-stable-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);

    const result = evaluateExecutiveCognitiveDrift(
      driftEvalInput(org, cognition, 46_000, {
        foresightSnapshot: foresight
          ? { ...foresight, runtimeStatus: "stable", foresightHealth: "strong" }
          : null,
        decisionSnapshot: decision
          ? { ...decision, runtimeStatus: "stable", orchestrationHealth: "strong" }
          : null,
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              awarenessSummary: {
                ...integrity.awarenessSummary,
                dominantConsistencyState: "verified",
                dominantIntegrityStrength: "executive_grade",
                trustPosture: "executive_grade",
              },
            }
          : null,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveDriftStore(org).getState().reasoningStabilities.some(
        (s) => s.driftSeverity === "low" || s.stabilityState === "stable"
      )
    ).toBe(true);
  });

  it("increases drift severity when contradictions repeat", () => {
    const org = "cd-contradiction-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);
    const boostedIntegrity = integrity
      ? {
          ...integrity,
          contradictionIndicators: [
            {
              indicatorId: "cd-contradiction-1",
              indicatorLabel: "integrity_conflict",
              indicatorSummary: "Repeated contradiction across runtimes.",
              linkedCategories: Object.freeze(["orchestration_integrity" as const]),
              contradictionSeverity: "high" as const,
              generatedAt: 47_000,
            },
            {
              indicatorId: "cd-contradiction-2",
              indicatorLabel: "recommendation_contradiction",
              indicatorSummary: "Conflicting recommendations detected.",
              linkedCategories: Object.freeze(["foresight_consistency" as const]),
              contradictionSeverity: "high" as const,
              generatedAt: 47_000,
            },
          ],
          recentTrustObservations: [
            ...integrity.recentTrustObservations,
            {
              integrityId: "cd-obs-contradictory-1",
              consistencyState: "contradictory" as const,
              integrityStrength: "weak" as const,
              verificationCategory: "orchestration_integrity" as const,
              summary: "Contradictory orchestration signal.",
              consistencySignals: Object.freeze(["foresight_escalation_signal"]),
              integrityRisks: Object.freeze(["repeated_contradiction"]),
              confidence: 0.65,
              generatedAt: 47_000,
              lastObservedAt: 47_000,
              occurrenceCount: 1,
            },
            {
              integrityId: "cd-obs-contradictory-2",
              consistencyState: "fragmented" as const,
              integrityStrength: "monitored" as const,
              verificationCategory: "foresight_consistency" as const,
              summary: "Fragmented foresight alignment.",
              consistencySignals: Object.freeze([]),
              integrityRisks: Object.freeze(["reasoning_volatility"]),
              confidence: 0.66,
              generatedAt: 47_000,
              lastObservedAt: 47_000,
              occurrenceCount: 1,
            },
          ],
        }
      : null;

    const result = evaluateExecutiveCognitiveDrift(
      driftEvalInput(org, cognition, 47_000, {
        reasoningIntegritySnapshot: boostedIntegrity,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveDriftStore(org).getState().reasoningStabilities.some(
        (s) =>
          s.driftSeverity === "unstable" ||
          s.driftSeverity === "critical" ||
          s.stabilityState === "fragmented"
      )
    ).toBe(true);
  });

  it("detects orchestration volatility correctly", () => {
    const org = "cd-orchestration-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const sequencing = selectLatestAdaptiveSequencingSnapshot(org);
    const unstableSequencing = sequencing
      ? {
          ...sequencing,
          awarenessSummary: {
            ...sequencing.awarenessSummary,
            dominantSequencingState: "unstable" as const,
          },
        }
      : null;

    const result = evaluateExecutiveCognitiveDrift(
      driftEvalInput(org, cognition, 48_000, { sequencingSnapshot: unstableSequencing })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveDriftStore(org).getState().reasoningStabilities.some(
        (s) => s.driftCategory === "orchestration_drift"
      )
    ).toBe(true);
  });

  it("dedupes duplicate drift evaluations on unchanged signature", () => {
    const org = "cd-dedupe-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const first = integrateCognitiveDriftWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 49_000,
    });
    const second = integrateCognitiveDriftWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 49_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded cognitive drift memory under caps", () => {
    const org = "cd-bounded-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveCognitiveDrift(
        driftEvalInput(org, { ...cognition, signature: `cd-bounded-${i}` }, 50_000 + i * 600)
      );
    }

    const state = getCognitiveDriftStore(org).getState();
    expect(state.reasoningStabilities.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive cognitive drift evaluation", () => {
    expect(beginCognitiveDriftEvaluation()).toBe(true);
    expect(beginCognitiveDriftEvaluation()).toBe(true);
    expect(beginCognitiveDriftEvaluation()).toBe(false);
    endCognitiveDriftEvaluation();
    endCognitiveDriftEvaluation();
  });

  it("emits cognitive drift contract fields", () => {
    const org = "cd-contract-org";
    const cognition = minimalCognition(org);
    seedCognitiveDriftRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveDrift(driftEvalInput(org, cognition, 51_000));

    expect(result.evaluated).toBe(true);
    const stability = result.snapshot?.recentReasoningStabilities[0];
    expect(stability).toBeDefined();
    expect(stability!.driftId.length).toBeGreaterThan(0);
    expect(stability!.stabilityState.length).toBeGreaterThan(0);
    expect(stability!.driftSeverity.length).toBeGreaterThan(0);
    expect(stability!.stabilitySignals.length).toBeGreaterThan(0);
    expect(stability!.driftRisks).toBeDefined();
    expect(stability!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(stability!.generatedAt).toBe(51_000);
  });
});
