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
import { resetForesightCognitionGuards } from "./foresightCognitionGuards";
import { resetForesightCognitionStores } from "./foresightCognitionStore";
import { evaluateExecutiveStrategicForesight } from "./foresightCognitionEngine";
import { resetRiskConstellationGuards } from "./riskConstellationGuards";
import { resetRiskConstellationStores } from "./riskConstellationStore";
import { evaluateWeakSignalCorrelation } from "./riskConstellationEngine";
import { resetEarlyWarningGuards } from "./earlyWarningGuards";
import { resetEarlyWarningStores } from "./earlyWarningStore";
import { evaluateExecutiveEarlyWarningIntelligence } from "./earlyWarningEngine";
import { resetPositiveDriftGuards } from "./positiveDriftGuards";
import { resetPositiveDriftStores } from "./positiveDriftStore";
import { evaluateStrategicOpportunityEmergence } from "./positiveDriftEngine";
import { resetStressSimulationGuards } from "./stressSimulationGuards";
import { resetStressSimulationStores } from "./stressSimulationStore";
import { evaluateStrategicStressAwareness } from "./stressSimulationEngine";
import { resetInterventionTimingGuards } from "./interventionTimingGuards";
import { resetInterventionTimingStores } from "./interventionTimingStore";
import { evaluateStrategicInterventionTiming } from "./interventionTimingEngine";
import { evaluateEnterprisePreparednessAwareness } from "./preparednessCognitionEngine";
import { resetPreparednessCognitionGuards } from "./preparednessCognitionGuards";
import { resetPreparednessCognitionStores } from "./preparednessCognitionStore";
import {
  beginAdvisoryForesightEvaluation,
  endAdvisoryForesightEvaluation,
  resetAdvisoryForesightGuards,
} from "./advisoryForesightGuards";
import { getAdvisoryForesightStore, resetAdvisoryForesightStores } from "./advisoryForesightStore";
import { evaluateStrategicExecutiveAdvisory } from "./advisoryForesightEngine";
import { integrateAdvisoryForesightWithCognition } from "./integrateAdvisoryForesightWithCognition";
import { resetConsensusForesightGuards } from "./consensusForesightGuards";
import { resetConsensusForesightStores } from "./consensusForesightStore";
import { resetUnifiedForesightRuntimeGuards } from "./unifiedForesightRuntimeGuards";
import { resetUnifiedForesightRuntimeStores } from "./unifiedForesightRuntimeStore";

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
}

function minimalCognition(org = "advisory-foresight-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedAdvisoryForesightRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `pc-seed-${i}` };
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
      cognitionSnapshot: { ...cognition, signature: `pc-temporal-${i}` },
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
  evaluateExecutiveStrategicForesight({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 14_000,
  });
  evaluateWeakSignalCorrelation({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 16_000,
  });
  evaluateExecutiveEarlyWarningIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 17_000,
  });
  evaluateStrategicOpportunityEmergence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    continuityPreserved: true,
    now: 17_500,
  });
  evaluateStrategicStressAwareness({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 18_000,
  });
  evaluateStrategicInterventionTiming({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 18_500,
  });
  evaluateEnterprisePreparednessAwareness({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 19_000,
  });
}

describe("strategic executive advisory foresight D9:4:8", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("synthesizes executive guidance recommendations deterministically", () => {
    const org = "af-accumulate-org";
    const cognition = minimalCognition(org);
    seedAdvisoryForesightRuntime(org, cognition);

    const result = evaluateStrategicExecutiveAdvisory({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 20_000,
    });

    expect(result.evaluated).toBe(true);
    expect(
      getAdvisoryForesightStore(org).getState().executiveGuidanceRecommendations.length
    ).toBeGreaterThan(0);
    expect(
      getAdvisoryForesightStore(org).getState().advisoryPriorityFields.length +
        getAdvisoryForesightStore(org).getState().organizationalFocusSuggestions.length
    ).toBeGreaterThan(0);
  });

  it("forms escalation prevention guidance under pressure", () => {
    const org = "af-escalation-org";
    const cognition = minimalCognition(org);
    seedAdvisoryForesightRuntime(org, cognition);

    const result = evaluateStrategicExecutiveAdvisory({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 21_000,
    });

    expect(result.evaluated).toBe(true);
    const recommendations = getAdvisoryForesightStore(org).getState().executiveGuidanceRecommendations;
    expect(
      recommendations.some(
        (r) =>
          r.category === "escalation_prevention" ||
          r.category === "pressure_reduction" ||
          r.category === "governance_alignment"
      )
    ).toBe(true);
  });

  it("dedupes duplicate advisory evaluations on unchanged signature", () => {
    const org = "af-dedupe-org";
    const cognition = minimalCognition(org);
    seedAdvisoryForesightRuntime(org, cognition);

    const first = integrateAdvisoryForesightWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 22_000,
    });
    const second = integrateAdvisoryForesightWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 22_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses advisory synthesis when depth is insufficient", () => {
    const org = "af-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateStrategicExecutiveAdvisory({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 23_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_advisory_depth");
  });

  it("keeps bounded advisory memory under caps", () => {
    const org = "af-bounded-org";
    const cognition = minimalCognition(org);
    seedAdvisoryForesightRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicExecutiveAdvisory({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `af-bounded-${i}` },
        fragilityElevated: true,
        pressureTopologyStressed: true,
        now: 24_000 + i * 600,
      });
    }

    const state = getAdvisoryForesightStore(org).getState();
    expect(state.executiveGuidanceRecommendations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive advisory foresight evaluation", () => {
    expect(beginAdvisoryForesightEvaluation()).toBe(true);
    expect(beginAdvisoryForesightEvaluation()).toBe(true);
    expect(beginAdvisoryForesightEvaluation()).toBe(false);
    endAdvisoryForesightEvaluation();
    endAdvisoryForesightEvaluation();
  });

  it("emits executive guidance recommendation contract fields", () => {
    const org = "af-contract-org";
    const cognition = minimalCognition(org);
    seedAdvisoryForesightRuntime(org, cognition);

    const result = evaluateStrategicExecutiveAdvisory({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 25_000,
    });

    expect(result.evaluated).toBe(true);
    const advisory = result.snapshot?.recentExecutiveGuidanceRecommendations[0];
    expect(advisory).toBeDefined();
    expect(advisory!.advisoryId.length).toBeGreaterThan(0);
    expect(advisory!.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(advisory!.recommendationPriority).not.toBe("informational");
    expect(advisory!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(advisory!.generatedAt).toBe(25_000);
  });
});
