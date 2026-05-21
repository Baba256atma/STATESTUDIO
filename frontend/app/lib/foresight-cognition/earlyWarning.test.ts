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
import {
  beginEarlyWarningEvaluation,
  endEarlyWarningEvaluation,
  resetEarlyWarningGuards,
} from "./earlyWarningGuards";
import { getEarlyWarningStore, resetEarlyWarningStores } from "./earlyWarningStore";
import { evaluateExecutiveEarlyWarningIntelligence } from "./earlyWarningEngine";
import { integrateEarlyWarningWithCognition } from "./integrateEarlyWarningWithCognition";
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

function minimalCognition(org = "early-warning-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    organizationalLearningLine: "Coordination degradation detected across systems.",
    resilienceForecastLine: "Resilience trajectory may weaken without intervention.",
  };
}

function seedEarlyWarningRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  options?: { fragility?: boolean; pressure?: boolean }
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `ew-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      observations: {
        pressureTopologyStressed: options?.pressure ?? true,
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
      cognitionSnapshot: { ...cognition, signature: `ew-temporal-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: true },
      fragilityElevated: options?.fragility ?? true,
      continuityPreserved: true,
      now: 5_000 + i * 700,
    });
  }
  evaluateUnifiedTemporalCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
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
  evaluateWeakSignalCorrelation({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
    pressureTopologyStressed: options?.pressure ?? true,
    now: 16_000,
  });
}

describe("executive early warning intelligence D9:4:3", () => {
  beforeEach(() => {
    resetAllStacks();
  });

  it("accumulates precursor signals into early warnings deterministically", () => {
    const org = "ew-accumulate-org";
    const cognition = minimalCognition(org);
    seedEarlyWarningRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateExecutiveEarlyWarningIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 18_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getEarlyWarningStore(org).getState().preEscalationSignals.length).toBeGreaterThan(0);
    expect(getEarlyWarningStore(org).getState().precursorFields.length).toBeGreaterThan(0);
  });

  it("correlates distributed warnings when patterns recur", () => {
    const org = "ew-recur-org";
    const cognition = minimalCognition(org);
    seedEarlyWarningRuntime(org, cognition, { fragility: true, pressure: true });

    evaluateExecutiveEarlyWarningIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 19_000,
    });
    const second = evaluateExecutiveEarlyWarningIntelligence({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "ew-recur-2" },
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 20_000,
    });

    expect(second.evaluated).toBe(true);
    const signals = getEarlyWarningStore(org).getState().preEscalationSignals;
    expect(signals.some((s) => s.occurrenceCount >= 1)).toBe(true);
  });

  it("dedupes duplicate early warning evaluations on unchanged signature", () => {
    const org = "ew-dedupe-org";
    const cognition = minimalCognition(org);
    seedEarlyWarningRuntime(org, cognition, { fragility: true, pressure: true });

    const first = integrateEarlyWarningWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 21_000,
    });
    const second = integrateEarlyWarningWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 21_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses warnings when precursor depth is insufficient", () => {
    const org = "ew-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateExecutiveEarlyWarningIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 22_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_warning_depth");
  });

  it("keeps bounded early warning memory under caps", () => {
    const org = "ew-bounded-org";
    const cognition = minimalCognition(org);
    seedEarlyWarningRuntime(org, cognition, { fragility: true, pressure: true });

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveEarlyWarningIntelligence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `ew-bounded-${i}` },
        fragilityElevated: true,
        pressureTopologyStressed: true,
        now: 23_000 + i * 600,
      });
    }

    const state = getEarlyWarningStore(org).getState();
    expect(state.preEscalationSignals.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive early warning evaluation", () => {
    expect(beginEarlyWarningEvaluation()).toBe(true);
    expect(beginEarlyWarningEvaluation()).toBe(true);
    expect(beginEarlyWarningEvaluation()).toBe(false);
    endEarlyWarningEvaluation();
    endEarlyWarningEvaluation();
  });

  it("emits pre-escalation warning contract fields", () => {
    const org = "ew-contract-org";
    const cognition = minimalCognition(org);
    seedEarlyWarningRuntime(org, cognition, { fragility: true, pressure: true });

    const result = evaluateExecutiveEarlyWarningIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      pressureTopologyStressed: true,
      now: 24_000,
    });

    expect(result.evaluated).toBe(true);
    const warning = result.snapshot?.recentPreEscalationSignals[0];
    expect(warning).toBeDefined();
    expect(warning!.warningId.length).toBeGreaterThan(0);
    expect(warning!.warningSignals.length).toBeGreaterThanOrEqual(2);
    expect(warning!.warningSeverity).not.toBe("low");
    expect(warning!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(warning!.generatedAt).toBe(24_000);
  });
});
