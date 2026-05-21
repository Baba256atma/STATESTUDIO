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
import { evaluateTemporalConvergenceIntelligence } from "../temporal-cognition/temporalConvergenceEngine";
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
import {
  beginPositiveDriftEvaluation,
  endPositiveDriftEvaluation,
  resetPositiveDriftGuards,
} from "./positiveDriftGuards";
import { getPositiveDriftStore, resetPositiveDriftStores } from "./positiveDriftStore";
import { evaluateStrategicOpportunityEmergence } from "./positiveDriftEngine";
import { integratePositiveDriftWithCognition } from "./integratePositiveDriftWithCognition";
import { resetStressSimulationGuards } from "./stressSimulationGuards";
import { resetStressSimulationStores } from "./stressSimulationStore";
import { resetInterventionTimingGuards } from "./interventionTimingGuards";
import { resetInterventionTimingStores } from "./interventionTimingStore";
import { resetPreparednessCognitionGuards } from "./preparednessCognitionGuards";
import { resetPreparednessCognitionStores } from "./preparednessCognitionStore";
import { resetAdvisoryForesightGuards } from "./advisoryForesightGuards";
import { resetAdvisoryForesightStores } from "./advisoryForesightStore";
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

function minimalCognition(org = "positive-drift-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
      fragilityElevated: false,
    }),
    pressurePosture: "stabilizing",
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
    strategicCalibrationActive: true,
    cognitiveEvolutionActive: true,
    organizationalEvolutionActive: true,
    timelineStrategicEvolutionLine:
      "Strategic evolution shows governance coordination improving steadily across systems.",
    organizationalLearningLine:
      "Organizational learning shows maturation and improvement across institutional memory.",
    resilienceForecastLine:
      "Resilience trajectory may strengthen with sustained coordination and recovery momentum.",
  };
}

function seedPositiveDriftRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `pd-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      observations: {
        patternRecurrenceDetected: true,
        pressureTopologyStressed: false,
      },
      fragilityElevated: false,
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
      fragilityElevated: false,
      now,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: false,
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
      cognitionSnapshot: { ...cognition, signature: `pd-temporal-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: false },
      fragilityElevated: false,
      continuityPreserved: true,
      now: 5_000 + i * 700,
    });
  }
  evaluateUnifiedTemporalCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: false,
    continuityPreserved: true,
    now: 12_000,
  });
  for (let i = 0; i < 3; i += 1) {
    evaluateOrganizationalAdaptationMemory({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `pd-adapt-${i}` },
      continuityPreserved: true,
      now: 12_500 + i * 300,
    });
  }
  evaluateTemporalConvergenceIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: false,
    continuityPreserved: true,
    now: 13_000,
  });
  evaluateExecutiveStrategicForesight({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: false,
    pressureTopologyStressed: false,
    continuityPreserved: true,
    now: 14_000,
  });
  evaluateWeakSignalCorrelation({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: false,
    pressureTopologyStressed: false,
    continuityPreserved: true,
    now: 16_000,
  });
}

describe("strategic opportunity emergence D9:4:4", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("accumulates positive opportunity signals deterministically", () => {
    const org = "pd-accumulate-org";
    const cognition = minimalCognition(org);
    seedPositiveDriftRuntime(org, cognition);

    const result = evaluateStrategicOpportunityEmergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      pressureTopologyStressed: false,
      continuityPreserved: true,
      now: 18_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getPositiveDriftStore(org).getState().strategicOpportunitySignals.length).toBeGreaterThan(
      0
    );
    expect(getPositiveDriftStore(org).getState().resilienceOpportunityFields.length).toBeGreaterThan(
      0
    );
  });

  it("strengthens opportunity signals when patterns recur", () => {
    const org = "pd-recur-org";
    const cognition = minimalCognition(org);
    seedPositiveDriftRuntime(org, cognition);

    evaluateStrategicOpportunityEmergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      continuityPreserved: true,
      now: 19_000,
    });
    const second = evaluateStrategicOpportunityEmergence({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "pd-recur-2" },
      fragilityElevated: false,
      continuityPreserved: true,
      now: 20_000,
    });

    expect(second.evaluated).toBe(true);
    const signals = getPositiveDriftStore(org).getState().strategicOpportunitySignals;
    expect(signals.some((s) => s.occurrenceCount >= 1)).toBe(true);
  });

  it("dedupes duplicate positive drift evaluations on unchanged signature", () => {
    const org = "pd-dedupe-org";
    const cognition = minimalCognition(org);
    seedPositiveDriftRuntime(org, cognition);

    const first = integratePositiveDriftWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      pressureTopologyStressed: false,
      continuityPreserved: true,
      now: 21_000,
    });
    const second = integratePositiveDriftWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      pressureTopologyStressed: false,
      continuityPreserved: true,
      now: 21_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses opportunities when depth is insufficient", () => {
    const org = "pd-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateStrategicOpportunityEmergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 22_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_opportunity_depth");
  });

  it("keeps bounded positive drift memory under caps", () => {
    const org = "pd-bounded-org";
    const cognition = minimalCognition(org);
    seedPositiveDriftRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicOpportunityEmergence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `pd-bounded-${i}` },
        fragilityElevated: false,
        continuityPreserved: true,
        now: 23_000 + i * 600,
      });
    }

    const state = getPositiveDriftStore(org).getState();
    expect(state.strategicOpportunitySignals.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive positive drift evaluation", () => {
    expect(beginPositiveDriftEvaluation()).toBe(true);
    expect(beginPositiveDriftEvaluation()).toBe(true);
    expect(beginPositiveDriftEvaluation()).toBe(false);
    endPositiveDriftEvaluation();
    endPositiveDriftEvaluation();
  });

  it("emits strategic opportunity contract fields", () => {
    const org = "pd-contract-org";
    const cognition = minimalCognition(org);
    seedPositiveDriftRuntime(org, cognition);

    const result = evaluateStrategicOpportunityEmergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      pressureTopologyStressed: false,
      continuityPreserved: true,
      now: 24_000,
    });

    expect(result.evaluated).toBe(true);
    const opportunity = result.snapshot?.recentStrategicOpportunitySignals[0];
    expect(opportunity).toBeDefined();
    expect(opportunity!.opportunityId.length).toBeGreaterThan(0);
    expect(opportunity!.opportunitySignals.length).toBeGreaterThanOrEqual(2);
    expect(opportunity!.opportunityStrength).not.toBe("weak");
    expect(opportunity!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(opportunity!.generatedAt).toBe(24_000);
  });
});
