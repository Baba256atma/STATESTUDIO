/**
 * APP-11:2 — Executive Inbox Aggregation Engine deterministic pipeline.
 */

import { EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES } from "./executiveInboxAggregationEngineConstants.ts";
import { buildExecutiveInboxItemsFromRecords } from "./executiveInboxAggregationItemBuilder.ts";
import {
  normalizeInboxSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveInboxAggregationNormalizer.ts";
import { registerInboxItem } from "./executiveInboxAggregationEngineRegistry.ts";
import type {
  ExecutiveInboxAggregate,
  ExecutiveInboxAggregationRequest,
  ExecutiveInboxAggregationResult,
  ExecutiveInboxAggregationSession,
  ExecutiveInboxItem,
} from "./executiveInboxAggregationEngineTypes.ts";
import {
  validateExecutiveInboxAggregationRequest,
  validateExecutiveInboxItem,
} from "./executiveInboxAggregationEngineValidation.ts";

function emptyResult(
  request: ExecutiveInboxAggregationRequest,
  reason: string,
  aggregationTimestamp: string,
  session: ExecutiveInboxAggregationSession | null = null
): ExecutiveInboxAggregationResult {
  const fallbackSession =
    session ??
    Object.freeze({
      sessionId: request.sessionId,
      workspaceId: request.workspaceId,
      label: request.sessionLabel,
      sourceTypes: Object.freeze(request.sourceTypes ?? []),
      aggregationTimestamp,
      engineVersion: "APP-11/2" as const,
      readOnly: true as const,
    });
  const aggregate = Object.freeze({
    aggregateId: `inbox-aggregate-${request.workspaceId}-${aggregationTimestamp}`,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    items: Object.freeze([]),
    itemCount: 0,
    aggregationTimestamp,
    readOnly: true as const,
  });
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    session: fallbackSession,
    aggregate,
    aggregatedItems: Object.freeze([]),
    registeredItemIds: Object.freeze([]),
    skippedRecords: 0,
    pipelineStages: EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
    aggregationTimestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveInboxItems(
  request: ExecutiveInboxAggregationRequest
): readonly ExecutiveInboxItem[] {
  const aggregationTimestamp = request.aggregationTimestamp ?? new Date(0).toISOString();
  const normalized = sortNormalizedRecordsDeterministically(normalizeInboxSourceRecords(request.sourceRecords));
  return buildExecutiveInboxItemsFromRecords(normalized, aggregationTimestamp);
}

export function aggregateExecutiveInbox(request: ExecutiveInboxAggregationRequest): ExecutiveInboxAggregationResult {
  const aggregationTimestamp = request.aggregationTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveInboxAggregationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      aggregationTimestamp
    );
  }

  const normalized = sortNormalizedRecordsDeterministically(normalizeInboxSourceRecords(request.sourceRecords));
  const items = buildExecutiveInboxItemsFromRecords(normalized, aggregationTimestamp);
  const registeredItemIds: string[] = [];
  let skippedRecords = 0;

  for (const item of items) {
    const itemValidation = validateExecutiveInboxItem(item);
    if (!itemValidation.valid) {
      return emptyResult(
        request,
        `Item validation failed: ${itemValidation.issues.map((issue) => issue.message).join("; ")}`,
        aggregationTimestamp
      );
    }
    const registration = registerInboxItem(item);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_item") {
        skippedRecords += 1;
        continue;
      }
      return emptyResult(request, registration.reason, aggregationTimestamp);
    }
    registeredItemIds.push(item.itemId);
  }

  const aggregatedItems = Object.freeze(
    registeredItemIds
      .map((itemId) => items.find((entry) => entry.itemId === itemId))
      .filter((entry): entry is ExecutiveInboxItem => entry !== undefined)
      .sort((left, right) => left.itemId.localeCompare(right.itemId))
  );

  const sourceTypes = Object.freeze(
    [...new Set(aggregatedItems.map((entry) => entry.sourceType))].sort() as ExecutiveInboxItem["sourceType"][]
  );

  const session = Object.freeze({
    sessionId: request.sessionId,
    workspaceId: request.workspaceId,
    label: request.sessionLabel.trim(),
    sourceTypes,
    aggregationTimestamp,
    engineVersion: "APP-11/2" as const,
    readOnly: true as const,
  });

  const aggregate: ExecutiveInboxAggregate = Object.freeze({
    aggregateId: `inbox-aggregate-${request.workspaceId}-${aggregationTimestamp}`,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    items: aggregatedItems,
    itemCount: aggregatedItems.length,
    aggregationTimestamp,
    readOnly: true as const,
  });

  return Object.freeze({
    success: aggregatedItems.length > 0,
    reason:
      aggregatedItems.length > 0
        ? `Aggregated ${aggregatedItems.length} executive inbox item(s) from certified sources.`
        : "No inbox items were registered from certified sources.",
    workspaceId: request.workspaceId,
    session,
    aggregate,
    aggregatedItems,
    registeredItemIds: Object.freeze(registeredItemIds),
    skippedRecords,
    pipelineStages: EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
    aggregationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxAggregationPipeline = Object.freeze({
  aggregateExecutiveInbox,
  buildExecutiveInboxItems,
  stages: EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
});
