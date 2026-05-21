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
import { resetCausalDependencyGuards } from "./causalDependencyGuards";
import { resetCausalDependencyStores } from "./causalDependencyStore";
import { integrateCausalDependencyWithCognition } from "./integrateCausalDependencyWithCognition";
import { resetMultiTimelineGuards } from "./multiTimelineGuards";
import { resetMultiTimelineStores } from "./multiTimelineStore";
import { integrateMultiTimelineWithCognition } from "./integrateMultiTimelineWithCognition";
import { resetOperationalReplayGuards } from "./operationalReplayGuards";
import { resetOperationalReplayStores } from "./operationalReplayStore";
import { integrateOperationalReplayWithCognition } from "./integrateOperationalReplayWithCognition";
import { resetTemporalConvergenceGuards } from "./temporalConvergenceGuards";
import { resetTemporalConvergenceStores } from "./temporalConvergenceStore";
import { integrateTemporalConvergenceWithCognition } from "./integrateTemporalConvergenceWithCognition";
import { resetTemporalCompressionGuards } from "./temporalCompressionGuards";
import { resetTemporalCompressionStores } from "./temporalCompressionStore";
import { integrateTemporalCompressionWithCognition } from "./integrateTemporalCompressionWithCognition";
import { resetTemporalDriftProjectionGuards } from "./temporalDriftProjectionGuards";
import { resetTemporalDriftProjectionStores } from "./temporalDriftProjectionStore";
import { integrateTemporalDriftProjectionWithCognition } from "./integrateTemporalDriftProjectionWithCognition";
import { resetTemporalCognitionGuards } from "./temporalCognitionGuards";
import { resetTemporalCognitionStores } from "./temporalCognitionStore";
import { integrateTemporalCognitionWithCognition } from "./integrateTemporalCognitionWithCognition";
import { resetTemporalMemorySyncGuards } from "./temporalMemorySyncGuards";
import { resetTemporalMemorySyncStores } from "./temporalMemorySyncStore";
import { evaluateInstitutionalTemporalMemorySync } from "./temporalMemorySyncEngine";
import { integrateTemporalMemorySyncWithCognition } from "./integrateTemporalMemorySyncWithCognition";
import {
  beginTemporalFieldEvaluation,
  endTemporalFieldEvaluation,
  resetTemporalFieldGuards,
} from "./temporalFieldGuards";
import { getTemporalFieldStore, resetTemporalFieldStores } from "./temporalFieldStore";
import { resetUnifiedTemporalCognitionGuards } from "./unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "./unifiedTemporalCognitionStore";
import { evaluateStrategicTimeFieldIntelligence } from "./temporalFieldEngine";
import { integrateTemporalFieldWithCognition } from "./integrateTemporalFieldWithCognition";

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
}

function minimalCognition(org = "time-field-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    timelineStrategicEvolutionLine: "Strategic evolution persists across operational eras.",
    organizationalLearningLine: "Organizational learning compounds across leadership transitions.",
    resilienceForecastLine: "Resilience trajectory may strengthen across long horizons.",
    timelineInstitutionalContinuityLine: "Institutional continuity anchors enterprise adaptation.",
  };
}

function seedFullHorizonStack(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  options?: { fragility?: boolean }
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `field-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
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
  integrateTemporalCognitionWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    now: 5_000,
  });
  integrateCausalDependencyWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    now: 6_000,
  });
  integrateOperationalReplayWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    now: 7_000,
  });
  integrateTemporalDriftProjectionWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    now: 8_000,
  });
  integrateMultiTimelineWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    now: 9_000,
  });
  integrateTemporalConvergenceWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    continuityPreserved: true,
    now: 10_000,
  });
  integrateTemporalCompressionWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? false,
    continuityPreserved: true,
    now: 11_000,
  });
  evaluateInstitutionalTemporalMemorySync({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 12_000,
  });
  evaluateInstitutionalMemoryAccumulation({
    organizationId,
    cognitionSnapshot: { ...cognition, signature: "field-sync-advance" },
    observations: { patternRecurrenceDetected: true },
    fragilityElevated: false,
    continuityPreserved: true,
    now: 12_500,
  });
  integrateTemporalCompressionWithCognition({
    organizationId,
    cognitionSnapshot: { ...cognition, signature: "field-sync-advance" },
    continuityPreserved: true,
    now: 12_550,
  });
  integrateTemporalMemorySyncWithCognition({
    organizationId,
    cognitionSnapshot: { ...cognition, signature: "field-sync-advance" },
    continuityPreserved: true,
    now: 13_000,
  });
}

describe("strategic time-field intelligence D9:3:9", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("consolidates long-term organizational patterns into time fields", () => {
    const org = "field-consolidate-org";
    const cognition = minimalCognition(org);
    seedFullHorizonStack(org, cognition, { fragility: false });

    const result = evaluateStrategicTimeFieldIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      resilienceForecastLine: cognition.resilienceForecastLine,
      now: 14_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getTemporalFieldStore(org).getState().timeFields.length).toBeGreaterThan(0);
    const patterns = getTemporalFieldStore(org).getState().longHorizonPatterns;
    expect(patterns.length).toBeGreaterThan(0);
  });

  it("dedupes duplicate field evaluations on unchanged signature", () => {
    const org = "field-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullHorizonStack(org, cognition);

    const first = integrateTemporalFieldWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 15_000,
    });
    const second = integrateTemporalFieldWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 15_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses field formation when horizon depth is insufficient", () => {
    const org = "field-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateStrategicTimeFieldIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 16_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_horizon_depth");
  });

  it("keeps bounded field memory under caps", () => {
    const org = "field-bounded-org";
    const cognition = minimalCognition(org);
    seedFullHorizonStack(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateInstitutionalMemoryAccumulation({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `field-bounded-${i}` },
        observations: { patternRecurrenceDetected: i % 2 === 0 },
        fragilityElevated: i % 4 === 0,
        continuityPreserved: true,
        now: 16_500 + i * 600,
      });
      evaluateStrategicTimeFieldIntelligence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `field-bounded-${i}` },
        resilienceForecastLine: cognition.resilienceForecastLine,
        now: 17_000 + i * 600,
      });
    }

    const state = getTemporalFieldStore(org).getState();
    expect(state.timeFields.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive field evaluation", () => {
    expect(beginTemporalFieldEvaluation()).toBe(true);
    expect(beginTemporalFieldEvaluation()).toBe(true);
    expect(beginTemporalFieldEvaluation()).toBe(false);
    endTemporalFieldEvaluation();
    endTemporalFieldEvaluation();
  });

  it("emits enterprise time-field contract fields", () => {
    const org = "field-contract-org";
    const cognition = minimalCognition(org);
    seedFullHorizonStack(org, cognition, { fragility: false });

    const result = evaluateStrategicTimeFieldIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      enterpriseNarrativeLine: cognition.timelineStrategicEvolutionLine,
      resilienceForecastLine: cognition.resilienceForecastLine,
      now: 18_000,
    });

    expect(result.evaluated).toBe(true);
    const field = result.snapshot?.recentTimeFields[0];
    expect(field).toBeDefined();
    expect(field!.temporalFieldId.length).toBeGreaterThan(0);
    expect(field!.fieldSignals.length).toBeGreaterThanOrEqual(2);
    expect(field!.horizonState).not.toBe("short_term");
    expect(field!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(field!.generatedAt).toBe(18_000);
  });
});
