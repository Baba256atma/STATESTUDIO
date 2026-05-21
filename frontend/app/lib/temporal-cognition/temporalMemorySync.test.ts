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
import {
  beginTemporalMemorySyncEvaluation,
  endTemporalMemorySyncEvaluation,
  resetTemporalMemorySyncGuards,
} from "./temporalMemorySyncGuards";
import {
  getTemporalMemorySyncStore,
  resetTemporalMemorySyncStores,
} from "./temporalMemorySyncStore";
import { evaluateInstitutionalTemporalMemorySync } from "./temporalMemorySyncEngine";
import { integrateTemporalMemorySyncWithCognition } from "./integrateTemporalMemorySyncWithCognition";
import { resetTemporalFieldGuards } from "./temporalFieldGuards";
import { resetTemporalFieldStores } from "./temporalFieldStore";
import { resetUnifiedTemporalCognitionGuards } from "./unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "./unifiedTemporalCognitionStore";

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

function minimalCognition(org = "memory-sync-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
  };
}

function seedFullD9_3Stack(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  options?: { fragility?: boolean }
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `sync-seed-${i}` };
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
}

function establishPriorPeriod(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  evaluateInstitutionalTemporalMemorySync({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 12_000,
  });
}

function advancePeriodStack(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  periodIndex: number,
  now: number
) {
  evaluateInstitutionalMemoryAccumulation({
    organizationId,
    cognitionSnapshot: { ...cognition, signature: `sync-advance-${periodIndex}` },
    observations: { patternRecurrenceDetected: periodIndex % 2 === 0 },
    fragilityElevated: false,
    continuityPreserved: true,
    now,
  });
  integrateTemporalCompressionWithCognition({
    organizationId,
    cognitionSnapshot: { ...cognition, signature: `sync-advance-${periodIndex}` },
    continuityPreserved: true,
    now: now + 50,
  });
}

describe("institutional temporal memory sync D9:3:8", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("synchronizes institutional memory across evaluation periods", () => {
    const org = "sync-period-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });
    establishPriorPeriod(org, cognition);
    advancePeriodStack(org, cognition, 1, 12_500);

    const result = evaluateInstitutionalTemporalMemorySync({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "sync-period-advance" },
      continuityPreserved: true,
      now: 13_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getTemporalMemorySyncStore(org).getState().syncRecords.length).toBeGreaterThan(0);
    const bridges = getTemporalMemorySyncStore(org).getState().periodBridges;
    expect(bridges.length).toBeGreaterThan(0);
  });

  it("dedupes duplicate sync evaluations on unchanged signature", () => {
    const org = "sync-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition);
    establishPriorPeriod(org, cognition);
    advancePeriodStack(org, cognition, 2, 13_500);

    const first = integrateTemporalMemorySyncWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 14_000,
    });
    const second = integrateTemporalMemorySyncWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 14_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses sync when cross-period depth is insufficient", () => {
    const org = "sync-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateInstitutionalTemporalMemorySync({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 15_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_cross_period_depth");
  });

  it("keeps bounded sync memory under caps", () => {
    const org = "sync-bounded-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition);
    establishPriorPeriod(org, cognition);
    advancePeriodStack(org, cognition, 3, 15_500);

    for (let i = 0; i < 20; i += 1) {
      advancePeriodStack(org, cognition, 10 + i, 15_800 + i * 400);
      evaluateInstitutionalTemporalMemorySync({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `sync-bounded-${i}` },
        fragilityElevated: i % 3 === 0,
        now: 16_000 + i * 600,
      });
    }

    const state = getTemporalMemorySyncStore(org).getState();
    expect(state.syncRecords.length).toBeLessThanOrEqual(12);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive sync evaluation", () => {
    expect(beginTemporalMemorySyncEvaluation()).toBe(true);
    expect(beginTemporalMemorySyncEvaluation()).toBe(true);
    expect(beginTemporalMemorySyncEvaluation()).toBe(false);
    endTemporalMemorySyncEvaluation();
    endTemporalMemorySyncEvaluation();
  });

  it("emits enterprise cross-period sync contract fields", () => {
    const org = "sync-contract-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });
    establishPriorPeriod(org, cognition);
    advancePeriodStack(org, cognition, 4, 16_500);

    const result = evaluateInstitutionalTemporalMemorySync({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "sync-contract-advance" },
      continuityPreserved: true,
      now: 17_000,
    });

    expect(result.evaluated).toBe(true);
    const record = result.snapshot?.recentSyncRecords[0];
    expect(record).toBeDefined();
    expect(record!.syncId.length).toBeGreaterThan(0);
    expect(record!.crossPeriodSignals.length).toBeGreaterThanOrEqual(2);
    expect(record!.priorPeriodReference.length).toBeGreaterThan(0);
    expect(record!.currentPeriodReference.length).toBeGreaterThan(0);
    expect(record!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(record!.generatedAt).toBe(17_000);
  });
});
