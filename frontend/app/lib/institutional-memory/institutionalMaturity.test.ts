import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "./decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
import { evaluateInstitutionalKnowledgeDistillation } from "./institutionalDistillationEngine";
import { resetInstitutionalDistillationGuards } from "./institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
import { evaluateInstitutionalLearningEvolution } from "./institutionalMaturityEngine";
import {
  beginInstitutionalMaturityEvaluation,
  endInstitutionalMaturityEvaluation,
  resetInstitutionalMaturityGuards,
} from "./institutionalMaturityGuards";
import { resetInstitutionalMaturityStores } from "./institutionalMaturityStore";
import { evaluateInstitutionalCognitiveRecall } from "./institutionalRecallEngine";
import { resetInstitutionalRecallGuards } from "./institutionalRecallGuards";
import { resetInstitutionalRecallStores } from "./institutionalRecallStore";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { resetInstitutionalContinuityGuards } from "./institutionalContinuityGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "./institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "./unifiedInstitutionalMemoryGuards";
import { evaluateInstitutionalExperienceCorrelation } from "./institutionalCorrelationEngine";
import { resetInstitutionalCorrelationGuards } from "./institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "./institutionalCorrelationStore";
import { evaluateInstitutionalMemoryAccumulation } from "./institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "./institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "./institutionalMemoryStore";

function seedFullStack(organizationId: string, cognition: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `full-${i}` };
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: i === 0,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
    evaluateInstitutionalExperienceCorrelation({
      organizationId,
      cognitionSnapshot: snapshot,
      now: 1_000 + i * 800,
    });
    evaluateOrganizationalAdaptationMemory({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
    evaluateInstitutionalDecisionOutcomes({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
    evaluateInstitutionalKnowledgeDistillation({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
    evaluateInstitutionalCognitiveRecall({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
  }
}

function minimalCognition(): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "maturity-org",
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

describe("institutional learning evolution D9:2:7", () => {
  beforeEach(() => {
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
  });

  it("increases maturity when resilience improvement signals are present", () => {
    const cognition = minimalCognition();
    seedFullStack("maturity-org", cognition);

    const result = evaluateInstitutionalLearningEvolution({
      organizationId: "maturity-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.snapshotCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentSnapshots.some(
        (s) =>
          s.evolutionTrend === "improving" ||
          s.evolutionTrend === "accelerating" ||
          s.maturityLevel === "adaptive" ||
          s.maturityLevel === "resilient"
      )
    ).toBe(true);
  });

  it("reduces maturity appropriately under persistent fragility", () => {
    const cognition = { ...minimalCognition(), pressurePosture: "attention" as const };
    seedFullStack("fragility-maturity", cognition);

    const result = evaluateInstitutionalLearningEvolution({
      organizationId: "fragility-maturity",
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_000,
    });

    expect(
      result.snapshot?.recentSnapshots.some(
        (s) =>
          s.category === "fragility" ||
          s.maturityLevel === "reactive" ||
          s.evolutionTrend === "stagnant" ||
          s.evolutionTrend === "regressing"
      )
    ).toBe(true);
  });

  it("dedupes duplicate maturity evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("maturity-org", cognition);

    evaluateInstitutionalLearningEvolution({
      organizationId: "maturity-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalLearningEvolution({
      organizationId: "maturity-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newSnapshots).toBe(0);
  });

  it("remains bounded after many maturity cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-maturity", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalLearningEvolution({
        organizationId: "bounded-maturity",
        cognitionSnapshot: { ...cognition, signature: `mat-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalLearningEvolution({
      organizationId: "bounded-maturity",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.snapshotCount).toBeLessThanOrEqual(20);
    expect(final.snapshot!.learningEvolutions.length).toBeLessThanOrEqual(12);
    expect(final.snapshot!.maturitySignals.length).toBeLessThanOrEqual(16);
  });

  it("blocks recursive maturity evaluation depth", () => {
    expect(beginInstitutionalMaturityEvaluation()).toBe(true);
    expect(beginInstitutionalMaturityEvaluation()).toBe(true);
    expect(beginInstitutionalMaturityEvaluation()).toBe(false);
    endInstitutionalMaturityEvaluation();
    endInstitutionalMaturityEvaluation();
  });
});
