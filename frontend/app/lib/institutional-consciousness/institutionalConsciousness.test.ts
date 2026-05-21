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
import { resetConsensusIntelligenceGuards } from "../consensus-intelligence/consensusIntelligenceGuards";
import { resetConsensusIntelligenceStores } from "../consensus-intelligence/consensusIntelligenceStore";
import { evaluateExecutiveConsensusIntelligence } from "../consensus-intelligence/consensusIntelligenceEngine";
import { selectLatestStrategicConsensusSnapshot } from "../consensus-intelligence/consensusIntelligenceSelectors";
import { evaluateStrategicPerspectiveNegotiation } from "../consensus-intelligence/perspectiveNegotiationEngine";
import { resetPerspectiveNegotiationGuards } from "../consensus-intelligence/perspectiveNegotiationGuards";
import { resetPerspectiveNegotiationStores } from "../consensus-intelligence/perspectiveNegotiationStore";
import { selectLatestEnterpriseConflictResolutionSnapshot } from "../consensus-intelligence/perspectiveNegotiationSelectors";
import { evaluateStrategicPerspectiveWeighting } from "../consensus-intelligence/perspectiveWeightingEngine";
import { resetPerspectiveWeightingGuards } from "../consensus-intelligence/perspectiveWeightingGuards";
import { resetPerspectiveWeightingStores } from "../consensus-intelligence/perspectiveWeightingStore";
import { selectLatestEnterpriseConsensusPrioritySnapshot } from "../consensus-intelligence/perspectiveWeightingSelectors";
import { evaluateDistributedExecutiveAdvisory } from "../consensus-intelligence/distributedAdvisoryEngine";
import { resetDistributedAdvisoryGuards } from "../consensus-intelligence/distributedAdvisoryGuards";
import { resetDistributedAdvisoryStores } from "../consensus-intelligence/distributedAdvisoryStore";
import { selectLatestCollectiveStrategicGuidanceSnapshot } from "../consensus-intelligence/distributedAdvisorySelectors";
import { evaluateExecutiveStrategicDebate } from "../consensus-intelligence/strategicDebateEngine";
import { resetStrategicDebateGuards } from "../consensus-intelligence/strategicDebateGuards";
import { resetStrategicDebateStores } from "../consensus-intelligence/strategicDebateStore";
import { selectLatestCounterfactualReasoningSnapshot } from "../consensus-intelligence/strategicDebateSelectors";
import { resetDiversityPreservationGuards } from "../consensus-intelligence/diversityPreservationGuards";
import { resetDiversityPreservationStores } from "../consensus-intelligence/diversityPreservationStore";
import { evaluateStrategicDiversityPreservation } from "../consensus-intelligence/diversityPreservationEngine";
import { selectLatestStrategicDiversitySnapshot } from "../consensus-intelligence/diversityPreservationSelectors";
import { resetCollectiveLearningGuards } from "../consensus-intelligence/collectiveLearningGuards";
import { resetCollectiveLearningStores } from "../consensus-intelligence/collectiveLearningStore";
import { evaluateExecutiveCollectiveLearning } from "../consensus-intelligence/collectiveLearningEngine";
import { selectLatestExecutiveCollectiveLearningSnapshot } from "../consensus-intelligence/collectiveLearningSelectors";
import { resetDistributedMemorySyncGuards } from "../consensus-intelligence/distributedMemorySyncGuards";
import { resetDistributedMemorySyncStores } from "../consensus-intelligence/distributedMemorySyncStore";
import { evaluateDistributedStrategicMemorySynchronization } from "../consensus-intelligence/distributedMemorySyncEngine";
import { selectLatestMultiPerspectiveMemorySnapshot } from "../consensus-intelligence/distributedMemorySyncSelectors";
import { resetDistributedGovernanceGuards } from "../consensus-intelligence/distributedGovernanceGuards";
import { resetDistributedGovernanceStores } from "../consensus-intelligence/distributedGovernanceStore";
import { evaluateDistributedStrategicGovernance } from "../consensus-intelligence/distributedGovernanceEngine";
import { selectLatestDistributedStrategicGovernanceSnapshot } from "../consensus-intelligence/distributedGovernanceSelectors";
import { evaluateUnifiedEnterpriseConsensusRuntime } from "../consensus-intelligence/unifiedConsensusRuntimeEngine";
import { resetUnifiedConsensusRuntimeGuards } from "../consensus-intelligence/unifiedConsensusRuntimeGuards";
import { resetUnifiedConsensusRuntimeStores } from "../consensus-intelligence/unifiedConsensusRuntimeStore";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import {
  beginInstitutionalConsciousnessEvaluation,
  endInstitutionalConsciousnessEvaluation,
  resetInstitutionalConsciousnessGuards,
} from "./institutionalConsciousnessGuards";
import {
  getInstitutionalConsciousnessStore,
  resetInstitutionalConsciousnessStores,
} from "./institutionalConsciousnessStore";
import { evaluateInstitutionalConsciousness } from "./institutionalConsciousnessEngine";
import { integrateInstitutionalConsciousnessWithCognition } from "./integrateInstitutionalConsciousnessWithCognition";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

export function resetInstitutionalConsciousnessTestStacks(): void {
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
  resetInstitutionalConsciousnessStores();
  resetInstitutionalConsciousnessGuards();
}

export function minimalCognition(org = "institutional-consciousness-org"): AdaptiveGovernanceIntelligenceSnapshot {
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

export function seedInstitutionalConsciousnessRuntime(
  organizationId: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot
) {
  for (let i = 0; i < 4; i += 1) {
    evaluateInstitutionalMemoryAccumulation({
      organizationId,
      cognitionSnapshot: { ...cognition, signature: `ic-seed-${i}` },
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
  evaluateDistributedStrategicGovernance({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(organizationId),
    memorySyncSnapshot: selectLatestMultiPerspectiveMemorySnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 178_000,
  });
  evaluateUnifiedEnterpriseConsensusRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(organizationId),
    memorySyncSnapshot: selectLatestMultiPerspectiveMemorySnapshot(organizationId),
    distributedGovernanceSnapshot: selectLatestDistributedStrategicGovernanceSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    fragilityElevated: true,
    continuityPreserved: true,
    now: 188_000,
  });
}

export function institutionalConsciousnessEvalInput(
  org: string,
  cognition: AdaptiveGovernanceIntelligenceSnapshot,
  now: number,
  overrides?: Partial<Parameters<typeof evaluateInstitutionalConsciousness>[0]>
) {
  return {
    organizationId: org,
    cognitionSnapshot: cognition,
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(org),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(org),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(org),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(org),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(org),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(org),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(org),
    enterpriseNarrativeLine: cognition.organizationalLearningLine,
    resilienceForecastLine: cognition.resilienceForecastLine,
    operationalTopologyStressed: true,
    fragilityElevated: true,
    continuityPreserved: true,
    now,
    ...overrides,
  };
}

describe("institutional consciousness D9:8:1", () => {
  beforeEach(() => {
    resetInstitutionalConsciousnessTestStacks();
  });

  it("generates institutional consciousness snapshots when unified consensus is present", () => {
    const org = "ic-verify-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 190_000)
    );

    expect(result.evaluated).toBe(true);
    expect(getInstitutionalConsciousnessStore(org).getState().observations.length).toBeGreaterThan(0);
    expect(result.snapshot?.observationCount).toBeGreaterThan(0);
  });

  it("detects enterprise ecosystem awareness with macro-operational signals", () => {
    const org = "ic-ecosystem-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 191_000)
    );

    expect(result.evaluated).toBe(true);
    expect(
      getInstitutionalConsciousnessStore(org).getState().observations.some(
        (o) =>
          o.ecosystemSignals.includes("systemic_dependency_exposure") ||
          o.ecosystemSignals.includes("institutional_interconnectivity") ||
          o.ecosystemSignals.includes("macro_operational_pressure")
      )
    ).toBe(true);
  });

  it("detects external fragility propagation under ecosystem stress", () => {
    const org = "ic-fragility-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const consensus = selectLatestDistributedExecutiveCognitionSnapshot(org);
    const result = evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 192_000, {
        unifiedConsensusSnapshot: consensus
          ? { ...consensus, runtimeStatus: "fragmented" }
          : null,
        continuityPreserved: false,
      })
    );

    expect(result.evaluated).toBe(true);
    expect(
      getInstitutionalConsciousnessStore(org).getState().observations.some(
        (o) =>
          o.ecosystemSignals.includes("external_fragility_propagation") ||
          o.ecosystemSignals.includes("macro_operational_dependency_signal")
      )
    ).toBe(true);
  });

  it("skips when unified consensus runtime depth is insufficient", () => {
    const org = "ic-isolated-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 193_000, {
        unifiedConsensusSnapshot: null,
      })
    );

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("insufficient_consensus_runtime_depth");
  });

  it("dedupes duplicate institutional consciousness evaluations on unchanged signature", () => {
    const org = "ic-dedupe-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const first = integrateInstitutionalConsciousnessWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 194_000,
    });
    const second = integrateInstitutionalConsciousnessWithCognition({
      organizationId: org,
      cognitionSnapshot: cognition,
      fragilityElevated: true,
      now: 194_100,
    });

    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("paced_or_unchanged");
  });

  it("keeps bounded institutional consciousness memory under caps", () => {
    const org = "ic-bounded-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    for (let i = 0; i < 20; i += 1) {
      evaluateInstitutionalConsciousness(
        institutionalConsciousnessEvalInput(
          org,
          { ...cognition, signature: `ic-bounded-${i}` },
          195_000 + i * 600
        )
      );
    }

    const state = getInstitutionalConsciousnessStore(org).getState();
    expect(state.observations.length).toBeLessThanOrEqual(10);
    expect(state.snapshots.length).toBeLessThanOrEqual(8);
  });

  it("blocks recursive institutional consciousness evaluation", () => {
    expect(beginInstitutionalConsciousnessEvaluation()).toBe(true);
    expect(beginInstitutionalConsciousnessEvaluation()).toBe(true);
    expect(beginInstitutionalConsciousnessEvaluation()).toBe(false);
    endInstitutionalConsciousnessEvaluation();
    endInstitutionalConsciousnessEvaluation();
  });

  it("emits institutional consciousness contract fields", () => {
    const org = "ic-contract-org";
    const cognition = minimalCognition(org);
    seedInstitutionalConsciousnessRuntime(org, cognition);

    const result = evaluateInstitutionalConsciousness(
      institutionalConsciousnessEvalInput(org, cognition, 196_000)
    );

    expect(result.evaluated).toBe(true);
    const observation = result.snapshot?.recentObservations[0];
    expect(observation).toBeDefined();
    expect(observation!.institutionalAwarenessId.length).toBeGreaterThan(0);
    expect(observation!.institutionalState.length).toBeGreaterThan(0);
    expect(observation!.awarenessStrength.length).toBeGreaterThan(0);
    expect(observation!.ecosystemSignals.length).toBeGreaterThan(0);
    expect(observation!.confidence).toBeGreaterThanOrEqual(0.48);
    expect(observation!.generatedAt).toBe(196_000);
    expect(selectLatestInstitutionalConsciousnessSnapshot(org)?.recentObservations.length).toBeGreaterThan(
      0
    );
  });
});
