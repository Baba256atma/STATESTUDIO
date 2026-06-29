/**
 * APP-12:2 — Executive Recommendation Generation evidence aggregator.
 */

import type {
  NormalizedRecommendationSourceRecord,
  RecommendationEvidence,
} from "./executiveRecommendationGenerationEngineTypes.ts";

export function aggregateRecommendationEvidence(
  record: NormalizedRecommendationSourceRecord
): readonly RecommendationEvidence[] {
  const evidence: RecommendationEvidence[] = [
    Object.freeze({
      evidenceId: `recommendation-evidence-source-${record.recordId}`,
      signal: "certified_source_record",
      rationale: record.summary,
      sourceApp: record.appId,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `recommendation-evidence-context-${record.recordId}`,
      signal: "business_context",
      rationale: record.businessContext,
      sourceApp: record.appId,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `recommendation-evidence-domain-${record.recordId}`,
      signal: "recommendation_domain",
      rationale: `Domain ${record.domain} derived from certified ${record.providerId}.`,
      sourceApp: record.appId,
      readOnly: true as const,
    }),
  ];

  for (const sourceApp of record.sourceApps.slice(0, 3)) {
    evidence.push(
      Object.freeze({
        evidenceId: `recommendation-evidence-dependency-${record.recordId}-${sourceApp}`,
        signal: "dependency_reference",
        rationale: `Certified dependency ${sourceApp} referenced for provenance.`,
        sourceApp,
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(evidence);
}

export const ExecutiveRecommendationGenerationEvidenceAggregator = Object.freeze({
  aggregateRecommendationEvidence,
});
