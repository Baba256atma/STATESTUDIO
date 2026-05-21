import { describe, expect, it, beforeEach } from "vitest";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { resolveAdaptiveGovernanceIntelligence } from "../enterprise/governance/resolveAdaptiveGovernanceIntelligence";
import { evaluateUnifiedExecutiveDecisionRuntime } from "../decision-orchestration/unifiedDecisionRuntimeEngine";
import { evaluateStrategicStabilityOptimization } from "../decision-orchestration/stabilityOptimizationEngine";
import { evaluateStrategicInterventionProjection } from "../decision-orchestration/interventionProjectionEngine";
import { evaluateInstitutionalAlignmentIntelligence } from "../decision-orchestration/institutionalAlignmentEngine";
import { evaluateExecutiveDecisionConfidence } from "../decision-orchestration/decisionConfidenceEngine";
import { evaluateAdaptiveDecisionSequencing } from "../decision-orchestration/adaptiveSequencingEngine";
import { evaluateExecutiveScenarioCoordination } from "../decision-orchestration/scenarioCoordinationEngine";
import { evaluateStrategicPriorityArbitration } from "../decision-orchestration/priorityArbitrationEngine";
import { evaluateStrategicActionDependencies } from "../decision-orchestration/actionDependencyEngine";
import { evaluateExecutiveDecisionOrchestration } from "../decision-orchestration/decisionOrchestrationEngine";
import { selectLatestAdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { evaluateUnifiedExecutiveForesightRuntime } from "../foresight-cognition/unifiedForesightRuntimeEngine";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { evaluateUnifiedTemporalCognition } from "../temporal-cognition/unifiedTemporalCognitionEngine";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateUnifiedInstitutionalMemory } from "../institutional-memory/unifiedInstitutionalMemoryEngine";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { evaluateInstitutionalMemoryAccumulation } from "../institutional-memory/institutionalMemoryEngine";
import { evaluateExecutiveMetaCognition } from "./metaCognitionEngine";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { resetMetaCognitionGuards } from "./metaCognitionGuards";
import { resetMetaCognitionStores } from "./metaCognitionStore";
import { resetReasoningIntegrityGuards } from "./reasoningIntegrityGuards";
import { resetReasoningIntegrityStores } from "./reasoningIntegrityStore";
import { evaluateStrategicReasoningIntegrity } from "./reasoningIntegrityEngine";
import { selectLatestStrategicReasoningIntegritySnapshot } from "./reasoningIntegritySelectors";
import { resetCognitiveDriftGuards } from "./cognitiveDriftGuards";
import { resetCognitiveDriftStores } from "./cognitiveDriftStore";
import { evaluateExecutiveCognitiveDrift } from "./cognitiveDriftEngine";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftSelectors";
import { resetCognitiveUncertaintyGuards } from "./cognitiveUncertaintyGuards";
import { resetCognitiveUncertaintyStores } from "./cognitiveUncertaintyStore";
import { evaluateExecutiveCognitiveUncertainty } from "./cognitiveUncertaintyEngine";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintySelectors";
import {
  beginExplainabilityEvaluation,
  endExplainabilityEvaluation,
  resetExplainabilityGuards,
} from "./explainabilityGuards";
import { getExplainabilityStore, resetExplainabilityStores } from "./explainabilityStore";
import { evaluateExecutiveExplainability } from "./explainabilityEngine";
import { integrateExplainabilityWithCognition } from "./integrateExplainabilityWithCognition";
import { resetTrustCalibrationGuards } from "./trustCalibrationGuards";
import { resetTrustCalibrationStores } from "./trustCalibrationStore";
import { resetCognitiveResilienceGuards } from "./cognitiveResilienceGuards";
import { resetCognitiveResilienceStores } from "./cognitiveResilienceStore";
import { resetCognitiveAdaptationGuards } from "./cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "./cognitiveAdaptationStore";
import { resetCognitiveGovernanceGuards } from "./cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "./cognitiveGovernanceStore";
import { resetUnifiedMetaCognitionGuards } from "./unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "./unifiedMetaCognitionStore";

function resetExplainabilityTestStacks(): void {
  resetMetaCognitionStores();
  resetMetaCognitionGuards();
  resetReasoningIntegrityStores();
  resetReasoningIntegrityGuards();
  resetCognitiveDriftStores();
  resetCognitiveDriftGuards();
  resetCognitiveUncertaintyStores();
  resetCognitiveUncertaintyGuards();
  resetExplainabilityStores();
  resetExplainabilityGuards();
  resetTrustCalibrationStores();
  resetTrustCalibrationGuards();
  resetCognitiveResilienceStores();
  resetCognitiveResilienceGuards();
  resetCognitiveAdaptationStores();
  resetCognitiveAdaptationGuards();
  resetCognitiveGovernanceStores();
  resetCognitiveGovernanceGuards();
  resetUnifiedMetaCognitionStores();
  resetUnifiedMetaCognitionGuards();
}

function minimalCognition(org = "explainability-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
      fragilityElevated: true,
    }),
    pressurePosture: "attention",
    timelineStrategicEvolutionLine:
      "Strategic evolution shift shows governance delay growth under rising operational load.",
    organizationalLearningLine:
      "Organizational learning detects coordination strain and recurring governance instability under intensified pressure.",
    resilienceForecastLine:
      "Resilience trajectory may strengthen with intervention before fatigue accumulates.",
  };
}

function seedExplainabilityRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `ex-seed-${i}` },
      observations: { patternRecurrenceDetected: true, pressureTopologyStressed: true },
      fragilityElevated: true,
      continuityPreserved: true,
      now: 1_000 + i * 800,
    });
  }
  evaluateUnifiedInstitutionalMemory({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 5_000,
  });
  evaluateUnifiedTemporalCognition({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    now: 12_000,
  });
  evaluateUnifiedExecutiveForesightRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    pressureTopologyStressed: true,
    now: 19_000,
  });
  evaluateExecutiveDecisionOrchestration({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 19_500,
  });
  evaluateStrategicActionDependencies({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 20_000,
  });
  evaluateStrategicPriorityArbitration({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 20_500,
  });
  evaluateExecutiveScenarioCoordination({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 21_000,
  });
  evaluateAdaptiveDecisionSequencing({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 21_500,
  });
  evaluateExecutiveDecisionConfidence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 22_000,
  });
  evaluateInstitutionalAlignmentIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 23_500,
  });
  evaluateStrategicInterventionProjection({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 24_000,
  });
  evaluateStrategicStabilityOptimization({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    pressureTopologyStressed: true,
    now: 25_000,
  });
  evaluateUnifiedExecutiveDecisionRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    fragilityElevated: true,
    continuityPreserved: true,
    pressureTopologyStressed: true,
    now: 31_000,
  });
  evaluateExecutiveMetaCognition({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 32_000,
  });
  evaluateStrategicReasoningIntegrity({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 38_000,
  });
  evaluateExecutiveCognitiveDrift({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 45_000,
  });
  evaluateExecutiveCognitiveUncertainty({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 52_000,
  });
}

function explainabilityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateExecutiveExplainability>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(org),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(org),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(org),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(org),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("executive explainability D9:6:5", () => {
  beforeEach(() => {
    resetExplainabilityTestStacks();
  });

  it("forms explainability traces when uncertainty awareness is present", () => {
    const org = "ex-verify-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    const result = evaluateExecutiveExplainability(explainabilityEvalInput(org, cognition, 58_000));

    expect(result.evaluated).toBe(true);
    expect(getExplainabilityStore(org).getState().reasoningTraces.length).toBeGreaterThan(0);
    expect(result.snapshot?.traceCount).toBeGreaterThan(0);
  });

  it("traces governance stabilization from runtime evidence", () => {
    const org = "ex-governance-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    const foresight = selectLatestEnterpriseAnticipatorySnapshot(org);
    const memory = selectLatestEnterpriseMemorySnapshot(org);
    const decision = selectLatestEnterpriseStrategicActionSnapshot(org);

    const result = evaluateExecutiveExplainability(
      explainabilityEvalInput(org, cognition, 59_000, {
        foresightSnapshot: foresight
          ? {
              ...foresight,
              summary: {
                ...foresight.summary,
                dominantRisk: "escalation propagation is intensifying across systems",
                earlyWarningState: "intensifying",
                preparednessState: "weak readiness posture",
              },
              executiveAnticipatoryIntelligence: {
                ...foresight.executiveAnticipatoryIntelligence,
                interventionReadiness: "intervention timing window is narrowing",
              },
            }
          : null,
        memorySnapshot: memory
          ? { ...memory, institutionalHealth: "moderate" }
          : null,
        decisionSnapshot: decision
          ? {
              ...decision,
              summary: {
                ...decision.summary,
                stabilizationFocus: "governance stabilization priority",
                dominantPriority: "governance stabilization",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getExplainabilityStore(org).getState().reasoningTraces.some(
        (t) =>
          t.explanationCategory === "governance_alignment" &&
          t.summary.includes("Governance stabilization was prioritized")
      )
    ).toBe(true);
  });

  it("surfaces uncertainty factors in confidence explanation traces", () => {
    const org = "ex-confidence-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    const confidence = selectLatestConfidenceArbitrationSnapshot(org);
    const uncertainty = selectLatestExecutiveCognitiveUncertaintySnapshot(org);

    const result = evaluateExecutiveExplainability(
      explainabilityEvalInput(org, cognition, 60_000, {
        confidenceSnapshot: confidence
          ? {
              ...confidence,
              coordinationSummary: {
                ...confidence.coordinationSummary,
                certaintyPosture: "low" as const,
                dominantCertaintyState: "uncertain" as const,
              },
            }
          : null,
        cognitiveUncertaintySnapshot: uncertainty
          ? {
              ...uncertainty,
              recentAmbiguityObservations: [
                ...uncertainty.recentAmbiguityObservations,
                {
                  ambiguityId: "ex-partial-visibility",
                  cautionPosture: "moderated" as const,
                  uncertaintySeverity: "elevated" as const,
                  ambiguityCategory: "operational_visibility_gap" as const,
                  summary: "Operational visibility remains partial.",
                  knownSignals: Object.freeze(["escalation_risk_signal"]),
                  unknownZones: Object.freeze(["partial_operational_visibility"]),
                  cautionRisks: Object.freeze([]),
                  confidence: 0.8,
                  generatedAt: 60_000,
                  lastObservedAt: 60_000,
                  occurrenceCount: 1,
                },
              ],
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getExplainabilityStore(org).getState().reasoningTraces.some(
        (t) =>
          t.explanationCategory === "confidence_arbitration" &&
          t.uncertaintyFactors.some((f) => f.includes("visibility"))
      )
    ).toBe(true);
  });

  it("dedupes duplicate explainability evaluations on unchanged signature", () => {
    const org = "ex-dedupe-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    const first = integrateExplainabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 61_000,
    });
    const second = integrateExplainabilityWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 61_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded explainability memory under caps", () => {
    const org = "ex-bounded-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateExecutiveExplainability(
        explainabilityEvalInput(org, { ...cognition, signature: `ex-bounded-${i}` }, 62_000 + i * 600)
      );
    }

    const state = getExplainabilityStore(org).getState();
    expect(state.reasoningTraces.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive explainability evaluation", () => {
    expect(beginExplainabilityEvaluation()).toBe(true);
    expect(beginExplainabilityEvaluation()).toBe(true);
    expect(beginExplainabilityEvaluation()).toBe(false);
    endExplainabilityEvaluation();
    endExplainabilityEvaluation();
  });

  it("emits explainability contract fields", () => {
    const org = "ex-contract-org";
    const cognition = minimalCognition(org);
    seedExplainabilityRuntime(org, cognition);

    const result = evaluateExecutiveExplainability(explainabilityEvalInput(org, cognition, 63_000));

    expect(result.evaluated).toBe(true);
    const trace = result.snapshot?.recentReasoningTraces[0];
    expect(trace).toBeDefined();
    expect(trace!.explainabilityId.length).toBeGreaterThan(0);
    expect(trace!.transparencyState.length).toBeGreaterThan(0);
    expect(trace!.explanationStrength.length).toBeGreaterThan(0);
    expect(trace!.reasoningPathways.length).toBeGreaterThan(0);
    expect(trace!.uncertaintyFactors).toBeDefined();
    expect(trace!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(trace!.generatedAt).toBe(63_000);
  });
});
