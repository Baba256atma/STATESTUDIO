import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateOrganizationalAdaptationMemory } from "../institutional-memory/adaptationRecoveryEngine";
import { resetAdaptationRecoveryGuards } from "../institutional-memory/adaptationRecoveryGuards";
import { resetAdaptationRecoveryStores } from "../institutional-memory/adaptationRecoveryStore";
import { evaluateInstitutionalDecisionOutcomes } from "../institutional-memory/decisionOutcomeEngine";
import { resetDecisionOutcomeGuards } from "../institutional-memory/decisionOutcomeGuards";
import { resetDecisionOutcomeStores } from "../institutional-memory/decisionOutcomeStore";
import { evaluateInstitutionalKnowledgeDistillation } from "../institutional-memory/institutionalDistillationEngine";
import { resetInstitutionalDistillationGuards } from "../institutional-memory/institutionalDistillationGuards";
import { resetInstitutionalDistillationStores } from "../institutional-memory/institutionalDistillationStore";
import { evaluateInstitutionalLearningEvolution } from "../institutional-memory/institutionalMaturityEngine";
import { resetInstitutionalMaturityGuards } from "../institutional-memory/institutionalMaturityGuards";
import { resetInstitutionalMaturityStores } from "../institutional-memory/institutionalMaturityStore";
import { evaluateInstitutionalKnowledgeContinuity } from "../institutional-memory/institutionalContinuityEngine";
import { resetInstitutionalContinuityStores } from "../institutional-memory/institutionalContinuityStore";
import { resetInstitutionalContinuityGuards } from "../institutional-memory/institutionalContinuityGuards";
import { resetInstitutionalGovernanceStores } from "../institutional-memory/institutionalGovernanceStore";
import { resetInstitutionalGovernanceGuards } from "../institutional-memory/institutionalGovernanceGuards";
import { resetUnifiedInstitutionalMemoryStores } from "../institutional-memory/unifiedInstitutionalMemoryStore";
import { resetUnifiedInstitutionalMemoryGuards } from "../institutional-memory/unifiedInstitutionalMemoryGuards";
import { evaluateInstitutionalCognitiveRecall } from "../institutional-memory/institutionalRecallEngine";
import { resetInstitutionalRecallGuards } from "../institutional-memory/institutionalRecallGuards";
import { resetInstitutionalRecallStores } from "../institutional-memory/institutionalRecallStore";
import { evaluateInstitutionalExperienceCorrelation } from "../institutional-memory/institutionalCorrelationEngine";
import { resetInstitutionalCorrelationGuards } from "../institutional-memory/institutionalCorrelationGuards";
import { resetInstitutionalCorrelationStores } from "../institutional-memory/institutionalCorrelationStore";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { resetInstitutionalMemoryGuards } from "../institutional-memory/institutionalMemoryGuards";
import { resetInstitutionalMemoryStores } from "../institutional-memory/institutionalMemoryStore";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { resetCausalDependencyGuards } from "./causalDependencyGuards";
import { resetCausalDependencyStores } from "./causalDependencyStore";
import { resetMultiTimelineGuards } from "./multiTimelineGuards";
import { resetMultiTimelineStores } from "./multiTimelineStore";
import { resetOperationalReplayGuards } from "./operationalReplayGuards";
import { resetOperationalReplayStores } from "./operationalReplayStore";
import { resetTemporalConvergenceGuards } from "./temporalConvergenceGuards";
import { resetTemporalConvergenceStores } from "./temporalConvergenceStore";
import { resetTemporalCompressionGuards } from "./temporalCompressionGuards";
import { resetTemporalCompressionStores } from "./temporalCompressionStore";
import { resetTemporalDriftProjectionGuards } from "./temporalDriftProjectionGuards";
import { resetTemporalDriftProjectionStores } from "./temporalDriftProjectionStore";
import { resetTemporalCognitionGuards } from "./temporalCognitionGuards";
import { resetTemporalCognitionStores } from "./temporalCognitionStore";
import { resetTemporalMemorySyncGuards } from "./temporalMemorySyncGuards";
import { resetTemporalMemorySyncStores } from "./temporalMemorySyncStore";
import { resetTemporalFieldGuards } from "./temporalFieldGuards";
import { resetTemporalFieldStores } from "./temporalFieldStore";
import {
  beginUnifiedTemporalCognitionEvaluation,
  endUnifiedTemporalCognitionEvaluation,
  resetUnifiedTemporalCognitionGuards,
} from "./unifiedTemporalCognitionGuards";
import {
  getUnifiedTemporalCognitionStore,
  resetUnifiedTemporalCognitionStores,
} from "./unifiedTemporalCognitionStore";
import { evaluateUnifiedTemporalCognition } from "./unifiedTemporalCognitionEngine";
import { resetForesightCognitionGuards } from "../foresight-cognition/foresightCognitionGuards";
import { resetForesightCognitionStores } from "../foresight-cognition/foresightCognitionStore";
import { resetRiskConstellationGuards } from "../foresight-cognition/riskConstellationGuards";
import { resetRiskConstellationStores } from "../foresight-cognition/riskConstellationStore";

function resetInstitutionalStack(): void {
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

function resetTemporalStack(): void {
  resetTemporalCognitionStores();
  resetTemporalCognitionGuards();
  resetCausalDependencyStores();
  resetCausalDependencyGuards();
  resetOperationalReplayStores();
  resetOperationalReplayGuards();
  resetTemporalDriftProjectionStores();
  resetTemporalDriftProjectionGuards();
  resetMultiTimelineStores();
  resetMultiTimelineGuards();
  resetTemporalConvergenceStores();
  resetTemporalConvergenceGuards();
  resetTemporalCompressionStores();
  resetTemporalCompressionGuards();
  resetTemporalMemorySyncStores();
  resetTemporalMemorySyncGuards();
  resetTemporalFieldStores();
  resetTemporalFieldGuards();
  resetUnifiedTemporalCognitionStores();
  resetUnifiedTemporalCognitionGuards();
  resetForesightCognitionStores();
  resetForesightCognitionGuards();
  resetRiskConstellationStores();
  resetRiskConstellationGuards();
}

function minimalCognition(org = "unified-temporal-org"): AdaptiveGovernanceIntelligenceSnapshot {
  return {
    ...resolveAdaptiveGovernanceIntelligence({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: org,
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
    timelineStrategicEvolutionLine: "Strategic evolution persists across operational eras.",
    organizationalLearningLine: "Organizational learning compounds institutionally.",
    resilienceForecastLine: "Resilience trajectory may strengthen across long horizons.",
    timelineInstitutionalContinuityLine: "Institutional continuity anchors adaptation.",
  };
}

function seedFullTemporalRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 3; i += 1) {
    const snapshot = { ...cognition, signature: `unified-temporal-seed-${i}` };
    const now = 1_000 + i * 900;
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: i === 0,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalExperienceCorrelation({
      organizationId,
      cognitionSnapshot: snapshot,
      now,
    });
    evaluateOrganizationalAdaptationMemory({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalDecisionOutcomes({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalKnowledgeDistillation({
      organizationId,
      cognitionSnapshot: snapshot,
      continuityPreserved: true,
      now,
    });
    evaluateInstitutionalCognitiveRecall({
      organizationId,
      cognitionSnapshot: snapshot,
      fragilityElevated: i === 0,
      now,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 4_000,
  });
  evaluateInstitutionalLearningEvolution({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 4_500,
  });
  evaluateInstitutionalKnowledgeContinuity({
    organizationId,
    cognitionSnapshot: cognition,
    continuityPreserved: true,
    now: 4_800,
  });

  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `unified-temporal-layer-${i}` },
      observations: { patternRecurrenceDetected: true },
      fragilityElevated: false,
      continuityPreserved: true,
      now: 5_000 + i * 700,
    });
  }
}

describe("unified enterprise temporal cognition D9:3:10", () => {
  beforeEach(() => {
    resetInstitutionalStack();
    resetTemporalStack();
  });

  it("generates unified enterprise time intelligence snapshots", () => {
    const org = "unified-runtime-org";
    const cognition = minimalCognition(org);
    seedFullTemporalRuntime(org, cognition);

    const result = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 12_000,
    });

    expect(result.evaluated).toBe(true);
    expect(result.snapshot).toBeDefined();
    expect(result.snapshot!.runtimeStatus).not.toBe("initializing");
    expect(result.snapshot!.activeSubsystems.length).toBeGreaterThan(0);
    expect(getUnifiedTemporalCognitionStore(org).getState().snapshots.length).toBeGreaterThan(0);
  });

  it("dedupes duplicate unified evaluations on unchanged signature", () => {
    const org = "unified-dedupe-org";
    const cognition = minimalCognition(org);
    seedFullTemporalRuntime(org, cognition);

    const first = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 13_000,
    });
    const second = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 13_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("suppresses unified snapshot when temporal depth is insufficient", () => {
    const org = "unified-shallow-org";
    const cognition = minimalCognition(org);

    const result = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 14_000,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_temporal_depth");
  });

  it("keeps bounded unified temporal memory under caps", () => {
    const org = "unified-bounded-org";
    const cognition = minimalCognition(org);
    seedFullTemporalRuntime(org, cognition);

    evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 14_500,
    });

    for (let i = 0; i < 18; i += 1) {
      evaluateInstitutionalMemoryAccumulation({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `unified-bounded-${i}` },
        observations: { patternRecurrenceDetected: i % 2 === 0 },
        now: 15_000 + i * 650,
      });
      evaluateUnifiedTemporalCognition({
        organizationId: org,
        cognitionSnapshot: { ...cognition, signature: `unified-bounded-${i}` },
        now: 15_200 + i * 650,
      });
    }

    const state = getUnifiedTemporalCognitionStore(org).getState();
    expect(state.snapshots.length).toBeLessThanOrEqual(10);
    expect(state.evolutionSummaries.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive unified temporal evaluation", () => {
    expect(beginUnifiedTemporalCognitionEvaluation()).toBe(true);
    expect(beginUnifiedTemporalCognitionEvaluation()).toBe(true);
    expect(beginUnifiedTemporalCognitionEvaluation()).toBe(false);
    endUnifiedTemporalCognitionEvaluation();
    endUnifiedTemporalCognitionEvaluation();
  });

  it("emits unified temporal snapshot contract fields", () => {
    const org = "unified-contract-org";
    const cognition = minimalCognition(org);
    seedFullTemporalRuntime(org, cognition);

    const result = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      continuityPreserved: true,
      now: 16_000,
    });

    expect(result.evaluated).toBe(true);
    const snapshot = result.snapshot!;
    expect(snapshot.temporalHealth.length).toBeGreaterThan(0);
    expect(snapshot.summary.dominantTrajectory.length).toBeGreaterThan(0);
    expect(snapshot.summary.longHorizonSignal.length).toBeGreaterThan(0);
    expect(snapshot.subsystemStates.length).toBe(9);
    expect(snapshot.generatedAt).toBe(16_000);
  });

  it("isolates subsystem evaluation without breaking unified orchestration", () => {
    const org = "unified-isolated-org";
    const cognition = minimalCognition(org);
    seedFullTemporalRuntime(org, cognition);

    const result = evaluateUnifiedTemporalCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      now: 17_000,
    });

    expect(result.pipeline).toBeDefined();
    const states = result.snapshot!.subsystemStates;
    expect(states.every((s) => s.subsystemId.length > 0)).toBe(true);
    expect(states.some((s) => s.healthy)).toBe(true);
  });
});
