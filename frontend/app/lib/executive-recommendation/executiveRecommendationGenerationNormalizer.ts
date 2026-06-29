/**
 * APP-12:2 — Executive Recommendation Generation Engine normalizer.
 */

import type {
  CertifiedRecommendationSourceRecordInput,
  NormalizedRecommendationSourceRecord,
} from "./executiveRecommendationGenerationEngineTypes.ts";

export function buildNormalizationSignature(record: CertifiedRecommendationSourceRecordInput): string {
  return [
    record.providerId,
    record.domain,
    record.workspaceId,
    record.platformId,
    record.appId,
    record.recordId,
    record.sourceVersion,
  ].join("|");
}

export function buildRecommendationId(workspaceId: string, providerId: string, recordId: string): string {
  return `executive-recommendation-${workspaceId}-${providerId}-${recordId}`.replace(/\s+/g, "-");
}

export function normalizeRecommendationSourceRecord(
  record: CertifiedRecommendationSourceRecordInput
): NormalizedRecommendationSourceRecord {
  return Object.freeze({
    sourceId: record.sourceId.trim(),
    providerId: record.providerId.trim(),
    domain: record.domain,
    workspaceId: record.workspaceId.trim(),
    platformId: record.platformId.trim(),
    appId: record.appId.trim(),
    recordId: record.recordId.trim(),
    businessContext: record.businessContext.trim(),
    summary: record.summary.trim(),
    sourceVersion: record.sourceVersion.trim(),
    sourceApps: Object.freeze([...record.sourceApps].sort()),
    normalizationSignature: buildNormalizationSignature(record),
    readOnly: true as const,
  });
}

export function normalizeRecommendationSourceRecords(
  records: readonly CertifiedRecommendationSourceRecordInput[]
): readonly NormalizedRecommendationSourceRecord[] {
  return Object.freeze(records.map((record) => normalizeRecommendationSourceRecord(record)));
}

export function sortNormalizedRecordsDeterministically(
  records: readonly NormalizedRecommendationSourceRecord[]
): readonly NormalizedRecommendationSourceRecord[] {
  return Object.freeze(
    [...records].sort((left, right) => {
      const providerCompare = left.providerId.localeCompare(right.providerId);
      if (providerCompare !== 0) {
        return providerCompare;
      }
      return left.recordId.localeCompare(right.recordId);
    })
  );
}

export const ExecutiveRecommendationGenerationNormalizer = Object.freeze({
  buildNormalizationSignature,
  buildRecommendationId,
  normalizeRecommendationSourceRecord,
  normalizeRecommendationSourceRecords,
  sortNormalizedRecordsDeterministically,
});
