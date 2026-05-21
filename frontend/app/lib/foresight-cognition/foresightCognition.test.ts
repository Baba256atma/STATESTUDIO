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
import {
  beginForesightCognitionEvaluation,
  endForesightCognitionEvaluation,
  resetForesightCognitionGuards,
} from "./foresightCognitionGuards";
import { getForesightCognitionStore, resetForesightCognitionStores } from "./foresightCognitionStore";
import { evaluateExecutiveStrategicForesight } from "./foresightCognitionEngine";
import { integrateForesightCognitionWithCognition } from "./integrateForesightCognitionWithCognition";
import { resetRiskConstellationGuards } from "./riskConstellationGuards";
import { resetRiskConstellationStores } from "./riskConstellationStore";
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

function resetTemporalStack(): void {
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

function minimalCognition(org = "foresight-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    timelineStrategicEvolutionLine: "Strategic evolution shows emerging coordination shifts.",
    organizationalLearningLine: "Organizational learning detects weak governance delay growth.",
    resilienceForecastLine: "Resilience trajectory may strengthen with sustained coordination.",
    uncertaintyFactorsLine: "Uncertainty remains moderate across operational dependencies.",
  };
}

function seedAnticipatoryRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  options?: { fragility?: boolean; pressure?: boolean }
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `foresight-seed-${i}` };
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
    evaluateInstitutionalExperienceCorrelation({
      organizationId,
      cognitionSnapshot: snapshot,
      now,
    });
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
      cognitionSnapshot: { ...cognition, signature: `foresight-temporal-${i}` },
      observations: { patternRecurrenceDetected: true },
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
}

describe("executive strategic foresight cognition D9:4:1", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("accumulates weak signals into emerging foresight deterministically", () => {
    const org = "foresight-accumulate-org";
    const cognition = minimalCognition(org);
    seedAnticipatoryRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateExecutiveStrategicForesight({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 14_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getForesightCognitionStore(org).getState().emergingSignals.length).toBeGreaterThan(0);
    const detections = getForesightCognitionStore(org).getState().weakSignalDetections;
    expect(detections.length).toBeGreaterThan(0);
  });

  it("strengthens foresight confidence when patterns recur", () => {
    const org = "foresight-recur-org";
    const cognition = minimalCognition(org);
    seedAnticipatoryRuntime(org, cognition, { fragility: false });

    evaluateExecutiveStrategicForesight({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 15_000,
    });
    const second = evaluateExecutiveStrategicForesight({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "foresight-recur-2" },
      now: 16_000,
    });

    expect(second.evaluated).toBe(true);
    const signals = getForesightCognitionStore(org).getState().emergingSignals;
    expect(signals.some((s) => s.occurrenceCount >= 1)).toBe(true);
  });

  it("dedupes duplicate foresight evaluations on unchanged signature", () => {
    const org = "foresight-dedupe-org";
    const cognition = minimalCognition(org);
    seedAnticipatoryRuntime(org, cognition);

    const first = integrateForesightCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 17_000,
    });
    const second = integrateForesightCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 17_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses foresight when anticipatory depth is insufficient", () => {
    const org = "foresight-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveStrategicForesight({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 18_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_anticipatory_depth");
  });

  it("keeps bounded foresight memory under caps", () => {
    const org = "foresight-bounded-org";
    const cognition = minimalCognition(org);
    seedAnticipatoryRuntime(org, cognition, { fragility: true });

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveStrategicForesight({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `foresight-bounded-${i}` },
        fragilityElevated: i % 3 === 0,
        pressureTopologyStressed: i % 2 === 0,
        now: 19_000 + i * 600,
      });
    }

    const state = getForesightCognitionStore(org).getState();
    expect(state.emergingSignals.length).toBeLessThanOrEqual(12);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive foresight evaluation", () => {
    expect(beginForesightCognitionEvaluation()).toBe(true);
    expect(beginForesightCognitionEvaluation()).toBe(true);
    expect(beginForesightCognitionEvaluation()).toBe(false);
    endForesightCognitionEvaluation();
    endForesightCognitionEvaluation();
  });

  it("emits emerging strategic signal contract fields", () => {
    const org = "foresight-contract-org";
    const cognition = minimalCognition(org);
    seedAnticipatoryRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateExecutiveStrategicForesight({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 20_000,
    });

    expect(result.evaluated).toBe(true);
    const signal = result.snapshot?.recentEmergingSignals[0];
    expect(signal).toBeDefined();
    expect(signal!.foresightId.length).toBeGreaterThan(0);
    expect(signal!.weakSignals.length).toBeGreaterThanOrEqual(2);
    expect(signal!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(signal!.generatedAt).toBe(20_000);
  });
});
