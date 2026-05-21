import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "./decisionOutcomeEngine";
import {
  beginDecisionOutcomeEvaluation,
  endDecisionOutcomeEvaluation,
  resetDecisionOutcomeGuards,
} from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
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
      organizationId: "outcome-org",
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

describe("institutional decision outcome learning D9:2:4", () => {
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

  it("correlates governance stabilization with positive outcomes", () => {
    const cognition = minimalCognition();
    seedFullStack("outcome-org", cognition);

    const result = evaluateInstitutionalDecisionOutcomes({
      organizationId: "outcome-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.outcomeCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentOutcomes.some(
        (o) => o.decisionCategory === "governance" || o.decisionCategory === "resilience"
      )
    ).toBe(true);
  });

  it("tracks cascading escalation consequences", () => {
    const cognition = {
      ...minimalCognition(),
      pressurePosture: "attention" as const,
    };
    seedFullStack("escalation-org", cognition);

    const result = evaluateInstitutionalDecisionOutcomes({
      organizationId: "escalation-org",
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_000,
    });

    expect(
      result.snapshot?.recentOutcomes.some(
        (o) => o.propagationType === "cascading" || o.decisionCategory === "escalation"
      )
    ).toBe(true);
  });

  it("dedupes duplicate outcome evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("outcome-org", cognition);

    evaluateInstitutionalDecisionOutcomes({
      organizationId: "outcome-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalDecisionOutcomes({
      organizationId: "outcome-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newOutcomes).toBe(0);
  });

  it("remains bounded after many outcome cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-outcome", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalDecisionOutcomes({
        organizationId: "bounded-outcome",
        cognitionSnapshot: { ...cognition, signature: `out-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalDecisionOutcomes({
      organizationId: "bounded-outcome",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.outcomeCount).toBeLessThanOrEqual(32);
    expect(final.snapshot!.patternCount).toBeLessThanOrEqual(16);
  });

  it("blocks recursive outcome evaluation depth", () => {
    expect(beginDecisionOutcomeEvaluation()).toBe(true);
    expect(beginDecisionOutcomeEvaluation()).toBe(true);
    expect(beginDecisionOutcomeEvaluation()).toBe(false);
    endDecisionOutcomeEvaluation();
    endDecisionOutcomeEvaluation();
  });
});
