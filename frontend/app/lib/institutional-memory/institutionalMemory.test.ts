import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateInstitutionalMemoryAccumulation } from "./institutionalMemoryEngine";
import {
  beginInstitutionalMemoryAccumulation,
  endInstitutionalMemoryAccumulation,
  resetInstitutionalMemoryGuards,
} from "./institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "./institutionalMemoryStore";
import { resetInstitutionalCorrelationStores } from "./institutionalCorrelationStore";
import { resetInstitutionalCorrelationGuards } from "./institutionalCorrelationGuards";
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

function minimalCognitionSnapshot(
  overrides: Partial<AdaptiveGovernanceIntelligenceSnapshot> = {}
): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "test-org",
      institutional: null,
      cognitionConverged: false,
      fragilityElevated: false,
    }),
    pressurePosture: "attention",
    governanceOversightActive: true,
    pressureGovernanceActive: true,
    executiveStabilityActive: true,
    ...overrides,
  };
}

describe("institutional learning memory D9:2:1", () => {
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

  it("accumulates fragility memory under sustained pressure", () => {
    const result = evaluateInstitutionalMemoryAccumulation({
      organizationId: "test-org",
      cognitionSnapshot: minimalCognitionSnapshot(),
      fragilityElevated: true,
      continuityPreserved: true,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.memoryCount).toBeGreaterThan(0);
    expect(result.snapshot!.recentMemories.some((m) => m.category === "fragility")).toBe(true);
  });

  it("dedupes duplicate memory records on repeated evaluation", () => {
    const input = {
      organizationId: "test-org",
      cognitionSnapshot: minimalCognitionSnapshot(),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 1_000,
    };

    evaluateInstitutionalMemoryAccumulation(input);
    const second = evaluateInstitutionalMemoryAccumulation({
      ...input,
      now: 1_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newRecords).toBe(0);
  });

  it("stores resilience recovery events when stability follows pressure", () => {
    const result = evaluateInstitutionalMemoryAccumulation({
      organizationId: "test-org",
      cognitionSnapshot: minimalCognitionSnapshot({
        executiveStabilityActive: true,
        pressurePosture: "attention",
      }),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 5_000,
    });

    expect(
      result.snapshot?.recentMemories.some(
        (m) => m.category === "recovery" || m.category === "resilience"
      )
    ).toBe(true);
  });

  it("remains bounded after many accumulation cycles", () => {
    for (let i = 0; i < 80; i += 1) {
      evaluateInstitutionalMemoryAccumulation({
        organizationId: "bounded-org",
        cognitionSnapshot: minimalCognitionSnapshot({
          signature: `sig-${i}`,
        }),
        fragilityElevated: i % 2 === 0,
        continuityPreserved: true,
        now: 10_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalMemoryAccumulation({
      organizationId: "bounded-org",
      cognitionSnapshot: minimalCognitionSnapshot({ signature: "final" }),
      fragilityElevated: true,
      continuityPreserved: true,
      now: 100_000,
    });

    expect(final.snapshot!.memoryCount).toBeLessThanOrEqual(48);
  });

  it("blocks recursive accumulation depth", () => {
    expect(beginInstitutionalMemoryAccumulation()).toBe(true);
    expect(beginInstitutionalMemoryAccumulation()).toBe(true);
    expect(beginInstitutionalMemoryAccumulation()).toBe(false);
    endInstitutionalMemoryAccumulation();
    endInstitutionalMemoryAccumulation();
  });
});
