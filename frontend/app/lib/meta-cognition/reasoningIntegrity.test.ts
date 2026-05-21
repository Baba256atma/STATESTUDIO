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
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { evaluateExecutiveMetaCognition } from "./metaCognitionEngine";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { resetMetaCognitionGuards } from "./metaCognitionGuards";
import { resetMetaCognitionStores } from "./metaCognitionStore";
import {
  beginReasoningIntegrityEvaluation,
  endReasoningIntegrityEvaluation,
  resetReasoningIntegrityGuards,
} from "./reasoningIntegrityGuards";
import {
  getReasoningIntegrityStore,
  resetReasoningIntegrityStores,
} from "./reasoningIntegrityStore";
import { evaluateStrategicReasoningIntegrity } from "./reasoningIntegrityEngine";
import { integrateReasoningIntegrityWithCognition } from "./integrateReasoningIntegrityWithCognition";
import { resetCognitiveDriftGuards } from "./cognitiveDriftGuards";
import { resetCognitiveDriftStores } from "./cognitiveDriftStore";
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

function resetReasoningIntegrityTestStacks(): void {
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

function minimalCognition(org = "reasoning-integrity-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedReasoningIntegrityRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `ri-seed-${i}` },
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
}

describe("strategic reasoning integrity D9:6:2", () => {
  beforeEach(() => {
    resetReasoningIntegrityTestStacks();
  });

  it("forms integrity verifications when cognition layers are present", () => {
    const org = "ri-verify-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const result = evaluateStrategicReasoningIntegrity({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
      sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 38_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getReasoningIntegrityStore(org).getState().trustObservations.length).toBeGreaterThan(0);
    expect(result.snapshot?.verificationCount).toBeGreaterThan(0);
  });

  it("increases integrity strength when aligned runtimes are stable", () => {
    const org = "ri-aligned-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);

    const result = evaluateStrategicReasoningIntegrity({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: foresight
        ? { ...foresight, runtimeStatus: "stable", foresightHealth: "strong" }
        : null,
      decisionSnapshot: decision
        ? { ...decision, runtimeStatus: "stable", orchestrationHealth: "strong" }
        : null,
      metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
      sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
      fragilityElevated: false,
      continuityPreserved: true,
      now: 39_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getReasoningIntegrityStore(org).getState().trustObservations.some((o) =>
        o.consistencySignals.includes("cross_runtime_alignment")
      )
    ).toBe(true);
  });

  it("reduces consistency state when runtimes conflict", () => {
    const org = "ri-conflict-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);

    const result = evaluateStrategicReasoningIntegrity({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: foresight
        ? {
            ...foresight,
            runtimeStatus: "unstable",
            summary: {
              ...foresight.summary,
              dominantRisk: "escalation pressure is intensifying across correlated systems",
              earlyWarningState: "intensifying",
            },
          }
        : null,
      decisionSnapshot: decision
        ? {
            ...decision,
            runtimeStatus: "unstable",
            summary: {
              ...decision.summary,
              dominantPriority: "operational speed growth acceleration",
              orchestrationState: "adaptive",
            },
          }
        : null,
      metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
      sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 40_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getReasoningIntegrityStore(org).getState().trustObservations.some(
        (o) =>
          o.consistencyState === "contradictory" ||
          o.integrityRisks.includes("inconsistency_risk")
      )
    ).toBe(true);
  });

  it("detects confidence and evidence mismatch correctly", () => {
    const org = "ri-mismatch-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const confidence = selectLatestConfidenceArbitrationSnapshot(org);
    const boostedConfidence = confidence
      ? {
          ...confidence,
          recentExecutiveConfidences: confidence.recentExecutiveConfidences.map((c, i) =>
            i === 0 ? { ...c, confidenceLevel: "executive_grade" as const } : c
          ),
          coordinationSummary: {
            ...confidence.coordinationSummary,
            certaintyPosture: "low" as const,
          },
        }
      : null;

    const weakGovernance: InstitutionalLearningGovernanceAggregateSnapshot = {
      signature: "ri-weak-governance",
      organizationId: org,
      generatedAt: 41_000,
      governanceStatus: "degraded",
      integrityLevel: "weak",
      governanceSummary: "Governance evidence remains limited.",
      snapshotCount: 1,
      trustValidationCount: 0,
      dominantTrustCategories: Object.freeze(["memory_consistency"]),
      recentGovernanceSnapshots: Object.freeze([]),
      integritySignals: Object.freeze([]),
      trustValidations: Object.freeze([]),
      learningHealth: null,
      consistencyObservations: Object.freeze([]),
    };

    const result = evaluateStrategicReasoningIntegrity({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
      confidenceSnapshot: boostedConfidence,
      governanceSnapshot: weakGovernance,
      governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
      sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 41_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getReasoningIntegrityStore(org).getState().trustObservations.some((o) =>
        o.integrityRisks.includes("confidence_evidence_mismatch")
      )
    ).toBe(true);
  });

  it("dedupes duplicate integrity evaluations on unchanged signature", () => {
    const org = "ri-dedupe-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const first = integrateReasoningIntegrityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 42_000,
    });
    const second = integrateReasoningIntegrityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 42_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded reasoning integrity memory under caps", () => {
    const org = "ri-bounded-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicReasoningIntegrity({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `ri-bounded-${i}` },
        memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
        temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
        foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
        decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
        metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
        confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
        governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
        sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
        fragilityElevated: true,
        continuityPreserved: true,
        now: 43_000 + i * 600,
      });
    }

    const state = getReasoningIntegrityStore(org).getState();
    expect(state.trustObservations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive reasoning integrity evaluation", () => {
    expect(beginReasoningIntegrityEvaluation()).toBe(true);
    expect(beginReasoningIntegrityEvaluation()).toBe(true);
    expect(beginReasoningIntegrityEvaluation()).toBe(false);
    endReasoningIntegrityEvaluation();
    endReasoningIntegrityEvaluation();
  });

  it("emits reasoning integrity contract fields", () => {
    const org = "ri-contract-org";
    const cognition = minimalCognition(org);
    seedReasoningIntegrityRuntime(org, cognition);

    const result = evaluateStrategicReasoningIntegrity({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
      sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 44_000,
    });

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentTrustObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.integrityId.length).toBeGreaterThan(0);
    expect(observation!.consistencyState.length).toBeGreaterThan(0);
    expect(observation!.integrityStrength.length).toBeGreaterThan(0);
    expect(observation!.consistencySignals.length).toBeGreaterThan(0);
    expect(observation!.integrityRisks).toBeDefined();
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(44_000);
  });
});
