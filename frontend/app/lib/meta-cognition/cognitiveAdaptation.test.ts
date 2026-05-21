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
import { resetCognitiveDriftGuards } from "./cognitiveDriftGuards";
import { resetCognitiveDriftStores } from "./cognitiveDriftStore";
import { evaluateExecutiveCognitiveDrift } from "./cognitiveDriftEngine";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftSelectors";
import { resetCognitiveUncertaintyGuards } from "./cognitiveUncertaintyGuards";
import { resetCognitiveUncertaintyStores } from "./cognitiveUncertaintyStore";
import { evaluateExecutiveCognitiveUncertainty } from "./cognitiveUncertaintyEngine";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintySelectors";
import { resetExplainabilityGuards } from "./explainabilityGuards";
import { resetExplainabilityStores } from "./explainabilityStore";
import { evaluateExecutiveExplainability } from "./explainabilityEngine";
import { selectLatestStrategicExplanationSnapshot } from "./explainabilitySelectors";
import { resetTrustCalibrationGuards } from "./trustCalibrationGuards";
import { resetTrustCalibrationStores } from "./trustCalibrationStore";
import { evaluateExecutiveTrustCalibration } from "./trustCalibrationEngine";
import { selectLatestExecutiveTrustCalibrationSnapshot } from "./trustCalibrationSelectors";
import { resetCognitiveResilienceGuards } from "./cognitiveResilienceGuards";
import { resetCognitiveResilienceStores } from "./cognitiveResilienceStore";
import { evaluateExecutiveCognitiveResilience } from "./cognitiveResilienceEngine";
import { selectLatestExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceSelectors";
import {
  beginCognitiveAdaptationEvaluation,
  endCognitiveAdaptationEvaluation,
  resetCognitiveAdaptationGuards,
} from "./cognitiveAdaptationGuards";
import {
  getCognitiveAdaptationStore,
  resetCognitiveAdaptationStores,
} from "./cognitiveAdaptationStore";
import { evaluateExecutiveCognitiveAdaptation } from "./cognitiveAdaptationEngine";
import { integrateCognitiveAdaptationWithCognition } from "./integrateCognitiveAdaptationWithCognition";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { resetUnifiedMetaCognitionGuards } from "./unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "./unifiedMetaCognitionStore";

function resetCognitiveAdaptationTestStacks(): void {
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

function minimalCognition(org = "cognitive-adaptation-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedCognitiveAdaptationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `ca-seed-${i}` },
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
  evaluateExecutiveCognitiveDrift({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 45_000,
  });
  evaluateExecutiveCognitiveUncertainty({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 52_000,
  });
  evaluateExecutiveExplainability({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 58_000,
  });
  evaluateExecutiveTrustCalibration({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 64_000,
  });
  evaluateExecutiveCognitiveResilience({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 70_000,
  });
}

function adaptationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveCognitiveAdaptation>[0]>
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
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(org),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(org),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(org),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(org),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(org),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive cognitive adaptation D9:6:8", () => {
  beforeEach(() => {
    resetCognitiveAdaptationTestStacks();
  });

  it("forms adaptive observations when cognitive resilience is present", () => {
    const org = "ca-verify-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveAdaptation(adaptationEvalInput(org, cognition, 80_000));

    expect(result.evaluated).toBe(true);
    expect(getCognitiveAdaptationStore(org).getState().adaptiveObservations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects confidence rebalancing under elevated uncertainty", () => {
    const org = "ca-balance-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const confidence = selectLatestConfidenceArbitrationSnapshot(org);
    const uncertainty = selectLatestExecutiveCognitiveUncertaintySnapshot(org);
    const trust = selectLatestExecutiveTrustCalibrationSnapshot(org);

    const result = evaluateExecutiveCognitiveAdaptation(
      adaptationEvalInput(org, cognition, 81_000, {
        confidenceSnapshot: confidence
          ? {
              ...confidence,
              recentExecutiveConfidences: [
                {
                  confidenceId: "ca-strong-confidence",
                  confidenceLevel: "strong" as const,
                  certaintyState: "highly_confident" as const,
                  confidenceCategory: "orchestration" as const,
                  summary: "Strong executive confidence under stress.",
                  confidenceSignals: Object.freeze(["high_confidence_arbitration"]),
                  uncertaintySignals: Object.freeze([]),
                  confidenceScore: 0.88,
                  generatedAt: 81_000,
                  lastObservedAt: 81_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        cognitiveUncertaintySnapshot: uncertainty
          ? {
              ...uncertainty,
              ambiguityCount: 2,
              awarenessSummary: {
                ...uncertainty.awarenessSummary,
                dominantCautionPosture: "moderated",
              },
            }
          : null,
        trustCalibrationSnapshot: trust
          ? {
              ...trust,
              awarenessSummary: {
                ...trust.awarenessSummary,
                dominantTrustState: "monitored",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveAdaptationStore(org).getState().adaptiveObservations.some((o) =>
        o.adaptationSignals.includes("confidence_rebalancing")
      )
    ).toBe(true);
  });

  it("forms uncertainty adaptation when ambiguity depth is sufficient", () => {
    const org = "ca-uncertainty-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const uncertainty = selectLatestExecutiveCognitiveUncertaintySnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);

    const result = evaluateExecutiveCognitiveAdaptation(
      adaptationEvalInput(org, cognition, 82_000, {
        cognitiveUncertaintySnapshot: uncertainty
          ? { ...uncertainty, ambiguityCount: 3 }
          : null,
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              awarenessSummary: {
                ...integrity.awarenessSummary,
                dominantConsistencyState: "verified",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveAdaptationStore(org).getState().adaptiveObservations.some(
        (o) => o.adaptationCategory === "uncertainty_adaptation"
      )
    ).toBe(true);
  });

  it("forms trust recalibration when recovery signals are present", () => {
    const org = "ca-trust-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const trust = selectLatestExecutiveTrustCalibrationSnapshot(org);
    const resilience = selectLatestExecutiveCognitiveResilienceSnapshot(org);

    const result = evaluateExecutiveCognitiveAdaptation(
      adaptationEvalInput(org, cognition, 83_000, {
        trustCalibrationSnapshot: trust
          ? {
              ...trust,
              awarenessSummary: {
                ...trust.awarenessSummary,
                dominantTrustState: "reliable",
              },
              recentTrustAdjustments: [
                ...trust.recentTrustAdjustments,
                {
                  trustCalibrationId: "ca-overtrust-recovery",
                  trustState: "reliable" as const,
                  reliabilityStrength: "moderate" as const,
                  trustCategory: "confidence_reliability" as const,
                  summary: "Overtrust warning triggered recalibration.",
                  reliabilitySignals: Object.freeze(["trust_recalibration"]),
                  cautionSignals: Object.freeze(["overtrust_warning"]),
                  confidence: 0.8,
                  generatedAt: 83_000,
                  lastObservedAt: 83_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        cognitiveResilienceSnapshot: resilience
          ? {
              ...resilience,
              recentResilienceObservations: [
                ...resilience.recentResilienceObservations,
                {
                  resilienceId: "ca-drift-recovery",
                  survivabilityState: "adaptive" as const,
                  resilienceStrength: "stable" as const,
                  resilienceCategory: "reasoning_resilience" as const,
                  summary: "Drift recovery observed.",
                  resilienceSignals: Object.freeze(["cognitive_drift_recovery"]),
                  survivabilityRisks: Object.freeze([]),
                  confidence: 0.82,
                  generatedAt: 83_000,
                  lastObservedAt: 83_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveAdaptationStore(org).getState().adaptiveObservations.some((o) =>
        o.adaptationSignals.includes("trust_recalibration")
      )
    ).toBe(true);
  });

  it("dedupes duplicate adaptation evaluations on unchanged signature", () => {
    const org = "ca-dedupe-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const first = integrateCognitiveAdaptationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 84_000,
    });
    const second = integrateCognitiveAdaptationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 84_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded cognitive adaptation memory under caps", () => {
    const org = "ca-bounded-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveCognitiveAdaptation(
        adaptationEvalInput(org, { ...cognition, signature: `ca-bounded-${i}` }, 85_000 + i * 600)
      );
    }

    const state = getCognitiveAdaptationStore(org).getState();
    expect(state.adaptiveObservations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive cognitive adaptation evaluation", () => {
    expect(beginCognitiveAdaptationEvaluation()).toBe(true);
    expect(beginCognitiveAdaptationEvaluation()).toBe(true);
    expect(beginCognitiveAdaptationEvaluation()).toBe(false);
    endCognitiveAdaptationEvaluation();
    endCognitiveAdaptationEvaluation();
  });

  it("emits cognitive adaptation contract fields", () => {
    const org = "ca-contract-org";
    const cognition = minimalCognition(org);
    seedCognitiveAdaptationRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveAdaptation(adaptationEvalInput(org, cognition, 86_000));

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentAdaptiveObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.adaptationId.length).toBeGreaterThan(0);
    expect(observation!.stabilizationState.length).toBeGreaterThan(0);
    expect(observation!.adaptationStrength.length).toBeGreaterThan(0);
    expect(observation!.adaptationSignals.length).toBeGreaterThan(0);
    expect(observation!.stabilizationRisks).toBeDefined();
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(86_000);
  });
});
