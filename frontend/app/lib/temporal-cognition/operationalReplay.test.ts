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
import { integrateCausalDependencyWithCognition } from "./integrateCausalDependencyWithCognition";
import {
  beginOperationalReplayEvaluation,
  endOperationalReplayEvaluation,
  resetOperationalReplayGuards,
} from "./operationalReplayGuards";
import { resetOperationalReplayStores, getOperationalReplayStore } from "./operationalReplayStore";
import { evaluateOperationalReplayCognition } from "./operationalReplayEngine";
import { integrateOperationalReplayWithCognition } from "./integrateOperationalReplayWithCognition";
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

function minimalCognition(org = "replay-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedTemporalCausalStack(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `replay-seed-${i}` };
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
  integrateTemporalCognitionWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    now: 5_000,
  });
  integrateCausalDependencyWithCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    now: 6_000,
  });
}

describe("operational replay cognition D9:3:3", () => {
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

  it("reconstructs replay sequences deterministically", () => {
    const org = "replay-deterministic-org";
    const cognition = minimalCognition(org);
    seedTemporalCausalStack(org, cognition);

    const result = evaluateOperationalReplayCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 7_000,
    });

    expect(result.evaluated).toBe(true);
    const replays = getOperationalReplayStore(org).getState().replays;
    expect(replays.length).toBeGreaterThan(0);
    const first = replays[0]!;
    expect(first.replaySequence.length).toBeGreaterThan(0);
    expect(first.confidence).toBeGreaterThanOrEqual(0.45);
  });

  it("orders causal progression steps in replay sequence", () => {
    const org = "replay-order-org";
    const cognition = minimalCognition(org);
    seedTemporalCausalStack(org, cognition);

    evaluateOperationalReplayCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 8_000,
    });

    const escalation = getOperationalReplayStore(org)
      .getState()
      .replays.find((r) => r.replayCategory === "escalation");
    expect(escalation).toBeDefined();
    const seq = escalation!.replaySequence;
    const fragilityIdx = seq.indexOf("fragility_accumulation");
    const escalationIdx = seq.findIndex((s) => s.includes("escalation"));
    if (fragilityIdx >= 0 && escalationIdx >= 0) {
      expect(fragilityIdx).toBeLessThan(escalationIdx);
    }
  });

  it("dedupes duplicate replay evaluations on unchanged signature", () => {
    const org = "replay-dedupe-org";
    const cognition = minimalCognition(org);
    seedTemporalCausalStack(org, cognition);

    const first = integrateOperationalReplayWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 9_000,
    });
    const second = integrateOperationalReplayWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 9_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded replay memory under caps", () => {
    const org = "replay-bounded-org";
    const cognition = minimalCognition(org);
    seedTemporalCausalStack(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateOperationalReplayCognition({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `replay-bounded-${i}` },
        fragilityElevated: i % 2 === 0,
        now: 10_000 + i * 600,
      });
    }

    const state = getOperationalReplayStore(org).getState();
    expect(state.replays.length).toBeLessThanOrEqual(12);
    expect(state.scenarios.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive replay evaluation", () => {
    expect(beginOperationalReplayEvaluation()).toBe(true);
    expect(beginOperationalReplayEvaluation()).toBe(true);
    expect(beginOperationalReplayEvaluation()).toBe(false);
    endOperationalReplayEvaluation();
    endOperationalReplayEvaluation();
  });

  it("emits escalation replay contract fields", () => {
    const org = "replay-contract-org";
    const cognition = minimalCognition(org);
    seedTemporalCausalStack(org, cognition);

    const result = evaluateOperationalReplayCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 11_000,
    });

    expect(result.evaluated).toBe(true);
    const replay = result.snapshot?.recentReplays.find((r) => r.replayCategory === "escalation");
    expect(replay).toBeDefined();
    expect(replay!.replayId.length).toBeGreaterThan(0);
    expect(replay!.replaySequence).toContain("fragility_accumulation");
    expect(replay!.generatedAt).toBe(11_000);
  });
});
