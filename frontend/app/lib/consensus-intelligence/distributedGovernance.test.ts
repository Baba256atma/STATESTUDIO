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
import { resetDiversityPreservationGuards } from "./diversityPreservationGuards";
import { resetDiversityPreservationStores } from "./diversityPreservationStore";
import { evaluateStrategicDiversityPreservation } from "./diversityPreservationEngine";
import { selectLatestStrategicDiversitySnapshot } from "./diversityPreservationSelectors";
import { resetCollectiveLearningGuards } from "./collectiveLearningGuards";
import { resetCollectiveLearningStores } from "./collectiveLearningStore";
import { evaluateExecutiveCollectiveLearning } from "./collectiveLearningEngine";
import { selectLatestExecutiveCollectiveLearningSnapshot } from "./collectiveLearningSelectors";
import { resetDistributedMemorySyncGuards } from "./distributedMemorySyncGuards";
import { resetDistributedMemorySyncStores } from "./distributedMemorySyncStore";
import { evaluateDistributedStrategicMemorySynchronization } from "./distributedMemorySyncEngine";
import { selectLatestMultiPerspectiveMemorySnapshot } from "./distributedMemorySyncSelectors";
import {
  beginDistributedGovernanceEvaluation,
  endDistributedGovernanceEvaluation,
  resetDistributedGovernanceGuards,
} from "./distributedGovernanceGuards";
import {
  getDistributedGovernanceStore,
  resetDistributedGovernanceStores,
} from "./distributedGovernanceStore";
import { evaluateDistributedStrategicGovernance } from "./distributedGovernanceEngine";
import { integrateDistributedGovernanceWithCognition } from "./integrateDistributedGovernanceWithCognition";
import { selectLatestDistributedStrategicGovernanceSnapshot } from "./distributedGovernanceSelectors";
import { resetUnifiedConsensusRuntimeGuards } from "./unifiedConsensusRuntimeGuards";
import { resetUnifiedConsensusRuntimeStores } from "./unifiedConsensusRuntimeStore";

function resetDistributedGovernanceTestStacks(): void {
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

function minimalCognition(org = "distributed-governance-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedDistributedGovernanceRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `dg-seed-${i}` },
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
  evaluateStrategicDiversityPreservation({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 150_000,
  });
  evaluateExecutiveCollectiveLearning({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 158_000,
  });
  evaluateDistributedStrategicMemorySynchronization({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 166_000,
  });
}

function governanceEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateDistributedStrategicGovernance>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(org),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(org),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(org),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(org),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(org),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(org),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(org),
    memorySyncSnapshot: selectLatestMultiPerspectiveMemorySnapshot(org),
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

describe("distributed strategic governance D9:7:9", () => {
  beforeEach(() => {
    resetDistributedGovernanceTestStacks();
  });

  it("generates governance snapshots when memory sync runtime is present", () => {
    const org = "dg-verify-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const result = evaluateDistributedStrategicGovernance(
      governanceEvalInput(org, cognition, 174_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getDistributedGovernanceStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise collective integrity with governance signals", () => {
    const org = "dg-integrity-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const result = evaluateDistributedStrategicGovernance(
      governanceEvalInput(org, cognition, 175_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDistributedGovernanceStore(org).getState().observations.some(
        (o) =>
          o.governanceSignals.includes("distributed_reasoning_stability") ||
          o.governanceSignals.includes("trust_preservation") ||
          o.governanceSignals.includes("strategic_memory_continuity")
      )
    ).toBe(true);
  });

  it("detects collaborative fragmentation under governance degradation", () => {
    const org = "dg-fragmentation-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const consensus = selectLatestStrategicConsensusSnapshot(org);
    const memorySync = selectLatestMultiPerspectiveMemorySnapshot(org);
    const result = evaluateDistributedStrategicGovernance(
      governanceEvalInput(org, cognition, 176_000, {
        strategicConsensusSnapshot: consensus
          ? {
              ...consensus,
              awarenessSummary: {
                ...consensus.awarenessSummary,
                dominantConsensusState: "fragmented",
              },
            }
          : null,
        memorySyncSnapshot: memorySync
          ? {
              ...memorySync,
              awarenessSummary: {
                ...memorySync.awarenessSummary,
                dominantContinuityState: "drifting",
                coherencePosture: "low",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDistributedGovernanceStore(org).getState().observations.some(
        (o) =>
          o.governanceSignals.includes("collaborative_fragmentation_emergence") ||
          o.governanceState === "fragmented"
      )
    ).toBe(true);
  });

  it("skips when memory sync depth is insufficient", () => {
    const org = "dg-isolated-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const result = evaluateDistributedStrategicGovernance(
      governanceEvalInput(org, cognition, 177_000, {
        memorySyncSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_memory_sync_depth");
  });

  it("dedupes duplicate governance evaluations on unchanged signature", () => {
    const org = "dg-dedupe-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const first = integrateDistributedGovernanceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 178_000,
    });
    const second = integrateDistributedGovernanceWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 178_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded distributed governance memory under caps", () => {
    const org = "dg-bounded-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateDistributedStrategicGovernance(
        governanceEvalInput(org, { ...cognition, signature: `dg-bounded-${i}` }, 179_000 + i * 600)
      );
    }

    const state = getDistributedGovernanceStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive distributed governance evaluation", () => {
    expect(beginDistributedGovernanceEvaluation()).toBe(true);
    expect(beginDistributedGovernanceEvaluation()).toBe(true);
    expect(beginDistributedGovernanceEvaluation()).toBe(false);
    endDistributedGovernanceEvaluation();
    endDistributedGovernanceEvaluation();
  });

  it("emits distributed governance contract fields", () => {
    const org = "dg-contract-org";
    const cognition = minimalCognition(org);
    seedDistributedGovernanceRuntime(org, cognition);

    const result = evaluateDistributedStrategicGovernance(
      governanceEvalInput(org, cognition, 180_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.governanceId.length).toBeGreaterThan(0);
    expect(observation!.governanceState.length).toBeGreaterThan(0);
    expect(observation!.integrityStrength.length).toBeGreaterThan(0);
    expect(observation!.governanceSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(180_000);
    expect(
      selectLatestDistributedStrategicGovernanceSnapshot(org)?.recentObservations.length
    ).toBeGreaterThan(0);
  });
});
