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
import { evaluateExecutiveMetaCognition } from "../meta-cognition/metaCognitionEngine";
import { selectLatestMetaCognitionRuntimeSnapshot } from "../meta-cognition/metaCognitionSelectors";
import { resetMetaCognitionGuards } from "../meta-cognition/metaCognitionGuards";
import { resetMetaCognitionStores } from "../meta-cognition/metaCognitionStore";
import { resetReasoningIntegrityGuards } from "../meta-cognition/reasoningIntegrityGuards";
import { resetReasoningIntegrityStores } from "../meta-cognition/reasoningIntegrityStore";
import { evaluateStrategicReasoningIntegrity } from "../meta-cognition/reasoningIntegrityEngine";
import { selectLatestStrategicReasoningIntegritySnapshot } from "../meta-cognition/reasoningIntegritySelectors";
import { resetCognitiveDriftGuards } from "../meta-cognition/cognitiveDriftGuards";
import { resetCognitiveDriftStores } from "../meta-cognition/cognitiveDriftStore";
import { evaluateExecutiveCognitiveDrift } from "../meta-cognition/cognitiveDriftEngine";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "../meta-cognition/cognitiveDriftSelectors";
import { resetCognitiveUncertaintyGuards } from "../meta-cognition/cognitiveUncertaintyGuards";
import { resetCognitiveUncertaintyStores } from "../meta-cognition/cognitiveUncertaintyStore";
import { evaluateExecutiveCognitiveUncertainty } from "../meta-cognition/cognitiveUncertaintyEngine";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "../meta-cognition/cognitiveUncertaintySelectors";
import { resetExplainabilityGuards } from "../meta-cognition/explainabilityGuards";
import { resetExplainabilityStores } from "../meta-cognition/explainabilityStore";
import { evaluateExecutiveExplainability } from "../meta-cognition/explainabilityEngine";
import { selectLatestStrategicExplanationSnapshot } from "../meta-cognition/explainabilitySelectors";
import { resetTrustCalibrationGuards } from "../meta-cognition/trustCalibrationGuards";
import { resetTrustCalibrationStores } from "../meta-cognition/trustCalibrationStore";
import { evaluateExecutiveTrustCalibration } from "../meta-cognition/trustCalibrationEngine";
import { selectLatestExecutiveTrustCalibrationSnapshot } from "../meta-cognition/trustCalibrationSelectors";
import { resetCognitiveResilienceGuards } from "../meta-cognition/cognitiveResilienceGuards";
import { resetCognitiveResilienceStores } from "../meta-cognition/cognitiveResilienceStore";
import { evaluateExecutiveCognitiveResilience } from "../meta-cognition/cognitiveResilienceEngine";
import { selectLatestExecutiveCognitiveResilienceSnapshot } from "../meta-cognition/cognitiveResilienceSelectors";
import { resetCognitiveAdaptationGuards } from "../meta-cognition/cognitiveAdaptationGuards";
import { resetCognitiveAdaptationStores } from "../meta-cognition/cognitiveAdaptationStore";
import { evaluateExecutiveCognitiveAdaptation } from "../meta-cognition/cognitiveAdaptationEngine";
import { selectLatestExecutiveCognitiveAdaptationSnapshot } from "../meta-cognition/cognitiveAdaptationSelectors";
import { resetCognitiveGovernanceGuards } from "../meta-cognition/cognitiveGovernanceGuards";
import { resetCognitiveGovernanceStores } from "../meta-cognition/cognitiveGovernanceStore";
import { evaluateExecutiveCognitiveGovernance } from "../meta-cognition/cognitiveGovernanceEngine";
import { selectLatestExecutiveCognitiveGovernanceSnapshot } from "../meta-cognition/cognitiveGovernanceSelectors";
import { resetUnifiedMetaCognitionGuards } from "../meta-cognition/unifiedMetaCognitionGuards";
import { resetUnifiedMetaCognitionStores } from "../meta-cognition/unifiedMetaCognitionStore";
import { evaluateUnifiedExecutiveMetaCognitionRuntime } from "../meta-cognition/unifiedMetaCognitionEngine";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { resetConsensusIntelligenceGuards } from "./consensusIntelligenceGuards";
import { resetConsensusIntelligenceStores } from "./consensusIntelligenceStore";
import { evaluateExecutiveConsensusIntelligence } from "./consensusIntelligenceEngine";
import { selectLatestStrategicConsensusSnapshot } from "./consensusIntelligenceSelectors";
import { evaluateStrategicPerspectiveNegotiation } from "./perspectiveNegotiationEngine";
import { resetPerspectiveNegotiationGuards } from "./perspectiveNegotiationGuards";
import { resetPerspectiveNegotiationStores } from "./perspectiveNegotiationStore";
import { selectLatestEnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationSelectors";
import { evaluateStrategicPerspectiveWeighting } from "./perspectiveWeightingEngine";
import { resetPerspectiveWeightingGuards } from "./perspectiveWeightingGuards";
import { resetPerspectiveWeightingStores } from "./perspectiveWeightingStore";
import { selectLatestEnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingSelectors";
import { evaluateDistributedExecutiveAdvisory } from "./distributedAdvisoryEngine";
import { resetDistributedAdvisoryGuards } from "./distributedAdvisoryGuards";
import { resetDistributedAdvisoryStores } from "./distributedAdvisoryStore";
import { selectLatestCollectiveStrategicGuidanceSnapshot } from "./distributedAdvisorySelectors";
import { evaluateExecutiveStrategicDebate } from "./strategicDebateEngine";
import { resetStrategicDebateGuards } from "./strategicDebateGuards";
import { resetStrategicDebateStores } from "./strategicDebateStore";
import { selectLatestCounterfactualReasoningSnapshot } from "./strategicDebateSelectors";
import {
  beginDiversityPreservationEvaluation,
  endDiversityPreservationEvaluation,
  resetDiversityPreservationGuards,
} from "./diversityPreservationGuards";
import {
  getDiversityPreservationStore,
  resetDiversityPreservationStores,
} from "./diversityPreservationStore";
import { evaluateStrategicDiversityPreservation } from "./diversityPreservationEngine";
import { integrateDiversityPreservationWithCognition } from "./integrateDiversityPreservationWithCognition";
import { selectLatestStrategicDiversitySnapshot } from "./diversityPreservationSelectors";
import { resetCollectiveLearningGuards } from "./collectiveLearningGuards";
import { resetCollectiveLearningStores } from "./collectiveLearningStore";
import { resetDistributedMemorySyncGuards } from "./distributedMemorySyncGuards";
import { resetDistributedMemorySyncStores } from "./distributedMemorySyncStore";
import { resetDistributedGovernanceGuards } from "./distributedGovernanceGuards";
import { resetDistributedGovernanceStores } from "./distributedGovernanceStore";
import { resetUnifiedConsensusRuntimeGuards } from "./unifiedConsensusRuntimeGuards";
import { resetUnifiedConsensusRuntimeStores } from "./unifiedConsensusRuntimeStore";

function resetDiversityPreservationTestStacks(): void {
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
  resetConsensusIntelligenceStores();
  resetConsensusIntelligenceGuards();
  resetPerspectiveNegotiationStores();
  resetPerspectiveNegotiationGuards();
  resetPerspectiveWeightingStores();
  resetPerspectiveWeightingGuards();
  resetDistributedAdvisoryStores();
  resetDistributedAdvisoryGuards();
  resetStrategicDebateStores();
  resetStrategicDebateGuards();
  resetDiversityPreservationStores();
  resetDiversityPreservationGuards();
  resetCollectiveLearningStores();
  resetCollectiveLearningGuards();
  resetDistributedMemorySyncStores();
  resetDistributedMemorySyncGuards();
  resetDistributedGovernanceStores();
  resetDistributedGovernanceGuards();
  resetUnifiedConsensusRuntimeStores();
  resetUnifiedConsensusRuntimeGuards();
}

function minimalCognition(org = "diversity-preservation-org"): AdaptiveGovernanceIntelligenceSnapshot {
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
      "Organizational learning detects coordination strain and pattern recurrence under intensified pressure.",
    resilienceForecastLine:
      "Resilience trajectory may strengthen with intervention before fatigue accumulates.",
  };
}

function seedDiversityPreservationRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `dp-seed-${i}` },
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
  evaluateExecutiveExplainability({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 58_000,
  });
  evaluateExecutiveTrustCalibration({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 64_000,
  });
  evaluateExecutiveCognitiveResilience({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 70_000,
  });
  evaluateExecutiveCognitiveAdaptation({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 76_000,
  });
  evaluateExecutiveCognitiveGovernance({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 82_000,
  });
  evaluateUnifiedExecutiveMetaCognitionRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(organizationId),
    cognitiveGovernanceSnapshot: selectLatestExecutiveCognitiveGovernanceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 90_000,
  });
  evaluateExecutiveConsensusIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 110_000,
  });
  evaluateStrategicPerspectiveNegotiation({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 118_000,
  });
  evaluateStrategicPerspectiveWeighting({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 126_000,
  });
  evaluateDistributedExecutiveAdvisory({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 134_000,
  });
  evaluateExecutiveStrategicDebate({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 142_000,
  });
}

function diversityEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateStrategicDiversityPreservation>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(org),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(org),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(org),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(org),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("strategic diversity preservation D9:7:6", () => {
  beforeEach(() => {
    resetDiversityPreservationTestStacks();
  });

  it("generates strategic diversity snapshots when debate runtime is present", () => {
    const org = "dp-verify-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const result = evaluateStrategicDiversityPreservation(
      diversityEvalInput(org, cognition, 150_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getDiversityPreservationStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise plurality resilience with balanced perspectives", () => {
    const org = "dp-plurality-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const result = evaluateStrategicDiversityPreservation(
      diversityEvalInput(org, cognition, 151_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDiversityPreservationStore(org).getState().observations.some(
        (o) =>
          o.diversityId.includes("enterprise_plurality") ||
          o.diversitySignals.includes("distributed_reasoning_balance")
      )
    ).toBe(true);
  });

  it("detects monoculture-risk warning under excessive convergence", () => {
    const org = "dp-monoculture-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const consensus = selectLatestStrategicConsensusSnapshot(org);
    const result = evaluateStrategicDiversityPreservation(
      diversityEvalInput(org, cognition, 152_000, {
        strategicConsensusSnapshot: consensus
          ? {
              ...consensus,
              awarenessSummary: {
                ...consensus.awarenessSummary,
                dominantConsensusState: "aligned",
                perspectiveDiversityPosture: "low",
              },
              reasoningPerspectives: Object.freeze(
                consensus.reasoningPerspectives.map((p) => ({
                  ...p,
                  perspectiveWeight: 0.9,
                }))
              ),
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDiversityPreservationStore(org).getState().observations.some(
        (o) =>
          o.diversitySignals.includes("monoculture_risk_warning") ||
          o.diversitySignals.includes("governance_dominance")
      )
    ).toBe(true);
  });

  it("skips when debate depth is insufficient", () => {
    const org = "dp-isolated-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const result = evaluateStrategicDiversityPreservation(
      diversityEvalInput(org, cognition, 153_000, {
        counterfactualSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_debate_depth");
  });

  it("dedupes duplicate diversity evaluations on unchanged signature", () => {
    const org = "dp-dedupe-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const first = integrateDiversityPreservationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 154_000,
    });
    const second = integrateDiversityPreservationWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 154_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded diversity preservation memory under caps", () => {
    const org = "dp-bounded-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateStrategicDiversityPreservation(
        diversityEvalInput(org, { ...cognition, signature: `dp-bounded-${i}` }, 155_000 + i * 600)
      );
    }

    const state = getDiversityPreservationStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive diversity preservation evaluation", () => {
    expect(beginDiversityPreservationEvaluation()).toBe(true);
    expect(beginDiversityPreservationEvaluation()).toBe(true);
    expect(beginDiversityPreservationEvaluation()).toBe(false);
    endDiversityPreservationEvaluation();
    endDiversityPreservationEvaluation();
  });

  it("emits diversity preservation contract fields", () => {
    const org = "dp-contract-org";
    const cognition = minimalCognition(org);
    seedDiversityPreservationRuntime(org, cognition);

    const result = evaluateStrategicDiversityPreservation(
      diversityEvalInput(org, cognition, 156_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.diversityId.length).toBeGreaterThan(0);
    expect(observation!.pluralityState.length).toBeGreaterThan(0);
    expect(observation!.fragilityStrength.length).toBeGreaterThan(0);
    expect(observation!.diversitySignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(156_000);
    expect(selectLatestStrategicDiversitySnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
