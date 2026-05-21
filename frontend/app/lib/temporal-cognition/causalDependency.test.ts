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
import {
  beginCausalDependencyEvaluation,
  endCausalDependencyEvaluation,
  resetCausalDependencyGuards,
} from "./causalDependencyGuards";
import { resetCausalDependencyStores, getCausalDependencyStore } from "./causalDependencyStore";
import { evaluateOperationalCausalDependencies } from "./causalDependencyEngine";
import { integrateCausalDependencyWithCognition } from "./integrateCausalDependencyWithCognition";
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

function minimalCognition(org = "causal-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedFullStack(organizationId: string, cognition: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `causal-seed-${i}` };
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
}

describe("operational causal dependency D9:3:2", () => {
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

  it("forms causal chains deterministically from temporal chronology", () => {
    const org = "deterministic-causal-org";
    const cognition = minimalCognition(org);
    seedFullStack(org, cognition);

    const result = evaluateOperationalCausalDependencies({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 6_000,
    });

    expect(result.evaluated).toBe(true);
    const chains = getCausalDependencyStore(org).getState().chains;
    expect(chains.length).toBeGreaterThan(0);
    const first = chains[0]!;
    expect(first.causalChainId.length).toBeGreaterThan(0);
    expect(first.chain.length).toBeGreaterThan(0);
    expect(first.confidence).toBeGreaterThanOrEqual(0.45);
  });

  it("dedupes duplicate causal evaluations on unchanged signature", () => {
    const org = "causal-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullStack(org, cognition);

    const first = integrateCausalDependencyWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 7_000,
    });
    const second = integrateCausalDependencyWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 7_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("merges repeated causal chains by id", () => {
    const org = "merge-causal-org";
    const cognition = minimalCognition(org);
    seedFullStack(org, cognition);

    evaluateOperationalCausalDependencies({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 8_000,
    });
    const countAfterFirst = getCausalDependencyStore(org).getState().chains.length;

    evaluateOperationalCausalDependencies({
      organizationId: org,
      cognitionSnapshot: { ...cognition, signature: "merge-causal-2" },
      fragilityElevated: true,
      now: 9_000,
    });
    const state = getCausalDependencyStore(org).getState();
    expect(state.chains.length).toBeGreaterThan(0);
    expect(state.chains.length).toBeLessThanOrEqual(14);
    const escalations = state.chains.filter((c) => c.category === "escalation");
    if (escalations.length > 0 && countAfterFirst > 0) {
      expect(escalations[0]!.occurrenceCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps bounded memory under caps", () => {
    const org = "bounded-causal-org";
    const cognition = minimalCognition(org);
    seedFullStack(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateOperationalCausalDependencies({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `bounded-causal-${i}` },
        fragilityElevated: i % 2 === 0,
        now: 10_000 + i * 600,
      });
    }

    const state = getCausalDependencyStore(org).getState();
    expect(state.chains.length).toBeLessThanOrEqual(14);
    expect(state.links.length).toBeLessThanOrEqual(24);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive dependency evaluation", () => {
    expect(beginCausalDependencyEvaluation()).toBe(true);
    expect(beginCausalDependencyEvaluation()).toBe(true);
    expect(beginCausalDependencyEvaluation()).toBe(false);
    endCausalDependencyEvaluation();
    endCausalDependencyEvaluation();
  });

  it("emits cascading fragility-to-escalation contract fields", () => {
    const org = "escalation-causal-org";
    const cognition = minimalCognition(org);
    seedFullStack(org, cognition);

    const result = evaluateOperationalCausalDependencies({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 11_000,
    });

    expect(result.evaluated).toBe(true);
    const chain = result.snapshot?.recentChains.find(
      (c) => c.propagationType === "cascading" || c.category === "escalation"
    );
    expect(chain).toBeDefined();
    expect(chain!.dependencyStrength).toMatch(/weak|moderate|strong|systemic/);
    expect(chain!.chain).toContain("fragility_accumulation");
    expect(chain!.generatedAt).toBe(11_000);
  });
});
