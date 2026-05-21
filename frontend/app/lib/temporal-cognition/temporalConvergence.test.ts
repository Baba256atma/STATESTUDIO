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
import {
  beginTemporalConvergenceEvaluation,
  endTemporalConvergenceEvaluation,
  resetTemporalConvergenceGuards,
} from "./temporalConvergenceGuards";
import {
  resetTemporalConvergenceStores,
  getTemporalConvergenceStore,
} from "./temporalConvergenceStore";
import { evaluateTemporalConvergenceIntelligence } from "./temporalConvergenceEngine";
import { integrateTemporalConvergenceWithCognition } from "./integrateTemporalConvergenceWithCognition";
import { resetTemporalDriftProjectionGuards } from "./temporalDriftProjectionGuards";
import { resetTemporalDriftProjectionStores } from "./temporalDriftProjectionStore";
import { integrateTemporalDriftProjectionWithCognition } from "./integrateTemporalDriftProjectionWithCognition";
import { resetTemporalCompressionGuards } from "./temporalCompressionGuards";
import { resetTemporalCompressionStores } from "./temporalCompressionStore";
import { resetTemporalMemorySyncGuards } from "./temporalMemorySyncGuards";
import { resetTemporalMemorySyncStores } from "./temporalMemorySyncStore";
import { resetTemporalFieldGuards } from "./temporalFieldGuards";
import { resetTemporalFieldStores } from "./temporalFieldStore";
import { resetUnifiedTemporalCognitionGuards } from "./unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "./unifiedTemporalCognitionStore";
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

function minimalCognition(org = "convergence-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    const snapshot = { ...cognition, signature: `conv-seed-${i}` };
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
}

describe("temporal convergence intelligence D9:3:6", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("forms resilience alignment convergence when recovery improves", () => {
    const org = "resilience-convergence-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    for (let i = 0; i < 3; i += 1) {
      evaluateOrganizationalAdaptationMemory({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `conv-adapt-${i}` },
        continuityPreserved: true,
        now: 9_500 + i * 300,
      });
    }

    const result = evaluateTemporalConvergenceIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      continuityPreserved: true,
      now: 10_000,
    });

    expect(result.evaluated).toBe(true);
    const resilience = getTemporalConvergenceStore(org)
      .getState()
      .patterns.find((p) => p.category === "resilience_alignment");
    expect(resilience).toBeDefined();
    expect(resilience!.convergenceSignals.length).toBeGreaterThan(0);
  });

  it("strengthens stabilization when escalation pressure is absent", () => {
    const org = "escalation-decay-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    const result = evaluateTemporalConvergenceIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 10_500,
    });

    expect(result.evaluated).toBe(true);
    const patterns = result.snapshot?.recentConvergencePatterns ?? [];
    const hasStabilizing = patterns.some(
      (p) =>
        p.category === "escalation_decay" ||
        p.category === "governance_stabilization" ||
        p.category === "fragility_reduction"
    );
    expect(hasStabilizing).toBe(true);
  });

  it("dedupes duplicate convergence evaluations on unchanged signature", () => {
    const org = "convergence-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    const first = integrateTemporalConvergenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 11_000,
    });
    const second = integrateTemporalConvergenceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      now: 11_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded convergence memory under caps", () => {
    const org = "convergence-bounded-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    for (let i = 0; i < 20; i += 1) {
      evaluateTemporalConvergenceIntelligence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `conv-bounded-${i}` },
        fragilityElevated: i % 3 === 0,
        now: 12_000 + i * 600,
      });
    }

    const state = getTemporalConvergenceStore(org).getState();
    expect(state.patterns.length).toBeLessThanOrEqual(12);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive convergence evaluation", () => {
    expect(beginTemporalConvergenceEvaluation()).toBe(true);
    expect(beginTemporalConvergenceEvaluation()).toBe(true);
    expect(beginTemporalConvergenceEvaluation()).toBe(false);
    endTemporalConvergenceEvaluation();
    endTemporalConvergenceEvaluation();
  });

  it("emits convergence contract fields", () => {
    const org = "convergence-contract-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: false });

    const result = evaluateTemporalConvergenceIntelligence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: false,
      continuityPreserved: true,
      now: 13_000,
    });

    expect(result.evaluated).toBe(true);
    const pattern = result.snapshot?.recentConvergencePatterns[0];
    expect(pattern).toBeDefined();
    expect(pattern!.convergenceId.length).toBeGreaterThan(0);
    expect(pattern!.convergenceStrength).toMatch(/weak|moderate|strong|accelerating/);
    expect(pattern!.confidence).toBeGreaterThanOrEqual(0.45);
    expect(pattern!.generatedAt).toBe(13_000);
  });
});
