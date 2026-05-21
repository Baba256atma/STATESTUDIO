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
import {
  beginCognitiveUncertaintyEvaluation,
  endCognitiveUncertaintyEvaluation,
  resetCognitiveUncertaintyGuards,
} from "./cognitiveUncertaintyGuards";
import {
  getCognitiveUncertaintyStore,
  resetCognitiveUncertaintyStores,
} from "./cognitiveUncertaintyStore";
import { evaluateExecutiveCognitiveUncertainty } from "./cognitiveUncertaintyEngine";
import { integrateCognitiveUncertaintyWithCognition } from "./integrateCognitiveUncertaintyWithCognition";
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

function resetCognitiveUncertaintyTestStacks(): void {
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

function minimalCognition(org = "cognitive-uncertainty-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedCognitiveUncertaintyRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `cu-seed-${i}` },
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
}

function uncertaintyEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveCognitiveUncertainty>[0]>
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
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive cognitive uncertainty D9:6:4", () => {
  beforeEach(() => {
    resetCognitiveUncertaintyTestStacks();
  });

  it("forms uncertainty awareness when cognitive drift is present", () => {
    const org = "cu-verify-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveUncertainty(uncertaintyEvalInput(org, cognition, 52_000));

    expect(result.evaluated).toBe(true);
    expect(getCognitiveUncertaintyStore(org).getState().ambiguityObservations.length).toBeGreaterThan(0);
    expect(result.snapshot?.ambiguityCount).toBeGreaterThan(0);
  });

  it("detects escalation risk with incomplete visibility moderation", () => {
    const org = "cu-escalation-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);
    const confidence = selectLatestConfidenceArbitrationSnapshot(org);

    const result = evaluateExecutiveCognitiveUncertainty(
      uncertaintyEvalInput(org, cognition, 53_000, {
        foresightSnapshot: foresight
          ? {
              ...foresight,
              summary: {
                ...foresight.summary,
                dominantRisk: "escalation pressure is intensifying across correlated systems",
                earlyWarningState: "intensifying",
              },
            }
          : null,
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              recentTrustObservations: [
                ...integrity.recentTrustObservations,
                {
                  integrityId: "cu-partial-visibility",
                  consistencyState: "coherent" as const,
                  integrityStrength: "strong" as const,
                  verificationCategory: "foresight_consistency" as const,
                  summary: "Coherent with partial visibility.",
                  consistencySignals: Object.freeze(["partial_operational_visibility"]),
                  integrityRisks: Object.freeze([]),
                  confidence: 0.88,
                  generatedAt: 53_000,
                  lastObservedAt: 53_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
        confidenceSnapshot: confidence
          ? {
              ...confidence,
              coordinationSummary: {
                ...confidence.coordinationSummary,
                certaintyPosture: "low" as const,
                dominantCertaintyState: "uncertain" as const,
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveUncertaintyStore(org).getState().ambiguityObservations.some(
        (o) =>
          o.cautionPosture === "moderated" &&
          o.summary.includes("Escalation risk appears elevated")
      )
    ).toBe(true);
  });

  it("enters unknown zone when cognition certainty is fragmented", () => {
    const org = "cu-unknown-zone-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    const confidence = selectLatestConfidenceArbitrationSnapshot(org);
    const meta = selectLatestMetaCognitionRuntimeSnapshot(org);
    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);

    const result = evaluateExecutiveCognitiveUncertainty(
      uncertaintyEvalInput(org, cognition, 54_000, {
        confidenceSnapshot: confidence
          ? {
              ...confidence,
              coordinationSummary: {
                ...confidence.coordinationSummary,
                dominantCertaintyState: "fragmented" as const,
              },
            }
          : null,
        metaCognitionSnapshot: meta
          ? {
              ...meta,
              awarenessSummary: {
                ...meta.awarenessSummary,
                dominantIntegrityState: "uncertain",
              },
            }
          : null,
        foresightSnapshot: foresight ? { ...foresight, runtimeStatus: "unstable" } : null,
        temporalSnapshot: temporal ? { ...temporal, runtimeStatus: "degraded" } : null,
        decisionSnapshot: decision ? { ...decision, runtimeStatus: "unstable" } : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getCognitiveUncertaintyStore(org).getState().ambiguityObservations.some(
        (o) => o.cautionPosture === "unknown_zone"
      )
    ).toBe(true);
  });

  it("dedupes duplicate uncertainty evaluations on unchanged signature", () => {
    const org = "cu-dedupe-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    const first = integrateCognitiveUncertaintyWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 55_000,
    });
    const second = integrateCognitiveUncertaintyWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 55_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded cognitive uncertainty memory under caps", () => {
    const org = "cu-bounded-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveCognitiveUncertainty(
        uncertaintyEvalInput(org, { ...cognition, signature: `cu-bounded-${i}` }, 56_000 + i * 600)
      );
    }

    const state = getCognitiveUncertaintyStore(org).getState();
    expect(state.ambiguityObservations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive cognitive uncertainty evaluation", () => {
    expect(beginCognitiveUncertaintyEvaluation()).toBe(true);
    expect(beginCognitiveUncertaintyEvaluation()).toBe(true);
    expect(beginCognitiveUncertaintyEvaluation()).toBe(false);
    endCognitiveUncertaintyEvaluation();
    endCognitiveUncertaintyEvaluation();
  });

  it("emits cognitive uncertainty contract fields", () => {
    const org = "cu-contract-org";
    const cognition = minimalCognition(org);
    seedCognitiveUncertaintyRuntime(org, cognition);

    const result = evaluateExecutiveCognitiveUncertainty(uncertaintyEvalInput(org, cognition, 57_000));

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentAmbiguityObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.ambiguityId.length).toBeGreaterThan(0);
    expect(observation!.cautionPosture.length).toBeGreaterThan(0);
    expect(observation!.uncertaintySeverity.length).toBeGreaterThan(0);
    expect(observation!.knownSignals.length).toBeGreaterThan(0);
    expect(observation!.unknownZones).toBeDefined();
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(57_000);
  });
});
