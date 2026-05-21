import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import {
  evaluateInstitutionalExperienceCorrelation,
  type InstitutionalExperienceCorrelationResult,
} from "./institutionalCorrelationEngine";
import {
  evaluateOrganizationalAdaptationMemory,
  type OrganizationalAdaptationMemoryResult,
} from "./adaptationRecoveryEngine";
import {
  evaluateInstitutionalDecisionOutcomes,
  type InstitutionalDecisionOutcomeResult,
} from "./decisionOutcomeEngine";
import {
  evaluateInstitutionalKnowledgeDistillation,
  type InstitutionalKnowledgeDistillationResult,
} from "./institutionalDistillationEngine";
import {
  evaluateInstitutionalCognitiveRecall,
  type InstitutionalCognitiveRecallResult,
} from "./institutionalRecallEngine";
import {
  evaluateInstitutionalKnowledgeContinuity,
  type InstitutionalKnowledgeContinuityResult,
} from "./institutionalContinuityEngine";
import {
  evaluateInstitutionalLearningGovernance,
  type InstitutionalLearningGovernanceResult,
} from "./institutionalGovernanceEngine";
import {
  evaluateInstitutionalLearningEvolution,
  type InstitutionalLearningEvolutionResult,
} from "./institutionalMaturityEngine";
import {
  evaluateInstitutionalMemoryAccumulation,
  type InstitutionalMemoryAccumulationResult,
} from "./institutionalMemoryEngine";
import type { EnterpriseCognitionObservationInput } from "./institutionalMemoryTypes";

/**
 * D9:2:1–D9:2:9 — Passive institutional learning pipeline (orchestrated by D9:2:10 unified runtime).
 * Does not mutate cognition snapshots or operational state.
 */
export type InstitutionalMemoryIntegrationResult = InstitutionalMemoryAccumulationResult & {
  correlation: InstitutionalExperienceCorrelationResult;
  adaptationRecovery: OrganizationalAdaptationMemoryResult;
  decisionOutcomes: InstitutionalDecisionOutcomeResult;
  knowledgeDistillation: InstitutionalKnowledgeDistillationResult;
  cognitiveRecall: InstitutionalCognitiveRecallResult;
  learningEvolution: InstitutionalLearningEvolutionResult;
  knowledgeContinuity: InstitutionalKnowledgeContinuityResult;
  learningGovernance: InstitutionalLearningGovernanceResult;
};

export function integrateInstitutionalMemoryWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
}): InstitutionalMemoryIntegrationResult {
  const memory = evaluateInstitutionalMemoryAccumulation({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
  });

  const correlation = evaluateInstitutionalExperienceCorrelation({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
  });

  const adaptationRecovery = evaluateOrganizationalAdaptationMemory({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
  });

  const decisionOutcomes = evaluateInstitutionalDecisionOutcomes({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
  });

  const knowledgeDistillation = evaluateInstitutionalKnowledgeDistillation({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
    decisionOutcomeSnapshot: decisionOutcomes.snapshot,
  });

  const cognitiveRecall = evaluateInstitutionalCognitiveRecall({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
    decisionOutcomeSnapshot: decisionOutcomes.snapshot,
    distillationSnapshot: knowledgeDistillation.snapshot,
  });

  const learningEvolution = evaluateInstitutionalLearningEvolution({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
    decisionOutcomeSnapshot: decisionOutcomes.snapshot,
    distillationSnapshot: knowledgeDistillation.snapshot,
    recallSnapshot: cognitiveRecall.snapshot,
  });

  const knowledgeContinuity = evaluateInstitutionalKnowledgeContinuity({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
    decisionOutcomeSnapshot: decisionOutcomes.snapshot,
    distillationSnapshot: knowledgeDistillation.snapshot,
    recallSnapshot: cognitiveRecall.snapshot,
    maturitySnapshot: learningEvolution.snapshot,
  });

  const learningGovernance = evaluateInstitutionalLearningGovernance({
    organizationId: params.organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    observations: params.observations ?? null,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    memorySnapshot: memory.snapshot,
    correlationSnapshot: correlation.snapshot,
    adaptationSnapshot: adaptationRecovery.snapshot,
    decisionOutcomeSnapshot: decisionOutcomes.snapshot,
    distillationSnapshot: knowledgeDistillation.snapshot,
    recallSnapshot: cognitiveRecall.snapshot,
    maturitySnapshot: learningEvolution.snapshot,
    continuitySnapshot: knowledgeContinuity.snapshot,
  });

  return {
    ...memory,
    correlation,
    adaptationRecovery,
    decisionOutcomes,
    knowledgeDistillation,
    cognitiveRecall,
    learningEvolution,
    knowledgeContinuity,
    learningGovernance,
  };
}
