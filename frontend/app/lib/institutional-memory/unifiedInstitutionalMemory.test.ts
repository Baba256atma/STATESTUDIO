import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { resetInstitutionalGovernanceGuards } from "./institutionalGovernanceGuards";
import { resetInstitutionalGovernanceStores } from "./institutionalGovernanceStore";
import { resetInstitutionalContinuityGuards } from "./institutionalContinuityGuards";
import { resetInstitutionalContinuityStores } from "./institutionalContinuityStore";
import { resetInstitutionalMaturityGuards } from "./institutionalMaturityGuards";
import { resetInstitutionalMaturityStores } from "./institutionalMaturityStore";
import { resetInstitutionalRecallGuards } from "./institutionalRecallGuards";
import { resetInstitutionalRecallStores } from "./institutionalRecallStore";
import { resetInstitutionalDistillationGuards } from "./institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "./institutionalDistillationStore";
import { resetDecisionOutcomeGuards } from "./decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "./decisionOutcomeStore";
import { resetAdaptationRecoveryGuards } from "./adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "./adaptationRecoveryStore";
import { resetInstitutionalCorrelationGuards } from "./institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "./institutionalCorrelationStore";
import { resetInstitutionalMemoryGuards } from "./institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "./institutionalMemoryStore";
import { evaluateUnifiedInstitutionalMemory } from "./unifiedInstitutionalMemoryEngine";
import {
  beginUnifiedInstitutionalMemoryEvaluation,
  endUnifiedInstitutionalMemoryEvaluation,
  resetUnifiedInstitutionalMemoryGuards,
} from "./unifiedInstitutionalMemoryGuards";
import { resetUnifiedInstitutionalMemoryStores } from "./unifiedInstitutionalMemoryStore";

function minimalCognition(): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "unified-org",
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

function resetAllInstitutionalStores(): void {
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

describe("unified institutional memory cognition D9:2:10", () => {
  beforeEach(() => {
    resetAllInstitutionalStores();
  });

  it("generates unified enterprise memory snapshots with active subsystems", () => {
    const cognition = minimalCognition();

    for (let i = 0; i < 3; i += 1) {
      evaluateUnifiedInstitutionalMemory({
        organizationId: "unified-org",
        cognitionSnapshot: { ...cognition, signature: `seed-${i}` },
        continuityPreserved: true,
        now: 1_000 + i * 900,
      });
    }

    const result = evaluateUnifiedInstitutionalMemory({
      organizationId: "unified-org",
      cognitionSnapshot: { ...cognition, signature: "unified-final-eval" },
      continuityPreserved: true,
      now: 30_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.integration).not.toBeNull();
    expect(result.snapshot!.activeSubsystems.length).toBeGreaterThan(0);
    expect(result.snapshot!.summary.primaryStrategicLesson.length).toBeGreaterThan(0);
    expect(
      result.snapshot!.runtimeStatus === "stable" ||
        result.snapshot!.runtimeStatus === "recovering" ||
        result.snapshot!.runtimeStatus === "degraded"
    ).toBe(true);
  });

  it("dedupes duplicate unified evaluations", () => {
    const cognition = minimalCognition();

    for (let i = 0; i < 3; i += 1) {
      evaluateUnifiedInstitutionalMemory({
        organizationId: "unified-org",
        cognitionSnapshot: { ...cognition, signature: `dedupe-${i}` },
        now: 1_000 + i * 900,
      });
    }

    evaluateUnifiedInstitutionalMemory({
      organizationId: "unified-org",
      cognitionSnapshot: cognition,
      now: 40_000,
    });
    const second = evaluateUnifiedInstitutionalMemory({
      organizationId: "unified-org",
      cognitionSnapshot: cognition,
      now: 40_500,
    });

    expect(second.skipped).toBe(true);
    expect(second.integration).toBeNull();
  });

  it("remains bounded after many unified cycles", () => {
    const cognition = minimalCognition();

    for (let i = 0; i < 3; i += 1) {
      evaluateUnifiedInstitutionalMemory({
        organizationId: "bounded-unified",
        cognitionSnapshot: { ...cognition, signature: `seed-${i}` },
        now: 1_000 + i * 900,
      });
    }

    for (let i = 0; i < 40; i += 1) {
      evaluateUnifiedInstitutionalMemory({
        organizationId: "bounded-unified",
        cognitionSnapshot: { ...cognition, signature: `cycle-${i}` },
        now: 10_000 + i * 600,
      });
    }

    const final = evaluateUnifiedInstitutionalMemory({
      organizationId: "bounded-unified",
      cognitionSnapshot: cognition,
      now: 120_000,
    });

    expect(final.state?.cognitionHistory.length).toBeLessThanOrEqual(12);
  });

  it("blocks recursive unified evaluation depth", () => {
    expect(beginUnifiedInstitutionalMemoryEvaluation()).toBe(true);
    expect(beginUnifiedInstitutionalMemoryEvaluation()).toBe(true);
    expect(beginUnifiedInstitutionalMemoryEvaluation()).toBe(false);
    endUnifiedInstitutionalMemoryEvaluation();
    endUnifiedInstitutionalMemoryEvaluation();
  });

  it("orchestrates full D9:2 pipeline deterministically", () => {
    const cognition = minimalCognition();

    for (let i = 0; i < 3; i += 1) {
      evaluateUnifiedInstitutionalMemory({
        organizationId: "pipeline-org",
        cognitionSnapshot: { ...cognition, signature: `pipe-${i}` },
        now: 1_000 + i * 900,
      });
    }

    const result = evaluateUnifiedInstitutionalMemory({
      organizationId: "pipeline-org",
      cognitionSnapshot: { ...cognition, signature: "pipeline-final-eval" },
      now: 25_000,
    });

    expect(result.integration?.learningGovernance).toBeDefined();
    expect(result.integration?.knowledgeContinuity).toBeDefined();
    expect(result.integration?.learningEvolution).toBeDefined();
    expect(result.snapshot?.subsystemHealth.length).toBe(9);
  });
});
