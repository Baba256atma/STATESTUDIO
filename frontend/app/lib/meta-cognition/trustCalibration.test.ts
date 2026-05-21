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
import {
  beginTrustCalibrationEvaluation,
  endTrustCalibrationEvaluation,
  resetTrustCalibrationGuards,
} from "./trustCalibrationGuards";
import { getTrustCalibrationStore, resetTrustCalibrationStores } from "./trustCalibrationStore";
import { evaluateExecutiveTrustCalibration } from "./trustCalibrationEngine";
import { integrateTrustCalibrationWithCognition } from "./integrateTrustCalibrationWithCognition";
import { resetCognitiveResilienceGuards } from "./cognitiveResilienceGuards";
import { resetCognitiveResilienceStores } from "./cognitiveResilienceStore";
import { resetCognitiveAdaptationGuards } from "./cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "./cognitiveAdaptationStore";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { resetUnifiedMetaCognitionGuards } from "./unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "./unifiedMetaCognitionStore";

function resetTrustCalibrationTestStacks(): void {
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

function minimalCognition(org = "trust-calibration-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedTrustCalibrationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `tc-seed-${i}` },
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
}

function trustCalibrationEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveTrustCalibration>[0]>
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
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive trust calibration D9:6:6", () => {
  beforeEach(() => {
    resetTrustCalibrationTestStacks();
  });

  it("forms trust calibration when explainability traces are present", () => {
    const org = "tc-verify-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const result = evaluateExecutiveTrustCalibration(trustCalibrationEvalInput(org, cognition, 64_000));

    expect(result.evaluated).toBe(true);
    expect(getTrustCalibrationStore(org).getState().trustAdjustments.length).toBeGreaterThan(0);
    expect(result.snapshot?.adjustmentCount).toBeGreaterThan(0);
  });

  it("increases reliability strength when aligned runtimes are stable", () => {
    const org = "tc-aligned-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const memory = selectLatestEnterpriseMemorySnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);
    const drift = selectLatestExecutiveCognitiveDriftSnapshot(org);

    const result = evaluateExecutiveTrustCalibration(
      trustCalibrationEvalInput(org, cognition, 65_000, {
        memorySnapshot: memory
          ? { ...memory, institutionalHealth: "verified", runtimeStatus: "stable" }
          : null,
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
                trustPosture: "executive_grade",
              },
              recentTrustObservations: [
                ...integrity.recentTrustObservations,
                {
                  integrityId: "tc-cross-align",
                  consistencyState: "verified" as const,
                  integrityStrength: "executive_grade" as const,
                  verificationCategory: "cognition_alignment" as const,
                  summary: "Cross-runtime alignment verified.",
                  consistencySignals: Object.freeze(["cross_runtime_alignment"]),
                  integrityRisks: Object.freeze([]),
                  confidence: 0.92,
                  generatedAt: 65_000,
                  lastObservedAt: 65_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        cognitiveDriftSnapshot: drift
          ? {
              ...drift,
              awarenessSummary: {
                ...drift.awarenessSummary,
                dominantStabilityState: "stable",
              },
            }
          : null,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getTrustCalibrationStore(org).getState().trustAdjustments.some(
        (a) =>
          a.reliabilityStrength === "strong" ||
          a.reliabilityStrength === "executive_grade" ||
          a.trustState === "highly_trustworthy"
      )
    ).toBe(true);
  });

  it("lowers trust state when operational visibility is degraded", () => {
    const org = "tc-visibility-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const uncertainty = selectLatestExecutiveCognitiveUncertaintySnapshot(org);

    const result = evaluateExecutiveTrustCalibration(
      trustCalibrationEvalInput(org, cognition, 66_000, {
        cognitiveUncertaintySnapshot: uncertainty
          ? {
              ...uncertainty,
              recentAmbiguityObservations: [
                ...uncertainty.recentAmbiguityObservations,
                {
                  ambiguityId: "tc-partial-visibility",
                  cautionPosture: "moderated" as const,
                  uncertaintySeverity: "elevated" as const,
                  ambiguityCategory: "operational_visibility_gap" as const,
                  summary: "Operational visibility remains partial.",
                  knownSignals: Object.freeze(["escalation_risk_signal"]),
                  unknownZones: Object.freeze(["partial_coordination_visibility"]),
                  cautionRisks: Object.freeze(["incomplete_situational_awareness"]),
                  confidence: 0.8,
                  generatedAt: 66_000,
                  lastObservedAt: 66_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getTrustCalibrationStore(org).getState().trustAdjustments.some(
        (a) =>
          a.trustState === "monitored" ||
          a.trustState === "cautious" ||
          a.cautionSignals.some((s) => s.includes("visibility"))
      )
    ).toBe(true);
  });

  it("detects overtrust when confidence exceeds evidence quality", () => {
    const org = "tc-overtrust-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const confidence = selectLatestConfidenceArbitrationSnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);

    const result = evaluateExecutiveTrustCalibration(
      trustCalibrationEvalInput(org, cognition, 67_000, {
        confidenceSnapshot: confidence
          ? {
              ...confidence,
              recentExecutiveConfidences: confidence.recentExecutiveConfidences.map((c, i) =>
                i === 0 ? { ...c, confidenceLevel: "executive_grade" as const } : c
              ),
              coordinationSummary: {
                ...confidence.coordinationSummary,
                dominantCertaintyState: "fragmented" as const,
                certaintyPosture: "low" as const,
              },
            }
          : null,
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              recentTrustObservations: [
                ...integrity.recentTrustObservations,
                {
                  integrityId: "tc-confidence-mismatch",
                  consistencyState: "partially_aligned" as const,
                  integrityStrength: "monitored" as const,
                  verificationCategory: "confidence_reliability" as const,
                  summary: "Confidence evidence mismatch.",
                  consistencySignals: Object.freeze([]),
                  integrityRisks: Object.freeze(["confidence_evidence_mismatch"]),
                  confidence: 0.69,
                  generatedAt: 67_000,
                  lastObservedAt: 67_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getTrustCalibrationStore(org).getState().trustAdjustments.some((a) =>
        a.cautionSignals.includes("overtrust_warning")
      )
    ).toBe(true);
  });

  it("dedupes duplicate trust calibration evaluations on unchanged signature", () => {
    const org = "tc-dedupe-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const first = integrateTrustCalibrationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 68_000,
    });
    const second = integrateTrustCalibrationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 68_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded trust calibration memory under caps", () => {
    const org = "tc-bounded-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveTrustCalibration(
        trustCalibrationEvalInput(org, { ...cognition, signature: `tc-bounded-${i}` }, 69_000 + i * 600)
      );
    }

    const state = getTrustCalibrationStore(org).getState();
    expect(state.trustAdjustments.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive trust calibration evaluation", () => {
    expect(beginTrustCalibrationEvaluation()).toBe(true);
    expect(beginTrustCalibrationEvaluation()).toBe(true);
    expect(beginTrustCalibrationEvaluation()).toBe(false);
    endTrustCalibrationEvaluation();
    endTrustCalibrationEvaluation();
  });

  it("emits trust calibration contract fields", () => {
    const org = "tc-contract-org";
    const cognition = minimalCognition(org);
    seedTrustCalibrationRuntime(org, cognition);

    const result = evaluateExecutiveTrustCalibration(trustCalibrationEvalInput(org, cognition, 70_000));

    expect(result.evaluated).toBe(true);
    const adjustment = result.snapshot?.recentTrustAdjustments[0];
    expect(adjustment).toBeDefined();
    expect(adjustment!.trustCalibrationId.length).toBeGreaterThan(0);
    expect(adjustment!.trustState.length).toBeGreaterThan(0);
    expect(adjustment!.reliabilityStrength.length).toBeGreaterThan(0);
    expect(adjustment!.reliabilitySignals.length).toBeGreaterThan(0);
    expect(adjustment!.cautionSignals).toBeDefined();
    expect(adjustment!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(adjustment!.generatedAt).toBe(70_000);
  });
});
