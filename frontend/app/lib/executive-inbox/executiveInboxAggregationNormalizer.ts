/**
 * APP-11:2 — Executive Inbox Aggregation Engine record normalizer.
 */

import type {
  CertifiedInboxSourceRecordInput,
  NormalizedInboxSourceRecord,
} from "./executiveInboxAggregationEngineTypes.ts";

function hashSignature(payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function buildNormalizationSignature(record: CertifiedInboxSourceRecordInput): string {
  const payload = [
    record.workspaceId,
    record.sourceType,
    record.platformId,
    record.appId,
    record.recordId,
    record.sourceVersion,
  ].join("|");
  return hashSignature(payload);
}

export function buildInboxItemId(workspaceId: string, sourceType: string, recordId: string): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  const signatureHash = hashSignature(`${sourceType}|${recordId}`);
  return `executive-inbox-item-${safeWorkspace}-${signatureHash}`;
}

export function normalizeInboxSourceRecord(
  input: CertifiedInboxSourceRecordInput
): NormalizedInboxSourceRecord {
  return Object.freeze({
    sourceId: input.sourceId.trim(),
    sourceType: input.sourceType,
    workspaceId: input.workspaceId.trim(),
    platformId: input.platformId.trim(),
    appId: input.appId.trim(),
    recordId: input.recordId.trim(),
    businessContext: input.businessContext.trim(),
    summary: input.summary.trim(),
    sourceVersion: input.sourceVersion.trim(),
    sourceApps: Object.freeze([...new Set(input.sourceApps.map((app) => app.trim()).filter(Boolean))]),
    normalizationSignature: buildNormalizationSignature(input),
    readOnly: true as const,
  });
}

export function normalizeInboxSourceRecords(
  records: readonly CertifiedInboxSourceRecordInput[]
): readonly NormalizedInboxSourceRecord[] {
  return Object.freeze(records.map((record) => normalizeInboxSourceRecord(record)));
}

export function sortNormalizedRecordsDeterministically(
  records: readonly NormalizedInboxSourceRecord[]
): readonly NormalizedInboxSourceRecord[] {
  return Object.freeze(
    [...records].sort((left, right) => {
      const typeCompare = left.sourceType.localeCompare(right.sourceType);
      if (typeCompare !== 0) {
        return typeCompare;
      }
      return left.recordId.localeCompare(right.recordId);
    })
  );
}

export const ExecutiveInboxAggregationNormalizer = Object.freeze({
  normalizeInboxSourceRecord,
  normalizeInboxSourceRecords,
  sortNormalizedRecordsDeterministically,
  buildInboxItemId,
  buildNormalizationSignature,
});
