import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateInstitutionalExperienceCorrelation } from "./institutionalCorrelationEngine";
import {
  beginInstitutionalCorrelationEvaluation,
  endInstitutionalCorrelationEvaluation,
  resetInstitutionalCorrelationGuards,
} from "./institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "./institutionalCorrelationStore";
import { evaluateInstitutionalMemoryAccumulation } from "./institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "./institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "./institutionalMemoryStore";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
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

function seedMemory(organizationId: string, snapshot: AdaptiveGovernanceIntelligenceSnapshot) {
  for (let i = 0; i < 3; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...snapshot, signature: `mem-sig-${i}` },
      fragilityElevated: true,
      continuityPreserved: true,
      now: 1_000 + i * 600,
    });
  }
}

function minimalCognitionSnapshot(): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "corr-org",
      institutional: null,
      cognitionConverged: false,
      fragilityElevated: false,
    }),
    pressurePosture: "attention",
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
  };
}

describe("institutional experience correlation D9:2:2", () => {
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

  it("correlates fragility and escalation into escalation_chain", () => {
    const cognition = minimalCognitionSnapshot();
    seedMemory("corr-org", cognition);

    const result = evaluateInstitutionalExperienceCorrelation({
      organizationId: "corr-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 10_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(
      result.snapshot!.strongCorrelations.some((c) => c.category === "escalation_chain") ||
        result.snapshot!.consolidatedPatterns.some((p) => p.category === "escalation_chain")
    ).toBe(true);
  });

  it("dedupes duplicate correlation evaluations", () => {
    const cognition = minimalCognitionSnapshot();
    seedMemory("corr-org", cognition);

    evaluateInstitutionalExperienceCorrelation({
      organizationId: "corr-org",
      cognitionSnapshot: cognition,
      now: 20_000,
    });
    const second = evaluateInstitutionalExperienceCorrelation({
      organizationId: "corr-org",
      cognitionSnapshot: cognition,
      now: 20_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newCorrelations).toBe(0);
  });

  it("skips correlation when insufficient memory depth", () => {
    const result = evaluateInstitutionalExperienceCorrelation({
      organizationId: "empty-org",
      cognitionSnapshot: minimalCognitionSnapshot(),
      now: 1_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_memory_depth");
  });

  it("remains bounded after many correlation cycles", () => {
    const cognition = minimalCognitionSnapshot();
    seedMemory("bounded-corr", cognition);

    for (let i = 0; i < 60; i += 1) {
      evaluateInstitutionalExperienceCorrelation({
        organizationId: "bounded-corr",
        cognitionSnapshot: { ...cognition, signature: `corr-${i}` },
        now: 30_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalExperienceCorrelation({
      organizationId: "bounded-corr",
      cognitionSnapshot: cognition,
      now: 100_000,
    });

    expect(final.snapshot!.correlationCount).toBeLessThanOrEqual(32);
    expect(final.snapshot!.patternCount).toBeLessThanOrEqual(16);
  });

  it("blocks recursive correlation evaluation depth", () => {
    expect(beginInstitutionalCorrelationEvaluation()).toBe(true);
    expect(beginInstitutionalCorrelationEvaluation()).toBe(true);
    expect(beginInstitutionalCorrelationEvaluation()).toBe(false);
    endInstitutionalCorrelationEvaluation();
    endInstitutionalCorrelationEvaluation();
  });
});
