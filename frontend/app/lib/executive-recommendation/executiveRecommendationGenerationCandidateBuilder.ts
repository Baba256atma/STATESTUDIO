/**
 * APP-12:2 — Executive Recommendation Generation candidate builder.
 */

import { EXECUTIVE_RECOMMENDATION_DOMAIN_LABELS } from "./executiveRecommendationConstants.ts";
import { EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationGenerationEngineConstants.ts";
import { aggregateRecommendationEvidence } from "./executiveRecommendationGenerationEvidenceAggregator.ts";
import {
  buildRecommendationId,
} from "./executiveRecommendationGenerationNormalizer.ts";
import type {
  ExecutiveRecommendation,
  NormalizedRecommendationSourceRecord,
  RecommendationCandidate,
  RecommendationCandidateProvenance,
  RecommendationReasoning,
  RecommendationSourceReference,
} from "./executiveRecommendationGenerationEngineTypes.ts";

function buildDependencyVersions(sourceApps: readonly string[]): Readonly<Record<string, string>> {
  return Object.freeze(
    Object.fromEntries(sourceApps.map((appId) => [appId, `${appId}/certified`]))
  );
}

export function buildRecommendationSourceReference(
  record: NormalizedRecommendationSourceRecord
): RecommendationSourceReference {
  return Object.freeze({
    sourceId: record.sourceId,
    providerId: record.providerId,
    platformId: record.platformId,
    appId: record.appId,
    recordId: record.recordId,
    sourceVersion: record.sourceVersion,
    category: record.domain,
    readOnly: true as const,
  });
}

export function buildRecommendationReasoning(
  record: NormalizedRecommendationSourceRecord
): RecommendationReasoning {
  return Object.freeze({
    reasoningId: `recommendation-reasoning-${record.recordId}`,
    approach: "deterministic_evidence_synthesis" as const,
    summary: `Deterministic advisory candidate synthesized from certified ${record.appId} source ${record.recordId}.`,
    evaluatedRules: Object.freeze([
      "certified_source_required",
      "domain_alignment",
      "provenance_complete",
      "consumer_only_reference",
      "no_ml_inference",
    ]),
    readOnly: true as const,
  });
}

export function buildRecommendationCandidateProvenance(
  record: NormalizedRecommendationSourceRecord
): RecommendationCandidateProvenance {
  return Object.freeze({
    originatingPlatforms: Object.freeze([record.platformId]),
    sourceRecordIds: Object.freeze([record.recordId]),
    workspaceId: record.workspaceId,
    dependencyVersions: buildDependencyVersions(record.sourceApps),
    generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildExecutiveSummary(
  record: NormalizedRecommendationSourceRecord
): string {
  const label = EXECUTIVE_RECOMMENDATION_DOMAIN_LABELS[record.domain];
  return `${label} advisory candidate from ${record.appId}: ${record.summary}`;
}

export function buildRecommendationCandidateFromRecord(
  record: NormalizedRecommendationSourceRecord,
  generationTimestamp: string
): RecommendationCandidate {
  const recommendationId = buildRecommendationId(record.workspaceId, record.providerId, record.recordId);
  const supportingEvidence = aggregateRecommendationEvidence(record);
  const sourceReferences = Object.freeze([buildRecommendationSourceReference(record)]);
  const reasoning = buildRecommendationReasoning(record);
  const provenance = buildRecommendationCandidateProvenance(record);

  return Object.freeze({
    recommendationId,
    category: record.domain,
    executiveSummary: buildExecutiveSummary(record),
    supportingEvidence,
    sourceReferences,
    businessContext: record.businessContext,
    reasoning,
    provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveRecommendationFromCandidate(
  candidate: RecommendationCandidate
): ExecutiveRecommendation {
  return Object.freeze({
    recommendationId: candidate.recommendationId,
    category: candidate.category,
    executiveSummary: candidate.executiveSummary,
    supportingEvidence: candidate.supportingEvidence,
    sourceReferences: candidate.sourceReferences,
    businessContext: candidate.businessContext,
    reasoning: candidate.reasoning,
    candidate,
    provenance: candidate.provenance,
    generationTimestamp: candidate.generationTimestamp,
    engineVersion: candidate.engineVersion,
    version: candidate.version,
    readOnly: true as const,
  });
}

export function buildRecommendationCandidatesFromRecords(
  records: readonly NormalizedRecommendationSourceRecord[],
  generationTimestamp: string
): readonly RecommendationCandidate[] {
  return Object.freeze(
    records.map((record) => buildRecommendationCandidateFromRecord(record, generationTimestamp))
  );
}

export const ExecutiveRecommendationGenerationCandidateBuilder = Object.freeze({
  buildRecommendationCandidateFromRecord,
  buildRecommendationCandidatesFromRecords,
  buildExecutiveRecommendationFromCandidate,
});
