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
import { resetInstitutionalMaturityStores } from "./institutionalMaturityStore";
import { resetInstitutionalMaturityGuards } from "./institutionalMaturityGuards";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { resetInstitutionalContinuityGuards } from "./institutionalContinuityGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "./institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "./unifiedInstitutionalMemoryGuards";
import { evaluateInstitutionalCognitiveRecall } from "./institutionalRecallEngine";
import {
  beginInstitutionalRecall,
  endInstitutionalRecall,
  resetInstitutionalRecallGuards,
} from "./institutionalRecallGuards";
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
      organizationId: "recall-org",
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

describe("institutional cognitive recall D9:2:6", () => {
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

  it("matches similar operational patterns to historical context", () => {
    const cognition = minimalCognition();
    seedFullStack("recall-org", cognition);

    const result = evaluateInstitutionalCognitiveRecall({
      organizationId: "recall-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.recallCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentRecalls.some(
        (r) => r.similarityLevel === "strong" || r.similarityLevel === "highly_similar"
      )
    ).toBe(true);
  });

  it("reconstructs fragility and governance historical context under pressure", () => {
    const cognition = { ...minimalCognition(), pressurePosture: "attention" as const };
    seedFullStack("fragility-recall", cognition);

    const result = evaluateInstitutionalCognitiveRecall({
      organizationId: "fragility-recall",
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_000,
    });

    expect(
      result.snapshot?.recentRecalls.some(
        (r) => r.category === "fragility" || r.category === "governance"
      )
    ).toBe(true);
    expect(result.snapshot?.reconstructions.length).toBeGreaterThan(0);
  });

  it("dedupes duplicate recall evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("recall-org", cognition);

    evaluateInstitutionalCognitiveRecall({
      organizationId: "recall-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalCognitiveRecall({
      organizationId: "recall-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newRecalls).toBe(0);
  });

  it("remains bounded after many recall cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-recall", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalCognitiveRecall({
        organizationId: "bounded-recall",
        cognitionSnapshot: { ...cognition, signature: `rec-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalCognitiveRecall({
      organizationId: "bounded-recall",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.recallCount).toBeLessThanOrEqual(24);
    expect(final.snapshot!.contextFrameCount).toBeLessThanOrEqual(12);
    expect(final.snapshot!.reconstructionCount).toBeLessThanOrEqual(12);
  });

  it("blocks recursive recall evaluation depth", () => {
    expect(beginInstitutionalRecall()).toBe(true);
    expect(beginInstitutionalRecall()).toBe(true);
    expect(beginInstitutionalRecall()).toBe(false);
    endInstitutionalRecall();
    endInstitutionalRecall();
  });
});
