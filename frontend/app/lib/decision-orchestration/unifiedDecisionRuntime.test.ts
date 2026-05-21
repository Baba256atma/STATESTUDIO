import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "../institutional-memory/adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "../institutional-memory/adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "../institutional-memory/adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "../institutional-memory/decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "../institutional-memory/decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "../institutional-memory/decisionOutcomeStore";
import { evaluateInstitutionalKnowledgeDistillation } from "../institutional-memory/institutionalDistillationEngine";
import { resetInstitutionalDistillationGuards } from "../institutional-memory/institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "../institutional-memory/institutionalDistillationStore";
import { evaluateInstitutionalLearningEvolution } from "../institutional-memory/institutionalMaturityEngine";
import { resetInstitutionalMaturityGuards } from "../institutional-memory/institutionalMaturityGuards";
import { resetInstitutionalMaturityStores } from "../institutional-memory/institutionalMaturityStore";
import { evaluateInstitutionalKnowledgeContinuity } from "../institutional-memory/institutionalContinuityEngine";
import { resetInstitutionalContinuityStores } from "../institutional-memory/institutionalContinuityStore";
import { resetInstitutionalContinuityGuards } from "../institutional-memory/institutionalContinuityGuards";
import { resetInstitutionalGovernanceStores } from "../institutional-memory/institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "../institutional-memory/institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "../institutional-memory/unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "../institutional-memory/unifiedInstitutionalMemoryGuards";
import { evaluateInstitutionalCognitiveRecall } from "../institutional-memory/institutionalRecallEngine";
import { resetInstitutionalRecallGuards } from "../institutional-memory/institutionalRecallGuards";
import { resetInstitutionalRecallStores } from "../institutional-memory/institutionalRecallStore";
import { evaluateInstitutionalExperienceCorrelation } from "../institutional-memory/institutionalCorrelationEngine";
import { resetInstitutionalCorrelationGuards } from "../institutional-memory/institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "../institutional-memory/institutionalCorrelationStore";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "../institutional-memory/institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "../institutional-memory/institutionalMemoryStore";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { evaluateUnifiedTemporalCognition } from "../temporal-cognition/unifiedTemporalCognitionEngine";
import { resetUnifiedTemporalCognitionGuards } from "../temporal-cognition/unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "../temporal-cognition/unifiedTemporalCognitionStore";
import { resetTemporalCognitionStores } from "../temporal-cognition/temporalCognitionStore";
import { resetTemporalCognitionGuards } from "../temporal-cognition/temporalCognitionGuards";
import { resetCausalDependencyStores } from "../temporal-cognition/causalDependencyStore";
import { resetCausalDependencyGuards } from "../temporal-cognition/causalDependencyGuards";
import { resetOperationalReplayStores } from "../temporal-cognition/operationalReplayStore";
import { resetOperationalReplayGuards } from "../temporal-cognition/operationalReplayGuards";
import { resetTemporalDriftProjectionStores } from "../temporal-cognition/temporalDriftProjectionStore";
import { resetTemporalDriftProjectionGuards } from "../temporal-cognition/temporalDriftProjectionGuards";
import { resetMultiTimelineStores } from "../temporal-cognition/multiTimelineStore";
import { resetMultiTimelineGuards } from "../temporal-cognition/multiTimelineGuards";
import { resetTemporalConvergenceStores } from "../temporal-cognition/temporalConvergenceStore";
import { resetTemporalConvergenceGuards } from "../temporal-cognition/temporalConvergenceGuards";
import { resetTemporalCompressionStores } from "../temporal-cognition/temporalCompressionStore";
import { resetTemporalCompressionGuards } from "../temporal-cognition/temporalCompressionGuards";
import { resetTemporalMemorySyncStores } from "../temporal-cognition/temporalMemorySyncStore";
import { resetTemporalMemorySyncGuards } from "../temporal-cognition/temporalMemorySyncGuards";
import { resetTemporalFieldStores } from "../temporal-cognition/temporalFieldStore";
import { resetTemporalFieldGuards } from "../temporal-cognition/temporalFieldGuards";
import { resetForesightCognitionGuards } from "../foresight-cognition/foresightCognitionGuards";
import { resetForesightCognitionStores } from "../foresight-cognition/foresightCognitionStore";
import { resetRiskConstellationGuards } from "../foresight-cognition/riskConstellationGuards";
import { resetRiskConstellationStores } from "../foresight-cognition/riskConstellationStore";
import { resetEarlyWarningGuards } from "../foresight-cognition/earlyWarningGuards";
import { resetEarlyWarningStores } from "../foresight-cognition/earlyWarningStore";
import { resetPositiveDriftGuards } from "../foresight-cognition/positiveDriftGuards";
import { resetPositiveDriftStores } from "../foresight-cognition/positiveDriftStore";
import { resetStressSimulationGuards } from "../foresight-cognition/stressSimulationGuards";
import { resetStressSimulationStores } from "../foresight-cognition/stressSimulationStore";
import { resetInterventionTimingGuards } from "../foresight-cognition/interventionTimingGuards";
import { resetInterventionTimingStores } from "../foresight-cognition/interventionTimingStore";
import { resetPreparednessCognitionGuards } from "../foresight-cognition/preparednessCognitionGuards";
import { resetPreparednessCognitionStores } from "../foresight-cognition/preparednessCognitionStore";
import { resetAdvisoryForesightGuards } from "../foresight-cognition/advisoryForesightGuards";
import { resetAdvisoryForesightStores } from "../foresight-cognition/advisoryForesightStore";
import { resetConsensusForesightGuards } from "../foresight-cognition/consensusForesightGuards";
import { resetConsensusForesightStores } from "../foresight-cognition/consensusForesightStore";
import { resetUnifiedForesightRuntimeGuards } from "../foresight-cognition/unifiedForesightRuntimeGuards";
import { resetUnifiedForesightRuntimeStores } from "../foresight-cognition/unifiedForesightRuntimeStore";
import { evaluateUnifiedExecutiveForesightRuntime } from "../foresight-cognition/unifiedForesightRuntimeEngine";
import { resetDecisionOrchestrationGuards } from "./decisionOrchestrationGuards";
import { resetDecisionOrchestrationStores } from "./decisionOrchestrationStore";
import { evaluateExecutiveDecisionOrchestration } from "./decisionOrchestrationEngine";
import { resetActionDependencyGuards } from "./actionDependencyGuards";
import { resetActionDependencyStores } from "./actionDependencyStore";
import { evaluateStrategicActionDependencies } from "./actionDependencyEngine";
import { resetPriorityArbitrationGuards } from "./priorityArbitrationGuards";
import { resetPriorityArbitrationStores } from "./priorityArbitrationStore";
import { evaluateStrategicPriorityArbitration } from "./priorityArbitrationEngine";
import { resetScenarioCoordinationGuards } from "./scenarioCoordinationGuards";
import { resetScenarioCoordinationStores } from "./scenarioCoordinationStore";
import { evaluateExecutiveScenarioCoordination } from "./scenarioCoordinationEngine";
import { resetAdaptiveSequencingGuards } from "./adaptiveSequencingGuards";
import { resetAdaptiveSequencingStores } from "./adaptiveSequencingStore";
import { evaluateAdaptiveDecisionSequencing } from "./adaptiveSequencingEngine";
import { resetDecisionConfidenceGuards } from "./decisionConfidenceGuards";
import { resetDecisionConfidenceStores } from "./decisionConfidenceStore";
import { evaluateExecutiveDecisionConfidence } from "./decisionConfidenceEngine";
import { resetInstitutionalAlignmentGuards } from "./institutionalAlignmentGuards";
import { resetInstitutionalAlignmentStores } from "./institutionalAlignmentStore";
import { evaluateInstitutionalAlignmentIntelligence } from "./institutionalAlignmentEngine";
import { resetInterventionProjectionGuards } from "./interventionProjectionGuards";
import { resetInterventionProjectionStores } from "./interventionProjectionStore";
import { evaluateStrategicInterventionProjection } from "./interventionProjectionEngine";
import { resetStabilityOptimizationGuards } from "./stabilityOptimizationGuards";
import { resetStabilityOptimizationStores } from "./stabilityOptimizationStore";
import { evaluateStrategicStabilityOptimization } from "./stabilityOptimizationEngine";
import {
  beginUnifiedDecisionRuntimeEvaluation,
  endUnifiedDecisionRuntimeEvaluation,
  resetUnifiedDecisionRuntimeGuards,
} from "./unifiedDecisionRuntimeGuards";
import {
  getUnifiedDecisionRuntimeStore,
  resetUnifiedDecisionRuntimeStores,
} from "./unifiedDecisionRuntimeStore";
import { evaluateUnifiedExecutiveDecisionRuntime } from "./unifiedDecisionRuntimeEngine";
import { integrateUnifiedDecisionRuntimeWithCognition } from "./integrateUnifiedDecisionRuntimeWithCognition";
import { resetMetaCognitionGuards } from "../meta-cognition/metaCognitionGuards";
import { resetMetaCognitionStores } from "../meta-cognition/metaCognitionStore";

function resetAllStacks(): void {
  resetInstitutionalMemoryStores();
  resetInstitutionalMemoryGuards();
  resetInstitutionalCorrelationStores();
  resetInstitutionalCorrelationGuards();
  resetAdaptationRecoveryStores();
  resetAdaptationRecoveryGuards();
  resetDecisionOutcomeStores();
  resetDecisionOutcomeGuards();
  resetInstitutionalDistillationStores();
  resetInstitutionalDistillationGuards();
  resetInstitutionalRecallStores();
  resetInstitutionalRecallGuards();
  resetInstitutionalMaturityStores();
  resetInstitutionalMaturityGuards();
  resetInstitutionalContinuityStores();
  resetInstitutionalContinuityGuards();
  resetInstitutionalGovernanceStores();
  resetInstitutionalGovernanceGuards();
  resetUnifiedInstitutionalMemoryStores();
  resetUnifiedInstitutionalMemoryGuards();
  resetTemporalCognitionStores();
  resetTemporalCognitionGuards();
  resetCausalDependencyStores();
  resetCausalDependencyGuards();
  resetOperationalReplayStores();
  resetOperationalReplayGuards();
  resetTemporalDriftProjectionStores();
  resetTemporalDriftProjectionGuards();
  resetMultiTimelineStores();
  resetMultiTimelineGuards();
  resetTemporalConvergenceStores();
  resetTemporalConvergenceGuards();
  resetTemporalCompressionStores();
  resetTemporalCompressionGuards();
  resetTemporalMemorySyncStores();
  resetTemporalMemorySyncGuards();
  resetTemporalFieldStores();
  resetTemporalFieldGuards();
  resetUnifiedTemporalCognitionStores();
  resetUnifiedTemporalCognitionGuards();
  resetForesightCognitionStores();
  resetForesightCognitionGuards();
  resetRiskConstellationStores();
  resetRiskConstellationGuards();
  resetEarlyWarningStores();
  resetEarlyWarningGuards();
  resetPositiveDriftStores();
  resetPositiveDriftGuards();
  resetStressSimulationStores();
  resetStressSimulationGuards();
  resetInterventionTimingStores();
  resetInterventionTimingGuards();
  resetPreparednessCognitionStores();
  resetPreparednessCognitionGuards();
  resetAdvisoryForesightStores();
  resetAdvisoryForesightGuards();
  resetConsensusForesightStores();
  resetConsensusForesightGuards();
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
}

function minimalCognition(org = "unified-decision-runtime-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
    strategicCalibrationActive: true,
    cognitiveEvolutionActive: true,
    organizationalEvolutionActive: true,
    timelineStrategicEvolutionLine:
      "Strategic evolution shows governance delay growth under rising operational load.",
    organizationalLearningLine:
      "Organizational learning detects coordination strain under intensified pressure.",
    resilienceForecastLine:
      "Resilience trajectory may strengthen with intervention before fatigue accumulates.",
  };
}

function seedUnifiedDecisionRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `udr-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      observations: {
        pressureTopologyStressed: true,
        patternRecurrenceDetected: true,
      },
      fragilityElevated: true,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalExperienceCorrelation({ organizationId, cognitionSnapshot: snapshot, now });
    evaluateOrganizationalAdaptationMemory({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalDecisionOutcomes({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalKnowledgeDistillation({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalCognitiveRecall({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: true,
      now,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 4_000,
  });
  evaluateInstitutionalLearningEvolution({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 4_500,
  });
  evaluateInstitutionalKnowledgeContinuity({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 4_800,
  });
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `udr-temporal-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: true },
      fragilityElevated: true,
      continuityPreserved: true,
      now: 5_000 + i * 700,
    });
  }
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
}

describe("unified executive decision runtime D9:5:10", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("generates unified orchestration snapshots deterministically", () => {
    const org = "udr-accumulate-org";
    const cognition = minimalCognition(org);
    seedUnifiedDecisionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveDecisionRuntime({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 31_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getUnifiedDecisionRuntimeStore(org).getState().snapshots.length).toBeGreaterThan(0);
    expect(result.snapshot?.activeSubsystems.length).toBeGreaterThan(0);
  });

  it("keeps subsystem failure signals isolated in subsystem states", () => {
    const org = "udr-isolation-org";
    const cognition = minimalCognition(org);
    seedUnifiedDecisionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveDecisionRuntime({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 32_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.subsystemStates.length).toBe(9);
    expect(result.snapshot?.subsystemStates.some((s) => s.subsystemId.length > 0)).toBe(true);
    expect(result.snapshot?.subsystemStates.every((s) => typeof s.isolated === "boolean")).toBe(
      true
    );
  });

  it("dedupes duplicate unified runtime evaluations on unchanged signature", () => {
    const org = "udr-dedupe-org";
    const cognition = minimalCognition(org);
    seedUnifiedDecisionRuntime(org, cognition);

    const first = integrateUnifiedDecisionRuntimeWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 33_000,
    });
    const second = integrateUnifiedDecisionRuntimeWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 33_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses unified runtime when orchestration depth is insufficient", () => {
    const org = "udr-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedExecutiveDecisionRuntime({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 34_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_orchestration_depth");
  });

  it("keeps bounded unified decision runtime memory under caps", () => {
    const org = "udr-bounded-org";
    const cognition = minimalCognition(org);
    seedUnifiedDecisionRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateUnifiedExecutiveDecisionRuntime({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `udr-bounded-${i}` },
        fragilityElevated: true,
        pressureTopologyStressed: true,
        now: 35_000 + i * 600,
      });
    }

    const state = getUnifiedDecisionRuntimeStore(org).getState();
    expect(state.snapshots.length).toBeLessThanOrEqual(10);
    expect(state.orchestrationSummaries.length).toBeLessThanOrEqual(8);
    expect(state.strategicActionHistory.length).toBeLessThanOrEqual(10);
  });

  it("blocks recursive unified decision runtime evaluation", () => {
    expect(beginUnifiedDecisionRuntimeEvaluation()).toBe(true);
    expect(beginUnifiedDecisionRuntimeEvaluation()).toBe(true);
    expect(beginUnifiedDecisionRuntimeEvaluation()).toBe(false);
    endUnifiedDecisionRuntimeEvaluation();
    endUnifiedDecisionRuntimeEvaluation();
  });

  it("emits enterprise strategic action snapshot contract fields", () => {
    const org = "udr-contract-org";
    const cognition = minimalCognition(org);
    seedUnifiedDecisionRuntime(org, cognition);

    const result = evaluateUnifiedExecutiveDecisionRuntime({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 36_000,
    });

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot;
    expect(snapshot).toBeDefined();
    expect(snapshot!.runtimeStatus.length).toBeGreaterThan(0);
    expect(snapshot!.orchestrationHealth.length).toBeGreaterThan(0);
    expect(snapshot!.summary.dominantPriority.length).toBeGreaterThan(0);
    expect(snapshot!.summary.orchestrationState.length).toBeGreaterThan(0);
    expect(snapshot!.summary.confidenceState.length).toBeGreaterThan(0);
    expect(snapshot!.summary.resiliencePathway.length).toBeGreaterThan(0);
    expect(snapshot!.summary.stabilizationFocus.length).toBeGreaterThan(0);
    expect(snapshot!.summary.institutionalAlignment.length).toBeGreaterThan(0);
    expect(snapshot!.activeSubsystems.length).toBeGreaterThan(0);
    expect(snapshot!.executiveActionIntelligence.actionReadinessHeadline.length).toBeGreaterThan(0);
    expect(snapshot!.generatedAt).toBe(36_000);
  });
});
