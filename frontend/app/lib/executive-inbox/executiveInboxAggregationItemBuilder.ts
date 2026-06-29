/**
 * APP-11:2 — Executive Inbox Aggregation item builder.
 */

import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { buildInboxItemId } from "./executiveInboxAggregationNormalizer.ts";
import type {
  ExecutiveInboxItem,
  NormalizedInboxSourceRecord,
} from "./executiveInboxAggregationEngineTypes.ts";

export function buildExecutiveInboxItemFromRecord(
  record: NormalizedInboxSourceRecord,
  aggregationTimestamp: string
): ExecutiveInboxItem {
  const sourceReference = Object.freeze({
    sourceId: record.sourceId,
    sourceType: record.sourceType,
    platformId: record.platformId,
    appId: record.appId,
    recordId: record.recordId,
    sourceVersion: record.sourceVersion,
    readOnly: true as const,
  });

  const provenance = Object.freeze({
    originatingPlatform: record.platformId,
    originatingRecordId: record.recordId,
    workspaceId: record.workspaceId,
    sourceVersion: record.sourceVersion,
    aggregationVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-11/1" as const,
    sourceApps: record.sourceApps,
    readOnly: true as const,
  });

  return Object.freeze({
    itemId: buildInboxItemId(record.workspaceId, record.sourceType, record.recordId),
    sourceType: record.sourceType,
    sourceId: record.sourceId,
    workspaceId: record.workspaceId,
    businessContext: record.businessContext,
    summary: record.summary,
    sourceReference,
    provenance,
    aggregationTimestamp,
    engineVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({
      metadataVersion: "APP-11/2",
      owner: "executive-inbox-aggregation-engine",
      extensions: Object.freeze({ normalizationSignature: record.normalizationSignature }),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });
}

export function buildExecutiveInboxItemsFromRecords(
  records: readonly NormalizedInboxSourceRecord[],
  aggregationTimestamp: string
): readonly ExecutiveInboxItem[] {
  return Object.freeze(records.map((record) => buildExecutiveInboxItemFromRecord(record, aggregationTimestamp)));
}

export const ExecutiveInboxAggregationItemBuilder = Object.freeze({
  buildExecutiveInboxItemFromRecord,
  buildExecutiveInboxItemsFromRecords,
});
