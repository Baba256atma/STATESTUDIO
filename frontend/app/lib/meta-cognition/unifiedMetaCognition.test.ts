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
import { resetCognitiveAdaptationGuards } from "./cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "./cognitiveAdaptationStore";
import { evaluateExecutiveCognitiveAdaptation } from "./cognitiveAdaptationEngine";
import { selectLatestExecutiveCognitiveAdaptationSnapshot } from "./cognitiveAdaptationSelectors";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { evaluateExecutiveCognitiveGovernance } from "./cognitiveGovernanceEngine";
import { selectLatestExecutiveCognitiveGovernanceSnapshot } from "./cognitiveGovernanceSelectors";
import {
  beginUnifiedMetaCognitionEvaluation,
  endUnifiedMetaCognitionEvaluation,
  resetUnifiedMetaCognitionGuards,
} from "./unifiedMetaCognitionGuards";
import {
  getUnifiedMetaCognitionStore,
  resetUnifiedMetaCognitionStores,
} from "./unifiedMetaCognitionStore";
import { evaluateUnifiedExecutiveMetaCognitionRuntime } from "./unifiedMetaCognitionEngine";
import { integrateUnifiedExecutiveMetaCognitionWithCognition } from "./integrateUnifiedExecutiveMetaCognitionWithCognition";
import { resetConsensusIntelligenceGuards } from "../consensus-intelligence/consensusIntelligenceGuards";
import { resetConsensusIntelligenceStores } from "../consensus-intelligence/consensusIntelligenceStore";

function resetUnifiedMetaCognitionTestStacks(): void {
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
  resetConsensusIntelligenceStores();
  resetConsensusIntelligenceGuards();
}

function minimalCognition(org = "unified-meta-cognition-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedUnifiedMetaCognitionRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `umc-seed-${i}` },
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
  evaluateExecutiveCognitiveAdaptation({
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
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 76_000,
  });
  evaluateExecutiveCognitiveGovernance({
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
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 82_000,
  });
}

function unifiedEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateUnifiedExecutiveMetaCognitionRuntime>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(org),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(org),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(org),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(org),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(org),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(org),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(org),
    cognitiveGovernanceSnapshot: selectLatestExecutiveCognitiveGovernanceSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("unified executive meta-cognition D9:6:10", () => {
  beforeEach(() => {
    resetUnifiedMetaCognitionTestStacks();
  });

  it("generates unified self-reflective snapshots when governance depth is present", () => {
    const org = "umc-verify-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveMetaCognitionRuntime(
      unifiedEvalInput(org, cognition, 100_000)
    );

    expect(result.evaluated).toBe(true);
    expect(result.activeSubsystemCount).toBeGreaterThanOrEqual(5);
    expect(getUnifiedMetaCognitionStore(org).getState().selfReflectiveSnapshots.length).toBeGreaterThan(
      0
    );
    expect(result.snapshot?.runtimeStatus.length).toBeGreaterThan(0);
    expect(result.snapshot?.governanceHealth.length).toBeGreaterThan(0);
  });

  it("isolates subsystem synthesis when one layer lacks observations", () => {
    const org = "umc-isolated-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveMetaCognitionRuntime(
      unifiedEvalInput(org, cognition, 101_000, {
        cognitiveGovernanceSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_governance_depth");
  });

  it("detects executive-grade trust in unified runtime summary", () => {
    const org = "umc-trust-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const trust = selectLatestExecutiveTrustCalibrationSnapshot(org);
    const governance = selectLatestExecutiveCognitiveGovernanceSnapshot(org);

    const result = evaluateUnifiedExecutiveMetaCognitionRuntime(
      unifiedEvalInput(org, cognition, 102_000, {
        trustCalibrationSnapshot: trust
          ? {
              ...trust,
              awarenessSummary: {
                ...trust.awarenessSummary,
                dominantTrustState: "highly_trustworthy" as const,
                dependabilityPosture: "enterprise_grade" as const,
              },
            }
          : null,
        cognitiveGovernanceSnapshot: governance
          ? {
              ...governance,
              awarenessSummary: {
                ...governance.awarenessSummary,
                dominantGovernanceStrength: "enterprise_grade" as const,
                dominantRegulationState: "self_regulated" as const,
                integrityPosture: "enterprise_grade" as const,
              },
            }
          : null,
        fragilityElevated: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.summary.trustCalibration).toBe("highly_trustworthy");
    expect(
      result.snapshot?.activeSubsystems.includes("trust_calibration")
    ).toBe(true);
  });

  it("dedupes duplicate unified evaluations on unchanged signature", () => {
    const org = "umc-dedupe-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const first = integrateUnifiedExecutiveMetaCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 103_000,
    });
    const second = integrateUnifiedExecutiveMetaCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 103_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded unified meta-cognition memory under caps", () => {
    const org = "umc-bounded-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedExecutiveMetaCognitionRuntime(
        unifiedEvalInput(org, { ...cognition, signature: `umc-bounded-${i}` }, 104_000 + i * 600)
      );
    }

    const state = getUnifiedMetaCognitionStore(org).getState();
    expect(state.selfReflectiveSnapshots.length).toBeLessThanOrEqual(8);
    expect(state.governanceHistory.length).toBeLessThanOrEqual(10);
    expect(state.subsystemStates.length).toBeLessThanOrEqual(9);
  });

  it("blocks recursive unified meta-cognition evaluation", () => {
    expect(beginUnifiedMetaCognitionEvaluation()).toBe(true);
    expect(beginUnifiedMetaCognitionEvaluation()).toBe(true);
    expect(beginUnifiedMetaCognitionEvaluation()).toBe(false);
    endUnifiedMetaCognitionEvaluation();
    endUnifiedMetaCognitionEvaluation();
  });

  it("emits unified self-reflective contract fields", () => {
    const org = "umc-contract-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveMetaCognitionRuntime(
      unifiedEvalInput(org, cognition, 105_000)
    );

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.summary.reasoningIntegrity.length).toBeGreaterThan(0);
    expect(snapshot!.summary.trustCalibration.length).toBeGreaterThan(0);
    expect(snapshot!.summary.explainabilityState.length).toBeGreaterThan(0);
    expect(snapshot!.summary.survivabilityState.length).toBeGreaterThan(0);
    expect(snapshot!.summary.governanceAlignment.length).toBeGreaterThan(0);
    expect(snapshot!.activeSubsystems.length).toBeGreaterThanOrEqual(5);
    expect(snapshot!.subsystemStates.length).toBe(9);
    expect(snapshot!.executiveTrustRuntime.confidence).toBeGreaterThanOrEqual(0.48);
    expect(snapshot!.generatedAt).toBe(105_000);
  });

  it("marks runtime degraded when multiple subsystems report instability", () => {
    const org = "umc-degraded-org";
    const cognition = minimalCognition(org);
    seedUnifiedMetaCognitionRuntime(org, cognition);

    const drift = selectLatestExecutiveCognitiveDriftSnapshot(org);
    const integrity = selectLatestStrategicReasoningIntegritySnapshot(org);

    const result = evaluateUnifiedExecutiveMetaCognitionRuntime(
      unifiedEvalInput(org, cognition, 106_000, {
        cognitiveDriftSnapshot: drift
          ? {
              ...drift,
              awarenessSummary: {
                ...drift.awarenessSummary,
                dominantStabilityState: "fluctuating",
                dominantDriftSeverity: "unstable",
              },
            }
          : null,
        reasoningIntegritySnapshot: integrity
          ? {
              ...integrity,
              awarenessSummary: {
                ...integrity.awarenessSummary,
                dominantConsistencyState: "contradictory",
              },
              contradictionIndicators: [
                {
                  indicatorId: "umc-contradiction",
                  indicatorLabel: "runtime_conflict",
                  indicatorSummary: "Contradictory runtime conclusions.",
                  linkedCategories: Object.freeze(["orchestration_integrity" as const]),
                  contradictionSeverity: "high" as const,
                  generatedAt: 106_000,
                },
              ],
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      result.snapshot?.runtimeStatus === "degraded" ||
        result.snapshot?.runtimeStatus === "adaptive"
    ).toBe(true);
  });
});
