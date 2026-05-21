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
import {
  beginScenarioCoordinationEvaluation,
  endScenarioCoordinationEvaluation,
  resetScenarioCoordinationGuards,
} from "./scenarioCoordinationGuards";
import { getScenarioCoordinationStore, resetScenarioCoordinationStores } from "./scenarioCoordinationStore";
import { evaluateExecutiveScenarioCoordination } from "./scenarioCoordinationEngine";
import { integrateScenarioCoordinationWithCognition } from "./integrateScenarioCoordinationWithCognition";
import { resetAdaptiveSequencingGuards } from "./adaptiveSequencingGuards";
import { resetAdaptiveSequencingStores } from "./adaptiveSequencingStore";
import { resetDecisionConfidenceGuards } from "./decisionConfidenceGuards";
import { resetDecisionConfidenceStores } from "./decisionConfidenceStore";
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

function minimalCognition(org = "scenario-coordination-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedScenarioCoordinationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `sc-seed-${i}` };
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
      cognitionSnapshot: { ...cognition, signature: `sc-temporal-${i}` },
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
}

describe("executive scenario coordination D9:5:4", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("forms strategic response topologies deterministically", () => {
    const org = "sc-accumulate-org";
    const cognition = minimalCognition(org);
    seedScenarioCoordinationRuntime(org, cognition);

    const result = evaluateExecutiveScenarioCoordination({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 21_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getScenarioCoordinationStore(org).getState().responseTopologies.length).toBeGreaterThan(0);
    expect(getScenarioCoordinationStore(org).getState().interactionFields.length).toBeGreaterThan(0);
  });

  it("maps governance-pressure stabilizing relationships under orchestration depth", () => {
    const org = "sc-governance-pressure-org";
    const cognition = minimalCognition(org);
    seedScenarioCoordinationRuntime(org, cognition);

    const result = evaluateExecutiveScenarioCoordination({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 22_000,
    });

    expect(result.evaluated).toBe(true);
    const topologies = getScenarioCoordinationStore(org).getState().responseTopologies;
    expect(
      topologies.some((t) =>
        t.interactionRelationships.some(
          (r) =>
            r.source === "governance_alignment" &&
            r.target === "pressure_reduction" &&
            r.relationship === "stabilizing"
        )
      )
    ).toBe(true);
  });

  it("dedupes duplicate scenario coordination evaluations on unchanged signature", () => {
    const org = "sc-dedupe-org";
    const cognition = minimalCognition(org);
    seedScenarioCoordinationRuntime(org, cognition);

    const first = integrateScenarioCoordinationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 23_000,
    });
    const second = integrateScenarioCoordinationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 23_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses topology formation when orchestration depth is insufficient", () => {
    const org = "sc-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveScenarioCoordination({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 24_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_topology_depth");
  });

  it("keeps bounded scenario coordination memory under caps", () => {
    const org = "sc-bounded-org";
    const cognition = minimalCognition(org);
    seedScenarioCoordinationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveScenarioCoordination({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `sc-bounded-${i}` },
        fragilityElevated: true,
        pressureTopologyStressed: true,
        now: 25_000 + i * 600,
      });
    }

    const state = getScenarioCoordinationStore(org).getState();
    expect(state.responseTopologies.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive scenario coordination evaluation", () => {
    expect(beginScenarioCoordinationEvaluation()).toBe(true);
    expect(beginScenarioCoordinationEvaluation()).toBe(true);
    expect(beginScenarioCoordinationEvaluation()).toBe(false);
    endScenarioCoordinationEvaluation();
    endScenarioCoordinationEvaluation();
  });

  it("emits enterprise response topology contract fields", () => {
    const org = "sc-contract-org";
    const cognition = minimalCognition(org);
    seedScenarioCoordinationRuntime(org, cognition);

    const result = evaluateExecutiveScenarioCoordination({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 26_000,
    });

    expect(result.evaluated).toBe(true);
    const topology = result.snapshot?.recentResponseTopologies[0];
    expect(topology).toBeDefined();
    expect(topology!.topologyId.length).toBeGreaterThan(0);
    expect(topology!.interactionRelationships.length).toBeGreaterThan(0);
    expect(topology!.coordinationRisks).toBeDefined();
    expect(topology!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(topology!.generatedAt).toBe(26_000);
  });
});
