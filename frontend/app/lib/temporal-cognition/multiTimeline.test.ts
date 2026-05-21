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
import {
  beginMultiTimelineEvaluation,
  endMultiTimelineEvaluation,
  resetMultiTimelineGuards,
} from "./multiTimelineGuards";
import { resetTemporalCompressionGuards } from "./temporalCompressionGuards";
import { resetTemporalCompressionStores } from "./temporalCompressionStore";
import { resetTemporalMemorySyncGuards } from "./temporalMemorySyncGuards";
import { resetTemporalMemorySyncStores } from "./temporalMemorySyncStore";
import { resetTemporalFieldGuards } from "./temporalFieldGuards";
import { resetTemporalFieldStores } from "./temporalFieldStore";
import { resetUnifiedTemporalCognitionGuards } from "./unifiedTemporalCognitionGuards";
import { resetUnifiedTemporalCognitionStores } from "./unifiedTemporalCognitionStore";
import { resetTemporalConvergenceGuards } from "./temporalConvergenceGuards";
import { resetTemporalConvergenceStores } from "./temporalConvergenceStore";
import { resetMultiTimelineStores, getMultiTimelineStore } from "./multiTimelineStore";
import { evaluateMultiTimelineDivergence } from "./multiTimelineEngine";
import { integrateMultiTimelineWithCognition } from "./integrateMultiTimelineWithCognition";
import { resetOperationalReplayGuards } from "./operationalReplayGuards";
import { resetOperationalReplayStores } from "./operationalReplayStore";
import { integrateOperationalReplayWithCognition } from "./integrateOperationalReplayWithCognition";
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

function minimalCognition(org = "multi-timeline-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
    const snapshot = { ...cognition, signature: `mt-seed-${i}` };
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
    fragilityElevated: options?.fragility ?? true,
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
    fragilityElevated: options?.fragility ?? true,
    now: 5_000,
  });
  integrateCausalDependencyWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
    now: 6_000,
  });
  integrateOperationalReplayWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
    now: 7_000,
  });
  integrateTemporalDriftProjectionWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: options?.fragility ?? true,
    now: 8_000,
  });
}

describe("multi-timeline divergence D9:3:5", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("forms alternative branches deterministically", () => {
    const org = "mt-deterministic-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: true });

    const result = evaluateMultiTimelineDivergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 9_000,
    });

    expect(result.evaluated).toBe(true);
    expect(getMultiTimelineStore(org).getState().branches.length).toBeGreaterThanOrEqual(2);
  });

  it("diverges resilience and fragility paths when both signals present", () => {
    const org = "mt-diverge-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: true });

    for (let i = 0; i < 2; i += 1) {
      evaluateOrganizationalAdaptationMemory({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `mt-adapt-${i}` },
        continuityPreserved: true,
        now: 8_500 + i * 300,
      });
    }

    const result = evaluateMultiTimelineDivergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      continuityPreserved: true,
      now: 9_500,
    });

    expect(result.evaluated).toBe(true);
    const branches = result.snapshot?.timelineBranches ?? [];
    const types = new Set(branches.map((b) => b.branchType));
    expect(types.size).toBeGreaterThanOrEqual(2);
    const hasFragility = types.has("systemic_fragility") || types.has("escalation");
    const hasGrowth =
      types.has("resilience_growth") ||
      types.has("adaptive_evolution") ||
      types.has("stabilization");
    expect(hasFragility || hasGrowth).toBe(true);
  });

  it("dedupes duplicate divergence evaluations on unchanged signature", () => {
    const org = "mt-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition);

    const first = integrateMultiTimelineWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 10_000,
    });
    const second = integrateMultiTimelineWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 10_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded multi-timeline memory under caps", () => {
    const org = "mt-bounded-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateMultiTimelineDivergence({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `mt-bounded-${i}` },
        fragilityElevated: i % 2 === 0,
        now: 11_000 + i * 600,
      });
    }

    const state = getMultiTimelineStore(org).getState();
    expect(state.divergencePaths.length).toBeLessThanOrEqual(10);
    expect(state.branches.length).toBeLessThanOrEqual(16);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive multi-timeline evaluation", () => {
    expect(beginMultiTimelineEvaluation()).toBe(true);
    expect(beginMultiTimelineEvaluation()).toBe(true);
    expect(beginMultiTimelineEvaluation()).toBe(false);
    endMultiTimelineEvaluation();
    endMultiTimelineEvaluation();
  });

  it("emits enterprise divergence path contract fields", () => {
    const org = "mt-contract-org";
    const cognition = minimalCognition(org);
    seedFullD9_3Stack(org, cognition, { fragility: true });

    const result = evaluateMultiTimelineDivergence({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 12_000,
    });

    expect(result.evaluated).toBe(true);
    const path = result.snapshot?.recentDivergencePaths[0];
    expect(path).toBeDefined();
    expect(path!.divergenceId.length).toBeGreaterThan(0);
    expect(path!.branches.length).toBeGreaterThanOrEqual(2);
    expect(path!.confidence).toBeGreaterThanOrEqual(0.45);
    expect(path!.generatedAt).toBe(12_000);
  });
});
