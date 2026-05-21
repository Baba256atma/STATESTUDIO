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
import {
  beginTemporalCompressionEvaluation,
  endTemporalCompressionEvaluation,
  resetTemporalCompressionGuards,
} from "./temporalCompressionGuards";
import {
  resetTemporalCompressionStores,
  getTemporalCompressionStore,
} from "./temporalCompressionStore";
import { resetTemporalMemorySyncGuards } from "./temporalMemorySyncGuards";
import { resetTemporalMemorySyncStores } from "./temporalMemorySyncStore";
import { resetTemporalFieldGuards } from "./temporalFieldGuards";
import { resetTemporalFieldStores } from "./temporalFieldStore";
import { resetUnifiedTemporalCognitionGuards } from "./unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "./unifiedTemporalCognitionStore";
import { evaluateStrategicTemporalCompression } from "./temporalCompressionEngine";
import { integrateTemporalCompressionWithCognition } from "./integrateTemporalCompressionWithCognition";
import { resetTemporalDriftProjectionGuards } from "./temporalDriftProjectionGuards";
import { resetTemporalDriftProjectionStores } from "./temporalDriftProjectionStore";
import { integrateTemporalDriftProjectionWithCognition } from "./integrateTemporalDriftProjectionWithCognition";
import { resetTemporalCognitionGuards } from "./temporalCognitionGuards";
import { resetTemporalCognitionStores } from "./temporalCognitionStore";
import { integrateTemporalCognitionWithCognition } from "./integrateTemporalCognitionWithCognition";

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

function minimalCognition(org = "compression-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    const snapshot = { ...cognition, signature: `compress-seed-${i}` };
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
}

describe("strategic temporal compression D9:3:7", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("compresses repeated operational histories into executive digests", () => {
    const org = "compress-history-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    for (let i = 0; i < 4; i += 1) {
      evaluateInstitutionalMemoryAccumulation({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `compress-repeat-${i}` },
        observations: { patternRecurrenceDetected: true },
        fragilityElevated: false,
        now: 10_500 + i * 200,
      });
    }

    const result = evaluateStrategicTemporalCompression({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 11_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getTemporalCompressionStore(org).getState().digests.length).toBeGreaterThan(0);
    const steps = getTemporalCompressionStore(org).getState().timelineCompressions;
    expect(steps.some((t) => t.compressedSteps.length >= 2)).toBe(true);
  });

  it("dedupes duplicate compression evaluations on unchanged signature", () => {
    const org = "compress-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    const first = integrateTemporalCompressionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 12_000,
    });
    const second = integrateTemporalCompressionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 12_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses compression when timeline depth is insufficient", () => {
    const org = "compress-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateStrategicTemporalCompression({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 13_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_compression_depth");
  });

  it("keeps bounded compression memory under caps", () => {
    const org = "compress-bounded-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicTemporalCompression({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `compress-bounded-${i}` },
        fragilityElevated: i % 3 === 0,
        now: 14_000 + i * 600,
      });
    }

    const state = getTemporalCompressionStore(org).getState();
    expect(state.digests.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive compression evaluation", () => {
    expect(beginTemporalCompressionEvaluation()).toBe(true);
    expect(beginTemporalCompressionEvaluation()).toBe(true);
    expect(beginTemporalCompressionEvaluation()).toBe(false);
    endTemporalCompressionEvaluation();
    endTemporalCompressionEvaluation();
  });

  it("emits executive temporal digest contract fields", () => {
    const org = "compress-contract-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    const result = evaluateStrategicTemporalCompression({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      continuityPreserved: true,
      now: 15_000,
    });

    expect(result.evaluated).toBe(true);
    const digest = result.snapshot?.recentDigests[0];
    expect(digest).toBeDefined();
    expect(digest!.compressionId.length).toBeGreaterThan(0);
    expect(digest!.distilledSignals.length).toBeGreaterThanOrEqual(2);
    expect(digest!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(digest!.generatedAt).toBe(15_000);
  });
});
