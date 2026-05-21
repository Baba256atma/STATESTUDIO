import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalKnowledgeContinuity } from "./institutionalContinuityEngine";
import {
  beginInstitutionalContinuityEvaluation,
  endInstitutionalContinuityEvaluation,
  resetInstitutionalContinuityGuards,
} from "./institutionalContinuityGuards";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { evaluateInstitutionalDecisionOutcomes } from "./decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
import { evaluateInstitutionalKnowledgeDistillation } from "./institutionalDistillationEngine";
import { resetInstitutionalDistillationGuards } from "./institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
import { evaluateInstitutionalLearningEvolution } from "./institutionalMaturityEngine";
import { resetInstitutionalMaturityGuards } from "./institutionalMaturityGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "./institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "./unifiedInstitutionalMemoryGuards";
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
      organizationId: "continuity-org",
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

describe("institutional knowledge continuity D9:2:8", () => {
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

  it("preserves recurring strategic lessons as wisdom artifacts", () => {
    const cognition = minimalCognition();
    seedFullStack("continuity-org", cognition);

    const result = evaluateInstitutionalKnowledgeContinuity({
      organizationId: "continuity-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.artifactCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentArtifacts.some(
        (a) =>
          a.continuityLevel === "persistent" ||
          a.continuityLevel === "institutionalized" ||
          a.continuityLevel === "foundational"
      )
    ).toBe(true);
  });

  it("forms continuity anchors for institutionalized wisdom", () => {
    const cognition = minimalCognition();
    seedFullStack("anchor-org", cognition);

    const result = evaluateInstitutionalKnowledgeContinuity({
      organizationId: "anchor-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 35_000,
    });

    expect(result.snapshot?.knowledgeAnchors.length).toBeGreaterThan(0);
    expect(
      result.snapshot?.recentArtifacts.some((a) => a.category === "resilience" || a.category === "governance")
    ).toBe(true);
  });

  it("dedupes duplicate continuity evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("continuity-org", cognition);

    evaluateInstitutionalKnowledgeContinuity({
      organizationId: "continuity-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalKnowledgeContinuity({
      organizationId: "continuity-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newArtifacts).toBe(0);
  });

  it("remains bounded after many continuity cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-continuity", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalKnowledgeContinuity({
        organizationId: "bounded-continuity",
        cognitionSnapshot: { ...cognition, signature: `cont-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalKnowledgeContinuity({
      organizationId: "bounded-continuity",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.artifactCount).toBeLessThanOrEqual(20);
    expect(final.snapshot!.anchorCount).toBeLessThanOrEqual(12);
    expect(final.snapshot!.continuityRecords.length).toBeLessThanOrEqual(12);
  });

  it("blocks recursive continuity evaluation depth", () => {
    expect(beginInstitutionalContinuityEvaluation()).toBe(true);
    expect(beginInstitutionalContinuityEvaluation()).toBe(true);
    expect(beginInstitutionalContinuityEvaluation()).toBe(false);
    endInstitutionalContinuityEvaluation();
    endInstitutionalContinuityEvaluation();
  });
});
