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
import {
  beginRiskConstellationEvaluation,
  endRiskConstellationEvaluation,
  resetRiskConstellationGuards,
} from "./riskConstellationGuards";
import { getRiskConstellationStore, resetRiskConstellationStores } from "./riskConstellationStore";
import { evaluateWeakSignalCorrelation } from "./riskConstellationEngine";
import { integrateRiskConstellationWithCognition } from "./integrateRiskConstellationWithCognition";
import { resetEarlyWarningGuards } from "./earlyWarningGuards";
import { resetEarlyWarningStores } from "./earlyWarningStore";
import { resetPositiveDriftGuards } from "./positiveDriftGuards";
import { resetPositiveDriftStores } from "./positiveDriftStore";
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

function resetInstitutionalStack(): void {
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
}

function resetAllStacks(): void {
  resetInstitutionalStack();
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

function minimalCognition(org = "constellation-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    pressurePosture: "attention",
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
    strategicCalibrationActive: true,
    cognitiveEvolutionActive: true,
    organizationalEvolutionActive: true,
    timelineStrategicEvolutionLine: "Strategic evolution shows governance delay growth.",
    organizationalLearningLine: "Organizational learning detects coordination degradation.",
    resilienceForecastLine: "Resilience trajectory may weaken without coordination recovery.",
    uncertaintyFactorsLine: "Uncertainty elevated across operational dependencies.",
  };
}

function seedForesightAndConstellationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  options?: { fragility?: boolean; pressure?: boolean }
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `constellation-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      observations: {
        pressureTopologyStressed: options?.pressure ?? i === 1,
        patternRecurrenceDetected: true,
      },
      fragilityElevated: options?.fragility ?? i === 0,
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
      fragilityElevated: options?.fragility ?? i === 0,
      now,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
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
      cognitionSnapshot: { ...cognition, signature: `constellation-temporal-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: options?.pressure },
      fragilityElevated: options?.fragility ?? false,
      continuityPreserved: true,
      now: 5_000 + i * 700,
    });
  }
  evaluateUnifiedTemporalCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    continuityPreserved: true,
    now: 12_000,
  });
  evaluateExecutiveStrategicForesight({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
    pressureTopologyStressed: options?.pressure ?? true,
    now: 14_000,
  });
}

describe("weak signal correlation risk constellation D9:4:2", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("correlates weak signals into distributed instability clusters", () => {
    const org = "constellation-cluster-org";
    const cognition = minimalCognition(org);
    seedForesightAndConstellationRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateWeakSignalCorrelation({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 16_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getRiskConstellationStore(org).getState().constellations.length).toBeGreaterThan(0);
    const correlations = getRiskConstellationStore(org).getState().correlations;
    expect(correlations.length).toBeGreaterThan(0);
  });

  it("strengthens constellation confidence when patterns recur", () => {
    const org = "constellation-recur-org";
    const cognition = minimalCognition(org);
    seedForesightAndConstellationRuntime(org, cognition, { fragility: true, pressure: true });

    evaluateWeakSignalCorrelation({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 17_000,
    });
    const second = evaluateWeakSignalCorrelation({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "constellation-recur-2" },
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 18_000,
    });

    expect(second.evaluated).toBe(true);
    const constellations = getRiskConstellationStore(org).getState().constellations;
    expect(constellations.some((c) => c.occurrenceCount >= 1)).toBe(true);
  });

  it("dedupes duplicate constellation evaluations on unchanged signature", () => {
    const org = "constellation-dedupe-org";
    const cognition = minimalCognition(org);
    seedForesightAndConstellationRuntime(org, cognition, { fragility: true, pressure: true });

    const first = integrateRiskConstellationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 19_000,
    });
    const second = integrateRiskConstellationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 19_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses constellation formation when correlation depth is insufficient", () => {
    const org = "constellation-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateWeakSignalCorrelation({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 20_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_correlation_depth");
  });

  it("keeps bounded constellation memory under caps", () => {
    const org = "constellation-bounded-org";
    const cognition = minimalCognition(org);
    seedForesightAndConstellationRuntime(org, cognition, { fragility: true, pressure: true });

    for (let i = 0; i < 20; i += 1) {
      evaluateWeakSignalCorrelation({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `constellation-bounded-${i}` },
        fragilityElevated: i % 2 === 0,
        pressureTopologyStressed: true,
        now: 21_000 + i * 600,
      });
    }

    const state = getRiskConstellationStore(org).getState();
    expect(state.constellations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive constellation evaluation", () => {
    expect(beginRiskConstellationEvaluation()).toBe(true);
    expect(beginRiskConstellationEvaluation()).toBe(true);
    expect(beginRiskConstellationEvaluation()).toBe(false);
    endRiskConstellationEvaluation();
    endRiskConstellationEvaluation();
  });

  it("emits enterprise risk constellation contract fields", () => {
    const org = "constellation-contract-org";
    const cognition = minimalCognition(org);
    seedForesightAndConstellationRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateWeakSignalCorrelation({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 22_000,
    });

    expect(result.evaluated).toBe(true);
    const constellation = result.snapshot?.recentConstellations[0];
    expect(constellation).toBeDefined();
    expect(constellation!.constellationId.length).toBeGreaterThan(0);
    expect(constellation!.correlatedSignals.length).toBeGreaterThanOrEqual(2);
    expect(constellation!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(constellation!.generatedAt).toBe(22_000);
  });
});
