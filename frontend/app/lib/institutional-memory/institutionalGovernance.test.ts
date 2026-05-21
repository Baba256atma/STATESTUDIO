import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "./decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
import { evaluateInstitutionalKnowledgeContinuity } from "./institutionalContinuityEngine";
import { resetInstitutionalContinuityGuards } from "./institutionalContinuityGuards";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "./unifiedInstitutionalMemoryGuards";
import { evaluateInstitutionalKnowledgeDistillation } from "./institutionalDistillationEngine";
import { resetInstitutionalDistillationGuards } from "./institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
import { evaluateInstitutionalLearningGovernance } from "./institutionalGovernanceEngine";
import {
  beginInstitutionalGovernanceEvaluation,
  endInstitutionalGovernanceEvaluation,
  resetInstitutionalGovernanceGuards,
} from "./institutionalGovernanceGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { evaluateInstitutionalLearningEvolution } from "./institutionalMaturityEngine";
import { resetInstitutionalMaturityGuards } from "./institutionalMaturityGuards";
import { resetInstitutionalMaturityStores } from "./institutionalMaturityStore";
import { evaluateInstitutionalCognitiveRecall } from "./institutionalRecallEngine";
import { resetInstitutionalRecallGuards } from "./institutionalRecallGuards";
import { resetInstitutionalRecallStores } from "./institutionalRecallStore";
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
    evaluateInstitutionalLearningEvolution({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
    evaluateInstitutionalKnowledgeContinuity({
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
      organizationId: "governance-org",
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

describe("institutional learning governance D9:2:9", () => {
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

  it("validates stable resilience patterns with strong integrity", () => {
    const cognition = minimalCognition();
    seedFullStack("governance-org", cognition);

    const result = evaluateInstitutionalLearningGovernance({
      organizationId: "governance-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.snapshotCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentGovernanceSnapshots.some(
        (s) =>
          s.integrityLevel === "strong" ||
          s.integrityLevel === "verified" ||
          s.governanceStatus === "stable"
      )
    ).toBe(true);
  });

  it("detects governance concerns under contradictory learning signals", () => {
    const cognition = { ...minimalCognition(), pressurePosture: "attention" as const };
    seedFullStack("unstable-governance", cognition);

    const result = evaluateInstitutionalLearningGovernance({
      organizationId: "unstable-governance",
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      continuityPreserved: false,
      now: 35_000,
    });

    expect(result.snapshot).not.toBeNull();
    expect(
      result.snapshot?.governanceStatus === "monitored" ||
        result.snapshot?.governanceStatus === "degraded" ||
        result.snapshot?.integrityLevel === "moderate" ||
        result.snapshot?.integrityLevel === "weak"
    ).toBe(true);
  });

  it("dedupes duplicate governance evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("governance-org", cognition);

    evaluateInstitutionalLearningGovernance({
      organizationId: "governance-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalLearningGovernance({
      organizationId: "governance-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newSnapshots).toBe(0);
  });

  it("remains bounded after many governance cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-governance", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalLearningGovernance({
        organizationId: "bounded-governance",
        cognitionSnapshot: { ...cognition, signature: `gov-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalLearningGovernance({
      organizationId: "bounded-governance",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.snapshotCount).toBeLessThanOrEqual(16);
    expect(final.snapshot!.integritySignals.length).toBeLessThanOrEqual(16);
    expect(final.snapshot!.trustValidationCount).toBeLessThanOrEqual(12);
  });

  it("blocks recursive governance evaluation depth", () => {
    expect(beginInstitutionalGovernanceEvaluation()).toBe(true);
    expect(beginInstitutionalGovernanceEvaluation()).toBe(true);
    expect(beginInstitutionalGovernanceEvaluation()).toBe(false);
    endInstitutionalGovernanceEvaluation();
    endInstitutionalGovernanceEvaluation();
  });
});
