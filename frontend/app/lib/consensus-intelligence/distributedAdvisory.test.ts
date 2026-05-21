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
import {
  beginDistributedAdvisoryEvaluation,
  endDistributedAdvisoryEvaluation,
  resetDistributedAdvisoryGuards,
} from "./distributedAdvisoryGuards";
import {
  getDistributedAdvisoryStore,
  resetDistributedAdvisoryStores,
} from "./distributedAdvisoryStore";
import { evaluateDistributedExecutiveAdvisory } from "./distributedAdvisoryEngine";
import { integrateDistributedAdvisoryWithCognition } from "./integrateDistributedAdvisoryWithCognition";
import { selectLatestCollectiveStrategicGuidanceSnapshot } from "./distributedAdvisorySelectors";
import { resetStrategicDebateGuards } from "./strategicDebateGuards";
import { resetStrategicDebateStores } from "./strategicDebateStore";
import { resetDiversityPreservationGuards } from "./diversityPreservationGuards";
import { resetDiversityPreservationStores } from "./diversityPreservationStore";
import { resetCollectiveLearningGuards } from "./collectiveLearningGuards";
import { resetCollectiveLearningStores } from "./collectiveLearningStore";
import { resetDistributedMemorySyncGuards } from "./distributedMemorySyncGuards";
import { resetDistributedMemorySyncStores } from "./distributedMemorySyncStore";
import { resetDistributedGovernanceGuards } from "./distributedGovernanceGuards";
import { resetDistributedGovernanceStores } from "./distributedGovernanceStore";
import { resetUnifiedConsensusRuntimeGuards } from "./unifiedConsensusRuntimeGuards";
import { resetUnifiedConsensusRuntimeStores } from "./unifiedConsensusRuntimeStore";

function resetDistributedAdvisoryTestStacks(): void {
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

function minimalCognition(org = "distributed-advisory-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

function seedDistributedAdvisoryRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `pw-seed-${i}` },
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
}

function advisoryEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateDistributedExecutiveAdvisory>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(org),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(org),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(org),
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

describe("distributed executive advisory D9:7:4", () => {
  beforeEach(() => {
    resetDistributedAdvisoryTestStacks();
  });

  it("generates collective-guidance snapshots when weighting runtime is present", () => {
    const org = "da-verify-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const result = evaluateDistributedExecutiveAdvisory(
      advisoryEvalInput(org, cognition, 134_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getDistributedAdvisoryStore(org).getState().advisories.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects collective stabilization guidance from governance-resilience alignment", () => {
    const org = "da-collective-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const result = evaluateDistributedExecutiveAdvisory(
      advisoryEvalInput(org, cognition, 135_000, { fragilityElevated: true })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDistributedAdvisoryStore(org).getState().advisories.some(
        (a) =>
          a.advisoryCategory === "governance_guidance" ||
          a.alignedGuidance.includes("governance_stabilization")
      )
    ).toBe(true);
  });

  it("detects trust-moderated orchestration guidance under uncertainty", () => {
    const org = "da-trust-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const reflective = selectLatestEnterpriseSelfReflectiveSnapshot(org);
    const result = evaluateDistributedExecutiveAdvisory(
      advisoryEvalInput(org, cognition, 136_000, {
        unifiedSelfReflectiveSnapshot: reflective
          ? {
              ...reflective,
              summary: {
                ...reflective.summary,
                uncertaintyPosture: "cautious",
                trustCalibration: "calibrating",
              },
            }
          : null,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getDistributedAdvisoryStore(org).getState().advisories.some(
        (a) =>
          a.advisoryCategory === "trust_guidance" ||
          a.advisorySignals.includes("trust_calibration_balance")
      )
    ).toBe(true);
  });

  it("skips when weighting depth is insufficient", () => {
    const org = "da-isolated-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const result = evaluateDistributedExecutiveAdvisory(
      advisoryEvalInput(org, cognition, 137_000, {
        consensusPrioritySnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_weighting_depth");
  });

  it("dedupes duplicate advisory evaluations on unchanged signature", () => {
    const org = "da-dedupe-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const first = integrateDistributedAdvisoryWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 138_000,
    });
    const second = integrateDistributedAdvisoryWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 138_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded distributed advisory memory under caps", () => {
    const org = "da-bounded-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateDistributedExecutiveAdvisory(
        advisoryEvalInput(org, { ...cognition, signature: `da-bounded-${i}` }, 139_000 + i * 600)
      );
    }

    const state = getDistributedAdvisoryStore(org).getState();
    expect(state.advisories.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive distributed advisory evaluation", () => {
    expect(beginDistributedAdvisoryEvaluation()).toBe(true);
    expect(beginDistributedAdvisoryEvaluation()).toBe(true);
    expect(beginDistributedAdvisoryEvaluation()).toBe(false);
    endDistributedAdvisoryEvaluation();
    endDistributedAdvisoryEvaluation();
  });

  it("emits distributed advisory contract fields", () => {
    const org = "da-contract-org";
    const cognition = minimalCognition(org);
    seedDistributedAdvisoryRuntime(org, cognition);

    const result = evaluateDistributedExecutiveAdvisory(
      advisoryEvalInput(org, cognition, 140_000)
    );

    expect(result.evaluated).toBe(true);
    const advisory = result.snapshot?.recentAdvisories[0];
    expect(advisory).toBeDefined();
    expect(advisory!.advisoryId.length).toBeGreaterThan(0);
    expect(advisory!.coordinationState.length).toBeGreaterThan(0);
    expect(advisory!.guidanceStrength.length).toBeGreaterThan(0);
    expect(advisory!.advisorySignals.length).toBeGreaterThan(0);
    expect(advisory!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(advisory!.generatedAt).toBe(140_000);
    expect(selectLatestCollectiveStrategicGuidanceSnapshot(org)?.recentAdvisories.length).toBeGreaterThan(
      0
    );
  });
});
