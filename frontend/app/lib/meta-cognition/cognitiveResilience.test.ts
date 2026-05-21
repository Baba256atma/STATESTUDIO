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
import {
  beginCognitiveResilienceEvaluation,
  endCognitiveResilienceEvaluation,
  resetCognitiveResilienceGuards,
} from "./cognitiveResilienceGuards";
import {
  getCognitiveResilienceStore,
  resetCognitiveResilienceStores,
} from "./cognitiveResilienceStore";
import { evaluateExecutiveCognitiveResilience } from "./cognitiveResilienceEngine";
import { integrateCognitiveResilienceWithCognition } from "./integrateCognitiveResilienceWithCognition";
import { resetCognitiveAdaptationGuards } from "./cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "./cognitiveAdaptationStore";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { resetUnifiedMetaCognitionGuards } from "./unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "./unifiedMetaCognitionStore";

function resetCognitiveResilienceTestStacks(): void {
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

function minimalCognition(org = "cognitive-resilience-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedCognitiveResilienceRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `cr-seed-${i}` },
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
}

function resilienceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveCognitiveResilience>[0]>
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
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive cognitive resilience D9:6:7", () => {
  beforeEach(() => {
    resetCognitiveResilienceTestStacks();
  });

  it("forms resilience observations when trust calibration is present", () => {
    const org = "cr-verify-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveResilience(resilienceEvalInput(org, cognition, 72_000));

    expect(result.evaluated).toBe(true);
    expect(getCognitiveResilienceStore(org).getState().resilienceObservations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("increases resilience strength when aligned runtimes are stable", () => {
    const org = "cr-stable-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);
    const drift = selectLatestExecutiveCognitiveDriftSnapshot(org);
    const trust = selectLatestExecutiveTrustCalibrationSnapshot(org);

    const result = evaluateExecutiveCognitiveResilience(
      resilienceEvalInput(org, cognition, 73_000, {
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              awarenessSummary: {
                ...integrity.awarenessSummary,
                dominantConsistencyState: "verified",
                trustPosture: "executive_grade",
              },
              recentTrustObservations: [
                ...integrity.recentTrustObservations,
                {
                  integrityId: "cr-cross-align",
                  consistencyState: "verified" as const,
                  integrityStrength: "executive_grade" as const,
                  verificationCategory: "cognition_alignment" as const,
                  summary: "Cross-runtime alignment verified.",
                  consistencySignals: Object.freeze(["cross_runtime_alignment"]),
                  integrityRisks: Object.freeze([]),
                  confidence: 0.92,
                  generatedAt: 73_000,
                  lastObservedAt: 73_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        cognitiveDriftSnapshot: drift
          ? {
              ...drift,
              awarenessSummary: { ...drift.awarenessSummary, dominantStabilityState: "stable" },
            }
          : null,
        trustCalibrationSnapshot: trust
          ? {
              ...trust,
              awarenessSummary: {
                ...trust.awarenessSummary,
                dominantTrustState: "highly_trustworthy",
                dependabilityPosture: "executive_grade",
              },
            }
          : null,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveResilienceStore(org).getState().resilienceObservations.some(
        (o) =>
          o.resilienceStrength === "resilient" ||
          o.resilienceStrength === "enterprise_grade" ||
          o.survivabilityState === "survivable"
      )
    ).toBe(true);
  });

  it("reduces survivability state when contradictions degrade orchestration", () => {
    const org = "cr-contradiction-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);
    const sequencing = selectLatestAdaptiveSequencingSnapshot(org);

    const result = evaluateExecutiveCognitiveResilience(
      resilienceEvalInput(org, cognition, 74_000, {
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              contradictionIndicators: [
                {
                  indicatorId: "cr-contradiction-1",
                  indicatorLabel: "integrity_conflict",
                  indicatorSummary: "Orchestration contradiction detected.",
                  linkedCategories: Object.freeze(["orchestration_integrity" as const]),
                  contradictionSeverity: "high" as const,
                  generatedAt: 74_000,
                },
              ],
            }
          : null,
        sequencingSnapshot: sequencing
          ? {
              ...sequencing,
              awarenessSummary: {
                ...sequencing.awarenessSummary,
                dominantSequencingState: "unstable" as const,
              },
            }
          : null,
        decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org)
          ? {
              ...selectLatestEnterpriseStrategicActionSnapshot(org)!,
              runtimeStatus: "unstable",
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveResilienceStore(org).getState().resilienceObservations.some(
        (o) =>
          o.survivabilityState === "unstable" ||
          o.survivabilityState === "degraded" ||
          o.survivabilityRisks.includes("orchestration_instability")
      )
    ).toBe(true);
  });

  it("tracks adaptive recovery when drift stabilizes after degradation", () => {
    const org = "cr-recovery-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const drift = selectLatestExecutiveCognitiveDriftSnapshot(org);
    const trust = selectLatestExecutiveTrustCalibrationSnapshot(org);

    const result = evaluateExecutiveCognitiveResilience(
      resilienceEvalInput(org, cognition, 75_000, {
        cognitiveDriftSnapshot: drift
          ? {
              ...drift,
              awarenessSummary: { ...drift.awarenessSummary, dominantStabilityState: "adaptive" },
              recentReasoningStabilities: [
                ...drift.recentReasoningStabilities,
                {
                  driftId: "cr-prior-degrading",
                  stabilityState: "degrading" as const,
                  driftSeverity: "elevated" as const,
                  driftCategory: "orchestration_drift" as const,
                  summary: "Prior degrading drift.",
                  stabilitySignals: Object.freeze(["adaptive_sequencing_active"]),
                  driftRisks: Object.freeze(["sequencing_instability"]),
                  confidence: 0.7,
                  generatedAt: 74_500,
                  lastObservedAt: 74_500,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        trustCalibrationSnapshot: trust
          ? {
              ...trust,
              awarenessSummary: {
                ...trust.awarenessSummary,
                dominantTrustState: "reliable",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveResilienceStore(org).getState().resilienceObservations.some((o) =>
        o.resilienceSignals.includes("cognitive_drift_recovery")
      )
    ).toBe(true);
  });

  it("dedupes duplicate resilience evaluations on unchanged signature", () => {
    const org = "cr-dedupe-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const first = integrateCognitiveResilienceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 76_000,
    });
    const second = integrateCognitiveResilienceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 76_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded cognitive resilience memory under caps", () => {
    const org = "cr-bounded-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveCognitiveResilience(
        resilienceEvalInput(org, { ...cognition, signature: `cr-bounded-${i}` }, 77_000 + i * 600)
      );
    }

    const state = getCognitiveResilienceStore(org).getState();
    expect(state.resilienceObservations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive cognitive resilience evaluation", () => {
    expect(beginCognitiveResilienceEvaluation()).toBe(true);
    expect(beginCognitiveResilienceEvaluation()).toBe(true);
    expect(beginCognitiveResilienceEvaluation()).toBe(false);
    endCognitiveResilienceEvaluation();
    endCognitiveResilienceEvaluation();
  });

  it("emits cognitive resilience contract fields", () => {
    const org = "cr-contract-org";
    const cognition = minimalCognition(org);
    seedCognitiveResilienceRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveResilience(resilienceEvalInput(org, cognition, 78_000));

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentResilienceObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.resilienceId.length).toBeGreaterThan(0);
    expect(observation!.survivabilityState.length).toBeGreaterThan(0);
    expect(observation!.resilienceStrength.length).toBeGreaterThan(0);
    expect(observation!.resilienceSignals.length).toBeGreaterThan(0);
    expect(observation!.survivabilityRisks).toBeDefined();
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(78_000);
  });
});
