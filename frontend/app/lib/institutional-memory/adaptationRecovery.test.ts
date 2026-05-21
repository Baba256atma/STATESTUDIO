import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import {
  beginAdaptationRecoveryEvaluation,
  endAdaptationRecoveryEvaluation,
  resetAdaptationRecoveryGuards,
} from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalExperienceCorrelation } from "./institutionalCorrelationEngine";
import { resetInstitutionalCorrelationGuards } from "./institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "./institutionalCorrelationStore";
import { evaluateInstitutionalMemoryAccumulation } from "./institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "./institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "./institutionalMemoryStore";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
import { resetInstitutionalDistillationGuards } from "./institutionalDistillationGuards";
import { resetInstitutionalRecallStores } from "./institutionalRecallStore";
import { resetInstitutionalRecallGuards } from "./institutionalRecallGuards";
import { resetInstitutionalMaturityStores } from "./institutionalMaturityStore";
import { resetInstitutionalMaturityGuards } from "./institutionalMaturityGuards";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { resetInstitutionalContinuityGuards } from "./institutionalContinuityGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "./institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "./unifiedInstitutionalMemoryGuards";

function seedLearningStack(organizationId: string, cognition: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `stack-${i}` };
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: i === 0,
      continuityPreserved: true,
      now: 1_000 + i * 700,
    });
    evaluateInstitutionalExperienceCorrelation({
      organizationId,
      cognitionSnapshot: snapshot,
      now: 1_000 + i * 700,
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
      organizationId: "adapt-org",
      institutional: null,
      cognitionConverged: true,
      fragilityElevated: false,
    }),
    pressurePosture: "attention",
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
    cognitiveEvolutionActive: true,
    organizationalEvolutionActive: true,
    resilienceForecastLine: "Resilience trajectory may strengthen",
  };
}

describe("organizational adaptation recovery D9:2:3", () => {
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

  it("forms recovery_cycle after stabilization following escalation", () => {
    const cognition = minimalCognition();
    seedLearningStack("adapt-org", cognition);

    const result = evaluateOrganizationalAdaptationMemory({
      organizationId: "adapt-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      fragilityElevated: false,
      now: 20_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(
      result.snapshot!.recentAdaptations.some(
        (a) => a.adaptationType === "recovery_cycle" || a.adaptationType === "resilience_growth"
      )
    ).toBe(true);
  });

  it("tracks resilience growth when cognitive evolution is active", () => {
    const cognition = minimalCognition();
    seedLearningStack("adapt-org", cognition);

    const result = evaluateOrganizationalAdaptationMemory({
      organizationId: "adapt-org",
      cognitionSnapshot: cognition,
      now: 25_000,
    });

    expect(
      result.snapshot?.recentAdaptations.some((a) => a.adaptationType === "resilience_growth")
    ).toBe(true);
  });

  it("dedupes duplicate adaptation evaluations", () => {
    const cognition = minimalCognition();
    seedLearningStack("adapt-org", cognition);

    evaluateOrganizationalAdaptationMemory({
      organizationId: "adapt-org",
      cognitionSnapshot: cognition,
      now: 30_000,
    });
    const second = evaluateOrganizationalAdaptationMemory({
      organizationId: "adapt-org",
      cognitionSnapshot: cognition,
      now: 30_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newAdaptations).toBe(0);
  });

  it("remains bounded after many adaptation cycles", () => {
    const cognition = minimalCognition();
    seedLearningStack("bounded-adapt", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateOrganizationalAdaptationMemory({
        organizationId: "bounded-adapt",
        cognitionSnapshot: { ...cognition, signature: `adapt-${i}` },
        now: 40_000 + i * 500,
      });
    }

    const final = evaluateOrganizationalAdaptationMemory({
      organizationId: "bounded-adapt",
      cognitionSnapshot: cognition,
      now: 100_000,
    });

    expect(final.snapshot!.adaptationCount).toBeLessThanOrEqual(32);
    expect(final.snapshot!.patternCount).toBeLessThanOrEqual(16);
  });

  it("blocks recursive adaptation evaluation depth", () => {
    expect(beginAdaptationRecoveryEvaluation()).toBe(true);
    expect(beginAdaptationRecoveryEvaluation()).toBe(true);
    expect(beginAdaptationRecoveryEvaluation()).toBe(false);
    endAdaptationRecoveryEvaluation();
    endAdaptationRecoveryEvaluation();
  });
});
