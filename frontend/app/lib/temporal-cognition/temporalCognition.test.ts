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
import { resetInstitutionalMaturityStores } from "../institutional-memory/institutionalMaturityStore";
import { resetInstitutionalMaturityGuards } from "../institutional-memory/institutionalMaturityGuards";
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
import { resetOperationalReplayGuards } from "./operationalReplayGuards";
import { resetOperationalReplayStores } from "./operationalReplayStore";
import { resetMultiTimelineGuards } from "./multiTimelineGuards";
import { resetMultiTimelineStores } from "./multiTimelineStore";
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
import { resetTemporalDriftProjectionGuards } from "./temporalDriftProjectionGuards";
import { resetTemporalDriftProjectionStores } from "./temporalDriftProjectionStore";
import {
  beginTemporalCognitionEvaluation,
  endTemporalCognitionEvaluation,
  resetTemporalCognitionGuards,
} from "./temporalCognitionGuards";
import { resetTemporalCognitionStores, getTemporalCognitionStore } from "./temporalCognitionStore";
import { evaluateEnterpriseTemporalCognition } from "./temporalCognitionEngine";
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

function minimalCognition(org = "temporal-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedInstitutionalStack(organizationId: string, cognition: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `temporal-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: i === 0,
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
      fragilityElevated: i === 0,
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
}

describe("enterprise temporal cognition D9:3:1", () => {
  beforeEach(() => {
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
  });

  it("orders timeline events chronologically", () => {
    const org = "chrono-org";
    const cognition = minimalCognition(org);
    seedInstitutionalStack(org, cognition);

    const result = evaluateEnterpriseTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 5_000,
    });

    expect(result.evaluated).toBe(true);
    const events = getTemporalCognitionStore(org).getState().events;
    expect(events.length).toBeGreaterThan(1);
    for (let i = 1; i < events.length; i += 1) {
      expect(events[i]!.observedAt).toBeGreaterThanOrEqual(events[i - 1]!.observedAt);
    }
  });

  it("classifies recurring and cyclical patterns when degradation repeats", () => {
    const org = "cycle-org";
    const cognition = minimalCognition(org);
    seedInstitutionalStack(org, cognition);

    for (let i = 0; i < 4; i += 1) {
      evaluateInstitutionalMemoryAccumulation({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `cycle-${i}` },
        observations: { patternRecurrenceDetected: true },
        fragilityElevated: true,
        now: 6_000 + i * 200,
      });
    }

    const result = evaluateEnterpriseTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 8_000,
    });

    expect(result.evaluated).toBe(true);
    const sequences = getTemporalCognitionStore(org).getState().sequences;
    const hasCyclic = sequences.some(
      (s) => s.sequenceType === "cyclical" || s.sequenceType === "recurring" || s.sequenceType === "cascading"
    );
    expect(hasCyclic).toBe(true);
  });

  it("dedupes duplicate timeline evaluations on unchanged signature", () => {
    const org = "dedupe-org";
    const cognition = minimalCognition(org);
    seedInstitutionalStack(org, cognition);

    const first = integrateTemporalCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 10_000,
    });
    const second = integrateTemporalCognitionWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 10_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded memory under sequence and event caps", () => {
    const org = "bounded-org";
    const cognition = minimalCognition(org);
    seedInstitutionalStack(org, cognition);

    for (let i = 0; i < 24; i += 1) {
      evaluateEnterpriseTemporalCognition({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `bounded-${i}` },
        fragilityElevated: i % 2 === 0,
        now: 20_000 + i * 600,
      });
    }

    const state = getTemporalCognitionStore(org).getState();
    expect(state.sequences.length).toBeLessThanOrEqual(16);
    expect(state.events.length).toBeLessThanOrEqual(32);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive timeline evaluation", () => {
    expect(beginTemporalCognitionEvaluation()).toBe(true);
    expect(beginTemporalCognitionEvaluation()).toBe(true);
    expect(beginTemporalCognitionEvaluation()).toBe(false);
    endTemporalCognitionEvaluation();
    endTemporalCognitionEvaluation();
  });

  it("produces cascading escalation chronology contract fields", () => {
    const org = "escalation-org";
    const cognition = {
      ...minimalCognition(org),
      pressurePosture: "attention" as const,
    };
    seedInstitutionalStack(org, cognition);

    const result = evaluateEnterpriseTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 12_000,
    });

    expect(result.evaluated).toBe(true);
    const sequence = result.snapshot?.recentSequences.find((s) => s.category === "escalation");
    expect(sequence).toBeDefined();
    expect(sequence!.timelineId.length).toBeGreaterThan(0);
    expect(sequence!.events.length).toBeGreaterThan(0);
    expect(sequence!.confidence).toBeGreaterThanOrEqual(0.45);
    expect(sequence!.generatedAt).toBe(12_000);
  });
});
