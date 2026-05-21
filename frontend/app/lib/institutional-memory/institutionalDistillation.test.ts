import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "./adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "./decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
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
import { evaluateInstitutionalKnowledgeDistillation } from "./institutionalDistillationEngine";
import {
  beginInstitutionalDistillation,
  endInstitutionalDistillation,
  resetInstitutionalDistillationGuards,
} from "./institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
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
      organizationId: "distill-org",
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

describe("institutional knowledge distillation D9:2:5", () => {
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

  it("distills recurring patterns into executive insights", () => {
    const cognition = minimalCognition();
    seedFullStack("distill-org", cognition);

    const result = evaluateInstitutionalKnowledgeDistillation({
      organizationId: "distill-org",
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.snapshot!.insightCount).toBeGreaterThan(0);
    expect(
      result.snapshot!.recentInsights.some(
        (i) => i.compressionLevel === "distilled" || i.compressionLevel === "strategic_core"
      )
    ).toBe(true);
  });

  it("distills fragility and governance lessons under pressure", () => {
    const cognition = { ...minimalCognition(), pressurePosture: "attention" as const };
    seedFullStack("fragility-distill", cognition);

    const result = evaluateInstitutionalKnowledgeDistillation({
      organizationId: "fragility-distill",
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 35_000,
    });

    expect(
      result.snapshot?.recentInsights.some(
        (i) => i.category === "fragility" || i.category === "governance"
      )
    ).toBe(true);
  });

  it("dedupes duplicate distillation evaluations", () => {
    const cognition = minimalCognition();
    seedFullStack("distill-org", cognition);

    evaluateInstitutionalKnowledgeDistillation({
      organizationId: "distill-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateInstitutionalKnowledgeDistillation({
      organizationId: "distill-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.newInsights).toBe(0);
  });

  it("remains bounded after many distillation cycles", () => {
    const cognition = minimalCognition();
    seedFullStack("bounded-distill", cognition);

    for (let i = 0; i < 50; i += 1) {
      evaluateInstitutionalKnowledgeDistillation({
        organizationId: "bounded-distill",
        cognitionSnapshot: { ...cognition, signature: `dist-${i}` },
        now: 50_000 + i * 500,
      });
    }

    const final = evaluateInstitutionalKnowledgeDistillation({
      organizationId: "bounded-distill",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.snapshot!.insightCount).toBeLessThanOrEqual(24);
    expect(final.snapshot!.artifactCount).toBeLessThanOrEqual(16);
    expect(final.snapshot!.wisdomPatternCount).toBeLessThanOrEqual(12);
  });

  it("blocks recursive distillation evaluation depth", () => {
    expect(beginInstitutionalDistillation()).toBe(true);
    expect(beginInstitutionalDistillation()).toBe(true);
    expect(beginInstitutionalDistillation()).toBe(false);
    endInstitutionalDistillation();
    endInstitutionalDistillation();
  });
});
