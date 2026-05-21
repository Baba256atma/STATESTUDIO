import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateUnifiedExecutiveDecisionRuntime } from "../decision-orchestration/unifiedDecisionRuntimeEngine";
import { resetUnifiedDecisionRuntimeGuards } from "../decision-orchestration/unifiedDecisionRuntimeGuards";
import { resetUnifiedDecisionRuntimeStores } from "../decision-orchestration/unifiedDecisionRuntimeStore";
import { resetReasoningIntegrityGuards } from "./reasoningIntegrityGuards";
import { resetReasoningIntegrityStores } from "./reasoningIntegrityStore";
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
import { evaluateStrategicStabilityOptimization } from "../decision-orchestration/stabilityOptimizationEngine";
import { resetStabilityOptimizationGuards } from "../decision-orchestration/stabilityOptimizationGuards";
import { resetStabilityOptimizationStores } from "../decision-orchestration/stabilityOptimizationStore";
import { evaluateStrategicInterventionProjection } from "../decision-orchestration/interventionProjectionEngine";
import { resetInterventionProjectionGuards } from "../decision-orchestration/interventionProjectionGuards";
import { resetInterventionProjectionStores } from "../decision-orchestration/interventionProjectionStore";
import { evaluateInstitutionalAlignmentIntelligence } from "../decision-orchestration/institutionalAlignmentEngine";
import { resetInstitutionalAlignmentGuards } from "../decision-orchestration/institutionalAlignmentGuards";
import { resetInstitutionalAlignmentStores } from "../decision-orchestration/institutionalAlignmentStore";
import { evaluateExecutiveDecisionConfidence } from "../decision-orchestration/decisionConfidenceEngine";
import { resetDecisionConfidenceGuards } from "../decision-orchestration/decisionConfidenceGuards";
import { resetDecisionConfidenceStores } from "../decision-orchestration/decisionConfidenceStore";
import { selectLatestConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { evaluateAdaptiveDecisionSequencing } from "../decision-orchestration/adaptiveSequencingEngine";
import { resetAdaptiveSequencingGuards } from "../decision-orchestration/adaptiveSequencingGuards";
import { resetAdaptiveSequencingStores } from "../decision-orchestration/adaptiveSequencingStore";
import { evaluateExecutiveScenarioCoordination } from "../decision-orchestration/scenarioCoordinationEngine";
import { resetScenarioCoordinationGuards } from "../decision-orchestration/scenarioCoordinationGuards";
import { resetScenarioCoordinationStores } from "../decision-orchestration/scenarioCoordinationStore";
import { evaluateStrategicPriorityArbitration } from "../decision-orchestration/priorityArbitrationEngine";
import { resetPriorityArbitrationGuards } from "../decision-orchestration/priorityArbitrationGuards";
import { resetPriorityArbitrationStores } from "../decision-orchestration/priorityArbitrationStore";
import { evaluateStrategicActionDependencies } from "../decision-orchestration/actionDependencyEngine";
import { resetActionDependencyGuards } from "../decision-orchestration/actionDependencyGuards";
import { resetActionDependencyStores } from "../decision-orchestration/actionDependencyStore";
import { evaluateExecutiveDecisionOrchestration } from "../decision-orchestration/decisionOrchestrationEngine";
import { resetDecisionOrchestrationGuards } from "../decision-orchestration/decisionOrchestrationGuards";
import { resetDecisionOrchestrationStores } from "../decision-orchestration/decisionOrchestrationStore";
import { evaluateUnifiedExecutiveForesightRuntime } from "../foresight-cognition/unifiedForesightRuntimeEngine";
import { resetUnifiedForesightRuntimeGuards } from "../foresight-cognition/unifiedForesightRuntimeGuards";
import { resetUnifiedForesightRuntimeStores } from "../foresight-cognition/unifiedForesightRuntimeStore";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { evaluateUnifiedTemporalCognition } from "../temporal-cognition/unifiedTemporalCognitionEngine";
import { resetUnifiedTemporalCognitionGuards } from "../temporal-cognition/unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "../temporal-cognition/unifiedTemporalCognitionStore";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { resetUnifiedInstitutionalMemoryGuards } from "../institutional-memory/unifiedInstitutionalMemoryGuards";
import { resetUnifiedInstitutionalMemoryStores } from "../institutional-memory/unifiedInstitutionalMemoryStore";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "../institutional-memory/institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "../institutional-memory/institutionalMemoryStore";
import {
  beginMetaCognitionEvaluation,
  endMetaCognitionEvaluation,
  resetMetaCognitionGuards,
} from "./metaCognitionGuards";
import { getMetaCognitionStore, resetMetaCognitionStores } from "./metaCognitionStore";
import { evaluateExecutiveMetaCognition } from "./metaCognitionEngine";
import { integrateMetaCognitionWithCognition } from "./integrateMetaCognitionWithCognition";

function resetMetaCognitionTestStacks(): void {
  resetInstitutionalMemoryStores();
  resetInstitutionalMemoryGuards();
  resetUnifiedInstitutionalMemoryStores();
  resetUnifiedInstitutionalMemoryGuards();
  resetUnifiedTemporalCognitionStores();
  resetUnifiedTemporalCognitionGuards();
  resetUnifiedForesightRuntimeStores();
  resetUnifiedForesightRuntimeGuards();
  resetDecisionOrchestrationStores();
  resetDecisionOrchestrationGuards();
  resetActionDependencyStores();
  resetActionDependencyGuards();
  resetPriorityArbitrationStores();
  resetPriorityArbitrationGuards();
  resetScenarioCoordinationStores();
  resetScenarioCoordinationGuards();
  resetAdaptiveSequencingStores();
  resetAdaptiveSequencingGuards();
  resetDecisionConfidenceStores();
  resetDecisionConfidenceGuards();
  resetInstitutionalAlignmentStores();
  resetInstitutionalAlignmentGuards();
  resetInterventionProjectionStores();
  resetInterventionProjectionGuards();
  resetStabilityOptimizationStores();
  resetStabilityOptimizationGuards();
  resetUnifiedDecisionRuntimeStores();
  resetUnifiedDecisionRuntimeGuards();
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

function minimalCognition(org = "meta-cognition-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedMetaCognitionRuntime(organizationId: string, cognition: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `mc-seed-${i}` },
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
}

describe("executive meta-cognition D9:6:1", () => {
  beforeEach(() => {
    resetMetaCognitionTestStacks();
  });

  it("forms self-reflective observations when unified cognition layers are present", () => {
    const org = "mc-align-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    const result = evaluateExecutiveMetaCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 32_000,
    });

    expect(result.evaluated).toBe(true);
    const observations = getMetaCognitionStore(org).getState().integrityObservations;
    expect(observations.length).toBeGreaterThan(0);
    expect(observations.some((o) => o.qualitySignals.length > 0)).toBe(true);
    expect(result.snapshot?.strategicCognitionHealth).not.toBeNull();
  });

  it("recognizes cross-layer alignment when foresight and decision runtimes are stable", () => {
    const org = "mc-cross-layer-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);

    const result = evaluateExecutiveMetaCognition({
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
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      fragilityElevated: false,
      continuityPreserved: true,
      now: 32_500,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getMetaCognitionStore(org).getState().integrityObservations.some((o) =>
        o.qualitySignals.includes("cross_layer_alignment")
      )
    ).toBe(true);
  });

  it("reduces integrity when subsystems conflict", () => {
    const org = "mc-conflict-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const temporal = selectLatestEnterpriseTimeIntelligenceSnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);
    const confidence = selectLatestConfidenceArbitrationSnapshot(org);

    const result = evaluateExecutiveMetaCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: temporal ? { ...temporal, runtimeStatus: "degraded" } : null,
      foresightSnapshot: foresight ? { ...foresight, runtimeStatus: "unstable" } : null,
      decisionSnapshot: decision ? { ...decision, runtimeStatus: "unstable" } : null,
      confidenceSnapshot: confidence
        ? {
            ...confidence,
            coordinationSummary: {
              ...confidence.coordinationSummary,
              dominantCertaintyState: "fragmented",
            },
          }
        : null,
      fragilityElevated: true,
      continuityPreserved: true,
      now: 33_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getMetaCognitionStore(org).getState().integrityObservations.some(
        (o) => o.integrityState === "fragmented" || o.risks.includes("cross_layer_contradiction")
      )
    ).toBe(true);
  });

  it("detects overconfidence warning when evidence is weak", () => {
    const org = "mc-overconfidence-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

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
      signature: "weak-governance-test",
      organizationId: org,
      generatedAt: 34_000,
      governanceStatus: "degraded",
      integrityLevel: "weak",
      governanceSummary: "Governance evidence remains limited for current confidence posture.",
      snapshotCount: 1,
      trustValidationCount: 0,
      dominantTrustCategories: Object.freeze(["memory_consistency"]),
      recentGovernanceSnapshots: Object.freeze([]),
      integritySignals: Object.freeze([]),
      trustValidations: Object.freeze([]),
      learningHealth: null,
      consistencyObservations: Object.freeze([]),
    };

    const result = evaluateExecutiveMetaCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      confidenceSnapshot: boostedConfidence,
      governanceSnapshot: weakGovernance,
      fragilityElevated: true,
      continuityPreserved: true,
      now: 34_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getMetaCognitionStore(org).getState().integrityObservations.some((o) =>
        o.risks.includes("overconfidence_warning")
      )
    ).toBe(true);
  });

  it("dedupes duplicate meta-cognition evaluations on unchanged signature", () => {
    const org = "mc-dedupe-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    const first = integrateMetaCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_000,
    });
    const second = integrateMetaCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded meta-cognition memory under caps", () => {
    const org = "mc-bounded-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveMetaCognition({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `mc-bounded-${i}` },
        memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
        temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
        foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
        decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
        confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
        fragilityElevated: true,
        continuityPreserved: true,
        now: 36_000 + i * 600,
      });
    }

    const state = getMetaCognitionStore(org).getState();
    expect(state.integrityObservations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive meta-cognition evaluation", () => {
    expect(beginMetaCognitionEvaluation()).toBe(true);
    expect(beginMetaCognitionEvaluation()).toBe(true);
    expect(beginMetaCognitionEvaluation()).toBe(false);
    endMetaCognitionEvaluation();
    endMetaCognitionEvaluation();
  });

  it("emits meta-cognition contract fields", () => {
    const org = "mc-contract-org";
    const cognition = minimalCognition(org);
    seedMetaCognitionRuntime(org, cognition);

    const result = evaluateExecutiveMetaCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
      temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
      foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
      decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
      confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 37_000,
    });

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentIntegrityObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.metaCognitionId.length).toBeGreaterThan(0);
    expect(observation!.cognitionHealth.length).toBeGreaterThan(0);
    expect(observation!.integrityState.length).toBeGreaterThan(0);
    expect(observation!.qualitySignals.length).toBeGreaterThan(0);
    expect(observation!.risks).toBeDefined();
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(37_000);
  });
});
