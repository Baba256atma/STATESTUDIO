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
import {
  beginDecisionConfidenceEvaluation,
  endDecisionConfidenceEvaluation,
  resetDecisionConfidenceGuards,
} from "./decisionConfidenceGuards";
import { getDecisionConfidenceStore, resetDecisionConfidenceStores } from "./decisionConfidenceStore";
import { evaluateExecutiveDecisionConfidence } from "./decisionConfidenceEngine";
import { integrateDecisionConfidenceWithCognition } from "./integrateDecisionConfidenceWithCognition";
import { resetInstitutionalAlignmentGuards } from "./institutionalAlignmentGuards";
import { resetInstitutionalAlignmentStores } from "./institutionalAlignmentStore";
import { resetInterventionProjectionGuards } from "./interventionProjectionGuards";
import { resetInterventionProjectionStores } from "./interventionProjectionStore";
import { resetStabilityOptimizationGuards } from "./stabilityOptimizationGuards";
import { resetStabilityOptimizationStores } from "./stabilityOptimizationStore";
import { resetUnifiedDecisionRuntimeGuards } from "./unifiedDecisionRuntimeGuards";
import { resetUnifiedDecisionRuntimeStores } from "./unifiedDecisionRuntimeStore";

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
}

function minimalCognition(org = "decision-confidence-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedDecisionConfidenceRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `dc-seed-${i}` };
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
      cognitionSnapshot: { ...cognition, signature: `dc-temporal-${i}` },
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
}

describe("executive decision confidence D9:5:6", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("arbitrates executive confidence deterministically", () => {
    const org = "dc-accumulate-org";
    const cognition = minimalCognition(org);
    seedDecisionConfidenceRuntime(org, cognition);

    const result = evaluateExecutiveDecisionConfidence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 22_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getDecisionConfidenceStore(org).getState().executiveConfidences.length).toBeGreaterThan(0);
    expect(getDecisionConfidenceStore(org).getState().certaintySignals.length).toBeGreaterThan(0);
  });

  it("forms strategic certainty signals with consensus or executive-grade alignment", () => {
    const org = "dc-certainty-org";
    const cognition = minimalCognition(org);
    seedDecisionConfidenceRuntime(org, cognition);

    const result = evaluateExecutiveDecisionConfidence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 23_000,
    });

    expect(result.evaluated).toBe(true);
    const confidences = getDecisionConfidenceStore(org).getState().executiveConfidences;
    expect(
      confidences.some(
        (c) =>
          c.confidenceSignals.includes("consensus_alignment") ||
          c.certaintyState === "highly_confident" ||
          c.confidenceLevel === "executive_grade"
      )
    ).toBe(true);
  });

  it("dedupes duplicate confidence evaluations on unchanged signature", () => {
    const org = "dc-dedupe-org";
    const cognition = minimalCognition(org);
    seedDecisionConfidenceRuntime(org, cognition);

    const first = integrateDecisionConfidenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 24_000,
    });
    const second = integrateDecisionConfidenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 24_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses confidence arbitration when orchestration depth is insufficient", () => {
    const org = "dc-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveDecisionConfidence({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 25_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_confidence_depth");
  });

  it("keeps bounded decision confidence memory under caps", () => {
    const org = "dc-bounded-org";
    const cognition = minimalCognition(org);
    seedDecisionConfidenceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveDecisionConfidence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `dc-bounded-${i}` },
        fragilityElevated: true,
        pressureTopologyStressed: true,
        now: 26_000 + i * 600,
      });
    }

    const state = getDecisionConfidenceStore(org).getState();
    expect(state.executiveConfidences.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive decision confidence evaluation", () => {
    expect(beginDecisionConfidenceEvaluation()).toBe(true);
    expect(beginDecisionConfidenceEvaluation()).toBe(true);
    expect(beginDecisionConfidenceEvaluation()).toBe(false);
    endDecisionConfidenceEvaluation();
    endDecisionConfidenceEvaluation();
  });

  it("emits executive decision confidence contract fields", () => {
    const org = "dc-contract-org";
    const cognition = minimalCognition(org);
    seedDecisionConfidenceRuntime(org, cognition);

    const result = evaluateExecutiveDecisionConfidence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 27_000,
    });

    expect(result.evaluated).toBe(true);
    const confidence = result.snapshot?.recentExecutiveConfidences[0];
    expect(confidence).toBeDefined();
    expect(confidence!.confidenceId.length).toBeGreaterThan(0);
    expect(confidence!.confidenceSignals.length).toBeGreaterThan(0);
    expect(confidence!.uncertaintySignals).toBeDefined();
    expect(confidence!.confidenceScore).toBeGreaterThanOrEqual(0.5);
    expect(confidence!.generatedAt).toBe(27_000);
  });
});
