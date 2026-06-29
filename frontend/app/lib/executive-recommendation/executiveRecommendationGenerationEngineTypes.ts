/**
 * APP-12:2 — Executive Recommendation Generation Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import type { ExecutiveRecommendationDomainKey } from "./executiveRecommendationTypes.ts";

export type RecommendationId = string;
export type RecommendationWorkspaceId = string;
export type RecommendationGenerationSessionId = string;
export type RecommendationGenerationPipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES)[number];

export type RecommendationEvidence = Readonly<{
  evidenceId: string;
  signal: string;
  rationale: string;
  sourceApp: string;
  readOnly: true;
}>;

export type RecommendationReasoning = Readonly<{
  reasoningId: string;
  approach: "deterministic_evidence_synthesis";
  summary: string;
  evaluatedRules: readonly string[];
  readOnly: true;
}>;

export type RecommendationSourceReference = Readonly<{
  sourceId: string;
  providerId: string;
  platformId: string;
  appId: string;
  recordId: string;
  sourceVersion: string;
  category: ExecutiveRecommendationDomainKey;
  readOnly: true;
}>;

export type RecommendationCandidateProvenance = Readonly<{
  originatingPlatforms: readonly string[];
  sourceRecordIds: readonly string[];
  workspaceId: RecommendationWorkspaceId;
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type RecommendationCandidate = Readonly<{
  recommendationId: RecommendationId;
  category: ExecutiveRecommendationDomainKey;
  executiveSummary: string;
  supportingEvidence: readonly RecommendationEvidence[];
  sourceReferences: readonly RecommendationSourceReference[];
  businessContext: string;
  reasoning: RecommendationReasoning;
  provenance: RecommendationCandidateProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendation = Readonly<{
  recommendationId: RecommendationId;
  category: ExecutiveRecommendationDomainKey;
  executiveSummary: string;
  supportingEvidence: readonly RecommendationEvidence[];
  sourceReferences: readonly RecommendationSourceReference[];
  businessContext: string;
  reasoning: RecommendationReasoning;
  candidate: RecommendationCandidate;
  provenance: RecommendationCandidateProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly RecommendationValidationIssue[];
  readOnly: true;
}>;

export type RecommendationGenerationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationGenerationSessionId;
  recommendations: readonly ExecutiveRecommendation[];
  candidates: readonly RecommendationCandidate[];
  registeredRecommendationIds: readonly RecommendationId[];
  skippedRecords: number;
  pipelineStages: readonly RecommendationGenerationPipelineStage[];
  generationTimestamp: string;
  readOnly: true;
}>;

export type RecommendationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  candidateCount: number;
  recommendationIds: readonly RecommendationId[];
  readOnly: true;
}>;

export type RecommendationGenerationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationGenerationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationGenerationEngineError | null;
  readOnly: true;
}>;

export type CertifiedRecommendationSourceRecordInput = Readonly<{
  sourceId: string;
  providerId: string;
  domain: ExecutiveRecommendationDomainKey;
  workspaceId: RecommendationWorkspaceId;
  platformId: string;
  appId: string;
  recordId: string;
  businessContext: string;
  summary: string;
  sourceVersion: string;
  sourceApps: readonly string[];
}>;

export type NormalizedRecommendationSourceRecord = Readonly<{
  sourceId: string;
  providerId: string;
  domain: ExecutiveRecommendationDomainKey;
  workspaceId: RecommendationWorkspaceId;
  platformId: string;
  appId: string;
  recordId: string;
  businessContext: string;
  summary: string;
  sourceVersion: string;
  sourceApps: readonly string[];
  normalizationSignature: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationGenerationRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationGenerationSessionId;
  sessionLabel: string;
  sourceRecords: readonly CertifiedRecommendationSourceRecordInput[];
  generationTimestamp?: string;
}>;

export type ExecutiveRecommendationGenerationEngineState = Readonly<{
  engineId: "executive-recommendation-generation-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredCandidateCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationGenerationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationGenerationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/2";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationGenerationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationGenerationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationGenerationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
